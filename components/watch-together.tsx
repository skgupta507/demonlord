/* eslint-disable prettier/prettier */
'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Users, LogOut, Send, Crown, X, Link2, Smile, Check, Play, Pause, SkipForward } from 'lucide-react';
import { useAuth } from '@/lib/firebase/auth-context';

const EMOJIS = ['😂','😭','🔥','💀','👀','🤯','😍','🥺','💯','👏','🎉','😤','🤔','😎','🥹','❤️','✨','🫡'];

// Fun anonymous names for guests
const GUEST_NAMES = [
  'CrypticFox','NeonWolf','ShadowByte','PixelDrake','VoidRaven',
  'GlitchOwl','NightHawk','CyberLynx','StormCrow','IronFalcon',
  'DarkMatter','StarDust','CosmicRay','NebulaCat','GalaxyCat',
  'PhantomAce','SilentBolt','EchoFlame','FrostByte','LunarEdge',
];

function getGuestName(): string {
  const stored = typeof window !== 'undefined' ? sessionStorage.getItem('wt_guest_name') : null;
  if (stored) return stored;
  const name = GUEST_NAMES[Math.floor(Math.random() * GUEST_NAMES.length)] + Math.floor(Math.random() * 99 + 1);
  if (typeof window !== 'undefined') sessionStorage.setItem('wt_guest_name', name);
  return name;
}

function genCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

const userColor = (name = '') => {
  const palette = ['#f472b6','#818cf8','#34d399','#fb923c','#a78bfa','#60a5fa','#f87171','#4ade80'];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % palette.length;
  return palette[h];
};

interface Member { uid: string; name: string; avatar?: string | null; is_host: boolean; }
interface ChatMsg { id: string; uid: string; name: string; avatar?: string | null; text: string; ts: number; }

// Sync payload — for iframe-based players we sync server selection + seek time
interface SyncPayload {
  paused: boolean;
  ts: number;       // unix ms when this was sent (for drift correction)
  server?: string;  // optional: tell guests to switch server
}

interface Props {
  /** Called when host sends a sync event — guests use this to seek/pause their player */
  onSync?: (payload: SyncPayload) => void;
  /** Called by host to broadcast current state */
  getSyncState?: () => SyncPayload;
}

