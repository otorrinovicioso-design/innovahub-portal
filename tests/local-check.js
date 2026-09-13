'use strict';
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const bank = fs.readFileSync(path.join(root, 'icon-bank.js'), 'utf8');
const required = ['view-landing', 'view-setup', 'view-dashboard', 'creator-overlay', 'app.js'];
required.forEach((token) => { if (!html.includes(token)) throw new Error(`Falta ${token}`); });
['innovahub.portal.state.v1', 'safeUrl', 'renderDashboard', 'openAppForm'].forEach((token) => {
    if (!app.includes(token)) throw new Error(`Falta ${token}`);
});
['drive.appdata', 'loadStateFromDrive', 'saveStateToDrive', 'GOOGLE_CLIENT_ID'].forEach((token) => {
    if (!app.includes(token)) throw new Error(`Falta integración de Google: ${token}`);
});
if (!html.includes('https://accounts.google.com/gsi/client')) throw new Error('Falta Google Identity Services');
if (/btn-sign-out[\s\S]{0,500}oauth2\.revoke/.test(app)) throw new Error('Cerrar sesión no debe revocar Google Drive');
if (!app.includes("prompt: 'select_account'")) throw new Error('Google debe permitir elegir la cuenta al entrar');
if (!html.includes('create-apps-link') || !app.includes('167YCVt2Ooh33x_dTeQRZ7LWAT34nGP10')) throw new Error('Falta el acceso al creador de apps');
if (html.includes('mobile-create-apps') || html.includes('mobile-add')) throw new Error('El móvil no debe mostrar Crear apps ni Añadir');
if (!html.includes('padding: 62px 20px 10px')) throw new Error('La cabecera móvil no reserva espacio para Tutorial y Ajustes');
if (!/apps:\s*\[\s*\]/.test(app)) throw new Error('Los hubs nuevos deben comenzar vacíos');
if (html.includes('tutorial-mobile-btn')) throw new Error('El móvil no debe mostrar el tutorial');
if (!app.includes("!window.matchMedia('(max-width: 768px)').matches")) throw new Error('El tutorial no debe abrirse automáticamente en móvil');
if (!html.includes('grid-template-columns:repeat(3,1fr)')) throw new Error('Los tres botones móviles deben quedar centrados');
if (!html.includes('CREAR Y AÑADIR APPS SOLO ESTÁ DISPONIBLE DESDE UN ORDENADOR')) throw new Error('Falta el aviso de uso desde escritorio en el tutorial');
['tutorial-overlay', 'tutorial-assets/01-crear-app.png', 'tutorial-nav-item'].forEach((token) => {
    if (!`${html}\n${app}`.includes(token)) throw new Error(`Falta tutorial visual: ${token}`);
});
if (/draggable\s*=|ondrag(start|over|leave)|ondrop/.test(app)) throw new Error('La interfaz aún contiene lógica de arrastre');
['FAVORITOS', 'favorite-btn', 'CREAR NUEVA CATEGORÍA', 'mobile-portal-nav'].forEach((token) => {
    if (!`${html}\n${app}`.includes(token)) throw new Error(`Falta ${token}`);
});
if (html.includes('id="nav-login-container"') || html.includes('class="lang-globe-btn"')) throw new Error('Queda navegación redundante en la landing');
if (!html.includes('BY DR. ENGELS VICIOSO')) throw new Error('Falta la firma del Hub');
if (!html.includes('landing-brand-hero') || !html.includes('accent-word')) throw new Error('Falta la nueva jerarquía visual de la landing');
if (!html.includes('landing-copy-block')) throw new Error('Falta el desplazamiento independiente de la portada');
if (/gemini-motor\.js|firebase-config\.js|legacy-innova-script/.test(html)) throw new Error('Quedan dependencias activas del motor original');
if (/pricing-tier[\s\S]*data-plan=/.test(html)) throw new Error('Quedan tarjetas de precios en la landing');
['btn-paste-app-link', 'fillAppFromClipboard', 'navigator.clipboard.readText', '/api/metadata'].forEach((token) => {
    if (!`${html}\n${app}`.includes(token)) throw new Error(`Falta autocompletado desde portapapeles: ${token}`);
});
['ICON_RULES', 'chooseAppIcon', 'appDisplayColor', "icon:'app-window'", 'stethoscope', 'list-checks', 'calculator', 'dumbbell'].forEach((token) => {
    if (!app.includes(token)) throw new Error(`Falta selección automática de iconos: ${token}`);
});
const iconRuleBlock = app.match(/const ICON_RULES = \[([\s\S]*?)\n\];/)?.[1] || '';
if ((iconRuleBlock.match(/^\s*\['/gm) || []).length < 20) throw new Error('La biblioteca automática necesita al menos 20 iconos');
const iconRules = [...iconRuleBlock.matchAll(/^\s*\['([^']+)', \[([^\]]+)\]\],?$/gm)].map((match) => ({
    icon: match[1],
    keywords: [...match[2].matchAll(/'([^']+)'/g)].map((keyword) => keyword[1])
}));
const keywordOwners = new Map();
iconRules.forEach(({ icon, keywords }) => {
    if (keywords.length < 5) throw new Error(`El icono ${icon} necesita al menos cinco palabras clave`);
    keywords.forEach((keyword) => {
        const normalizedKeyword = keyword.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
        if (keywordOwners.has(normalizedKeyword)) throw new Error(`La palabra clave ${keyword} se solapa entre ${keywordOwners.get(normalizedKeyword)} y ${icon}`);
        keywordOwners.set(normalizedKeyword, icon);
    });
});
const ownedKeywords = [...keywordOwners.entries()];
ownedKeywords.forEach(([keyword, owner]) => {
    ownedKeywords.forEach(([candidate, candidateOwner]) => {
        if (owner !== candidateOwner && ` ${candidate} `.includes(` ${keyword} `)) {
            throw new Error(`La palabra clave ${keyword} de ${owner} se solapa con ${candidate} de ${candidateOwner}`);
        }
    });
});
['const name =', 'const description =', 'specificity', 'score > bestMatch.score'].forEach((token) => {
    if (!app.includes(token)) throw new Error(`Falta selección ponderada de iconos: ${token}`);
});
if (!app.includes('safeColor(category?.color, state.accent)')) throw new Error('El color del icono debe proceder de la categoría o del Hub');
if (/portal-app-icon-url|btn-paste-app-icon|normalizeIconImage|portal-app-color/.test(`${html}\n${app}`)) throw new Error('Quedan controles del experimento anterior de iconos');
const bankScriptPosition = html.indexOf('<script src="icon-bank.js"></script>');
const appScriptPosition = html.indexOf('<script src="app.js"></script>');
if (bankScriptPosition < 0 || appScriptPosition < 0 || bankScriptPosition > appScriptPosition) throw new Error('El banco de iconos debe cargarse antes de app.js');
if (!app.includes('window.InnovaIconBank') || !app.includes('bank.render') || !app.includes('app-bank-icon')) throw new Error('Las tarjetas deben usar el banco SVG');
const renderCardBlock = app.slice(app.indexOf('function renderCard'), app.indexOf('function renderCategories'));
if (/data-lucide="\$\{escapeHTML\(displayIcon\)\}"/.test(renderCardBlock)) throw new Error('Las tarjetas no deben renderizar el icono de app con Lucide');
const ruleKeys = [...iconRuleBlock.matchAll(/^\s*\['([^']+)'/gm)].map((match) => match[1]);
const bankKeys = [...bank.matchAll(/^\s*'([^']+)':\s*`/gm)].map((match) => match[1]);
if (bankKeys.length !== ruleKeys.length) throw new Error(`El banco SVG debe tener ${ruleKeys.length} iconos, no ${bankKeys.length}`);
ruleKeys.forEach((key) => { if (!bankKeys.includes(key)) throw new Error(`Falta el icono SVG ${key}`); });
if (!app.includes("[requestedIcon, semanticIcon, 'bot']")) throw new Error('Falta fallback seguro para iconos antiguos o desconocidos');
const fallbackMarkup = app.match(/const FALLBACK_APP_ICON = '([^']+)'/)?.[1] || '';
if (!fallbackMarkup || !app.includes('return FALLBACK_APP_ICON')) throw new Error('Falta el fallback SVG local de las tarjetas');
if (/<(?:foreignObject|script)\b|(?:xlink:)?href\s*=/.test(fallbackMarkup)) throw new Error('El fallback SVG no debe incluir contenido activo ni referencias externas');
['clamp(44px, 5.4vw, 58px)', 'width: 40px !important', 'color-mix(in srgb, var(--card-color)', '@media (min-width: 769px) and (max-width: 960px)', 'grid-template-columns: repeat(4, 1fr)', '.app-card { padding: 10px; }', 'width: 46px; height: 46px; margin-bottom: 8px;', 'color-mix(in srgb, var(--card-color) 58%, #fff)', 'color-mix(in srgb, var(--card-color) 48%, #fff)'].forEach((token) => {
    if (!html.includes(token)) throw new Error(`Falta ajuste visual de iconos: ${token}`);
});
if (/<(?:foreignObject|script)\b|(?:xlink:)?href\s*=/.test(bank)) throw new Error('El banco SVG no debe incluir contenido activo ni referencias externas');
console.log('OK: estructura de InnovaHub Portal validada');
