'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

export const CommandPalette = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center pt-[15vh]">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20"
            onClick={() => setIsOpen(false)}
          />

          {/* Palette Container */}
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 25,
            }}
            className="
              relative w-full max-w-[600px] 
              bg-[var(--bg-surface)] 
              rounded-none 
              border border-[var(--border-default)] 
              shadow-modal 
              overflow-hidden
            "
          >
            {/* Input Area */}
            <div className="flex items-center border-b border-[var(--border-subtle)] px-4">
              <Search className="mr-2 h-5 w-5 opacity-50 text-[var(--text-secondary)]" />
              <input
                type="text"
                placeholder="搜尋專案、任務... (Ctrl/Cmd + K)"
                autoFocus
                className="
                  flex h-14 w-full 
                  bg-transparent 
                  py-3 
                  text-[14px] text-[var(--text-primary)] 
                  outline-none 
                  placeholder:text-[var(--text-tertiary)]
                "
              />
              <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded-none border bg-[var(--bg-hover)] px-1.5 font-mono text-[10px] font-medium text-[var(--text-secondary)] opacity-100">
                <span className="text-xs">ESC</span>
              </kbd>
            </div>

            {/* Results Placeholder (Visual Only as per Task 2 requirements) */}
            <div className="max-h-[300px] overflow-y-auto p-2">
              <div className="px-2 py-1.5 text-xs font-semibold text-[var(--text-tertiary)]">建議搜尋</div>
              <div className="flex cursor-pointer select-none items-center rounded-none px-2 py-2 text-sm outline-none hover:bg-[var(--bg-hover)] text-[var(--text-secondary)]">
                <span className="mr-2 flex h-4 w-4 items-center justify-center">📄</span>
                <span>我的任務</span>
              </div>
              <div className="flex cursor-pointer select-none items-center rounded-none px-2 py-2 text-sm outline-none hover:bg-[var(--bg-hover)] text-[var(--text-secondary)]">
                <span className="mr-2 flex h-4 w-4 items-center justify-center">📁</span>
                <span>近期專案</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
