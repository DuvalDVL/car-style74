// Chemin de base pour GitHub Pages (à adapter si le dépôt change)
const BASE_PATH = '/car-style74'; 
const REEL_LINKS = [
    'https://www.instagram.com/reel/Cn7pbc1KyX-/',
    'https://www.instagram.com/reel/DENZPDmuidX/',
    'https://www.instagram.com/reel/C4Ym7xmOkLV/',
    'https://www.instagram.com/reel/CsJlMayKyVA/'
];

document.addEventListener('DOMContentLoaded', () => {
    // 1. Chargement dynamique du Header/Footer
    loadDynamicContent();
    
    // 2. Initialisation des fonctions dépendant du DOM statique
    setupFormspree();
    setupLightbox();
    setupReelsEmbed(); 
    setupClickToCall();
    fixRelativePaths(); // IMPORTANT : Corrige les chemins après le chargement du Header/Footer
});

/* =========================================
   1. Chargement Header / Footer
   ========================================= */
function loadDynamicContent() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');

    // Chargement du Header
    if (headerPlaceholder) {
        // Le chemin doit être absolu à la racine du dépôt GitHub Pages
        fetch(BASE_PATH + '/header.html')
            .then(response => {
                if (!response.ok) throw new Error('Header load failed: ' + response.statusText);
                return response.text();
            })
            .then(html => {
                headerPlaceholder.innerHTML = html;
                // La navigation doit être configurée APRÈS l'injection du Header
                setupNavigation(); 
            })
            .catch(error => console.error('Erreur de chargement du header:', error));
    }

    // Chargement du Footer
    if (footerPlaceholder) {
        fetch(BASE_PATH + '/footer.html')
            .then(response => {
                if (!response.ok) throw new Error('Footer load failed: ' + response.statusText);
                return response.text();
            })
            .then(html => {
                footerPlaceholder.innerHTML = html;
            })
            .catch(error => console.error('Erreur de chargement du footer:', error));
    }
}

/* =========================================
   2. Navigation & Mobile Menu (Inchangé)
   ========================================= */
function setupNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const dropdownToggles = document.querySelectorAll('.nav-item.has-dropdown');

    if (hamburger && navMenu) {
        // Toggle menu mobile
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });

        // Gestion des sous-menus au clic (pour mobile)
        dropdownToggles.forEach(item => {
            const dropdown = item.querySelector('.dropdown-menu');
            item.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    dropdownToggles.forEach(other => {
                        if (other !== item) other.classList.remove('active');
                    });
                    item.classList.toggle('active');
                    if (dropdown) dropdown.style.display = item.classList.contains('active') ? 'block' : 'none';
                }
            });
            if (window.innerWidth > 768) {
                item.addEventListener('mouseover', () => {
                    if (dropdown) dropdown.style.display = 'block';
                });
                item.addEventListener('mouseout', () => {
                    if (dropdown) dropdown.style.display = 'none';
                });
            }
        });
    }
}

/* =========================================
   3. à 6. Fonctions inchangées pour Formspree, Reels, Call-to-action
   ========================================= */
function setupFormspree() { /* ... inchangé ... */ }
function setupLightbox() { /* ... inchangé ... */ }
function setupReelsEmbed() { /* ... inchangé ... */ }
function addReelHoverLogic() { /* ... inchangé ... */ }
function setupClickToCall() { /* ... inchangé ... */ }


/* =========================================
   7. Fixer les chemins relatifs (très important pour GH Pages)
   ========================================= */
function fixRelativePaths() {
    // Cible uniquement les ancres (liens internes) et les images/ressources qui sont chargées après le CSS initial
    const elementsToFix = document.querySelectorAll('a[href^="/"], img[src^="/"]');

    elementsToFix.forEach(el => {
        let attribute = el.tagName === 'A' ? 'href' : 'src';
        let path = el.getAttribute(attribute);

        // Si le chemin commence par '/', il est absolu à la racine du domaine (ex: /assets/images/...)
        // On vérifie si le chemin ne contient pas déjà le BASE_PATH
        if (path.startsWith('/') && !path.startsWith(BASE_PATH)) {
            if (path.length > 1) { 
                // Ex: /assets/css/styles.css devient /car-style74/assets/css/styles.css
                el.setAttribute(attribute, BASE_PATH + path);
            }
        }
    });

    console.log("Chemins relatifs ajustés pour l'environnement GitHub Pages:", BASE_PATH);
}
