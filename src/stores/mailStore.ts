import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { apiClient } from '../services/api';

// Types for Mail (matching backend interfaces)
export interface MailChannel {
  id: string;
  tenant_id: string;
  name: string;
  description?: string;
  type: 'general' | 'project' | 'department' | 'announcement' | 'direct';
  is_private: boolean;
  created_by: string;
  member_count?: number;
  last_message?: MailMessage;
  unread_count?: number;
  deleted_at?: string;
  created_at: string;
  updated_at: string;
}

export interface MailMessage {
  id: string;
  channel_id: string;
  sender_id: string;
  sender?: {
    id: string;
    nombre: string;
    apellido: string;
    avatar_url?: string;
  };
  content: string;
  attachments?: MailAttachment[];
  mentions?: string[];
  reactions?: MessageReaction[];
  is_edited: boolean;
  edited_at?: string;
  reply_to?: string;
  thread_count?: number;
  deleted_at?: string;
  created_at: string;
}

export interface MailAttachment {
  id: string;
  filename: string;
  original_name: string;
  mime_type: string;
  size_bytes: number;
  url: string;
}

export interface MessageReaction {
  emoji: string;
  count: number;
  users: string[];
  reacted_by_me: boolean;
}

export interface DirectMessage {
  id: string;
  participants: string[];
  last_message?: MailMessage;
  unread_count?: number;
  created_at: string;
}

export interface TypingUser {
  userId: string;
  userName: string;
  channelId: string;
  timestamp: number;
}

interface MailState {
  // UI State
  isLoading: boolean;
  error: string | null;
  selectedChannelId: string | null;
  showThreadSidebar: boolean;
  selectedThreadMessageId: string | null;

  // Data
  channels: MailChannel[];
  directMessages: DirectMessage[];
  messages: Record<string, MailMessage[]>; // channelId -> messages
  threadMessages: Record<string, MailMessage[]>; // parentMessageId -> replies
  typingUsers: TypingUser[];

  // Pagination
  hasMoreMessages: Record<string, boolean>;
  loadingMoreMessages: Record<string, boolean>;

