const JSON_HEADERS = { 'content-type':'application/json; charset=utf-8', 'cache-control':'private, max-age=300' };

function json(data, status = 200) {
    return new Response(JSON.stringify(data), { status, headers:JSON_HEADERS });
}

function allowedUrl(value) {
    try {
        const url = new URL(value);
        const host = url.hostname.toLowerCase();
        const allowed = host === 'g.co' || host === 'gemini.google.com' || host.endsWith('.google.com');
        return url.protocol === 'https:' && allowed && !url.username && !url.password ? url : null;
    } catch { return null; }
}

function decodeHtml(value) {
    return String(value || '').replace(/&amp;/gi, '&').replace(/&quot;/gi, '"').replace(/&#39;|&apos;/gi, "'")
        .replace(/&lt;/gi, '<').replace(/&gt;/gi, '>').replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)))
        .replace(/\s+/g, ' ').trim();
}

function metaContent(html, key) {
    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const patterns = [
        new RegExp(`<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']*)["'][^>]*>`, 'i'),
        new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["']${escaped}["'][^>]*>`, 'i')
    ];
    for (const pattern of patterns) {
        const match = html.match(pattern);
        if (match) return decodeHtml(match[1]);
    }
    return '';
}

export async function onRequestGet(context) {
    const target = allowedUrl(new URL(context.request.url).searchParams.get('url') || '');
    if (!target) return json({ error:'Solo se admiten enlaces de Gemini.' }, 400);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    try {
        const response = await fetch(target.href, { redirect:'follow', signal:controller.signal });
        if (!response.ok || !(response.headers.get('content-type') || '').includes('text/html')) return json({ title:'', description:'' });
        const html = (await response.text()).slice(0, 1000000);
        const rawTitle = metaContent(html, 'og:title') || metaContent(html, 'twitter:title') || decodeHtml(html.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1]);
        const rawDescription = metaContent(html, 'og:description') || metaContent(html, 'description') || metaContent(html, 'twitter:description');
        const title = rawTitle.replace(/[\u200B-\u200F\u202A-\u202E\u2060\uFEFF]/g, '').replace(/\s*[|–—-]\s*(Gemini|Google Gemini)\s*$/i, '').trim();
        const genericTitle = /^(gemini|google|google gemini|sign in|iniciar sesi[oó]n)$/i.test(title);
        const genericDescription = /gemini,? google.?s ai assistant|asistente de ia de google/i.test(rawDescription);
        return json({ title:genericTitle ? '' : title.slice(0, 80), description:genericDescription ? '' : rawDescription.slice(0, 240) });
    } catch {
        return json({ title:'', description:'' });
    } finally {
        clearTimeout(timeout);
    }
}
