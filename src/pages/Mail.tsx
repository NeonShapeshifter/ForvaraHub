import React, { useState } from 'react';
import { 
  Mail,
  Send,
  Paperclip,
  Search,
  Plus,
  Hash,
  Users,
  User,
  Bell,
  Settings,
  Archive,
  Trash2,
  Star,
  Clock,
  CheckCheck,
  Circle,
  Filter,
  ChevronDown,
  Smile,
  Image,
  FileText,
  MoreVertical,
  Reply,
  Forward,
  Loader2
} from 'lucide-react';

// Mock data
const mockChannels = [
  { id: 'general', name: 'general', unread: 0, type: 'channel' },
  { id: 'announcements', name: 'announcements', unread: 3, type: 'channel' },
  { id: 'development', name: 'development', unread: 0, type: 'channel' },
  { id: 'support', name: 'support', unread: 12, type: 'channel' }
];

const mockDirectMessages = [
  { 
    id: 'dm1', 
    user: 'Maria Garcia', 
    avatar: 'MG',
    status: 'online',
    lastMessage: 'Sure, I\'ll check the invoice',
    timestamp: '10:30 AM',
    unread: 2
  },
  { 
    id: 'dm2', 
    user: 'Carlos Rodriguez', 
    avatar: 'CR',
    status: 'away',
    lastMessage: 'The report is ready for review',
    timestamp: 'Yesterday',
    unread: 0
  },
  { 
    id: 'dm3', 
    user: 'Ana Martinez', 
    avatar: 'AM',
    status: 'offline',
    lastMessage: 'Thanks for the update!',
    timestamp: '2 days ago',
    unread: 0
  }
];

const mockMessages = [
  {
    id: '1',
    sender: 'Maria Garcia',
    avatar: 'MG',
    content: 'Hey team! I just uploaded the new invoice templates to the shared folder.',
    timestamp: '10:28 AM',
    reactions: [{ emoji: '👍', count: 2 }, { emoji: '✅', count: 1 }],
    attachments: [
      { name: 'invoice-template-v2.xlsx', size: '245 KB', type: 'spreadsheet' }
    ]
  },
  {
    id: '2',
    sender: 'You',
    avatar: 'YO',
    content: 'Great! I\'ll review them this afternoon.',
    timestamp: '10:29 AM',
    reactions: [],
    attachments: []
  },
  {
    id: '3',
    sender: 'Maria Garcia',
    avatar: 'MG',
    content: 'Sure, I\'ll check the invoice and let you know if there are any issues.',
    timestamp: '10:30 AM',
    reactions: [],
    attachments: []
  }
];

