import { LoadRegisterTemplate } from "./register.js";
import { ToTitle } from "./checkRegister.js";
import { LoadBlogTemplate } from "./blog.js";
import { CSSHandler } from "./setCSS.js";

const logtemplate = ` <body>
    <div class="back">
      <div class="title">
        <h1 class="neon"><b> Z01 FORUM</b></h1>
      </div>
      <!-- <div class="mail_verif_div"> -->
      <!-- <button class="comment_button" type="submit">Commentaire</button> -->
      <!-- <a href="#.Mail_Verif" class="link_a_demo">Mail_verif</a>
          <div id=".Mail_Verif" class="modal">
              <div class="modal_content">    
                  <h2 class="Email_message_verif">A validation mail has been sent to your address <br> please check it before log in</h2>
                    <a href="#" class="modal_close">&times;</a>
              </div>  
          </div>            
      </div> -->
      <div class="connexion">
          <div class="info_login">
            <input
              name="log[]"
              class="Email_searchbar"
              id="mail"
              placeholder="PSEUDO"
              type="text"
              name="mail"
              required=""
            />
            <!-- Updated Password Section -->
            <label>
              <!-- CHAMP DE FORMULAIRE-->
              <input
                name="log[]"
                class="Mot_de_passe_searchbar"
                placeholder="MOT DE PASSE"
                type="password"
                id="password"
                name="password"
                required=""
              />
              <!-- Icônes-->
              <div class="password-icon">
                <i data-feather="eye" class="feather-eye"></i>
                <i data-feather="eye-off" class="feather-eye-off"></i>
              </div>
            </label>
            <button id="log_button" class="connexion_button">
              SE CONNECTER
            </button>
          </div>
        <div class="div_connexion_button">
          <button id="connexion_button" class="connexion_button" type="submit" value="submit">CREER UN COMPTE </button>
          ${
            /*{{range .}} 
          {{if .ErrorMessage}}
            <div class="error_message">{{ .ErrorMessage}}</div>
          {{end}} 
          {{end}}*/ ""
          }
          <div class="error_message" id="error_message">
          </div>
        </div>

        <div class="other_connexion">
          <div class="github_link">
            <a href="#">
              <img class="image_github" src="../styles/img/github.svg" />
            </a>
          </div>
          <div class="google_link">
            <a href="#">
              <img class="image_google" src="../styles/img/google.svg" />
            </a>
          </div>
        </div>
      </div>
    </div>
    <!-- ICON SCRIPT -->
    <script src="https://unpkg.com/feather-icons"></script>
    <script>
      feather.replace();
    </script>
    <script type="text/javascript" src="../styles/js/test.js"></script>
  </body>`;

export function LoadInitialTemplate() {
  CSSHandler(["../styles/css/login.css"]);
  const getIndexPage = document.getElementById("page");
  getIndexPage.innerHTML = logtemplate;
  const connexionButton = document.getElementById("connexion_button");
  connexionButton.addEventListener("click", LoadRegisterTemplate);
  LogToBlog();
}

// Call the function to load the initial template when the script runs
// LoadInitialTemplate();

export function LogToBlog() {
  const button_log = document.getElementById("log_button");

  button_log.addEventListener("click", async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    const inputPseudo = document.getElementById("mail").value;
    const inputPassword = document.getElementById("password").value;
    const errorMessage = document.getElementById("error_message");

    if (inputPseudo === "" || inputPassword === "") {
      errorMessage.innerHTML = "Missing informations !";
      console.log("Il manque des informations !");
      // alert("Il manque des informations !");

      return;
    }

    const dataLog = {
      username: ToTitle(inputPseudo),
      password: inputPassword,
    };

    console.log("Pseudo: ", dataLog.username);
    console.log("Password: ", dataLog.password);

    try {
      const response = await fetch("http://localhost:8003/logData", {
        method: "POST",
        body: JSON.stringify(dataLog),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      });

      const log = await response.json();
      console.log("Data received:", log);

      // Check if the login was successful based on the message
      if (log.message === "User authenticated successfully") {
        console.log("HELOOOOOOOOOOOOOOOOOOOOOOO");
        LoadBlogTemplate();
      } else {
        console.log("Login failed: ", log.message); // Display error message
        // alert("Username or password is wrong (or both).."); // Optionally show an alert to the user
        errorMessage.innerHTML = "Username or password is wrong";
      }
    } catch (error) {
      console.log("Error:", error);
    }
  });
}

// Function to dynamically load scripts
function loadScript(src, callback) {
  const script = document.createElement("script");
  script.src = src;
  script.onload = callback;
  document.body.appendChild(script);
}

// Function to load the appropriate page based on the saved state
function loadPage(page) {
  localStorage.setItem("currentPage", page);
  switch (page) {
    case "login":
      LoadInitialTemplate();
      break;
    case "register":
      loadScript("./register.js", LoadRegisterTemplate);
      break;
    case "blog":
      loadScript("./blog.js", LoadBlogTemplate);
      break;
    default:
      LoadInitialTemplate();
      break;
  }
}

// Store the current page before unload
window.addEventListener("beforeunload", function () {
  const currentPage = localStorage.getItem("currentPage") || "login";
  localStorage.setItem("currentPage", currentPage);
});

// Load the initial content based on the saved state
document.addEventListener("DOMContentLoaded", function () {
  const savedPage = localStorage.getItem("currentPage") || "login";
  loadPage(savedPage);
});

// Initial load
loadPage("login");
