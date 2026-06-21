import React, { useState, useRef } from 'react';
import { Send, Paperclip, Mic, Camera } from 'lucide-react';

export default function ChatInput({ onSend, isLoading, showSuggestions, onSuggestionClick }) {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSend(input.trim());
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  };

  const suggestions = [
    { title: "Explain Virtual Memory", desc: "OS memory management", prompt: "Explain the working of Virtual Memory in detail." },
    { title: "TCP/IP Layers (8 Mark)", desc: "Structured network answer", prompt: "Generate an 8-mark answer on the OSI and TCP/IP protocol suite layers." },
    { title: "DBMS Normalization", desc: "1NF, 2NF, 3NF, BCNF", prompt: "Explain all normal forms in DBMS with examples." },
    { title: "CPU Scheduling Notes", desc: "Quick revision material", prompt: "Compile revision notes on key CPU Scheduling algorithms with examples." },
  ];

  return (
    <div className="w-full flex flex-col items-center">
      {/* Suggestion Cards — equal size grid */}
      {showSuggestions && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[12px] max-w-[720px] w-full px-[16px] mb-[24px]">
          {suggestions.map((s) => (
            <div
              key={s.title}
              onClick={() => onSuggestionClick(s.prompt)}
              className="bg-[#111827] hover:bg-[#151f32] border border-[#1E293B] hover:border-[#10B981]/30 p-[16px] rounded-[14px] cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] group text-left min-h-[72px] flex flex-col justify-center"
            >
              <h4 className="text-[13px] font-semibold text-[#E2E8F0] group-hover:text-[#10B981] transition-colors">
                {s.title}
              </h4>
              <p className="text-[11px] text-[#64748B] mt-[4px]">
                {s.desc}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Input Box — ChatGPT-style */}
      <div className="max-w-[720px] w-full px-[16px]">
        <form
          onSubmit={handleSubmit}
          className="relative bg-[#111827] border border-[#1E293B] rounded-[16px] shadow-xl shadow-black/10 focus-within:border-[#334155] transition-colors overflow-hidden"
        >
          {/* Textarea — vertically centered with padding */}
          <div className="px-[16px] pt-[14px] pb-[8px]">
            <textarea
              ref={textareaRef}
              rows={1}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask anything about your study materials..."
              disabled={isLoading}
              className="w-full max-h-[160px] bg-transparent text-[14px] text-white placeholder-[#4B5563] border-0 resize-none focus:outline-none focus:ring-0 leading-[22px]"
              style={{ height: 'auto' }}
            />
          </div>

          {/* Bottom toolbar — vertically centered icons */}
          <div className="flex items-center justify-between px-[12px] pb-[12px]">
            <div className="flex items-center gap-[2px]">
              {[
                { icon: Paperclip, title: 'Attach file' },
                { icon: Mic, title: 'Voice input' },
                { icon: Camera, title: 'Camera' },
              ].map(({ icon: Icon, title }) => (
                <button
                  key={title}
                  type="button"
                  className="w-[36px] h-[36px] rounded-[10px] text-[#64748B] hover:text-[#94A3B8] hover:bg-[#1E293B]/40 flex items-center justify-center transition-colors cursor-pointer"
                  title={title}
                >
                  <Icon size={18} />
                </button>
              ))}
            </div>

            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="w-[40px] h-[40px] rounded-full bg-[#10B981] hover:bg-[#059669] disabled:bg-[#1E293B] text-white disabled:text-[#64748B] transition-all flex items-center justify-center active:scale-95 cursor-pointer shadow-md shadow-emerald-500/10 disabled:shadow-none"
            >
              <Send size={16} />
            </button>
          </div>
        </form>

        <p className="text-[11px] text-[#4B5563] mt-[8px] text-center">
          Prepzo AI can make mistakes. Please verify important information.
        </p>
      </div>
    </div>
  );
}
