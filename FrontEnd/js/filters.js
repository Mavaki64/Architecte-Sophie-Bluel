/**
 * Récupère les catégories depuis l'API
 * @param {string} apiBaseUrl - L'URL de l'API
 * @returns {Promise<Array<Object>>} Un tableau d'objets représentant les catégories
 */
export async function getCategories(apiBaseUrl) {
    if (!apiBaseUrl){
        throw new Error(`Aucune URL n'a été fournie pour fetch les données.`);
    }
    const response = await fetch(`${apiBaseUrl}categories`);
    if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
    }
    const categories = await response.json();
    return categories;
}

/**
 * Affiche les catégories dans le filtre en créant les éléments HTML
 * @param {Array<Object>} categories - Un tableau d'objets représentant les catégories à afficher
 */
export function displayCategories(categories) {
    const filtersContainer = document.querySelector(".filter");
    filtersContainer.innerHTML = "";
    for (let i = 0; i < categories.length; i++) {
        const filter = categories[i];
        const filterElement = document.createElement("a");
        filterElement.href = "#";
        filterElement.innerText = filter.name;
        filterElement.classList = "filter-item";
        filterElement.dataset.filterId = filter.id;
        filtersContainer.append(filterElement);
    }

    const filterElement = document.createElement("a");
    filterElement.href = "#";
    filterElement.innerText = "Tous";
    filterElement.classList = "filter-item active";
    filterElement.dataset.filterId = 0;
    filtersContainer.prepend(filterElement);
}

/**
 * Filtre les projets par catégorie
 * @param {Object} clickedBtn - L'élément HTML du bouton cliqué
 * @param {Array<Object>} projects - Un tableau d'objets représentant les projets
 * @returns {Array<Object>} Un tableau d'objets représentant les projets filtrés ou tous les projets si la catégorie est 0
 */
export function filterByCategory(clickedBtn, projects) {
    const filterElement = document.querySelectorAll(".filter-item");
    filterElement.forEach(element => {
        element.classList.remove("active");
    });
    clickedBtn.classList.add("active");
    const categoryId = clickedBtn.dataset.filterId;

    if(categoryId == 0){
        return projects;
    }
    else{
        const filteredProjects = projects.filter((project) => project.categoryId == categoryId);
        return filteredProjects;
    }
}