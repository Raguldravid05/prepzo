import api from './api';

export const sendMessage = async (message, conversationId, answerType = 'normal', subject = null) => {
  const response = await api.post('/chat', {
    message,
    conversation_id: conversationId,
    answer_type: answerType,
    subject,
  });
  return response.data;
};

export const getChatHistory = async () => {
  const response = await api.get('/chat/history');
  return response.data;
};

export const getConversationMessages = async (conversationId) => {
  const response = await api.get(`/chat/history/${conversationId}`);
  return response.data;
};

export const regenerateMessage = async (conversationId, answerType = 'normal', subject = null) => {
  const response = await api.post('/chat/regenerate', {
    conversation_id: conversationId,
    answer_type: answerType,
    subject,
  });
  return response.data;
};

export const deleteConversation = async (conversationId) => {
  const response = await api.delete(`/chat/history/${conversationId}`);
  return response.data;
};
