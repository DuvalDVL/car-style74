// Chemin de base pour GitHub Pages (à adapter si le dépôt change)
const BASE_PATH = '/car-style74'; 
const REEL_LINKS = [
    'https://www.instagram.com/reel/Cn7pbc1KyX-/',
    'https://www.instagram.com/reel/DENZPDmuidX/',
    'https://www.instagram.com/reel/C4Ym7xmOkLV/',
    'https://www.instagram.com/reel/CsJlMayKyVA/'
];

document.addEventListener('DOMContentLoaded', () => {
    // 1. Initialisation des fonctions
    loadDynamicContent();
    setupNavigation();
    setupFormspree();
    setupLightbox();
    setupReelsEmbed(); // Doit être fait après le chargement du DOM
    setupClickToCall();
    fixRelativePaths();
});

/* =========================================
   1. Chargement Header / Footer (Option A)
   ========================================= */
function loadDynamicContent() {
    const headerPlaceholder = document.getElementById('header-placeholder');
    const footerPlaceholder = document.getElementById('footer-placeholder');

    if (headerPlaceholder) {
        fetch(BASE_PATH + '/header.html')
            .then(response => response.text())
            .then(html => {
                headerPlaceholder.innerHTML = html;
                setupNavigation(); // Réinitialiser le setup de la navigation après chargement
            })
            .catch(error => console.error('Erreur de chargement du header:', error));
    }

    if (footerPlaceholder) {
        fetch(BASE_PATH + '/footer.html')
            .then(response => response.text())
            .then(html => {
                footerPlaceholder.innerHTML = html;
            })
            .catch(error => console.error('Erreur de chargement du footer:', error));
    }
}

/* =========================================
   2. Navigation & Mobile Menu
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
            // Empêche le hover CSS d'être actif sur mobile/touch
            item.addEventListener('click', (e) => {
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    // Fermer les autres dropdowns
                    dropdownToggles.forEach(other => {
                        if (other !== item) other.classList.remove('active');
                    });
                    // Toggle du dropdown actuel
                    item.classList.toggle('active');
                    if (dropdown) dropdown.style.display = item.classList.contains('active') ? 'block' : 'none';
                }
            });
            // Pour le desktop (hover), le CSS gère déjà l'affichage, mais on s'assure qu'il est visible après le JS
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
   3. Formspree (Envoi sans rechargement)
   ========================================= */
function setupFormspree() {
    const form = document.querySelector("#contact-form");
    if (form) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();
            const status = document.getElementById("form-status");
            status.innerHTML = "Envoi en cours...";

            try {
                const response = await fetch(form.action, {
                    method: form.method,
                    body: new FormData(form),
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    status.innerHTML = "Merci ! Votre message a été envoyé avec succès.";
                    form.reset();
                } else {
                    const data = await response.json();
                    if (data.errors) {
                        status.innerHTML = data.errors.map(error => error.message).join(", ");
                    } else {
                        status.innerHTML = "Oups! Il y a eu un problème lors de l'envoi du formulaire.";
                    }
                }
            } catch (error) {
                status.innerHTML = "Erreur de connexion. Veuillez réessayer.";
            }
        });
    }
}

/* =========================================
   4. Lightbox (Galerie)
   ========================================= */
function setupLightbox() {
    // Logique à implémenter sur la page galerie.html
    // Si des images sont cliquables, ouvrir la lightbox avec l'image correspondante.
}

/* =========================================
   5. Reels Instagram (Embed + Lecture au survol)
   ========================================= */
