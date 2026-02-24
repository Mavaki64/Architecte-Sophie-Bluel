import { loginApi } from "./api.js";

/**
 * Connecte l'utilisateur et sauvegarde les données d'authentification
 * @param {string} email - Adresse e-mail de l'utilisateur
 * @param {string} password - Mot de passe de l'utilisateur
 */
export async function loginUser(email, password, errorBox){
    try{
        const loginData = await loginApi(email, password);
        return loginData;
    } catch(error){
        if (errorBox) {
            errorBox.innerHTML = `<p>${error.message}</p>`;
        }
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
    if(isLogged()){
        loginBtn.textContent = "logout";
    } else {
        loginBtn.textContent = "login";
    }
}

export function checkSessionExpiry(){
    const timeStamp = localStorage.getItem("timeStamp");
    const user_id = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if(user_id && token && timeStamp){
        const now = Date.now();
        const sessionAge = now - parseInt(timeStamp);
        const twentyFourHours = 24 * 60 * 60 * 1000;
        if(sessionAge > twentyFourHours){
            logout();
            window.location.reload();
        }
    }
}


/** Nouvelle fonction **/
export function getToken(){
    return localStorage.getItem("token");
}

export function isLogged(){
    return localStorage.getItem("userId") != null && localStorage.getItem("token") != null;
}