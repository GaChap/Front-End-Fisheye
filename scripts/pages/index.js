//Fonction pour récupérer les données dans le fichier json
async function get_data() {
    try {
        const r = await fetch("data/photographers.json")
        const data = await r.json()
        return data
    }
    catch (error) {
    }
}
//Récupère les photographes des données extraites
async function getPhotographers() {
    //Utilise la fonction Async get_data pour récupérer les données dans le json
    const { photographers } = await get_data();
    return ({
        photographers
    })
}
//Génère les "cartes" de photographe
async function displayData(photographers) {
    const photographersSection = document.querySelector(".photographer_section");

    photographers.forEach((photographer) => {
        const photographerModel = photographerFactory(photographer);
        const userCardDOM = photographerModel.getUserCardDOM();
        const ElemLien = document.createElement("a");
        ElemLien.href = `photographer.html?id=${photographer.id}`;
        ElemLien.classList.add("nonUnderLineLink");
        photographersSection.appendChild(ElemLien);
        ElemLien.appendChild(userCardDOM);
    });
};
async function init() {
    const { photographers } = await getPhotographers();
    displayData(photographers);
};
init();
