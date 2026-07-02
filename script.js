/**
 * ============================================================
 * STREAMFINDER – SCRIPT.JS
 * Logique SPA : Enregistrement → Catalogue Films → Paiement MonCash
 * ============================================================
 */

'use strict';

/* ============================================================
   BASE DE DONNÉES LOCALE (Simulateur JSON)
   8 films populaires avec plateformes légales officielles
============================================================ */
const MOVIES_DB = [
  {
    id: 1,
    title: "Dune : Partie 2",
    emoji: "🏜️",
    genre: "Science-Fiction",
    year: 2024,
    rating: "⭐ 8.5",
    desc: "Paul Atréides s'unit aux Fremen pour mener la guerre sainte contre ceux qui ont détruit sa famille.",
    bgColor: "#7C5A28",
    platforms: [
      { name: "Max (HBO)", url: "https://www.max.com/", color: "#002BE7", icon: "M" },
      { name: "Prime Video", url: "https://www.primevideo.com/", color: "#00A8E0", icon: "P" }
    ]
  },
  {
    id: 2,
    title: "Deadpool & Wolverine",
    emoji: "⚔️",
    genre: "Action",
    year: 2024,
    rating: "⭐ 7.8",
    desc: "Deadpool et Wolverine doivent travailler ensemble pour sauver le multivers Marvel.",
    bgColor: "#8B1A1A",
    platforms: [
      { name: "Disney+", url: "https://www.disneyplus.com/fr-fr/signup", color: "#113CCF", icon: "D+" }
    ]
  },
  {
    id: 3,
    title: "Inside Out 2",
    emoji: "🎭",
    genre: "Animation",
    year: 2024,
    rating: "⭐ 7.6",
    desc: "Riley entre au lycée et de nouvelles émotions font leur apparition dans son monde intérieur.",
    bgColor: "#2E5A8E",
    platforms: [
      { name: "Disney+", url: "https://www.disneyplus.com/fr-fr/signup", color: "#113CCF", icon: "D+" }
    ]
  },
  {
    id: 4,
    title: "Alien : Romulus",
    emoji: "👾",
    genre: "Science-Fiction",
    year: 2024,
    rating: "⭐ 7.4",
    desc: "Un groupe de jeunes colonisateurs affronte la forme de vie la plus terrifiante de l'univers.",
    bgColor: "#1A3A1A",
    platforms: [
      { name: "Disney+", url: "https://www.disneyplus.com/fr-fr/signup", color: "#113CCF", icon: "D+" },
      { name: "Prime Video", url: "https://www.primevideo.com/", color: "#00A8E0", icon: "P" }
    ]
  },
  {
    id: 5,
    title: "Oppenheimer",
    emoji: "💥",
    genre: "Drame",
    year: 2023,
    rating: "⭐ 8.9",
    desc: "L'histoire du physicien J. Robert Oppenheimer et son rôle dans le développement de la bombe atomique.",
    bgColor: "#4A3000",
    platforms: [
      { name: "Netflix", url: "https://www.netflix.com/signup", color: "#E50914", icon: "N" },
      { name: "Prime Video", url: "https://www.primevideo.com/", color: "#00A8E0", icon: "P" }
    ]
  },
  {
    id: 6,
    title: "The Batman",
    emoji: "🦇",
    genre: "Action",
    year: 2022,
    rating: "⭐ 7.9",
    desc: "Bruce Wayne, dans sa deuxième année en tant que Batman, traque un tueur en série appelé l'Énigmatiste.",
    bgColor: "#1A1A2E",
    platforms: [
      { name: "Netflix", url: "https://www.netflix.com/signup", color: "#E50914", icon: "N" },
      { name: "Max (HBO)", url: "https://www.max.com/", color: "#002BE7", icon: "M" }
    ]
  },
  {
    id: 7,
    title: "Moana 2",
    emoji: "🌊",
    genre: "Animation",
    year: 2024,
    rating: "⭐ 6.7",
    desc: "Vaiana part à la découverte de mers inexplorées suite à l'appel inattendu de ses ancêtres.",
    bgColor: "#0A4A6E",
    platforms: [
      { name: "Disney+", url: "https://www.disneyplus.com/fr-fr/signup", color: "#113CCF", icon: "D+" }
    ]
  },
  {
    id: 8,
    title: "Interstellar",
    emoji: "🚀",
    genre: "Science-Fiction",
    year: 2014,
    rating: "⭐ 8.7",
    desc: "Un groupe d'astronautes voyage à travers un trou de ver pour trouver un nouveau foyer pour l'humanité.",
    bgColor: "#0D0D2E",
    platforms: [
      { name: "Netflix", url: "https://www.netflix.com/signup", color: "#E50914", icon: "N" },
      { name: "Apple TV+", url: "https://tv.apple.com/", color: "#1C1C1E", icon: "A" }
    ]
  }
];

