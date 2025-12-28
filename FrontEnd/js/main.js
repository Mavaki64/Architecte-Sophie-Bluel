import { getProjects, displayProjects } from "./works.js";
import { displayCategories, getCategories, filterByCategory } from "./filters.js";
import { logout, toggleLoginButton } from "./auth.js";
import { toggleElementForLoggedUser, isLogged, displayProjectsInModal } from "./edit.js";

const apiBaseUrl = `http://localhost:5678/api/`;
const filterContainer = document.querySelector(".filter");
const loginBtn = document.querySelector(".login");
const portfolioHeader = document.querySelector(".portfolio-header");
const modal = document.querySelector("#modal");
const modalBackdrop = document.querySelector("#modal::backdrop");
const modalCloseBtn = document.querySelector(".modal-close-btn");
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
        displayProjectsInModal(projects);
        modal.showModal();
    }
});

/**
 * Gère le clic sur le modal (Le modal étant couvert par un élément div le click sur le modal est pris en compte sur le backdrop) et ferme le modal
 * @param {Event} event - L'événement de clic
 */
modal.addEventListener('click', (event) => {
    if(event.target === modal) {
        modal.close();
    }
});

/**
 * Gère le clic sur le bouton de fermeture du modal et ferme le modal
 * @param {Event} event - L'événement de clic
 */
modalCloseBtn.addEventListener('click', () => {
    modal.close();
});