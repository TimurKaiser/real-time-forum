import { CSSHandler } from "./setCSS.js";
import { LoadUserPublicTemplate } from "./user_public_profile.js";
import { LoadUserModifInfoTemplate } from "./user_modify_infos.js";
import { LogoutUSer } from "./blog.js";
import { LoadBlogTemplate } from "./blog.js";

// import { listCookies } from "./blog.js";

const getIndexPage = document.getElementById("page");
const userTemplate = `<body>
    <div class="title_user"> 
        <h1 id="title_username" class="your_profil_style"></h1>
            <div class="buttonDiv">
            <button id="button_exit" type="submit" name="username"><img src="/styles/img/exit.png" id="exit" alt="Exit"></button>
        </div>
    </div>
    <div class="container_user_profile"> 
        <div class="container_info">
            <div class="container_col">
                <div class="col_left_user_info">
                    <div class="login_form_col_left">
                        <input class="pseudo_placeholder" id="pseudo_place" type="text" name="pseudo" required="" disabled>
                        <input class="name_placeholder" id="name_place" type="text" name="name" required="" disabled>
                        <input class="firstname" id="firstname_place" type="text" name="firsname" required="" disabled>
                        <input class="Email_searchbar" id="mail" type="text" name="mail" required="" disabled>
                    </div>
                </div>
                <div class="col_right_user_info">
                      ${
                        /*<form action="/historic_created_post" method="post">*/ ""
                      }
                        <button class="button_user_history_created_post"  name="histo" value="{{ .User.Id}}" type="submit">HISTORIQUE DES POSTS CREES</button>
                        ${/*<</form>*/ ""}
                      ${
                        /*<form action="/historic_liked_posts" method="POST">*/ ""
                      }
                        <button class="button_user_history_liked_post" type="submit">HISTORIQUE DES POSTS AIMES</button>
                        ${/*<</form>*/ ""}
                        ${
                          /*<<!-- <form action="/historic_comments" method="POST">*/ ""
                        }
                        <button class="button_user_comments" type="submit">HISTORIQUE DES COMMENTAIRES</button>
                        ${/*<</form> -->*/ ""}
                </div>
            </div>
            <div class="col_under_user_info">
                <div class="back_to_blog">
                    ${/*<form action="/index" method="get">*/ ""}
                        <button id="user_button_to_blog" class="button_to_blog" type="submit">RETOUR AU BLOG</button>
                    ${/*</form>*/ ""}
                </div>
                <div class="back_to_user_public_profile">
                    ${/*<form action="/user_public_profile" method="get">*/ ""}
                        <button id="button_public_profile" class="button_to_public_profile" name="userpublic" value="{{.User.Username}}" type="submit">PROFIL PUBLIC</button>
                    ${/*</form>*/ ""}
                </div>
                <div class="modify_user_profile">
                    $ ${
                      /*<form action="modify_user_profile" method="POST">*/ ""
                    }
                        <button id="button_userModif" class="button_to_user_modif" name="user" value="{{ .User.Id}}"type="submit" >MODIFIER VOTRE PROFIL</button>
                    ${/*</form>*/ ""}
                </div>
            </div>
        </div>
    </div>
    <!-- ICON SCRIPT -->
    <script src="https://unpkg.com/feather-icons"> 
    </script>
    <script>
      feather.replace();
    </script>
    <script type="text/javascript" src="../styles/js/test.js"></script>
</body>`;

let cookie = "";
let userName = "";

function listCookies() {
  var theCookies = document.cookie.split(";");
  for (var i = 0; i < theCookies.length; i++) {
    cookie = theCookies[i].split("=")[0].trim(); // Get the cookie name and trim any extra spaces
    userName = cookie;
  }
  console.log(cookie);
}
export function LoadUserTemplate() {
  console.log("USER FUNC");
  CSSHandler(["../styles/css/user.css"]);
  listCookies();
  getIndexPage.innerHTML = userTemplate;
  const button_to_blog_user = document.getElementById("user_button_to_blog");
  const button_publicProfile = document.getElementById("button_public_profile");
  const button_userModif = document.getElementById("button_userModif");
  const title_username = document.getElementById("title_username");
  const exitButton = document.getElementById("button_exit");

  exitButton.addEventListener("click", LogoutUSer); // Ne s'affiche pas mais affiche le nom du cookie
  button_to_blog_user.addEventListener("click", LoadBlogTemplate);
  button_publicProfile.disabled = true;
  button_userModif.disabled = true;

  fetch("http://localhost:8003/userInfo", {
    method: "POST",
    body: JSON.stringify({ token: cookie }), // Replace with actual token
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      return response.json();
    })
    .then((data) => {
      // Handle received data (update DOM, etc.)
      console.log("Data received:", data);
      console.log(data.id);
      console.log(data.username);
      console.log(data.last_name);
      console.log(data.first_name);
      console.log(data.email);

      title_username.innerText = `VOTRE PROFIL : ${data.username}`;

      const input_pseudo = (document.getElementById(
        "pseudo_place"
      ).value = `${data.username}`);
      const input_lastName = (document.getElementById(
        "name_place"
      ).value = `${data.last_name}`);
      const input_firstName = (document.getElementById(
        "firstname_place"
      ).value = `${data.first_name}`);
      const input_mail = (document.getElementById(
        "mail"
      ).value = `${data.email}`);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

window.addEventListener("beforeunload", (event) => {
  // This will trigger LogoutUser when the page is refreshed or closed
  LogoutUSer();
});
