package module

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"strconv"
)

var db *sql.DB

// InitializeDB initializes the database connection and creates tables if needed.
func InitializeDB() error {
	var err error
	db, err = sql.Open("sqlite3", "forum.db")
	if err != nil {
		return fmt.Errorf("failed to open database: %v", err)
	}

	err = db.Ping()
	if err != nil {
		return fmt.Errorf("failed to connect to database: %v", err)
	}

	err = createTables()
	if err != nil {
		return fmt.Errorf("failed to create tables: %v", err)
	}

	return nil
}

// createTables creates the necessary tables in the database.
func createTables() error {
	createMessageTable := `CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        sender_id INTEGER NOT NULL,
        recipient_id INTEGER,
        message TEXT NOT NULL,
        date TEXT,
        type TEXT NOT NULL,
        FOREIGN KEY (sender_id) REFERENCES users(id),
        FOREIGN KEY (recipient_id) REFERENCES users(id) ON DELETE SET NULL
    )`

	_, err := db.Exec(createMessageTable)
	if err != nil {
		return fmt.Errorf("error creating message table: %v", err)
	}

	return nil
}

// StoreMessage stores a new message in the database.
func StoreMessage(senderID, recipientID int, date, message, messageType string) error {
	_, err := db.Exec(
		"INSERT INTO messages (sender_id, recipient_id, message,date, type) VALUES (?, ?, ?, ?, ?)",
		senderID, recipientID, message, date, messageType)
	fmt.Println(senderID)
	fmt.Println(recipientID)
	fmt.Println(message)
	fmt.Println(date)
	fmt.Println(messageType)

	return err
}

// loadChatHistory loads the chat history for a given user ID.
func loadChatHistory(userID, recipientID, limit, offset int) ([]Message, error) {
	var messages []Message

	query := `
        SELECT u.username, m.message ,m.date,
        IFNULL(r.username, '') as recipient, m.type
        FROM messages m
        JOIN users u ON m.sender_id = u.id
        LEFT JOIN users r ON m.recipient_id = r.id
        WHERE (m.sender_id = ? AND m.recipient_id = ?) 
        	OR (m.sender_id = ? AND m.recipient_id = ?)	
        ORDER BY m.date DESC
		LIMIT ? OFFSET ?
    `

	rows, err := db.Query(query, userID, recipientID, recipientID, userID, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	for rows.Next() {
		var msg Message
		var recipient sql.NullString

		err := rows.Scan(&msg.Username, &msg.Text, &msg.Date, &recipient, &msg.Type)
		if err != nil {
			return nil, err
		}

		if recipient.Valid {
			msg.Recipient = recipient.String
		} else {
			msg.Recipient = ""
		}

		messages = append(messages, msg)
	}

	for i, j := 0, len(messages)-1; i < j; i, j = i+1, j-1 {
		messages[i], messages[j] = messages[j], messages[i]
	}

	fmt.Println("First 10 messages :", messages)
	return messages, nil
}

func GetUserIDByUsername(username string) int {
	var userID int
	err := db.QueryRow("SELECT id FROM Users WHERE username = ?", username).Scan(&userID)
	if err != nil {
		log.Printf("Error fetching user ID for username %s: %v", username, err)
		return 0
	}
	return userID
}

func ChatHistoryHandler(w http.ResponseWriter, r *http.Request) {
	userIDStr := r.URL.Query().Get("user_id")
	recipientIDStr := r.URL.Query().Get("recipient_id")
	limitStr := r.URL.Query().Get("limit")
	offsetStr := r.URL.Query().Get("offset")

	userID, err := strconv.Atoi(userIDStr)
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	recipientID, err := strconv.Atoi(recipientIDStr)
	if err != nil {
		http.Error(w, "Invalid recipient ID", http.StatusBadRequest)
		return
	}

	limit := 10
	offset := 0

	if limitStr != "" {
		limit, err = strconv.Atoi(limitStr)
		if err != nil {
			http.Error(w, "Invalid limit", http.StatusBadRequest)
			return
		}
	}

	if offsetStr != "" {
		offset, err = strconv.Atoi(offsetStr)
		if err != nil {
			http.Error(w, "Invalid limit", http.StatusBadRequest)
			return
		}
	}

	messages, err := loadChatHistory(userID, recipientID, limit, offset) // Use both userID and recipientID
	if err != nil {
		http.Error(w, "Error loading chat history", http.StatusInternalServerError)
		return
	}

	response, err := json.Marshal(messages)
	if err != nil {
		http.Error(w, "Error marshalling chat history", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(response)
}

func GetUserIDHandler(w http.ResponseWriter, r *http.Request) {
	username := r.URL.Query().Get("username")
	if username == "" {
		http.Error(w, "Username is required", http.StatusBadRequest)
		return
	}

	userID := GetUserIDByUsername(username)
	if userID == 0 {
		http.Error(w, "User not found", http.StatusNotFound)
		return
	}

	response := map[string]int{"user_id": userID}
	jsonResponse, err := json.Marshal(response)
	if err != nil {
		http.Error(w, "Error marshalling response", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.Write(jsonResponse)
}
