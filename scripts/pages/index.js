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
async function getPhotographers() {
    // Penser à remplacer par les données récupérées dans le json

    //Utilise la fonction Async get_data pour récupérer les données dans le json
    const { photographers } = await get_data();
    // et bien retourner le tableau photographers seulement une fois
    return ({
        photographers
    })
}
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
    // Récupère les datas des photographes
    const { photographers } = await getPhotographers();
    displayData(photographers);
};
init();
