package module

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"sync"

	"golang.org/x/crypto/bcrypt"
)

// var currentUser User_info

// Check if username/password from form is corresponding to db row
// func Log(w http.ResponseWriter, r *http.Request) {
// 	if r.Method == "POST" {
// 		var data User_info

// 		if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
// 			log.Printf("Error decoding request body: %v", err)
// 			http.Error(w, "Error decoding request body: "+err.Error(), http.StatusBadRequest)
// 			return
// 		}
// 		fmt.Println(data)

// 		db, err := sql.Open("sqlite3", "forum.db")
// 		if err != nil {
// 			fmt.Println(err)
// 			handle500(w, err)
// 			return
// 		}
// 		defer db.Close()
// 		err = db.Ping()
// 		if err != nil {
// 			fmt.Println(err)
// 			handle500(w, err)
// 			return
// 		}
// 		fmt.Println("Connected to database")
// 		usernameCheck := data.Username
// 		fmt.Println(usernameCheck)
// 		passwordCheck := data.Password
// 		row1 := db.QueryRow("SELECT username, password, Verified FROM Users WHERE username=?", usernameCheck)
// 		var username, password string
// 		var verified bool
// 		err = row1.Scan(&username, &password, &verified)
// 		fmt.Println(&password)
// 		if err != nil {
// 			if err == sql.ErrNoRows {
// 				fmt.Println("Username not found")
// 				Error2.ErrorMessage = "Wrong Username or Password"
// 				Error = append(Error, Error2)
// 				// HomeLog(w, r)
// 				return
// 			} else {
// 				fmt.Println(err)
// 				// handle500(w, err)
// 				return
// 			}
// 		}

// 		fmt.Println("Username found")
// 		err = bcrypt.CompareHashAndPassword([]byte(password), []byte(passwordCheck))
// 		fmt.Println(password)
// 		fmt.Println(passwordCheck)

// 		fmt.Println(err)
// 		if err != nil {
// 			fmt.Println("Wrong password", "BLABLA")
// 			Error2.ErrorMessage = "Wrong Username or Password"
// 			Error = append(Error, Error2)
// 			// http.Redirect(w, r, "/", http.StatusFound)
// 			return
// 		} else {
// 			filtered := false
// 			category := ""
// 			DestroyCookie(w, r)
// 			token := GenerateToken()
// 			SetCookie(w, username, token)
// 			_, err := db.Exec("UPDATE Users SET token = ?, filtered = ?, category = ? WHERE username = ?", token, filtered, category, username)
// 			if err != nil {
// 				fmt.Println(err)
// 				// handle500(w, err)
// 				return
// 			}
// 			// Get the user ID
// 			rowID := db.QueryRow("SELECT id token FROM Users WHERE username=?", username)
// 			var id int
// 			err = rowID.Scan(&id)
// 			if err != nil {
// 				fmt.Println(err)
// 				// handle500(w, err)
// 				return
// 			}
// 			// Store the id and username in the UserInfo struct
// 			database.User.Id = id
// 			database.User.Username = username
// 			database.User.Token = token
// 			database.User.Filtered = filtered
// 			database.User.Category = category
// 			// database.User.Password = password

// 			// fmt.Println(currentUser)
// 			fmt.Println(r.RequestURI, r.Method)
// 			http.Redirect(w, r, "blog", http.StatusFound)

// 			response := SuccessResponse{Message: "User registered successfully"}
// 			w.Header().Set("Content-Type", "application/json")
// 			w.WriteHeader(http.StatusOK)
// 			if err := json.NewEncoder(w).Encode(response); err != nil {
// 				http.Error(w, "Error encoding response: "+err.Error(), http.StatusInternalServerError)
// 				return
// 			}
// 			fmt.Println(username)
// 			fmt.Println(password)

// 			fmt.Println("GO TO THE BLOG !!")
// 		}
// 	}
// }

var connectedUsers = struct {
	sync.RWMutex
	m map[string]User_info
}{m: make(map[string]User_info)}

func Log(w http.ResponseWriter, r *http.Request) {
	if r.Method == "POST" {
		var data User_info
		fmt.Println("Utilisateur connecté ou pas ?", data.Connexion)

		if err := json.NewDecoder(r.Body).Decode(&data); err != nil {
			log.Printf("Error decoding request body: %v", err)
			http.Error(w, "Error decoding request body: "+err.Error(), http.StatusBadRequest)
			return
		}
		fmt.Println(data)

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
		var hashedPassword string
		err = db.QueryRow("SELECT password FROM Users WHERE username=?", data.Username).Scan(&hashedPassword)
		if err == sql.ErrNoRows {
			// Username does not match
			log.Printf("Invalid username: %v", data.Username)
			response := ErrorResponse{ErrorMessage: "Invalid username"}
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusUnauthorized) // Use appropriate status code
			json.NewEncoder(w).Encode(response)
			return
		} else if err != nil {
			// Other database error
			log.Printf("Error retrieving password: %v", err)
			http.Error(w, "Error retrieving password: "+err.Error(), http.StatusInternalServerError)
			return
		}

		// Compare the hashed password with the provided password
		err = bcrypt.CompareHashAndPassword([]byte(hashedPassword), []byte(data.Password))
		if err != nil {
			// Password does not match
			log.Printf("Invalid password for user: %v", data.Username)
			response := ErrorResponse{ErrorMessage: "Invalid password"}
			w.Header().Set("Content-Type", "application/json")
			w.WriteHeader(http.StatusUnauthorized) // Use appropriate status code
			json.NewEncoder(w).Encode(response)
			return
		}
		fmt.Println(data.Connexion)

		token := GenerateToken()
		SetCookie(w, data.Username, token)

		_, err = db.Exec("UPDATE Users SET token = ? WHERE username = ?", token, data.Username)
		if err != nil {
			log.Printf("Error updating user token : %v", err)
			http.Error(w, "Error updating user token : "+err.Error(), http.StatusInternalServerError)
			return
		}

		// Username and password match, user is authenticated
		log.Printf("User authenticated: %v", data.Username)
		// data.Connexion = true

		// Store the user connection status safely using a mutex
		connectedUsers.Lock()
		connectedUsers.m[data.Username] = data
		connectedUsers.Unlock()

		response := SuccessResponse{Message: "User authenticated successfully"}
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusOK)
		json.NewEncoder(w).Encode(response)
		fmt.Println(data.Username)
		fmt.Println("GO TO THE BLOG !!")
		if response.Message != "" {
			data.Connexion = true
		}
		fmt.Println(data.Connexion)
	}
}

// func CheckConnection(w http.ResponseWriter, r *http.Request) {
// 	connectedUsers.RLock()
// 	defer connectedUsers.RUnlock()

// 	users := make([]User_info, 0, len(connectedUsers.m))
// 	for _, user := range connectedUsers.m {
// 		users = append(users, user)
// 	}

// 	w.Header().Set("Content-Type", "application/json")
// 	json.NewEncoder(w).Encode(users)
// }
