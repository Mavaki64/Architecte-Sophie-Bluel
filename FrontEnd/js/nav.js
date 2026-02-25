import { toggleLoginButton } from "./auth.js";
/**
 * Initialise les liens de navigation (index, projets, contact).
 * @param {Object} options - Options d'initialisation
 * @param {boolean} [options.setActiveLink] - Si true (page index), met en avant le lien actif selon le hash et au clic
 */
export function initNavLinks(options = {}) {
    
    const indexLink = document.querySelector(".index-link");
    const projectsLink = document.querySelector(".projects-link");
    const contactLink = document.querySelector(".contact-link");
    const loginBtn = document.querySelector(".login");

    toggleLoginButton(loginBtn);

    function removeNavBoldClass() {
        projectsLink?.classList.remove("nav-bold");
        contactLink?.classList.remove("nav-bold");
    }

    function setActiveLinkFromHash() {
        removeNavBoldClass();
        const hash = window.location.hash;
        if (hash === "#portfolio") projectsLink?.classList.add("nav-bold");
        else if (hash === "#contact") contactLink?.classList.add("nav-bold");
    }

    loginBtn?.addEventListener("click", () => {
        if (loginBtn.textContent.includes("login")) {
            window.location.href = "./login.html";
        } else {
            if (options.onLogout) options.onLogout();
        }
    });

    indexLink?.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "./index.html";
    });

    projectsLink?.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "./index.html#portfolio";
        if (options.setActiveLink) {
            removeNavBoldClass();
            projectsLink?.classList.add("nav-bold");
        }
    });

    contactLink?.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "./index.html#contact";
        if (options.setActiveLink) {
            removeNavBoldClass();
            contactLink?.classList.add("nav-bold");
        }
    });

    if (options.setActiveLink) setActiveLinkFromHash();

    // Sur la page login, mettre en avant le lien "login"
    if (window.location.href.includes("/login.html")) document.querySelector(".login")?.classList.add("nav-bold");
}
