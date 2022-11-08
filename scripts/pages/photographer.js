//Récupérer l'ensemble des données
async function get_data() {
    try {
        const r = await fetch("data/photographers.json")
        const data = await r.json()
        return data
    }
    catch (error) {
    }
}
//Fonction pour récupérer l'artiste correspondant à l'Id
async function photographer_filter(photographer_id) {
    const { photographers } = await get_data();
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
    const { media } = await get_data();
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
    const galerie = document.querySelector(".medias");
    const prenom = lePhotographe.name.split(' ')[0];
    let lesMedias = await media_filter(lePhotographe.id);
    const lightbox_content = document.querySelector(".lightBox-modal-content");
    //Utilisation d'un paramètre facultatif pour déterminer les médias à afficher
    if (Medias != null || Medias != undefined) { lesMedias = Medias; }
    let n = 1;
    //Boucle pour générer et placer les images
    lesMedias.forEach((leMedia) => {
        const modalLink = document.createElement("a");
        const mySlides = document.createElement("div");
        mySlides.classList.add("mySlides");
        const title = document.createElement("p");
        const media_card = document.createElement("div");
        media_card.classList.add("media-card");
        //Si attribut image
        if (leMedia.image != null || leMedia.image != undefined) {
            const media_image = document.createElement("img");
            media_image.src = `assets/images/${prenom}/mod/${leMedia.image}`;
            media_image.alt = `${leMedia.title}`;
            media_card.appendChild(media_image);
            const modal_image = document.createElement("img");
            modal_image.src = media_image.src;
            mySlides.appendChild(modal_image);
        }
        else {
            //Si attribut video
            if (leMedia.video != null || leMedia.video != undefined) {
                const media_miniat_src = leMedia.video.split('.')[0] + ".png";
                const media_miniat = document.createElement("img");
                media_miniat.src = `assets/images/${prenom}/mod/${media_miniat_src}`;
                media_card.appendChild(media_miniat);
                //Creation vidéo pour la modale
                const media_video = document.createElement("video");
                media_video.src = `assets/images/${prenom}/${leMedia.video}`;
                media_video.poster = media_miniat.src;
                media_video.controls = true;
                mySlides.appendChild(media_video);
            }
        }
        title.innerText = leMedia.title;
        mySlides.appendChild(title);
        lightbox_content.appendChild(mySlides);
        modalLink.href = " ";
        modalLink.classList.add("modal-Link");
        modalLink.setAttribute('onclick', `currentSlide(${n})`);
        //Générer les info des img
        const media_card_info = document.createElement('div');
        media_card_info.classList.add("media-card-info");
        const media_card_like = document.createElement('div');
        media_card_like.classList.add("media-card-like");
        const media_title = document.createElement("p");
        media_title.innerText = leMedia.title;
        media_card_info.appendChild(media_title);
        const media_like = document.createElement("p");
        const media_icon = document.createElement("i");
        media_icon.classList.add("fa-solid");
        media_icon.classList.add("fa-heart");
        media_icon.ariaLabel = "likes"
        media_like.innerText = leMedia.likes;
        media_card_like.appendChild(media_like);
        media_card_like.appendChild(media_icon);
        media_card_info.appendChild(media_card_like);
        media_card.appendChild(media_card_info);
        //media_card.setAttribute('onclick', `currentSlide(${n})`);
        //Ecouteur pour ouvrir la modale
        /*media_card.firstChild.addEventListener("click", (event) => {
            openModalLightbox()
        })*/
        modalLink.addEventListener("click", (event) => {
            event.preventDefault();
            openModalLightbox();
            const bg = document.querySelector(".prev");
            bg.focus();
            console.log(bg)
        })
        //Ecouteur pour incrémenter le like
        media_icon.addEventListener("click", event => {
            media_like.innerText++;
            document.querySelector(".more-info-likes").lastChild.innerText++;
        })
        modalLink.appendChild(media_card);
        n++;
        //galerie.appendChild(media_card);
        galerie.appendChild(modalLink);
    })
}
//Ecouteurs d'évènement pour diriger la lightbox avec le clavier
const modalPrevBtn = document.querySelector(".prev");
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
const modalNextBtn = document.querySelector(".next");
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
//fonction tri popularité (le + de like)
async function selectPop() {
    const lesMedias = await media_filter(lien.split("=")[1]);
    const divMedia = document.querySelector(".medias");
    const divModal = document.querySelector(".lightBox-modal-content");
    const lesMediasReord = Array.from(lesMedias);
    lesMediasReord.sort(function (a, b) {
        return b.likes - a.likes;//a-b pour croissant b-a pour décroissant
    });
    divMedia.innerHTML = "";
    divModal.innerHTML = "";
    prevNext(divModal);
    const photographe = await photographer_filter(photographer_id);
    generer_media(photographe, lesMediasReord);
}
//Générer auto des boutons prev et next pour lightbox lors du tri
function prevNext(divModal) {
    const classes1 = ["prev", "fa-solid", "fa-angle-left"];
    const classes2 = ["next", "fa-solid", "fa-angle-right"];
    const prev = document.createElement("i");
    prev.classList.add(classes1[0]);
    prev.classList.add(classes1[1]);
    prev.classList.add(classes1[2]);
    prev.setAttribute("onclick", "plusSlides(-1)");
    const next = document.createElement("i");
    next.classList.add(classes2[0]);
    next.classList.add(classes2[1]);
    next.classList.add(classes2[2]);
    next.setAttribute("onclick", "plusSlides(1)");
    divModal.appendChild(prev);
    divModal.appendChild(next);
}
//fonction tri titre (alphabétique)
async function selectTitre() {
    const lesMedias = await media_filter(lien.split("=")[1]);
    const divMedia = document.querySelector(".medias");
    const divModal = document.querySelector(".lightBox-modal-content");
    const lesMediasReord = Array.from(lesMedias);
    lesMediasReord.sort(function (x, y) {
        return x.title.toString().localeCompare(y.title.toString());//a-b pour croissant b-a pour décroissant
    });
    divMedia.innerHTML = "";
    divModal.innerHTML = "";
    prevNext(divModal);
    const photographe = await photographer_filter(photographer_id);
    generer_media(photographe, lesMediasReord);
}
//fonction tri Date (Alphanumérique le + jeune)
async function selectDate() {
    const lesMedias = await media_filter(lien.split("=")[1]);
    const divMedia = document.querySelector(".medias");
    const divModal = document.querySelector(".lightBox-modal-content");
    const lesMediasReord = Array.from(lesMedias);
    lesMediasReord.sort(function (x, y) {
        return y.date.toString().localeCompare(x.date.toString());//a-b pour croissant b-a pour décroissant
    });
    divMedia.innerHTML = "";
    divModal.innerHTML = "";
    prevNext(divModal);
    const photographe = await photographer_filter(photographer_id);
    generer_media(photographe, lesMediasReord);
}

