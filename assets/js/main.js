/* ================================================
   CAR STYLE 74 - JAVASCRIPT (CORRIGÉ)
   Fonctionnalités : Header/Footer dynamiques, Menu, 
   Lightbox, Reels, Formulaire, Animations, Langue, FAQ
   ================================================ */

// ===== CONFIGURATION =====
const BASE_PATH = '/car-style74';

// ===== CHARGEMENT HEADER & FOOTER =====
document.addEventListener('DOMContentLoaded', async function() {

  
  
  // Charger le header
  try {
    const headerResponse = await fetch(`${BASE_PATH}/includes/header.html`);
    const headerHtml = await headerResponse.text();
    document.getElementById('header-placeholder').innerHTML = headerHtml;
    
    // Initialiser les fonctionnalités du header après chargement
    initHeader();
    initLanguageSelector();
    initStickyLanguageButton();
  } catch (error) {
    console.error('Erreur chargement header:', error);
  }
  
  // Charger le footer
  try {
    const footerResponse = await fetch(`${BASE_PATH}/includes/footer.html`);
    const footerHtml = await footerResponse.text();
    document.getElementById('footer-placeholder').innerHTML = footerHtml;
  } catch (error) {
    console.error('Erreur chargement footer:', error);
  }

  if (window.TranslationSystem) {
    await window.TranslationSystem.init();
  }
  
  // Initialiser toutes les fonctionnalités
  initMobileMenu();
  initDropdownMenus();
  initSmoothScroll();
  initScrollEffects();
  initLightbox();
  initFormspree();
  initLazyLoading();
  initAnimationsOnScroll();
  initReels();
  initFAQ(); // ⬅️ AJOUTÉ
  initServicesAccordion(); // ⬅️ AJOUTER CETTE LIGNE
});

// ===== INITIALISATION HEADER =====
function initHeader() {
  // Activer le lien de la page courante
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (currentPath.includes(href) && href !== `${BASE_PATH}/`) {
      link.classList.add('active');
    } else if (currentPath === `${BASE_PATH}/` && href === `${BASE_PATH}/`) {
      link.classList.add('active');
    }
  });
  
  // Effet scroll header
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const header = document.querySelector('.main-header');
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    lastScroll = currentScroll;
  });
}

// ===== SÉLECTEUR DE LANGUE (DESKTOP) =====
function initLanguageSelector() {
  const selector = document.querySelector('.language-selector.desktop-only');
  if (!selector) return;
  
  const toggle = selector.querySelector('.language-toggle');
  const dropdown = selector.querySelector('.language-dropdown');
  const options = selector.querySelectorAll('.language-option');
  const currentLangSpan = selector.querySelector('.current-language');
  
  // Ouvrir/fermer au clic
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    selector.classList.toggle('active');
    toggle.classList.toggle('active');
  });
  
  // Changer la langue
  options.forEach(option => {
    option.addEventListener('click', (e) => {
      e.stopPropagation();
      const lang = option.dataset.lang;
      
      // Retirer la classe active de toutes les options
      options.forEach(opt => opt.classList.remove('active'));
      // Ajouter la classe active à l'option sélectionnée
      option.classList.add('active');
      
      // Mettre à jour l'affichage
      currentLangSpan.textContent = lang.toUpperCase();
      
      // Fermer le dropdown
      selector.classList.remove('active');
      toggle.classList.remove('active');
      
      // Changer la langue (fonction à implémenter)
      changeLanguage(lang);
    });
  });
  
  // Fermer au clic en dehors
  document.addEventListener('click', (e) => {
    if (!selector.contains(e.target)) {
      selector.classList.remove('active');
      toggle.classList.remove('active');
    }
  });
}

