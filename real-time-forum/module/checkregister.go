package module

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"time"

	_ "github.com/mattn/go-sqlite3" // Make sure to import the SQLite driver
)

func CheckRegister(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		var data User_info

		if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
			log.Printf("Error decoding request body: %v", err)
			http.Error(w, "Error decoding request body: "+err.Error(), http.StatusBadRequest)
			return
		}

		db, err := sql.Open("sqlite3", "forum.db")
		if err != nil {
			log.Printf("Error opening database: %v", err)
			http.Error(w, "Error opening database: "+err.Error(), http.StatusInternalServerError)
			return
		}
		defer db.Close()

		err = db.Ping()
		if err != nil {
			log.Printf("Error pinging database: %v", err)
			http.Error(w, "Error pinging database: "+err.Error(), http.StatusInternalServerError)
			return
		}

		// Check if username exists
		var username string
		err = db.QueryRow("SELECT username FROM Users WHERE username=?", data.Username).Scan(&username)
		if err == nil {
			log.Printf("Username already exists: %v", data.Username)
			response := ErrorResponse{ErrorMessage: "Username already used"}
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusConflict) // Use appropriate status code
			json.NewEncoder(w).Encode(response)
			return
		} else if err != sql.ErrNoRows {
			log.Printf("Error checking username: %v", err)
			http.Error(w, "Error checking username: "+err.Error(), http.StatusInternalServerError)
			return
		}

		// Check if email exists
		var email string
		err = db.QueryRow("SELECT email FROM Users WHERE email=?", data.Email).Scan(&email)
		if err == nil {
			log.Printf("Email already exists: %v", data.Email)
			response := ErrorResponse{ErrorMessage: "Email already used"}
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusConflict) // Use appropriate status code
			json.NewEncoder(w).Encode(response)
			return
		} else if err != sql.ErrNoRows {
			log.Printf("Error checking email: %v", err)
			http.Error(w, "Error checking email: "+err.Error(), http.StatusInternalServerError)
			return
		}

		// Add user to database
		err = AddToDb(db, data)
		if err != nil {
			log.Printf("Error inserting new user: %v", err)
			http.Error(w, "Error inserting new user: "+err.Error(), http.StatusInternalServerError)
			return
		}

		// Create success response
		response := SuccessResponse{Message: "User registered successfully"}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		if err := json.NewEncoder(w).Encode(response); err != nil {
			http.Error(w, "Error encoding response: "+err.Error(), http.StatusInternalServerError)
			return
		}
	}
}

func AddToDb(db *sql.DB, data User_info) error {
	fmt.Println("Entré dans la fonction AddToDb")
	fmt.Println(data)

	addRole := "Member"

	hashpass, err := HashPass(data.Password)
	if err != nil {
		fmt.Println("Erreur hashpass")
		fmt.Println(err)
		return (err)
	}

	mailtoken := GenerateToken()
	verified := true

	_, err = db.Exec("INSERT INTO Users (username, first_name, last_name, email, age, gender, role, password, Messages, Date, Localisation, Statut, Loisirs, Date_naissance, Sexe, Verification_token, Verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", data.Username, data.Firstname, data.Lastname, data.Email, data.Age, data.Gender, addRole, hashpass, 0, time.Now().Format("2006-01-02 15:04:05"), "", "", "", "", "", mailtoken, verified)

	fmt.Println(addRole)
	fmt.Println(hashpass)
	fmt.Println(mailtoken)
	fmt.Println(verified)

	if err != nil {
		return fmt.Errorf("error inserting new user: %v", err)
	}
	return nil
}