async function get_more_info(lePhotographe) {
    const lesMedias = await media_filter(lePhotographe.id);
    const more_info = document.querySelector(".photograph-more-info");
    const more_info_likes = document.querySelector(".more-info-likes");
    const info_likes = document.createElement("p");
    const more_info_price = document.createElement("p");
    more_info_price.innerText = lePhotographe.price + "€ " + "/ jour";
    const media_icon = document.createElement("i");
    media_icon.classList.add("fa-solid");
    media_icon.classList.add("fa-heart");
    let total_like = 0;
    lesMedias.forEach((leMedia) => {
        total_like += leMedia.likes
    })
    info_likes.innerText = total_like;
    more_info_likes.appendChild(info_likes);
    more_info.appendChild(media_icon);
    more_info.appendChild(more_info_price);
}

//Lien URl
const lien = window.location.href;
//Id étant dans l'URL
const photographer_id = lien.split("=")[1];
//Mettre l'attribut action sur la form
//document.getElementsByTagName("form")[0].setAttribute("action", `http://127.0.0.1:5500/index.html`);
//Début mise en page
const photographe = photographer_filter(photographer_id);
photographe.then((photographe) => {
    //Création du header de l'artiste
    const photograh_info = document.querySelector(".photograph-info");
    const photograph_header = document.querySelector(".photograph-header");
    const name = document.createElement("h1");
    name.innerText = photographe.name;
    name.classList.add("photograph-name");
    photograh_info.appendChild(name);
    const location = document.createElement("p");
    const location_text = photographe.city + ", " + photographe.country;
    location.innerText = location_text;
    location.classList.add("photograph-location");
    photograh_info.appendChild(location);
    const slogan = document.createElement("p");
    slogan.innerText = photographe.tagline;
    slogan.classList.add("photograph-tagline");
    photograh_info.appendChild(slogan);
    //Création de l'image de l'artiste dans le header
    const photographe_image = document.createElement('img');
    photographe_image.src = `assets/photographers/${photographe.portrait}`;
    photographe_image.alt = " ";
    photographe_image.classList.add("photograph-img");
    photograph_header.appendChild(photographe_image);

    //Création de la galerie
    const Medias = null;
    generer_media(photographe, Medias);
    //Générer plus d'info
    get_more_info(photographe);
    //
    document.getElementsByTagName("h2")[0].innerText += `    
    ${photographe.name}`;
})
//JS pour form contact
function displayModal() {
    document.querySelector("#contact-modal").style.display = "block";
}
function closeModalC() {
    document.querySelector("#contact_modal").style.display = "none";
}
function getFormData() {
    return Values = {
        "prenom": document.querySelector("#prenom").value,
        "nom": document.querySelector("#nom").value,
        "email": document.querySelector("#email").value,
        "message": document.querySelector("#message").value
    };
}
document.querySelector("#contact_button").addEventListener("click", event => {
    event.preventDefault();
    const Values = getFormData();
    console.log(Values);
})
document.querySelector(".contact_button").addEventListener("click", (e) => {
    document.querySelector("#prenom").focus();
})
document.querySelector(".formCloseLink").addEventListener("click", (e) => {
    e.preventDefault();
})
function Validate(Values) {
    let errors = 0;
    for (const key in Values) {
        const input = document.querySelector(`#${key}`);
        switch (key) {
            case 'prenom':
                if (data[key] = "") {
                    input.style.borderColor = red;
                    errors++;
                }
                break
            case 'nom':
                if (data[key] = "") {
                    input.style.borderColor = red;
                    errors++;
                }
                break
            case 'email':
                if (data[key] = "") {
                    input.style.borderColor = red;
                    errors++;
                }
                break
            case 'message':
                if (data[key] = "") {
                    input.style.borderColor = red;
                    errors++;
                }
                break
            default:
                return 0
        }
    }
    return errors != 0 ? false : true;
}
//Fin js contact

//Js pour lightbox
// Open the Modal
function openModalLightbox() {
    document.getElementById("myModal").style.display = "block";
}

// Close the Modal
function closeModal() {
    document.querySelector("#myModal").style.display = "none";
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
    document.getElementById("myModal").style.display = "none";
})
//Event listener pour fermer la modale en cliquant en-dehors
document.getElementById("myModal").addEventListener("click", event => {
    if (!event.target.closest(".lightBox-modal-content")) {
        document.getElementById("myModal").style.display = "none";
    }
})
//Fin js lightbox

/*Js importé custom select*/
const select = document.querySelector('.select');
const optionBox = document.querySelector('.options');
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
function affValeur() {
    const options = document.querySelectorAll(".item");
    options.forEach((option) => {
        if (option.classList.contains("active")) {
            option.style.display = "none";
        } else {
            option.style.display = "block";
        }
    })
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