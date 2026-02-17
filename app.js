/* ============================================================
 *  app.js — Generador de Afiches Deportivos
 *  Estado central, bindings, exportación JPG, localStorage
 * ============================================================ */

// ────────────────────────────────────────────────────────────────
// 1. CONFIGURACIÓN Y DEFAULTS
// ────────────────────────────────────────────────────────────────

const DEFAULT_STATE = {
  kicker:      'PARTIDO RECOPA 2026',
  titleLine1:  'AÑOS',
  titleLine2:  'DORADOS',
  fecha:       'DOMINGO 15/02',
  hora:        '17:00',
  cancha:      'CANCHA CHIGUAYANTE SUR',
  organiza:    '',
  teamA_name:  'TIGRE',
  teamA_city:  'Hualqui',
  teamA_logo:  'Foto1.png',
  teamA_logoCustom: null,
  teamB_name:  'FERRO',
  teamB_city:  'Chiguayante',
  teamB_logo:  'Foto2.png',
  teamB_logoCustom: null,
  fondo:       'FutbolBackground3.png',
  fondoCustom: null,
  tema:        'dorado',
  accentColor: '#f0b43a',
  fuente:      'bebas-montserrat',
  exportScale: 2,
  fileName:    ''
};

const BACKGROUNDS = [
  { file: 'FutbolBackground3.png', label: 'Estadio Nocturno' },
  { file: 'FutbolBackground1.png', label: 'Fútbol Clásico 1' },
  { file: 'FutbolBackground2.png', label: 'Fútbol Clásico 2' },
  { file: 'Partido_Recopa_2026.jpg', label: 'Recopa 2026' }
];

const THEMES = {
  dorado: {
    label: '🌙 Nocturno Dorado',
    gold1: '#ffd88a', gold2: '#f0b43a', gold3: '#b8771f',
    bg: '#060914',
    bodyGrad: 'radial-gradient(1100px 780px at 50% 10%, #1a2f6b 0%, #060914 62%, #04050c 100%)',
    ink: '#eaf0ff',
    card: 'rgba(10, 14, 28, .55)',
    preview: ['#060914', '#1a2f6b', '#f0b43a']
  },
  rojo: {
    label: '🔴 Rojo Intenso',
    gold1: '#ffb3b3', gold2: '#e63946', gold3: '#9b1b30',
    bg: '#140404',
    bodyGrad: 'radial-gradient(1100px 780px at 50% 10%, #6b1a1a 0%, #140404 62%, #0c0404 100%)',
    ink: '#fff0f0',
    card: 'rgba(28, 10, 10, .55)',
    preview: ['#140404', '#6b1a1a', '#e63946']
  },
  azul: {
    label: '🔵 Azul Limpio',
    gold1: '#b3d9ff', gold2: '#4a9eff', gold3: '#1a5bb8',
    bg: '#040914',
    bodyGrad: 'radial-gradient(1100px 780px at 50% 10%, #1a4f9b 0%, #040914 62%, #020508 100%)',
    ink: '#f0f6ff',
    card: 'rgba(10, 18, 38, .55)',
    preview: ['#040914', '#1a4f9b', '#4a9eff']
  }
};

const FONTS = {
  'bebas-montserrat': {
    heading: '"Bebas Neue", sans-serif',
    body: '"Montserrat", sans-serif',
    label: 'Bebas + Montserrat'
  },
  'bebas-inter': {
    heading: '"Bebas Neue", sans-serif',
    body: '"Inter", sans-serif',
    label: 'Bebas + Inter'
  },
  'oswald-montserrat': {
    heading: '"Oswald", sans-serif',
    body: '"Montserrat", sans-serif',
    label: 'Oswald + Montserrat'
  }
};

// ────────────────────────────────────────────────────────────────
// 2. ESTADO
// ────────────────────────────────────────────────────────────────

let state = {};

