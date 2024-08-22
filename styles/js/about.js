import { CSSHandler } from "./setCSS.js";
import { LoadBlogTemplate } from "./blog.js";
import { LogoutUSer } from "./blog.js";

const getIndexPage = document.getElementById("page");
const aboutTemplate = `<body>
    <div class="title_user"> 
        <h1 class="your_profil_style">A PROPOS</h1>
        <div class="buttonDiv">
            <button id="button_exit" type="submit" name="username"><img src="/styles/img/exit.png" id="exit" alt="Exit"></button>
        </div>
    </div>
    <div class="title_user_names"> 
        <ul class="names_user">
            <li>J.CAILLY</li>
            <li>D.OUBBAHI</li>
            <li>L.OLIVIER</li>
            <li>A.DOUBLET</li>
          </ul>
    </div>
    <div class="container_user_profile"> 
        <div class="container_info">
            <div class="container_col">
                <div class="col_up_user_info">
                    <div class="title_col_up_first_info">
                        <h2 class="h2_title_style">BUT / OBJECTIF</h2>
                    </div>
                    <div class="title_col_up_second_info">
                        <p>
                            Le but de ce projet est de créer de A à Z un forum internet avec un chat en temps réel. Il doit notramment permettre les fonctionnalités suivantes :
                        </p>
                        <ul> 
                            <li>La communication entre utilisateurs</li>
                            <li>L'association de catégories aux publications</li>
                            <li>L'appréciation et la désapprobation des publications et commentaires</li>
                            <li>Le filtrage des publications</li>
                        </ul>
                            <p>
                                Comme tout forum actuel, il est possible de créer des posts sur 1 ou plusieurs catégories au choix.<br>
                            </p>
                    </div>
                </div>
                <div class="col_down_user_info">
                    <div class="title_col_down_first_info">
                        <h2 class="h2_title_style">CREDITS</h2>
                    </div>
                    <div class="title_col_down_second_info">
                        <p>
                            Nous tenions à remercier différentes plateformes pour les images, vidéo(s) nous ayant permis de réaliser ce projet :<br>
                        </p>
                        <ul> 
                            <li>Canva pour nous avoir permis d'élaborer des maquettes de notre site</li>
                            <li>Flaticon pour les icônes présentes sur notre site</li>
                            <li>MDN Web Docs pour les informations précieuses concernant l'architecture(html) et le desgin des sites(css)</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="col_under_user_info">
            ${/*<form action="/index" method="get">*/ ""}
            <button id="butto_to_blog" class="button_to_blog" type="submit">RETOUR AU BLOG</button>
        ${/*</form>*/ ""}
        </div>
    </div>
</body>`;

export function LoadAboutTemplate() {
  CSSHandler(["../styles/css/about.css"]);

  getIndexPage.innerHTML = aboutTemplate;
  const buttonToBlog = document.getElementById("butto_to_blog");
  buttonToBlog.addEventListener("click", LoadBlogTemplate);

  const exitButton = document.getElementById("button_exit");
  exitButton.addEventListener("click", LogoutUSer); // Ne s'affiche pas mais affiche le nom du cookie
}
LoadAboutTemplate();

window.addEventListener("beforeunload", (event) => {
  // This will trigger LogoutUser when the page is refreshed or closed
  LogoutUSer();
});
