import { createContext, useState, useCallback } from 'react';
import { sendMessage, getChatHistory, getConversationMessages, regenerateMessage, deleteConversation } from '../services/chatService';

export const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadConversations = useCallback(async () => {
    try {
      const data = await getChatHistory();
      setConversations(data);
    } catch (err) {
      console.error('Failed to load conversations:', err);
    }
  }, []);

  const loadConversation = useCallback(async (conversationId) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getConversationMessages(conversationId);
      setCurrentConversation(data.conversation);
      setMessages(data.messages);
    } catch (err) {
      setError('Failed to load conversation messages.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const send = useCallback(async (messageText, answerType = 'normal', subject = null) => {
    setError(null);
    setIsLoading(true);

    // Optimistically add user message
    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: messageText,
      answer_type: answerType,
      created_at: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);

    try {
      const data = await sendMessage(messageText, currentConversation?.id, answerType, subject);
      
      const aiMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.response,
        answer_type: answerType,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsg]);

      if (!currentConversation) {
        setCurrentConversation({
          id: data.conversation_id,
          title: messageText.slice(0, 50) + (messageText.length > 50 ? '...' : ''),
          subject: subject
        });
      }

      await loadConversations();
      return data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to send message.');
      // Remove the user message since it failed
      setMessages((prev) => prev.filter((m) => m.id !== userMsg.id));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentConversation, loadConversations]);

  const regenerate = useCallback(async (answerType = 'normal', subject = null) => {
    if (!currentConversation) return;
    
    // Find last user message
    const lastUserMsg = [...messages].reverse().find((m) => m.role === 'user');
    if (!lastUserMsg) return;

    setError(null);
    setIsLoading(true);

    // Optimistically remove the last AI response from UI
    setMessages((prev) => {
      const lastAiIdx = prev.findLastIndex((m) => m.role === 'assistant');
      if (lastAiIdx === -1) return prev;
      return prev.slice(0, lastAiIdx);
    });

    try {
      const data = await regenerateMessage(currentConversation.id, answerType, subject);
      
      const aiMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: data.response,
        answer_type: answerType,
        created_at: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiMsg]);
      return data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to regenerate response.');
    } finally {
      setIsLoading(false);
    }
  }, [messages, currentConversation]);

  const startNewChat = useCallback(() => {
    setMessages([]);
    setCurrentConversation(null);
    setError(null);
  }, []);

  const deleteChat = useCallback(async (conversationId) => {
    try {
      await deleteConversation(conversationId);
      if (currentConversation?.id === conversationId) {
        startNewChat();
      }
      await loadConversations();
    } catch (err) {
      console.error('Failed to delete conversation:', err);
    }
  }, [currentConversation, loadConversations, startNewChat]);

  return (
    <ChatContext.Provider
      value={{
        messages,
        conversations,
        currentConversation,
        isLoading,
        error,
        send,
        loadConversations,
        loadConversation,
        regenerate,
        startNewChat,
        deleteChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}
