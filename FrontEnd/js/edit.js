import { displayCategories } from "./filters.js";
import { displayProjects } from "./works.js";
import { deleteProjectRequest, publishProjectRequest } from "./api.js";
import { isLogged } from "./auth.js";
import * as state from "./state.js";

/**
 * Toggle les éléments pour l'utilisateur connecté ou non
 */
export function toggleElementForLoggedUser(){
    if(isLogged()){
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
        displayCategories();
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
 */
export function displayProjectsInModal(){
    const modalGallery = document.querySelector(".modal-content-images");
    modalGallery.innerHTML = "";
    state.getProjects().forEach((project) => {
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
    });
}

/**
 * Supprime un projet via l'API et affiche les projets dans la galerie et le modal
 * @param {integer} id - L'ID du projet
 */
export async function deleteProject(id){
    const response = await deleteProjectRequest(id);
    if(response.ok){
        state.setProjects(state.getProjects().filter((project) => project.id !== id));
        displayProjects();
        displayProjectsInModal();
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
				<button><input type="file" name="image" id="photo" required><label for="photo">+ Ajouter
						photo</label></button>
				<span>jpg, png : 4mo max</span>
			</div>
			<div class="form-text-input">
				<div class="input-container">
					<label for="titre">Titre</label>
					<input type="text" name="title" id="titre" required>
				</div>
				<div class="input-container">
					<label for="categorie">Catégorie</label>
                    <div class="select-container">
                        <i class="fa-solid fa-chevron-down"></i>
					    <select name="category" id="categorie" required>
                        </select>
                    </div>
				</div>
            </div>
			<hr>
			<input type="submit" value="Valider" class="disabled-btn" disabled>
		</form>`;
    modalDisplayCategories();
}

/**
 * Affiche les catégories dans le select
 */
export function modalDisplayCategories() {
    const selectInput = document.querySelector("#categorie");
    selectInput.innerHTML = "";

    state.getCategories().forEach((categorie) =>{
        const optionElement = document.createElement("option");
        optionElement.innerText = categorie.name;
        optionElement.value = categorie.id;
        selectInput.append(optionElement);
    });

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

/**
 * Publie un nouveau projet via l'API et affiche les projets dans la galerie et le modal
 */
export async function publishNewProject(){
    const form = document.querySelector(".add-picture-form");
    const formData = new FormData(form);
    const response = await publishProjectRequest(formData);
    if (response.ok){
        state.setProjects([...state.getProjects(), await response.json()]);
        displayProjects();
        modalCreateForm();
    }
}