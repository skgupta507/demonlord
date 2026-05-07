/* eslint-disable prettier/prettier */
/**
 * Crysoline API Client — AnimePahe source
 * Base: https://api.crysoline.moe
 * Docs: https://api.crysoline.moe/docs#tag/animepahe
 */

const BASE = 'https://api.crysoline.moe';

async function cryfetch<T>(path: string, params?: Record<string, string>): Promise<T> {
  const url = new URL(`${BASE}${path}`);
  if (params) Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const res = await fetch(url.toString(), {
    headers: { 'Accept': 'application/json', 'User-Agent': 'DemonLord/3.0' },
    next: { revalidate: 1800 },
  });
  if (!res.ok) throw new Error(`Crysoline ${res.status}: ${path}`);
  return res.json();
}

export const crysoline = {
  // ── AnimePahe endpoints ──────────────────────────────────────
  /** Search anime on AnimePahe */
  searchAnime: (query: string) =>
    cryfetch<any>('/animepahe/search', { q: query }),

  /** Get anime info + episode list from AnimePahe */
  getAnime: (animeId: string) =>
    cryfetch<any>(`/animepahe/anime/${animeId}`),

  /** Get stream sources for a specific AnimePahe episode */
  getStream: (episodeId: string) =>
    cryfetch<any>(`/animepahe/episode/${episodeId}`),

  /** Get all episodes for an anime (paginated) */
  getEpisodes: (animeId: string, page = 1) =>
    cryfetch<any>(`/animepahe/anime/${animeId}/episodes`, { page: String(page) }),

  // ── Fallback: AnimeGG endpoints ──────────────────────────────
  /** Search on AnimeGG as fallback */
  searchAnimeGG: (query: string) =>
    cryfetch<any>('/animegg/search', { q: query }),

  getAnimeGGStream: (episodeId: string) =>
    cryfetch<any>(`/animegg/episode/${episodeId}`),
};
