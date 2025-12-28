import { displayCategories } from "./filters.js";
import { getProjects, displayProjects } from "./works.js";

/**
 * Toggle les éléments pour l'utilisateur connecté ou non
 * @param {boolean} isLogged - True si l'utilisateur est connecté, false sinon
 * @param {Array<Object>} categories - les catégories
 */
export function toggleElementForLoggedUser(isLogged, categories){
    if(isLogged){
        document.body.style.paddingTop = `59px`;
        createEditBar();
        const filtersContainer = document.querySelector(".filter");
        filtersContainer.innerHTML = "";
        createEditBtn();
    }else{
        document.body.style.paddingTop = `0px`;
        const editBar = document.querySelector(".edit-bar");
        if(editBar){
            editBar.remove();
        }
        const editBtn = document.querySelector(".edit-btn");
        if(editBtn){
            editBtn.remove();
        }
        displayCategories(categories);
    }
}

/**
 * Crée la barre de modification
 */
export function createEditBar(){
    const editBar = document.createElement("section");
    editBar.classList.add("edit-bar");
    document.body.prepend(editBar);
    const logoElement = document.createElement("i");
    const textElement = document.createElement("span");
    logoElement.classList.add("fa-regular", "fa-pen-to-square");
    textElement.textContent = "Mode édition";
    editBar.append(logoElement, textElement);
}

/**
 * Crée le bouton de modification
 */
export function createEditBtn(){
    const editBtnContainer = document.querySelector(".portfolio-header");
    const editBtn = document.createElement("p");
    const editBtnIcon = document.createElement("i");
    editBtnIcon.classList.add("fa-regular", "fa-pen-to-square");
    editBtn.textContent = "modifier";
    editBtn.classList.add("edit-btn");
    editBtnContainer.append(editBtn);
    editBtn.prepend(editBtnIcon);
}

/**
 * Vérifie si l'utilisateur est connecté
 * @returns {boolean} True si l'utilisateur est connecté, false sinon
 */
export function isLogged(){
    const user_id = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    let isLogged;
    if(user_id != null && token != null){
        isLogged = true;
        return isLogged;
    } else {
        isLogged = false;
        return isLogged
    }
}

/**
 * Affiche les projets dans le modal
 * @param {Array<Object>} projects - les projets
 */
export function displayProjectsInModal(projects){
    const modalGallery = document.querySelector(".modal-content-images");
    modalGallery.innerHTML = "";
    for (let i = 0; i < projects.length; i++) {
        const project = projects[i];
        const projectElement = document.createElement("div");
        projectElement.classList.add('modal-content-project');
        const imageElement = document.createElement("img");
        imageElement.src = project.imageUrl;
        imageElement.alt = project.title;
        const deleteBtn = document.createElement("i");
        deleteBtn.classList.add("fa-solid", "fa-trash-can");
        deleteBtn.addEventListener("click", () => {
            deleteProject(project.id);
        });
        projectElement.append(imageElement, deleteBtn);
        modalGallery.append(projectElement);
    }
}

/**
 * Supprime un projet via l'API et affiche les projets dans la galerie et le modal
 * @param {integer} id - L'ID du projet
 */
export async function deleteProject(id){
    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    });
    if(response.ok){
        const apiBaseUrl = "http://localhost:5678/api/";
        const projects = await getProjects(apiBaseUrl);
        displayProjects(projects);
        displayProjectsInModal(projects);
    }
}