// ────────────────────────────────────────────────────────────────
// 3. INICIALIZACIÓN
// ────────────────────────────────────────────────────────────────

function init() {
  state = loadFromLocalStorage() || deepClone(DEFAULT_STATE);
  buildBgGrid();
  buildThemeGrid();
  buildFontGrid();
  populateInputsFromState();
  renderPoster();
  updateScaleUI();
  updateAccentUI();
}

document.addEventListener('DOMContentLoaded', init);

// ────────────────────────────────────────────────────────────────
// 4. SINCRONIZACIÓN INPUTS ↔ ESTADO
// ────────────────────────────────────────────────────────────────

function populateInputsFromState() {
  el('input-kicker').value    = state.kicker;
  el('input-title1').value    = state.titleLine1;
  el('input-title2').value    = state.titleLine2;
  el('input-fecha').value     = state.fecha;
  el('input-hora').value      = state.hora;
  el('input-cancha').value    = state.cancha;
  el('input-organiza').value  = state.organiza;
  el('input-teamA-name').value = state.teamA_name;
  el('input-teamA-city').value = state.teamA_city;
  el('input-teamB-name').value = state.teamB_name;
  el('input-teamB-city').value = state.teamB_city;
  el('input-filename').value  = state.fileName;
  el('input-accent').value    = state.accentColor;
  el('input-accent-hex').value = state.accentColor;

  // Logo previews en panel
  el('preview-logo-a').src = state.teamA_logoCustom || state.teamA_logo;
  el('preview-logo-b').src = state.teamB_logoCustom || state.teamB_logo;
}

function readInputsToState() {
  state.kicker     = el('input-kicker').value;
  state.titleLine1 = el('input-title1').value;
  state.titleLine2 = el('input-title2').value;
  state.fecha      = el('input-fecha').value;
  state.hora       = el('input-hora').value;
  state.cancha     = el('input-cancha').value;
  state.organiza   = el('input-organiza').value;
  state.teamA_name = el('input-teamA-name').value;
  state.teamA_city = el('input-teamA-city').value;
  state.teamB_name = el('input-teamB-name').value;
  state.teamB_city = el('input-teamB-city').value;
  state.fileName   = el('input-filename').value;
}

function updateFromInput() {
  readInputsToState();
  renderPoster();
  saveToLocalStorage();
}

// ────────────────────────────────────────────────────────────────
// 5. RENDERIZADO DEL POSTER
// ────────────────────────────────────────────────────────────────

function renderPoster() {
  // Textos
  el('poster-kicker').textContent   = state.kicker   || '\u00A0';
  el('poster-title1').textContent   = state.titleLine1 || '\u00A0';
  el('poster-title2').textContent   = state.titleLine2 || '\u00A0';
  el('poster-fecha').textContent    = state.fecha    || '\u00A0';
  el('poster-hora').textContent     = state.hora     || '\u00A0';
  el('poster-cancha').textContent   = state.cancha   || '\u00A0';

  // Equipos
  el('poster-teamA-name').textContent = state.teamA_name || '\u00A0';
  el('poster-teamA-city').textContent = state.teamA_city || '\u00A0';
  el('poster-teamB-name').textContent = state.teamB_name || '\u00A0';
  el('poster-teamB-city').textContent = state.teamB_city || '\u00A0';

  // Logos
  el('poster-logo-a').src = state.teamA_logoCustom || state.teamA_logo;
  el('poster-logo-b').src = state.teamB_logoCustom || state.teamB_logo;

  // Footer "organiza"
  const orgText = (state.organiza || '').trim();
  const footer  = el('poster-footer');
  if (orgText) {
    footer.hidden = false;
    el('poster-organiza').textContent = orgText;
  } else {
    footer.hidden = true;
  }

  // Fondo
  applyBackground();

  // Tema + accent
  applyTheme();

  // Fuentes
  applyFonts();

  // Aria-label dinámico
  el('poster').setAttribute('aria-label',
    `Afiche: ${state.titleLine1} ${state.titleLine2}. ` +
    `${state.teamA_name} vs ${state.teamB_name}. ` +
    `${state.fecha} ${state.hora}. ${state.cancha}.`
  );
}

