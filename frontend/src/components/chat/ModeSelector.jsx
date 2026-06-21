import React from 'react';
import { 
  MessageSquare, FileText, LayoutGrid, BookOpen, 
  HelpCircle, CheckSquare, Sparkles 
} from 'lucide-react';

const MODES = [
  { id: 'normal', name: 'Normal', icon: MessageSquare, desc: 'General study chat assistance' },
  { id: '2mark', name: '2 Mark', icon: FileText, desc: 'Precise 2-3 sentence definition' },
  { id: '8mark', name: '8 Mark', icon: LayoutGrid, desc: 'Intro, 4-5 core points, conclusion' },
  { id: '13mark', name: '13 Mark', icon: BookOpen, desc: 'Comprehensive essay answer with diagram/formulas' },
  { id: 'viva', name: 'Viva', icon: HelpCircle, desc: 'Generate exam oral questions & answers' },
  { id: 'quiz', name: 'Quiz', icon: CheckSquare, desc: 'Generate 3 multiple choice questions' },
  { id: 'notes', name: 'Notes', icon: Sparkles, desc: 'Extract structured revision notes' },
];

export default function ModeSelector({ activeMode, onChange }) {
  return (
    <div className="w-full overflow-x-auto pb-2 -mb-2">
      <div className="flex items-center gap-2 px-4 py-2 min-w-max">
        {MODES.map((mode) => {
          const Icon = mode.icon;
          const isActive = activeMode === mode.id;
          return (
            <button
              key={mode.id}
              onClick={() => onChange(mode.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium border transition-all cursor-pointer select-none active:scale-95 ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/40 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
              title={mode.desc}
            >
              <Icon size={14} className={isActive ? 'text-emerald-400' : 'text-slate-500'} />
              <span>{mode.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
