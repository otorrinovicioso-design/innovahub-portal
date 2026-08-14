'use strict';

const STORAGE_KEY = 'innovahub.portal.state.v1';
const GOOGLE_CLIENT_ID = '785417776612-r5jd8tp8u3d49de963erujoa3nhj5g9e.apps.googleusercontent.com';
const DRIVE_SCOPE = 'https://www.googleapis.com/auth/drive.appdata';
const DRIVE_FILE_NAME = 'innovahub-portal.json';
const GEM_CREATOR_URL = 'https://gemini.google.com/gem/167YCVt2Ooh33x_dTeQRZ7LWAT34nGP10?usp=sharing';
const THEMES = ['#00f2ff', '#ffaa00', '#ff0055'];
const DEFAULT_STATE = {
    hubName: 'Mi Innova Hub',
    accent: '#00f2ff',
    activeCategory: 'todos',
    tutorialSeen: false,
    categories: [],
    apps: []
};

let state = loadState();
let selectedColor = state.accent;
let editingAppId = null;
let setupFromDashboard = false;
let categoryCreationTarget = 'dashboard';
let googleTokenClient = null;
let accessToken = '';
let driveFileId = '';
let saveTimer = null;
let syncInFlight = Promise.resolve();
let tutorialStep = 0;
let tutorialAutoHandled = false;
const TUTORIAL_STEPS = [
    { title:'Crea tu aplicación', copy:'Pulsa Crear apps y cuéntale al asistente qué necesitas. Puedes explicarlo con tus propias palabras.', image:'tutorial-assets/01-crear-app.png', alt:'Creación de una aplicación con InnovaHub Apps Creator' },
    { title:'Pulsa Compartir', copy:'Cuando la app esté lista, abre el menú Compartir de la vista previa.', image:'tutorial-assets/02-compartir.png', alt:'Menú Compartir de una aplicación creada con Gemini' },
    { title:'Copia el enlace público', copy:'Pulsa Copiar enlace. Ese vínculo es el que conectará tu aplicación con InnovaHub.', image:'tutorial-assets/03-copiar-enlace.png', alt:'Ventana para copiar el enlace público de la aplicación' },
    { title:'Añádela a tu Hub', copy:'En InnovaHub pulsa Añadir app, pega el enlace, completa el nombre y guarda. Ya formará parte de tu ecosistema.', image:'tutorial-assets/04-anadir-hub.png', alt:'Formulario para añadir una aplicación a InnovaHub' }
];

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
const byId = (id) => document.getElementById(id);

function clone(value) { return JSON.parse(JSON.stringify(value)); }
function escapeHTML(value) {
    return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[char]);
}
function safeColor(value, fallback = '#00f2ff') { return /^#[0-9a-f]{6}$/i.test(value || '') ? value : fallback; }
function safeUrl(value) {
    let candidate = String(value || '').trim();
    if (!candidate) return '';
    if (!/^https?:\/\//i.test(candidate)) candidate = `https://${candidate}`;
    try { const url = new URL(candidate); return ['http:', 'https:'].includes(url.protocol) ? url.href : ''; } catch { return ''; }
}
function uid(prefix) { return `${prefix}_${Date.now()}_${Math.random().toString(16).slice(2, 8)}`; }

function loadState() {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
        if (!saved || !Array.isArray(saved.apps) || !Array.isArray(saved.categories)) return clone(DEFAULT_STATE);
        const migratedCategories = saved.categories.filter((category) => category.id !== 'cat_referencias' && category.name !== 'REFERENCIAS');
        const migratedApps = saved.apps.map((app) => app.categoryId === 'cat_referencias' ? { ...app, categoryId:'', favorite:true } : { favorite:false, ...app });
        return { ...clone(DEFAULT_STATE), ...saved, categories:migratedCategories, apps:migratedApps, accent: safeColor(saved.accent), activeCategory: saved.activeCategory === 'cat_referencias' ? 'favoritos' : (saved.activeCategory || 'todos') };
    } catch { return clone(DEFAULT_STATE); }
}
function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    if (!accessToken) return;
    clearTimeout(saveTimer);
    setSyncStatus('Guardando en Google Drive…', 'busy');
    saveTimer = setTimeout(() => {
        syncInFlight = syncInFlight.then(saveStateToDrive).catch((error) => {
            console.error(error);
            setSyncStatus('No se pudo sincronizar. Reintentaremos al guardar.', 'error');
        });
    }, 450);
}