function applyBackground() {
  const bgUrl  = state.fondoCustom || state.fondo;
  const poster = el('poster');
  poster.style.background = [
    'linear-gradient(180deg, rgba(0,0,0,.05), rgba(0,0,0,.30))',
    `url("${bgUrl}") center/cover no-repeat`,
    'radial-gradient(900px 520px at 50% 18%, rgba(120,180,255,.20) 0%, rgba(0,0,0,0) 60%)',
    'radial-gradient(900px 520px at 50% 100%, rgba(70,170,90,.18) 0%, rgba(0,0,0,0) 55%)'
  ].join(', ');
}

function applyTheme() {
  const theme  = THEMES[state.tema] || THEMES.dorado;
  const accent = computeAccentColors(state.accentColor);
  const poster = el('poster');

  // CSS custom properties en el poster
  poster.style.setProperty('--gold-1', accent.gold1);
  poster.style.setProperty('--gold-2', accent.gold2);
  poster.style.setProperty('--gold-3', accent.gold3);
  poster.style.setProperty('--ink',    theme.ink);
  poster.style.setProperty('--card',   theme.card);
  poster.style.setProperty('--bg',     theme.bg);

  // Fondo de la página
  document.body.style.background = theme.bodyGrad;

  // VS badge
  const vsBadge = el('poster-vs');
  if (vsBadge) {
    vsBadge.style.borderColor = accent.gold2;
    vsBadge.style.color       = accent.gold2;
  }

  // Divider color
  const divider = poster.querySelector('.divider');
  if (divider) {
    divider.style.background =
      `linear-gradient(90deg, rgba(255,255,255,0), ${accent.gold1}99, rgba(255,255,255,0))`;
  }

  // Actualizar estados activos en tema grid
  document.querySelectorAll('.theme-card').forEach(card => {
    card.classList.toggle('theme-card--active', card.dataset.theme === state.tema);
  });
}

function applyFonts() {
  const font   = FONTS[state.fuente] || FONTS['bebas-montserrat'];
  const poster = el('poster');

  // Aplicar font heading al título
  const title = poster.querySelector('.title');
  if (title) title.style.fontFamily = font.heading;

  // Aplicar font body al poster
  poster.style.fontFamily = font.body;

  // Actualizar estados activos en font grid
  document.querySelectorAll('.font-card').forEach(card => {
    card.classList.toggle('font-card--active', card.dataset.font === state.fuente);
  });
}

// ────────────────────────────────────────────────────────────────
// 6. CONSTRUCTORES DE UI (grids / selectores)
// ────────────────────────────────────────────────────────────────

function buildBgGrid() {
  const grid = el('bg-grid');
  grid.innerHTML = '';
  BACKGROUNDS.forEach(bg => {
    const card  = document.createElement('button');
    card.className = 'bg-card' +
      (state.fondo === bg.file && !state.fondoCustom ? ' bg-card--active' : '');
    card.dataset.file = bg.file;
    card.title = bg.label;
    card.style.backgroundImage = `url("${bg.file}")`;
    card.onclick = () => selectBg(bg.file);

    const label = document.createElement('span');
    label.className = 'bg-card__label';
    label.textContent = bg.label;
    card.appendChild(label);

    grid.appendChild(card);
  });
}