/* ============================================================
   ÉTAT DE L'APPLICATION
============================================================ */
const state = {
  currentUser: null,       // { firstname, lastname, email, phone }
  activeGenre: 'all',      // Filtre actif
  searchQuery: '',         // Requête de recherche
  selectedMovie: null,     // Film sélectionné pour le paiement
  paymentSimulated: false  // Flag de simulation paiement
};

/* ============================================================
   RÉFÉRENCES DOM
============================================================ */
const dom = {
  // Pages
  pageRegister: document.getElementById('page-register'),
  pageFilms:    document.getElementById('page-films'),

  // Header
  searchWrapper: document.getElementById('search-wrapper'),
  searchInput:   document.getElementById('search-input'),
  userInfo:      document.getElementById('user-info'),
  userAvatar:    document.getElementById('user-avatar'),
  userNameDisplay: document.getElementById('user-name-display'),
  logoutBtn:     document.getElementById('logout-btn'),

  // Enregistrement
  registerForm:  document.getElementById('register-form'),

  // Films
  moviesGrid:    document.getElementById('movies-grid'),
  noResults:     document.getElementById('no-results'),
  searchInfo:    document.getElementById('search-info'),
  welcomeName:   document.getElementById('welcome-name'),
  filmCount:     document.getElementById('film-count'),

  // Modal MonCash
  modalMoncash:  document.getElementById('modal-moncash'),
  moncashPhone:  document.getElementById('moncash-phone'),
  moncashFilmTitle: document.getElementById('moncash-film-title'),
  moncashFilmEmoji: document.getElementById('moncash-film-emoji'),
  errMoncashPhone: document.getElementById('err-moncash-phone'),
  btnPayMoncash: document.getElementById('btn-pay-moncash'),
  moncashDirectLink: document.getElementById('moncash-direct-link'),

  // Modal Résultat
  modalResult:   document.getElementById('modal-result'),
  resultFilmName: document.getElementById('result-film-name'),
  resultPlatforms: document.getElementById('result-platforms'),

  // Toast
  toast: document.getElementById('toast'),

  // Pied de page
  footerYear: document.getElementById('footer-year')
};

/* ============================================================
   INITIALISATION
============================================================ */
function init() {
  // Année dans le footer
  if (dom.footerYear) dom.footerYear.textContent = new Date().getFullYear();

  // Vérifier si un utilisateur est déjà enregistré (session simulée)
  const savedUser = sessionStorage.getItem('sf_user');
  if (savedUser) {
    try {
      state.currentUser = JSON.parse(savedUser);
      showFilmsPage();
    } catch {
      sessionStorage.removeItem('sf_user');
    }
  }

  // Attacher les écouteurs d'événements
  bindEvents();
}

