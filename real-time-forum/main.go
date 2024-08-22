package main

import (
	"database/sql"
	"fmt"
	"log"
	"net/http"
	"time"

	"forum/module"

	"github.com/gorilla/websocket"
	_ "github.com/mattn/go-sqlite3"
)

var db *sql.DB

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

var (
	clients   = make(map[*websocket.Conn]bool)
	users     = make(map[string]*websocket.Conn)
	broadcast = make(chan module.Message)
)

func handleConnections(w http.ResponseWriter, r *http.Request) {
	ws, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Fatal(err)
	}
	defer ws.Close()

	// Initially read the first message for user setup
	var msg module.Message
	err = ws.ReadJSON(&msg)
	if err != nil {
		log.Printf("error: %v", err)
		delete(clients, ws)
		return
	}

	username := msg.Username
	clients[ws] = true
	users[username] = ws

	defer func() {
		delete(clients, ws)
		delete(users, username)
		broadcastUserList() // Broadcast updated user list on disconnection
	}()

	broadcastUserList() // Broadcast updated user list on connection

	// Start the main loop to handle incoming messages
	for {
		err := ws.ReadJSON(&msg)
		if err != nil {
			log.Printf("error: %v", err)
			delete(clients, ws)
			break
		}

		if msg.Type == "" || msg.Type == "users" {
			msg.Type = "message"
		}

		msg.Date = time.Now().Format("2006-01-02 15:04:05")

		// Broadcast the message to be handled
		broadcast <- msg
	}
}

func handleMessages() {
	for {
		msg := <-broadcast

		log.Printf("Handling message from %s: %s", msg.Username, msg.Text)
		fmt.Println("msg.Date HDLC :", msg.Date)

		senderID := module.GetUserIDByUsername(msg.Username)
		var recipientID int
		if msg.Recipient != "" {
			recipientID = module.GetUserIDByUsername(msg.Recipient)
		}

		// Store the message only here, after it has been broadcast
		err := module.StoreMessage(senderID, recipientID, msg.Date, msg.Text, msg.Type)
		if err != nil {
			log.Printf("Error storing message: %v", err)
		}

		// Handle message broadcasting
		if msg.Type == "users" {
			broadcastUserList()
		} else {
			if msg.Recipient != "" {
				// Private message system
				if recipientConn, ok := users[msg.Recipient]; ok {
					err := recipientConn.WriteJSON(msg)
					if err != nil {
						log.Printf("error: %v", err)
						recipientConn.Close()
						delete(clients, recipientConn)
					}
				} else {
					log.Printf("User %s not connected", msg.Recipient)
				}
			} else {
				for client := range clients {
					err := client.WriteJSON(msg)
					if err != nil {
						log.Printf("error: %v", err)
						client.Close()
						delete(clients, client)
					}
				}
			}
		}
	}
}

func getUserList() ([]string, error) {
	var users []string

	db, err := sql.Open("sqlite3", "forum.db")
	if err != nil {
		log.Printf("Error opening database: %v", err)
		return users, nil
	}
	defer db.Close()

	rows, err := db.Query("SELECT username FROM Users")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	for rows.Next() {
		var username string
		if err := rows.Scan(&username); err != nil {
			return nil, err
		}
		users = append(users, username)
	}

	if err := rows.Err(); err != nil {
		return nil, err
	}

	return users, nil
}

// Function to broadcast the list of users and indicate who is connected
func broadcastUserList() {
	allUsers, err := getUserList()
	if err != nil {
		log.Println("Error getting user list:", err)
		return
	}

	userListMessage := struct {
		Type      string   `json:"type"`
		Users     []string `json:"users"`
		Connected []string `json:"connected"`
	}{
		Type:      "users",
		Users:     allUsers,
		Connected: getConnectedUserList(),
	}

	for client := range clients {
		err := client.WriteJSON(userListMessage)
		if err != nil {
			log.Printf("error: %v", err)
			client.Close()
			delete(clients, client)
		}
	}
}