function buildThemeGrid() {
  const grid = el('theme-grid');
  grid.innerHTML = '';
  Object.entries(THEMES).forEach(([key, theme]) => {
    const card = document.createElement('button');
    card.className = 'theme-card' + (state.tema === key ? ' theme-card--active' : '');
    card.dataset.theme = key;
    card.onclick = () => selectTheme(key);

    const swatch = document.createElement('div');
    swatch.className = 'theme-card__swatch';
    swatch.style.background = `linear-gradient(135deg, ${theme.preview[0]}, ${theme.preview[1]})`;

    const dot = document.createElement('div');
    dot.className = 'theme-card__dot';
    dot.style.background = theme.preview[2];
    swatch.appendChild(dot);

    const label = document.createElement('span');
    label.className = 'theme-card__label';
    label.textContent = theme.label;

    card.appendChild(swatch);
    card.appendChild(label);
    grid.appendChild(card);
  });
}

function buildFontGrid() {
  const grid = el('font-grid');
  grid.innerHTML = '';
  Object.entries(FONTS).forEach(([key, font]) => {
    const card = document.createElement('button');
    card.className = 'font-card' + (state.fuente === key ? ' font-card--active' : '');
    card.dataset.font = key;
    card.onclick = () => selectFont(key);

    const sample = document.createElement('span');
    sample.className = 'font-card__sample';
    sample.style.fontFamily = font.heading;
    sample.textContent = 'Aa';

    const label = document.createElement('span');
    label.className = 'font-card__label';
    label.textContent = font.label;

    card.appendChild(sample);
    card.appendChild(label);
    grid.appendChild(card);
  });
}

// ────────────────────────────────────────────────────────────────
// 7. SELECTORES
// ────────────────────────────────────────────────────────────────

function selectBg(file) {
  state.fondo       = file;
  state.fondoCustom = null;
  renderPoster();
  saveToLocalStorage();
  document.querySelectorAll('.bg-card').forEach(c =>
    c.classList.toggle('bg-card--active', c.dataset.file === file)
  );
}

function selectTheme(key) {
  state.tema        = key;
  state.accentColor = THEMES[key].gold2;
  updateAccentUI();
  renderPoster();
  saveToLocalStorage();
}

function selectFont(key) {
  state.fuente = key;
  renderPoster();
  saveToLocalStorage();
}

function setScale(scale) {
  state.exportScale = scale;
  updateScaleUI();
  saveToLocalStorage();
}

function updateScaleUI() {
  document.querySelectorAll('.scale-btn').forEach(btn =>
    btn.classList.toggle('scale-btn--active',
      parseInt(btn.dataset.scale) === state.exportScale)
  );
}

function updateAccent(hex) {
  if (/^#[0-9a-fA-F]{6}$/.test(hex)) {
    state.accentColor = hex;
    el('input-accent-hex').value = hex;
    renderPoster();
    saveToLocalStorage();
  }
}

function updateAccentFromHex(val) {
  if (/^#[0-9a-fA-F]{6}$/.test(val)) {
    state.accentColor = val;
    el('input-accent').value = val;
    renderPoster();
    saveToLocalStorage();
  }
}

function updateAccentUI() {
  el('input-accent').value     = state.accentColor;
  el('input-accent-hex').value = state.accentColor;
}

// ────────────────────────────────────────────────────────────────
// 8. SUBIDA DE ARCHIVOS
// ────────────────────────────────────────────────────────────────

function handleLogoUpload(team, input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    const dataUrl = e.target.result;
    if (team === 'a') {
      state.teamA_logoCustom = dataUrl;
      el('preview-logo-a').src = dataUrl;
    } else {
      state.teamB_logoCustom = dataUrl;
      el('preview-logo-b').src = dataUrl;
    }
    renderPoster();
    saveToLocalStorage();
  };
  reader.readAsDataURL(file);
}

function handleBgUpload(input) {
  const file = input.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function (e) {
    state.fondoCustom = e.target.result;
    renderPoster();
    saveToLocalStorage();
    document.querySelectorAll('.bg-card').forEach(c =>
      c.classList.remove('bg-card--active')
    );
  };
  reader.readAsDataURL(file);
}

