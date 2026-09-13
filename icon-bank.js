/*
 * InnovaHub icon bank
 *
 * A small, self-contained duotone SVG set for the icon names selected by
 * ICON_RULES in app.js.  The artwork is intentionally drawn on a shared
 * 64 × 64 viewBox so it stays balanced as the card size changes.
 */
(function exposeInnovaIconBank(global) {
    'use strict';

    const VIEW_BOX = '0 0 64 64';

    /*
     * Each entry is SVG content only.  The renderer supplies the common
     * viewBox, currentColor stroke, and a quiet secondary fill treatment.
     * Keeping the paths inline makes the bank portable and removes all
     * network/font/image dependencies.
     */
    const ICONS = Object.freeze({
        'stethoscope': `
            <circle cx="32" cy="32" r="24" fill="currentColor" opacity=".045"/>
            <path d="M15 11v12a11 11 0 0 0 22 0V11M11 11h8M30 11h8"/>
            <path d="M26 34v4a12 12 0 0 0 24 0v-3"/>
            <circle cx="50" cy="31" r="5" fill="currentColor" opacity=".2"/>
            <circle cx="50" cy="31" r="5"/>
            <path d="M18 11v-2M34 11v-2"/>
        `,
        'heart-pulse': `
            <path d="M32 52S12 40 12 25c0-7 4.8-11 10.4-11 4 0 7.6 2.3 9.6 5.8C34 16.3 37.6 14 41.6 14 47.2 14 52 18 52 25c0 15-20 27-20 27Z" fill="currentColor" opacity=".16"/>
            <path d="M32 52S12 40 12 25c0-7 4.8-11 10.4-11 4 0 7.6 2.3 9.6 5.8C34 16.3 37.6 14 41.6 14 47.2 14 52 18 52 25c0 15-20 27-20 27Z"/>
            <path d="M13 31h10l3-7 5 15 4-10 3 5h13"/>
        `,
        'pill': `
            <g transform="rotate(-35 32 32)">
                <rect x="13" y="22" width="38" height="20" rx="10" fill="currentColor" opacity=".16"/>
                <rect x="13" y="22" width="38" height="20" rx="10"/>
                <path d="M32 22v20"/>
                <path d="M18 27h9" opacity=".55"/>
            </g>
        `,
        'brain': `
            <path d="M27 15a8 8 0 0 0-14 5 8 8 0 0 0 2 14 8 8 0 0 0 7 13h5a5 5 0 0 0 5-5V20a8 8 0 0 0-5-5Z" fill="currentColor" opacity=".15"/>
            <path d="M37 15a8 8 0 0 1 14 5 8 8 0 0 1-2 14 8 8 0 0 1-7 13h-5a5 5 0 0 1-5-5V20a8 8 0 0 1 5-5Z" fill="currentColor" opacity=".15"/>
            <path d="M32 20v27M27 15a8 8 0 0 0-14 5 8 8 0 0 0 2 14 8 8 0 0 0 7 13h5a5 5 0 0 0 5-5V20a8 8 0 0 0-5-5ZM37 15a8 8 0 0 1 14 5 8 8 0 0 1-2 14 8 8 0 0 1-7 13h-5a5 5 0 0 1-5-5V20a8 8 0 0 1 5-5Z"/>
            <path d="M18 24h7v-5M17 34h9l-2 5M46 24h-7v-5M47 34h-9l2 5"/>
        `,
        'activity': `
            <rect x="10" y="13" width="44" height="38" rx="8" fill="currentColor" opacity=".1"/>
            <rect x="10" y="13" width="44" height="38" rx="8"/>
            <path d="M15 33h8l4-11 6 22 5-15 3 6h8" stroke-width="3"/>
            <circle cx="47" cy="20" r="2" fill="currentColor" stroke="none" opacity=".7"/>
        `,
        'calculator': `
            <rect x="16" y="9" width="32" height="46" rx="6" fill="currentColor" opacity=".12"/>
            <rect x="16" y="9" width="32" height="46" rx="6"/>
            <rect x="21" y="15" width="22" height="8" rx="2" fill="currentColor" opacity=".24"/>
            <rect x="21" y="15" width="22" height="8" rx="2"/>
            <path d="M23 31h4M31 31h4M39 31h2M23 39h4M31 39h4M39 39h2M23 47h4M31 47h10"/>
            <circle cx="40" cy="18.8" r="1.5" fill="currentColor" stroke="none"/>
        `,
        'list-checks': `
            <rect x="11" y="10" width="42" height="44" rx="8" fill="currentColor" opacity=".1"/>
            <rect x="11" y="10" width="42" height="44" rx="8"/>
            <path d="M21 23l2.5 2.5L28 21M34 24h10M21 36l2.5 2.5L28 34M34 37h10M21 48l2.5 2.5L28 46M34 49h10"/>
            <circle cx="24" cy="24" r="7" fill="currentColor" opacity=".09"/>
            <circle cx="24" cy="37" r="7" fill="currentColor" opacity=".09"/>
        `,
        'calendar-days': `
            <rect x="10" y="14" width="44" height="40" rx="8" fill="currentColor" opacity=".11"/>
            <rect x="10" y="14" width="44" height="40" rx="8"/>
            <path d="M10 25h44M21 10v8M43 10v8" stroke-width="3"/>
            <path d="M20 33h1M31 33h1M42 33h1M20 43h1M31 43h1M42 43h1" stroke-width="4"/>
            <rect x="28" y="29" width="8" height="8" rx="2" fill="currentColor" opacity=".35" stroke="none"/>
        `,
        'clock': `
            <circle cx="32" cy="34" r="19" fill="currentColor" opacity=".12"/>
            <circle cx="32" cy="34" r="19"/>
            <path d="M32 24v11l8 5" stroke-width="3.5"/>
            <path d="M27 10h10M32 10v5" stroke-width="3"/>
            <circle cx="32" cy="34" r="2.5" fill="currentColor" stroke="none"/>
            <path d="M18 19l-3-3M46 19l3-3" opacity=".55"/>
        `,
        'timer': `
            <circle cx="32" cy="35" r="18" fill="currentColor" opacity=".12"/>
            <circle cx="32" cy="35" r="18"/>
            <path d="M32 35V24M32 35l8 5" stroke-width="3.5"/>
            <path d="M27 10h10M32 10v7M47 19l4 4" stroke-width="3"/>
            <path d="M32 17a18 18 0 0 1 16 10" opacity=".65" stroke-width="3.5"/>
            <circle cx="32" cy="35" r="2.5" fill="currentColor" stroke="none"/>
        `,
        'target': `
            <circle cx="32" cy="32" r="22" fill="currentColor" opacity=".08"/>
            <circle cx="32" cy="32" r="22"/>
            <circle cx="32" cy="32" r="13" fill="currentColor" opacity=".15"/>
            <circle cx="32" cy="32" r="13"/>
            <circle cx="32" cy="32" r="5" fill="currentColor" opacity=".32"/>
            <circle cx="32" cy="32" r="5"/>
            <path d="M45 19l7-7M52 12h-7M52 12v7" stroke-width="3"/>
        `,
        'clipboard-check': `
            <rect x="13" y="13" width="38" height="42" rx="7" fill="currentColor" opacity=".11"/>
            <rect x="13" y="13" width="38" height="42" rx="7"/>
            <rect x="24" y="8" width="16" height="10" rx="4" fill="currentColor" opacity=".28"/>
            <rect x="24" y="8" width="16" height="10" rx="4"/>
            <path d="M23 33l5 5 12-13" stroke-width="3.5"/>
            <path d="M22 47h20" opacity=".5"/>
        `,
        'briefcase': `
            <rect x="10" y="19" width="44" height="31" rx="7" fill="currentColor" opacity=".13"/>
            <rect x="10" y="19" width="44" height="31" rx="7"/>
            <path d="M23 19v-4a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v4M10 30h44"/>
            <path d="M28 29v5h8v-5"/>
            <path d="M31 39h2" stroke-width="4"/>
            <path d="M16 44h32" opacity=".45"/>
        `,
        'kanban': `
            <rect x="10" y="11" width="44" height="43" rx="7" fill="currentColor" opacity=".08"/>
            <rect x="10" y="11" width="44" height="43" rx="7"/>
            <rect x="16" y="18" width="9" height="13" rx="3" fill="currentColor" opacity=".27"/>
            <rect x="16" y="18" width="9" height="13" rx="3"/>
            <rect x="16" y="36" width="9" height="11" rx="3" fill="currentColor" opacity=".16"/>
            <rect x="16" y="36" width="9" height="11" rx="3"/>
            <rect x="28" y="18" width="9" height="19" rx="3" fill="currentColor" opacity=".18"/>
            <rect x="28" y="18" width="9" height="19" rx="3"/>
            <rect x="40" y="18" width="9" height="10" rx="3" fill="currentColor" opacity=".3"/>
            <rect x="40" y="18" width="9" height="10" rx="3"/>
            <rect x="40" y="33" width="9" height="14" rx="3" fill="currentColor" opacity=".14"/>
            <rect x="40" y="33" width="9" height="14" rx="3"/>
        `,
        'graduation-cap': `
            <path d="M8 26 32 14l24 12-24 12L8 26Z" fill="currentColor" opacity=".2"/>
            <path d="M8 26 32 14l24 12-24 12L8 26Z"/>
            <path d="M16 31v12c8 7 24 7 32 0V31M32 38v11"/>
            <path d="M54 27v13" stroke-width="3"/>
            <circle cx="54" cy="43" r="3" fill="currentColor" opacity=".32"/>
            <circle cx="54" cy="43" r="3"/>
        `,
        'book-open': `
            <path d="M32 18c-5-5-12-7-20-5v35c8-2 15 0 20 5 5-5 12-7 20-5V13c-8-2-15 0-20 5Z" fill="currentColor" opacity=".13"/>
            <path d="M32 18c-5-5-12-7-20-5v35c8-2 15 0 20 5 5-5 12-7 20-5V13c-8-2-15 0-20 5ZM32 18v35"/>
            <path d="M17 23h8M17 30h8M39 23h8M39 30h8" opacity=".55"/>
            <path d="M17 40h8M39 40h8" opacity=".4"/>
        `,
        'languages': `
            <rect x="10" y="15" width="29" height="25" rx="7" fill="currentColor" opacity=".13"/>
            <rect x="10" y="15" width="29" height="25" rx="7"/>
            <path d="M18 33l6-15 6 15M20 28h8" stroke-width="2.8"/>
            <path d="m38 29 5 8 5-8M40 34h6" stroke-width="2.8"/>
            <path d="M20 45h28a7 7 0 0 0 7-7V27"/>
            <circle cx="50" cy="17" r="5" fill="currentColor" opacity=".28"/>
            <path d="M47 17h6M50 14v6" stroke-width="2"/>
        `,
        'chart-column': `
            <path d="M12 51V14M12 51h42"/>
            <rect x="20" y="34" width="8" height="17" rx="2" fill="currentColor" opacity=".2"/>
            <rect x="20" y="34" width="8" height="17" rx="2"/>
            <rect x="33" y="25" width="8" height="26" rx="2" fill="currentColor" opacity=".3"/>
            <rect x="33" y="25" width="8" height="26" rx="2"/>
            <rect x="46" y="17" width="8" height="34" rx="2" fill="currentColor" opacity=".42"/>
            <rect x="46" y="17" width="8" height="34" rx="2"/>
            <path d="M20 28h8M33 19h8" opacity=".5"/>
        `,
        'wallet-cards': `
            <rect x="11" y="18" width="42" height="31" rx="7" fill="currentColor" opacity=".13"/>
            <rect x="11" y="18" width="42" height="31" rx="7"/>
            <path d="M11 27h42"/>
            <path d="M38 33h12a3 3 0 0 1 3 3v6H38a5 5 0 0 1 0-10Z" fill="currentColor" opacity=".24"/>
            <path d="M38 33h12a3 3 0 0 1 3 3v6H38a5 5 0 0 1 0-10Z"/>
            <circle cx="44" cy="36.5" r="1.5" fill="currentColor" stroke="none"/>
            <path d="M18 23h12" opacity=".55"/>
        `,
        'landmark': `
            <path d="M9 25 32 12l23 13H9Z" fill="currentColor" opacity=".2"/>
            <path d="M9 25 32 12l23 13H9Z"/>
            <path d="M15 28v20M25 28v20M39 28v20M49 28v20M10 51h44M7 25h50" stroke-width="3"/>
            <path d="M16 34h8M36 34h8" opacity=".45"/>
            <circle cx="32" cy="20" r="2.5" fill="currentColor" stroke="none"/>
        `,
        'receipt': `
            <path d="M16 9h32v46l-5-4-5 4-6-4-6 4-5-4-5 4V9Z" fill="currentColor" opacity=".13"/>
            <path d="M16 9h32v46l-5-4-5 4-6-4-6 4-5-4-5 4V9Z"/>
            <path d="M23 21h18M23 29h18M23 37h11" stroke-width="3"/>
            <circle cx="40" cy="42" r="3" fill="currentColor" opacity=".35"/>
            <circle cx="40" cy="42" r="3"/>
        `,
        'trending-up': `
            <path d="m11 45 13-13 8 7 20-22v12" fill="none"/>
            <path d="M11 45 24 32l8 7 20-22v28H11Z" fill="currentColor" opacity=".12" stroke="none"/>
            <path d="m11 45 13-13 8 7 20-22" stroke-width="3.4"/>
            <path d="M42 17h10v10" stroke-width="3.4"/>
            <path d="M18 51h31" opacity=".4"/>
        `,
        'message-circle': `
            <path d="M53 31c0 11-9.4 20-21 20a23 23 0 0 1-10-2l-10 3 3-10a19 19 0 0 1-4-11c0-11 9.4-20 21-20s21 9 21 20Z" fill="currentColor" opacity=".14"/>
            <path d="M53 31c0 11-9.4 20-21 20a23 23 0 0 1-10-2l-10 3 3-10a19 19 0 0 1-4-11c0-11 9.4-20 21-20s21 9 21 20Z"/>
            <circle cx="23" cy="31" r="2.4" fill="currentColor" stroke="none"/>
            <circle cx="32" cy="31" r="2.4" fill="currentColor" stroke="none"/>
            <circle cx="41" cy="31" r="2.4" fill="currentColor" stroke="none"/>
        `,
        'mail': `
            <rect x="9" y="16" width="46" height="34" rx="8" fill="currentColor" opacity=".12"/>
            <rect x="9" y="16" width="46" height="34" rx="8"/>
            <path d="m12 21 20 16 20-16"/>
            <path d="m12 46 15-14M52 46 37 32" opacity=".65"/>
            <circle cx="48" cy="17" r="5" fill="currentColor" opacity=".32"/>
            <path d="M48 14v6M45 17h6" stroke-width="2"/>
        `,
        'users': `
            <circle cx="25" cy="23" r="9" fill="currentColor" opacity=".18"/>
            <circle cx="25" cy="23" r="9"/>
            <path d="M10 51c1-10 7-16 15-16s14 6 15 16Z" fill="currentColor" opacity=".13"/>
            <path d="M10 51c1-10 7-16 15-16s14 6 15 16Z"/>
            <circle cx="43" cy="25" r="7" fill="currentColor" opacity=".14"/>
            <path d="M43 18a7 7 0 1 1-4 12M39 38c7 1 11 5 12 13M39 51h13"/>
        `,
        'phone': `
            <path d="M19 12 27 9l6 14-7 4a35 35 0 0 0 11 11l4-7 14 6-3 8c-1 4-5 7-9 6-18-4-31-17-35-35-1-4 2-7 6-8Z" fill="currentColor" opacity=".15"/>
            <path d="M19 12 27 9l6 14-7 4a35 35 0 0 0 11 11l4-7 14 6-3 8c-1 4-5 7-9 6-18-4-31-17-35-35-1-4 2-7 6-8Z"/>
            <path d="M46 13a9 9 0 0 1 7 7M46 20a3 3 0 0 1 3 3" stroke-width="2.6"/>
        `,
        'video': `
            <rect x="9" y="17" width="35" height="30" rx="7" fill="currentColor" opacity=".14"/>
            <rect x="9" y="17" width="35" height="30" rx="7"/>
            <path d="m44 27 11-6v22l-11-6Z" fill="currentColor" opacity=".26"/>
            <path d="m44 27 11-6v22l-11-6Z"/>
            <path d="m25 26 9 6-9 6Z" fill="currentColor" opacity=".45" stroke="none"/>
            <path d="m25 26 9 6-9 6Z"/>
            <circle cx="16" cy="24" r="2" fill="currentColor" stroke="none" opacity=".8"/>
        `,
        'palette': `
            <path d="M32 10C19 10 10 19 10 31c0 10 7 19 17 21 4 1 7-2 7-5 0-3-2-5-1-7 1-2 4-2 7-2h3c6 0 11-5 11-11 0-10-9-17-22-17Z" fill="currentColor" opacity=".14"/>
            <path d="M32 10C19 10 10 19 10 31c0 10 7 19 17 21 4 1 7-2 7-5 0-3-2-5-1-7 1-2 4-2 7-2h3c6 0 11-5 11-11 0-10-9-17-22-17Z"/>
            <circle cx="21" cy="26" r="3" fill="currentColor" opacity=".38"/>
            <circle cx="29" cy="19" r="3" fill="currentColor" opacity=".38"/>
            <circle cx="40" cy="19" r="3" fill="currentColor" opacity=".38"/>
            <circle cx="46" cy="28" r="3" fill="currentColor" opacity=".38"/>
        `,
        'pen-tool': `
            <path d="m39 10 15 15-22 22-14-1-1-14 22-22Z" fill="currentColor" opacity=".15"/>
            <path d="m39 10 15 15-22 22-14-1-1-14 22-22ZM17 46l-7 8"/>
            <path d="m31 47-14-1M20 34l14 14M39 10l15 15"/>
            <circle cx="20" cy="34" r="3" fill="currentColor" opacity=".3"/>
            <circle cx="20" cy="34" r="3"/>
            <circle cx="35" cy="49" r="3" fill="currentColor" opacity=".3"/>
            <circle cx="35" cy="49" r="3"/>
        `,
        'camera': `
            <rect x="9" y="18" width="46" height="32" rx="8" fill="currentColor" opacity=".13"/>
            <rect x="9" y="18" width="46" height="32" rx="8"/>
            <path d="m20 18 4-7h16l4 7"/>
            <circle cx="32" cy="34" r="11" fill="currentColor" opacity=".22"/>
            <circle cx="32" cy="34" r="11"/>
            <circle cx="32" cy="34" r="5" fill="currentColor" opacity=".42"/>
            <circle cx="32" cy="34" r="5"/>
            <circle cx="46" cy="25" r="2.5" fill="currentColor" stroke="none"/>
        `,
        'music': `
            <path d="M27 43V16l25-5v27" stroke-width="3.5"/>
            <path d="M27 20 52 15v14l-25 5Z" fill="currentColor" opacity=".16" stroke="none"/>
            <ellipse cx="19" cy="44" rx="9" ry="7" fill="currentColor" opacity=".26"/>
            <ellipse cx="19" cy="44" rx="9" ry="7"/>
            <ellipse cx="44" cy="37" rx="9" ry="7" fill="currentColor" opacity=".26"/>
            <ellipse cx="44" cy="37" rx="9" ry="7"/>
            <path d="M27 16V43M52 11v26" stroke-width="3.5"/>
        `,
        'film': `
            <rect x="10" y="13" width="44" height="38" rx="6" fill="currentColor" opacity=".12"/>
            <rect x="10" y="13" width="44" height="38" rx="6"/>
            <rect x="19" y="21" width="26" height="22" rx="3" fill="currentColor" opacity=".18"/>
            <rect x="19" y="21" width="26" height="22" rx="3"/>
            <path d="M10 22h9M45 22h9M10 42h9M45 42h9M15 14v7M15 43v7M49 14v7M49 43v7"/>
            <path d="m30 27 8 5-8 5Z" fill="currentColor" opacity=".46" stroke="none"/>
            <path d="m30 27 8 5-8 5Z"/>
        `,
        'mic': `
            <rect x="22" y="10" width="20" height="30" rx="10" fill="currentColor" opacity=".16"/>
            <rect x="22" y="10" width="20" height="30" rx="10"/>
            <path d="M15 31a17 17 0 0 0 34 0M32 48V55M23 55h18" stroke-width="3"/>
            <path d="M28 16v14M36 16v14" opacity=".45"/>
            <circle cx="32" cy="25" r="2.5" fill="currentColor" stroke="none" opacity=".75"/>
        `,
        'code-2': `
            <path d="m24 17-15 15 15 15M40 17l15 15-15 15M36 10 28 54" stroke-width="3.4"/>
            <path d="M15 29 9 35l15 15 5-5Z" fill="currentColor" opacity=".12" stroke="none"/>
            <path d="M49 29 55 35 40 50l-5-5Z" fill="currentColor" opacity=".12" stroke="none"/>
            <circle cx="32" cy="32" r="4" fill="currentColor" opacity=".28"/>
            <circle cx="32" cy="32" r="4"/>
        `,
        'terminal': `
            <rect x="9" y="13" width="46" height="38" rx="7" fill="currentColor" opacity=".12"/>
            <rect x="9" y="13" width="46" height="38" rx="7"/>
            <path d="M9 24h46"/>
            <circle cx="17" cy="19" r="2" fill="currentColor" stroke="none" opacity=".6"/>
            <circle cx="24" cy="19" r="2" fill="currentColor" stroke="none" opacity=".35"/>
            <path d="m19 32 7 6-7 6M31 44h13" stroke-width="3"/>
        `,
        'database': `
            <ellipse cx="32" cy="15" rx="20" ry="7" fill="currentColor" opacity=".24"/>
            <ellipse cx="32" cy="15" rx="20" ry="7"/>
            <path d="M12 15v17c0 4 9 7 20 7s20-3 20-7V15" fill="currentColor" opacity=".11"/>
            <path d="M12 15v17c0 4 9 7 20 7s20-3 20-7V15M12 32v17c0 4 9 7 20 7s20-3 20-7V32"/>
            <path d="M12 24c0 4 9 7 20 7s20-3 20-7" opacity=".6"/>
        `,
        'cloud': `
            <path d="M18 47h29a10 10 0 0 0 2-20 17 17 0 0 0-32-3 12 12 0 0 0 1 23Z" fill="currentColor" opacity=".14"/>
            <path d="M18 47h29a10 10 0 0 0 2-20 17 17 0 0 0-32-3 12 12 0 0 0 1 23Z"/>
            <path d="m22 35 5 5 9-10" stroke-width="3.2"/>
            <circle cx="48" cy="18" r="4" fill="currentColor" opacity=".28"/>
            <path d="M48 16v4M46 18h4" stroke-width="1.8"/>
        `,
        'bot': `
            <rect x="12" y="19" width="40" height="32" rx="10" fill="currentColor" opacity=".14"/>
            <rect x="12" y="19" width="40" height="32" rx="10"/>
            <path d="M32 19V11M27 11h10" stroke-width="3"/>
            <circle cx="32" cy="8" r="3" fill="currentColor" opacity=".32"/>
            <circle cx="32" cy="8" r="3"/>
            <circle cx="24" cy="34" r="4" fill="currentColor" opacity=".35"/>
            <circle cx="24" cy="34" r="4"/>
            <circle cx="40" cy="34" r="4" fill="currentColor" opacity=".35"/>
            <circle cx="40" cy="34" r="4"/>
            <path d="M24 44h16M8 30h4M52 30h4" stroke-width="3"/>
        `,
        'map': `
            <path d="m10 15 14-5 16 5 14-5v39l-14 5-16-5-14 5V15Z" fill="currentColor" opacity=".12"/>
            <path d="m10 15 14-5 16 5 14-5v39l-14 5-16-5-14 5V15ZM24 10v39M40 15v39"/>
            <path d="M32 20c-6 0-10 4-10 9 0 7 10 16 10 16s10-9 10-16c0-5-4-9-10-9Z" fill="currentColor" opacity=".25"/>
            <path d="M32 20c-6 0-10 4-10 9 0 7 10 16 10 16s10-9 10-16c0-5-4-9-10-9Z"/>
            <circle cx="32" cy="29" r="3" fill="currentColor" stroke="none"/>
        `,
        'plane': `
            <path d="m8 30 21-4 9-17 5 1-3 18 16 6c2 1 2 4 0 5l-16 2 3 15-5 1-9-15-21-3c-3 0-3-4 0-5Z" fill="currentColor" opacity=".18"/>
            <path d="m8 30 21-4 9-17 5 1-3 18 16 6c2 1 2 4 0 5l-16 2 3 15-5 1-9-15-21-3c-3 0-3-4 0-5Z"/>
            <path d="m29 26 7 9-7 9" opacity=".55"/>
            <circle cx="47" cy="14" r="2.5" fill="currentColor" opacity=".4"/>
        `,
        'shopping-cart': `
            <path d="M9 13h6l5 27h27l6-19H18" fill="currentColor" opacity=".13"/>
            <path d="M9 13h6l5 27h27l6-19H18M20 40a5 5 0 1 0 10 0M42 40a5 5 0 1 0 10 0"/>
            <path d="M22 29h26"/>
            <circle cx="25" cy="51" r="3" fill="currentColor" opacity=".34"/>
            <circle cx="47" cy="51" r="3" fill="currentColor" opacity=".34"/>
        `,
        'package': `
            <path d="m10 21 22-10 22 10v25L32 56 10 46V21Z" fill="currentColor" opacity=".13"/>
            <path d="m10 21 22-10 22 10v25L32 56 10 46V21ZM32 31v25M10 21l22 10 22-10M21 16l22 10"/>
            <path d="m22 17 21 10-10 5-21-10Z" fill="currentColor" opacity=".24" stroke="none"/>
            <path d="M32 31 54 21" stroke-width="3"/>
        `,
        'utensils': `
            <ellipse cx="34" cy="35" rx="17" ry="17" fill="currentColor" opacity=".1"/>
            <ellipse cx="34" cy="35" rx="17" ry="17"/>
            <ellipse cx="34" cy="35" rx="9" ry="9" fill="currentColor" opacity=".16"/>
            <ellipse cx="34" cy="35" rx="9" ry="9"/>
            <path d="M13 10v18M9 10v8a4 4 0 0 0 8 0v-8M13 28v27M51 10c-5 5-5 13 0 18v19" stroke-width="3"/>
            <path d="M47 10h8" stroke-width="3"/>
        `,
        'dumbbell': `
            <rect x="17" y="29" width="30" height="6" rx="3" fill="currentColor" opacity=".28"/>
            <rect x="17" y="29" width="30" height="6" rx="3"/>
            <path d="M14 20v24M9 24v16M19 23v18M50 20v24M55 24v16M45 23v18" stroke-width="5"/>
            <rect x="10" y="23" width="9" height="18" rx="3" fill="currentColor" opacity=".18"/>
            <rect x="45" y="23" width="9" height="18" rx="3" fill="currentColor" opacity=".18"/>
            <path d="M27 24h10" opacity=".45"/>
        `,
        'house': `
            <path d="m9 30 23-19 23 19v23H9V30Z" fill="currentColor" opacity=".14"/>
            <path d="m9 30 23-19 23 19v23H9V30ZM5 31l27-23 27 23"/>
            <path d="M25 53V37h14v16" fill="currentColor" opacity=".3"/>
            <path d="M25 53V37h14v16M18 31h7M39 31h7"/>
            <circle cx="35" cy="45" r="1.5" fill="currentColor" stroke="none"/>
        `,
        'gamepad-2': `
            <path d="M13 25c2-8 8-11 14-7h10c6-4 12-1 14 7l4 15c2 8-7 13-12 6l-4-6H25l-4 6c-5 7-14 2-12-6l4-15Z" fill="currentColor" opacity=".15"/>
            <path d="M13 25c2-8 8-11 14-7h10c6-4 12-1 14 7l4 15c2 8-7 13-12 6l-4-6H25l-4 6c-5 7-14 2-12-6l4-15Z"/>
            <path d="M21 28v12M15 34h12" stroke-width="3"/>
            <circle cx="43" cy="30" r="3" fill="currentColor" opacity=".4"/>
            <circle cx="49" cy="36" r="3" fill="currentColor" opacity=".4"/>
        `,
        'wrench': `
            <path d="M38 12a13 13 0 0 0-5 16L13 48a6 6 0 1 0 9 9l20-20a13 13 0 0 0 15-16l-9 9-8-3-3-8 9-9a13 13 0 0 0-8 2Z" fill="currentColor" opacity=".16"/>
            <path d="M38 12a13 13 0 0 0-5 16L13 48a6 6 0 1 0 9 9l20-20a13 13 0 0 0 15-16l-9 9-8-3-3-8 9-9a13 13 0 0 0-8 2Z"/>
            <circle cx="17" cy="51" r="3" fill="currentColor" opacity=".35"/>
            <path d="m25 42 7 7" opacity=".5"/>
        `,
        'shield-check': `
            <path d="M32 8 51 15v15c0 13-8 22-19 27C21 52 13 43 13 30V15l19-7Z" fill="currentColor" opacity=".17"/>
            <path d="M32 8 51 15v15c0 13-8 22-19 27C21 52 13 43 13 30V15l19-7Z"/>
            <path d="m22 32 7 7 14-15" stroke-width="3.5"/>
            <path d="M32 16v9" opacity=".48"/>
        `,
        'scale': `
            <path d="M32 11v39M21 51h22M17 15h30" stroke-width="3"/>
            <path d="m10 18 11 20H10a11 11 0 0 1 0-20ZM54 18 43 38h11a11 11 0 0 0 0-20Z" fill="currentColor" opacity=".15"/>
            <path d="m10 18 11 20H10a11 11 0 0 1 0-20ZM54 18 43 38h11a11 11 0 0 0 0-20Z"/>
            <path d="M32 11 17 18M32 11l15 7"/>
            <circle cx="32" cy="11" r="3" fill="currentColor" opacity=".32"/>
            <circle cx="32" cy="11" r="3"/>
        `
    });

    const NAMES = Object.freeze(Object.keys(ICONS));

    function escapeAttribute(value) {
        return String(value).replace(/[&<>"']/g, (character) => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[character]));
    }

    function safeSize(value) {
        if (typeof value === 'number' && Number.isFinite(value) && value > 0 && value <= 512) return String(value);
        if (typeof value === 'string' && /^(?:\d+(?:\.\d+)?)(?:px|em|rem|%)?$/.test(value.trim())) return value.trim();
        return '40';
    }

    function render(name, options = {}) {
        const key = typeof name === 'string' ? name.trim() : '';
        if (!Object.prototype.hasOwnProperty.call(ICONS, key)) return '';

        const size = safeSize(options.size);
        const className = options.className ? ` class="${escapeAttribute(options.className)}"` : '';
        const title = options.title ? `<title>${escapeAttribute(options.title)}</title>` : '';
        const accessibleLabel = options.label || options.title;
        const accessibility = accessibleLabel
            ? ` role="img" aria-label="${escapeAttribute(accessibleLabel)}"`
            : ' aria-hidden="true"';

        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${VIEW_BOX}" width="${size}" height="${size}" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round" focusable="false"${accessibility}${className}>${title}${ICONS[key]}</svg>`;
    }

    function mount(name, element, options = {}) {
        if (!element || typeof element !== 'object') return null;
        const markup = render(name, options);
        if (!markup) return null;
        element.innerHTML = markup;
        return element.firstElementChild;
    }

    const bank = Object.freeze({
        names: NAMES,
        icons: ICONS,
        has: (name) => typeof name === 'string' && Object.prototype.hasOwnProperty.call(ICONS, name.trim()),
        get: (name) => typeof name === 'string' && Object.prototype.hasOwnProperty.call(ICONS, name.trim()) ? ICONS[name.trim()] : '',
        render,
        svg: render,
        mount
    });

    global.InnovaIconBank = bank;
    global.INNOVA_ICON_BANK = bank;
    global.renderInnovaIcon = render;
})(typeof window !== 'undefined' ? window : globalThis);
