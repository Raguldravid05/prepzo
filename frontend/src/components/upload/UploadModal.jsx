import React, { useState, useRef, useEffect } from 'react';
import Modal from '../common/Modal';
import UploadProgress from './UploadProgress';
import { uploadDocumentFile, fetchDocumentsList } from '../../services/uploadService';
import { Upload, FileText, AlertCircle } from 'lucide-react';

export default function UploadModal({ isOpen, onClose, onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [subject, setSubject] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [docId, setDocId] = useState(null);
  
  const fileInputRef = useRef(null);
  const pollIntervalRef = useRef(null);

  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, []);

  const handleDragOver = (e) => { e.preventDefault(); };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (files && files.length > 0) validateAndSetFile(files[0]);
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) validateAndSetFile(files[0]);
  };

  const validateAndSetFile = (selectedFile) => {
    setErrorMessage('');
    const ext = selectedFile.name.split('.').pop().toLowerCase();
    if (ext !== 'pdf' && ext !== 'docx' && ext !== 'doc') {
      setErrorMessage('Unsupported file format. Please upload PDF or DOCX.');
      return;
    }
    setFile(selectedFile);
  };

  const startPolling = (documentId) => {
    setDocId(documentId);
    pollIntervalRef.current = setInterval(async () => {
      try {
        const docs = await fetchDocumentsList();
        const activeDoc = docs.find(d => d.id === documentId);
        if (activeDoc) {
          setUploadStatus(activeDoc.status);
          if (activeDoc.status === 'Ready') {
            clearInterval(pollIntervalRef.current);
            setIsUploading(false);
            if (onUploadSuccess) onUploadSuccess();
          } else if (activeDoc.status.startsWith('Error')) {
            clearInterval(pollIntervalRef.current);
            setIsUploading(false);
            setErrorMessage(activeDoc.status);
          }
        }
      } catch (err) {
        console.error('Polling failed:', err);
      }
    }, 1500);
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    setIsUploading(true);
    setErrorMessage('');
    setUploadStatus('Uploading...');
    try {
      const result = await uploadDocumentFile(file, subject || 'General');
      startPolling(result.document.id);
    } catch (err) {
      setIsUploading(false);
      setErrorMessage(err.response?.data?.detail || 'Failed to upload document.');
    }
  };

  const triggerFileSelect = () => { fileInputRef.current.click(); };

  const handleClose = () => {
    if (isUploading) return;
    setFile(null);
    setSubject('');
    setIsUploading(false);
    setUploadStatus('');
    setErrorMessage('');
    setDocId(null);
    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Upload Study Materials" size="md">
      {!isUploading ? (
        <form onSubmit={handleUploadSubmit} className="space-y-[24px]">
          {/* Drag & Drop Zone */}
          <div
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={triggerFileSelect}
            className="border-2 border-dashed border-[#1E293B] hover:border-[#10B981]/50 bg-[#111827]/40 hover:bg-[#111827]/60 rounded-[16px] p-[32px] flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
              accept=".pdf,.docx,.doc"
            />
            {file ? (
              <div className="flex flex-col items-center gap-[8px]">
                <div className="w-[48px] h-[48px] rounded-[14px] bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center text-[#10B981]">
                  <FileText size={24} />
                </div>
                <p className="text-[14px] font-medium text-white truncate max-w-[260px]">
                  {file.name}
                </p>
                <p className="text-[12px] text-[#64748B]">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-[12px]">
                <div className="w-[48px] h-[48px] rounded-[14px] bg-[#1E293B] flex items-center justify-center text-[#64748B] group-hover:text-[#10B981] group-hover:bg-[#10B981]/10 group-hover:border-[#10B981]/20 border border-transparent transition-colors">
                  <Upload size={24} />
                </div>
                <div>
                  <p className="text-[14px] font-medium text-[#E2E8F0]">
                    Click to upload or drag & drop
                  </p>
                  <p className="text-[12px] text-[#64748B] mt-[4px]">
                    PDF or DOCX files (up to 20MB)
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Subject Field — standardized input */}
          <div>
            <label className="block text-[13px] font-medium text-[#94A3B8] mb-[8px]">
              Subject / Course
            </label>
            <input
              type="text"
              placeholder="e.g. Operating Systems (Optional)"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="input-field"
              style={{ paddingLeft: '16px', paddingRight: '16px' }}
            />
          </div>

          {/* Error */}
          {errorMessage && (
            <div className="flex items-center gap-[10px] text-red-400 text-[13px] p-[16px] bg-red-500/10 border border-red-500/20 rounded-[14px]">
              <AlertCircle size={16} className="shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Actions — consistent button sizing */}
          <div className="flex items-center justify-end gap-[12px] pt-[8px]">
            <button
              type="button"
              onClick={handleClose}
              className="h-[44px] px-[20px] rounded-[14px] bg-[#111827] border border-[#1E293B] hover:border-[#334155] text-[#E2E8F0] text-[13px] font-semibold transition-all cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!file}
              className="h-[44px] px-[24px] rounded-[14px] bg-[#10B981] hover:bg-[#059669] text-white text-[13px] font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md shadow-emerald-500/10 cursor-pointer"
            >
              Process & Index
            </button>
          </div>
        </form>
      ) : (
        /* Progress pipeline */
        <div className="space-y-[16px]">
          <div className="flex items-center gap-[12px] p-[16px] bg-[#111827] rounded-[14px] border border-[#1E293B]">
            <FileText size={18} className="text-[#64748B] shrink-0" />
            <div className="overflow-hidden">
              <p className="text-[14px] font-medium text-white truncate max-w-[280px]">
                {file?.name}
              </p>
              <p className="text-[11px] text-[#64748B] uppercase tracking-[0.06em] font-semibold">
                {subject || 'General'}
              </p>
            </div>
          </div>
          <UploadProgress currentStatus={uploadStatus} />
        </div>
      )}
    </Modal>
  );
}
