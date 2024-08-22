package module

import (
	"net/http"
)

func Logout(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		http.Error(w, "Invalid request method", http.StatusMethodNotAllowed)
		return
	}
	DestroyCookie(w, r)
	database.User = User_info{}
	// http.Redirect(w, r, "/", http.StatusSeeOther)
	// Respond with a success status
	w.WriteHeader(http.StatusOK)
}
