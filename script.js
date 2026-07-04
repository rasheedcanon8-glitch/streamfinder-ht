/**
 * ============================================================
 * STREAMFINDER – SCRIPT.JS
 * Architecture SPA :
 *   Page 1 → Enregistrement
 *   Page 2 → Catalogue films (filtres + recherche)
 *   Modal  → Paiement MonCash (+509 38 08 63 19 | 500 HTG)
 *   Sécurité anti-fraude → Lien film débloqué UNIQUEMENT après simulation validée
 * ============================================================
 */

'use strict';

/* ============================================================
   CONFIGURATION DE L'API DEXCHANGE / MONCASH (Production)
============================================================ */
const DEXCHANGE_CONFIG = {
  // Mode Live / Production (Live API Credentials)
  MERCHANT_KEY:    'VOTRE_MERCHANT_KEY_PRODUCTION_ICI', // Clé Marchand Dexchange
  CLIENT_ID:       'VOTRE_CLIENT_ID_PRODUCTION_ICI',    // Client ID Dexchange
  SECRET_KEY:      'VOTRE_SECRET_KEY_PRODUCTION_ICI',   // Secret Key Dexchange
  RSA_PUBLIC_KEY:  `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAv1vV...
VOTRE_CLE_PUBLIQUE_RSA_PRODUCTION_COMPLETE_ICI
-----END PUBLIC KEY-----`,
  
  // Compte Marchand de réception (+509 38 08 63 19)
  MERCHANT_PHONE:  '+50938086319', 
  API_URL:         'https://api.dexchangeout.com/api/v1', // URL de Production Dexchange
  CURRENCY:        'HTG',
  AMOUNT:          500
};