// ===== BOUTON STICKY LANGUE (MOBILE) =====
function initStickyLanguageButton() {
  const stickyButton = document.querySelector('.sticky-language-button');
  if (!stickyButton) return;
  
  const toggle = stickyButton.querySelector('.sticky-lang-toggle');
  const menu = stickyButton.querySelector('.sticky-lang-menu');
  const options = stickyButton.querySelectorAll('.sticky-lang-option');
  const currentFlag = stickyButton.querySelector('.current-flag');
  
  // Ouvrir/fermer au clic
  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    stickyButton.classList.toggle('active');
  });
  
  // Changer la langue
  options.forEach(option => {
    option.addEventListener('click', (e) => {
      e.stopPropagation();
      const lang = option.dataset.lang;
      const flag = option.querySelector('.language-flag').textContent;
      
      // Retirer la classe active de toutes les options
      options.forEach(opt => opt.classList.remove('active'));
      // Ajouter la classe active à l'option sélectionnée
      option.classList.add('active');
      
      // Mettre à jour le drapeau affiché
      currentFlag.textContent = flag;
      
      // Fermer le menu
      stickyButton.classList.remove('active');
      
      // Changer la langue
      changeLanguage(lang);
    });
  });
  
  // Fermer au clic en dehors
  document.addEventListener('click', (e) => {
    if (!stickyButton.contains(e.target)) {
      stickyButton.classList.remove('active');
    }
  });
}

// ===== CHANGEMENT DE LANGUE =====
function changeLanguage(lang) {
  console.log(`Changement de langue vers: ${lang}`);
  // TODO: Implémenter le système de traduction
  // Pour l'instant, juste un log pour confirmer que ça fonctionne
  
  // Exemple d'implémentation future:
  // - Charger un fichier JSON avec les traductions
  // - Parcourir tous les éléments [data-translate]
  // - Remplacer le texte par la traduction correspondante
}

// ===== MENU MOBILE =====
function initMobileMenu() {
  const toggle = document.querySelector('.mobile-menu-toggle');
  const nav = document.querySelector('.main-nav');
  const body = document.body;
  
  if (!toggle || !nav) return;
  
  toggle.addEventListener('click', () => {
    toggle.classList.toggle('active');
    nav.classList.toggle('active');
    body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
  });
  
  // Fermer au clic sur un lien SANS dropdown
  const navLinks = nav.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      // Ne fermer que si ce n'est pas un lien avec dropdown
      const parentItem = link.closest('.nav-item');
      if (window.innerWidth <= 1024 && !parentItem.classList.contains('has-dropdown')) {
        toggle.classList.remove('active');
        nav.classList.remove('active');
        body.style.overflow = '';
      }
    });
  });
  
  // Fermer au clic sur un item de dropdown
  const dropdownItems = nav.querySelectorAll('.dropdown-item');
  dropdownItems.forEach(item => {
    item.addEventListener('click', () => {
      if (window.innerWidth <= 1024) {
        toggle.classList.remove('active');
        nav.classList.remove('active');
        body.style.overflow = '';
      }
    });
  });
  
  // Fermer au clic en dehors
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 1024 && 
        nav.classList.contains('active') && 
        !nav.contains(e.target) && 
        !toggle.contains(e.target)) {
      toggle.classList.remove('active');
      nav.classList.remove('active');
      body.style.overflow = '';
    }
  });
}

// ===== MENUS DÉROULANTS =====
function initDropdownMenus() {
  const navItems = document.querySelectorAll('.nav-item.has-dropdown');
  
  navItems.forEach(item => {
    const dropdownMenu = item.querySelector('.dropdown-menu');
    const dropdownToggle = item.querySelector('.dropdown-toggle');
    const navLink = item.querySelector('.nav-link');
    
    if (!dropdownMenu) return;
    
    // Sur mobile : clic sur la FLÈCHE pour ouvrir/fermer le dropdown
    if (dropdownToggle) {
      dropdownToggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        
        // Toggle le dropdown
        const isActive = item.classList.contains('active');
        
        // Fermer tous les autres menus
        navItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
          }
        });
        
        // Toggle l'élément actuel
        if (isActive) {
          item.classList.remove('active');
        } else {
          item.classList.add('active');
        }
      });
    }
    
    // Desktop : hover sur l'item entier
    if (window.innerWidth > 1024) {
      item.addEventListener('mouseenter', () => {
        item.classList.add('hover');
      });
      
      item.addEventListener('mouseleave', () => {
        item.classList.remove('hover');
      });
    }
    
    // Le lien principal reste cliquable et navigue normalement
    // (pas besoin de JavaScript supplémentaire, le comportement par défaut fonctionne)
  });
  
  // Gérer le responsive
  window.addEventListener('resize', debounce(() => {
    if (window.innerWidth > 1024) {
      navItems.forEach(item => item.classList.remove('active'));
    }
  }, 250));
}

