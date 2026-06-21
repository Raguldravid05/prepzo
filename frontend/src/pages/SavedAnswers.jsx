import React, { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import { fetchSavedAnswers, deleteSavedAnswer } from '../services/settingsService';
import { 
  Bookmark, Search, Filter, Trash2, Eye, Download, 
  ExternalLink, FileText, RefreshCw, Tag 
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function SavedAnswers() {
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [subjects, setSubjects] = useState([]);
  const [activeAnswer, setActiveAnswer] = useState(null);

  const loadAnswers = async () => {
    setLoading(true);
    try {
      const data = await fetchSavedAnswers();
      setAnswers(data);
      
      const subs = ['All', ...new Set(data.map(a => a.subject).filter(Boolean))];
      setSubjects(subs);
    } catch (err) {
      console.error('Failed to load saved answers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAnswers();
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this saved answer?')) return;
    try {
      await deleteSavedAnswer(id);
      if (activeAnswer?.id === id) setActiveAnswer(null);
      await loadAnswers();
    } catch (err) {
      alert('Delete failed: ' + (err.response?.data?.detail || err.message));
    }
  };

  const handleExportPDF = () => {
    if (!activeAnswer) return;
    
    const printArea = document.getElementById("pdf-print-area");
    if (!printArea) return;
    
    const printHtml = printArea.innerHTML;
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
      <html>
        <head>
          <title>${activeAnswer.title}</title>
          <style>
            body { 
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
              padding: 40px; 
              color: #1e293b; 
              line-height: 1.7; 
            }
            h1 { 
              font-size: 24px;
              color: #0f172a; 
              margin-bottom: 6px; 
              border-bottom: 2px solid #10b981;
              padding-bottom: 12px;
            }
            .meta {
              font-size: 12px;
              color: #64748b;
              margin-bottom: 24px;
            }
            p { margin-bottom: 16px; }
            ul, ol { padding-left: 20px; margin-bottom: 16px; }
            li { margin-bottom: 6px; }
            code { 
              font-family: SFMono-Regular, Consolas, "Liberation Mono", Menlo, monospace;
              background-color: #f1f5f9; 
              padding: 2px 6px; 
              border-radius: 4px; 
              font-size: 13px;
              color: #0f766e;
            }
            pre { 
              background-color: #f8fafc; 
              border: 1px solid #e2e8f0;
              border-radius: 8px; 
              padding: 16px; 
              overflow-x: auto; 
              margin-bottom: 20px;
            }
            pre code { 
              background-color: transparent; 
              padding: 0; 
              color: #334155;
            }
            blockquote {
              border-left: 4px solid #10b981;
              padding-left: 16px;
              margin: 16px 0;
              color: #475569;
              font-style: italic;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin: 20px 0;
            }
            th, td {
              border: 1px solid #e2e8f0;
              padding: 10px 12px;
              text-align: left;
            }
            th {
              background-color: #f8fafc;
              font-weight: 600;
            }
          </style>
        </head>
        <body>
          <h1>${activeAnswer.title}</h1>
          <div class="meta">
            Subject: <strong>${activeAnswer.subject}</strong> &nbsp;|&nbsp; 
            Type: <strong>${activeAnswer.tags || 'normal'}</strong> &nbsp;|&nbsp; 
            Saved on: ${new Date(activeAnswer.created_at).toLocaleDateString()}
          </div>
          <div>
            ${printHtml}
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(() => { window.close(); }, 500);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const filteredAnswers = answers.filter(ans => {
    const matchesSearch = ans.title.toLowerCase().includes(search.toLowerCase()) || 
                          ans.content.toLowerCase().includes(search.toLowerCase());
    const matchesSubject = subjectFilter === 'All' || ans.subject === subjectFilter;
    return matchesSearch && matchesSubject;
  });

  return (
    <MainLayout>
      {/* Header */}
      <div className="p-6 border-b border-[#1E293B]/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <Bookmark size={20} />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-white">Saved Answers</h1>
            <p className="text-xs text-slate-500">View and export answers bookmarked during RAG learning cycles</p>
          </div>
        </div>

        <Button variant="secondary" onClick={loadAnswers} icon={<RefreshCw size={14} />} size="sm">
          Refresh
        </Button>
      </div>

      {/* Filters bar */}
      <div className="px-6 py-4 border-b border-[#1E293B]/40 bg-slate-900/10 flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search saved answers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950/40 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 transition-colors"
          />
        </div>

        {/* Subject Filter */}
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter size={14} className="text-slate-500" />
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="bg-slate-950/40 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-emerald-500/50 cursor-pointer"
          >
            {subjects.map(sub => (
              <option key={sub} value={sub} className="bg-slate-900 text-slate-200">
                {sub}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid container */}
      <div className="flex-1 overflow-auto p-6">
        {loading ? (
          <div className="h-48 flex items-center justify-center">
            <span className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredAnswers.length === 0 ? (
          <div className="h-64 glass rounded-2xl flex flex-col items-center justify-center text-center p-6 space-y-3">
            <Bookmark size={40} className="text-slate-600" />
            <h3 className="text-slate-300 font-semibold text-sm">No saved answers</h3>
            <p className="text-slate-500 text-xs max-w-sm">
              Answers bookmarked during chat study sessions will appear here.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAnswers.map((ans) => {
              const dateStr = new Date(ans.created_at).toLocaleDateString();
              return (
                <div
                  key={ans.id}
                  onClick={() => setActiveAnswer(ans)}
                  className="glass hover:bg-slate-800/30 border border-slate-800/80 hover:border-emerald-500/20 p-5 rounded-2xl cursor-pointer transition-all hover:scale-[1.01] flex flex-col justify-between h-48 group relative"
                >
                  <div className="space-y-2.5 overflow-hidden">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700/60 text-slate-400 font-semibold uppercase tracking-wider text-[9px]">
                        {ans.subject}
                      </span>
                      <span className="text-[10px] text-slate-500">{dateStr}</span>
                    </div>
                    <h3 className="font-semibold text-sm text-white group-hover:text-emerald-400 transition-colors line-clamp-2">
                      {ans.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {ans.content.replace(/[#*`]/g, '')}
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-800/60 pt-3 mt-3 text-slate-500 text-[10px]">
                    <span className="flex items-center gap-1">
                      <Tag size={10} />
                      {ans.tags || 'normal'}
                    </span>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => handleDelete(ans.id, e)}
                        className="p-1 rounded text-slate-500 hover:text-red-400 transition-colors cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 size={12} />
                      </button>
                      <button
                        className="p-1 rounded text-slate-500 hover:text-white transition-colors cursor-pointer"
                        title="Open Details"
                      >
                        <Eye size={12} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Answer detail modal */}
      <Modal
        isOpen={!!activeAnswer}
        onClose={() => setActiveAnswer(null)}
        title={activeAnswer?.title || 'Saved Answer'}
        size="lg"
      >
        {activeAnswer && (
          <div className="space-y-6">
            <div className="flex items-center justify-between p-3 bg-slate-900/60 rounded-xl border border-slate-800/80 text-xs">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-slate-850 border border-slate-700/80 text-slate-400 font-semibold uppercase tracking-wider">
                  {activeAnswer.subject}
                </span>
                <span className="text-slate-500">|</span>
                <span className="text-slate-400 font-medium uppercase">
                  Mode: {activeAnswer.tags || 'normal'}
                </span>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleExportPDF}
                icon={<Download size={14} />}
                className="py-1.5 px-3 rounded-lg"
              >
                Export as PDF
              </Button>
            </div>

            {/* Print Area Container (Hidden on UI markdown overrides but read by window print) */}
            <div id="pdf-print-area" className="markdown-container text-slate-200 text-sm leading-relaxed overflow-y-auto max-h-[50vh] p-2">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {activeAnswer.content}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </Modal>
    </MainLayout>
  );
}
