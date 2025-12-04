/* ================================================
   CAR STYLE 74 - SYSTÈME DE TRADUCTION
   ================================================ */

const BASE_PATH = '/car-style74';

// Langue par défaut
let currentLanguage = localStorage.getItem('car-style74-lang') || 'fr';
let translations = {};

// Charger les traductions au démarrage
async function loadTranslations(lang) {
  try {
    const response = await fetch(`${BASE_PATH}/assets/lang/${lang}.json`);
    if (!response.ok) throw new Error(`Erreur chargement ${lang}.json`);
    translations = await response.json();
    console.log(`✅ Traductions ${lang.toUpperCase()} chargées`);
    return translations;
  } catch (error) {
    console.error(`❌ Erreur chargement traductions ${lang}:`, error);
    // Fallback sur français si erreur
    if (lang !== 'fr') {
      return loadTranslations('fr');
    }
    return {};
  }
}

// Appliquer les traductions sur la page
function applyTranslations() {
  const elements = document.querySelectorAll('[data-translate]');
  
  elements.forEach(element => {
    const key = element.getAttribute('data-translate');
    
    if (translations[key]) {
      // Si c'est un input/textarea, traduire le placeholder
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        if (element.hasAttribute('placeholder')) {
          element.placeholder = translations[key];
        } else {
          element.value = translations[key];
        }
      }
      // Si c'est un button
      else if (element.tagName === 'BUTTON') {
        element.textContent = translations[key];
      }
      // Pour le reste (span, p, h1, etc.)
      else {
        // Préserver le HTML (utile pour les <br>)
        if (translations[key].includes('<br>')) {
          element.innerHTML = translations[key];
        } else {
          element.textContent = translations[key];
        }
      }
    } else {
      console.warn(`⚠️ Traduction manquante pour: ${key}`);
    }
  });
  
  console.log(`✅ ${elements.length} éléments traduits en ${currentLanguage.toUpperCase()}`);
}

// Changer la langue
async function changeLanguage(lang) {
  if (lang === currentLanguage) {
    console.log(`ℹ️ Langue déjà active: ${lang}`);
    return;
  }
  
  console.log(`🌐 Changement de langue: ${currentLanguage} → ${lang}`);
  
  // Charger les nouvelles traductions
  await loadTranslations(lang);
  
  // Sauvegarder le choix
  currentLanguage = lang;
  localStorage.setItem('car-style74-lang', lang);
  
  // Appliquer les traductions
  applyTranslations();
  
  // Mettre à jour l'affichage des sélecteurs de langue
  updateLanguageSelectors(lang);
  
  // Mettre à jour le titre de la page
  updatePageTitle(lang);
}

// Mettre à jour l'affichage des sélecteurs
function updateLanguageSelectors(lang) {
  // Desktop selector
  const desktopOptions = document.querySelectorAll('.language-selector.desktop-only .language-option');
  const desktopToggle = document.querySelector('.language-selector.desktop-only .current-language');
  
  desktopOptions.forEach(opt => {
    opt.classList.toggle('active', opt.dataset.lang === lang);
  });
  
  if (desktopToggle) {
    desktopToggle.textContent = lang.toUpperCase();
  }
  
  // Mobile selector (sticky)
  const mobileOptions = document.querySelectorAll('.sticky-language-button .sticky-lang-option');
  const mobileFlag = document.querySelector('.sticky-language-button .current-flag');
  
  mobileOptions.forEach(opt => {
    opt.classList.toggle('active', opt.dataset.lang === lang);
    if (opt.dataset.lang === lang && mobileFlag) {
      mobileFlag.textContent = opt.querySelector('.language-flag').textContent;
    }
  });
}

// Mettre à jour le titre de la page
function updatePageTitle(lang) {
  const titles = {
    'fr': 'Car Style 74 - Detailing Automobile Premium | Combloux, Megève',
    'en': 'Car Style 74 - Premium Automotive Detailing | Combloux, Megève',
    'de': 'Car Style 74 - Premium Autodetailing | Combloux, Megève',
    'it': 'Car Style 74 - Detailing Auto Premium | Combloux, Megève'
  };
  
  if (titles[lang]) {
    document.title = titles[lang];
  }
}

// Initialiser le système de traduction
async function initTranslations() {
  console.log('🌍 Initialisation du système de traduction...');
  
  // Charger les traductions de la langue active
  await loadTranslations(currentLanguage);
  
  // Appliquer les traductions
  applyTranslations();
  
  // Mettre à jour les sélecteurs
  updateLanguageSelectors(currentLanguage);
  
  // Mettre à jour le titre
  updatePageTitle(currentLanguage);
  
  console.log(`✅ Système de traduction initialisé (langue: ${currentLanguage.toUpperCase()})`);
}

// Exporter pour utilisation dans main.js
window.TranslationSystem = {
  init: initTranslations,
  change: changeLanguage,
  getCurrentLanguage: () => currentLanguage,
  getTranslations: () => translations
};