function setSyncStatus(message, status = '') {
    const element = byId('sync-status');
    if (!element) return;
    element.textContent = message;
    element.dataset.state = status;
}

async function driveRequest(url, options = {}) {
    const response = await fetch(url, {
        ...options,
        headers: { Authorization: `Bearer ${accessToken}`, ...(options.headers || {}) }
    });
    if (response.status === 401) {
        accessToken = '';
        throw new Error('La sesión de Google ha caducado. Vuelve a entrar.');
    }
    if (!response.ok) throw new Error(`Google Drive respondió ${response.status}`);
    return response;
}

async function findDriveFile() {
    const params = new URLSearchParams({
        spaces: 'appDataFolder',
        q: `name='${DRIVE_FILE_NAME}'`,
        fields: 'files(id,name,modifiedTime)',
        pageSize: '10'
    });
    const response = await driveRequest(`https://www.googleapis.com/drive/v3/files?${params}`);
    const result = await response.json();
    driveFileId = result.files?.[0]?.id || '';
    return driveFileId;
}

async function loadStateFromDrive() {
    if (!await findDriveFile()) return false;
    const response = await driveRequest(`https://www.googleapis.com/drive/v3/files/${encodeURIComponent(driveFileId)}?alt=media`);
    const saved = await response.json();
    if (!saved || !Array.isArray(saved.apps) || !Array.isArray(saved.categories)) throw new Error('El Hub guardado no tiene un formato válido.');
    state = { ...clone(DEFAULT_STATE), ...saved, accent: safeColor(saved.accent), activeCategory: saved.activeCategory || 'todos' };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return true;
}

async function saveStateToDrive() {
    const body = JSON.stringify(state);
    if (driveFileId) {
        await driveRequest(`https://www.googleapis.com/upload/drive/v3/files/${encodeURIComponent(driveFileId)}?uploadType=media`, {
            method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body
        });
    } else {
        const boundary = `innovahub_${Date.now()}`;
        const multipart = `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify({ name: DRIVE_FILE_NAME, parents: ['appDataFolder'] })}\r\n--${boundary}\r\nContent-Type: application/json\r\n\r\n${body}\r\n--${boundary}--`;
        const response = await driveRequest('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id', {
            method: 'POST', headers: { 'Content-Type': `multipart/related; boundary=${boundary}` }, body: multipart
        });
        driveFileId = (await response.json()).id;
    }
    setSyncStatus('Sincronizado con Google Drive', 'ok');
}
function rgb(hex) { return hex.slice(1).match(/.{2}/g).map((part) => parseInt(part, 16)).join(', '); }
function applyTheme(color) {
    const clean = safeColor(color);
    document.documentElement.style.setProperty('--accent-color', clean);
    document.documentElement.style.setProperty('--accent-rgb', rgb(clean));
    document.documentElement.style.setProperty('--accent-glow', `rgba(${rgb(clean)}, .4)`);
}
function showView(id) {
    $$('.view').forEach((view) => view.classList.remove('active'));
    const target = byId(`view-${id}`);
    if (target) target.classList.add('active');
}
function formatHubTitle(name) {
    const words = String(name || 'Mi Innova Hub').trim().split(/\s+/);
    byId('hub-title-display').innerHTML = words.map((word, index) => index === words.length - 1
        ? `<span style="color:var(--accent-color);text-shadow:0 0 40px var(--accent-glow)">${escapeHTML(word.toUpperCase())}</span>`
        : `<span style="color:#fff">${escapeHTML(word.toUpperCase())}</span>`).join(' ');
}