/* ============================================================
   BASE DE DONNÉES FILMS
   Images stables depuis TMDB (The Movie Database)
============================================================ */
const FILMS_DB = [
  {
    id: 1,
    titre:      'Dune : Partie 2',
    genre:      'Science-Fiction',
    annee:      2024,
    note:       '⭐ 8.5',
    desc:       'Paul Atréides s\'unit aux Fremen pour mener la guerre sainte contre ceux qui ont détruit sa famille.',
    image:      'https://image.tmdb.org/t/p/w500/czembW0Rk1Ke7lCJGahbOhdCuhV.jpg',
    imageAlt:   'Affiche Dune Partie 2',
    plateformes: [
      { nom: 'Max (HBO)',    url: 'https://www.max.com/',                              couleur: '#002BE7', icone: 'M' },
      { nom: 'Prime Video', url: 'https://www.primevideo.com/',                        couleur: '#00A8E0', icone: 'P' }
    ]
  },
  {
    id: 2,
    titre:      'Deadpool & Wolverine',
    genre:      'Action',
    annee:      2024,
    note:       '⭐ 7.8',
    desc:       'Deadpool et Wolverine doivent travailler ensemble pour sauver le multivers Marvel.',
    image:      'https://image.tmdb.org/t/p/w500/8cdWjvZQUExUUTzyp4t6EDMubfO.jpg',
    imageAlt:   'Affiche Deadpool et Wolverine',
    plateformes: [
      { nom: 'Disney+', url: 'https://www.disneyplus.com/fr-fr/signup', couleur: '#113CCF', icone: 'D+' }
    ]
  },
  {
    id: 3,
    titre:      'Inside Out 2',
    genre:      'Animation',
    annee:      2024,
    note:       '⭐ 7.6',
    desc:       'Riley entre au lycée et de nouvelles émotions font leur apparition dans son monde intérieur.',
    image:      'https://image.tmdb.org/t/p/w500/vpnVM9B6NMmQpWeZvzLvDESb2QY.jpg',
    imageAlt:   'Affiche Inside Out 2',
    plateformes: [
      { nom: 'Disney+', url: 'https://www.disneyplus.com/fr-fr/signup', couleur: '#113CCF', icone: 'D+' }
    ]
  },
  {
    id: 4,
    titre:      'Oppenheimer',
    genre:      'Drame',
    annee:      2023,
    note:       '⭐ 8.9',
    desc:       'L\'histoire de J. Robert Oppenheimer et son rôle dans le développement de la bombe atomique.',
    image:      'https://image.tmdb.org/t/p/w500/8Gxv8gSFCU0XGDykEGv7zR1n2ua.jpg',
    imageAlt:   'Affiche Oppenheimer',
    plateformes: [
      { nom: 'Netflix',      url: 'https://www.netflix.com/signup',    couleur: '#E50914', icone: 'N' },
      { nom: 'Prime Video',  url: 'https://www.primevideo.com/',        couleur: '#00A8E0', icone: 'P' }
    ]
  },
  {
    id: 5,
    titre:      'Alien : Romulus',
    genre:      'Science-Fiction',
    annee:      2024,
    note:       '⭐ 7.4',
    desc:       'Un groupe de jeunes colonisateurs affronte la forme de vie la plus terrifiante de l\'univers.',
    image:      'https://image.tmdb.org/t/p/w500/b33nnKl1GSFbao4l3fZDDqsMx0F.jpg',
    imageAlt:   'Affiche Alien Romulus',
    plateformes: [
      { nom: 'Disney+',     url: 'https://www.disneyplus.com/fr-fr/signup', couleur: '#113CCF', icone: 'D+' },
      { nom: 'Prime Video', url: 'https://www.primevideo.com/',             couleur: '#00A8E0', icone: 'P'  }
    ]
  },
  {
    id: 6,
    titre:      'The Batman',
    genre:      'Action',
    annee:      2022,
    note:       '⭐ 7.9',
    desc:       'Bruce Wayne traque un tueur en série appelé l\'Énigmatiste dans les rues sombres de Gotham.',
    image:      'https://image.tmdb.org/t/p/w500/74xTEgt7R36Fpooo50r9T25onhq.jpg',
    imageAlt:   'Affiche The Batman',
    plateformes: [
      { nom: 'Netflix',   url: 'https://www.netflix.com/signup', couleur: '#E50914', icone: 'N' },
      { nom: 'Max (HBO)', url: 'https://www.max.com/',           couleur: '#002BE7', icone: 'M' }
    ]
  },
  {
    id: 7,
    titre:      'Interstellar',
    genre:      'Science-Fiction',
    annee:      2014,
    note:       '⭐ 8.7',
    desc:       'Un groupe d\'astronautes voyage à travers un trou de ver pour trouver un nouveau foyer pour l\'humanité.',
    image:      'https://image.tmdb.org/t/p/w500/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
    imageAlt:   'Affiche Interstellar',
    plateformes: [
      { nom: 'Netflix',    url: 'https://www.netflix.com/signup', couleur: '#E50914', icone: 'N'  },
      { nom: 'Apple TV+', url: 'https://tv.apple.com/',           couleur: '#1C1C1E', icone: 'A'  }
    ]
  },
  {
    id: 8,
    titre:      'Moana 2',
    genre:      'Animation',
    annee:      2024,
    note:       '⭐ 6.7',
    desc:       'Vaiana répond à l\'appel de ses ancêtres et part vers des mers inexplorées avec une nouvelle équipe.',
    image:      'https://image.tmdb.org/t/p/w500/4YZgsItEdNS0vBHOVV4Hpt4nrn1.jpg',
    imageAlt:   'Affiche Moana 2',
    plateformes: [
      { nom: 'Disney+', url: 'https://www.disneyplus.com/fr-fr/signup', couleur: '#113CCF', icone: 'D+' }
    ]
  }
];

/* ============================================================
   ÉTAT DE L'APPLICATION
============================================================ */
const APP = {
  user:          null,    // { firstname, lastname, email, phone }
  genre:         'all',
  query:         '',
  filmEnCours:   null,    // Film sélectionné pour le paiement
  paiementValide: false   // 🔒 Anti-fraude : true seulement après simulation complète
};

/* ============================================================
   RÉFÉRENCES DOM
============================================================ */
const $ = id => document.getElementById(id);