export default function WatchTogether({ onSync, getSyncState }: Props) {
  const { user } = useAuth();
  const [open,      setOpen]      = useState(false);
  const [inRoom,    setInRoom]    = useState(false);
  const [roomCode,  setRoomCode]  = useState('');
  const [isHost,    setIsHost]    = useState(false);
  const [members,   setMembers]   = useState<Member[]>([]);
  const [chat,      setChat]      = useState<ChatMsg[]>([]);
  const [joinInput, setJoinInput] = useState('');
  const [msg,       setMsg]       = useState('');
  const [copied,    setCopied]    = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [tab,       setTab]       = useState<'chat' | 'members'>('chat');
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing'>('idle');
  const bottomRef  = useRef<HTMLDivElement>(null);
  const channelRef = useRef<any>(null);
  const myUidRef   = useRef<string>('');

  // Stable identity — persists for session
  const myName   = user?.displayName || user?.email?.split('@')[0] || getGuestName();
  const myAvatar = user?.photoURL || null;
  const myUid    = user?.uid || (() => {
    if (!myUidRef.current) {
      myUidRef.current = typeof window !== 'undefined'
        ? (sessionStorage.getItem('wt_uid') || (() => {
            const id = `g_${Math.random().toString(36).slice(2, 10)}`;
            sessionStorage.setItem('wt_uid', id);
            return id;
          })())
        : `g_${Math.random().toString(36).slice(2, 10)}`;
    }
    return myUidRef.current;
  })();

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [chat]);

  const joinChannel = useCallback(async (code: string, host: boolean) => {
    const { supabase, supabaseConfigured } = await import('@/lib/supabase');

    if (!supabaseConfigured) {
      setRoomCode(code); setIsHost(host); setInRoom(true);
      setMembers([{ uid: myUid, name: myName, avatar: myAvatar, is_host: host }]);
      return;
    }

    const ch = supabase
      .channel(`wt_${code}`, { config: { presence: { key: myUid } } })
      .on('presence', { event: 'sync' }, () => {
        const state = ch.presenceState<{ name: string; avatar: string | null; is_host: boolean }>();
        setMembers(Object.entries(state).map(([uid, arr]) => ({
          uid,
          name: (arr as any)[0]?.name || 'Viewer',
          avatar: (arr as any)[0]?.avatar || null,
          is_host: (arr as any)[0]?.is_host || false,
        })));
      })
      .on('broadcast', { event: 'chat' }, ({ payload }: any) => {
        setChat(prev => [...prev, payload as ChatMsg]);
      })
      .on('broadcast', { event: 'sync' }, ({ payload }: any) => {
        // Only guests receive sync events
        if (!host && onSync) {
          setSyncStatus('syncing');
          onSync(payload as SyncPayload);
          setTimeout(() => setSyncStatus('idle'), 1000);
        }
      });

    ch.subscribe(async (status: string) => {
      if (status === 'SUBSCRIBED') {
        await ch.track({ name: myName, avatar: myAvatar, is_host: host });
        // If joining as guest, request current state from host
        if (!host) {
          await ch.send({ type: 'broadcast', event: 'request_sync', payload: { uid: myUid } });
        }
      }
    });

    channelRef.current = ch;
    setRoomCode(code); setIsHost(host); setInRoom(true);
  }, [myUid, myName, myAvatar, onSync]);

  // Host: respond to sync requests and broadcast periodically
  useEffect(() => {
    if (!isHost || !channelRef.current) return;

    // Respond to guest sync requests immediately
    const ch = channelRef.current;
    ch.on('broadcast', { event: 'request_sync' }, async () => {
      if (!getSyncState) return;
      const state = getSyncState();
      await ch.send({ type: 'broadcast', event: 'sync', payload: state });
    });

    // Periodic sync every 3s
    const t = setInterval(async () => {
      if (!channelRef.current || !getSyncState) return;
      const state = getSyncState();
      await channelRef.current.send({ type: 'broadcast', event: 'sync', payload: state });
    }, 3000);

    return () => clearInterval(t);
  }, [isHost, getSyncState]);

  const broadcastSync = useCallback(async () => {
    if (!isHost || !channelRef.current || !getSyncState) return;
    const state = getSyncState();
    await channelRef.current.send({ type: 'broadcast', event: 'sync', payload: state });
  }, [isHost, getSyncState]);

  const leaveRoom = async () => {
    if (channelRef.current) {
      const { supabase } = await import('@/lib/supabase');
      await channelRef.current.untrack().catch(() => {});
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    setInRoom(false); setRoomCode(''); setMembers([]); setChat([]); setIsHost(false); setOpen(false);
  };

  const sendChat = async () => {
    if (!msg.trim()) return;
    const payload: ChatMsg = { id: `${Date.now()}_${myUid}`, uid: myUid, name: myName, avatar: myAvatar, text: msg.trim(), ts: Date.now() };
    setChat(prev => [...prev, payload]);
    setMsg(''); setShowEmoji(false);
    if (channelRef.current) await channelRef.current.send({ type: 'broadcast', event: 'chat', payload });
  };

  const copy = async () => {
    const url = `${window.location.origin}${window.location.pathname}?room=${roomCode}`;
    await navigator.clipboard.writeText(url);
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };

  const onKey = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(); } };

  // Cosmic dark theme colors
  const bg      = '#0a0a0a';
  const border  = 'rgba(255,255,255,0.1)';
  const mutedTx = 'rgba(255,255,255,0.35)';
  const normalTx= 'rgba(255,255,255,0.7)';
  const mono    = { fontFamily: 'var(--font-geist-mono)' } as const;
  const sans    = { fontFamily: 'var(--font-geist-sans)' } as const;

  return (
    <>
      {/* Floating trigger */}
      <button
        onClick={() => setOpen(v => !v)}
        className="fixed bottom-20 right-4 z-[9990] flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all"
        style={{
          ...mono,
          background: inRoom ? 'rgba(99,102,241,0.2)' : 'rgba(255,255,255,0.07)',
          border: inRoom ? '1px solid rgba(99,102,241,0.5)' : `1px solid ${border}`,
          color: inRoom ? '#a5b4fc' : normalTx,
          backdropFilter: 'blur(12px)',
        }}>
        <Users size={14} />
        {inRoom ? `Room ${roomCode}` : 'Watch Together'}
        {inRoom && members.length > 0 && (
          <span className="h-4 w-4 rounded-full text-white text-[9px] flex items-center justify-center font-bold"
            style={{ background: '#6366f1' }}>
            {members.length}
          </span>
        )}
        {syncStatus === 'syncing' && (
          <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ background: '#4ade80' }} />
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="fixed bottom-36 right-4 z-[9990] flex flex-col"
            style={{ width: 'min(92vw, 320px)', height: 480, background: bg, border: `1px solid ${border}`, borderRadius: 16, boxShadow: '0 24px 60px rgba(0,0,0,0.8)', overflow: 'hidden' }}>

            {!inRoom ? (
              /* Setup screen */
              <div className="flex flex-col gap-4 p-5 h-full justify-center">
                <div className="text-center mb-2">
                  <Users size={28} style={{ color: mutedTx }} className="mx-auto mb-2" />
                  <h3 className="font-bold text-base text-white" style={mono}>Watch Together</h3>
                  <p className="text-xs mt-1" style={{ ...sans, color: mutedTx }}>Sync playback with friends in real-time</p>
                </div>
                <button onClick={() => { const c = genCode(); joinChannel(c, true); }}
                  className="w-full py-2.5 rounded-xl font-semibold text-sm transition-all"
                  style={{ ...mono, background: '#fff', color: '#000' }}>
                  Create Room
                </button>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px" style={{ background: border }} />
                  <span className="text-[0.6rem]" style={{ ...mono, color: mutedTx }}>or join</span>
                  <div className="flex-1 h-px" style={{ background: border }} />
                </div>
                <div className="flex gap-2">
                  <input value={joinInput} onChange={e => setJoinInput(e.target.value.toUpperCase())}
                    onKeyDown={e => e.key === 'Enter' && joinInput.trim() && joinChannel(joinInput.trim(), false)}
                    placeholder="Room code"
                    className="flex-1 px-3 py-2.5 rounded-xl text-sm text-white outline-none placeholder:text-white/20"
                    style={{ ...mono, background: 'rgba(255,255,255,0.05)', border: `1px solid ${border}` }} />
                  <button onClick={() => joinInput.trim() && joinChannel(joinInput.trim(), false)} disabled={!joinInput.trim()}
                    className="px-4 py-2.5 rounded-xl text-sm transition-all disabled:opacity-30"
                    style={{ ...mono, background: 'rgba(255,255,255,0.08)', border: `1px solid ${border}`, color: '#fff' }}>
                    Join
                  </button>
                </div>
                <p className="text-center text-[0.55rem]" style={{ ...mono, color: mutedTx }}>
                  You&apos;ll join as <span style={{ color: 'rgba(255,255,255,0.6)' }}>{myName}</span>
                </p>
              </div>
            ) : (
              /* Room screen */
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 shrink-0" style={{ borderBottom: `1px solid ${border}` }}>
                  <div className="flex items-center gap-2">
                    {isHost && <Crown size={13} className="text-yellow-400" />}
                    <span className="font-bold text-sm text-white" style={mono}>{roomCode}</span>
                    <span className="text-[0.6rem]" style={{ ...mono, color: mutedTx }}>{members.length} watching</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {/* Host sync button */}
                    {isHost && getSyncState && (
                      <button onClick={broadcastSync} title="Sync now"
                        className="h-7 w-7 flex items-center justify-center rounded-lg transition-all"
                        style={{ background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', color: '#4ade80' }}>
                        <SkipForward size={12} />
                      </button>
                    )}
                    <button onClick={copy} title="Copy invite link"
                      className="h-7 w-7 flex items-center justify-center rounded-lg transition-all"
                      style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${border}`, color: copied ? '#4ade80' : mutedTx }}>
                      {copied ? <Check size={13} /> : <Link2 size={13} />}
                    </button>
                    <button onClick={leaveRoom} title="Leave"
                      className="h-7 w-7 flex items-center justify-center rounded-lg transition-all"
                      style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', color: '#fca5a5' }}>
                      <LogOut size={13} />
                    </button>
                    <button onClick={() => setOpen(false)}
                      className="h-7 w-7 flex items-center justify-center rounded-lg transition-all"
                      style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${border}`, color: mutedTx }}>
                      <X size={13} />
                    </button>
                  </div>
                </div>

                {/* Host notice */}
                {isHost && (
                  <div className="px-4 py-2 shrink-0 text-[0.6rem]" style={{ ...mono, color: '#4ade80', background: 'rgba(74,222,128,0.05)', borderBottom: `1px solid ${border}` }}>
                    👑 You are the host — your player controls sync to all guests
                  </div>
                )}
                {!isHost && (
                  <div className="px-4 py-2 shrink-0 text-[0.6rem]" style={{ ...mono, color: mutedTx, background: 'rgba(255,255,255,0.02)', borderBottom: `1px solid ${border}` }}>
                    Synced to host · {syncStatus === 'syncing' ? '⟳ syncing...' : '● live'}
                  </div>
                )}

                {/* Tabs */}
                <div className="flex shrink-0" style={{ borderBottom: `1px solid ${border}` }}>
                  {(['chat', 'members'] as const).map(t => (
                    <button key={t} onClick={() => setTab(t)}
                      className="flex-1 py-2 text-xs capitalize transition-all"
                      style={{ ...mono, color: tab === t ? '#fff' : mutedTx, borderBottom: tab === t ? '1px solid #fff' : '1px solid transparent', fontWeight: tab === t ? 600 : 400 }}>
                      {t === 'members' ? `Members (${members.length})` : 'Chat'}
                    </button>
                  ))}
                </div>

                {/* Members */}
                {tab === 'members' && (
                  <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
                    {members.map(m => (
                      <div key={m.uid} className="flex items-center gap-2.5 p-2.5 rounded-xl"
                        style={{ background: 'rgba(255,255,255,0.03)', border: `1px solid ${border}` }}>
                        <div className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden"
                          style={{ background: userColor(m.name) + '30', color: '#fff', border: `1px solid ${userColor(m.name)}40` }}>
                          {m.avatar
                            // eslint-disable-next-line @next/next/no-img-element
                            ? <img src={m.avatar} alt="" className="w-full h-full object-cover" />
                            : m.name[0]?.toUpperCase()}
                        </div>
                        <span className="text-sm text-white flex-1 truncate" style={sans}>{m.name}</span>
                        {m.is_host && <Crown size={13} className="text-yellow-400 shrink-0" />}
                      </div>
                    ))}
                    {members.length === 0 && (
                      <p className="text-xs text-center py-8" style={{ ...mono, color: mutedTx }}>Waiting for others...</p>
                    )}
                  </div>
                )}

                {/* Chat */}
                {tab === 'chat' && (
                  <>
                    <div className="flex-1 overflow-y-auto px-3 py-2 flex flex-col gap-2">
                      {chat.length === 0 && (
                        <p className="text-xs text-center py-8" style={{ ...mono, color: mutedTx }}>No messages yet</p>
                      )}
                      {chat.map(m => (
                        <div key={m.id} className="flex items-start gap-2">
                          <div className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 overflow-hidden"
                            style={{ background: userColor(m.name) + '30', color: '#fff', border: `1px solid ${userColor(m.name)}40` }}>
                            {m.avatar
                              // eslint-disable-next-line @next/next/no-img-element
                              ? <img src={m.avatar} alt="" className="w-full h-full object-cover" />
                              : m.name[0]?.toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[0.6rem]" style={{ ...mono, color: userColor(m.name) }}>{m.name}</span>
                            <p className="text-sm leading-relaxed break-words" style={{ ...sans, color: 'rgba(255,255,255,0.8)' }}>{m.text}</p>
                          </div>
                        </div>
                      ))}
                      <div ref={bottomRef} />
                    </div>

                    <AnimatePresence>
                      {showEmoji && (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                          className="flex flex-wrap gap-1 px-3 py-2 shrink-0" style={{ borderTop: `1px solid ${border}` }}>
                          {EMOJIS.map(e => (
                            <button key={e} onClick={() => setMsg(v => v + e)} className="text-base hover:scale-125 transition-transform">{e}</button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="px-3 py-2.5 shrink-0 flex items-center gap-2" style={{ borderTop: `1px solid ${border}` }}>
                      <button onClick={() => setShowEmoji(v => !v)} style={{ color: mutedTx }} className="hover:text-white transition-colors shrink-0">
                        <Smile size={15} />
                      </button>
                      <input value={msg} onChange={e => setMsg(e.target.value)} onKeyDown={onKey}
                        placeholder="Say something..."
                        className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/20"
                        style={sans} />
                      <button onClick={sendChat} disabled={!msg.trim()}
                        className="transition-colors disabled:opacity-20 shrink-0"
                        style={{ color: msg.trim() ? '#fff' : mutedTx }}>
                        <Send size={15} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
