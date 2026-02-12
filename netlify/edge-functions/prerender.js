/**
 * Netlify Edge Function — Bot Detection & Prerender Proxy
 * Intercepts requests from search engine / social media bots
 * and proxies them to Prerender.io for pre-rendered HTML.
 *
 * Set PRERENDER_TOKEN in Netlify dashboard: Site settings > Environment variables
 */

const BOT_AGENTS = /googlebot|bingbot|yandex|baiduspider|facebookexternalhit|twitterbot|linkedinbot|slackbot|whatsapp|discordbot|applebot|redditbot|telegrambot|rogerbot|embedly|quora link preview|pinterest\/0\.|pinterestbot|flipboard|tumblr|bitlybot|nuzzel|qwantify|ia_archiver|google-inspectiontool/i;

const STATIC_EXT = /\.(js|css|png|jpg|jpeg|gif|svg|ico|woff2?|ttf|xml|txt|pdf|webp|avif|json|mp4|mp3)$/i;

const PRERENDER_URL = 'https://service.prerender.io';

export default async (request, context) => {
    const url = new URL(request.url);

    // Skip static assets
    if (STATIC_EXT.test(url.pathname)) {
        return context.next();
    }

    const ua = request.headers.get('user-agent') || '';

    // Only proxy for bots
    if (!BOT_AGENTS.test(ua)) {
        return context.next();
    }

    // Proxy to Prerender.io
    const token = Netlify.env.get('PRERENDER_TOKEN') || '';
    const prerenderUrl = `${PRERENDER_URL}/${request.url}`;

    try {
        const response = await fetch(prerenderUrl, {
            headers: {
                'X-Prerender-Token': token,
                'Accept': 'text/html'
            },
            redirect: 'follow'
        });

        if (!response.ok) {
            // Prerender failed — fall through to normal SPA
            return context.next();
        }

        return new Response(response.body, {
            status: 200,
            headers: {
                'Content-Type': 'text/html; charset=utf-8',
                'X-Prerendered': '1'
            }
        });
    } catch {
        // Network error — serve the SPA shell
        return context.next();
    }
};

export const config = { path: '/*' };