  // Actions
  loadChannels: () => Promise<void>;
  loadDirectMessages: () => Promise<void>;
  loadMessages: (channelId: string, page?: number) => Promise<void>;
  loadMoreMessages: (channelId: string) => Promise<void>;
  sendMessage: (channelId: string, content: string, attachments?: File[]) => Promise<void>;
  editMessage: (messageId: string, content: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  addReaction: (messageId: string, emoji: string) => Promise<void>;
  removeReaction: (messageId: string, emoji: string) => Promise<void>;
  
  // Channel management
  createChannel: (params: { name: string; description?: string; type: string; isPrivate: boolean }) => Promise<void>;
  joinChannel: (channelId: string) => Promise<void>;
  leaveChannel: (channelId: string) => Promise<void>;
  
  // UI actions
  selectChannel: (channelId: string) => void;
  clearError: () => void;
  markAsRead: (channelId: string) => Promise<void>;
  
  // Real-time
  addMessage: (message: MailMessage) => void;
  updateMessage: (message: MailMessage) => void;
  removeMessage: (messageId: string) => void;
  setTyping: (userId: string, userName: string, channelId: string) => void;
  clearTyping: (userId: string, channelId: string) => void;
  
  // Search
  searchMessages: (query: string, channelId?: string) => Promise<MailMessage[]>;
}

export const useMailStore = create<MailState>()(
  devtools(
    (set, get) => ({
      // Initial state
      isLoading: false,
      error: null,
      selectedChannelId: null,
      showThreadSidebar: false,
      selectedThreadMessageId: null,
      channels: [],
      directMessages: [],
      messages: {},
      threadMessages: {},
      typingUsers: [],
      hasMoreMessages: {},
      loadingMoreMessages: {},

      // Load channels (similar to Slack's channel list)
      loadChannels: async () => {
        try {
          set({ isLoading: true, error: null });
          const response = await apiClient.get('/api/mail/channels');
          
          if (response.data) {
            set({ 
              channels: response.data.data || response.data,
              isLoading: false 
            });
          }
        } catch (error: any) {
          console.error('Load channels error:', error);
          set({ 
            error: error.response?.data?.error?.message || 'Error loading channels',
            isLoading: false 
          });
        }
      },

      // Load direct messages
      loadDirectMessages: async () => {
        try {
          const response = await apiClient.get('/api/mail/direct-messages');
          
          if (response.data) {
            set({ 
              directMessages: response.data.data || response.data
            });
          }
        } catch (error: any) {
          console.error('Load DMs error:', error);
        }
      },

      // Load messages for a channel (Slack-style)
      loadMessages: async (channelId: string, page = 1) => {
        try {
          set(state => ({
            loadingMoreMessages: { ...state.loadingMoreMessages, [channelId]: true }
          }));

          const response = await apiClient.get(`/api/mail/channels/${channelId}/messages`, {
            params: { page, limit: 50 }
          });
          
          if (response.data) {
            const newMessages = response.data.data || [];
            const hasMore = response.data.pagination?.totalPages > page;

            set(state => ({
              messages: {
                ...state.messages,
                [channelId]: page === 1 ? newMessages : [...(state.messages[channelId] || []), ...newMessages]
              },
              hasMoreMessages: { ...state.hasMoreMessages, [channelId]: hasMore },
              loadingMoreMessages: { ...state.loadingMoreMessages, [channelId]: false }
            }));
          }
        } catch (error: any) {
          console.error('Load messages error:', error);
          set(state => ({
            loadingMoreMessages: { ...state.loadingMoreMessages, [channelId]: false }
          }));
        }
      },

      // Load more messages (pagination)
      loadMoreMessages: async (channelId: string) => {
        const state = get();
        const currentMessages = state.messages[channelId] || [];
        const page = Math.floor(currentMessages.length / 50) + 1;
        
        if (!state.loadingMoreMessages[channelId] && state.hasMoreMessages[channelId]) {
          await state.loadMessages(channelId, page);
        }
      },

      // Send message (Slack-style)
      sendMessage: async (channelId: string, content: string, attachments?: File[]) => {
        try {
          const formData = new FormData();
          formData.append('content', content);
          
          if (attachments && attachments.length > 0) {
            attachments.forEach(file => {
              formData.append('attachments', file);
            });
          }

          const response = await apiClient.post(`/api/mail/channels/${channelId}/messages`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          if (response.data) {
            // Message will be added via WebSocket, but add optimistically
            const newMessage = response.data.data;
            set(state => ({
              messages: {
                ...state.messages,
                [channelId]: [...(state.messages[channelId] || []), newMessage]
              }
            }));
          }
        } catch (error: any) {
          console.error('Send message error:', error);
          set({ 
            error: error.response?.data?.error?.message || 'Error sending message'
          });
        }
      },

      // Edit message
      editMessage: async (messageId: string, content: string) => {
        try {
          const response = await apiClient.put(`/api/mail/messages/${messageId}`, { content });
          
          if (response.data) {
            const updatedMessage = response.data.data;
            set(state => {
              const newMessages = { ...state.messages };
              
              // Find and update the message in the appropriate channel
              Object.keys(newMessages).forEach(channelId => {
                const messageIndex = newMessages[channelId].findIndex(m => m.id === messageId);
                if (messageIndex !== -1) {
                  newMessages[channelId][messageIndex] = updatedMessage;
                }
              });
              
              return { messages: newMessages };
            });
          }
        } catch (error: any) {
          console.error('Edit message error:', error);
          set({ 
            error: error.response?.data?.error?.message || 'Error editing message'
          });
        }
      },

      // Delete message
      deleteMessage: async (messageId: string) => {
        try {
          await apiClient.delete(`/api/mail/messages/${messageId}`);
          
          set(state => {
            const newMessages = { ...state.messages };
            
            // Find and remove the message from the appropriate channel
            Object.keys(newMessages).forEach(channelId => {
              newMessages[channelId] = newMessages[channelId].filter(m => m.id !== messageId);
            });
            
            return { messages: newMessages };
          });
        } catch (error: any) {
          console.error('Delete message error:', error);
          set({ 
            error: error.response?.data?.error?.message || 'Error deleting message'
          });
        }
      },

      // Add reaction to message
      addReaction: async (messageId: string, emoji: string) => {
        try {
          await apiClient.post(`/api/mail/messages/${messageId}/reactions`, { emoji });
        } catch (error: any) {
          console.error('Add reaction error:', error);
        }
      },

      // Remove reaction from message
      removeReaction: async (messageId: string, emoji: string) => {
        try {
          await apiClient.delete(`/api/mail/messages/${messageId}/reactions/${emoji}`);
        } catch (error: any) {
          console.error('Remove reaction error:', error);
        }
      },

      // Create new channel
      createChannel: async (params) => {
        try {
          const response = await apiClient.post('/api/mail/channels', params);
          
          if (response.data) {
            const newChannel = response.data.data;
            set(state => ({
              channels: [...state.channels, newChannel]
            }));
          }
        } catch (error: any) {
          console.error('Create channel error:', error);
          set({ 
            error: error.response?.data?.error?.message || 'Error creating channel'
          });
        }
      },

      // Join channel
      joinChannel: async (channelId: string) => {
        try {
          await apiClient.post(`/api/mail/channels/${channelId}/join`);
          // Refresh channels to update membership
          await get().loadChannels();
        } catch (error: any) {
          console.error('Join channel error:', error);
          set({ 
            error: error.response?.data?.error?.message || 'Error joining channel'
          });
        }
      },

      // Leave channel
      leaveChannel: async (channelId: string) => {
        try {
          await apiClient.post(`/api/mail/channels/${channelId}/leave`);
          // Remove from local state
          set(state => ({
            channels: state.channels.filter(c => c.id !== channelId),
            selectedChannelId: state.selectedChannelId === channelId ? null : state.selectedChannelId
          }));
        } catch (error: any) {
          console.error('Leave channel error:', error);
          set({ 
            error: error.response?.data?.error?.message || 'Error leaving channel'
          });
        }
      },

      // UI Actions
      selectChannel: (channelId: string) => {
        set({ selectedChannelId: channelId });
        // Load messages for the selected channel
        get().loadMessages(channelId);
      },

      clearError: () => set({ error: null }),

      // Mark channel as read
      markAsRead: async (channelId: string) => {
        try {
          await apiClient.post(`/api/mail/channels/${channelId}/read`);
          
          // Update local unread count
          set(state => ({
            channels: state.channels.map(c => 
              c.id === channelId ? { ...c, unread_count: 0 } : c
            )
          }));
        } catch (error: any) {
          console.error('Mark as read error:', error);
        }
      },

      // Real-time message handling
      addMessage: (message: MailMessage) => {
        set(state => ({
          messages: {
            ...state.messages,
            [message.channel_id]: [...(state.messages[message.channel_id] || []), message]
          }
        }));
      },

      updateMessage: (message: MailMessage) => {
        set(state => {
          const newMessages = { ...state.messages };
          const channelMessages = newMessages[message.channel_id] || [];
          const messageIndex = channelMessages.findIndex(m => m.id === message.id);
          
          if (messageIndex !== -1) {
            newMessages[message.channel_id][messageIndex] = message;
          }
          
          return { messages: newMessages };
        });
      },

      removeMessage: (messageId: string) => {
        set(state => {
          const newMessages = { ...state.messages };
          
          Object.keys(newMessages).forEach(channelId => {
            newMessages[channelId] = newMessages[channelId].filter(m => m.id !== messageId);
          });
          
          return { messages: newMessages };
        });
      },

      // Typing indicators
      setTyping: (userId: string, userName: string, channelId: string) => {
        set(state => {
          const existingTyping = state.typingUsers.find(
            t => t.userId === userId && t.channelId === channelId
          );
          
          if (existingTyping) {
            return {
              typingUsers: state.typingUsers.map(t =>
                t.userId === userId && t.channelId === channelId
                  ? { ...t, timestamp: Date.now() }
                  : t
              )
            };
          }
          
          return {
            typingUsers: [...state.typingUsers, { userId, userName, channelId, timestamp: Date.now() }]
          };
        });
      },

      clearTyping: (userId: string, channelId: string) => {
        set(state => ({
          typingUsers: state.typingUsers.filter(
            t => !(t.userId === userId && t.channelId === channelId)
          )
        }));
      },

      // Search messages
      searchMessages: async (query: string, channelId?: string) => {
        try {
          const params: any = { q: query };
          if (channelId) params.channel_id = channelId;
          
          const response = await apiClient.get('/api/mail/search', { params });
          return response.data?.data || [];
        } catch (error: any) {
          console.error('Search messages error:', error);
          return [];
        }
      },
    }),
    {
      name: 'mail-store',
    }
  )
);