/* eslint-disable prettier/prettier */
'use client';
import * as React from 'react';
import { Download, ChevronDown, ChevronLeft, ChevronRight, Shield, ShieldOff } from 'lucide-react';
import Link from 'next/link';
import { Episode, Season, tmdb } from '@/lib/tmdb';
import { useTheme } from 'next-themes';

const SERVERS = [
  { key: 'screenscape', label: 'SCREENSCAPE', tag: 'NEW' },
  { key: 'default',     label: 'DEFAULT',     tag: 'REC' },
  { key: 'embedsu',     label: 'EMBEDSU'                 },
  { key: 'vidsrc',      label: 'VIDSRC'                  },
  { key: 'vidlink',     label: 'VIDLINK'                 },
  { key: 'videasy',     label: 'VIDEASY'                 },
  { key: '111movies',   label: '111MOVIES'               },
  { key: 'vidzee',      label: 'VIDZEE'                  },
];

export default function VideoPlayer({ id }: { id: string }) {
  const { theme } = useTheme();
  const isLight = theme === 'light';

  const [seasons, setSeasons] = React.useState<Season[]>([]);
  const [episodes, setEpisodes] = React.useState<Episode[]>([]);
  const [season, setSeason] = React.useState('1');
  const [episode, setEpisode] = React.useState('1');
  const [server, setServer] = React.useState('screenscape');
  const [isLoading, setIsLoading] = React.useState(true);
  const [serverOpen, setServerOpen] = React.useState(false);
  const [seasonOpen, setSeasonOpen] = React.useState(false);
  const [adBlock, setAdBlock] = React.useState(true);

  const getUrl = (srv: string) => {
    const s = season; const e = episode;
    const map: Record<string, string> = {
      screenscape: `https://screenscape.me/embed?tmdb=${id}&type=tv&s=${s}&e=${e}`,
      default:     `https://flix.1ani.me/embed/tmdb-tv-${id}-${s}-${e}`,
      embedsu:     `https://embed.su/embed/tv/${id}/${s}/${e}`,
      vidsrc:      `https://vidsrc.in/embed/tv/${id}/${s}/${e}`,
      vidlink:     `https://vidlink.pro/tv/${id}/${s}/${e}`,
      videasy:     `https://player.videasy.net/tv/${id}/${s}/${e}`,
      '111movies': `https://111movies.com/tv/${id}/${s}/${e}`,
      vidzee:      `https://vidzee.wtf/tv/${id}/${s}/${e}`,
    };
    return map[srv] || map.screenscape;
  };

  const fetchEpisodes = React.useCallback(async (seasonNum: number) => {
    setIsLoading(true);
    try {
      const s = await tmdb.season.details(Number(id), seasonNum, 'en-US');
      setEpisodes(s.episodes || []);
      if (s.episodes?.length) setEpisode(s.episodes[0].episode_number.toString());
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  }, [id]);

  React.useEffect(() => { fetchEpisodes(Number(season)); }, [season, fetchEpisodes]);

  React.useEffect(() => {
    (async () => {
      try {
        const series = await tmdb.tv.details(Number(id), 'en-US');
        const rel = series.seasons.filter((s: any) => s.season_number > 0);
        setSeasons(rel);
        if (rel.length) setSeason(rel[0].season_number.toString());
      } catch (e) { console.error(e); }
    })();
  }, [id]);

  const currentServer = SERVERS.find(s => s.key === server)!;
  const epIndex = episodes.findIndex(e => e.episode_number.toString() === episode);
  const prevEp = episodes[epIndex - 1];
  const nextEp = episodes[epIndex + 1];

  const borderClass = isLight ? 'border-gray-200' : 'border-white/10';
  const textClass = isLight ? 'text-gray-600' : 'text-white/40';
  const monoStyle = { fontFamily: 'var(--font-geist-mono)' };

  if (isLoading && seasons.length === 0) return (
    <div className="flex h-64 items-center justify-center">
      <div className="h-8 w-8 border-2 border-[#FF006F] border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="space-y-4 py-4">
      {/* ── Controls ── */}
      <div className="flex flex-wrap items-center gap-2 px-2">
        {/* Season */}
        <div className="relative">
          <button onClick={() => setSeasonOpen(!seasonOpen)}
            className={`flex items-center gap-2 border px-3 py-2 text-[0.65rem] tracking-widest transition-colors ${borderClass} hover:border-[#00D4FF]/50`}
            style={monoStyle}>
            <span style={{ color: '#00D4FF' }}>S:</span>
            <span className={textClass}>{season.padStart(2, '0')}</span>
            <ChevronDown size={10} className={`${seasonOpen ? 'rotate-180' : ''} transition-transform ${textClass}`} />
          </button>
          {seasonOpen && (
            <div className={`absolute top-full left-0 z-50 mt-1 max-h-48 overflow-y-auto border shadow-xl w-36 ${
              isLight ? 'border-gray-200 bg-white' : 'border-white/10 bg-[#080B14]'
            }`}>
              {seasons.map(s => (
                <button key={s.season_number}
                  onClick={() => { setSeason(s.season_number.toString()); setSeasonOpen(false); }}
                  className={`w-full px-3 py-2 text-left text-[0.65rem] tracking-widest transition-colors ${
                    s.season_number.toString() === season
                      ? 'text-[#00D4FF]'
                      : isLight ? 'text-gray-500 hover:bg-gray-50' : 'text-white/40 hover:bg-white/5'
                  }`}
                  style={monoStyle}>
                  S{String(s.season_number).padStart(2, '0')}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Prev/Next Episode */}
        <button onClick={() => prevEp && setEpisode(prevEp.episode_number.toString())}
          disabled={!prevEp}
          className={`border p-2 disabled:opacity-30 transition-colors ${borderClass} hover:border-[#00D4FF]/40`}>
          <ChevronLeft size={12} className={textClass} />
        </button>

        <div className={`border px-3 py-2 min-w-[72px] text-center text-[0.65rem] tracking-widest ${borderClass}`}
          style={monoStyle}>
          <span style={{ color: '#00D4FF' }}>E:</span>
          <span className={textClass}>{episode.padStart(2, '0')}</span>
        </div>

        <button onClick={() => nextEp && setEpisode(nextEp.episode_number.toString())}
          disabled={!nextEp}
          className={`border p-2 disabled:opacity-30 transition-colors ${borderClass} hover:border-[#00D4FF]/40`}>
          <ChevronRight size={12} className={textClass} />
        </button>

        {/* Server */}
        <div className="relative">
          <button onClick={() => setServerOpen(!serverOpen)}
            className={`flex items-center gap-2 border px-3 py-2 text-[0.65rem] tracking-widest transition-colors ${borderClass} hover:border-[#FF006F]/50`}
            style={monoStyle}>
            <span style={{ color: '#FF006F' }}>SRV:</span>
            <span className={textClass}>{currentServer.label}</span>
            {currentServer.tag && <span className="text-[#F9F002] text-[0.55rem]">[{currentServer.tag}]</span>}
            <ChevronDown size={10} className={`${serverOpen ? 'rotate-180' : ''} transition-transform ${textClass}`} />
          </button>
          {serverOpen && (
            <div className={`absolute top-full left-0 z-50 mt-1 w-52 border shadow-xl ${
              isLight ? 'border-gray-200 bg-white' : 'border-white/10 bg-[#080B14]'
            }`}>
              {SERVERS.map(s => (
                <button key={s.key}
                  onClick={() => { setServer(s.key); setServerOpen(false); }}
                  className={`w-full flex items-center justify-between px-3 py-2 text-[0.65rem] tracking-widest transition-colors ${
                    s.key === server
                      ? 'text-[#FF006F]'
                      : isLight ? 'text-gray-500 hover:bg-gray-50' : 'text-white/40 hover:bg-white/5'
                  }`}
                  style={monoStyle}>
                  <span>{s.label}</span>
                  {s.tag && <span className="text-[#F9F002] text-[0.55rem]">[{s.tag}]</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* AdBlock */}
        <button onClick={() => setAdBlock(!adBlock)}
          className={`flex items-center gap-1.5 border px-3 py-2 text-[0.65rem] tracking-widest transition-all ${
            adBlock
              ? 'border-[#39FF14]/40 text-[#39FF14] bg-[#39FF14]/5'
              : `${borderClass} ${textClass}`
          }`}
          style={monoStyle}>
          {adBlock ? <Shield size={11} /> : <ShieldOff size={11} />}
          {adBlock ? 'ADBLOCK' : 'ADS'}
        </button>

        {/* Download */}
        <Link href={`https://dl.vidsrc.vip/tv/${id}/${season}/${episode}`} target="_blank"
          className={`ml-auto flex items-center gap-1.5 border px-3 py-2 text-[0.65rem] tracking-widest transition-all ${borderClass} ${textClass} hover:border-[#00D4FF]/40 hover:text-[#00D4FF]`}
          style={monoStyle}>
          <Download size={11} />
          DL S{season.padStart(2,'0')}E{episode.padStart(2,'0')}
        </Link>
      </div>

      {/* ── Player ── */}
      <div className={`player-container ${isLight ? 'border border-gray-200' : ''}`}>
        {isLoading ? (
          <div className={`flex h-[520px] items-center justify-center ${isLight ? 'bg-gray-50' : 'bg-[#080B14]'}`}>
            <div className="h-8 w-8 border-2 border-[#FF006F] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : adBlock ? (
          <iframe
            src={getUrl(server)}
            referrerPolicy="origin"
            allowFullScreen
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            width="100%"
            height="520"
            scrolling="no"
            className="block"
            key={`${server}-${season}-${episode}`}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation allow-top-navigation-by-user-activation"
          />
        ) : (
          <iframe
            src={getUrl(server)}
            referrerPolicy="origin"
            allowFullScreen
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            width="100%"
            height="520"
            scrolling="no"
            className="block"
            key={`${server}-${season}-${episode}`}
          />
        )}
      </div>

      {/* ── Episode Grid ── */}
      {episodes.length > 0 && (
        <div className="space-y-2 px-2">
          <span className={`text-[0.6rem] tracking-[0.25em] uppercase ${isLight ? 'text-gray-400' : 'text-white/30'}`}
            style={monoStyle}>
            {'// EPISODE INDEX'} — S{season.padStart(2, '0')}
          </span>
          <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {episodes.map(ep => (
              <button key={ep.episode_number}
                onClick={() => setEpisode(ep.episode_number.toString())}
                className={`group flex flex-col items-start border p-2 text-left transition-all ${
                  ep.episode_number.toString() === episode
                    ? 'border-[#FF006F]/50 bg-[#FF006F]/7'
                    : isLight
                      ? 'border-gray-200 hover:border-gray-300'
                      : 'border-white/8 hover:border-white/20'
                }`}>
                <span className={`text-[0.6rem] tracking-widest ${
                  ep.episode_number.toString() === episode ? 'text-[#FF006F]' : textClass
                }`} style={monoStyle}>
                  E{String(ep.episode_number).padStart(2, '0')}
                </span>
                <span className={`text-xs truncate w-full mt-0.5 ${isLight ? 'text-gray-600' : 'text-white/60'}`}
                  style={{ fontFamily: 'var(--font-geist-sans)' }}>
                  {ep.name || `Episode ${ep.episode_number}`}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
