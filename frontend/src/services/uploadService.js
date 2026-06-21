import api from './api';

export const uploadDocumentFile = async (file, subject, onProgress) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('subject', subject);

  const response = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        onProgress(percent);
      }
    },
  });
  return response.data;
};

export const fetchDocumentsList = async () => {
  const response = await api.get('/documents');
  return response.data;
};

export const deleteDocumentFile = async (id) => {
  const response = await api.delete(`/document/delete/${id}`);
  return response.data;
};