const DOM = {
  // Pages
  pageRegister: $('page-register'),
  pageFilms:    $('page-films'),

  // Header
  searchWrapper:  $('search-wrapper'),
  searchInput:    $('search-input'),
  headerGuest:    $('header-guest'),
  headerUser:     $('header-user'),
  userChipAvatar: $('user-chip-avatar'),
  userChipName:   $('user-chip-name'),

  // Enregistrement
  registerForm:  $('register-form'),

  // Films
  moviesGrid:   $('movies-grid'),
  noResults:    $('no-results'),
  searchInfo:   $('search-result-info'),
  welcomeName:  $('welcome-firstname'),
  totalFilms:   $('total-films'),

  // Modal MonCash
  modalMoncash: $('modal-moncash'),
  mcPhone:      $('mc-phone'),
  mcFilmTitle:  $('mc-film-title'),
  mcFilmThumb:  $('mc-film-thumb'),
  errMcPhone:   $('err-mc-phone'),
  btnPay:       $('btn-confirm-pay'),

  // Modal Chargement
  modalLoading: $('modal-loading'),
  loadingMsg:   $('loading-msg'),
  lstep1:       $('lstep-1'),
  lstep2:       $('lstep-2'),
  lstep3:       $('lstep-3'),

  // Modal Résultat
  modalResult:     $('modal-result'),
  resultFilmName:  $('result-film-name'),
  resultLinks:     $('result-links'),

  // Divers
  toast:      $('toast'),
  footerYear: $('footer-year')
};

/* ============================================================
   INITIALISATION
============================================================ */
function init() {
  if (DOM.footerYear) DOM.footerYear.textContent = new Date().getFullYear();

  // Restaurer session
  const saved = sessionStorage.getItem('sf_session');
  if (saved) {
    try {
      APP.user = JSON.parse(saved);
      afficherPageFilms();
      return;
    } catch { sessionStorage.removeItem('sf_session'); }
  }

  attacherEvenements();
}

/* ============================================================
   ÉVÉNEMENTS
============================================================ */
function attacherEvenements() {
  // Formulaire d'enregistrement
  DOM.registerForm?.addEventListener('submit', soumettreInscription);

  // Recherche
  DOM.searchInput?.addEventListener('input', debounce(rechercherFilms, 220));

  // Filtres genre
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', filtrerParGenre);
  });

  // MonCash modal
  $('mc-close')?.addEventListener('click', fermerModalMoncash);
  DOM.btnPay?.addEventListener('click', confirmerPaiement);

  // Fermer en cliquant backdrop
  DOM.modalMoncash?.addEventListener('click', e => {
    if (e.target === DOM.modalMoncash) fermerModalMoncash();
  });
  DOM.modalResult?.addEventListener('click', e => {
    if (e.target === DOM.modalResult) closeResultModal();
  });

  // Echap
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      fermerModalMoncash();
      closeResultModal();
    }
  });

  // Format téléphone
  $('r-phone')?.addEventListener('input', formaterTel);
  DOM.mcPhone?.addEventListener('input', formaterTel);
}

