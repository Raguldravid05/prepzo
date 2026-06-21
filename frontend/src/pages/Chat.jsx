import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import ChatWindow from '../components/chat/ChatWindow';
import ChatInput from '../components/chat/ChatInput';
import UploadModal from '../components/upload/UploadModal';
import { useChat } from '../hooks/useChat';
import { UploadCloud, Moon, ChevronDown } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { fetchDocumentsList } from '../services/uploadService';

const MODES = [
  { id: 'normal', label: 'Normal' },
  { id: '2mark', label: '2 Mark Answer' },
  { id: '8mark', label: '8 Mark Answer' },
  { id: '13mark', label: '13 Mark Answer' },
  { id: 'viva', label: 'Viva Questions' },
  { id: 'quiz', label: 'Quiz' },
  { id: 'notes', label: 'Notes' },
];

export default function Chat() {
  const { messages, currentConversation, isLoading, send, regenerate } = useChat();
  const { user } = useAuth();
  const [activeMode, setActiveMode] = useState('13mark');
  const [subjects, setSubjects] = useState(['General']);
  const [selectedSubject, setSelectedSubject] = useState('General');
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [modeDropdownOpen, setModeDropdownOpen] = useState(false);

  const loadSubjects = async () => {
    try {
      const docs = await fetchDocumentsList();
      const list = ['General', ...new Set(docs.map(d => d.subject).filter(s => s && s !== 'General'))];
      setSubjects(list);
      if (currentConversation?.subject && list.includes(currentConversation.subject)) {
        setSelectedSubject(currentConversation.subject);
      }
    } catch (err) {
      console.error('Failed to load subjects:', err);
    }
  };

  useEffect(() => { loadSubjects(); }, [currentConversation]);

  useEffect(() => {
    const handleClickOutside = () => setModeDropdownOpen(false);
    if (modeDropdownOpen) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [modeDropdownOpen]);

  const handleSend = async (text) => {
    try {
      await send(text, activeMode, selectedSubject === 'General' ? null : selectedSubject);
    } catch (err) { console.error(err); }
  };

  const handleRegenerate = async () => {
    try {
      await regenerate(activeMode, selectedSubject === 'General' ? null : selectedSubject);
    } catch (err) { console.error(err); }
  };

  const currentModeLabel = MODES.find(m => m.id === activeMode)?.label || 'Normal';

  return (
    <MainLayout>
      {/* Top Header Bar — fixed 56px height, items-center aligned */}
      <div className="w-full h-[56px] shrink-0 bg-[#0F172A]/90 backdrop-blur-md border-b border-[#1E293B] px-[20px] flex items-center justify-between z-10">
        {/* Left: Mode selector */}
        <div className="flex items-center gap-[12px]">
          <span className="text-[12px] font-medium text-[#64748B] uppercase tracking-[0.06em]">Mode:</span>
          <div className="relative">
            <button
              onClick={(e) => { e.stopPropagation(); setModeDropdownOpen(!modeDropdownOpen); }}
              className="h-[36px] flex items-center gap-[8px] px-[14px] rounded-[10px] bg-[#111827] border border-[#1E293B] hover:border-[#334155] text-[13px] text-white font-medium transition-all cursor-pointer"
            >
              {currentModeLabel}
              <ChevronDown size={14} className={`text-[#64748B] transition-transform ${modeDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {modeDropdownOpen && (
              <div className="absolute top-[calc(100%+6px)] left-0 w-[200px] bg-[#111827] border border-[#1E293B] rounded-[14px] shadow-2xl shadow-black/40 py-[6px] z-50">
                {MODES.map((mode) => (
                  <button
                    key={mode.id}
                    onClick={() => { setActiveMode(mode.id); setModeDropdownOpen(false); }}
                    className={`w-full h-[40px] text-left px-[16px] text-[13px] transition-colors cursor-pointer flex items-center ${
                      activeMode === mode.id
                        ? 'text-[#10B981] bg-[#10B981]/8'
                        : 'text-[#E2E8F0] hover:bg-[#1E293B]/40'
                    }`}
                  >
                    {mode.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Upload, theme, avatar — consistent 8px gaps */}
        <div className="flex items-center gap-[8px]">
          <button
            onClick={() => setUploadModalOpen(true)}
            className="h-[36px] flex items-center gap-[8px] px-[14px] rounded-[10px] bg-[#111827] border border-[#1E293B] hover:border-[#334155] text-[13px] text-[#94A3B8] hover:text-white font-medium transition-all cursor-pointer"
          >
            <UploadCloud size={15} />
            Upload
          </button>

          <button className="w-[36px] h-[36px] rounded-[10px] bg-[#111827] border border-[#1E293B] hover:border-[#334155] text-[#64748B] hover:text-white flex items-center justify-center transition-all cursor-pointer">
            <Moon size={15} />
          </button>

          <div className="w-[36px] h-[36px] rounded-full bg-[#10B981]/15 border border-[#10B981]/25 flex items-center justify-center text-[#10B981] font-semibold text-[13px] font-display cursor-pointer">
            {user?.full_name?.charAt(0).toUpperCase() || 'U'}
          </div>
        </div>
      </div>

      {/* Messages Canvas */}
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        onRegenerate={handleRegenerate}
        activeMode={activeMode}
      />

      {/* Input Tray */}
      <div className="w-full shrink-0 pb-[12px] pt-[4px] bg-gradient-to-t from-[#0B1020] via-[#0B1020]/95 to-transparent z-10">
        <ChatInput
          onSend={handleSend}
          isLoading={isLoading}
          showSuggestions={messages.length === 0}
          onSuggestionClick={handleSend}
        />
      </div>

      <UploadModal
        isOpen={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onUploadSuccess={() => { setUploadModalOpen(false); loadSubjects(); }}
      />
    </MainLayout>
  );
}
