import { photographerFactory } from "../factories/photographer.mjs";
import { get_data } from "../utils/fetchData.mjs";
import { createElement, querySelector, appendElement } from "../factories/domElement.mjs";


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
    const photographersSection = querySelector(".photographer_section");

    photographers.forEach((photographer) => {
        const photographerModel = photographerFactory(photographer);
        const userCardDOM = photographerModel.getUserCardDOM();
        const ElemLien = createElement("a");
        ElemLien.href = `photographer.html?id=${photographer.id}`;
        ElemLien.classList.add("nonUnderLineLink");
        appendElement(photographersSection, [ElemLien]);
        appendElement(ElemLien, [userCardDOM]);
    });
};
async function init() {
    const { photographers } = await getPhotographers();
    displayData(photographers);
};
init();
