/* ================================================
   CAR STYLE 74 - SYSTÈME DE TRADUCTION (AMÉLIORÉ)
   ================================================ */

// Langue par défaut
let currentLanguage = localStorage.getItem('car-style74-lang') || 'fr';
let translations = {};

// Charger les traductions au démarrage
async function loadTranslations(lang) {
  try {
    const response = await fetch(`${BASE_PATH}/assets/lang/${lang}.json`);
    if (!response.ok) throw new Error(`Erreur chargement ${lang}.json`);
    
    const text = await response.text();
    
    // Vérifier si le JSON est valide avant de le parser
    try {
      translations = JSON.parse(text);
      console.log(`✅ Traductions ${lang.toUpperCase()} chargées`);
      return translations;
    } catch (parseError) {
      console.error(`❌ Erreur de parsing JSON pour ${lang}:`, parseError);
      console.error(`Position de l'erreur: ${parseError.message}`);
      
      // Afficher un extrait du JSON autour de l'erreur
      const errorPosition = parseError.message.match(/position (\d+)/);
      if (errorPosition) {
        const pos = parseInt(errorPosition[1]);
        const start = Math.max(0, pos - 100);
        const end = Math.min(text.length, pos + 100);
        console.error('Extrait du JSON autour de l\'erreur:');
        console.error(text.substring(start, end));
      }
      
      throw parseError;
    }
  } catch (error) {
    console.error(`❌ Erreur chargement traductions ${lang}:`, error);
    // Fallback sur français si erreur
    if (lang !== 'fr') {
      console.warn(`⚠️ Tentative de chargement du français en fallback...`);
      return loadTranslations('fr');
    }
    return {};
  }
}

// Fonction utilitaire pour accéder aux propriétés imbriquées
function getNestedTranslation(obj, key) {
  // Si la clé contient un point, c'est une clé imbriquée (ex: "cleaning.hero-title")
  if (key.includes('.')) {
    const keys = key.split('.');
    let value = obj;
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return null;
      }
    }
    return value;
  }
  // Sinon, chercher directement dans l'objet
  return obj[key] || null;
}

// Appliquer les traductions sur la page
function applyTranslations() {
  const elements = document.querySelectorAll('[data-translate]');
  let translatedCount = 0;
  let missingCount = 0;
  
  elements.forEach(element => {
    const key = element.getAttribute('data-translate');
    
    // Chercher la traduction (support des clés imbriquées)
    let translationText = getNestedTranslation(translations, key);
    
    if (translationText) {
      // Si c'est un input/textarea, traduire le placeholder
      if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA') {
        if (element.hasAttribute('placeholder')) {
          element.placeholder = translationText;
        } else {
          element.value = translationText;
        }
      }
      // Si c'est un button
      else if (element.tagName === 'BUTTON') {
        element.textContent = translationText;
      }
      // Si c'est une option de select
      else if (element.tagName === 'OPTION') {
        element.textContent = translationText;
      }
      // Pour le reste (span, p, h1, etc.)
      else {
        // Préserver le HTML (utile pour les <br>)
        if (translationText.includes('<br>') || translationText.includes('<br/>')) {
          element.innerHTML = translationText;
        } else {
          element.textContent = translationText;
        }
      }
      translatedCount++;
    } else {
      console.warn(`⚠️ Traduction manquante pour: ${key}`);
      missingCount++;
    }
  });
  
  console.log(`✅ ${translatedCount} éléments traduits en ${currentLanguage.toUpperCase()}`);
  if (missingCount > 0) {
    console.warn(`⚠️ ${missingCount} traductions manquantes`);
  }
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
  getTranslations: () => translations,
  getTranslation: (key) => getNestedTranslation(translations, key)
};