/* ============================================================
   INSCRIPTION
============================================================ */
function soumettreInscription(e) {
  e.preventDefault();

  const prenom = $('r-firstname').value.trim();
  const nom    = $('r-lastname').value.trim();
  const email  = $('r-email').value.trim();
  const tel    = $('r-phone').value.trim();

  let ok = true;

  // Validation prénom
  if (!prenom || prenom.length < 2) {
    afficherErreur('err-firstname', 'Entrez votre prénom (min. 2 caractères).');
    $('r-firstname').classList.add('input-error');
    ok = false;
  } else {
    effacerErreur('err-firstname'); $('r-firstname').classList.remove('input-error');
  }

  // Validation nom
  if (!nom || nom.length < 2) {
    afficherErreur('err-lastname', 'Entrez votre nom (min. 2 caractères).');
    $('r-lastname').classList.add('input-error');
    ok = false;
  } else {
    effacerErreur('err-lastname'); $('r-lastname').classList.remove('input-error');
  }

  // Validation email
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    afficherErreur('err-email', 'Entrez une adresse e-mail valide.');
    $('r-email').classList.add('input-error');
    ok = false;
  } else {
    effacerErreur('err-email'); $('r-email').classList.remove('input-error');
  }

  // Validation téléphone
  if (!tel || tel.replace(/\s/g,'').length < 8) {
    afficherErreur('err-phone', 'Entrez votre numéro MonCash (8 chiffres).');
    $('r-phone').classList.add('input-error');
    ok = false;
  } else {
    effacerErreur('err-phone'); $('r-phone').classList.remove('input-error');
  }

  if (!ok) return;

  // Succès
  APP.user = { prenom, nom, email, tel };
  sessionStorage.setItem('sf_session', JSON.stringify(APP.user));

  const btn = $('btn-register');
  btn.textContent = '✅ Compte créé ! Chargement…';
  btn.disabled = true;

  setTimeout(afficherPageFilms, 600);
}

/* ============================================================
   NAVIGATION SPA
============================================================ */
function afficherPageFilms() {
  DOM.pageRegister.hidden = true;
  DOM.pageFilms.hidden    = false;

  // Header
  DOM.searchWrapper.hidden = false;
  DOM.headerGuest.hidden   = true;
  DOM.headerUser.hidden    = false;

  // Chip utilisateur
  const u = APP.user;
  DOM.userChipAvatar.textContent = u.prenom.charAt(0).toUpperCase();
  DOM.userChipName.textContent   = `${u.prenom} ${u.nom}`;
  DOM.welcomeName.textContent    = u.prenom + ' !';

  // Pré-remplir téléphone MonCash
  if (DOM.mcPhone && u.tel) DOM.mcPhone.value = u.tel;

  window.scrollTo({ top: 0, behavior: 'smooth' });
  rendreCatalogue();
  DOM.totalFilms.textContent = FILMS_DB.length;

  // Ré-attacher événements (premier appel)
  if (!DOM.registerForm._eventsBound) {
    attacherEvenements();
    DOM.registerForm._eventsBound = true;
  }
}

function logout() {
  // Réinitialiser l'état
  APP.user          = null;
  APP.genre         = 'all';
  APP.query         = '';
  APP.filmEnCours   = null;
  APP.paiementValide = false;

  sessionStorage.removeItem('sf_session');

  // Remettre les boutons header
  DOM.headerUser.hidden   = true;
  DOM.headerGuest.hidden  = false;

  // Réinitialiser le formulaire
  DOM.registerForm?.reset();
  const btn = $('btn-register');
  if (btn) { btn.textContent = 'Accéder au catalogue 🚀'; btn.disabled = false; }

  // Revenir à la page d'accueil
  DOM.searchWrapper.hidden = true;
  DOM.pageFilms.hidden     = true;
  DOM.pageRegister.hidden  = false;

  // Réinitialiser filtres
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  $('f-all')?.classList.add('active');
  if (DOM.searchInput) DOM.searchInput.value = '';

  window.scrollTo({ top: 0, behavior: 'smooth' });
  afficherToast('Vous avez été déconnecté. À bientôt !');
}

function handleLogoClick() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function scrollToRegister() {
  $('register-section')?.scrollIntoView({ behavior: 'smooth' });
}

/* ============================================================
   RENDU DU CATALOGUE
============================================================ */
function rendreCatalogue() {
  const q = APP.query.toLowerCase();
  const g = APP.genre;

  const filtres = FILMS_DB.filter(f => {
    const matchGenre  = g === 'all' || f.genre === g;
    const matchSearch = !q || f.titre.toLowerCase().includes(q) || f.genre.toLowerCase().includes(q) || f.desc.toLowerCase().includes(q);
    return matchGenre && matchSearch;
  });

  DOM.moviesGrid.innerHTML = '';

  if (filtres.length === 0) {
    DOM.noResults.hidden = false;
    DOM.searchInfo.textContent = '';
    return;
  }

  DOM.noResults.hidden = true;
  DOM.searchInfo.textContent = q
    ? `${filtres.length} résultat${filtres.length > 1 ? 's' : ''} pour "${APP.query}"`
    : g !== 'all' ? `${filtres.length} film${filtres.length > 1 ? 's' : ''} en ${g}`
    : '';

  filtres.forEach((film, idx) => {
    const carte = creerCartFilm(film, idx);
    DOM.moviesGrid.appendChild(carte);
  });
}

