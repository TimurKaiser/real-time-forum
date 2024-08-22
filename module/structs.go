package module

var (
	Error     []Data
	Error2    Data
	database  Database
	user_data User_info
	// DBPosts     []Posts
	DBComments      []Comments
	Loaded          = false
	Loadcomment     = false
	Loadlike        = false
	LoadedUser      = false
	previousMessage string
	ErrorMessage3   string
	ErrorMessage4   string
	ErrorMessage5   string

	// previousUsername string
)

type Message struct {
	Type      string `json:"type"` // Corrected to match JSON key "type"
	Username  string `json:"username"`
	Text      string `json:"text"`
	Date      string `json:"date"`
	Recipient string `json:"recipient"` // Optional field to specify recipient
}

type Data struct {
	ErrorMessage string
}
type Database struct {
	User          User_info
	User_public   []User_public
	Posts         []Posts
	FilteredPosts []FilteredPosts
	Comments      []Comments
	LikE          []LikE
	DislikE       []DislikE
}

type ErrorResponse struct {
	ErrorMessage string `json:"error_message"`
}

type SuccessResponse struct {
	Message string `json:"message"`
}

type User_info struct {
	Id              int    `json:"id"`
	Username        string `json:"username"`
	Firstname       string `json:"first_name"`
	Lastname        string `json:"last_name"`
	Email           string `json:"email"`
	Gender          string `json:"gender"`
	Age             string `json:"age"`
	Role            string `json:"role"`
	Password        string `json:"password"`
	ConfirmPassword string `json:"confirmPassword"`
	Connexion       bool   `json:"connexion"`
	Token           string `json:"token"`
	ErrorMessage    string `json:"errorMessage"`
	ErrorMessage2   string `json:"errorMessage2"`
	ErrorMessage3   string `json:"errorMessage3"`
	ErrorMessage4   string `json:"errorMessage4"`
	ErrorMessage5   string `json:"errorMessage5"`
	TokenError      string `json:"tokenError"`
	Filtered        bool   `json:"filtered"`
	Category        string `json:"category"`
	Userpublic      string `json:"userpublic"`
}
type User_public struct {
	Id             int
	Username       string
	Email          string
	Firstname      string
	Lastname       string
	Role           string
	Token          string
	Date           string
	Messages       int
	Localisation   string
	Statut         string
	Loisirs        string
	Date_Naissance string
	Sexe           string
}
type Posts struct {
	Id         int    `json:"id"`
	Username   string `json:"username"`
	Date       string `json:"date"`
	Token      string `json:"token"`
	Message    string `json:"message"`
	Golang     bool   `json:"golang"`
	JavaScript bool   `json:"javascript"`
	Python     bool   `json:"python"`
	Rust       bool   `json:"rust"`
	HTML_CSS   bool   `json:"html_css"`
	Angular    bool   `json:"angular"`
	Autre      bool   `json:"autre"`
	Like       int    `json:"like"`
	Dislike    int    `json:"dislike"`
	Image      string `json:"image"`
}
type FilteredPosts struct {
	Id            int
	Username      string
	Date          string
	Token         string
	Message       string
	Golang        bool
	JavaScript    bool
	Python        bool
	Rust          bool
	HTML_CSS      bool
	Angular       bool
	Autre         bool
	Like          int
	Dislike       int
	Image         string
	ErrorMessage5 string
}

type Comments struct {
	Id              int    `json:"id"`
	Username        string `json:"username"`
	Date            string `json:"date"`
	TokenComment    string `json:"token_comment"`
	Message_comment string `json:"message_comment"`
	TokenID         string `json:"tokenID"`
	Like            int    `json:"like"`
	Dislike         int    `json:"dislike"`
	Image_comment   string `json:"image_comment"`
}
type LikE struct {
	Username string
	Token    string
}
type DislikE struct {
	Username string
	Tokens   string
}
