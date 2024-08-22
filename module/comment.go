package module

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"
)

type ReponseCommentToJS struct {
	Status  string   `json:"status"`
	Message string   `json:"message"`
	Comment Comments `json:"comment,omitempty"`
}

func Comment(w http.ResponseWriter, r *http.Request) {
	cookieUser, cookieToken, _ := Checklog(w, r)
	fmt.Println(cookieToken)

	var data Comments

	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		log.Printf("Error decoding request body: %v", err)
		http.Error(w, "Error decoding request body: "+err.Error(), http.StatusBadRequest)
		return
	}

	// Verification and handle error if the format is not respected
	if r.Method == "POST" {

		// fmt.Println(r.FormValue("comment"), r.FormValue("tokenpost"))
		if data.Message_comment == "" {
			http.Redirect(w, r, "index#"+data.TokenID, http.StatusFound)
			return
		}

		if containsOnlySpecialChars(data.Message_comment) {
			// ErrorMessage4 = "Veuillez écrire un commentaire conventionnel svp..."
			// database.User.ErrorMessage4 = ErrorMessage4
			http.Redirect(w, r, "index#"+data.TokenID, http.StatusFound)
			return
		}

		fmt.Printf("Data reveived: %v\n", data)

		db, err := sql.Open("sqlite3", "forum.db")
		if err != nil {
			handle500(w, err)
			return
		}
		defer db.Close()
		err = db.Ping()
		if err != nil {
			handle500(w, err)
			return
		}
		_, err = db.Exec(`CREATE TABLE IF NOT EXISTS comments (
					id INTEGER PRIMARY KEY AUTOINCREMENT,
					username TEXT,
					date_time TEXT,
					token TEXT,
					message TEXT,
					token_comment TEXT,
					like INTEGER,
					dislike INTEGER,
					image TEXT
				)`)
		if err != nil {
			handle500(w, err)
			return
		}

		var img string

		token := GenerateToken()
		// Insert data into table
		_, err = db.Exec(`INSERT INTO comments (username, date_time, token, message, token_comment, like, dislike, image)
					VALUES (?, ?, ?, ?, ?, ?, ?,?)`,
			cookieUser,
			time.Now().Format("2006-01-02 15:04:05"),
			data.TokenID,
			data.Message_comment,
			token,
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
			return
		}

		newComment := Comments{
			Id:              lastInsertID,
			Username:        cookieUser,
			Date:            time.Now().Format("2006-01-02 15:04:05"),
			TokenComment:    data.TokenID,
			Message_comment: data.Message_comment,
			TokenID:         token,
			Like:            0,
			Dislike:         0,
			Image_comment:   img,
		}

		fmt.Println(newComment.TokenComment)
		fmt.Println(newComment.TokenID)

		database.Comments = append(database.Comments, newComment)
		database.User.ErrorMessage = ""

		response := ReponseCommentToJS{
			Status:  "success",
			Message: "Post created successfully",
			Comment: newComment,
		}
		w.Header().Set("Content-Type", "application/json")
		json.NewEncoder(w).Encode(response)
		fmt.Println("Repsonse send")

		// Call Index function or handle response as needed
		// http.Redirect(w, r, "index#"+r.FormValue("tokenpost"), http.StatusFound)
		fmt.Println("End comment function")

	} else {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}
}
