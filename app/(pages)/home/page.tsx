/* eslint-disable prettier/prettier */
import { Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Play, Star, ArrowRight, Film, Tv2, Antenna, Book, TrendingUp, Clock, Flame, Globe } from 'lucide-react';
import { tmdb } from '@/lib/tmdb';
import { anilist } from '@/lib/anilist';
import HomeBannerClient from '@/components/home/banner-client';
import HomeRowSection from '@/components/home/row-section';

// ── Server-side data fetching ──────────────────────────────────────────────
async function getHomeData() {
  const [
    trendingMovies, popularMovies, nowPlayingMovies, topRatedMovies,
    popularTV, topRatedTV, onAirTV,
    trendingAnime, popularAnime, recentAnime,
    trendingManga, popularManga,
  ] = await Promise.allSettled([
    tmdb.movies.list({ list: 'popular', language: 'en-US', page: 1 }),
    tmdb.movies.list({ list: 'popular', language: 'en-US', page: 2 }),
    tmdb.movies.list({ list: 'now_playing', language: 'en-US', page: 1 }),
    tmdb.movies.list({ list: 'top_rated', language: 'en-US', page: 1 }),
    tmdb.tv.list({ list: 'popular', language: 'en-US', page: 1 }),
    tmdb.tv.list({ list: 'top_rated', language: 'en-US', page: 1 }),
    tmdb.tv.list({ list: 'on_the_air', language: 'en-US', page: 1 }),
    anilist.trending(),
    anilist.popular(),
    anilist.recent(),
    anilist.trendingManga(),
    anilist.popularManga(),
  ]);

  const safe = <T,>(r: PromiseSettledResult<T>, fallback: T) =>
    r.status === 'fulfilled' ? r.value : fallback;

  return {
    trendingMovies:  (safe(trendingMovies,  { results: [] } as any).results ?? []).slice(0, 20),
    popularMovies:   (safe(popularMovies,   { results: [] } as any).results ?? []).slice(0, 20),
    nowPlayingMovies:(safe(nowPlayingMovies, { results: [] } as any).results ?? []).slice(0, 20),
    topRatedMovies:  (safe(topRatedMovies,  { results: [] } as any).results ?? []).slice(0, 20),
    popularTV:       (safe(popularTV,       { results: [] } as any).results ?? []).slice(0, 20),
    topRatedTV:      (safe(topRatedTV,      { results: [] } as any).results ?? []).slice(0, 20),
    onAirTV:         (safe(onAirTV,         { results: [] } as any).results ?? []).slice(0, 20),
    trendingAnime:   (safe(trendingAnime,   []) as any[]).slice(0, 20),
    popularAnime:    (safe(popularAnime,    []) as any[]).slice(0, 20),
    recentAnime:     (safe(recentAnime,     []) as any[]).slice(0, 20),
    trendingManga:   (safe(trendingManga,   []) as any[]).slice(0, 20),
    popularManga:    (safe(popularManga,    []) as any[]).slice(0, 20),
  };
}

