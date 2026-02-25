import { categoriesRequest } from "./api.js";
import * as state from "./state.js";

/**
 * Récupère les catégories depuis l'API
 * @returns {Promise<Array<Object>>} Un tableau d'objets représentant les catégories
 */
export async function fetchCategories() {
	state.setCategories(await categoriesRequest());
}

/**
 * Affiche les catégories dans le filtre en créant les éléments HTML
 */
export function displayCategories() {
	const filtersContainer = document.querySelector(".filter");
	filtersContainer.innerHTML = "";
	for (let i = 0; i < state.getCategories().length; i++) {
		const filter = state.getCategories()[i];
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
 * @returns {Array<Object>} Un tableau d'objets représentant les projets filtrés ou tous les projets si la catégorie est 0
 */
export function filterByCategory(clickedBtn) {
	const filterElement = document.querySelectorAll(".filter-item");
	filterElement.forEach((element) => {
		element.classList.remove("active");
	});
	clickedBtn.classList.add("active");
	const categoryId = clickedBtn.dataset.filterId;

	return categoryId == 0
		? state.getProjects()
		: state.getProjects().filter((project) => project.categoryId == categoryId);
}
