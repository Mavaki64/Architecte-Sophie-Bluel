import { getProjects, displayProjects } from "./works.js";
import { displayCategories, getCategories, filterByCategory } from "./filters.js";
import { logout, toggleLoginButton } from "./auth.js";
import { toggleElementForLoggedUser, isLogged, initializeModal, displayProjectsInModal, modalCreateForm, modalDisplayCategories, modalDisplayPictureFromInput, modalCheckFormValidity } from "./edit.js";

const apiBaseUrl = `http://localhost:5678/api/`;
const filterContainer = document.querySelector(".filter");
const loginBtn = document.querySelector(".login");
const portfolioHeader = document.querySelector(".portfolio-header");
const modal = document.querySelector("#modal");
let projects;
let categories;

/**
 * Charge les projets et les catégories et affiche les projets et les catégories
 */
document.addEventListener('DOMContentLoaded', async () => {
    projects = await getProjects(apiBaseUrl);
    categories = await getCategories(apiBaseUrl);
    const userIsLogged = isLogged();
    displayProjects(projects);
    displayCategories(categories);
    toggleLoginButton(loginBtn);
    toggleElementForLoggedUser(userIsLogged, categories);
});

/**
 * Gère le clic sur le bouton de filtrage et filtre les projets par catégorie
 * @param {Event} event - Événement de clic
 */
filterContainer.addEventListener('click', (event) => {
    if(event.target.classList.contains("filter-item active")){
        event.preventDefault();
    }
    else if(event.target.classList.contains("filter-item")){
        event.preventDefault();
        const clickedBtn = event.target;
        const filteredProjects = filterByCategory(clickedBtn, projects);
        displayProjects(filteredProjects);
    }
});

/**
 * Gère le clic sur le bouton de connexion et redirige vers la page de connexion si l'utilisateur n'est pas connecté
 * @param {Event} event - Événement de clic
 */
loginBtn.addEventListener('click', async () => {
    if (loginBtn.textContent.includes("login")) {
        window.location = "./login.html"
    } else {
        logout();
        toggleLoginButton(loginBtn);
        categories = await getCategories(apiBaseUrl);
        const userIsLogged = isLogged();
        toggleElementForLoggedUser(userIsLogged, categories);
    }
});

/**
 * Gère le clic sur le bouton de modification et affiche le modal
 * @param {Event} event - L'événement de clic
 */
portfolioHeader.addEventListener("click", async (event) => {
    if(event.target.closest(".edit-btn") || event.target.closest(".edit-btn i")) {
        const modal = document.querySelector("#modal");
        const projects = await getProjects(apiBaseUrl);
        initializeModal();
        displayProjectsInModal(projects);
        modal.showModal();
    }
});

/**
 * Gère le clic sur le modal (Le modal étant couvert par un élément div le click sur le modal est pris en compte sur le backdrop) et ferme le modal
 * Gère le clic sur le bouton d'ajout de photo et ouvre le sélecteur de fichier
 * Gère le clic sur le bouton de retour et affiche la galerie photo
 * Gère le clic sur le bouton de fermeture du modal et ferme le modal
 * Gère le clic sur le bouton pour passer à l'étape suivante et affiche le formulaire d'ajout de photo
 * @param {Event} event - L'événement de clic
 */
modal.addEventListener('click', (event) => {
    const modalAddPictureInput = document.querySelector("#photo");
    const modalAddPictureInputBtn = document.querySelector(".file-input-container button");
    const modalBackBtn = document.querySelector(".modal-back-btn");
    const modalCloseBtn = document.querySelector(".modal-close-btn");
    const modalAddPictureBtn = document.querySelector(".modal-content-button");
    if(event.target === modal) {
        modal.close();
    }
    else if(event.target === modalCloseBtn) {
        modal.close();
    }
    else if(event.target === modalAddPictureInputBtn) {
        event.preventDefault();
        if(modalAddPictureInput){
            modalAddPictureInput.click();
        }
    }
    else if(event.target === modalBackBtn) {
        initializeModal();
        displayProjectsInModal(projects);
    }
    else if(event.target === modalAddPictureBtn) {
        modalCreateForm();
        modalDisplayCategories(categories);
    }
});

/**
 * Gère le changement de fichier et affiche l'image dans le modal
 * @param {Event} event - L'événement de changement
 */
modal.addEventListener("change", (event) => {
    const fileInput = document.querySelector("#photo");
    if(event.target === fileInput) {
        modalDisplayPictureFromInput(event.target.files[0]);
    }
});

/**
 * Gère le changement de valeur des inputs et vérifie si le formulaire est valide
 * @param {Event} event - L'événement de changement
 */
modal.addEventListener("input", (event) => {
    const titleInput = document.querySelector("#titre");
    const categorieInput = document.querySelector("#categorie");
    const fileInput = document.querySelector("#photo");
    if(event.target === titleInput || event.target === categorieInput || event.target === fileInput) {
        if(fileInput.type === "image/jpeg" || fileInput.type === "image/png") {
            if(fileInput.size < 4 * 1024 * 1024) {
                modalCheckFormValidity();
            }
        }
    }
});