export default async function HomePage() {
  const data = await getHomeData();

  // Hero banner items — mix of movies and TV
  const bannerItems = [
    ...data.trendingMovies.slice(0, 4).map((m: any) => ({ ...m, _type: 'movie' })),
    ...data.popularTV.slice(0, 3).map((t: any) => ({ ...t, _type: 'tv' })),
    ...data.trendingAnime.slice(0, 2).map((a: any) => ({
      id: a.id, title: a.title?.english || a.title?.romaji,
      backdrop_path: null, poster_path: a.coverImage?.large,
      vote_average: a.averageScore ? a.averageScore / 10 : 0,
      overview: a.description?.replace(/<[^>]*>/g, '').slice(0, 200) || '',
      _banner: a.bannerImage, _type: 'anime',
    })),
  ];

  return (
    <div className="min-h-screen">
      {/* ── Hero Banner ── */}
      <HomeBannerClient items={bannerItems} />

      {/* ── Content Rows ── */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-10 space-y-12">

        {/* Trending Movies */}
        <HomeRowSection
          title="Trending Movies"
          subtitle="What everyone is watching right now"
          icon="film"
          color="var(--neon-pink)"
          href="/movie"
          items={data.trendingMovies.map((m: any) => ({
            id: m.id, title: m.title, poster: m.poster_path, rating: m.vote_average,
            year: m.release_date?.slice(0, 4), href: `/movie/${m.id}`, type: 'movie',
          }))}
        />

        {/* Popular TV Shows */}
        <HomeRowSection
          title="Popular TV Shows"
          subtitle="Binge-worthy series streaming now"
          icon="tv"
          color="var(--neon-blue)"
          href="/tv"
          items={data.popularTV.map((t: any) => ({
            id: t.id, title: t.name, poster: t.poster_path, rating: t.vote_average,
            year: t.first_air_date?.slice(0, 4), href: `/tv/${t.id}`, type: 'tv',
          }))}
        />

        {/* Trending Anime */}
        <HomeRowSection
          title="Trending Anime"
          subtitle="Hot picks from AniList this season"
          icon="antenna"
          color="var(--neon-purple)"
          href="/anime"
          items={data.trendingAnime.map((a: any) => ({
            id: a.id,
            title: a.title?.english || a.title?.romaji,
            poster: a.coverImage?.large,
            rating: a.averageScore ? a.averageScore / 10 : 0,
            year: a.startDate?.year?.toString(),
            href: `/anime/${a.id}`,
            type: 'anime',
          }))}
        />

        {/* Now Playing Movies */}
        <HomeRowSection
          title="Now Playing"
          subtitle="In cinemas and streaming today"
          icon="flame"
          color="var(--neon-yellow)"
          href="/movie"
          items={data.nowPlayingMovies.map((m: any) => ({
            id: m.id, title: m.title, poster: m.poster_path, rating: m.vote_average,
            year: m.release_date?.slice(0, 4), href: `/movie/${m.id}`, type: 'movie',
          }))}
        />

        {/* Top Rated TV */}
        <HomeRowSection
          title="Top Rated TV Shows"
          subtitle="The highest rated series of all time"
          icon="star"
          color="var(--neon-blue)"
          href="/tv"
          items={data.topRatedTV.map((t: any) => ({
            id: t.id, title: t.name, poster: t.poster_path, rating: t.vote_average,
            year: t.first_air_date?.slice(0, 4), href: `/tv/${t.id}`, type: 'tv',
          }))}
        />

        {/* Popular Anime */}
        <HomeRowSection
          title="Popular Anime"
          subtitle="All-time fan favourites"
          icon="trending"
          color="var(--neon-purple)"
          href="/anime"
          items={data.popularAnime.map((a: any) => ({
            id: a.id,
            title: a.title?.english || a.title?.romaji,
            poster: a.coverImage?.large,
            rating: a.averageScore ? a.averageScore / 10 : 0,
            year: a.startDate?.year?.toString(),
            href: `/anime/${a.id}`,
            type: 'anime',
          }))}
        />

        {/* Top Rated Movies */}
        <HomeRowSection
          title="Top Rated Movies"
          subtitle="Cinema classics and modern masterpieces"
          icon="star"
          color="var(--neon-pink)"
          href="/movie"
          items={data.topRatedMovies.map((m: any) => ({
            id: m.id, title: m.title, poster: m.poster_path, rating: m.vote_average,
            year: m.release_date?.slice(0, 4), href: `/movie/${m.id}`, type: 'movie',
          }))}
        />

        {/* On Air TV */}
        <HomeRowSection
          title="Currently Airing"
          subtitle="Live series you can watch right now"
          icon="globe"
          color="var(--neon-green)"
          href="/tv"
          items={data.onAirTV.map((t: any) => ({
            id: t.id, title: t.name, poster: t.poster_path, rating: t.vote_average,
            year: t.first_air_date?.slice(0, 4), href: `/tv/${t.id}`, type: 'tv',
          }))}
        />

        {/* Recent Anime */}
        <HomeRowSection
          title="New Anime Episodes"
          subtitle="Latest releases this season"
          icon="clock"
          color="var(--neon-purple)"
          href="/anime"
          items={data.recentAnime.map((a: any) => ({
            id: a.id,
            title: a.title?.english || a.title?.romaji,
            poster: a.coverImage?.large,
            rating: a.averageScore ? a.averageScore / 10 : 0,
            year: a.startDate?.year?.toString(),
            href: `/anime/${a.id}`,
            type: 'anime',
          }))}
        />

        {/* Trending Manga */}
        <HomeRowSection
          title="Trending Manga"
          subtitle="Most-read manga right now"
          icon="book"
          color="var(--neon-yellow)"
          href="/manga"
          items={data.trendingManga.map((m: any) => ({
            id: m.id,
            title: m.title?.english || m.title?.romaji,
            poster: m.coverImage?.large,
            rating: m.averageScore ? m.averageScore / 10 : 0,
            year: m.startDate?.year?.toString(),
            href: `/manga/info/${m.id}`,
            type: 'manga',
          }))}
        />

        {/* Popular Manga */}
        <HomeRowSection
          title="Popular Manga"
          subtitle="Beloved series with massive fanbases"
          icon="trending"
          color="var(--neon-yellow)"
          href="/manga"
          items={data.popularManga.map((m: any) => ({
            id: m.id,
            title: m.title?.english || m.title?.romaji,
            poster: m.coverImage?.large,
            rating: m.averageScore ? m.averageScore / 10 : 0,
            year: m.startDate?.year?.toString(),
            href: `/manga/info/${m.id}`,
            type: 'manga',
          }))}
        />

      </div>
    </div>
  );
}