async function handleGoogleToken(response) {
    if (response.error) {
        setSyncStatus('No se pudo iniciar sesión con Google.', 'error');
        byId('loader').style.display = 'none';
        return;
    }
    accessToken = response.access_token;
    try {
        const exists = await loadStateFromDrive();
        applyTheme(state.accent);
        if (exists) {
            renderDashboard();
            showView('dashboard');
            setSyncStatus('Sincronizado con Google Drive', 'ok');
        } else {
            state = clone(DEFAULT_STATE);
            driveFileId = '';
            setupFromDashboard = false;
            byId('setup-hub-name').value = '';
            selectSwatch(state.accent);
            showView('setup');
        }
    } catch (error) {
        console.error(error);
        alert('No se pudo cargar tu Hub desde Google Drive. Inténtalo de nuevo.');
        showView('landing');
    } finally {
        byId('loader').style.display = 'none';
    }
}

window.signIn = () => {
    if (!window.google?.accounts?.oauth2) return alert('Google todavía se está cargando. Inténtalo de nuevo en unos segundos.');
    byId('loader').style.display = 'flex';
    googleTokenClient ||= google.accounts.oauth2.initTokenClient({ client_id: GOOGLE_CLIENT_ID, scope: DRIVE_SCOPE, callback: handleGoogleToken });
    googleTokenClient.requestAccessToken({ prompt: 'select_account' });
};
window.bypassLogin = window.signIn;
window.toggleLanguage = () => {};
window.openGemCreator = () => window.open(GEM_CREATOR_URL, '_blank', 'noopener,noreferrer');

function selectSwatch(color) {
    selectedColor = safeColor(color);
    applyTheme(selectedColor);
    $$('.swatch').forEach((swatch) => swatch.classList.toggle('selected', swatch.dataset.color === selectedColor));
}
$$('.swatch').forEach((swatch, index) => {
    const image = ['hub_cyan.png', 'hub_amber.png', 'hub_crimson.png'][index];
    swatch.style.background = `url('${image}') center/cover no-repeat, ${swatch.dataset.color}`;
    swatch.addEventListener('click', () => selectSwatch(swatch.dataset.color));
});

byId('btn-save-setup').onclick = () => {
    const name = byId('setup-hub-name').value.trim();
    if (!name) return alert('Por favor, dale un nombre protagonista a tu Hub.');
    state.hubName = name.slice(0, 48);
    state.accent = selectedColor;
    applyTheme(state.accent);
    persist();
    renderDashboard();
    showView('dashboard');
    setupFromDashboard = false;
};

function visibleApps() {
    const query = ($('input[placeholder="Buscar herramientas..."]')?.value || '').trim().toLowerCase();
    return state.apps.filter((app) => (state.activeCategory === 'todos' || (state.activeCategory === 'favoritos' ? app.favorite : app.categoryId === state.activeCategory))
        && (!query || `${app.name} ${app.description}`.toLowerCase().includes(query)));
}
function renderDashboard() {
    formatHubTitle(state.hubName);
    renderCategories();
    const mobileTitle = byId('mobile-selected-title');
    if (state.activeCategory === 'todos') {
        mobileTitle.style.display = 'none';
    } else {
        mobileTitle.textContent = state.activeCategory === 'favoritos' ? 'FAVORITOS' : (state.categories.find((category) => category.id === state.activeCategory)?.name || '');
        mobileTitle.style.display = 'block';
    }
    const container = byId('main-apps-container');
    container.innerHTML = '';
    const apps = visibleApps();
    if (!apps.length) {
        container.innerHTML = '<div class="portal-empty"><i data-lucide="layout-grid"></i><h3>TU ESPACIO ESTÁ LISTO</h3><p>Añade tu primera aplicación para empezar a construir el ecosistema.</p></div>';
    } else {
        apps.forEach((app) => container.appendChild(renderCard(app)));
    }
    lucide.createIcons();
    if (!tutorialAutoHandled && !state.tutorialSeen && !window.matchMedia('(max-width: 768px)').matches) {
        tutorialAutoHandled = true;
        setTimeout(() => window.openTutorial(), 350);
    }
}

