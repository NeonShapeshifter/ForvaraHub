import React, { useEffect, useRef } from 'react';
import { useMailStore } from '../../stores/mailStore';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import ChannelHeader from './ChannelHeader';
import TypingIndicator from './TypingIndicator';

interface MessageAreaProps {
  channelId: string;
}

const MessageArea: React.FC<MessageAreaProps> = ({ channelId }) => {
  const { 
    messages, 
    loadMessages, 
    loadMoreMessages,
    hasMoreMessages,
    loadingMoreMessages,
    markAsRead 
  } = useMailStore();
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const channelMessages = messages[channelId] || [];

  // Load messages when channel changes
  useEffect(() => {
    if (channelId) {
      loadMessages(channelId);
      markAsRead(channelId);
    }
  }, [channelId, loadMessages, markAsRead]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [channelMessages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLoadMore = () => {
    if (hasMoreMessages[channelId] && !loadingMoreMessages[channelId]) {
      loadMoreMessages(channelId);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Channel Header */}
      <ChannelHeader channelId={channelId} />

      {/* Messages Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
        {/* Load More Button */}
        {hasMoreMessages[channelId] && (
          <div className="flex justify-center p-4 bg-white border-b border-gray-200">
            <button
              onClick={handleLoadMore}
              disabled={loadingMoreMessages[channelId]}
              className="px-4 py-2 text-sm text-blue-600 hover:text-blue-800 disabled:text-gray-400 bg-blue-50 rounded-md hover:bg-blue-100"
            >
              {loadingMoreMessages[channelId] ? 'Cargando...' : 'Cargar más mensajes'}
            </button>
          </div>
        )}

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto bg-white">
          <MessageList 
            messages={channelMessages}
            channelId={channelId}
          />
          
          {/* Typing Indicator */}
          <TypingIndicator channelId={channelId} />
          
          {/* Auto-scroll anchor */}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t border-gray-200 bg-white">
          <MessageInput channelId={channelId} />
        </div>
      </div>
    </div>
  );
};

export default MessageArea;