/**
* Récupère les travaux depuis l'API
* @param {string} apiBaseUrl - L'URL de l'API
* @param {integer} id - L'ID du projet
* @returns {Promise<Array<Object>>} Un tableau d'objets représentant les projets si id est null, sinon un objet représentant le projet
*/
export async function getProjects(apiBaseUrl, id = null) {
    if (!apiBaseUrl){
        throw new Error(`Aucune URL n'a été fournie pour fetch les données.`);
    }
    if (id === null){
        const response = await fetch(`${apiBaseUrl}works`);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const projects = await response.json();
        return projects;
    } else {
        if(Number.isInteger(id)){
            const response = await fetch(`${apiBaseUrl}works/${id}`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }
            const project = await response.json();
            return project
        }
    }
}

/**
 * Affiche les projets dans la galerie
 * @param {Array<Object>} projects - Un tableau d'objets représentant les projets à afficher
 */
export function displayProjects(projects){
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