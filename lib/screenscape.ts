/* eslint-disable prettier/prettier */
/**
 * ScreenScape API Client
 * Docs: https://screenscapeapi.dev/dashboard/docs
 * All requests require x-api-key header.
 */

const BASE_URL = process.env.SCREENSCAPE_API_URL || 'https://screenscapeapi.dev';
const API_KEY = process.env.SCREENSCAPE_API_KEY || '';

async function screenscapeFetch<T = unknown>(
  path: string,
  params?: Record<string, string>,
): Promise<T> {
  if (!API_KEY) {
    throw new Error('SCREENSCAPE_API_KEY is not set in environment variables.');
  }

  const url = new URL(`${BASE_URL}/api${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));
  }

  const res = await fetch(url.toString(), {
    headers: {
      'x-api-key': API_KEY,
      'Content-Type': 'application/json',
    },
    next: { revalidate: 3600 }, // Cache for 1 hour
  });

  if (!res.ok) {
    const text = await res.text().catch(() => res.statusText);
    throw new Error(`ScreenScape API error ${res.status}: ${text}`);
  }

  return res.json() as Promise<T>;
}

// ─── KMMovies (Movies & TV) ────────────────────────────────────────────────

export const kmmovies = {
  /** Latest releases */
  latest: () => screenscapeFetch('/kmmovies'),
  /** Search movies */
  search: (q: string) => screenscapeFetch('/kmmovies/search', { q }),
  /** Movie/show details */
  details: (url: string) => screenscapeFetch('/kmmovies/details', { url }),
  /** Download/stream magic links */
  magiclinks: (url: string) => screenscapeFetch('/kmmovies/magiclinks', { url }),
};

// ─── AnimeSalt (Anime) ─────────────────────────────────────────────────────

export const animesalt = {
  /** Latest anime */
  latest: () => screenscapeFetch('/animesalt'),
  /** Search anime */
  search: (q: string) => screenscapeFetch('/animesalt/search', { q }),
  /** Anime details */
  details: (url: string) => screenscapeFetch('/animesalt/details', { url }),
  /** Streaming links for an episode */
  stream: (url: string) => screenscapeFetch('/animesalt/stream', { url }),
};

// ─── NetMirror (Streaming) ─────────────────────────────────────────────────

export const netmirror = {
  /** Homepage content */
  latest: () => screenscapeFetch('/netmirror'),
  /** Search content */
  search: (q: string) => screenscapeFetch('/netmirror/search', { q }),
  /** Get post details by ID */
  getpost: (id: string) => screenscapeFetch('/netmirror/getpost', { id }),
  /** Stream URLs for a post */
  stream: (id: string) => screenscapeFetch('/netmirror/stream', { id }),
};

// ─── AnimePahe ─────────────────────────────────────────────────────────────

export const animepahe = {
  latest: () => screenscapeFetch('/animepahe'),
  search: (q: string) => screenscapeFetch('/animepahe/search', { q }),
  details: (url: string) => screenscapeFetch('/animepahe/details', { url }),
  stream: (url: string) => screenscapeFetch('/animepahe/stream', { url }),
};

// ─── HDHub4U ───────────────────────────────────────────────────────────────

export const hdhub4u = {
  latest: () => screenscapeFetch('/hdhub4u'),
  search: (q: string) => screenscapeFetch('/hdhub4u/search', { q }),
  details: (url: string) => screenscapeFetch('/hdhub4u/details', { url }),
};

// ─── UHD Movies ───────────────────────────────────────────────────────────

export const uhdmovies = {
  latest: () => screenscapeFetch('/uhdmovies'),
  search: (q: string) => screenscapeFetch('/uhdmovies/search', { q }),
  details: (url: string) => screenscapeFetch('/uhdmovies/details', { url }),
};

// ─── Unified helpers ──────────────────────────────────────────────────────

export const screenscape = {
  kmmovies,
  animesalt,
  netmirror,
  animepahe,
  hdhub4u,
  uhdmovies,
};

export default screenscape;
