package module

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

// func LoadPost() {
// 	fmt.Println("In LAODPOST !")
// 	db, err := sql.Open("sqlite3", "forum.db")
// 	if err != nil {
// 		fmt.Println(err)
// 		os.Exit(1)
// 	}
// 	defer db.Close()
// 	err = db.Ping()
// 	if err != nil {
// 		fmt.Println(err)
// 		os.Exit(2)
// 	}
// 	fmt.Println("Connected to database")
// 	rows, err := db.Query("SELECT * FROM posts")
// 	if err != nil {
// 		return
// 	}
// 	defer rows.Close()
// 	for rows.Next() {
// 		var post Posts
// 		err := rows.Scan(&post.Id, &post.Username, &post.Date, &post.Token, &post.Message, &post.Golang, &post.JavaScript, &post.Python, &post.Rust, &post.HTML_CSS, &post.Angular, &post.Autre, &post.Like, &post.Dislike, &post.Image)
// 		if err != nil {
// 			fmt.Println(err)
// 			os.Exit(1)
// 		}
// 		// database.Posts = append([]Posts{post}, database.Posts...)
// 		jsonBytes, err := json.Marshal(post)
// 		if err != nil {
// 			fmt.Println("Error marshaling JSON:", err)
// 			return
// 		}

// 		fmt.Println(string(jsonBytes))
// 	}
// 	if err := rows.Err(); err != nil {
// 		os.Exit(3)
// 	}
// }

func LoadPost(w http.ResponseWriter, r *http.Request) {
	fmt.Println("In LOADPOST !")

	db, err := sql.Open("sqlite3", "forum.db")
	if err != nil {
		fmt.Println(err)
		os.Exit(1)
	}
	defer db.Close()

	err = db.Ping()
	if err != nil {
		fmt.Println("Error pinging database : ", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	fmt.Println("Connected to database")

	rows, err := db.Query("SELECT * FROM posts")
	if err != nil {
		fmt.Println("Error querying database:", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	defer rows.Close()

	var posts []Posts
	for rows.Next() {
		var post Posts
		err := rows.Scan(&post.Id, &post.Username, &post.Date, &post.Token, &post.Message, &post.Golang, &post.JavaScript, &post.Python, &post.Rust, &post.HTML_CSS, &post.Angular, &post.Autre, &post.Like, &post.Dislike, &post.Image)
		if err != nil {
			fmt.Println("Error scanning row : ", err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}
		posts = append(posts, post)
	}
	if err := rows.Err(); err != nil {
		fmt.Println("Error iterating over rows:", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	// database.Posts = append([]Posts{post}, database.Posts...)
	jsonBytes, err := json.Marshal(posts)
	if err != nil {
		fmt.Println("Error marshaling JSON:", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonBytes)
	fmt.Println("END LDP!")
}
