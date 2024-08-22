package module

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"
)

type ReponsePostToJS struct {
	Status  string `json:"status"`
	Message string `json:"message"`
	Post    Posts  `json:"post,omitempty"`
}

// var ErrorMessage2 string

func containsOnlySpecialChars(s string) bool {
	for _, char := range s {
		if char != ' ' && char != '\t' && char != '\\' {
			return false
		}
	}
	return true
}

var ErrorMessage2 string

func Post(w http.ResponseWriter, r *http.Request) {
	fmt.Println("In Post Function")
	if r.Method == "POST" {
		cookieUser, cookieToken, _ := Checklog(w, r)
		fmt.Println(cookieToken)

		var data Posts

		if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
			log.Printf("Error decoding request body: %v", err)
			http.Error(w, "Error decoding request body: "+err.Error(), http.StatusBadRequest)
			return
		}
		fmt.Printf("Data reveived: %v\n", data)

		fmt.Println(data.Message)

		db, err := sql.Open("sqlite3", "forum.db")
		if err != nil {
			fmt.Println(err)
			handle500(w, err)
			return
		}
		defer db.Close()
		err = db.Ping()
		if err != nil {
			fmt.Println(err)
			handle500(w, err)
			return
		}
		_, err = db.Exec(`CREATE TABLE IF NOT EXISTS posts (
				id INTEGER PRIMARY KEY AUTOINCREMENT,
				username TEXT,
				date_time TEXT,
				token TEXT,
				message TEXT,
				golang BOOLEAN,
				javascript BOOLEAN,
				python BOOLEAN,
				rust BOOLEAN,
				html_css BOOLEAN,
				angular BOOLEAN,
				autre BOOLEAN,
				like INTEGER,
				dislike INTEGER,
				image TEXT
			)`)
		if err != nil {
			fmt.Println("Error on post function :", err)
			// handle500(w, err)
			return
		}

		var img string

		// 	// Generate unique token
		token := GenerateToken()
		if previousMessage != data.Message {
			_, err = db.Exec(`INSERT INTO posts (username, date_time, token, message, golang, javascript, python, rust, html_css, angular, autre, like, dislike, image)
			VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
				cookieUser,
				time.Now().Format("2006-01-02 15:04:05"),
				token,
				data.Message,
				data.Golang,
				data.JavaScript,
				data.Python,
				data.Rust,
				data.HTML_CSS,
				data.Angular,
				data.Autre,
				0,
				0,
				img,
			)
			if err != nil {
				handle500(w, err)
				return
			}

			var lastInsertID int
			err = db.QueryRow("SELECT last_insert_rowid()").Scan(&lastInsertID)
			if err != nil {
				fmt.Println("Error retrieving last insert ID:", err)
				handle500(w, err)
				return
			}

			newPost := Posts{
				Id:         lastInsertID,
				Username:   cookieUser,
				Date:       time.Now().Format("2006-01-02 15:04:05"),
				Token:      token,
				Message:    data.Message,
				Golang:     data.Golang,
				JavaScript: data.JavaScript,
				Python:     data.Python,
				Rust:       data.Rust,
				HTML_CSS:   data.HTML_CSS,
				Angular:    data.Angular,
				Autre:      data.Autre,
				Like:       0,
				Dislike:    0,
				Image:      img,
			}
			database.Posts = append([]Posts{newPost}, database.Posts...)
			database.User.ErrorMessage = ""
			previousMessage = data.Message

			response := ReponsePostToJS{
				Status:  "success",
				Message: "Post created successfully",
				Post:    newPost,
			}
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(response)
			fmt.Println("Repsonse send")

		} else {
			ErrorMessage2 = "Message already sent"
			database.User.ErrorMessage = ErrorMessage2

			response := ReponsePostToJS{
				Status:  "error",
				Message: ErrorMessage2,
			}
			w.Header().Set("Content-Type", "application/json")
			json.NewEncoder(w).Encode(response)
			fmt.Println("Error sending the response")

		}
		// Call Index function or handle response as needed
		// http.Redirect(w, r, "index", http.StatusFound)
		fmt.Println("End post function")
	} else {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}
}