/* ============================================================
   LIAISON DES ÉVÉNEMENTS
============================================================ */
function bindEvents() {
  // Formulaire d'enregistrement
  if (dom.registerForm) {
    dom.registerForm.addEventListener('submit', handleRegister);
  }

  // Barre de recherche
  if (dom.searchInput) {
    dom.searchInput.addEventListener('input', debounce(handleSearch, 200));
  }

  // Filtres par genre
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', handleGenreFilter);
  });

  // Fermeture modal MonCash
  document.getElementById('modal-moncash-close')?.addEventListener('click', closeMoncashModal);

  // Bouton "Payer maintenant"
  if (dom.btnPayMoncash) {
    dom.btnPayMoncash.addEventListener('click', handleMoncashPayment);
  }

  // Fermeture modal résultat
  document.getElementById('modal-result-close')?.addEventListener('click', closeResultModal);
  document.getElementById('result-close-btn')?.addEventListener('click', closeResultModal);

  // Fermeture des modals en cliquant sur le fond
  document.getElementById('modal-moncash')?.addEventListener('click', (e) => {
    if (e.target === dom.modalMoncash) closeMoncashModal();
  });
  document.getElementById('modal-result')?.addEventListener('click', (e) => {
    if (e.target === dom.modalResult) closeResultModal();
  });

  // Touche Échap pour fermer les modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMoncashModal();
      closeResultModal();
    }
  });

  // Autoformat du numéro de téléphone MonCash
  if (dom.moncashPhone) {
    dom.moncashPhone.addEventListener('input', formatPhoneInput);
  }
  const regPhone = document.getElementById('reg-phone');
  if (regPhone) {
    regPhone.addEventListener('input', formatPhoneInput);
  }
}

/* ============================================================
   GESTION DU FORMULAIRE D'ENREGISTREMENT
============================================================ */
function handleRegister(e) {
  e.preventDefault();

  const firstname = document.getElementById('reg-firstname').value.trim();
  const lastname  = document.getElementById('reg-lastname').value.trim();
  const email     = document.getElementById('reg-email').value.trim();
  const phone     = document.getElementById('reg-phone').value.trim();

  // Validation
  let valid = true;

  if (!firstname || firstname.length < 2) {
    showFieldError('err-firstname', 'Veuillez entrer votre prénom (min. 2 caractères).');
    document.getElementById('reg-firstname').classList.add('error');
    valid = false;
  } else {
    clearFieldError('err-firstname');
    document.getElementById('reg-firstname').classList.remove('error');
  }

  if (!lastname || lastname.length < 2) {
    showFieldError('err-lastname', 'Veuillez entrer votre nom (min. 2 caractères).');
    document.getElementById('reg-lastname').classList.add('error');
    valid = false;
  } else {
    clearFieldError('err-lastname');
    document.getElementById('reg-lastname').classList.remove('error');
  }

  if (!email || !isValidEmail(email)) {
    showFieldError('err-email', 'Veuillez entrer une adresse e-mail valide.');
    document.getElementById('reg-email').classList.add('error');
    valid = false;
  } else {
    clearFieldError('err-email');
    document.getElementById('reg-email').classList.remove('error');
  }

  if (!phone || phone.replace(/\s/g, '').length < 8) {
    showFieldError('err-phone', 'Entrez un numéro MonCash valide (8 chiffres).');
    document.getElementById('reg-phone').classList.add('error');
    valid = false;
  } else {
    clearFieldError('err-phone');
    document.getElementById('reg-phone').classList.remove('error');
  }

  if (!valid) return;

  // Enregistrement réussi
  const user = { firstname, lastname, email, phone };
  state.currentUser = user;
  sessionStorage.setItem('sf_user', JSON.stringify(user));

  // Animation du bouton
  const btn = document.getElementById('register-btn');
  btn.textContent = '✅ Compte créé ! Chargement…';
  btn.disabled = true;
  btn.style.opacity = '0.8';

  setTimeout(() => {
    showFilmsPage();
  }, 700);
}

/* ============================================================
   NAVIGATION ENTRE LES PAGES (SPA)
============================================================ */
function showFilmsPage() {
  // Cacher la page d'accueil
  dom.pageRegister.hidden = true;

  // Afficher la page des films
  dom.pageFilms.hidden = false;

  // Mettre à jour le header
  dom.searchWrapper.hidden = false;
  dom.userInfo.hidden = false;
  dom.logoutBtn.hidden = false;

  // Afficher les infos utilisateur dans le header
  const u = state.currentUser;
  if (u) {
    dom.userAvatar.textContent = u.firstname.charAt(0).toUpperCase();
    dom.userNameDisplay.textContent = `${u.firstname} ${u.lastname}`;
    dom.welcomeName.textContent = u.firstname;
  }

  // Scroll vers le haut
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Rendre les films
  renderMovies();

  // Mettre à jour le compteur
  dom.filmCount.textContent = MOVIES_DB.length;
}

