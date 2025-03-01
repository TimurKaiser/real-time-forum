import { CSSHandler } from "./setCSS.js";
import { LoadBlogTemplate } from "./blog.js";

const getIndexPage = document.getElementById("page");
const userPublicTemplate = `<body>
        {{ $user := .User.Userpublic}}
        {{range .User_public}}
        {{if eq $user .Username}}
        <div class="title_user">
            <h1 class="your_profil_style">PROFIL PUBLIC DE {{ .Username }} </h1>
        </div>
        <div class="container_user_profile">
            <div class="container_info">
                <div class="container_both_part_right_left">
                    <div class="container_part_left">
                        <!-- 
                        <div class="container_all_info_left">
                             -->
                            <div class="avatar">
                                <div class="image_place">
                                    <img src="../styles/img/img_user.png">
                                </div>
                                <form action="/photo-profil_test.html" method="get" class="login_form_col_left">
                                    <button class="button_choose_img" type="submit">Choisir image</button>
                                </form>
                                <form action="" method="post" class="login_form_col_left">
                                    <input class="status_placeholder" id="status" value="{{.Role}}" type="text" name="status" required="">
                                </form>
                            </div>
                            <div class="contact_details">
                                <h3 class="col_title">CONTACT</h3>
                                
                                <form action="" method="post" class="login_form_col_left">
                                    <input class="Email_placeholder" id="mail" value="{{.Email}}" type="text" name="mail" disabled>
                                </form>        
                            </div>
                            <!-- 
                        </div>
                         -->
                    </div>
                    <div class="container_part_right">
                        <div class="a_propos_details">
                            <p>
                                <h3 class="col_title_a_propos">A PROPOS</h3>
                            </p>
                        </div>
                        <div class="info_formulaire_a_propos">
                            <!-- 
                            <form action="/login" method="post" class="login-form">
                                <input class="Inscription" id="inscription_placeholder" placeholder="INSCRIT LE :" type="text" name="inscription">
                                <input class="All_messages" id="all_messages_placeholder" placeholder="VOIR TOUS LES MESSAGES :" type="text" name="all_Messages">
                                <input class="Localisation" id="localisation_placehoplder" placeholder="LOCALISATION :" type="text" name="Localisation">
                                <input class="Status" id="status_placeholder" placeholder="EMPLOI / STATUT SOCIAL :" type="text" name="status">
                                <input class="Loisis" id="loisirs_placeholder" placeholder="LOISIRS :" type="text" name="loisirs">
                                <input class="Date_naissance" id="date_naissance_placeholder" placeholder="DATE DE NAISSANCE :" type="text" name="date_naissance">
                                <input class="Sexe" id="sexe_placeholder" placeholder="SEXE :" type="text" name="sexe">
                                <span> Date de naissance : </span>
                                <span> 12/07/2001</span>
                            </form>
                             -->
                            <table>
                                <!-- 
                                <thead>
                                    <tr>
                                        <th>
                                            Column 1
                                        </th>
                                        <th>
                                            Column 2
                                        </th>
                                    </tr>
                                </thead>
                                 -->
                                <tbody>
                                    <tr>
                                        <td>
                                            <span>INSCRIT LE : {{.Date}} </span>
                                        </td>
                                        <td>
                                            <span></span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span>MESSAGES/COMMENTAIRES ECRITS : {{.Messages}} </span>
                                        </td>
                                        <td>
                                            <span></span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span>LOCALISATION : {{.Localisation}}</span>
                                        </td>
                                        <td>
                                            <span></span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span>EMPLOI / STATUT SOCIAL : {{.Statut}}</span>
                                        </td>
                                        <td>
                                            <span></span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span>LOISIRS : {{.Loisirs}}</span>
                                        </td>
                                        <td>
                                            <span></span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span>DATE DE NAISSANCE : {{.Date_Naissance}} </span>
                                        </td>
                                        <td>
                                            <span></span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <span>SEXE : {{.Sexe}} </span>
                                        </td>
                                        <td>
                                            <span></span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            {{end}}
            {{end}}
            <div class="col_under_user_info">
                <div class="back_to_blog">
                    ${/*<form action="/index" id="blog" method="get">*/ ""}
                        <button id="button_back_blog" class="button_to_blog" type="submit"">RETOUR AU BLOG</button>
                    ${/*</form>*/ ""}
                </div>
            </div>
        </div>
        <!-- ICON SCRIPT -->
        <script src="https://unpkg.com/feather-icons">
        </script>
        <script>
            feather.replace();
        </script>
        <script src="../test.js"></script>
    </body>`;

export function LoadUserPublicTemplate() {
  CSSHandler(["../styles/css/user_public_profile.css"]);
  getIndexPage.innerHTML = userPublicTemplate;
  const button_to_blog = document.getElementById("button_back_blog");
  button_to_blog.addEventListener("click", LoadBlogTemplate);
}

LoadUserPublicTemplate();
