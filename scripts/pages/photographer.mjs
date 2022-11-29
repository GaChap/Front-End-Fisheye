/**@format */
//Fonctions importées
//Pour récupérer la totalité des données
import { get_data } from "../utils/fetchData.mjs";
//Pour créer un élément
import { createElement } from "../factories/domElement.mjs";
//Pour récupérer un élément
import { querySelector } from "../factories/domElement.mjs";
//Insérer un (ou plusieurs) élément enfant à un élément parent
import { appendElement } from "../factories/domElement.mjs";
//Déconstruction pour pouvoir utiliser en variables
const { photographers, media } = await get_data();
//Génération des boutons "suivant" et "précédent"
const divModal = document.querySelector(".lightBox-modal-content");
prevNext(divModal);
//Fonction pour récupérer l'artiste correspondant à l'Id
async function photographer_filter(photographer_id) {
    let lephotographe = undefined;
    photographers.forEach((photographer) => {
        if (photographer.id == photographer_id) {
            lephotographe = photographer;
        } else { }
    })
    return lephotographe
}
//Fonction pour récupérer les oeuvres de l'artiste correspondant à l'Id
async function media_filter(photographer_id) {
    const media_collection = [];
    media.forEach((leMedia) => {
        if (leMedia.photographerId == photographer_id) {
            media_collection.push(leMedia);
        }
    })
    return media_collection;
}
//Fonction pour afficher les images et générer le contenu lightbox
async function generer_media(lePhotographe, Medias) {
    const galerie = querySelector(".medias");
    const prenom = lePhotographe.name.split(' ')[0];
    let lesMedias = await media_filter(lePhotographe.id);
    const lightbox_content = querySelector(".lightBox-modal-content");
    /*Utilisation d'un paramètre facultatif pour déterminer les médias à afficher 
    "null" pour ceux de base et autre si personnalisé*/
    if (Medias != null || Medias != undefined) { lesMedias = Medias; }
    let n = 0;
    //Boucle pour générer et placer les images
    lesMedias.forEach((leMedia) => {
        const modalLink = createElement("a");
        const mySlides = createElement("div");
        mySlides.classList.add("mySlides");
        const title = createElement("p");
        const media_card = createElement("div");
        media_card.classList.add("media-card");
        const media_img = createElement("img");
        //Test pour savoir quelle source appliquer et générer vidéo
        if (leMedia.video != null || leMedia.video != undefined) {
            const media_miniat_src = leMedia.video.split('.')[0] + ".png";
            media_img.src = `assets/images/${prenom}/mod/${media_miniat_src}`;
            //Creation vidéo pour la modale
            const media_video = createElement("video");
            media_video.src = `assets/images/${prenom}/${leMedia.video}`;
            media_video.poster = media_img.src;
            media_video.controls = true;
            appendElement(mySlides, [media_video]);
        } else {
            media_img.src = `assets/images/${prenom}/mod/${leMedia.image}`;
            const modal_image = document.createElement("img");
            modal_image.src = media_img.src;
            appendElement(mySlides, [modal_image]);
        }
        media_img.alt = `${leMedia.title}`;
        appendElement(media_card, [media_img]);
        media_img.addEventListener("click", (e) => {
            currentSlide(1);
            querySelector(".prev").focus();
        })
        title.innerText = leMedia.title;
        appendElement(mySlides, [title]);
        appendElement(lightbox_content, [mySlides]);
        modalLink.href = " ";
        modalLink.classList.add("modal-Link");
        //Générer les info des img
        const media_card_info = document.createElement('div');
        media_card_info.classList.add("media-card-info");
        const media_card_like = document.createElement('div');
        media_card_like.classList.add("media-card-like");
        const media_title = document.createElement("p");
        media_title.innerText = leMedia.title;
        //media_card_info.appendChild(media_title);
        appendElement(media_card_info, [media_title]);
        const media_like = document.createElement("p");
        const media_icon = document.createElement("i");
        media_icon.classList.add("fa-solid");
        media_icon.classList.add("fa-heart");
        media_icon.ariaLabel = "likes"
        media_like.innerText = leMedia.likes;
        appendElement(media_card_like, [media_like, media_icon]);
        appendElement(media_card_info, [media_card_like]);
        appendElement(media_card, [media_card_info]);
        //Ecouteur pour ouvrir la modale
        modalLink.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                openModalLightbox();
                currentSlide(3);
                querySelector(".prev").focus();
            }
        })
        //Ecouteur pour placer le focus sur le bouton "précédent"
        media_card.firstChild.addEventListener("click", (event) => {
            openModalLightbox();
            querySelector(".prev").focus();
        })
        modalLink.addEventListener("click", (event) => {
            event.preventDefault();
        })
        //Ecouteur pour incrémenter le like de l'image et du total de like
        media_icon.addEventListener("click", event => {
            media_like.innerText++;
            querySelector(".more-info-likes").lastChild.innerText++;
        })
        appendElement(modalLink, [media_card]);
        appendElement(galerie, [modalLink]);
        n++;
    })
}
//Ecouteurs d'évènement pour diriger la lightbox avec le clavier
const modalPrevBtn = querySelector(".prev");
modalPrevBtn.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
        plusSlides(-1);
    }
    else {
        if (e.key === "ArrowRight") {
            plusSlides(1);
        }
    }
})

