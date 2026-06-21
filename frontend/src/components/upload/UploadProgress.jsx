import React from 'react';
import { Check, Loader2 } from 'lucide-react';

const STAGES = [
  'Uploading...',
  'Extracting Text...',
  'Chunking Content...',
  'Generating Embeddings...',
  'Indexing Documents...',
  'Ready'
];

export default function UploadProgress({ currentStatus = 'Uploading...' }) {
  // Find current index
  let currentIndex = STAGES.findIndex(s => s === currentStatus);
  if (currentIndex === -1) {
    if (currentStatus.startsWith('Error')) {
      currentIndex = -2; // error state
    } else {
      currentIndex = 0;
    }
  }

  const progressPercent = currentIndex >= 0 
    ? Math.round((currentIndex / (STAGES.length - 1)) * 100) 
    : 0;

  return (
    <div className="space-y-6 py-4">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-slate-400 font-medium">
          <span>Processing Pipeline</span>
          <span className={currentIndex === -2 ? 'text-red-400' : 'text-emerald-400'}>
            {currentIndex === -2 ? 'Failed' : `${progressPercent}%`}
          </span>
        </div>
        <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              currentIndex === -2 ? 'bg-red-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${currentIndex === -2 ? 100 : progressPercent}%` }}
          />
        </div>
      </div>

      {/* Stepper list */}
      <div className="space-y-4">
        {STAGES.map((stage, idx) => {
          const isDone = currentIndex > idx;
          const isActive = currentIndex === idx;
          const isPending = currentIndex < idx && currentIndex >= 0;
          const isError = currentIndex === -2;

          let icon = null;
          let labelColor = 'text-slate-500';

          if (isDone) {
            icon = (
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500 flex items-center justify-center text-emerald-400">
                <Check size={12} strokeWidth={3} />
              </div>
            );
            labelColor = 'text-slate-300';
          } else if (isActive) {
            icon = (
              <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center text-emerald-400 animate-spin">
                <Loader2 size={12} />
              </div>
            );
            labelColor = 'text-white font-medium';
          } else if (isError && idx === STAGES.findIndex(s => s === currentStatus)) {
            // Highlight where error occurred if we can, else generic error
            icon = (
              <div className="w-5 h-5 rounded-full bg-red-500/20 border border-red-500 flex items-center justify-center text-red-400 font-semibold text-[10px]">
                X
              </div>
            );
            labelColor = 'text-red-400 font-medium';
          } else {
            icon = (
              <div className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 text-xs font-semibold">
                {idx + 1}
              </div>
            );
            labelColor = 'text-slate-500';
          }

          // Special friendly label text override
          const displayName = stage === 'Ready' ? 'Ready for Questions' : stage;

          return (
            <div key={stage} className="flex items-center gap-3">
              {icon}
              <span className={`text-sm ${labelColor}`}>
                {displayName}
              </span>
            </div>
          );
        })}
      </div>

      {currentIndex === -2 && (
        <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-xs">
          <strong>Process Error:</strong> {currentStatus}
        </div>
      )}
    </div>
  );
}
