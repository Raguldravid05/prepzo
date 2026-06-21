import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import { Sparkles } from 'lucide-react';

export default function ChatWindow({ messages, isLoading, onRegenerate, activeMode }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const getLastUserMsgText = () => {
    const userMsgs = messages.filter(m => m.role === 'user');
    return userMsgs.length > 0 ? userMsgs[userMsgs.length - 1].content : '';
  };

  return (
    <div className="flex-1 overflow-y-auto px-[16px] md:px-[32px] py-[24px]">
      {messages.length === 0 ? (
        /* Empty State — centered both axes */
        <div className="h-full flex flex-col items-center justify-center text-center px-[16px] max-w-[480px] mx-auto">
          <div className="w-[56px] h-[56px] rounded-[16px] bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center text-[#10B981] mb-[16px]">
            <Sparkles size={28} />
          </div>
          <h2 className="text-[22px] font-display font-bold text-white mb-[8px]">
            Welcome to Prepzo AI
          </h2>
          <p className="text-[#94A3B8] text-[14px] leading-[22px] max-w-[380px]">
            Your personal engineering tutor. Upload study materials, select an answer format mode, and ask questions to begin studying!
          </p>
        </div>
      ) : (
        /* Messages list */
        <div className="max-w-[720px] mx-auto">
          {messages.map((msg, idx) => {
            const isLastAssistant = msg.role === 'assistant' && idx === messages.length - 1;
            return (
              <MessageBubble 
                key={msg.id || idx} 
                message={msg} 
                userQueryText={getLastUserMsgText()}
                onRegenerate={isLastAssistant && !isLoading ? onRegenerate : undefined}
              />
            );
          })}

          {/* Typing indicator */}
          {isLoading && (
            <div className="flex justify-start py-[8px]">
              <div className="flex items-start gap-[12px]">
                <div className="w-[32px] h-[32px] rounded-full bg-[#10B981]/12 border border-[#10B981]/25 flex items-center justify-center shrink-0">
                  <Sparkles size={14} className="text-[#10B981] animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-[8px] mb-[8px]">
                    <span className="text-[13px] font-semibold text-[#10B981]">Prepzo AI</span>
                  </div>
                  <div className="flex items-center gap-[6px] py-[4px]">
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                    <span className="typing-dot" />
                  </div>
                  <span className="text-[11px] text-[#64748B] animate-pulse mt-[4px] block">
                    Generating your {activeMode || 'normal'} answer...
                  </span>
                </div>
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      )}
    </div>
  );
}
