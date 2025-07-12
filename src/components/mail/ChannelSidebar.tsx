import React, { useState } from 'react';
import { Hash, Lock, Plus, ChevronDown, ChevronRight, MessageCircle, Settings } from 'lucide-react';
import { useMailStore } from '../../stores/mailStore';
import { useTenantStore } from '../../stores/tenantStore';
import CreateChannelModal from './CreateChannelModal';

const ChannelSidebar: React.FC = () => {
  const { 
    channels, 
    directMessages, 
    selectedChannelId, 
    selectChannel,
    clearError 
  } = useMailStore();
  
  const { currentTenant } = useTenantStore();
  const [showChannels, setShowChannels] = useState(true);
  const [showDMs, setShowDMs] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const getChannelIcon = (channel: any) => {
    if (channel.is_private) {
      return <Lock className="w-4 h-4 text-gray-500" />;
    }
    return <Hash className="w-4 h-4 text-gray-500" />;
  };

  const getUnreadBadge = (count?: number) => {
    if (!count || count === 0) return null;
    
    return (
      <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
        {count > 99 ? '99+' : count}
      </span>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Workspace header */}
      <div className="p-4 border-b border-gray-200 bg-white">
        <h1 className="text-lg font-semibold text-gray-900 truncate">
          ForvaraMail
        </h1>
        <p className="text-sm text-gray-600 truncate">
          {currentTenant?.nombre || 'Business Communication'}
        </p>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        {/* Channels Section */}
        <div className="p-3">
          <div 
            className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-md cursor-pointer"
            onClick={() => setShowChannels(!showChannels)}
          >
            <div className="flex items-center space-x-2">
              {showChannels ? 
                <ChevronDown className="w-4 h-4 text-gray-600" /> : 
                <ChevronRight className="w-4 h-4 text-gray-600" />
              }
              <span className="text-sm font-medium text-gray-900">Canales</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowCreateModal(true);
                clearError();
              }}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <Plus className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {showChannels && (
            <div className="ml-2 space-y-1">
              {channels.map((channel) => (
                <div
                  key={channel.id}
                  onClick={() => selectChannel(channel.id)}
                  className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-100 ${
                    selectedChannelId === channel.id ? 'bg-blue-50 border border-blue-200 text-blue-900' : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    {getChannelIcon(channel)}
                    <span className="text-sm truncate">{channel.name}</span>
                  </div>
                  {getUnreadBadge(channel.unread_count)}
                </div>
              ))}

              {channels.length === 0 && (
                <div className="p-2 text-sm text-gray-500 italic">
                  No channels yet. Create your first channel!
                </div>
              )}
            </div>
          )}
        </div>

        {/* Direct Messages Section */}
        <div className="p-3">
          <div 
            className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-md cursor-pointer"
            onClick={() => setShowDMs(!showDMs)}
          >
            <div className="flex items-center space-x-2">
              {showDMs ? 
                <ChevronDown className="w-4 h-4 text-gray-600" /> : 
                <ChevronRight className="w-4 h-4 text-gray-600" />
              }
              <span className="text-sm font-medium text-gray-900">Mensajes directos</span>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                // TODO: Implement start DM functionality
              }}
              className="p-1 hover:bg-gray-200 rounded"
            >
              <Plus className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {showDMs && (
            <div className="ml-2 space-y-1">
              {directMessages.map((dm) => (
                <div
                  key={dm.id}
                  onClick={() => selectChannel(dm.id)}
                  className={`flex items-center justify-between p-2 rounded-md cursor-pointer hover:bg-gray-100 ${
                    selectedChannelId === dm.id ? 'bg-blue-50 border border-blue-200 text-blue-900' : 'text-gray-700'
                  }`}
                >
                  <div className="flex items-center space-x-2 flex-1 min-w-0">
                    <MessageCircle className="w-4 h-4 text-gray-500" />
                    <span className="text-sm truncate">
                      {/* TODO: Show participant names */}
                      Mensaje directo
                    </span>
                  </div>
                  {getUnreadBadge(dm.unread_count)}
                </div>
              ))}

              {directMessages.length === 0 && (
                <div className="p-2 text-sm text-gray-500 italic">
                  No direct messages yet.
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* User info at bottom */}
      <div className="p-3 border-t border-gray-200 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 min-w-0">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-sm font-medium text-white">
                {currentTenant?.nombre?.charAt(0) || 'F'}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {currentTenant?.nombre || 'Usuario'}
              </p>
              <p className="text-xs text-gray-500">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                Activo
              </p>
            </div>
          </div>
          <button className="p-1 hover:bg-gray-100 rounded">
            <Settings className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Create Channel Modal */}
      {showCreateModal && (
        <CreateChannelModal 
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
        />
      )}
    </div>
  );
};

export default ChannelSidebar;