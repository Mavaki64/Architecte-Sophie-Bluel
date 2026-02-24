import { apiBaseUrl } from "./config.js";

async function request(path, options = {method: "GET", auth: false, body: null}){
    const url = `${apiBaseUrl}${path}`;
    let headers = {};
    if(options.auth){
        const token = getToken();
        if(!token){
            throw new Error("Vous n'êtes pas connecté.");
        }
        headers = {
            "Authorization": `Bearer ${token}`
        }
    }

    if (options.body && !(options.body instanceof FormData)){
        headers = {
            ...headers,
            "Content-Type": "application/json"
        }
        options.body = JSON.stringify(options.body);
    }

    try{
        const response = await fetch(url, {
            /**
             * Si options.method n'est pas défini, j'utilise GET par défaut
             * Sinon, j'utilise la méthode définie dans options.method
             * Si je passe passe un objet options sans method, method sera undefined et ?? "GET" sera utilisé
             */
            method: options.method ?? "GET",
            headers,
            body: options.body
        });
        return response;
    } catch(error){
        throw new Error(`Erreur lors de la requête: ${error.message}`);
    }
}

export async function loginApi(email, password){
    const response = await request("users/login", {
        method: "POST", 
        body: {email, password}
    });
    if (!response.ok){
        throw new Error("Erreur d'authentification.\nE-mail ou mot de passe incorrect.");
    }
    return response.json();
}