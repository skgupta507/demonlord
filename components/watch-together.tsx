/* eslint-disable prettier/prettier */
'use client';
import { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Users, Copy, LogOut, Send, Crown, X, Link2, Smile, Check } from 'lucide-react';
import { useAuth } from '@/lib/firebase/auth-context';

const EMOJIS = ['😂','😭','🔥','💀','👀','🤯','😍','🥺','💯','👏','🎉','😤','🤔','😎','🥹','❤️','✨','🫡'];

function genCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

interface Member {
  uid: string;
  name: string;
  avatar?: string | null;
  is_host: boolean;
}

interface ChatMsg {
  id: string;
  uid: string;
  name: string;
  avatar?: string | null;
  text: string;
  ts: number;
}

interface Props {
  /** Optional: sync playback via this ref */
  playerRef?: React.RefObject<HTMLVideoElement | null>;
}

export default function WatchTogether({ playerRef }: Props) {
  const { user } = useAuth();
  const [open,       setOpen]       = useState(false);
  const [inRoom,     setInRoom]     = useState(false);
  const [roomCode,   setRoomCode]   = useState('');
  const [isHost,     setIsHost]     = useState(false);
  const [members,    setMembers]    = useState<Member[]>([]);
  const [chat,       setChat]       = useState<ChatMsg[]>([]);
  const [joinInput,  setJoinInput]  = useState('');
  const [msg,        setMsg]        = useState('');
  const [copied,     setCopied]     = useState(false);
  const [showEmoji,  setShowEmoji]  = useState(false);
  const [tab,        setTab]        = useState<'chat' | 'members'>('chat');
  const bottomRef = useRef<HTMLDivElement>(null);
  const channelRef = useRef<any>(null);

  const myName   = user?.displayName || user?.email?.split('@')[0] || 'Guest';
  const myAvatar = user?.photoURL || null;
  const myUid    = user?.uid || `guest_${Math.random().toString(36).slice(2, 8)}`;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chat]);

  const joinChannel = async (code: string, host: boolean) => {
    const { supabase, supabaseConfigured } = await import('@/lib/supabase');
    if (!supabaseConfigured) {
      // Offline mode — just show the room UI locally
      setRoomCode(code);
      setIsHost(host);
      setInRoom(true);
      setMembers([{ uid: myUid, name: myName, avatar: myAvatar, is_host: host }]);
      return;
    }

    const ch = supabase.channel(`watch_room_${code}`, {
      config: { presence: { key: myUid } },
    });
    channelRef.current = ch;

    // Presence — member list
    ch.on('presence', { event: 'sync' }, () => {
      const state = ch.presenceState<{ name: string; avatar: string | null; is_host: boolean }>();
      const list: Member[] = Object.entries(state).map(([uid, arr]) => ({
        uid,
        name: (arr as any)[0]?.name || 'Guest',
        avatar: (arr as any)[0]?.avatar || null,
        is_host: (arr as any)[0]?.is_host || false,
      }));
      setMembers(list);
    });

    // Broadcast — chat messages
    ch.on('broadcast', { event: 'chat' }, ({ payload }: any) => {
      setChat(prev => [...prev, payload as ChatMsg]);
    });

    // Broadcast — playback sync (host → guests)
    if (!host && playerRef?.current) {
      ch.on('broadcast', { event: 'sync' }, ({ payload }: any) => {
        const video = playerRef.current;
        if (!video) return;
        if (Math.abs(video.currentTime - payload.time) > 1) video.currentTime = payload.time;
        if (payload.paused) video.pause(); else video.play().catch(() => {});
      });
    }

    await ch.subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await ch.track({ name: myName, avatar: myAvatar, is_host: host });
      }
    });

    setRoomCode(code);
    setIsHost(host);
    setInRoom(true);
  };

  const createRoom = () => {
    const code = genCode();
    joinChannel(code, true);
  };

  const joinRoom = () => {
    if (!joinInput.trim()) return;
    joinChannel(joinInput.trim().toUpperCase(), false);
    setJoinInput('');
  };

  const leaveRoom = async () => {
    if (channelRef.current) {
      const { supabase } = await import('@/lib/supabase');
      await channelRef.current.untrack();
      supabase.removeChannel(channelRef.current);
      channelRef.current = null;
    }
    setInRoom(false);
    setRoomCode('');
    setMembers([]);
    setChat([]);
    setIsHost(false);
    setOpen(false);
  };

  const sendChat = async () => {
    if (!msg.trim()) return;
    const payload: ChatMsg = {
      id: `${Date.now()}_${myUid}`,
      uid: myUid, name: myName, avatar: myAvatar,
      text: msg.trim(), ts: Date.now(),
    };
    setChat(prev => [...prev, payload]);
    setMsg('');
    setShowEmoji(false);
    if (channelRef.current) {
      await channelRef.current.send({ type: 'broadcast', event: 'chat', payload });
    }
  };

  // Host syncs playback every 5s
  useEffect(() => {
    if (!isHost || !playerRef?.current || !channelRef.current) return;
    const t = setInterval(async () => {
      const video = playerRef.current;
      if (!video || !channelRef.current) return;
      await channelRef.current.send({
        type: 'broadcast', event: 'sync',
        payload: { time: video.currentTime, paused: video.paused },
      });
    }, 5000);
    return () => clearInterval(t);
  }, [isHost, playerRef]);

  const copy = async () => {
    const url = `${window.location.origin}${window.location.pathname}?room=${roomCode}`;
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const onKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(); }
  };

  const mono = { fontFamily: 'var(--font-geist-mono)' } as const;
  const sans = { fontFamily: 'var(--font-geist-sans)' } as const;

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setOpen(v => !v)}
        className="fixed bottom-20 right-4 z-[9990] flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all"
        style={{
          ...mono,
          background: inRoom
            ? 'color-mix(in srgb, var(--neon-purple) 20%, transparent)'
            : 'hsl(var(--card))',
          border: inRoom
            ? '1px solid color-mix(in srgb, var(--neon-purple) 50%, transparent)'
            : '1px solid hsl(var(--border))',
          color: inRoom ? 'var(--neon-purple)' : 'hsl(var(--muted-foreground))',
          backdropFilter: 'blur(12px)',
        }}>
        <Users size={14} />
        {inRoom ? `Room ${roomCode}` : 'Watch Together'}
        {inRoom && members.length > 0 && (
          <span className="h-4 w-4 rounded-full text-white text-[9px] flex items-center justify-center font-bold"
            style={{ background: 'var(--neon-purple)' }}>
            {members.length}
          </span>
        )}
      </button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ duration: 0.18 }}
            className="fixed bottom-36 right-4 z-[9990] flex flex-col"
            style={{
              width: 'min(92vw, 320px)',
              height: 460,
              background: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: 16,
              boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
              overflow: 'hidden',
            }}>

            {!inRoom ? (
              /* ── Setup ── */
              <div className="flex flex-col gap-4 p-5 h-full justify-center">
                <div className="text-center mb-2">
                  <Users size={28} className="text-[hsl(var(--muted-foreground))] mx-auto mb-2 opacity-40" />
                  <h3 className="font-bold text-base" style={mono}>Watch Together</h3>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1" style={sans}>
                    Sync playback with friends in real-time
                  </p>
                </div>

                <button onClick={createRoom}
                  className="btn-neon w-full justify-center py-2.5">
                  Create Room
                </button>

                <div className="flex items-center gap-2">
                  <div className="flex-1 h-px bg-[hsl(var(--border))]" />
                  <span className="text-[0.6rem] text-[hsl(var(--muted-foreground))]" style={mono}>or join</span>
                  <div className="flex-1 h-px bg-[hsl(var(--border))]" />
                </div>

                <div className="flex gap-2">
                  <input
                    value={joinInput}
                    onChange={e => setJoinInput(e.target.value.toUpperCase())}
                    onKeyDown={e => e.key === 'Enter' && joinRoom()}
                    placeholder="Room code"
                    className="flex-1 px-3 py-2.5 rounded-lg text-sm outline-none bg-[hsl(var(--background))] border border-[hsl(var(--border))] focus:border-[var(--neon-purple)] transition-colors placeholder:text-[hsl(var(--muted-foreground))]"
                    style={mono}
                  />
                  <button onClick={joinRoom} disabled={!joinInput.trim()}
                    className="btn-outline px-4 py-2.5 disabled:opacity-30">
                    Join
                  </button>
                </div>
              </div>
            ) : (
              /* ── Room ── */
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 shrink-0 border-b border-[hsl(var(--border))]">
                  <div className="flex items-center gap-2">
                    {isHost && <Crown size={13} className="text-yellow-400" />}
                    <span className="font-bold text-sm" style={mono}>{roomCode}</span>
                    <span className="text-[0.6rem] text-[hsl(var(--muted-foreground))]" style={mono}>
                      {members.length} watching
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={copy} title="Copy invite link"
                      className="h-7 w-7 flex items-center justify-center rounded-lg border border-[hsl(var(--border))] transition-all hover:border-[var(--neon-green)]"
                      style={{ color: copied ? 'var(--neon-green)' : 'hsl(var(--muted-foreground))' }}>
                      {copied ? <Check size={13} /> : <Link2 size={13} />}
                    </button>
                    <button onClick={leaveRoom} title="Leave room"
                      className="h-7 w-7 flex items-center justify-center rounded-lg border transition-all hover:border-red-400 hover:text-red-400"
                      style={{ borderColor: 'hsl(var(--border))', color: 'hsl(var(--muted-foreground))' }}>
                      <LogOut size={13} />
                    </button>
                    <button onClick={() => setOpen(false)}
                      className="h-7 w-7 flex items-center justify-center rounded-lg border border-[hsl(var(--border))] transition-all hover:border-[hsl(var(--foreground))]"
                      style={{ color: 'hsl(var(--muted-foreground))' }}>
                      <X size={13} />
                    </button>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex shrink-0 border-b border-[hsl(var(--border))]">
                  {(['chat', 'members'] as const).map(t => (
                    <button key={t} onClick={() => setTab(t)}
                      className="flex-1 py-2 text-xs capitalize transition-all"
                      style={{
                        ...mono,
                        color: tab === t ? 'hsl(var(--foreground))' : 'hsl(var(--muted-foreground))',
                        borderBottom: tab === t ? '1px solid var(--neon-pink)' : '1px solid transparent',
                        fontWeight: tab === t ? 600 : 400,
                      }}>
                      {t === 'members' ? `Members (${members.length})` : 'Chat'}
                    </button>
                  ))}
                </div>

                {/* Members */}
                {tab === 'members' && (
                  <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2">
                    {members.map((m) => (
                      <div key={m.uid} className="flex items-center gap-2.5 p-2.5 rounded-xl border border-[hsl(var(--border))]">
                        <div className="h-7 w-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 overflow-hidden"
                          style={{ background: 'var(--neon-purple)', color: '#fff' }}>
                          {m.avatar
                            // eslint-disable-next-line @next/next/no-img-element
                            ? <img src={m.avatar} alt="" className="w-full h-full object-cover" />
                            : m.name[0]?.toUpperCase()}
                        </div>
                        <span className="text-sm flex-1 truncate" style={sans}>{m.name}</span>
                        {m.is_host && <Crown size={13} className="text-yellow-400 shrink-0" />}
                      </div>
                    ))}
                    {members.length === 0 && (
                      <p className="text-xs text-[hsl(var(--muted-foreground))] text-center py-8" style={mono}>
                        Waiting for others...
                      </p>
                    )}
                  </div>
                )}

                {/* Chat */}
                {tab === 'chat' && (
                  <>
                    <div className="flex-1 overflow-y-auto px-3 py-2 flex flex-col gap-2">
                      {chat.length === 0 && (
                        <p className="text-xs text-[hsl(var(--muted-foreground))] text-center py-8" style={mono}>
                          No messages yet
                        </p>
                      )}
                      {chat.map((m) => (
                        <div key={m.id} className="flex items-start gap-2">
                          <div className="h-6 w-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 overflow-hidden"
                            style={{ background: 'var(--neon-purple)', color: '#fff' }}>
                            {m.avatar
                              // eslint-disable-next-line @next/next/no-img-element
                              ? <img src={m.avatar} alt="" className="w-full h-full object-cover" />
                              : m.name[0]?.toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <span className="text-[0.6rem] text-[hsl(var(--muted-foreground))]" style={mono}>
                              {m.name}
                            </span>
                            <p className="text-sm text-[hsl(var(--foreground))] leading-relaxed break-words" style={sans}>
                              {m.text}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div ref={bottomRef} />
                    </div>

                    {/* Emoji picker */}
                    <AnimatePresence>
                      {showEmoji && (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                          className="flex flex-wrap gap-1 px-3 py-2 shrink-0 border-t border-[hsl(var(--border))]">
                          {EMOJIS.map(e => (
                            <button key={e} onClick={() => setMsg(v => v + e)}
                              className="text-base hover:scale-125 transition-transform">
                              {e}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Input */}
                    <div className="px-3 py-2.5 shrink-0 flex items-center gap-2 border-t border-[hsl(var(--border))]">
                      <button onClick={() => setShowEmoji(v => !v)}
                        className="text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors shrink-0">
                        <Smile size={15} />
                      </button>
                      <input
                        value={msg}
                        onChange={e => setMsg(e.target.value)}
                        onKeyDown={onKey}
                        placeholder="Say something..."
                        className="flex-1 bg-transparent text-sm outline-none placeholder:text-[hsl(var(--muted-foreground))]"
                        style={sans}
                      />
                      <button onClick={sendChat} disabled={!msg.trim()}
                        className="transition-colors disabled:opacity-20 shrink-0"
                        style={{ color: msg.trim() ? 'var(--neon-pink)' : 'hsl(var(--muted-foreground))' }}>
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
