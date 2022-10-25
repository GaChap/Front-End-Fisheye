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
//Lien URl
const lien = window.location.href;
//Id étant dans l'URL
const photographer_id = lien.split("=")[1];

const photographe = photographer_filter(photographer_id);
photographe.then((photographe) => {
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

    const lesMedias = media_filter(photographer_id);
    //console.log(photographe.name.split(" ")[0])
    lesMedias.then((lesMedias) => {
        const galerie = document.querySelector(".medias");
        const prenom = photographe.name.split(' ')[0];
        /* lesMedias.forEach((leMedia) => {
             const media_card = createElement("div");
             media_card.classList.add("media-card");
             if (leMedia.image != null || leMedia.image != undefined) {
                 const media_image = document.createElement("img");
                 media_image.src=`assets/images/${prenom}/${leMedia.image}`;
             }
             else{
                 if(leMedia.video != null || leMedia.video != undefined)
                 {
                     const media_miniat = document.createElement("video");
                 }
             }
         })*/
        //console.log(lesMedias.length);
    })
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