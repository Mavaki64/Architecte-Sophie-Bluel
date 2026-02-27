import { projectsRequest } from "./api.js";
import * as state from "./state.js";

/**
* Récupère les travaux depuis l'API et met à jour le state
* @param {integer} id - L'ID du projet
*/
export async function fetchProjects() {
    state.setProjects(await projectsRequest());
}

/**
 * Affiche les projets dans la galerie
 */
export function displayProjects(projects = state.getProjects()){
    const gallery = document.querySelector(".gallery");
    gallery.innerHTML = "";
    projects.forEach((project) => {
        const figureElement = document.createElement("figure");
        const imageElement = document.createElement("img");
        const figcaptionElement = document.createElement("figcaption");
        imageElement.src = project.imageUrl;
        imageElement.alt = project.title;
        figcaptionElement.innerText = project.title;
        figureElement.append(imageElement, figcaptionElement);
        gallery.append(figureElement);
    });
}