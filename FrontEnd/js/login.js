import { loginUser, saveAuth, toggleLoginButton } from "./auth.js";

const submitBtn = document.querySelector(`input[type="submit"]`)
const apiBaseUrl = `http://localhost:5678/api/`;
const emailElement = document.querySelector("#email");
const passwordElement = document.querySelector("#password");
const errorBox = document.querySelector(".error-box")
const projectsLink = document.querySelector(".projects-link");
const contactLink = document.querySelector(".contact-link");
const indexLink = document.querySelector(".index-link");
/**
 * Vérifie si l'utilisateur est déjà connecté et redirige vers la page d'accueil si c'est le cas en cas de rechargement de la page
 * Ajoute la classe nav-bold au lien de connexion si la page est la page de connexion
 * @param {Event} event - L'événement de chargement de la page
 */
document.addEventListener('DOMContentLoaded', (event) => {
    if(localStorage.getItem("userId") != null && window.location.href.includes("/login.html")){
        window.location = "./index.html"
    }
    if(window.location.href.includes("/login.html")){
        document.querySelector(".login").classList.add("nav-bold");
    }
});

/**
 * Gère le clic sur le bouton de connexion et vérifie les données saisies
 * @param {Event} event - L'événement de clic
 */
submitBtn.addEventListener('click', async (event) => {
    event.preventDefault();
    const emailRegex = /^[A-Za-z0-9_%+-]+(?:\.[A-Za-z0-9_%+-]+)*@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,}$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{6,}$/;
    errorBox.innerHTML = "";
    try{
        if(!emailRegex.test(emailElement.value)){
            emailElement.focus();
            throw new Error("Veuillez saisir une adresse e-mail valide.")
        }
        if(!passwordRegex.test(passwordElement.value)){
            passwordElement.focus();
            throw new Error("Veuillez saisir un mot de passe valide.")
        }
    } catch(error){
        errorBox.innerHTML = `<p>${error.message}</p>`;
        return;
    }

    const loginData = await loginUser(apiBaseUrl, emailElement.value, passwordElement.value, errorBox);
    if(loginData.userId != null && loginData.token != null && loginData.userId != undefined && loginData.token != undefined){
        saveAuth(loginData.userId, loginData.token);
        toggleLoginButton(document.querySelector(".login"));
        window.location = './index.html';
    }
});

/**
 * Gère le clic sur le lien de projets et redirige vers la page de projets
 * @param {Event} event - L'événement de clic
 */
projectsLink.addEventListener('click', () => {
    window.location = './index.html#portfolio';
});

/**
 * Gère le clic sur le lien de contact et redirige vers la page de contact
 * @param {Event} event - L'événement de clic
 */
contactLink.addEventListener('click', () => {
    window.location = './index.html#contact';
});

/**
 * Gère le clic sur le lien de l'index et redirige vers la page d'accueil
 * @param {Event} event - L'événement de clic
 */
indexLink.addEventListener('click', () => {
    window.location = './index.html';
});