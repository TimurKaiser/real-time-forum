import { CSSHandler } from "./setCSS.js";
import { LoadBlogTemplate } from "./blog.js";
import { LoadUserTemplate } from "./user.js";

const getIndexPage = document.getElementById("page");
const userModifInfo = `<body>
    <div class="title_user"> 
        <h1 class="your_profil_style">MODIFICATIONS DES INFORMATIONS DE VOTRE PROFIL ({{ .User.Username }})</h1>
    </div>
    <div class="container_user_profile"> 
        <div class="container_info">
            <div class="container_col">
                <div class="col_left_user_info">
                    <form action="" method="POST" class="login_form_col_left">
                        <input class="pseudo_placeholder" id="pseudo_place" value="{{ .User.Username }}" type="text" name="pseudo" required="" disabled>
                        <input class="name_placeholder" id="name_place" value="{{ .User.Lastname }}" type="text" name="name" required="" disabled>
                        <input class="firstname" id="firstname_place" value="{{ .User.Firstname }}" type="text" name="firsname" required="" disabled>
                        <input class="Email_searchbar" id="mail" value="{{ .User.Email }}" type="email" name="mail" required="" disabled>  
                    </form>
                </div>
                <div class="col_mid_user_info">
                    <form action="" method="post" class="login_form_col_mid">
                        <input class="change_pseudo_placeholder" id="pseudo_place" placeholder="CHANGER DE PSEUDO" type="text" name="change_pseudo" required="">
                        <input class="Change_Email_searchbar" id="mail" placeholder="CHANGER D'EMAIL" type="text" name="change_mail" required="">
                        <label> 
                            <input class="Change_Mot_de_passe_searchbar" placeholder="CHANGER MOT DE PASSE" type="password" id="password_change" name="change_password" required="">
                            <!-- Icons -->
                            <div class="password-icon2">
                              <i data-feather="eye" id="eye_change_password"></i>
                              <i data-feather="eye-off" id="eye-off_change_password"></i>
                            </div>
                        </label>
                        <label> 
                            <input class="Confirm_change_Mot_de_passe_searchbar" placeholder="CONFIRMATION MOT DE PASSE" type="password" id="password_change_confirmation" name="confirm_change_password" required="">
                            <!-- Icons -->
                            <div class="password-icon3">
                              <i data-feather="eye" id="eye_confirmation_change_password"></i>
                              <i data-feather="eye-off" id="eye-off_confirmation_change_password"></i>
                            </div>
                        </label>
                    </form>
                </div>
                <div class="col_right_info_form_public">
                    <div class="a_propos_details">
                        <p><h3 class="col_title_a_propos">Infos publiques</h3></p>
                    </div>
                    <form action="/checkuserpublic" method="POST" class="info-form">
                        <input name="localisation" class="Localisation" id="localisation_placehoplder" placeholder="LOCALISATION :" type="text" >
                        <input name="status" class="Status" id="status_placeholder" placeholder="EMPLOI / STATUT SOCIAL :" type="text" >
                        <input name="loisirs" class="Loisis" id="loisirs_placeholder" placeholder="LOISIRS :" type="text">
                        <input name="date_naissance" class="Date_naissance" id="date_naissance_placeholder" placeholder="DATE DE NAISSANCE :" type="text" >
                        <input name="sexe" class="Sexe" id="sexe_placeholder" placeholder="SEXE :" type="text">
                        <button class="button_to_user_modif" type="submit" >APPLIQUER CHANGEMENTS</button>
                    </form>
                </div>
            </div>
            <div class="col_under_user_info">
                <div class="back_to_blog">
                    ${/*<form action="/index" method="GET">*/ ""}
                        <button id="button_modif_backBlog" class="button_to_blog" type="submit">RETOUR AU BLOG</button>
                    ${/*</form>*/ ""}
                </div>
                <div class="back_to_user_info">
                    ${/*<form action="/user" method="GET">*/ ""}
                        <button id="button_back_userInfo" class="button_to_user_info" name="user" value="{{ .User.Id}}" type="submit"">RETOUR AU PROFIL</button>
                    ${/*</form>*/ ""}
                </div>
                <div class="modify_user_profile">
                    ${/*<form action="/checkuserpublic" method="POST">*/ ""}
                        <button class="button_to_user_modif" type="submit" >APPLIQUER CHANGEMENTS</button>
                    ${/*</form>*/ ""}
                </div>
            </div>
        </div>
    </div>
    <!-- ICON SCRIPT-->
      <script src="https://unpkg.com/feather-icons"></script>
      <script>
          feather.replace();
      </script>
    <script type="text/javascript" src="../styles/js/user_modify_profile.js"></script>
</body>`;

export function LoadUserModifInfoTemplate() {
  CSSHandler(["../styles/css/user_modify_infos.css"]);
  getIndexPage.innerHTML = userModifInfo;
  const button_to_blog = document.getElementById("button_modif_backBlog");
  const button_to_userInfo = document.getElementById("button_back_userInfo");

  button_to_blog.addEventListener("click", LoadBlogTemplate);
  button_to_userInfo.addEventListener("click", LoadUserTemplate);
}

LoadUserModifInfoTemplate();
