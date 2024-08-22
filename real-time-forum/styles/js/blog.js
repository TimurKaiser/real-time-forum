import { CSSHandler } from "./setCSS.js";
import { LoadAboutTemplate } from "./about.js";
import { LoadUserTemplate } from "./user.js";
import { LoadChatTemplate } from "./chat.js";
// import { Post } from "./post.js";

import { LoadInitialTemplate, LogToBlog } from "./login.js";

// const connexionButton = document.getElementById("connexion_button");
// const getIndexPage = document.getElementById("page");
const blogtemplate = `<body>
    <!-- <div class="nav_barre">
        <div class="start_navbar"> 
            <ul>
                <li> A Propos</li>
                <li>News</li>
            </ul>
        </div>
        <div class="center_navbar"> 
            <h1><b> Z01 FORUM</b></h1>
        </div>
        <div class="end_navbar"> 
            <ul>
                <li>Utilisateur</li>
                <li><img src="../styles/img/exit.png" id="exit"></li>
            </ul>
        </div>
    </div> -->
    <nav class="navbar">
        <a href="#">
            <h1 class="logo_title">Z01 FORUM</h1>
        </a>
        <img id="chatLogo" src="../styles/img/chattingB.png" alt="logo chat" />
        <ul>
            <li>
                ${/*<form action="/about" method="get">*/ ""}
                    <button id="button_about" class="button_about" type="submit">A propos</button>
                ${/*</form>*/ ""}
            </li>
            <li>
                <form action="https://zone01rouennormandie.org/news/" method="post">
                    <button class="button_news" type="submit">News</button>
                </form>
            <li>
                ${
                  /*<form class="nav_button_user" action="/user" method="get">*/ ""
                }
                    <button id="button_username" class="button_user_navbar" type="submit">
                        ${
                          /*{{ if .User.Username }}
                            {{ .User.Username }}
                        {{ else }}
                            Visiteur
                        {{ end }}*/ ""
                        }
                    </button> 
                ${/*</form>*/ ""}
            </li>
            <li> ${/*<form action="/logout" method="post">*/ ""} 
                    <button id="button_exit" type="submit" name="username" value="${
                      /*{{ .User.Username }}*/ ""
                    }"> <img src="/styles/img/exit.png" id="exit" alt="Exit"></button>
                ${/*</form>*/ ""}
            </li>
            ${
              /*<li> <form action="/logout" method="post"> 
                    <button type="submit" name="username" value="
                      {{ .User.Username }}
                    > <img src="/styles/img/exit.png" id="exit" alt="Exit"></button>
                </form>
            </li>*/ ""
            }
        </ul>
    </nav>
    <div id="contenaire" class="contenaire">
        <div class="div1">
            <p><h3 class="col_title">CATEGORIES</h3></p>
            <p class="find_categories">Voici les filtres à disposition :</p>
            <div class="all_searchbar_filters">
                <div class="searchbar" id="search"> 
                    <div class="searchbar_input_button_near">
                        <form class="form-inline" action="/search" method="GET">
                            <div class="searchbar_input_container">
                                <label for="Category">Une idée précise ?</label>
                                <input type="text" name="search" id="searchInput" placeholder="Que recherchez-vous ?" list="suggestions">
                            </div>
                            <button class = "search_button" type="submit">Rechercher</button>
                        </form>
                    </div>
                </div>
                <div class="filter">
                    <div class="category_list"> 
                        <label for="Category">Quelle catégorie vous intéresserait ?</label>
                        <form action="/filter" name="filter">
                        <select name="category" id="Category">
                            <option value="">Apply no filter</option>
                            <option value="golang">Golang</option>
                            <option value="javascript">JavaScript</option>
                            <option value="rust">Rust</option>
                            <option value="html_css">HTML/CSS</option>
                            <option value="angular">Angular</option>
                            <option value="python">Python</option>
                            <option value="autre">Autre</option>
                        </select>
                        <button class="button_filter" type="submit">Submit</button>
                        </form>
                    </div>
                    <div class="more_liked_and_comment">
                        <label for="more_liked_and_comment">Les plus aimés ou commentés</label>
                        <select name="category_posts_comments" id="Category_posts_and_comments">
                            <option value="Posts les plus aimés">Posts les plus aimés</option>
                            <option value="Posts les plus commentés">Posts les plus commentés</option>
                        </select>
                    </div>
                </div>
            </div>
        </div>
        <div class="div2">
            ${/*{{ $error5 := .User.ErrorMessage5 }}*/ ""}

            <p><h3 class="col_title">BLOG</h3></p>
            <!-- <p>Retrouvez ici tous les articles de notre blog</p> -->
            <div class="container_info">
              <div class="pseudo">
                ${
                  /*<form class="pseudo" action="/post" method="POST" enctype="multipart/form-data">*/ ""
                }
                <div class="post">
                    <div class="bandeau">
                        <!-- <a href="user_public_profile.html"><p class="Pseudo"> Pseudo</p></a> -->
                        ${
                          /*<form action="/user_public_profile" class="pseudo" method="GET">
                        
                            ${/*{{ if .User.Username }}*/ ""
                        }
                            
                            <button id="button_pseudo_post" class="bouton_pseudo">
                            ${/*{{ .User.Username }}*/ ""}</button>
                            ${/*{{ else }}*/ ""}
                            ${
                              /*<button class="bouton_pseudo">Visiteur</button>*/ ""
                            }
                        ${/*{{ end }}*/ ""}
                            <div class="icon-container">
                            <input value="Catégories" id="Categorie" disabled>
                            <div class="context-menu">
                              <label for="category1"><input type="checkbox" id="category1" name="category[]" value="Golang"> Golang </label>
                              <label for="category2"><input type="checkbox" id="category2" name="category[]" value="Javascript"> JavaScript </label>
                              <label for="category3"><input type="checkbox" id="category3" name="category[]" value="Rust"> Rust </label>
                              <label for="category4"><input type="checkbox" id="category4" name="category[]" value="HTML/CSS"> HTML/CSS </label>
                              <label for="category5"><input type="checkbox" id="category5" name="category[]" value="Angular"> Angular </label>
                              <label for="category6"><input type="checkbox" id="category6" name="category[]" value="Python"> Python </label>
                              <label for="category7"><input type="checkbox" id="category7" name="category[]" value="Autre"> Autre </label>
                            </div>
                        </div>
                    </div>
                    <div class="zone_text"> 
                        <textarea name="message" id="textp" cols="100" rows="10"></textarea>
                    </div>
                    <div class="bandeau_bas_time_post_comment">
                        <!-- <button class="insert_image" type="file">Insérer image</button> -->
                        <!-- <input type="file" name="file" id="file" class="inputfile" /> -->
                        <input class="insert_image" id="insert" type="file" accept="image/*" name="image" value="Insérer image">
                        <!-- <label class="label_insert" for="insert">Insérer</label> -->
                        ${
                          /*{{if .User.ErrorMessage}}
                            <div class="error_message2"> <img src="/styles/img/error_logo2.png" id="erro_logo2" alt="Exit"> {{.User.ErrorMessage}}</div>
                        {{end}}
                        {{if $error5 }}
                            <div class="error_message2"> <img src="/styles/img/error_logo2.png" id="erro_logo2" alt="Exit"> {{ $error5 }}</div>
                        ${/*{{end}}*/ ""
                        }
                        <button name="token" id="envoie_post" type="submit">Post</button>
                    </div>
                </div>
                ${/*</form>*/ ""}
                </div>
            </div>        
            <div id="all_containers_infos_posts_created" class="all_containers_infos_posts_created">
                ${
                  /*{{ $error4 := .User.ErrorMessage4}}
                {{ $error := .User.ErrorMessage2 }}
                {{ $error5 := .User.ErrorMessage5 }}
                {{ $comment := .Comments }}
                {{ $post := .Posts}}
                {{ $tokenerror := .User.TokenError}}
                {{ $errorLike := .User.ErrorMessage3 }}
                {{if .User.Filtered}}
                {{range .FilteredPosts}}*/ ""
                }
                <div class="container_info_post_created">
                    <div id="post_created" class="post_created">
                        <div class="bandeau_post_crées">
                            ${
                              /*<form class="pseudo" action="/user_public_profile" method="get">*/ ""
                            }
                                <button id="bouton_pseudo_post_crées" class="bouton_pseudo_post_crées" name="userpublic" value="${
                                  /*{{.Username}}*/ ""
                                }" type="submit">${
  /*{{.Username}}*/ ""
}</button>
                            </form>
                            <div class="icon-container-posts-crées">
                                <input value="Catégories" id="Categorie_posts_crées" disabled>
                                <div id="context-menu-posts-crées" class="context-menu-posts-crées">
                                ${
                                  /*
                                    {{if .Golang}}
                                <label> Golang </label>
                                {{end}}
                                {{if .JavaScript}}
                                <label> JavaScript </label>
                                {{end}}
                                {{if .Rust}}
                                <label> Rust </label>
                                {{end}}
                                {{if .HTML_CSS}}
                                <label> HTML/CSS </label>
                                {{end}}
                                {{if .Angular}}
                                <label> Angular </label>
                                {{end}}
                                {{if .Python}}
                                <label> Python </label>
                                {{end}}
                                {{if .Autre}}
                                <label> Autre </label>
                                {{end}}
                                */ ""
                                }
                                </div>
                            </div>
                        </div>
                        <div class="zone_text"> 
                            <textarea id="textpPost" cols="100" rows="10" disabled>${
                              /*{{.Message}}*/ ""
                            }</textarea>
                        </div>
                        ${/*{{if .Image}}*/ ""}
                            <img class="image_post" id="img_post" src="${
                              /*{{.Image}}*/ ""
                            }">
                        ${
                          /*{{end}}
                        {{if $error5 }}
                            <div class="error_message2"> <img src="/styles/img/error_logo2.png" id="erro_logo2" alt="Exit"> ${
                              /*{{ $error5 }}
                            </div>*/ ""
                        }
                        ${/*{{end}}*/ ""}
                        <div class="bandeau_bas_time_post_comment">
                            <div class="date_info" id="date_info">
                                <label>
                                    ${/*{{.Date}}*/ ""}
                                </label>
                            </div>
                            <div class="button_like_and_dislike">
                                ${/*<form action="/like" method="post">*/ ""}
                                    <input type="hidden" name="from" value="index">
                                        <button disabled id="button_like_Post" class="button_like" name="like" value="${
                                          /*{{.Token}}*/ ""
                                        }"type="submit"><p>${
  /*{{.Like}}*/ ""
}</p><p>|</p> J'aime</button>
                                ${/*</form>*/ ""}
                                ${/*<form action="/dislike" method="post">*/ ""}
                                    <input type="hidden" name="from" value="index">
                                        <button disabled id="button_dislike_Post" class="button_dislike" name="like" value="${
                                          /*{{.Token}}*/ ""
                                        }" type="submit"><p>${
  /*{{.Dislike}}*/ ""
}</p><p>|</p>J'aime pas</button>
                                ${/*</form>*/ ""}
                            </div>
                                <div class="comment_div">
                                    <!-- <button class="comment_button" type="submit">Commentaire</button> -->
                                    <a href="# ${
                                      /*{{.Token}}*/ ""
                                    }" class="link_a_demo">Commentaire</a>
                                    <div id="${
                                      /*{{.Token}}*/ ""
                                    }" class="modal">
                                        <div class="modal_content">    
                                            <div class="all_comments_and_form">
                                                <div class="all_comments">
                                                    ${
                                                      /*{{ $token := .Token}}
                                                    {{range $comment }}
                                                    {{if eq $token .TokenComment}}*/ ""
                                                    }
                                                        <!-- <p>Bienvenue sur la fenêtre modale !</p> -->
                                                        <div class="windox_comment">
                                                            <div class="container_info_comment">
                                                                <div class="post_comment">
                                                                    <div class="bandeau_comment">
                                                                        <form class="pseudo" action="/user_public_profile" method="get">
                                                                            <button class="bouton_pseudo_post_crées" name="userpublic" value="${
                                                                              /*{{.Username}}*/ ""
                                                                            }" type="submit">${
  /*{{.Username}}*/ ""
}</button>
                                                                        </form>
                                                                    </div>
                                                                    <div class="zone_text_comment"> 
                                                                        <textarea id="textp_comment" name="message" cols="100" rows="10" disabled>${
                                                                          /*{{.Message_comment}}*/ ""
                                                                        }</textarea>
                                                                        ${
                                                                          /*{{ if .Image_comment}}*/ ""
                                                                        } 
                                                                            <img class="image_post" src="${
                                                                              /*{{.Image_comment}}*/ ""
                                                                            }">
                                                                        ${
                                                                          /*{{end}}*/ ""
                                                                        }
                                                                    </div>
                                                                    <div class="bandeau_button_like_dislike_time_comment">
                                                                        <div class="date_info_comment">
                                                                            <label>
                                                                                ${
                                                                                  /*{{.Date}}*/ ""
                                                                                }
                                                                            </label>
                                                                        </div>
                                                                        <div class="button_like_and_dislike_comment">
                                                                           ${
                                                                             /*<form action="/commentlike" method="post">*/ ""
                                                                           }
                                                                                <button disabled class="button_dislike" name="like" value="${
                                                                                  /*{{.TokenID}}*/ ""
                                                                                }" type="submit"><p>${
  /*{{.Like}}*/ ""
}</p><p>|</p>J'aime pas</button>
                                                                            ${
                                                                              /*</form>*/ ""
                                                                            }
                                                                            ${
                                                                              /*<form action="/commentdislike" method="post">*/ ""
                                                                            }
                                                                                <button disabled class="button_dislike" name="like" value="${
                                                                                  /*{{.TokenID}}*/ ""
                                                                                }" type="submit"><p>${
  /*{{.Dislike}}*/ ""
}</p><p>|</p>J'aime pas</button>
                                                                            ${
                                                                              /*</form>*/ ""
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        ${
                                                          /*{{end}}
                                                        {{end}}*/ ""
                                                        }
                                                </div>
                                                <div class="form_write">
                                                    <!-- <p>Nous aurons la partie pour écrire le commentaire !</p> -->
                                                    <form class="form_comment" action="/comment" method="POST" enctype="multipart/form-data">
                                                        <input class="write_comment" name="comment" type="text" placeholder="Ajouter un commentaire...">
                                                        <button class="button_send_comment" name="tokenpost" value="${
                                                          /*{{.Token}}*/ ""
                                                        }" type="submit">Commenter</button>
                                                        <input class="insert_image" id="insert" type="file" accept="image/*" name="image" value="Insérer image">
                                                    </form>
                                                </div>
                                                
                                                ${
                                                  /*{{if $error}}
                                                    <div class="error_message2"> <img src="/styles/img/error_logo2.png" id="erro_logo2" alt="Exit"> {{ $error }}</div>
                                                {{end}}
                                                {{if $error4}}
                                                    <div class="error_message2"> <img src="/styles/img/error_logo2.png" id="erro_logo2" alt="Exit"> {{ $error4 }}</div>
                                                {{end}}
                                                {{if $error5 }}
                                                    <div class="error_message2"> <img src="/styles/img/error_logo2.png" id="erro_logo2" alt="Exit"> {{ $error5 }}</div>
                                                {{end}}*/ ""
                                                }
                                        <button class="modal_close">&times;</button>
                                        <a href="#_" class="modal_close">&times></a>


                                            </div>
                                            
                                        </div>  
                                    </div>          
                                </div>
                        </div>
                        ${
                          /*{{if eq .Token $tokenerror}}
                        {{if $errorLike}}
                        <div class="error_message2"> <img src="/styles/img/error_logo2.png" id="erro_logo2" alt="Exit"> {{ $errorLike }}</div>
                        {{end}}
                        {{end}}*/ ""
                        }
                    </div>
                </div>
                ${
                  /*{{end}}
                {{else}}
                {{range .Posts}}*/ ""
                }
                <div class="container_info_post_created">
                    <div class="post_created">
                        <div class="bandeau_post_crées">
                            <!-- <a href="user_public_profile.html"><p class="Pseudo"> Pseudo</p></a> -->
                            <form class="pseudo" action="/user_public_profile" method="get">
                                <button class="bouton_pseudo_post_crées" name="userpublic" value="*${
                                  /*{{.Username}}*/ ""
                                }" type="submit">${
  /*{{.Username}}*/ ""
}</button>
                            </form>
                            <div class="icon-container-posts-crées">
                                <input value="Catégories" id="Categorie_posts_crées" disabled>
                                <div class="context-menu-posts-crées">
                                    ${
                                      /*{{if .Golang}}
                                <label> Golang </label>
                                {{end}}
                                {{if .JavaScript}}
                                <label> JavaScript </label>
                                {{end}}
                                {{if .Rust}}
                                <label> Rust </label>
                                {{end}}
                                {{if .HTML_CSS}}
                                <label> HTML/CSS </label>
                                {{end}}
                                {{if .Angular}}
                                <label> Angular </label>
                                {{end}}
                                {{if .Python}}
                                <label> Python </label>
                                {{end}}
                                {{if .Autre}}
                                <label> Autre </label>
                                {{end}}*/ ""
                                    }
                                </div>
                            </div>
                        </div>
                        <div class="zone_text"> 
                            <textarea id="textp" cols="100" rows="10" disabled>${
                              /*{{.Message}}*/ ""
                            }</textarea>
                            ${/*{{if .Image}}*/ ""}
                                <img class="image_post" src="${
                                  /*{{.Image}}*/ ""
                                }">
                            ${/*{{end}}*/ ""}
                        </div>
                        <div class="bandeau_bas_time_post_comment">
                            <div class="date_info">
                                <label>
                                    ${/*{{.Date}}*/ ""}
                                </label>
                            </div>
                            <div class="button_like_and_dislike">
                                ${/*<form action="/like" method="post">*/ ""}
                                    <input type="hidden" name="from" value="index">
                                        <button disabled class="button_like" name="like" value="${
                                          /*{{.Token}}*/ ""
                                        }"type="submit"><p>${
  /*{{.Like}}*/ ""
}</p><p>|</p> J'aime</button>
                                ${/*</form>*/ ""}
                                ${/*<form action="/dislike" method="post">*/ ""}
                                    <input type="hidden" name="from" value="index">
                                        <button disabled class="button_dislike" name="like" value="${
                                          /*{{.Token}}*/ ""
                                        }"type="submit"><p>${
  /*{{.Dislike}}*/ ""
}</p><p>|</p> J'aime pas</button>
                                ${/*</form>*/ ""}
                            </div>
                                <div class="comment_div">
                                    <!-- <button class="comment_button" type="submit">Commentaire</button> -->
                                    <a href="#${
                                      /*{{.Token}}*/ ""
                                    }" class="link_a_demo">Commentaire</a>
                                    <div id="${
                                      /*{{.Token}}*/ ""
                                    }" class="modal">
                                        <div class="modal_content">    
                                            <div class="all_comments_and_form">
                                                <div class="all_comments">
                                                    ${
                                                      /*{{ $token := .Token}}
                                                    {{range $comment }}
                                                    {{if eq $token .TokenComment}}*/ ""
                                                    }
                                                        <!-- <p>Bienvenue sur la fenêtre modale !</p> -->
                                                        <div class="windox_comment">
                                                            <div class="container_info_comment">
                                                                <div class="post_comment">
                                                                    <div class="bandeau_comment">
                                                                        <form class="pseudo" action="/user_public_profile" method="get">
                                                                            <button class="bouton_pseudo_post_crées" name="userpublic" value="${
                                                                              /*{{.Username}}*/ ""
                                                                            }" type="submit">${
  /*{{.Username}}*/ ""
}</button>
                                                                        </form>
                                                                    </div>
                                                                    <div class="zone_text_comment"> 
                                                                        <textarea id="textp_comment" name="message" cols="100" rows="10" disabled>${
                                                                          /*{{.Message_comment}}*/ ""
                                                                        }</textarea>
                                                                        ${
                                                                          /*{{ if .Image_comment}}*/ ""
                                                                        } 
                                                                            <img class="image_post" src="${
                                                                              /*{{.Image_comment}}*/ ""
                                                                            }">
                                                                        ${
                                                                          /*{{end}}*/ ""
                                                                        }
                                                                    </div>
                                                                    <div class="bandeau_button_like_dislike_time_comment">
                                                                        <div class="date_info_comment">
                                                                            <label>
                                                                                ${
                                                                                  /*{{.Date}}*/ ""
                                                                                }
                                                                            </label>
                                                                        </div>
                                                                        <div class="button_like_and_dislike_comment">
                                                                            ${
                                                                              /*<form action="/commentlike" method="post">*/ ""
                                                                            }
                                                                                <button disabled class="button_like" name="like" value="${
                                                                                  /*{{.TokenID}}*/ ""
                                                                                }" type="submit"><p>${
  /*{{.Like}}*/ ""
}</p><p>|</p>J'aime pas</button>
                                                                            ${
                                                                              /*</form>*/ ""
                                                                            }
                                                                            ${
                                                                              /*<form action="/commentdislike" method="post">*/ ""
                                                                            }
                                                                                <button disabled class="button_dislike" name="like" value="${
                                                                                  /*{{.TokenID}}*/ ""
                                                                                }" type="submit"><p>${
  /*{{.Dislike}}*/ ""
}</p><p>|</p>J'aime pas</button>
                                                                            ${
                                                                              /*</form>*/ ""
                                                                            }
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        ${
                                                          /*{{end}}
                                                        {{end}}*/ ""
                                                        }
                                                </div>
                                                <div class="form_write">
                                                    <!-- <p>Nous aurons la partie pour écrire le commentaire !</p> -->
                                                    <form class="form_comment" action="/comment" method="POST" enctype="multipart/form-data">
                                                        <input class="write_comment" name="comment" type="text" placeholder="Ajouter un commentaire...">
                                                        <button class="button_send_comment" name="tokenpost" value="${
                                                          /*{{.Token}}*/ ""
                                                        }" type="submit">Commenter</button>
                                                        <input class="insert_image" id="insert" type="file" accept="image/*" name="image" value="Insérer image">
                                                    </form>
                                                </div>
                                                
                                                ${
                                                  /*{{if $error}}
                                                    <div class="error_message2"> <img src="/styles/img/error_logo2.png" id="erro_logo2" alt="Exit"> {{ $error }}</div>
                                                {{end}}
                                                {{if $error4}}
                                                    <div class="error_message2"> <img src="/styles/img/error_logo2.png" id="erro_logo2" alt="Exit"> {{ $error4 }}</div>
                                                {{end}}
                                                {{if $error5 }}
                                                    <div class="error_message2"> <img src="/styles/img/error_logo2.png" id="erro_logo2" alt="Exit"> {{ $error5 }}</div>
                                                {{end}}*/ ""
                                                }
                                                <button class="modal_close">&times;</button>
                                                <a href="#_" class="modal_close">&times></a>

                                            </div>
                                            
                                        </div>  
                                    </div>          
                                </div>
                        </div>
                        ${
                          /*{{if eq .Token $tokenerror}}
                        {{if $errorLike}}
                        <div class="error_message2"> <img src="/styles/img/error_logo2.png" id="erro_logo2" alt="Exit"> ${
                          {{ $errorLike }}
                        </div>
                        {{end}}
                        {{end}}*/ ""
                        }
                    </div>
                </div>
                ${
                  /*{{end}}
                {{end}}*/ ""
                }
            </div>
        </div>
        <div class="div3">
            <p><h3 class="col_title">RESEAUX</h3></p>
            <p class="find_categories">Nos réseaux ci-dessous</p>
            <div class="container_social_media">
                <div class="all_social_media"> 
                    <div class="box_image"><a href="https://www.facebook.com/Zone01Rouen/"><img src="/styles/img/facebook.svg" alt=""></a></div>                
                    <div class="box_image"><a href="https://www.instagram.com/zone01_rouen_normandie/?hl=fr"><img src="/styles/img/instagram.svg" alt=""></a></div>                
                    <div class="box_image"><a href="https://www.tiktok.com/@zone01rouen"><img src="/styles/img/tiktok.svg" alt=""></a></div>                
                    <div class="box_image"><a href="https://discord.com/channels/905002122309951538/923139529806872628"><img src="/styles/img/discord.svg" alt=""></a></div>                
                    <div class="box_image"><a href="https://fr.linkedin.com/school/zone01-rouen-normandie/"><img src="/styles/img/linkedin.svg" alt=""></a></div>
                    <div class="box_image"><a href="https://twitter.com/zone01rouen"><img src="/styles/img/twitter.svg" alt=""></a></div>                
                </div>
            </div>  
        </div>
    </div>
</body>`;