const MailView = () => {
  const [selectedChannel, setSelectedChannel] = useState('general');
  const [selectedDM, setSelectedDM] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const currentChat = selectedDM 
    ? mockDirectMessages.find(dm => dm.id === selectedDM)?.user 
    : `#${selectedChannel}`;

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      console.log('Sending:', messageInput);
      setMessageInput('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-400';
      case 'away': return 'bg-yellow-400';
      default: return 'bg-gray-400';
    }
  };

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-72 bg-surface border-r border-white/10 flex flex-col">
        {/* Workspace Header */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Forvara Mail</h2>
            <button className="p-1.5 hover:bg-white/5 rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-text/70" />
            </button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text/50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search messages..."
              className="w-full pl-10 pr-4 py-2 bg-background rounded-lg border border-white/10 focus:border-primary focus:outline-none text-sm"
            />
          </div>
        </div>

        {/* Channels */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-text/70">Channels</h3>
              <button className="p-1 hover:bg-white/5 rounded transition-colors">
                <Plus className="w-4 h-4 text-text/50" />
              </button>
            </div>
            
            <div className="space-y-1">
              {mockChannels.map(channel => (
                <button
                  key={channel.id}
                  onClick={() => {
                    setSelectedChannel(channel.id);
                    setSelectedDM(null);
                  }}
                  className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg transition-all text-left ${
                    selectedChannel === channel.id && !selectedDM
                      ? 'bg-primary/20 text-primary' 
                      : 'hover:bg-white/5 text-text/80'
                  }`}
                >
                  <Hash className="w-4 h-4" />
                  <span className="flex-1">{channel.name}</span>
                  {channel.unread > 0 && (
                    <span className="px-2 py-0.5 bg-accent/20 text-accent rounded-full text-xs">
                      {channel.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Direct Messages */}
          <div className="p-4 pt-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-text/70">Direct Messages</h3>
              <button className="p-1 hover:bg-white/5 rounded transition-colors">
                <Plus className="w-4 h-4 text-text/50" />
              </button>
            </div>
            
            <div className="space-y-1">
              {mockDirectMessages.map(dm => (
                <button
                  key={dm.id}
                  onClick={() => {
                    setSelectedDM(dm.id);
                    setSelectedChannel('');
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-all text-left ${
                    selectedDM === dm.id 
                      ? 'bg-primary/20 text-primary' 
                      : 'hover:bg-white/5 text-text/80'
                  }`}
                >
                  <div className="relative">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center text-xs font-medium">
                      {dm.avatar}
                    </div>
                    <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 ${getStatusColor(dm.status)} rounded-full border-2 border-surface`}></div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{dm.user}</p>
                    <p className="text-xs text-text/50 truncate">{dm.lastMessage}</p>
                  </div>
                  {dm.unread > 0 && (
                    <span className="px-2 py-0.5 bg-accent/20 text-accent rounded-full text-xs">
                      {dm.unread}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* User Status */}
        <div className="p-4 border-t border-white/10">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors">
            <div className="relative">
              <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-400 rounded-full border-2 border-surface"></div>
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-medium">You</p>
              <p className="text-xs text-text/50">Active</p>
            </div>
            <ChevronDown className="w-4 h-4 text-text/50" />
          </button>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {/* Chat Header */}
        <div className="h-16 px-6 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold">{currentChat}</h2>
            {selectedDM && (
              <span className="text-sm text-text/60">Active now</span>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-text/70" />
            </button>
            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
              <Users className="w-5 h-5 text-text/70" />
            </button>
            <button className="p-2 hover:bg-white/5 rounded-lg transition-colors">
              <MoreVertical className="w-5 h-5 text-text/70" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {mockMessages.map(message => (
              <div key={message.id} className="flex gap-3 group">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0">
                  {message.avatar}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-baseline gap-2 mb-1">
                    <span className="font-medium">{message.sender}</span>
                    <span className="text-xs text-text/50">{message.timestamp}</span>
                  </div>
                  
                  <div className="text-text/90">{message.content}</div>
                  
                  {message.attachments.length > 0 && (
                    <div className="mt-3 space-y-2">
                      {message.attachments.map((attachment, idx) => (
                        <div key={idx} className="inline-flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                          <FileText className="w-5 h-5 text-primary" />
                          <div>
                            <p className="text-sm font-medium">{attachment.name}</p>
                            <p className="text-xs text-text/50">{attachment.size}</p>
                          </div>
                          <button className="ml-4 text-xs text-primary hover:text-primary/80">
                            Download
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {message.reactions.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      {message.reactions.map((reaction, idx) => (
                        <button key={idx} className="flex items-center gap-1 px-2 py-1 bg-white/5 hover:bg-white/10 rounded-full text-sm transition-colors">
                          <span>{reaction.emoji}</span>
                          <span className="text-xs text-text/70">{reaction.count}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  
                  {/* Message Actions */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 mt-1">
                    <button className="p-1 hover:bg-white/5 rounded text-text/50 hover:text-text/70">
                      <Smile className="w-4 h-4" />
                    </button>
                    <button className="p-1 hover:bg-white/5 rounded text-text/50 hover:text-text/70">
                      <Reply className="w-4 h-4" />
                    </button>
                    <button className="p-1 hover:bg-white/5 rounded text-text/50 hover:text-text/70">
                      <Forward className="w-4 h-4" />
                    </button>
                    <button className="p-1 hover:bg-white/5 rounded text-text/50 hover:text-text/70">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Typing Indicator */}
        {isTyping && (
          <div className="px-6 py-2 text-sm text-text/60">
            Maria is typing...
          </div>
        )}

        {/* Message Input */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-end gap-3">
            <div className="flex-1 bg-surface rounded-lg border border-white/10 focus-within:border-primary transition-colors">
              <textarea
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Message ${currentChat}`}
                className="w-full px-4 py-3 bg-transparent resize-none focus:outline-none"
                rows={1}
              />
              
              {/* Input Actions */}
              <div className="flex items-center gap-2 px-3 pb-3">
                <button className="p-1.5 hover:bg-white/5 rounded-lg transition-colors">
                  <Paperclip className="w-5 h-5 text-text/50" />
                </button>
                <button 
                  onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                  className="p-1.5 hover:bg-white/5 rounded-lg transition-colors"
                >
                  <Smile className="w-5 h-5 text-text/50" />
                </button>
                <button className="p-1.5 hover:bg-white/5 rounded-lg transition-colors">
                  <Image className="w-5 h-5 text-text/50" />
                </button>
              </div>
            </div>
            
            <button
              onClick={handleSendMessage}
              disabled={!messageInput.trim()}
              className="p-3 bg-primary hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed rounded-lg transition-colors"
            >
              <Send className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MailView;
