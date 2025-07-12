import React, { useState } from 'react';
import { formatDistanceToNow, format } from 'date-fns';
import { es } from 'date-fns/locale';
import { MoreVertical, Edit, Trash2, Smile, Reply, File, Download } from 'lucide-react';
import { MailMessage } from '../../stores/mailStore';
import { useMailStore } from '../../stores/mailStore';
import { useAuthStore } from '../../stores/authStore';

interface MessageItemProps {
  message: MailMessage;
  channelId: string;
  showAvatar: boolean;
  showTimestamp: boolean;
  isGroupStart: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ 
  message, 
  channelId, 
  showAvatar, 
  showTimestamp, 
  isGroupStart 
}) => {
  const { editMessage, deleteMessage, addReaction } = useMailStore();
  const { user } = useAuthStore();
  const [showActions, setShowActions] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(message.content);

  const isOwnMessage = user?.id === message.sender_id;
  const messageTime = new Date(message.created_at);

  const handleEdit = async () => {
    if (editContent.trim() && editContent !== message.content) {
      await editMessage(message.id, editContent.trim());
      setIsEditing(false);
    } else {
      setIsEditing(false);
      setEditContent(message.content);
    }
  };

  const handleDelete = async () => {
    if (confirm('¿Estás seguro de que quieres eliminar este mensaje?')) {
      await deleteMessage(message.id);
    }
  };

  const handleReaction = async (emoji: string) => {
    await addReaction(message.id, emoji);
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return format(date, 'HH:mm');
    } else {
      return format(date, 'dd/MM/yyyy HH:mm');
    }
  };

  const getUserInitials = (sender: any) => {
    if (!sender) return '?';
    const firstName = sender.nombre || '';
    const lastName = sender.apellido || '';
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() || '?';
  };

  const getUserDisplayName = (sender: any) => {
    if (!sender) return 'Usuario desconocido';
    return `${sender.nombre || ''} ${sender.apellido || ''}`.trim() || 'Usuario';
  };

  if (message.deleted_at) {
    return (
      <div className="flex items-center text-gray-400 italic text-sm py-1">
        <span className="ml-10">Mensaje eliminado</span>
      </div>
    );
  }

  return (
    <div 
      className={`flex hover:bg-gray-50 -mx-4 px-4 relative group ${isGroupStart ? 'pt-2' : 'py-1'}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar area */}
      <div className="w-10 mr-3 flex-shrink-0">
        {showAvatar ? (
          <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center">
            {message.sender?.avatar_url ? (
              <img 
                src={message.sender.avatar_url} 
                alt={getUserDisplayName(message.sender)}
                className="w-8 h-8 rounded object-cover"
              />
            ) : (
              <span className="text-white text-sm font-medium">
                {getUserInitials(message.sender)}
              </span>
            )}
          </div>
        ) : (
          <div className="w-8 h-8 flex items-center justify-center opacity-0 group-hover:opacity-100">
            <span className="text-xs text-gray-400">
              {format(messageTime, 'HH:mm')}
            </span>
          </div>
        )}
      </div>

      {/* Message content */}
      <div className="flex-1 min-w-0">
        {/* Header with name and timestamp */}
        {showTimestamp && (
          <div className="flex items-center space-x-2 mb-1">
            <span className="font-medium text-gray-900">
              {getUserDisplayName(message.sender)}
            </span>
            <span className="text-xs text-gray-500">
              {formatTime(messageTime)}
            </span>
            {message.is_edited && (
              <span className="text-xs text-gray-400 italic">(editado)</span>
            )}
          </div>
        )}

        {/* Message text */}
        {isEditing ? (
          <div className="mt-1">
            <textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleEdit();
                } else if (e.key === 'Escape') {
                  setIsEditing(false);
                  setEditContent(message.content);
                }
              }}
              autoFocus
            />
            <div className="flex justify-end space-x-2 mt-2">
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditContent(message.content);
                }}
                className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800"
              >
                Cancelar
              </button>
              <button
                onClick={handleEdit}
                className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                Guardar
              </button>
            </div>
          </div>
        ) : (
          <div className="text-sm text-gray-900 break-words">
            {/* Render message content with mentions highlighted */}
            <MessageContent content={message.content} mentions={message.mentions} />
            
            {/* Attachments */}
            {message.attachments && message.attachments.length > 0 && (
              <div className="mt-2 space-y-2">
                {message.attachments.map((attachment) => (
                  <AttachmentPreview key={attachment.id} attachment={attachment} />
                ))}
              </div>
            )}

            {/* Reactions */}
            {message.reactions && message.reactions.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {message.reactions.map((reaction) => (
                  <button
                    key={reaction.emoji}
                    onClick={() => handleReaction(reaction.emoji)}
                    className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs border ${
                      reaction.reacted_by_me 
                        ? 'bg-blue-100 border-blue-300 text-blue-800' 
                        : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <span>{reaction.emoji}</span>
                    <span>{reaction.count}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Message actions (shown on hover) */}
      {showActions && !isEditing && (
        <div className="absolute top-0 right-4 flex items-center space-x-1 bg-white border border-gray-200 rounded shadow-sm">
          <button
            onClick={() => handleReaction('👍')}
            className="p-1 hover:bg-gray-100 rounded"
            title="Reaccionar"
          >
            <Smile className="w-4 h-4 text-gray-600" />
          </button>
          
          {isOwnMessage && (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 hover:bg-gray-100 rounded"
                title="Editar"
              >
                <Edit className="w-4 h-4 text-gray-600" />
              </button>
              <button
                onClick={handleDelete}
                className="p-1 hover:bg-gray-100 rounded"
                title="Eliminar"
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </button>
            </>
          )}
          
          <button
            className="p-1 hover:bg-gray-100 rounded"
            title="Más opciones"
          >
            <MoreVertical className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      )}
    </div>
  );
};

// Helper component for rendering message content with mentions
const MessageContent: React.FC<{ content: string; mentions?: string[] }> = ({ content, mentions }) => {
  if (!mentions || mentions.length === 0) {
    return <span>{content}</span>;
  }

  // Simple mention highlighting (can be enhanced)
  let highlightedContent = content;
  mentions.forEach(mention => {
    const regex = new RegExp(`@${mention}`, 'gi');
    highlightedContent = highlightedContent.replace(
      regex, 
      `<span class="bg-blue-100 text-blue-800 px-1 rounded">@${mention}</span>`
    );
  });

  return <span dangerouslySetInnerHTML={{ __html: highlightedContent }} />;
};

// Helper component for attachment previews
const AttachmentPreview: React.FC<{ attachment: any }> = ({ attachment }) => {
  const isImage = attachment.mime_type?.startsWith('image/');
  const formatFileSize = (bytes: number) => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    if (bytes === 0) return '0 Bytes';
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (isImage) {
    return (
      <div className="max-w-sm">
        <img 
          src={attachment.url} 
          alt={attachment.original_name}
          className="rounded border cursor-pointer hover:opacity-80"
          onClick={() => window.open(attachment.url, '_blank')}
        />
        <p className="text-xs text-gray-500 mt-1">{attachment.original_name}</p>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-3 p-3 border border-gray-200 rounded bg-gray-50 max-w-sm">
      <File className="w-8 h-8 text-gray-400" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {attachment.original_name}
        </p>
        <p className="text-xs text-gray-500">
          {formatFileSize(attachment.size_bytes)}
        </p>
      </div>
      <a
        href={attachment.url}
        download={attachment.original_name}
        className="p-1 hover:bg-gray-200 rounded"
        title="Descargar"
      >
        <Download className="w-4 h-4 text-gray-600" />
      </a>
    </div>
  );
};

export default MessageItem;