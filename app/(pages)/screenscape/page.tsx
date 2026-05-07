/* eslint-disable prettier/prettier */
'use client';
import { useState } from 'react';
import { Search, Film, Tv, ExternalLink, Zap, Database } from 'lucide-react';

interface Result {
  title?: string; name?: string; url?: string; image?: string; year?: string; quality?: string;
}

export default function ScreenScapePage() {
  const [query, setQuery] = useState('');
  const [movies, setMovies] = useState<Result[]>([]);
  const [anime, setAnime] = useState<Result[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true); setSearched(true); setError(null);
    try {
      const res = await fetch('/api/screenscape/search?q=' + encodeURIComponent(query));
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setMovies(Array.isArray(data.movies?.results) ? data.movies.results : []);
      setAnime(Array.isArray(data.anime?.results) ? data.anime.results : []);
    } catch (e: any) {
      setError(e.message); setMovies([]); setAnime([]);
    } finally { setLoading(false); }
  };

  const ResultCard = ({ item }: { item: Result }) => (
    <div className="group flex gap-3 border border-[hsl(var(--border))] p-3 hover:border-[hsl(350_100%_58%/0.4)] transition-all bg-[hsl(var(--card))]">
      {item.image && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={item.image} alt={item.title || item.name || ''}
          className="w-14 h-20 object-cover shrink-0 border border-[hsl(var(--border))]"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      )}
      <div className="flex flex-col gap-1.5 min-w-0">
        <p className="text-sm font-semibold truncate" style={{ fontFamily: 'Rajdhani, sans-serif', fontWeight: 600 }}>
          {item.title || item.name}
        </p>
        <div className="flex flex-wrap gap-1">
          {item.year && (
            <span className="border border-[hsl(var(--border))] px-1.5 py-0.5 text-[0.55rem] tracking-widest text-muted-foreground" style={{ fontFamily: 'Share Tech Mono, monospace' }}>
              {item.year}
            </span>
          )}
          {item.quality && (
            <span className="border border-[hsl(185_100%_48%/0.4)] px-1.5 py-0.5 text-[0.55rem] tracking-widest text-[hsl(185_100%_48%)]" style={{ fontFamily: 'Share Tech Mono, monospace' }}>
              {item.quality}
            </span>
          )}
        </div>
        {item.url && (
          <a href={item.url} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 text-[0.6rem] tracking-widest text-[hsl(350_100%_58%)] hover:underline mt-auto"
            style={{ fontFamily: 'Share Tech Mono, monospace' }}
          >
            <ExternalLink size={9} /> ACCESS
          </a>
        )}
      </div>
    </div>
  );

  const providers = ['KMMOVIES', 'ANIMESALT', 'ANIMEPAHE', 'NETMIRROR', 'HDHUB4U', 'UHDMOVIES'];

  return (
    <div className="mx-auto max-w-5xl space-y-8 p-6">
      {/* Header */}
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center border border-[hsl(60_100%_60%/0.4)]">
            <div className="absolute inset-0 border border-[hsl(60_100%_60%/0.2)] scale-110" />
            <Zap size={18} className="text-[hsl(60_100%_60%)]" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-[0.15em] uppercase" style={{ fontFamily: 'Orbitron, monospace' }}>
              SCREENSCAPE
            </h1>
            <p className="text-[0.6rem] tracking-[0.2em] text-muted-foreground uppercase" style={{ fontFamily: 'Share Tech Mono, monospace' }}>
              MULTI-PROVIDER CONTENT SEARCH NODE
            </p>
          </div>
        </div>

        {/* Provider tags */}
        <div className="flex flex-wrap gap-2">
          {providers.map(p => (
            <span key={p} className="border border-[hsl(var(--border))] px-2 py-0.5 text-[0.55rem] tracking-widest text-muted-foreground flex items-center gap-1" style={{ fontFamily: 'Share Tech Mono, monospace' }}>
              <Database size={8} /> {p}
            </span>
          ))}
        </div>
      </div>

      {/* Search input */}
      <div className="flex gap-0">
        <div className="flex flex-1 items-center border border-[hsl(var(--border))] hover:border-[hsl(350_100%_58%/0.4)] focus-within:border-[hsl(350_100%_58%/0.6)] transition-colors">
          <span className="pl-4 text-[hsl(350_100%_58%)]" style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.7rem' }}>&gt;_</span>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSearch()}
            placeholder="SEARCH QUERY..."
            className="flex-1 bg-transparent px-3 py-3 text-sm outline-none placeholder:text-muted-foreground/40 placeholder:tracking-widest"
            style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.8rem', letterSpacing: '0.05em' }}
          />
        </div>
        <button
          onClick={handleSearch}
          disabled={loading}
          className="flex items-center gap-2 bg-[hsl(350_100%_58%)] px-5 py-3 text-white transition-all hover:bg-[hsl(350_100%_50%)] disabled:opacity-50"
          style={{ fontFamily: 'Share Tech Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.2em' }}
        >
          {loading ? (
            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <><Search size={13} /> SCAN</>
          )}
        </button>
      </div>

      {/* Error */}
      {error && (
        <div className="border border-[hsl(0_85%_60%/0.4)] bg-[hsl(0_85%_60%/0.05)] p-4">
          <span className="text-[0.65rem] tracking-widest text-[hsl(0_85%_60%)]" style={{ fontFamily: 'Share Tech Mono, monospace' }}>
            ERROR: {error}
          </span>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-24 border border-[hsl(var(--border))] animate-pulse bg-[hsl(var(--muted))]" />
          ))}
        </div>
      )}

      {/* Results */}
      {!loading && searched && (
        <div className="space-y-8">
          {movies.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-[0.6rem] tracking-[0.25em] text-[hsl(350_100%_58%)] uppercase flex items-center gap-1" style={{ fontFamily: 'Share Tech Mono, monospace' }}>
                  <Film size={10} /> MOVIES & TV [{movies.length}]
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-[hsl(350_100%_58%/0.3)] to-transparent" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {movies.map((item, i) => <ResultCard key={i} item={item} />)}
              </div>
            </section>
          )}
          {anime.length > 0 && (
            <section className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-[0.6rem] tracking-[0.25em] text-[hsl(280_100%_68%)] uppercase flex items-center gap-1" style={{ fontFamily: 'Share Tech Mono, monospace' }}>
                  <Tv size={10} /> ANIME [{anime.length}]
                </span>
                <div className="flex-1 h-px bg-gradient-to-r from-[hsl(280_100%_68%/0.3)] to-transparent" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {anime.map((item, i) => <ResultCard key={i} item={item} />)}
              </div>
            </section>
          )}
          {movies.length === 0 && anime.length === 0 && !error && (
            <div className="flex flex-col items-center py-16 gap-3">
              <span className="text-4xl opacity-20">⚡</span>
              <span className="text-[0.65rem] tracking-widest text-muted-foreground" style={{ fontFamily: 'Share Tech Mono, monospace' }}>
                NO SIGNALS FOUND FOR &quot;{query.toUpperCase()}&quot;
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
