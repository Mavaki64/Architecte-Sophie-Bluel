import { apiBaseUrl } from "./config.js";
import { getToken } from "./auth.js";

/**
 * Effectue une requête à l'API
 * @param {string} path - Le chemin de la requête
 * @param {Object} options - Les options de la requête.
 * @param {string} options.method - La méthode de la requête par défaut GET
 * @param {boolean} options.auth - Si la requête nécessite une authentification par défaut false
 * @param {Object} options.body - Le corps de la requête par défaut null
 * @returns {Promise<Response>} La réponse de la requête
 */
async function request(path, options = {method: "GET", auth: false, body: null}){
    const url = `${apiBaseUrl}${path}`;
    let headers = {};
    if(options.auth){
        const token = getToken();
        if(!token) throw new Error("Vous n'êtes pas connecté.");
        
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

/**
 * Effectue une requête de login à l'API
 * @param {string} email - L'email de l'utilisateur
 * @param {string} password - Le mot de passe de l'utilisateur
 * @returns {Promise<Object>} Les données de l'utilisateur
 */
export async function loginRequest(email, password){
    const response = await request("users/login", {
        method: "POST", 
        body: {email, password}
    });
    if (!response.ok){
        throw new Error("Erreur d'authentification.\nE-mail ou mot de passe incorrect.");
    }
    return response.json();
}

/**
 * Effectue une requête de  récupération des projets à l'API
 * @param {integer} id - L'ID du projet. Si id est null, tout les projets sont récupérés.
 * @returns {Promise<Object>} Les données du/des projets.
 */
export function projectsRequest(id = null){
    return request(id != null ? `works/${id}` : "works").then(response => response.json());
}

/**
 * Effectue une requête de récupération des catégories à l'API
 * @returns {Promise<Object>} Les données des catégories.
 */
export function categoriesRequest(){
    return request("categories").then(response => response.json());
}

/**
 * Effectue une requête de suppression d'un projet à l'API
 * @param {integer} id - L'ID du projet à supprimer
 * @returns {Promise<Object>} Les données du projet supprimé
 */
export async function deleteProjectRequest(id){
    const response = await request(`works/${id}`, {
        method: "DELETE",
        auth: true
    });
    return response;
}

/**
 * Effectue une requête de publication d'un projet à l'API
 * @param {Object} project - FormData contenant les données du projet
 * @returns {Promise<Object>} Les données du projet publié
 */
export async function publishProjectRequest(formData){
    const response = await request("works", {
        method: "POST",
        auth: true,
        body: formData
    });
    return response;
}