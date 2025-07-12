import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile, AtSign } from 'lucide-react';
import { useMailStore } from '../../stores/mailStore';

interface MessageInputProps {
  channelId: string;
}

const MessageInput: React.FC<MessageInputProps> = ({ channelId }) => {
  const { sendMessage, channels } = useMailStore();
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentChannel = channels.find(c => c.id === channelId);
  const channelName = currentChannel?.name || 'channel';

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [message]);

  const handleSendMessage = async () => {
    if (!message.trim() && attachments.length === 0) return;

    try {
      setIsUploading(true);
      await sendMessage(channelId, message.trim(), attachments);
      setMessage('');
      setAttachments([]);
      
      // Reset textarea height
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const validFiles = files.filter(file => file.size <= 25 * 1024 * 1024); // 25MB limit
    
    if (validFiles.length !== files.length) {
      alert('Algunos archivos son demasiado grandes. Límite: 25MB por archivo.');
    }
    
    setAttachments(prev => [...prev, ...validFiles].slice(0, 5)); // Max 5 files
  };

  const removeAttachment = (index: number) => {
    setAttachments(prev => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="p-4 border-t border-gray-200 bg-white">
      {/* File attachments preview */}
      {attachments.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {attachments.map((file, index) => (
            <div 
              key={index}
              className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-2"
            >
              <Paperclip className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-gray-700 truncate max-w-32">
                {file.name}
              </span>
              <span className="text-xs text-gray-500">
                ({formatFileSize(file.size)})
              </span>
              <button
                onClick={() => removeAttachment(index)}
                className="text-red-500 hover:text-red-700 ml-2"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Main input area */}
      <div className="flex items-end space-x-3">
        {/* Message input */}
        <div className="flex-1 relative">
          <div className="border border-gray-300 rounded-lg bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Enviar mensaje a #${channelName}`}
              className="w-full px-4 py-3 resize-none border-0 bg-transparent focus:outline-none placeholder-gray-500"
              rows={1}
              style={{ maxHeight: '120px' }}
              disabled={isUploading}
            />
            
            {/* Input toolbar */}
            <div className="flex items-center justify-between px-4 pb-3">
              <div className="flex items-center space-x-1">
                {/* File attachment */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                  title="Adjuntar archivo"
                  disabled={isUploading || attachments.length >= 5}
                >
                  <Paperclip className="w-4 h-4" />
                </button>
                
                {/* Emoji picker (placeholder) */}
                <button
                  className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                  title="Añadir emoji"
                  disabled={isUploading}
                >
                  <Smile className="w-4 h-4" />
                </button>
                
                {/* Mention (placeholder) */}
                <button
                  className="p-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                  title="Mencionar usuario"
                  disabled={isUploading}
                >
                  <AtSign className="w-4 h-4" />
                </button>
              </div>
              
              {/* Character count and formatting tips */}
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <span>Enter para enviar, Shift+Enter para nueva línea</span>
              </div>
            </div>
          </div>
        </div>

        {/* Send button */}
        <button
          onClick={handleSendMessage}
          disabled={(!message.trim() && attachments.length === 0) || isUploading}
          className={`p-3 rounded-lg font-medium transition-colors ${
            (message.trim() || attachments.length > 0) && !isUploading
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          title="Enviar mensaje"
        >
          {isUploading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Send className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        accept="*/*"
      />

      {/* Usage tips */}
      {message === '' && attachments.length === 0 && (
        <div className="mt-2 text-xs text-gray-400">
          <span className="font-medium">Tip:</span> Usa @usuario para mencionar, /comando para acciones rápidas
        </div>
      )}
    </div>
  );
};

export default MessageInput;