/* ============================================================
   CRÉATION D'UNE CARTE FILM
============================================================ */
function creerCartFilm(film, idx) {
  const article = document.createElement('article');
  article.className = 'movie-card';
  article.style.animationDelay = `${idx * 55}ms`;
  article.setAttribute('aria-label', `Film : ${film.titre}`);

  const pillsHTML = film.plateformes
    .map(p => `<span class="platform-pill">${p.nom}</span>`)
    .join('');

  article.innerHTML = `
    <div class="movie-poster">
      <img src="${film.image}" alt="${film.imageAlt}" loading="lazy"
           onerror="this.style.display='none'; this.parentElement.style.background='linear-gradient(135deg,#1E40AF,#3B82F6)'" />
      <div class="poster-overlay"></div>
      <span class="poster-badge-year">${film.annee}</span>
      <span class="poster-badge-rating">${film.note}</span>
    </div>
    <div class="movie-body">
      <span class="movie-genre">${film.genre}</span>
      <h3 class="movie-title-text">${film.titre}</h3>
      <p class="movie-desc">${film.desc}</p>
      <div class="movie-platforms-preview">${pillsHTML}</div>
      <button class="btn-watch" onclick="ouvrirModalPaiement(${film.id})"
              aria-label="Payer 500 HTG pour voir où regarder ${film.titre}">
        <span class="btn-watch-m" aria-hidden="true">M</span>
        Où regarder ? (500 HTG)
      </button>
    </div>
  `;

  return article;
}

/* ============================================================
   FILTRES & RECHERCHE
============================================================ */
function filtrerParGenre(e) {
  const btn = e.currentTarget;
  APP.genre = btn.dataset.genre;
  APP.query = '';
  if (DOM.searchInput) DOM.searchInput.value = '';

  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  rendreCatalogue();
}

function rechercherFilms(e) {
  APP.query = e.target.value;
  APP.genre = 'all';

  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  $('f-all')?.classList.add('active');

  rendreCatalogue();
}

/* ============================================================
   MODAL MONCASH — OUVERTURE
============================================================ */
function ouvrirModalPaiement(filmId) {
  const film = FILMS_DB.find(f => f.id === filmId);
  if (!film) return;

  // 🔒 Réinitialiser le verrou anti-fraude
  APP.paiementValide = false;
  APP.filmEnCours    = film;

  // Remplir la modale
  DOM.mcFilmTitle.textContent  = film.titre;
  DOM.mcFilmThumb.src          = film.image;
  DOM.mcFilmThumb.alt          = film.imageAlt;

  // Pré-remplir numéro
  if (DOM.mcPhone && APP.user?.tel) DOM.mcPhone.value = APP.user.tel;
  else if (DOM.mcPhone) DOM.mcPhone.value = '';

  // Réinitialiser bouton
  DOM.btnPay.disabled = false;
  DOM.btnPay.innerHTML = `<span class="mc-btn-icon" aria-hidden="true">M</span> Confirmer le paiement – 500 HTG`;

  effacerErreur('err-mc-phone');
  DOM.mcPhone?.classList.remove('input-error');

  DOM.modalMoncash.hidden = false;
  document.body.style.overflow = 'hidden';
  setTimeout(() => DOM.mcPhone?.focus(), 120);
}

/* ============================================================
   MODAL MONCASH — FERMETURE
   🔒 Anti-fraude : fermer la modale NE débloque PAS le lien
============================================================ */
function fermerModalMoncash() {
  DOM.modalMoncash.hidden = true;
  document.body.style.overflow = '';
  // APP.paiementValide reste false → lien JAMAIS affiché
}

