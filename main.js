/* ================================================
   NAVBAR — efecto scroll
   ================================================ */
const navbar = document.getElementById('navbar');

if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  }, { passive: true });
}

/* ================================================
   HAMBURGER — menú móvil
   ================================================ */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (hamburger && mobileMenu) {
  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', String(isOpen));
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // Cerrar con Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      mobileMenu.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      hamburger.focus();
    }
  });
}

/* ================================================
   FADE-IN — IntersectionObserver
   ================================================ */
const fadeObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      fadeObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.fade-in').forEach(el => fadeObserver.observe(el));

/* ================================================
   GALERÍA — slideshows independientes
   ================================================ */
document.querySelectorAll('[data-slideshow]').forEach(slideshow => {
  const slides = Array.from(slideshow.querySelectorAll('.gallery-slide'));
  const prev = slideshow.querySelector('.slide-prev');
  const next = slideshow.querySelector('.slide-next');
  const currentLabel = slideshow.querySelector('.slide-current');
  let current = 0;

  const showSlide = index => {
    current = (index + slides.length) % slides.length;

    slides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === current;
      slide.classList.toggle('is-active', isActive);
      slide.setAttribute('aria-hidden', String(!isActive));
    });

    if (currentLabel) {
      currentLabel.textContent = String(current + 1).padStart(2, '0');
    }
  };

  prev?.addEventListener('click', () => showSlide(current - 1));
  next?.addEventListener('click', () => showSlide(current + 1));

  slideshow.setAttribute('tabindex', '0');
  slideshow.addEventListener('keydown', event => {
    if (event.key === 'ArrowLeft') showSlide(current - 1);
    if (event.key === 'ArrowRight') showSlide(current + 1);
  });

  showSlide(0);
});

/* ================================================
   PANEL ADMIN — interacciones de demostración
   ================================================ */
const adminSidebar = document.getElementById('adminSidebar');
const adminMenuToggle = document.getElementById('adminMenuToggle');
const adminToast = document.getElementById('adminToast');
let toastTimer;

const showAdminToast = () => {
  if (!adminToast) return;
  adminToast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => adminToast.classList.remove('is-visible'), 2600);
};

if (adminMenuToggle && adminSidebar) {
  adminMenuToggle.addEventListener('click', () => {
    const isOpen = adminSidebar.classList.toggle('is-open');
    adminMenuToggle.setAttribute('aria-expanded', String(isOpen));
  });
}

document.querySelectorAll('.admin-nav-item').forEach(item => {
  item.addEventListener('click', () => {
    document.querySelectorAll('.admin-nav-item').forEach(navItem => navItem.classList.remove('is-active'));
    item.classList.add('is-active');
    showAdminToast();
  });
});

document.querySelectorAll('[data-demo-action], .admin-view-all').forEach(button => {
  button.addEventListener('click', showAdminToast);
});

document.querySelector('[data-focus-upload]')?.addEventListener('click', () => {
  document.getElementById('adminUpload')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

const obraFile = document.getElementById('obraFile');
const adminDropzone = document.getElementById('adminDropzone');
const adminUploadPreview = document.getElementById('adminUploadPreview');

const previewAdminFile = file => {
  if (!file || !file.type.startsWith('image/') || !adminUploadPreview) return;
  const imageUrl = URL.createObjectURL(file);
  adminUploadPreview.style.backgroundImage = `url("${imageUrl}")`;
  adminUploadPreview.classList.add('has-image');
};

obraFile?.addEventListener('change', event => {
  previewAdminFile(event.target.files?.[0]);
});

if (adminDropzone) {
  ['dragenter', 'dragover'].forEach(eventName => {
    adminDropzone.addEventListener(eventName, event => {
      event.preventDefault();
      adminDropzone.classList.add('is-dragging');
    });
  });

  ['dragleave', 'drop'].forEach(eventName => {
    adminDropzone.addEventListener(eventName, event => {
      event.preventDefault();
      adminDropzone.classList.remove('is-dragging');
    });
  });

  adminDropzone.addEventListener('drop', event => {
    previewAdminFile(event.dataTransfer?.files?.[0]);
  });
}

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && adminSidebar?.classList.contains('is-open')) {
    adminSidebar.classList.remove('is-open');
    adminMenuToggle?.setAttribute('aria-expanded', 'false');
  }
});

/* ================================================
   FORMULARIO DE CONTACTO
   ================================================ */
function handleFormSubmit(e) {
  e.preventDefault();

  const form = e.target;
  const btn = form.querySelector('button[type="submit"]');
  const originalText = btn.textContent;

  // Sanitización básica: verificar que los campos requeridos no estén vacíos
  const nombre = form.querySelector('#nombre');
  const email = form.querySelector('#email');
  const mensaje = form.querySelector('#mensaje');

  if (!nombre || !email || !mensaje) return;

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email.value.trim())) {
    email.focus();
    email.style.borderColor = '#c0392b';
    setTimeout(() => { email.style.borderColor = ''; }, 2000);
    return;
  }

  btn.textContent = 'Enviando...';
  btn.disabled = true;

  // Simulación de envío (reemplazar con integración real)
  setTimeout(() => {
    btn.textContent = '¡Mensaje enviado!';
    btn.style.color = '#5c7559';
    btn.style.borderColor = '#5c7559';
    form.reset();

    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
      btn.style.color = '';
      btn.style.borderColor = '';
    }, 3500);
  }, 1200);
}

/* ================================================
   SCROLL SUAVE para anclas internas
   ================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href').slice(1);
    const target = document.getElementById(targetId);
    if (target) {
      e.preventDefault();
      const offset = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height'), 10) || 62;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