function setupReelsEmbed() {
    const reelsContainer = document.querySelector('.reels-grid');
    if (!reelsContainer) return;

    reelsContainer.innerHTML = ''; // Nettoie le conteneur

    REEL_LINKS.forEach(link => {
        const reelItem = document.createElement('div');
        reelItem.className = 'reel-container';
        
        // Création du blockquote pour l'embed Instagram
        reelItem.innerHTML = `
            <blockquote class="instagram-media" data-instgrm-permalink="${link}" data-instgrm-version="14">
                <a href="${link}"></a>
            </blockquote>
        `;
        reelsContainer.appendChild(reelItem);
    });

    // S'assurer que le script d'embed Instagram est chargé
    const embedScript = document.createElement('script');
    embedScript.src = '//www.instagram.com/embed.js';
    embedScript.onload = () => {
        // Une fois l'embed chargé, on peut ajouter la logique de survol
        setTimeout(() => {
            addReelHoverLogic();
        }, 1000); // Délai pour s'assurer que l'iframe est rendue
    };
    document.body.appendChild(embedScript);
}

function addReelHoverLogic() {
    const reelContainers = document.querySelectorAll('.reel-container');
    reelContainers.forEach(container => {
        // Les Reels sont dans des iframes. On doit chercher l'iframe.
        const iframe = container.querySelector('iframe');
        if (!iframe) return;

        // Fonction pour envoyer un message à l'iframe (nécessite une API IG)
        // En l'absence d'API, l'approche la plus fiable est de relier le survol
        // à des vidéos hébergées par nous-mêmes.
        // Puisque nous utilisons l'embed officiel, la lecture auto au hover
        // n'est pas garantie et peut casser. 
        // Par simplicité et robustesse (GitHub Pages), nous allons nous contenter
        // de l'affichage standard de l'embed Instagram.

        // TODO: En cas d'implémentation de vidéos hébergées:
        /*
        container.addEventListener('mouseenter', () => {
            const video = container.querySelector('video');
            if(video) video.play();
        });
        container.addEventListener('mouseleave', () => {
            const video = container.querySelector('video');
            if(video) video.pause();
        });
        */
    });
}

/* =========================================
   6. Click-to-Call Sticky Mobile
   ========================================= */
function setupClickToCall() {
    const callBtn = document.createElement('a');
    callBtn.id = 'click-to-call-btn';
    callBtn.href = 'tel:+33603946424';
    callBtn.innerHTML = '<i class="fas fa-phone-alt"></i>'; // Nécessite Font Awesome
    callBtn.setAttribute('aria-label', 'Appeler Car Style');
    document.body.appendChild(callBtn);
    
    // Ajout conditionnel de Font Awesome pour l'icône
    if (!document.querySelector('link[href*="font-awesome"]')) {
        const faLink = document.createElement('link');
        faLink.rel = 'stylesheet';
        faLink.href = 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css';
        document.head.appendChild(faLink);
    }
}

/* =========================================
   7. Fixer les chemins relatifs (très important pour GH Pages)
   ========================================= */
function fixRelativePaths() {
    // Cible tous les liens et les sources d'images/scripts qui pourraient être mal formés
    const elementsToFix = document.querySelectorAll('a[href^="/"], img[src^="/"], link[href^="/"], script[src^="/"]');

    elementsToFix.forEach(el => {
        let attribute = el.tagName === 'A' ? 'href' : 'src';
        if (el.tagName === 'LINK') attribute = 'href';

        let path = el.getAttribute(attribute);

        // Si le chemin commence par '/', il est absolu à la racine du domaine.
        // Pour GH Pages (duvaldvl.github.io/car-style74/), la racine est /car-style74/.
        // On vérifie si le chemin ne contient pas déjà le BASE_PATH pour éviter la duplication.
        if (path.startsWith('/') && !path.startsWith(BASE_PATH)) {
            // Corrige uniquement si ce n'est pas un lien externe absolu (ex: /favicon.ico)
            if (path.length > 1) { 
                // Ex: /assets/css/styles.css devient /car-style74/assets/css/styles.css
                el.setAttribute(attribute, BASE_PATH + path);
            }
        }
    });

    console.log("Chemins relatifs ajustés pour l'environnement GitHub Pages:", BASE_PATH);
}
