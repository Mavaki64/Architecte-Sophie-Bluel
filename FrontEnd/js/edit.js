import { displayCategories } from "./filters.js";
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