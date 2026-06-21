import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md'
}) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const sizes = {
    sm: 'max-w-[448px]',
    md: 'max-w-[520px]',
    lg: 'max-w-[640px]',
    xl: 'max-w-[896px]'
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-[16px]">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 16 }}
            transition={{ type: 'spring', duration: 0.3 }}
            className={`w-full ${sizes[size]} bg-[#0F172A] rounded-[16px] overflow-hidden shadow-2xl shadow-black/40 z-10 border border-[#1E293B] flex flex-col`}
          >
            {/* Header — 56px height, items-center */}
            <div className="h-[56px] flex items-center justify-between px-[24px] border-b border-[#1E293B] shrink-0">
              <h3 className="text-[16px] font-semibold text-white font-display">
                {title}
              </h3>
              <button
                onClick={onClose}
                className="w-[32px] h-[32px] rounded-[8px] text-[#64748B] hover:text-white hover:bg-[#1E293B] flex items-center justify-center transition-colors cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            {/* Content — 32px card padding */}
            <div className="p-[32px] overflow-y-auto max-h-[75vh]">
              {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
