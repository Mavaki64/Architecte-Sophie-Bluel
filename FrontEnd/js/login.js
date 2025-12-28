import { loginUser, saveAuth, toggleLoginButton } from "./auth.js";

const submitBtn = document.querySelector(`input[type="submit"]`)
const apiBaseUrl = `http://localhost:5678/api/`;
const emailElement = document.querySelector("#email");
const passwordElement = document.querySelector("#password");
const errorBox = document.querySelector(".error-box")

/**
 * Vérifie si l'utilisateur est déjà connecté et redirige vers la page d'accueil si c'est le cas en cas de rechargement de la page
 * @param {Event} event - L'événement de chargement de la page
 */
document.addEventListener('DOMContentLoaded', (event) => {
    if(localStorage.getItem("userId") != null && window.location.href.includes("/login.html")){
        window.location = "./index.html"
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