function resetLogo(team) {
  if (team === 'a') {
    state.teamA_logoCustom = null;
    el('preview-logo-a').src = state.teamA_logo;
  } else {
    state.teamB_logoCustom = null;
    el('preview-logo-b').src = state.teamB_logo;
  }
  renderPoster();
  saveToLocalStorage();
}

// ────────────────────────────────────────────────────────────────
// 9. ACCIONES RÁPIDAS
// ────────────────────────────────────────────────────────────────

function loadTemplate() {
  state = deepClone(DEFAULT_STATE);
  populateInputsFromState();
  buildBgGrid();
  buildThemeGrid();
  buildFontGrid();
  updateScaleUI();
  updateAccentUI();
  renderPoster();
  saveToLocalStorage();
  showStatus('✅ Plantilla Tigre vs Ferro cargada', 'success');
}

function newMatch() {
  state = deepClone(DEFAULT_STATE);
  state.kicker     = '';
  state.titleLine1 = '';
  state.titleLine2 = '';
  state.fecha      = '';
  state.hora       = '';
  state.cancha     = '';
  state.organiza   = '';
  state.teamA_name = '';
  state.teamA_city = '';
  state.teamB_name = '';
  state.teamB_city = '';
  state.fileName   = '';
  populateInputsFromState();
  renderPoster();
  saveToLocalStorage();
  showStatus('✨ Nuevo partido — ¡Completá los datos!', 'success');
}

function duplicateMatch() {
  state.fecha    = '';
  state.hora     = '';
  state.fileName = '';
  el('input-fecha').value    = '';
  el('input-hora').value     = '';
  el('input-filename').value = '';
  renderPoster();
  saveToLocalStorage();
  showStatus('📄 Duplicado — cambiá solo fecha y hora', 'success');
}

function resetAll() {
  if (!confirm('¿Borrar todo y volver al inicio?')) return;
  localStorage.removeItem('poster-state');
  state = deepClone(DEFAULT_STATE);
  populateInputsFromState();
  buildBgGrid();
  buildThemeGrid();
  buildFontGrid();
  updateScaleUI();
  updateAccentUI();
  renderPoster();
  showStatus('🗑️ Todo borrado. Valores por defecto.', 'success');
}

// ────────────────────────────────────────────────────────────────
// 10. EXPORTAR JPG
// ────────────────────────────────────────────────────────────────

function downloadPoster() {
  const btn       = el('btn-download');
  const btnMobile = document.getElementById('btn-download-mobile');
  const origText  = btn.textContent;

  // UI de carga
  btn.disabled    = true;
  btn.textContent = '⏳ Generando imagen…';
  if (btnMobile) {
    btnMobile.disabled    = true;
    btnMobile.textContent = '⏳ Generando…';
  }

  const poster = el('poster');

  // ① Workaround: background-clip:text no exporta bien en html2canvas
  const goldEls    = poster.querySelectorAll('.title--gold');
  const savedGold  = [];
  goldEls.forEach(elem => {
    savedGold.push({
      el:     elem,
      bg:     elem.style.background,
      clip:   elem.style.webkitBackgroundClip,
      clipS:  elem.style.backgroundClip,
      color:  elem.style.color,
      shadow: elem.style.textShadow,
      filter: elem.style.filter
    });
    elem.style.background          = 'none';
    elem.style.webkitBackgroundClip = 'initial';
    elem.style.backgroundClip      = 'initial';
    elem.style.color                = state.accentColor;
    elem.style.textShadow           = '0 2px 4px rgba(0,0,0,0.5)';
    elem.style.filter               = 'none';
  });

  // ② Forzar ancho fijo para captura consistente
  const origW        = poster.style.width;
  const origMaxW     = poster.style.maxWidth;
  poster.style.width    = '520px';
  poster.style.maxWidth = '520px';

  html2canvas(poster, {
    scale:           state.exportScale,
    useCORS:         true,
    allowTaint:      true,
    backgroundColor: null,
    logging:         false
  }).then(canvas => {
    const name = (state.fileName || '').trim() || generateFileName();
    const link = document.createElement('a');
    link.download = name.endsWith('.jpg') ? name : name + '.jpg';
    link.href     = canvas.toDataURL('image/jpeg', 0.92);
    link.click();
    showStatus('✅ ¡Listo! Se descargó el afiche', 'success');
  }).catch(err => {
    console.error('Export error:', err);
    showStatus(
      '❌ No se pudo exportar. Si abriste el archivo como file:// probá abrirlo con Live Server o usar Firefox.',
      'error'
    );
  }).finally(() => {
    // ③ Restaurar estilos
    savedGold.forEach(s => {
      s.el.style.background          = s.bg;
      s.el.style.webkitBackgroundClip = s.clip;
      s.el.style.backgroundClip      = s.clipS;
      s.el.style.color                = s.color;
      s.el.style.textShadow           = s.shadow;
      s.el.style.filter               = s.filter;
    });
    poster.style.width    = origW;
    poster.style.maxWidth = origMaxW;

    btn.disabled    = false;
    btn.textContent = origText;
    if (btnMobile) {
      btnMobile.disabled    = false;
      btnMobile.textContent = '📸 GUARDAR FOTO';
    }
  });
}

