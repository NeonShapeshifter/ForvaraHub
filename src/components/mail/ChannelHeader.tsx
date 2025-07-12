import React, { useState } from 'react';
import { Hash, Lock, Users, Star, Info, Search, Phone, Video } from 'lucide-react';
import { useMailStore } from '../../stores/mailStore';

interface ChannelHeaderProps {
  channelId: string;
}

const ChannelHeader: React.FC<ChannelHeaderProps> = ({ channelId }) => {
  const { channels } = useMailStore();
  const [showSearch, setShowSearch] = useState(false);
  
  const channel = channels.find(c => c.id === channelId);
  
  if (!channel) {
    return (
      <div className="h-16 border-b border-gray-200 bg-white px-4 flex items-center">
        <div className="text-gray-500">Channel not found</div>
      </div>
    );
  }

  const getChannelIcon = () => {
    if (channel.is_private) {
      return <Lock className="w-5 h-5 text-gray-600" />;
    }
    return <Hash className="w-5 h-5 text-gray-600" />;
  };

  const getChannelTypeLabel = () => {
    const typeLabels = {
      general: 'General',
      project: 'Proyecto',
      department: 'Departamento',
      announcement: 'Anuncios',
      direct: 'Mensaje directo'
    };
    return typeLabels[channel.type] || 'Canal';
  };

  return (
    <div className="h-16 border-b border-gray-200 bg-white px-4 flex items-center justify-between">
      {/* Left side - Channel info */}
      <div className="flex items-center space-x-3 flex-1 min-w-0">
        {getChannelIcon()}
        
        <div className="min-w-0 flex-1">
          <div className="flex items-center space-x-2">
            <h1 className="text-lg font-semibold text-gray-900 truncate">
              {channel.name}
            </h1>
            
            {/* Channel type badge */}
            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {getChannelTypeLabel()}
            </span>
            
            {/* Member count */}
            {channel.member_count && (
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <Users className="w-4 h-4" />
                <span>{channel.member_count}</span>
              </div>
            )}
          </div>
          
          {/* Channel description */}
          {channel.description && (
            <p className="text-sm text-gray-600 truncate mt-1">
              {channel.description}
            </p>
          )}
        </div>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center space-x-2">
        {/* Search toggle */}
        <button
          onClick={() => setShowSearch(!showSearch)}
          className={`p-2 rounded hover:bg-gray-100 ${showSearch ? 'bg-gray-100' : ''}`}
          title="Buscar en el canal"
        >
          <Search className="w-5 h-5 text-gray-600" />
        </button>

        {/* Voice call (placeholder) */}
        <button
          className="p-2 rounded hover:bg-gray-100"
          title="Llamada de voz"
          onClick={() => alert('Llamadas de voz próximamente')}
        >
          <Phone className="w-5 h-5 text-gray-600" />
        </button>

        {/* Video call (placeholder) */}
        <button
          className="p-2 rounded hover:bg-gray-100"
          title="Videollamada"
          onClick={() => alert('Videollamadas próximamente')}
        >
          <Video className="w-5 h-5 text-gray-600" />
        </button>

        {/* Channel info */}
        <button
          className="p-2 rounded hover:bg-gray-100"
          title="Información del canal"
          onClick={() => alert('Panel de información próximamente')}
        >
          <Info className="w-5 h-5 text-gray-600" />
        </button>

        {/* Star/Favorite (placeholder) */}
        <button
          className="p-2 rounded hover:bg-gray-100"
          title="Marcar como favorito"
          onClick={() => alert('Favoritos próximamente')}
        >
          <Star className="w-5 h-5 text-gray-600" />
        </button>
      </div>

      {/* Search bar (when active) */}
      {showSearch && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-gray-200 p-4 z-10">
          <div className="max-w-2xl mx-auto">
            <input
              type="text"
              placeholder={`Buscar en #${channel.name}...`}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              autoFocus
            />
            <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
              <span>Presiona Enter para buscar</span>
              <button
                onClick={() => setShowSearch(false)}
                className="text-blue-600 hover:text-blue-800"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChannelHeader;