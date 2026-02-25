import { loginRequest } from "./api.js";

/**
 * Connecte l'utilisateur et sauvegarde les données d'authentification
 * @param {string} email - Adresse e-mail de l'utilisateur
 * @param {string} password - Mot de passe de l'utilisateur
 */
export async function loginUser(email, password, errorBox){
    try{
        const loginData = await loginRequest(email, password);
        return loginData;
    } catch(error){
        if (errorBox) errorBox.innerHTML = `<p>${error.message}</p>`;
        return null;
    }
}

/**
 * Sauvegarde les données d'authentification dans le localStorage
 * @param {string} userId - ID de l'utilisateur
 * @param {string} token - Jeton d'authentification
 */
export function saveAuth(userId, token){
    localStorage.setItem("userId", userId);
    localStorage.setItem("token", token)
    localStorage.setItem("timeStamp", Date.now());
}

/**
 * Supprime les données d'authentification du localStorage
 */
export function logout(){
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("timeStamp");
}

/**
 * Modifie le texte du bouton de connexion en fonction de l'état de l'authentification
 * @param {Element} loginBtn - Le bouton de connexion
 */
export function toggleLoginButton(loginBtn){
    loginBtn.textContent = isLogged() ? "logout" : "login";
}

/**
 * Récupère le token d'authentification du localStorage
 * @returns {string} Le token d'authentification
 */
export function getToken(){
    return localStorage.getItem("token");
}

/**
 * Vérifie si l'utilisateur est connecté
 * @returns {boolean} True si l'utilisateur est connecté, false sinon
 */
export function isLogged(){
    return localStorage.getItem("userId") && getToken();
}

/**
 * Vérifie si la session est expirée et la déconnecte si c'est le cas
 */
export function checkSessionExpiry(){
    const timeStamp = localStorage.getItem("timeStamp");
    if(!localStorage.getItem("userId") || !getToken() || !timeStamp) return;

    const sessionAge = Date.now() - parseInt(timeStamp);
    const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;
    if(sessionAge > SESSION_DURATION_MS){
        logout();
        window.location.reload();
    }
}