const modalNextBtn = querySelector(".next");
modalNextBtn.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") {
        plusSlides(-1);
    }
    else {
        if (e.key === "ArrowRight") {
            plusSlides(1);
        }
    }
})
//Générer auto des boutons prev et next pour lightbox lors du tri
function prevNext(divModal) {
    const prev = createElement("input");
    prev.type = "button";
    prev.value = "❮";
    prev.classList.add("prev");
    const next = createElement("input");
    next.type = "button";
    next.value = "❯";
    next.classList.add("next");
    appendElement(divModal, [prev, next]);
    prev.addEventListener("click", (e) => {
        plusSlides(-1);
    })
    next.addEventListener("click", (e) => {
        plusSlides(1);
    })
}
async function selectGen(type) {
    const lesMedias = await media_filter(lien.split("=")[1]);
    const divMedia = querySelector(".medias");
    const divModal = querySelector(".lightBox-modal-content");
    const lesMediasReord = Array.from(lesMedias);
    switch (type) {
        case "popularite": lesMediasReord.sort(function (a, b) {
            return b.likes - a.likes;//a-b pour croissant b-a pour décroissant
        });
            break;
        case "titre": lesMediasReord.sort(function (x, y) {
            return x.title.toString().localeCompare(y.title.toString());//a-b pour croissant b-a pour décroissant
        });
            break;
        case "date": lesMediasReord.sort(function (x, y) {
            return y.date.toString().localeCompare(x.date.toString());//a-b pour croissant b-a pour décroissant
        });
            break;
    }
    divMedia.innerHTML = "";
    divModal.innerHTML = "";
    prevNext(divModal);
    const photographe = await photographer_filter(photographer_id);
    generer_media(photographe, lesMediasReord);
}
//Génère la bande rose en bas à droite de l'écran
async function get_more_info(lePhotographe) {
    const lesMedias = await media_filter(lePhotographe.id);
    const more_info = querySelector(".photograph-more-info");
    const more_info_likes = querySelector(".more-info-likes");
    const info_likes = createElement("p");
    const more_info_price = createElement("p");
    more_info_price.innerText = lePhotographe.price + "€ " + "/ jour";
    const media_icon = createElement("i");
    media_icon.classList.add("fa-solid");
    media_icon.classList.add("fa-heart");
    let total_like = 0;
    lesMedias.forEach((leMedia) => {
        total_like += leMedia.likes
    })
    info_likes.innerText = total_like;
    appendElement(more_info_likes, [info_likes]);
    appendElement(more_info, [media_icon, more_info_price]);
}