function renderTutorial() {
    const step = TUTORIAL_STEPS[tutorialStep];
    byId('tutorial-kicker').textContent = `PASO ${tutorialStep + 1} DE ${TUTORIAL_STEPS.length}`;
    byId('tutorial-title').textContent = step.title;
    byId('tutorial-copy').textContent = step.copy;
    byId('tutorial-image').src = step.image;
    byId('tutorial-image').alt = step.alt;
    byId('tutorial-prev').style.visibility = tutorialStep === 0 ? 'hidden' : 'visible';
    byId('tutorial-next').textContent = tutorialStep === TUTORIAL_STEPS.length - 1 ? 'TERMINAR' : 'SIGUIENTE';
    byId('tutorial-dots').innerHTML = TUTORIAL_STEPS.map((_, index) => `<span class="tutorial-dot ${index === tutorialStep ? 'active' : ''}"></span>`).join('');
}
window.openTutorial = () => {
    tutorialStep = 0;
    renderTutorial();
    byId('tutorial-overlay').style.display = 'flex';
};
window.closeTutorial = () => {
    byId('tutorial-overlay').style.display = 'none';
    if (!state.tutorialSeen) { state.tutorialSeen = true; persist(); }
};
window.changeTutorialStep = (direction) => {
    if (direction > 0 && tutorialStep === TUTORIAL_STEPS.length - 1) return window.closeTutorial();
    tutorialStep = Math.max(0, Math.min(TUTORIAL_STEPS.length - 1, tutorialStep + direction));
    renderTutorial();
};
function renderCard(app) {
    const card = document.createElement('div');
    card.className = 'app-card';
    card.style.border = `1px solid ${safeColor(app.color)}66`;
    card.style.boxShadow = `inset 0 0 30px ${safeColor(app.color)}15`;
    card.innerHTML = `
        <button class="gear-btn" aria-label="Editar ${escapeHTML(app.name)}" style="position:absolute;top:5px;left:5px;padding:4px;background:transparent;border:0;cursor:pointer;z-index:10;opacity:.65;color:#fff"><i data-lucide="settings" style="width:15px"></i></button>
        <button class="favorite-btn ${app.favorite ? 'active' : ''}" aria-label="${app.favorite ? 'Quitar de' : 'Añadir a'} favoritos"><i data-lucide="star"></i></button>
        <div class="icon-box" style="color:${safeColor(app.color)};border-color:${safeColor(app.color)};background:${safeColor(app.color)}1A"><i data-lucide="${escapeHTML(app.icon || 'link-2')}" style="width:16px"></i></div>
        <h3>${escapeHTML(app.name)}</h3>
        <p class="portal-card-desc">${escapeHTML(app.description || new URL(app.url).hostname)}</p>`;
    card.querySelector('.gear-btn').onclick = (event) => { event.stopPropagation(); openAppForm(app.id); };
    card.querySelector('.favorite-btn').onclick = (event) => { event.stopPropagation(); app.favorite = !app.favorite; persist(); renderDashboard(); };
    card.onclick = () => window.open(app.url, '_blank', 'noopener,noreferrer');
    return card;
}
function renderCategories() {
    const area = $('.category-section');
    area.innerHTML = '<div class="category-header">ORGANIZACIÓN</div>';
    const all = document.createElement('div');
    all.className = 'nav-item action';
    all.style.background = state.activeCategory === 'todos' ? 'rgba(255,255,255,.05)' : '';
    all.innerHTML = '<i data-lucide="layout-grid" style="width:16px"></i><span class="nav-label">Todas las apps</span>';
    all.onclick = () => { state.activeCategory = 'todos'; persist(); renderDashboard(); };
    area.appendChild(all);
    const favorites = document.createElement('div');
    favorites.className = 'cat-item';
    favorites.style.background = state.activeCategory === 'favoritos' ? 'rgba(255,255,255,.05)' : '';
    favorites.innerHTML = '<i data-lucide="star" style="width:13px;color:#ffaa00;fill:#ffaa00"></i> Favoritos';
    favorites.onclick = () => { state.activeCategory = 'favoritos'; persist(); renderDashboard(); };
    area.appendChild(favorites);
    state.categories.forEach((category) => {
        const item = document.createElement('div');
        item.className = 'cat-item';
        item.style.background = state.activeCategory === category.id ? 'rgba(255,255,255,.05)' : '';
        item.innerHTML = `<div class="cat-dot" style="background:${safeColor(category.color)}"></div> ${escapeHTML(category.name)}`;
        item.onclick = () => { state.activeCategory = category.id; persist(); renderDashboard(); };
        area.appendChild(item);
    });
    const add = document.createElement('div');
    add.className = 'cat-item';
    add.style.cssText = 'opacity:.5;font-style:italic';
    add.innerHTML = '<i data-lucide="plus" style="width:12px"></i> Añadir categoría';
    add.onclick = () => openCategoryForm('dashboard');
    area.appendChild(add);
}

