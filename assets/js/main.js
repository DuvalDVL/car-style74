/* ================================================
   CAR STYLE 74 - JAVASCRIPT (CORRIGÉ)
   Fonctionnalités : Header/Footer dynamiques, Menu, 
   Lightbox, Reels, Formulaire, Animations
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
  
  // Initialiser toutes les fonctionnalités
  initMobileMenu();
  initDropdownMenus();
  initSmoothScroll();
  initScrollEffects();
  initLightbox();
  initFormspree();
  initLazyLoading();
  initAnimationsOnScroll();
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
  
  // Fermer au clic sur un lien
  const navLinks = nav.querySelectorAll('a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
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
    if (!dropdownMenu) return;
    
    // Sur mobile : clic pour ouvrir/fermer
    if (window.innerWidth <= 1024) {
      const navLink = item.querySelector('.nav-link');
      navLink.addEventListener('click', (e) => {
        e.preventDefault();
        item.classList.toggle('active');
        
        // Fermer les autres menus
        navItems.forEach(otherItem => {
          if (otherItem !== item) {
            otherItem.classList.remove('active');
          }
        });
      });
    }
  });
  
  // Gérer le responsive
  window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) {
      navItems.forEach(item => item.classList.remove('active'));
    }
  });
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
