/* eslint-disable prettier/prettier */
'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Send, Hash, Users, MessageSquare } from 'lucide-react';
import { useAuth } from '@/lib/firebase/auth-context';

const CHANNELS = ['general', 'movies', 'anime', 'tv-shows', 'manga'];

const userColor = (name = '') => {
  const palette = ['#f472b6','#818cf8','#34d399','#fb923c','#a78bfa','#60a5fa','#f87171','#4ade80'];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) % palette.length;
  return palette[h];
};

const fmt = (ts: string) => {
  try { return new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }); }
  catch { return ''; }
};

interface Message {
  id: string;
  user_id: string;
  channel: string;
  content: string;
  created_at: string;
  username?: string;
  avatar_url?: string | null;
  _optimistic?: boolean;
}

// Cosmic dark theme constants
const BG     = '#000';
const CARD   = '#0a0a0a';
const BORDER = 'rgba(255,255,255,0.08)';
const MUTED  = 'rgba(255,255,255,0.3)';
const NORMAL = 'rgba(255,255,255,0.7)';

export default function CommunityChat() {
  const { user } = useAuth();
  const [channel,    setChannel]    = useState('general');
  const [messages,   setMessages]   = useState<Message[]>([]);
  const [input,      setInput]      = useState('');
  const [loading,    setLoading]    = useState(true);
  const [sending,    setSending]    = useState(false);
  const [online,     setOnline]     = useState(0);
  const [error,      setError]      = useState<string | null>(null);
  const [configured, setConfigured] = useState(false);
  const bottomRef  = useRef<HTMLDivElement>(null);
  const channelRef = useRef(channel);
  channelRef.current = channel;

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const loadMessages = useCallback(async (ch: string) => {
    setLoading(true); setError(null);
    try {
      const { supabase, supabaseConfigured } = await import('@/lib/supabase');
      if (!supabaseConfigured) { setConfigured(false); setMessages([]); setLoading(false); return; }
      setConfigured(true);
      const { data, error: err } = await supabase
        .from('community_chat')
        .select('id, user_id, channel, content, created_at, username, avatar_url')
        .eq('channel', ch).order('created_at', { ascending: true }).limit(100);
      if (err) throw err;
      setMessages((data || []) as Message[]);
    } catch (e: any) { setError(e.message); setMessages([]);
    } finally { setLoading(false); }
  }, []);

  // Realtime subscription
  useEffect(() => {
    loadMessages(channel);
    let sub: any;
    import('@/lib/supabase').then(({ supabase, supabaseConfigured }) => {
      if (!supabaseConfigured) return;
      sub = supabase
        .channel(`chat_${channel}_${Math.random().toString(36).slice(2, 6)}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'community_chat', filter: `channel=eq.${channel}` },
          (payload: any) => {
            setMessages(prev => prev.some(m => m.id === payload.new.id) ? prev : [...prev, payload.new as Message]);
          })
        .subscribe();
    });
    return () => { import('@/lib/supabase').then(({ supabase }) => { if (sub) supabase.removeChannel(sub); }); };
  }, [channel, loadMessages]);

  // Presence — fix: chain .on() before .subscribe()
  useEffect(() => {
    let ch: any;
    import('@/lib/supabase').then(({ supabase, supabaseConfigured }) => {
      if (!supabaseConfigured) return;
      const uid = `u_${user?.uid || Math.random().toString(36).slice(2, 8)}`;
      ch = supabase
        .channel('community_presence_v3', { config: { presence: { key: uid } } })
        .on('presence', { event: 'sync' }, () => {
          setOnline(Object.keys(ch.presenceState()).length);
        });
      ch.subscribe(async (s: string) => {
        if (s === 'SUBSCRIBED') await ch.track({ uid, at: Date.now() });
      });
    });
    return () => { import('@/lib/supabase').then(({ supabase }) => { if (ch) supabase.removeChannel(ch); }); };
  }, [user?.uid]);

  const send = async () => {
    const text = input.trim();
    if (!text || !user || sending) return;
    setSending(true); setInput('');
    const tempId = `temp_${Date.now()}`;
    const optimistic: Message = {
      id: tempId, user_id: user.uid, channel: channelRef.current, content: text,
      created_at: new Date().toISOString(),
      username: user.displayName || user.email?.split('@')[0] || 'User',
      avatar_url: user.photoURL, _optimistic: true,
    };
    setMessages(prev => [...prev, optimistic]);
    try {
      const { supabase } = await import('@/lib/supabase');
      const { data, error: err } = await supabase.from('community_chat').insert({
        user_id: user.uid, channel: channelRef.current, content: text,
        username: user.displayName || user.email?.split('@')[0] || 'User',
        avatar_url: user.photoURL || null,
      }).select().single();
      if (err) throw err;
      setMessages(prev => prev.map(m => m.id === tempId ? { ...data as Message } : m));
    } catch { setInput(text); setMessages(prev => prev.filter(m => m.id !== tempId));
    } finally { setSending(false); }
  };

  const onKey = (e: React.KeyboardEvent) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } };

  const mono = { fontFamily: 'var(--font-geist-mono)' } as const;
  const sans = { fontFamily: 'var(--font-geist-sans)' } as const;

  return (
    <div className="w-full mt-10 mb-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 px-1">
        <Hash size={15} style={{ color: MUTED }} />
        <h2 className="text-sm font-bold text-white" style={mono}>Community Chat</h2>
        {online > 0 && <span className="text-xs" style={{ ...mono, color: MUTED }}>{online} online</span>}
      </div>

      {/* Chat container — Cosmic style */}
      <div className="flex overflow-hidden" style={{ height: 480, background: BG, border: `1px solid ${BORDER}`, borderRadius: 12 }}>

        {/* Channel sidebar */}
        <div className="w-[140px] shrink-0 flex flex-col" style={{ borderRight: `1px solid ${BORDER}` }}>
          <div className="px-3 py-3" style={{ borderBottom: `1px solid ${BORDER}` }}>
            <p className="text-[0.55rem] tracking-widest uppercase" style={{ ...mono, color: MUTED }}>Channels</p>
          </div>
          <div className="flex-1 overflow-y-auto py-2 px-2 flex flex-col gap-0.5">
            {CHANNELS.map(ch => (
              <button key={ch} onClick={() => setChannel(ch)}
                className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md text-left transition-all"
                style={{
                  background: channel === ch ? 'rgba(255,255,255,0.06)' : 'transparent',
                  color: channel === ch ? '#fff' : MUTED,
                }}>
                <Hash size={11} className="shrink-0" />
                <span className="text-xs truncate" style={mono}>{ch}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Main */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Channel header */}
          <div className="flex items-center gap-2 px-4 py-2.5 shrink-0" style={{ borderBottom: `1px solid ${BORDER}` }}>
            <Hash size={13} style={{ color: MUTED }} />
            <span className="text-sm font-semibold text-white" style={mono}>{channel}</span>
            <div className="ml-auto flex items-center gap-1.5" style={{ color: MUTED }}>
              <Users size={13} />
              <span className="text-xs" style={mono}>{online}</span>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
            {!configured ? (
              <div className="flex flex-col items-center justify-center h-full text-center gap-3">
                <MessageSquare size={28} style={{ color: MUTED, opacity: 0.4 }} />
                <p className="text-xs" style={{ ...mono, color: MUTED }}>Community chat requires Supabase</p>
                <p className="text-[0.6rem] max-w-[200px]" style={{ ...mono, color: MUTED, opacity: 0.6 }}>
                  Add NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY to .env.local
                </p>
              </div>
            ) : loading ? (
              <div className="flex items-center justify-center h-full">
                <div className="h-5 w-5 border-2 border-t-white/50 rounded-full animate-spin" style={{ borderColor: BORDER, borderTopColor: 'rgba(255,255,255,0.5)' }} />
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-full gap-3">
                <p className="text-xs" style={{ ...mono, color: MUTED }}>Failed to load</p>
                <button onClick={() => loadMessages(channel)} className="text-[0.65rem] underline transition-colors hover:text-white" style={{ ...mono, color: MUTED }}>Retry</button>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <Hash size={24} style={{ color: MUTED, opacity: 0.2, marginBottom: 8 }} />
                <p className="text-xs" style={{ ...mono, color: MUTED }}>No messages in #{channel}</p>
                {!user && <p className="text-[0.6rem] mt-1" style={{ ...mono, color: MUTED, opacity: 0.6 }}>Sign in to chat</p>}
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {messages.map(msg => {
                  const name  = msg.username || 'Anonymous';
                  const color = userColor(name);
                  const isMe  = msg.user_id === user?.uid;
                  return (
                    <motion.div key={msg.id}
                      initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.1 }}
                      className="flex items-start gap-2.5"
                      style={{ opacity: msg._optimistic ? 0.6 : 1 }}>
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 mt-0.5 overflow-hidden"
                        style={{ background: color + '25', color: '#fff', border: `1px solid ${color}40` }}>
                        {msg.avatar_url
                          // eslint-disable-next-line @next/next/no-img-element
                          ? <img src={msg.avatar_url} alt="" className="w-full h-full object-cover" />
                          : name[0]?.toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-baseline gap-2 mb-0.5">
                          <span className="text-xs font-semibold" style={{ ...mono, color: isMe ? '#fff' : color }}>{name}</span>
                          <span className="text-[0.55rem]" style={{ ...mono, color: MUTED }}>{fmt(msg.created_at)}</span>
                        </div>
                        <p className="text-sm leading-relaxed break-words" style={{ ...sans, color: NORMAL }}>{msg.content}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="px-3 py-3 shrink-0" style={{ borderTop: `1px solid ${BORDER}` }}>
            {user ? (
              <div className="flex items-center gap-2 rounded-lg px-3 py-2"
                style={{ background: CARD, border: `1px solid ${BORDER}` }}>
                <input type="text" placeholder={`Message #${channel}`} value={input}
                  onChange={e => setInput(e.target.value)} onKeyDown={onKey}
                  className="flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/20"
                  style={sans} />
                <button onClick={send} disabled={!input.trim() || sending}
                  className="transition-colors disabled:opacity-20 shrink-0"
                  style={{ color: input.trim() && !sending ? 'rgba(255,255,255,0.7)' : MUTED }}>
                  {sending
                    ? <div className="h-4 w-4 border-2 rounded-full animate-spin" style={{ borderColor: BORDER, borderTopColor: 'rgba(255,255,255,0.5)' }} />
                    : <Send size={15} />}
                </button>
              </div>
            ) : (
              <p className="text-center text-xs py-1" style={{ ...mono, color: MUTED }}>Sign in to chat</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