// ===== SMOOTH SCROLL =====
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const headerHeight = document.querySelector('.main-header')?.offsetHeight || 0;
        const targetPosition = target.offsetTop - headerHeight - 20;
        
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ===== EFFETS AU SCROLL =====
function initScrollEffects() {
  // Bouton sticky call (mobile uniquement)
  const stickyCallBtn = document.querySelector('.sticky-call-button');
  
  if (stickyCallBtn && window.innerWidth <= 768) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) {
        stickyCallBtn.style.display = 'flex';
      } else {
        stickyCallBtn.style.display = 'none';
      }
    });
  }
}

// ===== LIGHTBOX GALERIE =====
function initLightbox() {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.querySelector('.lightbox');
  const lightboxImg = document.querySelector('.lightbox img');
  const lightboxClose = document.querySelector('.lightbox-close');
  
  if (!lightbox) return;
  
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });
  
  // Fermer la lightbox
  const closeLightbox = () => {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  };
  
  if (lightboxClose) {
    lightboxClose.addEventListener('click', closeLightbox);
  }
  
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) {
      closeLightbox();
    }
  });
  
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightbox.classList.contains('active')) {
      closeLightbox();
    }
  });
}

// ===== FORMULAIRE FORMSPREE =====
function initFormspree() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = form.querySelector('.form-submit');
    const originalText = submitBtn.textContent;
    
    // Désactiver le bouton pendant l'envoi
    submitBtn.disabled = true;
    submitBtn.textContent = 'Envoi en cours...';
    
    const formData = new FormData(form);
    
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        // Succès
        showFormMessage('success', 'Message envoyé avec succès ! Nous vous répondrons rapidement.');
        form.reset();
      } else {
        // Erreur serveur
        showFormMessage('error', 'Une erreur est survenue. Veuillez réessayer ou nous contacter par téléphone.');
      }
    } catch (error) {
      // Erreur réseau
      showFormMessage('error', 'Erreur de connexion. Veuillez vérifier votre connexion internet.');
    } finally {
      // Réactiver le bouton
      submitBtn.disabled = false;
      submitBtn.textContent = originalText;
    }
  });
}

function showFormMessage(type, message) {
  const form = document.getElementById('contact-form');
  
  // Supprimer les anciens messages
  const oldMessage = form.querySelector('.form-message');
  if (oldMessage) oldMessage.remove();
  
  // Créer le nouveau message
  const messageDiv = document.createElement('div');
  messageDiv.className = `form-message form-message-${type}`;
  messageDiv.textContent = message;
  messageDiv.style.cssText = `
    padding: 1rem;
    margin-top: 1rem;
    border-radius: 8px;
    font-weight: 500;
    ${type === 'success' 
      ? 'background: rgba(74, 144, 226, 0.1); color: #4A90E2; border: 1px solid #4A90E2;' 
      : 'background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid #ef4444;'}
  `;
  
  form.appendChild(messageDiv);
  
  // Supprimer après 5 secondes
  setTimeout(() => {
    messageDiv.remove();
  }, 5000);
}

// ===== LAZY LOADING IMAGES =====
function initLazyLoading() {
  const images = document.querySelectorAll('img[data-src]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          observer.unobserve(img);
        }
      });
    });
    
    images.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback pour navigateurs anciens
    images.forEach(img => {
      img.src = img.dataset.src;
      img.removeAttribute('data-src');
    });
  }
}

// ===== ANIMATIONS AU SCROLL =====
function initAnimationsOnScroll() {
  const animatedElements = document.querySelectorAll('.service-card, .testimonial-card, .gallery-item, .pricing-card');
  
  if ('IntersectionObserver' in window) {
    const animationObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '0';
          entry.target.style.transform = 'translateY(30px)';
          
          setTimeout(() => {
            entry.target.style.transition = 'all 0.6s ease';
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, 100);
          
          animationObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });
    
    animatedElements.forEach(el => animationObserver.observe(el));
  }
}

