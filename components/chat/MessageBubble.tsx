import { Message } from '@/types';
import { formatDate } from '@/lib/utils';

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.role === 'user';

  return (
    <div className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex-shrink-0 flex items-center justify-center text-sm font-bold text-white mt-1">S</div>
      )}
      <div className={`max-w-[75%] group`}>
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
          isUser
            ? 'bg-indigo-600 text-white rounded-tr-none'
            : message.message_type === 'final_answer'
            ? 'bg-slate-700/80 text-slate-100 rounded-tl-none border border-indigo-500/20'
            : 'bg-slate-800 text-slate-200 rounded-tl-none'
        }`}>
          {message.content}
        </div>
        <p className={`text-xs text-slate-600 mt-1 ${isUser ? 'text-right' : ''}`}>
          {formatDate(message.created_at)}
        </p>
      </div>
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-slate-700 flex-shrink-0 flex items-center justify-center text-sm mt-1">👤</div>
      )}
    </div>
  );
}