function generateFileName() {
  const a = (state.teamA_name || 'EquipoA').replace(/\s+/g, '');
  const b = (state.teamB_name || 'EquipoB').replace(/\s+/g, '');
  const f = (state.fecha || 'SinFecha').replace(/\s+/g, '_').replace(/\//g, '-');
  return `Partido_${a}_vs_${b}_${f}`;
}

// ────────────────────────────────────────────────────────────────
// 11. LOCALSTORAGE
// ────────────────────────────────────────────────────────────────

function saveToLocalStorage() {
  try {
    localStorage.setItem('poster-state', JSON.stringify(state));
  } catch (_e) {
    // Si excede cuota (imágenes grandes), guardar sin imágenes custom
    try {
      const lite = Object.assign({}, state, {
        teamA_logoCustom: null,
        teamB_logoCustom: null,
        fondoCustom:      null
      });
      localStorage.setItem('poster-state', JSON.stringify(lite));
    } catch (_e2) {
      console.warn('localStorage lleno, no se guardaron los cambios.');
    }
  }
}

function loadFromLocalStorage() {
  try {
    const raw = localStorage.getItem('poster-state');
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    // Validación mínima
    if (typeof parsed.kicker === 'undefined') return null;
    return parsed;
  } catch (_e) {
    return null;
  }
}

// ────────────────────────────────────────────────────────────────
// 12. UTILIDADES
// ────────────────────────────────────────────────────────────────

function el(id) {
  return document.getElementById(id);
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function showStatus(msg, type) {
  const s = el('download-status');
  s.textContent = msg;
  s.className   = 'download-status download-status--' + type;
  s.hidden      = false;
  clearTimeout(showStatus._t);
  showStatus._t = setTimeout(() => { s.hidden = true; }, 5000);
}

// ── Colores ──

function computeAccentColors(hex) {
  const hsl = hexToHSL(hex);
  return {
    gold1: hslToHex(hsl.h, Math.min(100, hsl.s), Math.min(92, hsl.l + 25)),
    gold2: hex,
    gold3: hslToHex(hsl.h, hsl.s, Math.max(12, hsl.l - 20))
  };
}

function hexToHSL(hex) {
  let r = parseInt(hex.slice(1, 3), 16) / 255;
  let g = parseInt(hex.slice(3, 5), 16) / 255;
  let b = parseInt(hex.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }
  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function hslToHex(h, s, l) {
  s /= 100; l /= 100;
  const a = s * Math.min(l, 1 - l);
  const f = n => {
    const k = (n + h / 30) % 12;
    const c = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * c).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}