// ===== GESTION DES REELS VIDÉOS (AVEC SON) =====
function initReels() {
  const isMobile = window.innerWidth <= 768;
  const reelCards = document.querySelectorAll('.reel-card');
  
  console.log(`🎬 Init Reels - ${reelCards.length} vidéos - Mode: ${isMobile ? 'MOBILE' : 'DESKTOP'}`);
  
  if (reelCards.length === 0) {
    console.warn('⚠️ Aucune carte reel trouvée !');
    return;
  }
  
  let observer = null;
  
  reelCards.forEach((card, index) => {
    const video = card.querySelector('.reel-video');
    
    if (!video) {
      console.warn(`⚠️ Pas de vidéo pour la carte ${index + 1}`);
      return;
    }
    
    // Forcer le chargement de la première frame au chargement
    video.load();
    
    console.log(`✅ Vidéo ${index + 1} initialisée`);
    
    if (isMobile) {
      // Mobile : lecture automatique au scroll
      if (!observer) {
        observer = new IntersectionObserver((entries) => {
          entries.forEach(entry => {
            const vid = entry.target.querySelector('.reel-video');
            const cardEl = entry.target;
            
            if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
              console.log('▶️ Lecture mobile (avec son)');
              vid.muted = false; // Activer le son
              vid.play().catch(err => {
                console.log('Son bloqué par navigateur, lecture sans son');
                vid.muted = true;
                vid.play();
              });
              cardEl.classList.add('playing');
            } else {
              console.log('⏸️ Pause mobile');
              vid.pause();
              vid.muted = true;
              cardEl.classList.remove('playing');
            }
          });
        }, { threshold: [0, 0.5, 1] });
      }
      observer.observe(card);
    } else {
      // Desktop : lecture au survol AVEC SON
      card.addEventListener('mouseenter', () => {
        console.log('▶️ Lecture desktop (avec son)');
        video.muted = false; // ACTIVER LE SON
        video.play().catch(err => {
          console.log('Son bloqué, lecture sans son');
          video.muted = true;
          video.play();
        });
        card.classList.add('playing');
      });
      
      card.addEventListener('mouseleave', () => {
        console.log('⏸️ Pause desktop');
        video.pause();
        video.currentTime = 0;
        video.muted = true; // Remettre en muet
        card.classList.remove('playing');
      });
    }
  });
}

// ===== FAQ ACCORDÉONS =====
function initFAQ() {
  const faqItems = document.querySelectorAll('.faq-item');
  
  if (faqItems.length === 0) return;
  
  faqItems.forEach(item => {
    const question = item.querySelector('.faq-question');
    
    question.addEventListener('click', () => {
      // Fermer les autres items
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('active');
        }
      });
      
      // Toggle l'item actuel
      item.classList.toggle('active');
    });
  });
}

// ===== ACCORDÉON SUPPLÉMENTS À LA CARTE (MOBILE) =====
function initServicesAccordion() {
  const accordionItems = document.querySelectorAll('.service-accordion-container .accordion-item');
  
  if (accordionItems.length === 0) {
    console.log('ℹ️ Pas d\'accordéon sur cette page');
    return;
  }
  
  console.log(`✅ ${accordionItems.length} catégories d'accordéon initialisées`);
  
  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    const content = item.querySelector('.accordion-content');
    
    if (!header || !content) return;
    
    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Fermer tous les autres accordéons
      accordionItems.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          const otherContent = otherItem.querySelector('.accordion-content');
          if (otherContent) {
            otherContent.style.maxHeight = null;
          }
        }
      });
      
      // Toggle l'accordéon actuel
      if (isActive) {
        item.classList.remove('active');
        content.style.maxHeight = null;
      } else {
        item.classList.add('active');
        // Calculer la hauteur réelle du contenu
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
  
  // Recalculer les hauteurs au resize (important pour le responsive)
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      accordionItems.forEach(item => {
        if (item.classList.contains('active')) {
          const content = item.querySelector('.accordion-content');
          if (content) {
            content.style.maxHeight = content.scrollHeight + 'px';
          }
        }
      });
    }, 250);
  });
}

// ===== UTILITAIRE : Débounce =====
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// ===== GESTION ERREURS GLOBALES =====
window.addEventListener('error', (e) => {
  console.error('Erreur détectée:', e.error);
});

// ===== LOG SUCCÈS INITIALISATION =====
console.log('✅ Car Style 74 - Site initialisé avec succès');
