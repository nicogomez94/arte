/* ================================================
   NAVBAR — efecto scroll
   ================================================ */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

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
   FILTROS DE TIENDA
   ================================================ */
const filtroBtns = document.querySelectorAll('.filtro-btn');
const productCards = document.querySelectorAll('.producto-card');

filtroBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filtroBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    productCards.forEach(card => {
      const match = filter === 'todos' || card.dataset.category === filter;
      card.style.display = match ? 'flex' : 'none';
    });
  });
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
    btn.style.background = '#2a7a2a';
    form.reset();

    setTimeout(() => {
      btn.textContent = originalText;
      btn.disabled = false;
      btn.style.background = '';
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