function openCategoryForm(target = 'dashboard') {
    categoryCreationTarget = target;
    byId('new-cat-name').value = '';
    byId('category-overlay').style.display = 'flex';
}
window.saveCategory = () => {
    const name = byId('new-cat-name').value.trim().toUpperCase();
    if (!name) return alert('Ponle un nombre.');
    if (state.categories.some((category) => category.name === name)) return alert('Esa categoría ya existe.');
    const category = { id: uid('cat'), name: name.slice(0, 30), color: safeColor(byId('new-cat-color').value) };
    state.categories.push(category);
    persist();
    byId('category-overlay').style.display = 'none';
    renderDashboard();
    if (categoryCreationTarget === 'app-form') {
        fillCategorySelect(category.id);
        byId('creator-overlay').style.display = 'flex';
    }
    categoryCreationTarget = 'dashboard';
};

function fillCategorySelect(selected) {
    const select = byId('portal-app-category');
    select.innerHTML = `<option value="" ${!selected ? 'selected' : ''}>CATEGORÍAS</option>`
        + state.categories.map((category) => `<option value="${category.id}" ${category.id === selected ? 'selected' : ''}>${escapeHTML(category.name)}</option>`).join('')
        + '<option value="__new__">＋ CREAR NUEVA CATEGORÍA</option>';
}
function setAppLinkStatus(message = '', type = '') {
    const status = byId('app-link-status');
    status.textContent = message;
    status.style.display = message ? 'block' : 'none';
    status.style.color = type === 'success' ? 'var(--accent)' : type === 'error' ? '#ff7777' : 'var(--text-secondary)';
}

function shortDescription(value) {
    return String(value || '').replace(/\s+/g, ' ').trim().split(' ').filter(Boolean).slice(0, 3).join(' ').replace(/[.,;:!?]+$/, '');
}

async function fillAppFromClipboard({ quiet = false } = {}) {
    if (!navigator.clipboard?.readText) {
        if (!quiet) setAppLinkStatus('Pega el enlace manualmente.', 'error');
        return;
    }
    try {
        const url = safeUrl(await navigator.clipboard.readText());
        if (!url) {
            if (!quiet) setAppLinkStatus('No hay un enlace válido copiado.', 'error');
            return;
        }
        byId('portal-app-url').value = url;
        setAppLinkStatus('Enlace detectado. Completando datos…');
        try {
            const response = await fetch(`/api/metadata?url=${encodeURIComponent(url)}`);
            const metadata = response.ok ? await response.json() : {};
            if (!byId('portal-app-name').value && metadata.title) byId('portal-app-name').value = metadata.title.slice(0, 48);
            const suggestedDescription = metadata.description || metadata.title || '';
            if (!byId('portal-app-description').value && suggestedDescription) byId('portal-app-description').value = shortDescription(suggestedDescription).slice(0, 140);
        } catch (error) {
            console.info('No se pudieron leer los metadatos del enlace.', error);
        }
        setAppLinkStatus('Enlace añadido automáticamente.', 'success');
    } catch {
        if (!quiet) setAppLinkStatus('El navegador no permitió leerlo. Puedes pegarlo manualmente.', 'error');
    }
}