/* Aller à la page d'accueil (accessible depuis le logo) */
function goHome() {
  if (!state.currentUser) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } else {
    // Déjà connecté : reste sur la page films, scrolle en haut
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}

/* Déconnexion */
function logout() {
  state.currentUser = null;
  state.activeGenre = 'all';
  state.searchQuery = '';
  sessionStorage.removeItem('sf_user');

  // Réinitialiser les champs du formulaire
  document.getElementById('register-form')?.reset();
  const regBtn = document.getElementById('register-btn');
  if (regBtn) { regBtn.textContent = "S'enregistrer et accéder au catalogue 🚀"; regBtn.disabled = false; regBtn.style.opacity = '1'; }

  // Cacher la page des films, afficher la page d'accueil
  dom.pageFilms.hidden = true;
  dom.pageRegister.hidden = false;

  // Header
  dom.searchWrapper.hidden = true;
  dom.userInfo.hidden = true;
  dom.logoutBtn.hidden = true;

  window.scrollTo({ top: 0, behavior: 'smooth' });
  showToast('Vous avez été déconnecté. À bientôt !');
}

/* ============================================================
   RENDU DE LA GRILLE DE FILMS
============================================================ */
function renderMovies() {
  const query = state.searchQuery.toLowerCase();
  const genre = state.activeGenre;

  // Filtrage
  let filtered = MOVIES_DB.filter(movie => {
    const matchGenre = genre === 'all' || movie.genre === genre;
    const matchSearch = !query
      || movie.title.toLowerCase().includes(query)
      || movie.genre.toLowerCase().includes(query)
      || movie.desc.toLowerCase().includes(query);
    return matchGenre && matchSearch;
  });

  // Vider la grille
  dom.moviesGrid.innerHTML = '';

  if (filtered.length === 0) {
    dom.noResults.hidden = false;
    dom.searchInfo.textContent = '';
  } else {
    dom.noResults.hidden = true;

    // Info recherche
    if (query) {
      dom.searchInfo.textContent = `${filtered.length} résultat${filtered.length > 1 ? 's' : ''} pour "${query}"`;
    } else if (genre !== 'all') {
      dom.searchInfo.textContent = `${filtered.length} film${filtered.length > 1 ? 's' : ''} en ${genre}`;
    } else {
      dom.searchInfo.textContent = '';
    }

    // Injection des cartes avec délai d'animation échelonné
    filtered.forEach((movie, index) => {
      const card = createMovieCard(movie, index);
      dom.moviesGrid.appendChild(card);
    });
  }
}

/* ============================================================
   CRÉATION D'UNE CARTE FILM
============================================================ */
function createMovieCard(movie, index) {
  const card = document.createElement('article');
  card.className = 'movie-card';
  card.setAttribute('role', 'article');
  card.setAttribute('aria-label', `Film : ${movie.title}`);
  card.style.animationDelay = `${index * 60}ms`;

  // Badges de plateformes (juste les noms pour la carte)
  const platformBadges = movie.platforms
    .map(p => `<span class="plt-name-badge">${p.name}</span>`)
    .join('');

  card.innerHTML = `
    <div class="movie-poster" style="background: linear-gradient(135deg, ${movie.bgColor}, ${adjustColor(movie.bgColor)});">
      <span style="position:relative;z-index:1;">${movie.emoji}</span>
      <span class="movie-badge-year">${movie.year}</span>
      <span class="movie-badge-rating">${movie.rating}</span>
    </div>
    <div class="movie-body">
      <span class="movie-genre-tag">${movie.genre}</span>
      <h3 class="movie-title">${movie.title}</h3>
      <p class="movie-desc">${movie.desc}</p>
      <div class="movie-platforms-preview" style="display:flex;gap:6px;flex-wrap:wrap;margin-top:2px;">
        ${platformBadges}
      </div>
      <button
        class="btn-watch"
        onclick="openMoncashModal(${movie.id})"
        aria-label="Payer 50 HTG pour voir où regarder ${movie.title}"
      >
        <span class="btn-watch-logo">M</span>
        Où regarder ? (50 HTG)
      </button>
    </div>
  `;

  return card;
}

