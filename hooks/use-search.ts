/* eslint-disable prettier/prettier */
import { useState, useEffect } from 'react';
import { tmdb } from '@/lib/tmdb';
import { anilist } from '@/lib/anilist';

type SearchCategory = 'movie' | 'tv' | 'anime';

export function useSearch(search: string, category: SearchCategory) {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);

  useEffect(() => {
    if (!search.trim() || search.length < 2) { setResults(null); return; }

    const delay = setTimeout(async () => {
      setIsLoading(true);
      try {
        if (category === 'movie') {
          const data = await tmdb.movies.search(search, 'en-US');
          setResults(data?.results || []);
        } else if (category === 'tv') {
          const data = await tmdb.tv.search(search, 'en-US');
          setResults(data?.results || []);
        } else if (category === 'anime') {
          const items = await anilist.searchAnime(search);
          // Normalise to expected shape for the search UI
          const normalised = (items || []).map((item: any) => ({
            id: item.id,
            title: item.title?.english || item.title?.romaji,
            name: item.title?.romaji,
            poster_path: null,
            image: item.coverImage?.extraLarge || item.coverImage?.large,
            vote_average: item.averageScore ? item.averageScore / 10 : 0,
            rating: item.averageScore,
            overview: item.description?.replace(/<[^>]*>/g, '') || '',
          }));
          setResults(normalised);
        }
      } catch (e) {
        console.error('Search error:', e);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(delay);
  }, [search, category]);

  return { results, isLoading };
}