// Function to get a list of currently connected users
func getConnectedUserList() []string {
	var connectedUsers []string
	for username := range users {
		connectedUsers = append(connectedUsers, username)
	}
	return connectedUsers
}

func CloseDB() error {
	if db != nil {
		return db.Close()
	}
	return nil
}

const (
	colorYellow = "\033[33m"
	colorGreen  = "\033[32m"
	colorRed    = "\033[31m"
)

// Start the server at the port :5657
func main() {
	err := module.InitializeDB()
	if err != nil {
		log.Fatalf("Failed to initialize database: %v", err)
	}
	defer func() {
		if err := CloseDB(); err != nil {
			log.Printf("Failed to close database: %v", err)
		}
	}()

	fs := http.FileServer(http.Dir("styles"))
	http.Handle("/styles/", http.StripPrefix("/styles/", fs))
	// Load the structs from forum.db
	// if !module.LoadedUser {
	// 	module.LoadUser()
	// 	module.LoadedUser = true
	// }
	// if !module.Loaded {
	// 	module.LoadPost()
	// 	module.Loaded = true
	// }
	// if !module.Loadcomment {
	// 	module.LoadComment()
	// 	module.Loadcomment = true
	// }
	if !module.Loadlike {
		module.LoadLike()
		module.Loadlike = true
	}
	http.HandleFunc("/", module.HomeLog)
	// Actions posts, comments, like, filter, login, logout functions
	http.HandleFunc("/filter", module.Filter)
	http.HandleFunc("/like", module.Like)
	http.HandleFunc("/dislike", module.Like)
	http.HandleFunc("/commentlike", module.CommentLike)
	http.HandleFunc("/commentdislike", module.CommentLike)

	http.HandleFunc("/chat_history", module.ChatHistoryHandler)

	http.HandleFunc("/get_user_id", module.GetUserIDHandler)

	http.HandleFunc("/get_user_list_with_last_message", module.GetUserListWithLastMessage)

	http.HandleFunc("/commentData", module.Comment)

	http.HandleFunc("/postData", module.Post)

	// http.HandleFunc("/loadDataConnection", module.CheckConnection)

	http.HandleFunc("/logout", module.Logout)
	// Loading page functions

	// http.HandleFunc("/login", module.Log)
	http.HandleFunc("/logData", module.Log)

	http.HandleFunc("/registerform", module.RegisterPage)

	// http.HandleFunc("/submitregister", module.CheckRegister)
	http.HandleFunc("/registerData", module.CheckRegister)

	http.HandleFunc("/index", module.Index)

	http.HandleFunc("/invite", module.Index)

	http.HandleFunc("/userInfo", module.User)

	http.HandleFunc("/about", module.About)

	http.HandleFunc("/loadPostData", module.LoadPost)

	http.HandleFunc("/loadPostComment", module.LoadComment)

	http.HandleFunc("/modify_user_profile", module.Modify_data_user)
	http.HandleFunc("/user_public_profile", module.PublicUserPage)
	http.HandleFunc("/historic_created_post", module.Historic_created_post)
	http.HandleFunc("/historic_liked_posts", module.Historic_liked_post)
	http.HandleFunc("/historic_comments", module.Historic_comments)
	http.HandleFunc("/publicuserpageModify", module.PublicUserPageModify)
	// http.HandleFunc("/verify", module.VerifyMail)

	http.HandleFunc("/ws", handleConnections)
	go handleMessages()

	// Print main information into terminal when server is starting
	fmt.Println(string(colorYellow), "Starting local Server ...")
	fmt.Println(string(colorGreen), "Server ready on http://localhost:8003")
	fmt.Println(string(colorRed), "To stop  the program: Ctrl + C")
	srv := &http.Server{
		Addr:              "localhost:8003",
		ReadHeaderTimeout: 15 * time.Second,
		ReadTimeout:       15 * time.Second,
		WriteTimeout:      10 * time.Second,
		IdleTimeout:       30 * time.Second,
	}
	if err := srv.ListenAndServe(); err != nil {
		log.Fatal(err)
	}
}
