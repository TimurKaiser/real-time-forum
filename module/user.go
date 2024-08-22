package module

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"

	_ "github.com/mattn/go-sqlite3"
)

func User(w http.ResponseWriter, r *http.Request) {
	db, err := sql.Open("sqlite3", "forum.db")
	if err != nil {
		fmt.Println(err)
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer db.Close()

	var data User_info
	fmt.Println("IN USER FUNCTION")
	fmt.Println(data.Token)

	// var req struct {
	// 	Token string `json:"token"`
	// }
	fmt.Println("1")

	if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	fmt.Println("Decoded token:", data.Token)

	row := db.QueryRow("SELECT id, username, first_name, last_name, email FROM Users WHERE username = ?", data.Token)
	fmt.Println("2")

	var user User_info
	if err := row.Scan(&user.Id, &user.Username, &user.Firstname, &user.Lastname, &user.Email); err != nil {
		fmt.Println("3")
		if err == sql.ErrNoRows {
			fmt.Println("No user found with given token")
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusNotFound)
			json.NewEncoder(w).Encode(map[string]string{"error": "User not found"})
			fmt.Println("4")
			return
		}
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(user); err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	fmt.Println("END OF USER FUNCTION")
}