// Assombrir légèrement une couleur hex pour le dégradé
function adjustColor(hex) {
  try {
    const n = parseInt(hex.slice(1), 16);
    const r = Math.max(0, (n >> 16) - 30);
    const g = Math.max(0, ((n >> 8) & 0xFF) - 30);
    const b = Math.max(0, (n & 0xFF) - 30);
    return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
  } catch { return hex; }
}

// Style des badges de plateforme sur les cartes
const platformStyle = document.createElement('style');
platformStyle.textContent = `
  .plt-name-badge {
    font-size: .72rem; font-weight: 700;
    padding: 3px 9px; border-radius: 999px;
    background: var(--blue-50); color: var(--blue-700);
    border: 1px solid var(--blue-100);
  }
`;
document.head.appendChild(platformStyle);

/* ============================================================
   FILTRES & RECHERCHE
============================================================ */
function handleGenreFilter(e) {
  const btn = e.currentTarget;
  state.activeGenre = btn.dataset.genre;
  state.searchQuery = '';
  if (dom.searchInput) dom.searchInput.value = '';

  // Mise à jour des boutons actifs
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  renderMovies();
}

function handleSearch(e) {
  state.searchQuery = e.target.value;
  // Réinitialiser le filtre de genre lors de la recherche
  state.activeGenre = 'all';
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('filter-all')?.classList.add('active');

  renderMovies();
}

/* ============================================================
   MODAL MONCASH – OUVERTURE
============================================================ */
function openMoncashModal(movieId) {
  const movie = MOVIES_DB.find(m => m.id === movieId);
  if (!movie) return;

  state.selectedMovie = movie;
  state.paymentSimulated = false;

  // Remplir la modale avec les infos du film
  dom.moncashFilmTitle.textContent = movie.title;
  dom.moncashFilmEmoji.textContent = movie.emoji;

  // Pré-remplir avec le téléphone de l'utilisateur
  if (dom.moncashPhone && state.currentUser?.phone) {
    dom.moncashPhone.value = state.currentUser.phone;
  } else if (dom.moncashPhone) {
    dom.moncashPhone.value = '';
  }

  // Réinitialiser le bouton de paiement
  if (dom.btnPayMoncash) {
    dom.btnPayMoncash.textContent = '';
    const icon = document.createElement('span');
    icon.className = 'moncash-btn-icon';
    icon.textContent = 'M';
    dom.btnPayMoncash.appendChild(icon);
    dom.btnPayMoncash.appendChild(document.createTextNode(' Payer 50 HTG avec MonCash'));
    dom.btnPayMoncash.disabled = false;
  }

  // Effacer les erreurs
  clearFieldError('err-moncash-phone');
  if (dom.moncashPhone) dom.moncashPhone.classList.remove('error');

  // Afficher la modale
  dom.modalMoncash.hidden = false;
  document.body.style.overflow = 'hidden';

  // Focus sur le champ téléphone
  setTimeout(() => dom.moncashPhone?.focus(), 100);
}

/* ============================================================
   MODAL MONCASH – FERMETURE
============================================================ */
function closeMoncashModal() {
  dom.modalMoncash.hidden = true;
  document.body.style.overflow = '';
}

