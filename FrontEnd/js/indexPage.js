import { fetchProjects, displayProjects } from "./works.js";
import { displayCategories, fetchCategories, filterByCategory } from "./filters.js";
import { logout, toggleLoginButton, checkSessionExpiry } from "./auth.js";
import { toggleElementForLoggedUser, initializeModal, displayProjectsInModal, modalCreateForm, modalDisplayPictureFromInput, modalCheckFormValidity, publishNewProject } from "./modal.js";
import { initNavLinks } from "./nav.js";

const filterContainer = document.querySelector(".filter");
const loginBtn = document.querySelector(".login");
const portfolioHeader = document.querySelector(".portfolio-header");
const modal = document.querySelector("#modal");

/**
 * Charge les projets et les catégories et affiche les projets et les catégories
 * Ajoute la classe nav-bold au lien de projets ou de contact si la page est la page de projets ou de contact
 * Fait défiler la page jusqu'à la section cible
 */
document.addEventListener('DOMContentLoaded', async () => {
    await fetchProjects();
    await fetchCategories();
    displayProjects();
    displayCategories();
    toggleElementForLoggedUser();
    initNavLinks({ 
        setActiveLink: true,
        onLogout: () => {
            logout();
            toggleLoginButton(loginBtn);
            toggleElementForLoggedUser();
        }
    });
    scrollToSection();
    checkSessionExpiry();
    setInterval(checkSessionExpiry, 60000);
});

/**
 * Gère le clic sur le bouton de filtrage et filtre les projets par catégorie
 * @param {Event} event - Événement de clic
 */
filterContainer.addEventListener('click', (event) => {
    if(event.target.classList.contains("filter-item")) displayProjects(filterByCategory(event.target));
});

/**
 * Gère le clic sur le bouton de modification et affiche le modal
 * @param {Event} event - L'événement de clic
 */
portfolioHeader.addEventListener("click", async (event) => {
    if(event.target.closest(".edit-btn")) {
        initializeModal();
        modal.showModal();
    }
});

/**
 * Gère le click sur les éléments du modal (fermeture, retour, ajout de photo, validation) par délégation avec leur data-action.
 *
 * @param {Event} event - L'événement de clic
 */
const modalActions = {
    close: () => modal.close(),
    back: () => { initializeModal(); displayProjectsInModal(); },
    showAddForm: () => modalCreateForm(),
    submit: async (event) => { event.preventDefault(); await publishNewProject(); },
}

modal.addEventListener('click', async (event) => {
    if(event.target === modal) {
        modal.close();
        return;
    }
    const action = event.target.closest("[data-action]")?.dataset.action;
    if (action && modalActions[action]) await modalActions[action](event);
    
});

/**
 * Gère le changement de fichier et affiche l'image dans le modal
 * @param {Event} event - L'événement de changement
 */
modal.addEventListener("change", (event) => {
    if (event.target.id === "photo") modalDisplayPictureFromInput(event.target.files[0]);
});

/**
 * Gère le changement de valeur des inputs et vérifie si le formulaire est valide
 * @param {Event} event - L'événement de changement
 */
modal.addEventListener("input", (event) => {
    const titleInput = document.querySelector("#titre");
    const categorieInput = document.querySelector("#categorie");
    const fileInput = document.querySelector("#photo");
    if(
        (event.target === titleInput || event.target === categorieInput || event.target === fileInput) &&
        (fileInput.files[0]?.type === "image/jpeg" || fileInput.files[0]?.type === "image/png") &&
        fileInput.files[0].size < 4 * 1024 * 1024
    ) modalCheckFormValidity();
    
});

/**
 * Fait défiler la page jusqu'à la section cible
 */
function scrollToSection(){
    const targetSection = window.location.hash;
    if(targetSection) document.querySelector(targetSection)?.scrollIntoView({ behavior: 'smooth' });
}