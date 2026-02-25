const state = {
    projects: [],
    categories: [],
};

/**
 * Récupère les projets
 * @returns {Array<Object>} Un tableau d'objets représentant les projets
 */
export function getProjects() {
    return state.projects;
}

/**
 * Récupère les catégories
 * @returns {Array<Object>} Un tableau d'objets représentant les catégories
 */
export function getCategories() {
    return state.categories;
}

/**
 * Définit les projets
 * @param {Array<Object>} projects - Un tableau d'objets représentant les projets
 */
export function setProjects(projects) {
    state.projects = projects;
}

/**
 * Définit les catégories
 * @param {Array<Object>} categories - Un tableau d'objets représentant les catégories
 */
export function setCategories(categories) {
    state.categories = categories;
}