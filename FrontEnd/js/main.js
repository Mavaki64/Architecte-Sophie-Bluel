import { getProjects, displayProjects } from "./works.js";
import { displayCategories, getCategories, filterByCategory } from "./filters.js";

const apiBaseUrl = `http://localhost:5678/api/`;
const filterContainer = document.querySelector(".filter");
let projects;
let categories;

document.addEventListener('DOMContentLoaded', async () => {
    projects = await getProjects(apiBaseUrl);
    categories = await getCategories(apiBaseUrl);
    displayProjects(projects);
    displayCategories(categories);
});

filterContainer.addEventListener('click', (event) => {
    if(event.target.classList.contains("filter-item active")){
        event.preventDefault();
    }
    else if(event.target.classList.contains("filter-item")){
        event.preventDefault();
        const clickedBtn = event.target;
        const filteredProjects = filterByCategory(clickedBtn, projects);
        displayProjects(filteredProjects);
    }
});