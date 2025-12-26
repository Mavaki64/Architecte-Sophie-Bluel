import { getProjects, displayProjects } from "./works.js";
import { displayCategories, getCategories } from "./filters.js";

const apiBaseUrl = `http://localhost:5678/api/`;

document.addEventListener('DOMContentLoaded', async () => {
    const projects = await getProjects(apiBaseUrl);
    const categories = await getCategories(apiBaseUrl);

    displayProjects(projects);
    displayCategories(categories)
});