let cookie = "";
let userName = "";

export function listCookies() {
  var theCookies = document.cookie.split(";");
  console.log(theCookies);
  for (var i = 0; i < theCookies.length; i++) {
    cookie = theCookies[i].split("=")[0].trim(); // Get the cookie name and trim any extra spaces
    userName = cookie;
  }
  console.log(cookie);
}

// let cookieTest = document.cookie;
// console.log(cookieTest);

export function LoadBlogTemplate() {
  CSSHandler(["../styles/css/blog.css"]);
  listCookies();
  const getIndexPage = document.getElementById("page");
  getIndexPage.innerHTML = blogtemplate;
  const toAbout_button = document.getElementById("button_about");
  const buttonUsername = document.getElementById("button_username");
  const exitButton = document.getElementById("button_exit");
  const buttonPseudoPost = document.getElementById("button_pseudo_post");
  const logoChat = document.getElementById("chatLogo");

  toAbout_button.addEventListener("click", LoadAboutTemplate);
  buttonUsername.addEventListener("click", LoadUserTemplate);
  buttonUsername.innerText = userName;
  exitButton.addEventListener("click", listCookies);
  exitButton.addEventListener("click", LogoutUSer); // Ne s'affiche pas mais affiche le nom du cookie
  // envoie_post.addEventListener("click", Post);
  logoChat.addEventListener("click", LoadChatTemplate);

  console.log(userName);
  buttonPseudoPost.innerText = userName;
  LoadDataPost();
  Post();
  // window.addEventListener("beforeunload", function (e) {
  //   // Custom message for the dialog (note: some browsers ignore the custom message)
  //   var confirmationMessage = "Are you sure you want to leave this page?";
  //   // Setting the returnValue of the event is necessary for some browsers
  //   (e || window.event).returnValue = confirmationMessage;
  //   LoadBlogTemplate();
  //   console.log("test");
  //   return confirmationMessage;
  // });

  // Comment();
}

