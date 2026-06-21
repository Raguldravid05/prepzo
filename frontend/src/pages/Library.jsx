import React, { useEffect, useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/common/Button';
import UploadModal from '../components/upload/UploadModal';
import { fetchDocumentsList, deleteDocumentFile } from '../services/uploadService';
import { 
  Library as LibraryIcon, Search, Filter, Trash2, 
  UploadCloud, RefreshCw, FileText, AlertCircle, CheckCircle2 
} from 'lucide-react';

export default function Library() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('All');
  const [subjects, setSubjects] = useState([]);
  const [uploadOpen, setUploadOpen] = useState(false);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const data = await fetchDocumentsList();
      setDocuments(data);
      
      // Calculate unique subjects
      const subs = ['All', ...new Set(data.map(d => d.subject).filter(Boolean))];
      setSubjects(subs);
    } catch (err) {
      console.error('Failed to load documents:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this document? All indexed vector data will be wiped.')) return;
    try {
      await deleteDocumentFile(id);
      await loadDocuments();
    } catch (err) {
      alert('Delete failed: ' + (err.response?.data?.detail || err.message));
    }
  };

  // Format file size
  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Filtered list
  const filteredDocs = documents.filter(doc => {
    const matchesSearch = doc.filename.toLowerCase().includes(search.toLowerCase());
    const matchesSubject = subjectFilter === 'All' || doc.subject === subjectFilter;
    return matchesSearch && matchesSubject;
  });

  return (
    <MainLayout>
      {/* Header */}
      <div className="p-6 border-b border-[#1E293B]/60 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400">
            <LibraryIcon size={20} />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-white">Study Library</h1>
            <p className="text-xs text-slate-500">Manage and upload documents used for academic RAG indexing</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Button variant="secondary" onClick={loadDocuments} icon={<RefreshCw size={14} />} size="sm">
            Refresh
          </Button>
          <Button variant="primary" onClick={() => setUploadOpen(true)} icon={<UploadCloud size={14} />} size="sm">
            Upload File
          </Button>
        </div>
      </div>

      {/* Filters bar */}
      <div className="px-6 py-4 border-b border-[#1E293B]/40 bg-slate-900/10 flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by file name..."
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

      {/* Main Table */}
      <div className="flex-1 overflow-auto p-6">
        {loading ? (
          <div className="h-48 flex items-center justify-center">
            <span className="w-8 h-8 border-3 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : filteredDocs.length === 0 ? (
          <div className="h-64 glass rounded-2xl flex flex-col items-center justify-center text-center p-6 space-y-3">
            <FileText size={40} className="text-slate-600" />
            <h3 className="text-slate-300 font-semibold text-sm">No materials found</h3>
            <p className="text-slate-500 text-xs max-w-sm">
              Upload PDF/DOCX course contents to let the AI learn specific syllabus topics.
            </p>
          </div>
        ) : (
          <div className="glass rounded-2xl overflow-hidden border border-slate-800/80">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="bg-slate-900/80 text-slate-400 font-semibold uppercase border-b border-slate-800">
                  <th className="p-4">Filename</th>
                  <th className="p-4">Subject</th>
                  <th className="p-4">Chunks</th>
                  <th className="p-4">Size</th>
                  <th className="p-4">Indexed Date</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredDocs.map((doc) => {
                  const dateStr = new Date(doc.created_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                  });

                  // Status Badge Styles
                  let statusBadge = null;
                  if (doc.status === 'Ready') {
                    statusBadge = (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-medium">
                        <CheckCircle2 size={12} /> Ready
                      </span>
                    );
                  } else if (doc.status.startsWith('Error')) {
                    statusBadge = (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 font-medium" title={doc.status}>
                        <AlertCircle size={12} /> Error
                      </span>
                    );
                  } else {
                    statusBadge = (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-medium animate-pulse">
                        <RefreshCw size={10} className="animate-spin" /> {doc.status}
                      </span>
                    );
                  }

                  return (
                    <tr key={doc.id} className="hover:bg-slate-850/20 text-slate-300">
                      <td className="p-4 font-medium text-white max-w-[200px] truncate">
                        {doc.filename}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded bg-slate-800 border border-slate-700/60 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                          {doc.subject || 'General'}
                        </span>
                      </td>
                      <td className="p-4 text-slate-400">{doc.chunk_count}</td>
                      <td className="p-4 text-slate-400">{formatBytes(doc.file_size)}</td>
                      <td className="p-4 text-slate-400">{dateStr}</td>
                      <td className="p-4">{statusBadge}</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => handleDelete(doc.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
                          title="Delete material"
                        >
                          <Trash2 size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Upload modal inside Library */}
      <UploadModal
        isOpen={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onUploadSuccess={() => {
          setUploadOpen(false);
          loadDocuments();
        }}
      />
    </MainLayout>
  );
}
