/**
 * Connecte l'utilisateur et sauvegarde les données d'authentification
 * @param {string} email - Adresse e-mail de l'utilisateur
 * @param {string} password - Mot de passe de l'utilisateur
 */
export async function loginUser(apiBaseUrl, email, password, errorBox){
    try{
        const response = await fetch(`${apiBaseUrl}users/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email,
                password
            })
        });
    
        if (!response.ok){
            throw new Error("Erreur d'authentification.\nE-mail ou mot de passe incorrect.");
        }
    
        const loginData = await response.json();
        return loginData;
    } catch(error){
        errorBox.innerHTML = `<p>${error.message}</p>`;
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
    if(localStorage.getItem("userId") != null && localStorage.getItem("token") != null){
        loginBtn.textContent = "logout";
    } else {
        loginBtn.textContent = "login";
    }
}

export function checkSessionExpiry(){
    const timeStamp = localStorage.getItem("timeStamp");
    const user_id = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    if(userId && token && timeStamp){
        const now = Date.now();
        const sessionAge = now - parseInt(timeStamp);
        const twentyFourHours = 24 * 60 * 60 * 1000;
        if(sessionAge > twentyFourHours){
            logout();
            window.location.reload();
        }
    }
}