import {getProjects, displayProjects} from "./works.js";

const apiBaseUrl = `http://localhost:5678/api/`;

document.addEventListener('DOMContentLoaded', async () => {
    const projects = await getProjects(apiBaseUrl);
    displayProjects(projects);
});