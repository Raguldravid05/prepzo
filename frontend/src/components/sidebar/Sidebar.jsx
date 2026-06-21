import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useChat } from '../../hooks/useChat';
import { 
  MessageSquare, Library, Bookmark, Settings, LogOut, 
  Menu, Sparkles, ChevronLeft, Trash2, Plus,
  Upload, MoreVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Sidebar({ isOpen, setIsOpen }) {
  const { user, logout } = useAuth();
  const { conversations, currentConversation, loadConversations, loadConversation, startNewChat, deleteChat } = useChat();
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredItem, setHoveredItem] = useState(null);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsOpen]);

  const navItems = [
    { name: 'Upload Materials', path: '/library', icon: Upload },
    { name: 'Library', path: '/library', icon: Library },
    { name: 'Saved Answers', path: '/saved-answers', icon: Bookmark },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  const handleConversationClick = (id) => {
    loadConversation(id);
    if (location.pathname !== '/chat') navigate('/chat');
  };

  const handleNewChatClick = () => {
    startNewChat();
    if (location.pathname !== '/chat') navigate('/chat');
  };

  const visibleConversations = conversations.slice(0, 5);

  return (
    <AnimatePresence mode="wait">
      {isOpen ? (
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: 280, opacity: 1 }}
          exit={{ width: 0, opacity: 0 }}
          transition={{ duration: 0.2, ease: 'easeInOut' }}
          className="h-full bg-[#0F172A] border-r border-[#1E293B] flex flex-col z-20 overflow-hidden relative shrink-0"
          style={{ minWidth: 280, maxWidth: 280 }}
        >
          {/* Header — 16px padding */}
          <div className="flex items-center justify-between px-[16px] py-[16px] border-b border-[#1E293B]">
            <div onClick={handleNewChatClick} className="flex items-center gap-[10px] cursor-pointer group">
              <div className="w-[32px] h-[32px] rounded-[8px] bg-[#10B981] flex items-center justify-center shadow-md shadow-emerald-500/20">
                <Sparkles size={14} className="text-white group-hover:rotate-12 transition-transform" />
              </div>
              <span className="text-[15px] font-display font-semibold text-white">
                Prepzo <span className="text-[#10B981] italic text-[13px]">AI</span>
              </span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-[32px] h-[32px] rounded-[8px] text-[#64748B] hover:text-white hover:bg-[#1E293B] flex items-center justify-center transition-colors cursor-pointer"
              title="Collapse Sidebar (Ctrl+B)"
            >
              <ChevronLeft size={16} />
            </button>
          </div>

          {/* New Chat Button — 12px horizontal padding, 8px vertical */}
          <div className="px-[12px] py-[12px]">
            <button
              onClick={handleNewChatClick}
              className="w-full h-[40px] flex items-center justify-center gap-[8px] rounded-[10px] bg-[#10B981] hover:bg-[#059669] text-white text-[13px] font-semibold transition-all active:scale-[0.98] shadow-md shadow-emerald-500/15 cursor-pointer"
            >
              <Plus size={16} />
              New Chat
            </button>
          </div>

          {/* Nav Items — 8px between items */}
          <div className="px-[8px] space-y-[2px]">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.name}
                  onClick={() => navigate(item.path)}
                  className={`w-full h-[40px] flex items-center gap-[12px] px-[12px] rounded-[10px] text-[13px] font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#1E293B]/60 text-white'
                      : 'text-[#94A3B8] hover:bg-[#1E293B]/30 hover:text-[#E2E8F0]'
                  }`}
                >
                  <Icon size={16} className={isActive ? 'text-[#10B981]' : 'text-[#64748B]'} />
                  {item.name}
                </button>
              );
            })}
          </div>

          {/* Recent Chats — consistent spacing */}
          <div className="flex-1 overflow-y-auto px-[8px] pt-[16px] pb-[8px]">
            <div className="px-[12px] mb-[8px] text-[11px] font-semibold text-[#64748B] uppercase tracking-[0.08em]">
              Recent Chats
            </div>
            {visibleConversations.length === 0 ? (
              <div className="px-[12px] py-[8px] text-[12px] text-[#64748B] italic">
                No recent conversations
              </div>
            ) : (
              <div className="space-y-[2px]">
                {visibleConversations.map((conv) => {
                  const isActive = currentConversation?.id === conv.id;
                  return (
                    <div
                      key={conv.id}
                      onMouseEnter={() => setHoveredItem(conv.id)}
                      onMouseLeave={() => setHoveredItem(null)}
                      className={`group w-full h-[40px] flex items-center justify-between px-[12px] rounded-[10px] text-[13px] transition-all cursor-pointer ${
                        isActive 
                          ? 'bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20' 
                          : 'text-[#94A3B8] hover:bg-[#1E293B]/30 hover:text-[#E2E8F0] border border-transparent'
                      }`}
                    >
                      <div 
                        onClick={() => handleConversationClick(conv.id)}
                        className="flex-1 flex items-center gap-[10px] overflow-hidden pr-[8px]"
                      >
                        <MessageSquare size={14} className={isActive ? 'text-[#10B981]' : 'text-[#64748B]'} />
                        <span className="truncate text-left">{conv.title}</span>
                        {isActive && (
                          <span className="w-[6px] h-[6px] rounded-full bg-[#10B981] shrink-0 ml-auto" />
                        )}
                      </div>

                      {hoveredItem === conv.id && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('Delete this conversation?')) deleteChat(conv.id);
                          }}
                          className="text-[#64748B] hover:text-red-400 p-[4px] rounded-[6px] transition-colors cursor-pointer"
                          title="Delete chat"
                        >
                          <Trash2 size={12} />
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
            {conversations.length > 5 && (
              <button
                onClick={() => navigate('/chat')}
                className="w-full px-[12px] py-[8px] text-[12px] text-[#10B981] hover:text-[#059669] font-medium transition-colors text-left cursor-pointer mt-[4px]"
              >
                View all chats
              </button>
            )}
          </div>

          {/* User Profile — pinned at bottom */}
          <div className="px-[12px] py-[12px] border-t border-[#1E293B] bg-[#0F172A] flex items-center justify-between">
            <div className="flex items-center gap-[10px] overflow-hidden">
              <div className="w-[36px] h-[36px] rounded-full bg-[#10B981]/15 border border-[#10B981]/25 flex items-center justify-center font-semibold text-[#10B981] font-display shrink-0 text-[14px]">
                {user?.full_name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="overflow-hidden">
                <p className="text-[13px] font-medium text-white truncate leading-tight">
                  {user?.full_name || 'Student User'}
                </p>
                <p className="text-[11px] text-[#64748B] truncate">
                  {user?.email || 'student@university.edu'}
                </p>
              </div>
            </div>
            <button
              onClick={() => { logout(); navigate('/login'); }}
              className="w-[32px] h-[32px] rounded-[8px] text-[#64748B] hover:text-red-400 hover:bg-[#1E293B]/50 flex items-center justify-center transition-all shrink-0 cursor-pointer"
              title="Sign out"
            >
              <MoreVertical size={16} />
            </button>
          </div>
        </motion.div>
      ) : (
        /* Collapsed strip — 48px wide */
        <div className="h-full w-[48px] bg-[#0F172A] border-r border-[#1E293B]/40 flex flex-col items-center py-[16px] gap-[8px] z-20 shrink-0">
          <button
            onClick={() => setIsOpen(true)}
            className="w-[36px] h-[36px] rounded-[8px] text-[#64748B] hover:text-white hover:bg-[#1E293B] flex items-center justify-center transition-colors cursor-pointer"
            title="Expand Sidebar (Ctrl+B)"
          >
            <Menu size={18} />
          </button>
          
          <button
            onClick={handleNewChatClick}
            className="w-[36px] h-[36px] rounded-[8px] text-[#10B981] hover:bg-[#10B981]/10 flex items-center justify-center transition-colors mt-[8px] cursor-pointer"
            title="New Chat"
          >
            <Plus size={18} />
          </button>
          
          <div className="flex-1" />
          
          {[
            { icon: Upload, path: '/library', name: 'Upload' },
            { icon: Library, path: '/library', name: 'Library' },
            { icon: Bookmark, path: '/saved-answers', name: 'Saved' },
            { icon: Settings, path: '/settings', name: 'Settings' },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.name}
                onClick={() => navigate(item.path)}
                className={`w-[36px] h-[36px] rounded-[8px] flex items-center justify-center transition-colors cursor-pointer mb-[4px] ${
                  isActive ? 'bg-[#1E293B] text-[#10B981]' : 'text-[#64748B] hover:text-[#94A3B8]'
                }`}
                title={item.name}
              >
                <Icon size={16} />
              </button>
            );
          })}
        </div>
      )}
    </AnimatePresence>
  );
}
