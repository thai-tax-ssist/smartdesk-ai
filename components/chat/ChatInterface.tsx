'use client';
import { useState, useEffect, useRef } from 'react';
import { Message, Conversation } from '@/types';
import { MessageBubble } from './MessageBubble';
import { InterviewProgress } from './InterviewProgress';
import { Button } from '@/components/ui/Button';
import { useRouter } from 'next/navigation';

interface ChatInterfaceProps {
  conversationId?: string;
  initialMessages?: Message[];
  plan: string;
  queriesUsed: number;
  queriesLimit: number;
}

export function ChatInterface({ conversationId, initialMessages = [], plan, queriesUsed, queriesLimit }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [convId, setConvId] = useState(conversationId);
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const atLimit = queriesLimit !== -1 && queriesUsed >= queriesLimit;

  async function sendMessage() {
    if (!input.trim() || loading || atLimit) return;
    if (atLimit) { setShowUpgrade(true); return; }

    const userMsg: Omit<Message, 'id' | 'created_at'> = {
      conversation_id: convId || '',
      role: 'user',
      content: input.trim(),
      message_type: 'chat',
    };

    const optimistic: Message = { ...userMsg, id: `tmp-${Date.now()}`, created_at: new Date().toISOString() };
    setMessages(prev => [...prev, optimistic]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: userMsg.content, conversationId: convId, messages }),
      });
      const data = await res.json();

      if (res.status === 429) { setShowUpgrade(true); setLoading(false); return; }
      if (!res.ok) throw new Error(data.error || 'Failed');

      if (data.conversationId && !convId) {
        setConvId(data.conversationId);
        router.replace(`/chat/${data.conversationId}`);
      }

      const aiMsg: Message = {
        id: data.id || `ai-${Date.now()}`,
        conversation_id: data.conversationId || convId || '',
        role: 'assistant',
        content: data.content,
        message_type: data.message_type || 'chat',
        created_at: new Date().toISOString(),
      };

      setMessages(prev => [...prev.filter(m => m.id !== optimistic.id), { ...optimistic, id: data.userMessageId || optimistic.id }, aiMsg]);
      if (data.message_type === 'interview_question') setQuestionCount(q => q + 1);
    } catch {
      setMessages(prev => prev.filter(m => m.id !== optimistic.id));
      setMessages(prev => [...prev, { id: `err-${Date.now()}`, conversation_id: convId || '', role: 'assistant', content: 'Something went wrong. Please try again in a moment.', message_type: 'chat', created_at: new Date().toISOString() }]);
    } finally {
      setLoading(false);
    }
  }

  const interviewMessages = messages.filter(m => m.message_type === 'interview_question');
  const inInterview = messages.length > 0 && !messages.some(m => m.message_type === 'final_answer');

  return (
    <div className="flex flex-col h-full">
      {/* Trust bar */}
      <div className="px-4 py-2 border-b border-slate-800 flex items-center justify-between">
        <p className="text-xs text-slate-500">🔒 Your answers help us help you — not to judge you</p>
        {inInterview && interviewMessages.length > 0 && (
          <InterviewProgress current={interviewMessages.length} total={5} />
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 py-16">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500/20 to-violet-500/20 border border-indigo-500/20 flex items-center justify-center text-3xl">
              🎯
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">Ask SmartDesk anything</h3>
              <p className="text-slate-400 text-sm max-w-sm">
                We'll ask you the right questions first, then give you a precise, tailored answer.
              </p>
            </div>
          </div>
        )}
        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
        {loading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex-shrink-0 flex items-center justify-center text-sm font-bold text-white">S</div>
            <div className="bg-slate-800 rounded-2xl rounded-tl-none px-4 py-3">
              <div className="flex gap-1.5">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Upgrade modal */}
      {showUpgrade && (
        <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-10 p-4">
          <div className="bg-slate-800 border border-slate-700 rounded-2xl p-8 max-w-sm w-full text-center">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-xl font-bold text-white mb-2">Query Limit Reached</h3>
            <p className="text-slate-400 text-sm mb-6">You've used all your queries for this month. Upgrade to continue getting great answers.</p>
            <div className="flex flex-col gap-3">
              <a href="/billing"><Button className="w-full">Upgrade Plan</Button></a>
              <button onClick={() => setShowUpgrade(false)} className="text-sm text-slate-500 hover:text-slate-300">Dismiss</button>
            </div>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-slate-800">
        {atLimit ? (
          <div className="text-center py-3">
            <p className="text-sm text-amber-400 mb-2">You've reached your query limit.</p>
            <a href="/billing"><Button size="sm">Upgrade to continue →</Button></a>
          </div>
        ) : (
          <div className="flex gap-3">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Ask anything..."
              rows={1}
              className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
            <Button onClick={sendMessage} disabled={!input.trim() || loading} loading={loading}>
              Send
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
