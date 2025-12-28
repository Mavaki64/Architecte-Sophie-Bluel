import { displayCategories } from "./filters.js";
import { getProjects, displayProjects } from "./works.js";

/**
 * Toggle les éléments pour l'utilisateur connecté ou non
 * @param {boolean} isLogged - True si l'utilisateur est connecté, false sinon
 * @param {Array<Object>} categories - les catégories
 */
export function toggleElementForLoggedUser(isLogged, categories){
    if(isLogged){
        document.body.style.paddingTop = `59px`;
        createEditBar();
        const filtersContainer = document.querySelector(".filter");
        filtersContainer.innerHTML = "";
        createEditBtn();
    }else{
        document.body.style.paddingTop = `0px`;
        const editBar = document.querySelector(".edit-bar");
        if(editBar){
            editBar.remove();
        }
        const editBtn = document.querySelector(".edit-btn");
        if(editBtn){
            editBtn.remove();
        }
        displayCategories(categories);
    }
}

/**
 * Crée la barre de modification
 */
export function createEditBar(){
    const editBar = document.createElement("section");
    editBar.classList.add("edit-bar");
    document.body.prepend(editBar);
    const logoElement = document.createElement("i");
    const textElement = document.createElement("span");
    logoElement.classList.add("fa-regular", "fa-pen-to-square");
    textElement.textContent = "Mode édition";
    editBar.append(logoElement, textElement);
}

/**
 * Crée le bouton de modification
 */
export function createEditBtn(){
    const editBtnContainer = document.querySelector(".portfolio-header");
    const editBtn = document.createElement("p");
    const editBtnIcon = document.createElement("i");
    editBtnIcon.classList.add("fa-regular", "fa-pen-to-square");
    editBtn.textContent = "modifier";
    editBtn.classList.add("edit-btn");
    editBtnContainer.append(editBtn);
    editBtn.prepend(editBtnIcon);
}

/**
 * Vérifie si l'utilisateur est connecté
 * @returns {boolean} True si l'utilisateur est connecté, false sinon
 */
export function isLogged(){
    const user_id = localStorage.getItem("userId");
    const token = localStorage.getItem("token");
    let isLogged;
    if(user_id != null && token != null){
        isLogged = true;
        return isLogged;
    } else {
        isLogged = false;
        return isLogged
    }
}

export function initializeModal(){
    const modal = document.querySelector("#modal");
    modal.innerHTML = "";
    modal.innerHTML = `<div class="modal-content">
			<i class="fa-solid fa-xmark fa-2x modal-close-btn"></i>
			<h3>Galerie photo</h3>
			<div class="modal-content-images">
			</div>
			<hr>
			<button class="modal-content-button">Ajouter une photo</button>
		</div>`;
}

/**
 * Affiche les projets dans le modal
 * @param {Array<Object>} projects - les projets
 */
export function displayProjectsInModal(projects){
    const modalGallery = document.querySelector(".modal-content-images");
    modalGallery.innerHTML = "";
    for (let i = 0; i < projects.length; i++) {
        const project = projects[i];
        const projectElement = document.createElement("div");
        projectElement.classList.add('modal-content-project');
        const imageElement = document.createElement("img");
        imageElement.src = project.imageUrl;
        imageElement.alt = project.title;
        const deleteBtn = document.createElement("i");
        deleteBtn.classList.add("fa-solid", "fa-trash-can");
        deleteBtn.addEventListener("click", () => {
            deleteProject(project.id);
        });
        projectElement.append(imageElement, deleteBtn);
        modalGallery.append(projectElement);
    }
}

/**
 * Supprime un projet via l'API et affiche les projets dans la galerie et le modal
 * @param {integer} id - L'ID du projet
 */
export async function deleteProject(id){
    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
        method: "DELETE",
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    });
    if(response.ok){
        const apiBaseUrl = "http://localhost:5678/api/";
        const projects = await getProjects(apiBaseUrl);
        displayProjects(projects);
        displayProjectsInModal(projects);
    }
}

/**
 * Crée le formulaire d'ajout de photo
 */
export function modalCreateForm(){
    const modalContent = document.querySelector(".modal-content");
    modalContent.innerHTML = `<i class="fa-solid fa-xmark fa-2x modal-close-btn"></i>
			<i class="fa-solid fa-arrow-left fa-2x modal-back-btn"></i>
			<h3>Ajout photo</h3>
			<form action="#" class="add-picture-form">
				<div class="file-input-container">
					<i class="fa-regular fa-image fa-6x"></i>
					<button><input type="file" name="photo" id="photo" required><label for="photo">+ Ajouter
							photo</label></button>
					<span>jpg, png : 4mo max</span>
				</div>
				<div class="form-text-input">
					<div class="input-container">
						<label for="titre">Titre</label>
						<input type="text" name="titre" id="titre" required>
					</div>
					<div class="input-container">
						<label for="categorie">Catégorie</label>
                        <div class="select-container">
                            <i class="fa-solid fa-chevron-down"></i>
						    <select name="categorie" id="categorie" required>
                            </select>
                        </div>
					</div>
                </div>
				<hr>
				<input type="submit" value="Valider" class="disabled-btn" disabled>
			</form>`;
}

/**
 * Affiche les catégories dans le select
 * @param {Array<Object>} categories - les catégories
 */
export function modalDisplayCategories(categories) {
    const selectInput = document.querySelector("#categorie");
    selectInput.innerHTML = "";
    
    for (let i = 0; i < categories.length; i++) {
        const categorie = categories[i];
        const optionElement = document.createElement("option");
        optionElement.innerText = categorie.name;
        optionElement.value = categorie.id;
        selectInput.append(optionElement);
    }

    const optionElement = document.createElement("option");
    optionElement.innerText = "";
    optionElement.value = "";
    optionElement.selected = true;
    optionElement.disabled = true;
    selectInput.prepend(optionElement);
}

/**
 * Affiche l'image dans le file input container
 * @param {File} file - le fichier
 */
export function modalDisplayPictureFromInput(file) {
    const fileInputContainer = document.querySelector(".file-input-container");
    const btnElement = document.querySelector(".file-input-container button");
    btnElement.style.opacity = "0";
    btnElement.style.pointerEvents = "none";
    const imageElement = document.createElement("img");
    imageElement.src = URL.createObjectURL(file);
    imageElement.alt = file.name;
    fileInputContainer.append(imageElement);
}

/**
 * Vérifie si le formulaire est valide
 */
export function modalCheckFormValidity() {
    const submitBtn = document.querySelector(".add-picture-form input[type='submit']");
    const fileInput = document.querySelector("#photo");
    const titleInput = document.querySelector("#titre");
    const categorieInput = document.querySelector("#categorie");
    if(titleInput.value.trim() === "" || categorieInput.value === "" || fileInput.value === "") {
        submitBtn.classList.add("disabled-btn");
        submitBtn.disabled = true;
    } else {
        submitBtn.classList.remove("disabled-btn");
        submitBtn.disabled = false;
    }
}