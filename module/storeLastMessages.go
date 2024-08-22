package module

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"time"
)

type USer struct {
	Username             string    `json:"username"`
	LastMessageTimestamp time.Time `json:"lastMessageTimestamp"` // Use a pointer to handle null timestamps
}

// GetUserListWithLastMessage retrieves the user list and their last message timestamps
func GetUserListWithLastMessage(w http.ResponseWriter, r *http.Request) {
	fmt.Println("In getUserListWithLastMessage")

	// Get the logged-in user from the request (e.g., via query parameter or session)
	loggedInUsername := r.URL.Query().Get("loggedInUsername")
	if loggedInUsername == "" {
		http.Error(w, "loggedInUsername is required", http.StatusBadRequest)
		return
	}
	fmt.Println(loggedInUsername)

	loggedInUserID := GetUserIDByUsername(loggedInUsername)

	users := []USer{}

	query := `
        SELECT u.username, MAX(m.date) as last_message_date
        FROM users u
        LEFT JOIN messages m ON (
			(u.id = m.sender_id AND m.recipient_id = ?) OR
			(u.id = m.recipient_id AND m.sender_id = ?) 
		)
        GROUP BY u.username;
    `

	rows, err := db.Query(query, loggedInUserID, loggedInUserID)
	if err != nil {
		fmt.Println("Error executing query:", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	for rows.Next() {
		var user USer
		var lastMessageDateString sql.NullString // Use sql.NullString to handle NULL values

		if err := rows.Scan(&user.Username, &lastMessageDateString); err != nil {
			fmt.Println("Error scanning row:", err)
			http.Error(w, err.Error(), http.StatusInternalServerError)
			return
		}

		// If the last message date is not null, parse it into a time.Time value
		if lastMessageDateString.Valid {
			parsedTime, err := time.Parse("2006-01-02 15:04:05", lastMessageDateString.String)
			if err != nil {
				fmt.Println("Error parsing date:", err)
				http.Error(w, err.Error(), http.StatusInternalServerError)
				return
			}
			user.LastMessageTimestamp = parsedTime
		}

		users = append(users, user)
		fmt.Println("User appended:", user)
	}

	if err = rows.Err(); err != nil {
		fmt.Println("Error during rows iteration:", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	err = json.NewEncoder(w).Encode(users)
	if err != nil {
		fmt.Println("Error encoding JSON:", err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	fmt.Println("Successfully sent users list")
}
