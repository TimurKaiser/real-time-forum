import { CheckRegister } from "./checkRegister.js";
import { LoadInitialTemplate } from "./login.js";
import { CSSHandler } from "./setCSS.js";

// const connexionButton = document.getElementById("connexion_button");
const getIndexPage = document.getElementById("page");
const registertemplate = `<body> 
     <div class="back">
        <div class="neon" <B>Z01 FORUM</B>
        </div>
        ${
          /*{{range .}}
        {{if .ErrorMessage}}
        <div class="error_message">{{ .ErrorMessage}}</div>
        {{end}}
      {{end}}*/ ""
        }
        <div class="error_message" id="error_message">
        </div>
        <div class="connexion">
            <div class="info_register">
              <input name="register[]" class="Pseudo_searchbar" id="pseudo_searchbar" placeholder="PSEUDO" type="text" name="pseudo">
              <input name="register[]" class="FirstName_searchbar" id="FirstName_searchbar" placeholder="PRENOM" type="text" name="prénom">
              <input name="register[]" class="Name_searchbar" id="name_searchbar" placeholder="NOM" type="text" name="nom"=>
              <input name="register[]" class="Email_searchbar" id="mail" placeholder="EMAIL" type="email" name="mail">
              <input name="register[]" class="Age_searchbar" id="age" placeholder="AGE" type="text" name="age">
              <input name="register[]" class="Gender_searchbar" id="gender" placeholder="GENDER" type="text" name="gender">

              <!-- Password field -->
              <label> 
                <input name="register[]" class="Mot_de_passe_searchbar" placeholder="MOT DE PASSE" type="password" id="password" name="password">
                <!-- Icons -->
                <div class="password-icon">
                  <i data-feather="eye" id="eye"></i>
                  <i data-feather="eye-off" id="eye-off"></i>
                </div>
              </label>
              <!-- Confirmation Password field -->
              <label> 
                <input name="register[]" class="Confirmation_Mot_de_passe_searchbar" placeholder="CONFIRMATION MOT DE PASSE" type="password" id="password_confirmation" name="password_Confirmation" required>
                <!-- Icons -->
                <div class="password-icon2">
                  <i data-feather="eye" id="eye_confirmation"></i>
                  <i data-feather="eye-off" id="eye-off_confirmation"></i>
                </div>
              </label>
              <button id="connexion_button">
                S'ENREGISTRER
              </button>
              <button id="back_to_login">
                TO LOGIN
              </button>
        </div>
        </div>
    </div>
      <!-- ICON SCRIPT-->
      <script src="https://unpkg.com/feather-icons"></script>
      <script>
          feather.replace();
      </script>
      <script src="../styles/js/test.js"></script>
</body>`;

export function LoadRegisterTemplate() {
  CSSHandler(["../styles/css/register.css"]);
  getIndexPage.innerHTML = registertemplate;

  const backToLog = document.getElementById("back_to_login");
  backToLog.addEventListener("click", () => {
    LoadInitialTemplate();
  });

  const RegButton = document.getElementById("connexion_button");
  RegButton.addEventListener("click", function () {
    // CheckRegister();
    if (CheckRegister()) {
      LoadInitialTemplate();
    } else {
      LoadRegisterTemplate();
    }
  });
}
