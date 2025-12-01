// Chemin de base pour GitHub Pages (à adapter si le dépôt change)
const BASE_PATH = '/car-style74'; 
const REEL_LINKS = [
    // ... liens inchangés ...
];

document.addEventListener('DOMContentLoaded', () => {
    // 1. Le chargement dynamique doit se faire en premier
    loadDynamicContent();
    
    // Les autres fonctions qui ne dépendent pas du header/footer chargé dynamiquement
    setupFormspree();
    setupLightbox();
    setupReelsEmbed(); 
    setupClickToCall();
    // NOTE: fixRelativePaths est maintenant appelé après le chargement du Footer (voir loadDynamicContent)
});

/* =========================================
   1. Chargement Header / Footer
   ========================================= */
function loadDynamicContent() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');
    let headerLoaded = false;
    let footerLoaded = false;

    const checkAllLoaded = () => {
        // Exécuter fixRelativePaths et setupNavigation seulement APRÈS le chargement du Header ET Footer
        if (headerLoaded && footerLoaded) {
            fixRelativePaths(); // Corrige TOUS les liens une fois que tout le contenu est là
            setupNavigation();
        }
    };

    // Chargement du Header
    if (headerPlaceholder) {
        fetch(BASE_PATH + '/header.html')
            .then(response => {
                if (!response.ok) throw new Error('Header load failed: ' + response.statusText);
                return response.text();
            })
            .then(html => {
                headerPlaceholder.innerHTML = html;
                headerLoaded = true;
                checkAllLoaded();
            })
            .catch(error => console.error('Erreur de chargement du header:', error));
    } else {
        headerLoaded = true;
        checkAllLoaded();
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
                footerLoaded = true;
                checkAllLoaded();
            })
            .catch(error => console.error('Erreur de chargement du footer:', error));
    } else {
        footerLoaded = true;
        checkAllLoaded();
    }
}

/* =========================================
   7. Fixer les chemins relatifs (amélioré pour GH Pages)
   ========================================= */
function fixRelativePaths() {
    // Cible tous les liens et les sources qui commencent par '/' (racine absolue)
    const elementsToFix = document.querySelectorAll('a[href^="/"], img[src^="/"], link[href^="/"], script[src^="/"]');

    elementsToFix.forEach(el => {
        let attribute = el.tagName === 'A' ? 'href' : (el.tagName === 'LINK' ? 'href' : 'src');
        let path = el.getAttribute(attribute);

        // S'assure que le chemin est corrigé pour l'environnement GH Pages
        if (path.startsWith('/') && !path.startsWith(BASE_PATH) && !path.startsWith('//')) {
            // Cas spécial pour la racine (ex: href="/") qui doit devenir /car-style74/
            if (path === '/') {
                el.setAttribute(attribute, BASE_PATH + '/');
            } else if (path.length > 1) {
                el.setAttribute(attribute, BASE_PATH + path);
            }
        }
    });

    console.log("Chemins relatifs ajustés pour l'environnement GitHub Pages:", BASE_PATH);
}

// ... Les autres fonctions (setupNavigation, setupFormspree, etc.) restent inchangées ...
