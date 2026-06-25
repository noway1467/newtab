const DEFAULT_ALLOWED_METHODS = ['GET', 'PUT', 'PROPFIND', 'OPTIONS'];

const REQUEST_HEADER_ALLOWLIST = [
    'accept',
    'authorization',
    'content-type',
    'depth',
    'if-match',
    'if-none-match',
    'range',
    'timeout'
];

const CORS_REQUEST_HEADERS = [
    'Authorization',
    'Content-Type',
    'Depth',
    'If-Match',
    'If-None-Match',
    'Range',
    'Timeout',
    'X-Proxy-Token',
    'X-Target-Url'
].join(', ');

const CORS_EXPOSE_HEADERS = [
    'Allow',
    'Content-Length',
    'Content-Type',
    'DAV',
    'ETag',
    'Last-Modified',
    'Location'
].join(', ');

function parseList(value) {
    return String(value || '')
        .split(',')
        .map(item => item.trim())
        .filter(Boolean);
}

function getCorsHeaders(request, env) {
    const origin = request.headers.get('Origin') || '';
    const allowedOrigins = parseList(env.ALLOWED_ORIGINS);
    const allowOrigin = allowedOrigins.length === 0
        ? '*'
        : allowedOrigins.includes(origin)
            ? origin
            : allowedOrigins[0] || 'null';

    return {
        'Access-Control-Allow-Origin': allowOrigin,
        'Access-Control-Allow-Methods': DEFAULT_ALLOWED_METHODS.join(', '),
        'Access-Control-Allow-Headers': CORS_REQUEST_HEADERS,
        'Access-Control-Expose-Headers': CORS_EXPOSE_HEADERS,
        'Access-Control-Max-Age': '86400',
        'Vary': 'Origin'
    };
}

function validateOrigin(request, env) {
    const allowedOrigins = parseList(env.ALLOWED_ORIGINS);
    if (allowedOrigins.length === 0) return true;

    const origin = request.headers.get('Origin') || '';
    return Boolean(origin && allowedOrigins.includes(origin));
}

function withCors(response, request, env) {
    const headers = new Headers(response.headers);
    const corsHeaders = getCorsHeaders(request, env);
    Object.entries(corsHeaders).forEach(([key, value]) => headers.set(key, value));

    return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers
    });
}

function textResponse(message, status, request, env) {
    return withCors(new Response(message, { status }), request, env);
}

function isAllowedHost(hostname, allowedHosts) {
    if (allowedHosts.length === 0) return true;
    return allowedHosts.some(rule => {
        const normalized = rule.toLowerCase();
        const host = hostname.toLowerCase();

        if (normalized.startsWith('*.')) {
            const suffix = normalized.slice(1);
            return host.endsWith(suffix);
        }

        return host === normalized;
    });
}

function readProxyToken(request) {
    const headerToken = request.headers.get('X-Proxy-Token');
    if (headerToken) return headerToken;

    const url = new URL(request.url);
    return url.searchParams.get('token') || '';
}

function validateToken(request, env) {
    if (!env.PROXY_TOKEN) return true;
    return readProxyToken(request) === env.PROXY_TOKEN;
}

function validateTargetUrl(rawTarget, env) {
    if (!rawTarget) {
        return { error: 'Missing X-Target-Url', status: 400 };
    }

    let targetUrl;
    try {
        targetUrl = new URL(rawTarget);
    } catch (error) {
        return { error: 'Invalid X-Target-Url', status: 400 };
    }

    if (!['http:', 'https:'].includes(targetUrl.protocol)) {
        return { error: 'Only http/https targets are allowed', status: 400 };
    }

    const allowedHosts = parseList(env.ALLOWED_WEBDAV_HOSTS);
    if (!isAllowedHost(targetUrl.hostname, allowedHosts)) {
        return { error: 'Target host is not allowed', status: 403 };
    }

    return { targetUrl };
}

function buildForwardHeaders(request) {
    const headers = new Headers();

    REQUEST_HEADER_ALLOWLIST.forEach(name => {
        const value = request.headers.get(name);
        if (value) headers.set(name, value);
    });

    return headers;
}

function validateBodySize(request, env) {
    const maxBodyBytes = Number(env.MAX_BODY_BYTES || 0);
    if (!maxBodyBytes) return true;

    const contentLength = Number(request.headers.get('Content-Length') || 0);
    return !contentLength || contentLength <= maxBodyBytes;
}

export default {
    async fetch(request, env) {
        if (!validateOrigin(request, env)) {
            return textResponse('Origin is not allowed', 403, request, env);
        }

        if (!validateToken(request, env)) {
            return textResponse('Unauthorized proxy token', 401, request, env);
        }

        if (request.method === 'OPTIONS') {
            return withCors(new Response(null, { status: 204 }), request, env);
        }

        if (!DEFAULT_ALLOWED_METHODS.includes(request.method)) {
            return textResponse('Method not allowed', 405, request, env);
        }

        if (!validateBodySize(request, env)) {
            return textResponse('Request body is too large', 413, request, env);
        }

        const { targetUrl, error, status } = validateTargetUrl(request.headers.get('X-Target-Url'), env);
        if (error) {
            return textResponse(error, status, request, env);
        }

        try {
            const response = await fetch(targetUrl.toString(), {
                method: request.method,
                headers: buildForwardHeaders(request),
                body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
                redirect: 'follow'
            });

            return withCors(response, request, env);
        } catch (error) {
            return textResponse(`Proxy error: ${error.message}`, 502, request, env);
        }
    }
};
