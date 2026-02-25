import { projectsRequest } from "./api.js";
import * as state from "./state.js";

/**
* Récupère les travaux depuis l'API
* @param {integer} id - L'ID du projet
* @returns {Promise<Array<Object>>} Un tableau d'objets représentant les projets si id est null, sinon un objet représentant le projet
*/
export async function fetchProjects(id = null) {
    if(id && !Number.isInteger(id)){
        throw new Error("L'ID doit être un nombre entier.");
    }

    if (id){
        state.setProjects(await projectsRequest(id));
    } else {
        state.setProjects(await projectsRequest());
    }
}

/**
 * Affiche les projets dans la galerie
 */
export function displayProjects(projects = state.getProjects()){
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";
    for (let i = 0; i < projects.length; i++) {
        const project = projects[i];
        const figureElement = document.createElement("figure");
        const imageElement = document.createElement("img");
        const figcaptionElement = document.createElement("figcaption");
        imageElement.src = project.imageUrl;
        imageElement.alt = project.title;
        figcaptionElement.innerText = project.title;
        figureElement.append(imageElement, figcaptionElement);
        gallery.append(figureElement);
    }
}