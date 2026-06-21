import api from './api';

// User Preferences Settings
export const fetchSettings = async () => {
  const response = await api.get('/settings');
  return response.data;
};

export const updateSettings = async (settingsPayload) => {
  const response = await api.put('/settings', settingsPayload);
  return response.data;
};

// Saved Answers Library
export const fetchSavedAnswers = async () => {
  const response = await api.get('/saved');
  return response.data;
};

export const saveAnswer = async (title, subject, tags, content) => {
  const response = await api.post('/saved', {
    title,
    subject,
    tags,
    content
  });
  return response.data;
};

export const deleteSavedAnswer = async (id) => {
  const response = await api.delete(`/saved/delete/${id}`);
  return response.data;
};
