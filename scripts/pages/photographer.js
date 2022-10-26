//Mettre le code JavaScript lié à la page photographer.html
//console.log(window.location.href);
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
async function generer_media(lePhotographe) {
    const galerie = document.querySelector(".medias");
    const prenom = lePhotographe.name.split(' ')[0];
    const lesMedias = await media_filter(lePhotographe.id);
    console.log(galerie)
    lesMedias.forEach((leMedia) => {
        const media_card = document.createElement("div");
        media_card.classList.add("media-card");
        if (leMedia.image != null || leMedia.image != undefined) {
            const media_image = document.createElement("img");
            media_image.src = `assets/images/${prenom}/mod/${leMedia.image}`;
            media_card.appendChild(media_image);
        }
        else {
            if (leMedia.video != null || leMedia.video != undefined) {
                const media_miniat_src = leMedia.video.split('.')[0] + ".png";
                const media_miniat = document.createElement("img");
                media_miniat.src = `assets/images/${prenom}/mod/${media_miniat_src}`;
                media_card.appendChild(media_miniat);
            }
        }
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
        media_like.innerText = leMedia.likes;
        media_card_like.appendChild(media_like);
        media_card_like.appendChild(media_icon);
        media_card_info.appendChild(media_card_like);
        media_card.appendChild(media_card_info);
        galerie.appendChild(media_card);
    })
}
//Lien URl
const lien = window.location.href;
//Id étant dans l'URL
const photographer_id = lien.split("=")[1];

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

    const photographe_image = document.createElement('img');
    photographe_image.src = `assets/photographers/${photographe.portrait}`;
    photographe_image.classList.add("photograph-img");
    photograph_header.appendChild(photographe_image);

    //Création de la galerie
    const lesMedias = media_filter(photographer_id);
    generer_media(photographe);
    /*lesMedias.then((lesMedias) => {
        const galerie = document.querySelector(".medias");
        const prenom = photographe.name.split(' ')[0];
        const collect_media = [];
        for (let i = 0; i < lesMedias.length; i++) {
            collect_media.push(lesMedias[i]);
        }
        collect_media.forEach((leMedia) => {
            const media_card = createElement("div");
            media_card.classList.add("media-card");
            if (leMedia.image != null || leMedia.image != undefined) {
                const media_image = document.createElement("img");
                media_image.src = `assets/images/${prenom}/mod/${leMedia.image}`;
                media_card.appendChild(media_image);
            }
            else {
                if (leMedia.video != null || leMedia.video != undefined) {
                    const media_miniat_src = leMedia.video.split('.')[0] + ".png";
                    const media_miniat = document.createElement("img");
                    media_miniat.src = media_miniat_src;
                    media_card.appendChild(media_miniat);
                }
            }
            galerie.appendChild(media_card);
        })
    })*/
    //en chantier
    /*lesMedias.then((lesMedias) => {
        const galerie = document.querySelector(".medias");
        const prenom = photographe.name.split(' ')[0];
        lesMedias.forEach((leMedia) => {
            const media_card = createElement("div");
            media_card.classList.add("media-card");
            if (leMedia.image != null || leMedia.image != undefined) {
                const media_image = document.createElement("img");
                media_image.src = `assets/images/${prenom}/mod/${leMedia.image}`;
                media_card.appendChild(media_image);
            }
            else {
                if (leMedia.video != null || leMedia.video != undefined) {
                    const media_miniat_src = leMedia.video.split('.')[0] + ".png";
                    const media_miniat = document.createElement("img");
                    media_miniat.src = media_miniat_src;
                    media_card.appendChild(media_miniat);
                }
            }
            galerie.appendChild(media_card);
        })
        //console.log(lesMedias.length);
    })*/
})

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