/* ============================================================
   LOGIQUE DE PAIEMENT MONCASH (Simulation)
============================================================ */
function handleMoncashPayment() {
  const phone = dom.moncashPhone?.value.trim() || '';

  // Validation du numéro
  const cleaned = phone.replace(/\s/g, '');
  if (!cleaned || cleaned.length < 8) {
    showFieldError('err-moncash-phone', 'Entrez un numéro MonCash valide (8 chiffres min.).');
    dom.moncashPhone?.classList.add('error');
    dom.moncashPhone?.focus();
    return;
  }
  clearFieldError('err-moncash-phone');
  dom.moncashPhone?.classList.remove('error');

  const movie = state.selectedMovie;
  if (!movie) return;

  // Animation du bouton (état de chargement)
  const btn = dom.btnPayMoncash;
  btn.innerHTML = '⏳ Traitement du paiement…';
  btn.disabled = true;
  btn.style.opacity = '0.8';

  // Construire l'URL MonCash avec paramètres pré-remplis
  // Lien officiel MonCash Business Payment
  const moncashPayUrl =
    `https://moncashbutton.digicelhaiti.com/Moncash-business/Pay` +
    `?amount=50` +
    `&orderId=SF-${movie.id}-${Date.now()}` +
    `&description=${encodeURIComponent('StreamFinder - Acces streaming ' + movie.title)}`;

  // Ouvrir MonCash dans un nouvel onglet
  const payWindow = window.open(moncashPayUrl, '_blank', 'noopener,noreferrer');

  // Simulation de la confirmation après 3 secondes
  setTimeout(() => {
    closeMoncashModal();
    showResultModal(movie);
    state.paymentSimulated = true;
  }, 3000);
}

/* ============================================================
   MODAL RÉSULTAT – AFFICHAGE (Après paiement simulé)
============================================================ */
function showResultModal(movie) {
  // Mettre à jour le titre
  dom.resultFilmName.innerHTML = `Accès débloqué pour : <strong>${movie.title}</strong>`;

  // Générer les liens de plateformes officielles
  dom.resultPlatforms.innerHTML = movie.platforms.map(p => `
    <a
      href="${p.url}"
      target="_blank"
      rel="noopener noreferrer"
      class="result-platform-link"
      onclick="trackClick('${p.name}', '${movie.title}')"
    >
      <div class="result-platform-icon" style="background:${p.color};">${p.icon}</div>
      <div class="result-platform-details">
        <strong>${p.name}</strong>
        <small>Cliquez pour accéder à la plateforme officielle</small>
      </div>
      <span class="result-arrow">→</span>
    </a>
  `).join('');

  // Afficher la modale
  dom.modalResult.hidden = false;
  document.body.style.overflow = 'hidden';

  // Notification
  showToast(`✅ Accès débloqué pour "${movie.title}" !`);
}

/* ============================================================
   MODAL RÉSULTAT – FERMETURE
============================================================ */
function closeResultModal() {
  dom.modalResult.hidden = true;
  document.body.style.overflow = '';
}

/* ============================================================
   TRACKING DES CLICS (Simulation analytique)
============================================================ */
function trackClick(platform, movieTitle) {
  console.log(`[StreamFinder Analytics] Clic vers ${platform} pour "${movieTitle}"`);
  // Ici vous pourriez intégrer Google Analytics : gtag('event', 'platform_click', {...})
}

/* ============================================================
   UTILITAIRES
============================================================ */

/** Validation email */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Afficher une erreur de champ */
function showFieldError(id, message) {
  const el = document.getElementById(id);
  if (el) el.textContent = message;
}

/** Effacer une erreur de champ */
function clearFieldError(id) {
  const el = document.getElementById(id);
  if (el) el.textContent = '';
}

/** Toast notification */
let toastTimer = null;
function showToast(message, duration = 3500) {
  const toast = dom.toast;
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add('show');
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

/** Formater la saisie d'un numéro de téléphone haïtien */
function formatPhoneInput(e) {
  let value = e.target.value.replace(/\D/g, '');
  if (value.length > 8) value = value.slice(0, 8);
  // Format : XX XX XX XX
  const parts = [];
  for (let i = 0; i < value.length; i += 2) {
    parts.push(value.slice(i, i + 2));
  }
  e.target.value = parts.join(' ');
}

/** Debounce pour la recherche */
function debounce(fn, delay) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}

/* ============================================================
   LANCEMENT
============================================================ */
document.addEventListener('DOMContentLoaded', init);