/* ============================================================
   CONFIRMATION DU PAIEMENT MONCASH
============================================================ */
function confirmerPaiement() {
  const tel = DOM.mcPhone?.value.trim() || '';
  const telNettoye = tel.replace(/\s/g, '');

  if (!telNettoye || telNettoye.length < 8) {
    afficherErreur('err-mc-phone', 'Entrez votre numéro MonCash (8 chiffres min.).');
    DOM.mcPhone?.classList.add('input-error');
    DOM.mcPhone?.focus();
    return;
  }

  effacerErreur('err-mc-phone');
  DOM.mcPhone?.classList.remove('input-error');

  // Désactiver le bouton
  DOM.btnPay.disabled = true;
  DOM.btnPay.textContent = '⏳ Initialisation...';

  // Fermer modal MonCash, ouvrir modal chargement
  setTimeout(() => {
    DOM.modalMoncash.hidden = true;
    DOM.modalLoading.hidden = false;
    
    // Déclencher le flux API de Dexchange
    initierTransactionDexchange(telNettoye);
  }, 400);
}

/* ============================================================
   GESTION DE L'API DEXCHANGE (Mode Production / Redirection)
============================================================ */
async function initierTransactionDexchange(telClient) {
  const film = APP.filmEnCours;
  if (!film) return;

  // Réinitialiser les indicateurs visuels du modal de chargement
  DOM.loadingMsg.textContent = "Initialisation de la transaction MonCash sécurisée...";
  [DOM.lstep1, DOM.lstep2, DOM.lstep3].forEach(s => {
    if (s) {
      s.classList.remove('done');
      s.style.display = 'block';
    }
  });

  if (DOM.lstep1) DOM.lstep1.textContent = "⏳ Vérification du numéro client...";
  if (DOM.lstep2) DOM.lstep2.textContent = "⏳ Initialisation du paiement...";
  if (DOM.lstep3) DOM.lstep3.textContent = "⏳ Statut : En attente de paiement...";

  // Détecter si les identifiants réels n'ont pas encore été renseignés
  const isDemo = 
    DEXCHANGE_CONFIG.MERCHANT_KEY.includes('VOTRE_') ||
    DEXCHANGE_CONFIG.CLIENT_ID.includes('VOTRE_') ||
    DEXCHANGE_CONFIG.SECRET_KEY.includes('VOTRE_');

  if (isDemo) {
    console.log("[Dexchange Integration] Mode démo actif - Clés API Dexchange non configurées. Lancement de la simulation.");
    lancerSimulationDemoDexchange(telClient);
    return;
  }

  try {
    const orderId = `SF-${film.id}-${Date.now()}`;
    
    // A. Génère la requête HTTP (fetch) vers l'API de Dexchange (mode production)
    // Transmet : montant (500 HTG), devise (HTG), téléphone client, identifiant marchand (Merchant Key)
    const payload = {
      merchant_key:   DEXCHANGE_CONFIG.MERCHANT_KEY,
      client_id:      DEXCHANGE_CONFIG.CLIENT_ID,
      secret_key:     DEXCHANGE_CONFIG.SECRET_KEY,
      merchant_phone: DEXCHANGE_CONFIG.MERCHANT_PHONE,
      customer_phone: telClient,
      amount:         DEXCHANGE_CONFIG.AMOUNT,
      currency:       DEXCHANGE_CONFIG.CURRENCY,
      order_id:       orderId,
      description:    `StreamFinder - Accès au film ${film.titre}`
    };

    if (DOM.lstep1) {
      DOM.lstep1.textContent = "✅ Numéro client validé";
      DOM.lstep1.classList.add('done');
    }
    
    DOM.loadingMsg.textContent = "Envoi de la demande de paiement à Dexchange...";

    const response = await fetch(`${DEXCHANGE_CONFIG.API_URL}/payments/initiate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${DEXCHANGE_CONFIG.MERCHANT_KEY}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Erreur de réponse de la passerelle Dexchange.");
    }

    if (DOM.lstep2) {
      DOM.lstep2.textContent = "✅ Lien sécurisé MonCash généré";
      DOM.lstep2.classList.add('done');
    }

    DOM.loadingMsg.textContent = "Ouverture de la page de paiement Digicel sécurisée...";

    // B. Récupère l'URL de redirection et ouvre un nouvel onglet
    // L'utilisateur entre son code secret (PIN) sur cette page externe sécurisée
    const urlRedirection = data.redirect_url;
    window.open(urlRedirection, "_blank", "noopener,noreferrer");

    // C. Démarrer l'écoute asynchrone du statut de la transaction (Anti-Fraude)
    await verifierStatutTransaction(data.transaction_id || orderId);

  } catch (error) {
    console.error("[Dexchange Error]", error);
    DOM.modalLoading.hidden = true;
    afficherToast(`❌ Erreur API Dexchange : ${error.message || "Connexion impossible"}`);
  }
}

/* ============================================================
   ASYNCHRONOUS TRANSACTION VERIFICATION (Polling / Webhook Callback simulation)
   🔒 Anti-fraude : Débloque le lien de streaming UNIQUEMENT si le statut est "PAID"
============================================================ */
async function verifierStatutTransaction(transactionId) {
  DOM.loadingMsg.textContent = "Veuillez entrer votre code PIN MonCash sur la page sécurisée Digicel.";
  
  const maxAttempts = 60; // 5 minutes max
  let attempt = 0;

  while (attempt < maxAttempts) {
    attempt++;
    if (DOM.lstep3) {
      DOM.lstep3.textContent = `⏳ Vérification du paiement (essai ${attempt}/${maxAttempts})...`;
    }

    try {
      const response = await fetch(`${DEXCHANGE_CONFIG.API_URL}/payments/status/${transactionId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${DEXCHANGE_CONFIG.MERCHANT_KEY}`
        }
      });

      const data = await response.json();

      // Si le paiement est validé par la plateforme Dexchange
      if (response.ok && (data.status === 'PAID' || data.status === 'SUCCESS' || data.success === true)) {
        if (DOM.lstep3) {
          DOM.lstep3.textContent = "✅ Paiement MonCash validé !";
          DOM.lstep3.classList.add('done');
        }
        DOM.loadingMsg.textContent = "Transaction Dexchange confirmée !";

        // 🔒 Déverrouillage sécurisé anti-fraude
        APP.paiementValide = true;

        setTimeout(() => {
          DOM.modalLoading.hidden = true;
          afficherModalResultat(APP.filmEnCours);
        }, 1200);
        return;
      }

      // Si la transaction est explicitement annulée ou rejetée
      if (data.status === 'FAILED' || data.status === 'CANCELLED') {
        throw new Error("Paiement refusé ou annulé.");
      }

    } catch (err) {
      console.warn("[Verification Status Polling]", err.message);
    }

    // Attendre 5 secondes avant la prochaine requête
    await new Promise(resolve => setTimeout(resolve, 5000));
  }

  // Timeout dépassé
  DOM.modalLoading.hidden = true;
  afficherToast("⏳ Temps de validation dépassé. Si vous avez payé, veuillez contacter le support.");
}

/* ============================================================
   SIMULATION DE DÉMO (Lorsque les clés ne sont pas configurées)
============================================================ */
function lancerSimulationDemoDexchange(telClient) {
  const film = APP.filmEnCours;
  
  setTimeout(() => {
    if (DOM.lstep1) { DOM.lstep1.textContent = "✅ Numéro client validé (+509 " + telClient + ")"; DOM.lstep1.classList.add('done'); }
    DOM.loadingMsg.textContent = "Initialisation de la transaction Dexchange...";
  }, 1000);

  setTimeout(() => {
    if (DOM.lstep2) { DOM.lstep2.textContent = "✅ Lien MonCash de démo généré"; DOM.lstep2.classList.add('done'); }
    DOM.loadingMsg.textContent = "Redirection de simulation vers Digicel...";
  }, 2200);

  setTimeout(() => {
    if (DOM.lstep3) { DOM.lstep3.textContent = "✅ Redirection effectuée !"; DOM.lstep3.classList.add('done'); }
    
    // URL de démo MonCash
    const orderId = `SF-DEMO-${film.id}-${Date.now()}`;
    const desc = encodeURIComponent(`StreamFinder Demo - ${film.titre} - 500 HTG`);
    const demoUrl = `https://moncashbutton.digicelhaiti.com/Moncash-business/Pay?number=38086319&amount=500&orderId=${orderId}&description=${desc}`;
    
    window.open(demoUrl, "_blank", "noopener,noreferrer");

    // Débloquer le paiement
    APP.paiementValide = true;

    setTimeout(() => {
      DOM.modalLoading.hidden = true;
      afficherModalResultat(film);
      afficherToast("💡 Mode Démo : Clés Dexchange absentes, redirection MonCash simulée.");
    }, 1000);

  }, 3500);
}

/* ============================================================
   MODAL RÉSULTAT — AFFICHAGE DU LIEN FILM
   🔒 UNIQUEMENT si APP.paiementValide === true
============================================================ */
function afficherModalResultat(film) {
  // 🔒 Vérification anti-fraude double
  if (!APP.paiementValide) {
    console.warn('[StreamFinder] Accès refusé : paiement non validé.');
    afficherToast('❌ Paiement non confirmé. Le lien reste protégé.');
    return;
  }

  DOM.resultFilmName.textContent = film.titre;

  // Générer les liens officiels
  DOM.resultLinks.innerHTML = film.plateformes.map(p => `
    <a href="${p.url}" target="_blank" rel="noopener noreferrer"
       class="result-platform-btn" onclick="logClic('${p.nom}', '${film.titre}')">
      <div class="rp-icon" style="background:${p.couleur};">${p.icone}</div>
      <div class="rp-details">
        <strong>${p.nom}</strong>
        <small>Cliquer pour accéder à la plateforme officielle</small>
      </div>
      <span class="rp-arrow" aria-hidden="true">→</span>
    </a>
  `).join('');

  DOM.modalResult.hidden = false;
  document.body.style.overflow = 'hidden';
  afficherToast(`✅ Accès débloqué pour "${film.titre}" !`);
}

/* ============================================================
   MODAL RÉSULTAT — FERMETURE
============================================================ */
function closeResultModal() {
  DOM.modalResult.hidden = true;
  document.body.style.overflow = '';
  // 🔒 Réinitialiser le verrou après fermeture
  APP.paiementValide = false;
  APP.filmEnCours    = null;
}

/* ============================================================
   UTILITAIRES
============================================================ */

// Format téléphone haïtien : XX XX XX XX
function formaterTel(e) {
  let v = e.target.value.replace(/\D/g, '');
  if (v.length > 8) v = v.slice(0, 8);
  const parts = [];
  for (let i = 0; i < v.length; i += 2) parts.push(v.slice(i, i + 2));
  e.target.value = parts.join(' ');
}

// Afficher erreur de champ
function afficherErreur(id, msg) {
  const el = $(id);
  if (el) el.textContent = msg;
}

// Effacer erreur de champ
function effacerErreur(id) {
  const el = $(id);
  if (el) el.textContent = '';
}

// Toast notification
let _toastTimer = null;
function afficherToast(msg, duree = 3800) {
  const t = DOM.toast;
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  if (_toastTimer) clearTimeout(_toastTimer);
  _toastTimer = setTimeout(() => t.classList.remove('show'), duree);
}

// Log analytique (extensible avec Google Analytics)
function logClic(plateforme, film) {
  console.log(`[StreamFinder] Clic → ${plateforme} pour "${film}"`);
  // gtag('event', 'platform_click', { platform: plateforme, movie: film });
}

// Debounce
function debounce(fn, ms) {
  let timer;
  return function(...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), ms);
  };
}

/* ============================================================
   DÉMARRAGE
============================================================ */
document.addEventListener('DOMContentLoaded', init);
