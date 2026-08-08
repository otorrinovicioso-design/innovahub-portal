'use strict';
const fs = require('fs');
const path = require('path');
const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
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
console.log('OK: estructura de InnovaHub Portal validada');
