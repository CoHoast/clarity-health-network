'use client';

import { useState, useCallback } from 'react';
import { api } from './useApi';

interface PulseMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface UsePulseResult {
  messages: PulseMessage[];
  isLoading: boolean;
  error: string | null;
  sendMessage: (message: string) => Promise<void>;
  clearMessages: () => void;
}

export function usePulse(): UsePulseResult {
  const [messages, setMessages] = useState<PulseMessage[]>([]);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = useCallback(async (message: string) => {
    setIsLoading(true);
    setError(null);

    // Add user message immediately
    const userMessage: PulseMessage = {
      role: 'user',
      content: message,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await api.post<{ response: string; conversationId: string }>(
        '/pulse/chat',
        { message, conversationId }
      );

      setConversationId(response.conversationId);

      // Add assistant response
      const assistantMessage: PulseMessage = {
        role: 'assistant',
        content: response.response,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
      // Remove the user message if we failed
      setMessages(prev => prev.slice(0, -1));
    } finally {
      setIsLoading(false);
    }
  }, [conversationId]);

  const clearMessages = useCallback(() => {
    setMessages([]);
    setConversationId(null);
    setError(null);
  }, []);

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  };
}

// Suggested prompts by portal type
export const pulsePrompts = {
  member: [
    'What is my deductible status?',
    'Help me find a doctor',
    'Explain my recent claim',
    'How do I get my ID card?',
  ],
  provider: [
    'Check patient eligibility',
    'What\'s my payment status?',
    'When do my credentials expire?',
    'Help with a claim denial',
  ],
  employer: [
    'Show my invoice summary',
    'How do I add an employee?',
    'Generate a utilization report',
    'Open enrollment dates?',
  ],
  admin: [
    'Show claims queue status',
    'Any fraud alerts?',
    'Provider credentialing pending?',
    'Network adequacy metrics',
  ],
};
