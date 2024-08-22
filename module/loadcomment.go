package module

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
)

func LoadComment(w http.ResponseWriter, r *http.Request) {
	fmt.Println("In LOADCOMMENTS !")

	var data string

	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		log.Printf("Error decoding request body: %v", err)
		http.Error(w, "Error decoding request body: "+err.Error(), http.StatusBadRequest)
		return
	}
	fmt.Println("data", data)

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
	rows, err := db.Query("SELECT * FROM comments WHERE token=?", data)
	if err != nil {
		fmt.Println("Error querying database comments:", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var comments []Comments
	for rows.Next() {
		var comment Comments
		err := rows.Scan(&comment.Id, &comment.Username, &comment.Date, &comment.TokenID, &comment.Message_comment, &comment.TokenComment, &comment.Like, &comment.Dislike, &comment.Image_comment)
		// fmt.Println(comment.Id)
		fmt.Println(comment.TokenID)
		fmt.Println("Entre deux")
		fmt.Println(comment.TokenComment)

		if err != nil {
			fmt.Println("Error scanning row : ", err)
			http.Error(w, "Internal server error", http.StatusInternalServerError)
			return
		}
		comments = append(comments, comment)
		// fmt.Println(comments)

	}
	if err := rows.Err(); err != nil {
		fmt.Println("Error iterating over rows:", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	jsonBytes, err := json.Marshal(comments)
	if err != nil {
		fmt.Println("Error marchaling JSON comments", err)
		http.Error(w, "Internal server error", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(jsonBytes)
	fmt.Println("comments", comments)
	fmt.Println("End LDC!!!")
}