// LoadBlogTemplate();

export function LogoutUSer() {
  localStorage.setItem("currentPage", "login");
  fetch("http://localhost:8003/logout", {
    method: "POST",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    credentials: "include",
  })
    .then((response) => {
      if (response.ok) {
        console.log("Logged out successfully");
        window.location.href = "/";
      } else {
        console.log("Logout failed");
      }
    })
    .catch((error) => {
      console.error("Error", error);
    });
}

//L
//L
//L
// INFO : SUR LE BLOG, LES 2 PREMIERS POSTS SOTN DUS A CAUSE DES RANGE FILTER
// ET RANGE FILTER CLASSIQUE
// POUR LES ENLEVER, IL FAUT DIRECTEMENT ENLEVER TOUT LE HTML DE BLOGTEMPLATE A L'INTERIEUR DE "all_containers_infos_posts_created"
function LoadDataPost() {
  fetch("http://localhost:8003/loadPostData", {
    method: "GET",
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      const sortedData = data.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      console.log("Data received:", sortedData);
      sortedData.forEach((element) => {
        let categories = "";

        if (element.angular) categories += "angular";
        if (element.autre) categories += "autre";
        if (element.golang) categories += "golang";
        if (element.html_css) categories += "html_css";
        if (element.javascript) categories += "javascript";
        if (element.python) categories += "python";
        if (element.rust) categories += "rust";

        console.log(categories);
        const containerAllPosts = document.getElementById(
          "all_containers_infos_posts_created"
        );

        const postHTML = `
        <div class="container_info_post_created">
          <div class="post_created">
            <div class="bandeau_post_crées">
              <form class="pseudo" action="/user_public_profile" method="get">
                <button class="bouton_pseudo_post_crées" name="userpublic" value="${
                  element.username
                }" type="submit">${element.username}</button>
              </form>
              <div class="icon-container-posts-crées">
                <input value="Catégories" id="Categorie_posts_crées" disabled>
                <div class="context-menu-posts-crées">
                  ${categories
                    .trim()
                    .split(" ")
                    .map((category) => `<label>${category}</label>`)
                    .join(" ")}
                </div>
              </div>
            </div>
            <div class="zone_text"> 
              <textarea id="textp" cols="100" rows="10" disabled>${
                element.message
              }</textarea>
              ${
                element.image
                  ? `<img class="image_post" src="${element.image}">`
                  : ""
              }
            </div>
            <div class="bandeau_bas_time_post_comment">
              <div class="date_info">
                <label>${element.date}</label>
              </div>
              <div class="button_like_and_dislike">
                ${/*<form action="/like" method="post">*/ ""}
                  <input type="hidden" name="from" value="index">
                  <button disabled class="button_like" name="like" value="${
                    element.token
                  }" type="submit"><p>${
          element.like
        }</p><p>|</p> J'aime</button>
                ${/*</form>*/ ""}
                ${/*<form action="/dislike" method="post">*/ ""}
                  <input type="hidden" name="from" value="index">
                  <button disabled class="button_dislike" name="like" value="${
                    element.token
                  }" type="submit"><p>${
          element.dislike
        }</p><p>|</p> J'aime pas</button>
                ${/*</form>*/ ""}
              </div>
              <div class="comment_div">
                <a href="#${
                  element.token
                }" id="link_a_demo" class="link_a_demo">Commentaire</a>
                <div id=${element.token} class="modal">
                  <div class="modal_content">    
                    <div class="all_comments_and_form">
                      <div class="all_comments" id="comment_${
                        element.token
                      }_comments">
                        <!-- Here goes comments dynamically loaded if needed -->
                      </div>
                      <div class="form_write">
                      <input class="write_comment" id="write_comment_${
                        element.token
                      }" name="comment" type="text" placeholder="Ajouter un commentaire...">
                          <button class="button_send_comment" id="button_send_comment${
                            element.token
                          }" name="tokenpost" value="${
          element.token
        }" type="submit">Commenter</button>
                          <input class="insert_image" id="insert" type="file" accept="image/*" name="image" value="Insérer image" disabled>
                      </div>
                      <button class="modal_close">&times> T</button>
                      <a href="#_" class="modal_close">&times></a>
                    </div>  
                  </div>
                </div>          
              </div>
            </div>
          </div>
        </div>
      `;

        containerAllPosts.insertAdjacentHTML("beforeend", postHTML);
        console.log(element.token);
        const commentaire = document.getElementById("link_a_demo");
        commentaire.addEventListener("click", LoadDataComment(element.token));
        // LoadDataComment(element.token);

        const send_post = document.getElementById(
          `button_send_comment${element.token}`
        );
        send_post.addEventListener("click", (event) =>
          Comment(event, element.token)
        );
      });

      console.log("Heello");
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function LoadDataComment(token) {
  console.log(token);

  fetch("http://localhost:8003/loadPostComment", {
    method: "POST",
    body: JSON.stringify(token),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
    credentials: "include",
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((data) => {
      if (data) {
        const sortedData = data.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        console.log("sortedData:", sortedData);

        sortedData.forEach((el) => {
          console.log("ALAN LE ROI !");
          console.log("el.id", el.id);
          console.log("el.username", el.username);
          console.log(el.date);
          console.log(el.token_comment);
          console.log(el.message_comment);
          console.log(el.tokenID);
          console.log(el.like);
          console.log(el.dislike);
          console.log(el.image_comment);
          console.log("Hello after comment logs !!");

          var id = el.tokenID;

          const commentsContainer = document.getElementById(
            `comment_${id}_comments`
          );
          const commentHTML = document.createElement("div");
          commentHTML.style.display = "flex";
          commentHTML.style.justifyContent = "center";
          commentHTML.style.alignItems = "center";
          commentHTML.style.flexDirection = "column";
          commentHTML.style.border = "solid";
          commentHTML.style.margin = "1vh";

          const imageHTML = document.createElement("img");
          const usernameHTML = document.createElement("button");
          const dateHTML = document.createElement("label");
          const messageHTML = document.createElement("textarea");

          // commentHTML.innerHTML = el.username;
          usernameHTML.innerHTML = el.username;
          usernameHTML.style.margin = "2vh";

          messageHTML.innerHTML = el.message_comment;
          messageHTML.style.resize = "none";
          messageHTML.setAttribute("cols", "100");
          messageHTML.setAttribute("rows", "10");
          messageHTML.disabled = true;

          dateHTML.innerHTML = "Commenté le : " + el.date;
          dateHTML.style.margin = "2vh";
          dateHTML.style.color = "white";

          imageHTML.src = el.image_comment;
          imageHTML.className = "image_post";

          // commentHTML.innerHTML = el.message_comment;
          // commentHTML.innerHTML = el.image_comment;
          // commentHTML.innerHTML = el.date;

          // commentHTML.innerHTML = `

          //   <div id="${el.token_comment}" class="modal">
          //     ${el.username}
          //     ${el.message_comment}

          //     `;
          console.log(el.message_comment);
          console.log(el.username);
          //commentsContainer.insertAdjacentHTML("beforeEnd", commentHTML);
          commentHTML.appendChild(usernameHTML);
          commentHTML.appendChild(messageHTML);
          commentHTML.appendChild(dateHTML);
          commentHTML.appendChild(imageHTML);
          commentsContainer.appendChild(commentHTML);

          /* 
          // Get the specific comments container for the post
          const commentsContainer = document.getElementById(
            `comment_${id}_comments`
          );
          console.log(commentsContainer, `comment_${el.tokenID}_comments`); //Nul

          if (commentsContainer) {
            const commentHTML = document.createElement("div");
            // commentHTML.style.display = "flex"
            commentHTML.innerHTML = `
    
              <div id="${el.token_comment}" class="modal">
                ${el.username}
                ${el.message_comment}
  ${
    el.image_comment ? `<img class="image_post" src="${el.image_comment}">` : ""
  }                ${el.date}
                
               
            
            </div>
            `;
            commentsContainer.appendChild(commentHTML);

            //commentsContainer.insertAdjacentHTML(, commentHTML); 
          } else {
            console.error(
              `Comments container for tokenID ${el.tokenID} not found`
            );
          }*/
        });
      }
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

function Post() {
  const buttonPseudoPost = document.getElementById("button_pseudo_post");
  const envoi_post = document.getElementById("envoie_post");

  envoi_post.addEventListener("click", async (event) => {
    event.preventDefault(); // Prevent default form submission behavior

    const GolangCat = document.getElementById("category1").checked;
    const JavascriptCat = document.getElementById("category2").checked;
    const RustCat = document.getElementById("category3").checked;
    const HtmlCssCat = document.getElementById("category4").checked;
    const AngularCat = document.getElementById("category5").checked;
    const PythonCat = document.getElementById("category6").checked;
    const AutreCat = document.getElementById("category7").checked;
    const textmessage = document.getElementById("textp");
    const textmessagePost = textmessage.value.trim();

    buttonPseudoPost.innerText = userName;

    const dataPost = {
      username: userName,
      message: textmessagePost,
      golang: GolangCat,
      javascript: JavascriptCat,
      python: PythonCat,
      rust: RustCat,
      html_css: HtmlCssCat,
      angular: AngularCat,
      autre: AutreCat,
    };
    try {
      const response = await fetch("http://localhost:8003/postData", {
        method: "POST",
        body: JSON.stringify(dataPost),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const responseText = await response.text();
      console.log("Raw response text:", responseText);
      const log = JSON.parse(responseText);
      console.log("Data received:", log);
    } catch (error) {
      console.log("Error:", error);
    }

    if (textmessagePost) {
      document.getElementById("textp").value = "";
      const categories = document.getElementsByName("category[]");
      categories.forEach((category) => {
        category.checked = false;
      });
      console.log("New message of post:", commentText);
    } else {
      console.log("Post text is empty");
    }
  });
}

function Comment(event, token) {
  event.preventDefault(); // Prevent default form submission behavior

  const commentInput = document.querySelector(`#write_comment_${token}`);
  if (!commentInput) {
    console.error(`Comment input not found for token: ${token}`);
    return;
  }

  const commentText = commentInput.value.trim();
  // const messageCom = commentInput.value;

  const dataComment = {
    username: userName, // Ensure userName is defined somewhere in your script
    message_comment: commentText,
    tokenID: token,
  };

  try {
    fetch("http://localhost:8003/commentData", {
      method: "POST",
      body: JSON.stringify(dataComment),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
      })
      // .then((responseText) => {
      //   console.log("Raw response text:", responseText);
      //   const log = JSON.parse(responseText);
      //   console.log("Data received:", log);
      // })
      .catch((error) => {
        console.error("Error:", error);
      });
  } catch (error) {
    console.error("Error:", error);
  }

  if (commentText) {
    // Handle the comment submission logic here
    console.log("New comment for token:", token, "Comment text:", commentText);

    // Reset the input field
    commentInput.value = "";
  } else {
    console.log("Comment text is empty");
  }
}
