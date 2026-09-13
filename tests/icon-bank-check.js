'use strict';

const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'icon-bank.js'), 'utf8');
const context = {};
vm.createContext(context);
vm.runInContext(source, context, { filename: 'icon-bank.js' });

const bank = context.InnovaIconBank || context.INNOVA_ICON_BANK;
if (!bank || typeof bank.render !== 'function') throw new Error('El banco no expone render()');
if (!Array.isArray(bank.names) || bank.names.length !== 49) throw new Error('El banco debe exponer 49 nombres');

for (const name of bank.names) {
    const svg = bank.render(name, { className: 'app-bank-icon' });
    if (!svg.startsWith('<svg ') || !svg.includes('viewBox="0 0 64 64"')) throw new Error(`SVG inválido para ${name}`);
    if (!svg.includes('class="app-bank-icon"') || !svg.includes('aria-hidden="true"')) throw new Error(`Faltan atributos seguros en ${name}`);
}

if (bank.render('missing-icon') !== '') throw new Error('Las claves desconocidas deben devolver un fallback vacío');
if (bank.render('__proto__') !== '') throw new Error('No se debe aceptar una clave heredada');
if (/<(?:foreignObject|script)\b|(?:xlink:)?href\s*=/.test(bank.names.map((name) => bank.render(name)).join('\n'))) {
    throw new Error('Los SVG no deben incluir contenido activo ni referencias externas');
}

console.log('OK: banco SVG validado');
