'use client';
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/Button';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const STORAGE_KEY = 'smartdesk_support_chat';

export function SupportWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      setMessages(JSON.parse(stored));
    } else {
      const greeting: Message = {
        role: 'assistant',
        content: "Hi there! 👋 I'm Alex, your SmartDesk assistant. How can I help you today? Whether you have questions about pricing, features, or need technical help — I'm here!",
      };
      setMessages([greeting]);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify([greeting]));
    }
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, open]);

  async function sendMessage() {
    if (!input.trim() || loading) return;
    const userMsg: Message = { role: 'user', content: input.trim() };
    const updated = [...messages, userMsg];
    setMessages(updated);
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/support-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated }),
      });
      const data = await res.json();
      const reply: Message = { role: 'assistant', content: data.content || 'Something went wrong. Please try again in a moment.' };
      const final = [...updated, reply];
      setMessages(final);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(final));
    } catch {
      const errMsg: Message = { role: 'assistant', content: 'Something went wrong. Please try again in a moment.' };
      const final = [...updated, errMsg];
      setMessages(final);
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(final));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {open && (
        <div className="w-[380px] max-w-[calc(100vw-2rem)] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl shadow-black/50 flex flex-col overflow-hidden" style={{ height: '480px' }}>
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-600 to-violet-600 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-sm">👋</div>
              <div>
                <p className="text-white font-semibold text-sm">Hi! I'm Alex</p>
                <p className="text-indigo-200 text-xs">SmartDesk Support</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="text-white/70 hover:text-white transition-colors text-lg leading-none">×</button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, i) => (
              <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'assistant' && (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex-shrink-0 flex items-center justify-center text-xs font-bold text-white mt-0.5">A</div>
                )}
                <div className={`max-w-[75%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-slate-800 text-slate-200 rounded-tl-none'
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex gap-2">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex-shrink-0 flex items-center justify-center text-xs font-bold text-white">A</div>
                <div className="bg-slate-800 rounded-xl rounded-tl-none px-3 py-2">
                  <div className="flex gap-1">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="w-1.5 h-1.5 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-slate-800">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder="Type a message..."
                className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              <Button size="sm" onClick={sendMessage} disabled={!input.trim() || loading}>→</Button>
            </div>
            <p className="text-center text-xs text-slate-600 mt-2">Powered by SmartDesk.ai</p>
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen(o => !o)}
        className="relative w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 shadow-lg shadow-indigo-500/30 flex items-center justify-center text-white hover:scale-105 transition-transform"
        title="Need help?"
      >
        {open ? (
          <span className="text-xl">×</span>
        ) : (
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
        )}
        {!open && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900" />
        )}
      </button>
    </div>
  );
}