async function openAppForm(appId = null) {
    editingAppId = appId;
    const app = state.apps.find((entry) => entry.id === appId);
    byId('app-form-title').textContent = app ? 'Editar App' : 'Añadir App';
    byId('portal-app-name').value = app?.name || '';
    byId('portal-app-url').value = app?.url || '';
    byId('portal-app-description').value = app?.description || '';
    byId('portal-app-color').value = safeColor(app?.color, state.accent);
    byId('btn-delete-app').style.display = app ? 'block' : 'none';
    fillCategorySelect(app?.categoryId || state.categories[0]?.id);
    setAppLinkStatus();
    byId('creator-overlay').style.display = 'flex';
    if (!app) await fillAppFromClipboard({ quiet:true });
}
byId('btn-paste-app-link').onclick = () => fillAppFromClipboard();
window.closeCreator = () => { byId('creator-overlay').style.display = 'none'; editingAppId = null; };
byId('btn-process-magic').onclick = () => {
    const name = byId('portal-app-name').value.trim();
    const url = safeUrl(byId('portal-app-url').value);
    if (!name || !url) return alert('Añade un nombre y una URL válida.');
    const index = state.apps.findIndex((entry) => entry.id === editingAppId);
    const record = {
        id: editingAppId || uid('app'), name: name.slice(0, 48).toUpperCase(), url,
        description: byId('portal-app-description').value.trim().slice(0, 140),
        categoryId: byId('portal-app-category').value === '__new__' ? '' : byId('portal-app-category').value,
        favorite: index >= 0 ? Boolean(state.apps[index].favorite) : false,
        color: safeColor(byId('portal-app-color').value, state.accent), icon: 'link-2'
    };
    if (index >= 0) state.apps[index] = record; else state.apps.push(record);
    persist(); closeCreator(); renderDashboard();
};
byId('btn-delete-app').onclick = () => {
    if (!editingAppId || !confirm('¿Eliminar esta app del Hub?')) return;
    state.apps = state.apps.filter((entry) => entry.id !== editingAppId);
    persist(); closeCreator(); renderDashboard();
};

byId('btn-sign-out').onclick = () => {
    accessToken = '';
    driveFileId = '';
    localStorage.removeItem(STORAGE_KEY);
    byId('user-options-overlay').style.display = 'none';
    showView('landing');
};

window.openUserOptions = () => { byId('user-options-overlay').style.display = 'flex'; };
window.showForgeEdit = () => {
    byId('user-options-overlay').style.display = 'none';
    setupFromDashboard = true;
    byId('setup-hub-name').value = state.hubName;
    selectSwatch(state.accent);
    showView('setup');
};

byId('btn-open-creator').onclick = () => openAppForm();
const search = $('input[placeholder="Buscar herramientas..."]');
if (search) search.addEventListener('input', renderDashboard);
byId('portal-app-category').addEventListener('change', (event) => {
    if (event.target.value !== '__new__') return;
    byId('creator-overlay').style.display = 'none';
    openCategoryForm('app-form');
});
window.openPortalAppForm = () => openAppForm();
window.selectPortalCategory = (id) => { state.activeCategory = id; persist(); renderDashboard(); };
window.togglePortalCategories = (event) => {
    event?.stopPropagation();
    const menu = byId('cat-dropdown-menu');
    menu.innerHTML = '<div class="dropdown-item" data-new-category style="border-bottom:1px solid var(--glass-border);margin-bottom:5px;font-weight:700"><i data-lucide="plus" style="width:13px"></i>Nueva</div>';
    menu.innerHTML += state.categories.length ? state.categories.map((category) => `<div class="dropdown-item" data-category="${category.id}"><div class="cat-dot" style="background:${safeColor(category.color)}"></div>${escapeHTML(category.name)}</div>`).join('') : '<div class="dropdown-item" style="opacity:.5">Sin categorías</div>';
    menu.querySelectorAll('[data-category]').forEach((item) => item.onclick = () => { window.selectPortalCategory(item.dataset.category); menu.style.display='none'; });
    menu.querySelector('[data-new-category]').onclick = () => { menu.style.display='none'; openCategoryForm('dashboard'); };
    menu.style.display = menu.style.display === 'flex' ? 'none' : 'flex';
    lucide.createIcons();
};
document.addEventListener('click', () => { byId('cat-dropdown-menu').style.display = 'none'; });
document.addEventListener('keydown', (event) => {
    if (byId('tutorial-overlay').style.display !== 'flex') return;
    if (event.key === 'Escape') window.closeTutorial();
    if (event.key === 'ArrowRight') window.changeTutorialStep(1);
    if (event.key === 'ArrowLeft') window.changeTutorialStep(-1);
});

applyTheme(state.accent);
selectSwatch(state.accent);
showView('landing');
byId('loader').style.display = 'none';
lucide.createIcons();