//Lien URl
const lien = window.location.href;
//Id étant dans l'URL
const photographer_id = lien.split("=")[1];
//Accessibilité au clic pour le select
querySelector("#popularite").addEventListener("click", (e) => {
    selectGen("popularite");
})
querySelector("#date").addEventListener("click", (e) => {
    selectGen("date");
})
querySelector("#titre").addEventListener("click", (e) => {
    selectGen("titre");
})
//Accessibilité au clavier pour le select
const selectInput = querySelector('.select');
selectInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        if (selectInput.value != "options") {
            switch (selectInput.value) {
                case 'Popularité': selectGen("popularite");
                    break;
                case 'Date': selectGen("date");
                    break;
                case 'Titre': selectGen("titre");
                    break;
            }
        }
    }
})
//Début mise en page
const photographe = photographer_filter(photographer_id);
photographe.then((photographe) => {
    //Création du header de l'artiste
    const photograh_info = querySelector(".photograph-info");
    const photograph_header = querySelector(".photograph-header");
    const name = createElement("h1");
    name.innerText = photographe.name;
    name.classList.add("photograph-name");
    const location = createElement("p");
    const location_text = photographe.city + ", " + photographe.country;
    location.innerText = location_text;
    location.classList.add("photograph-location");
    const slogan = document.createElement("p");
    slogan.innerText = photographe.tagline;
    slogan.classList.add("photograph-tagline");
    appendElement(photograh_info, [name, location, slogan]);
    //Création de l'image de l'artiste dans le header
    const photographe_image = createElement('img');
    photographe_image.src = `assets/photographers/${photographe.portrait}`;
    photographe_image.alt = " ";
    photographe_image.classList.add("photograph-img");
    appendElement(photograph_header, [photographe_image]);

    //Création de la galerie
    const Medias = null;
    generer_media(photographe, Medias);
    //Générer plus d'info
    get_more_info(photographe);
    //Génère la première ligne dans le form de contact
    document.getElementsByTagName("h2")[0].innerText += `    
    ${photographe.name}`;
    const formButton = querySelector(".contact_button");
    formButton.addEventListener("click", (e) => {
        displayModal();
    })
    const closeButton = querySelector(".formClose");
    closeButton.addEventListener("click", (e) => {
        closeModalC();
    })
})
//JS pour form contact
function displayModal() {
    querySelector("#contact_modal").style.display = "block";
    querySelector("#prenom").focus();
}
function closeModalC() {
    querySelector("#contact_modal").style.display = "none";
}
function getFormData() {
    const Values = {
        "prenom": querySelector("#prenom").value,
        "nom": querySelector("#nom").value,
        "email": querySelector("#email").value,
        "message": querySelector("#message").value
    };
    return Values;
}
document.querySelector("#contact_button").addEventListener("click", event => {
    event.preventDefault();
    const Values = getFormData();
    console.log(Values);
})
document.querySelector(".formCloseLink").addEventListener("click", (e) => {
    e.preventDefault();
})
document.querySelector(".formCloseLink").addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
        closeModalC();
    }
})
//Fin js contact
//Js pour lightbox
// Open the Modal
function openModalLightbox() {
    document.getElementById("myModal").style.display = "block";
}

// Close the Modal
function closeModal() {
    querySelector("#myModal").style.display = "none";
}

var slideIndex = 1;

// Next/previous controls
function plusSlides(n) {
    showSlides(slideIndex += n);
}

// Thumbnail image controls
function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    var i;
    var slides = document.getElementsByClassName("mySlides");
    if (n > slides.length) { slideIndex = 1 }
    if (n < 1) { slideIndex = slides.length }
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }
    slides[slideIndex - 1].style.display = "block";
}
//Event listener pour fermer la modale lightbox
document.getElementsByClassName("lightBox-close")[0].addEventListener("click", event => {
    closeModal();
})
//Event listener pour fermer la modale en cliquant en-dehors
document.getElementById("myModal").addEventListener("click", event => {
    if (!event.target.closest(".lightBox-modal-content")) {
        document.getElementById("myModal").style.display = "none";
    }
})
//Fin js lightbox
/*Js importé custom select*/
const select = querySelector('.select');
const optionBox = querySelector('.options');
const options = [...document.querySelectorAll('.options .item')];

let activeOption = 0; // default should be 0

window.onclick = (e) => {
    if (!e.target.className.includes('select')) {
        select.classList.remove('active');
        optionBox.classList.remove('active');
    } else {
        select.classList.toggle('active');
        optionBox.classList.toggle('active');
    }
}

options.forEach((item, i) => {
    item.onmousemove = () => {
        hoverOptions(i);
    }
})
const hoverOptions = (i) => {
    options[activeOption].classList.remove('active');
    options[i].classList.add('active');
    activeOption = i;
    setValue();
}
window.onkeydown = (e) => {
    if (select.className.includes('active')) {
        e.preventDefault();
        if (e.key === 'ArrowDown' && activeOption < options.length - 1) {
            hoverOptions(activeOption + 1);
        } else if (e.key === 'ArrowUp' && activeOption > 0) {
            hoverOptions(activeOption - 1);
        } else if (e.key === 'Enter') {
            select.classList.remove('active');
            optionBox.classList.remove('active');
        }
    }
}

const setValue = () => {
    select.innerHTML = select.value = options[activeOption].innerHTML;
}

setValue();