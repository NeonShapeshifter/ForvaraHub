import React, { useEffect } from 'react';
import { useMailStore } from '../stores/mailStore';
import ChannelSidebar from '../components/mail/ChannelSidebar';
import MessageArea from '../components/mail/MessageArea';
import WelcomePane from '../components/mail/WelcomePane';

const Mail: React.FC = () => {
  const { 
    selectedChannelId, 
    loadChannels, 
    loadDirectMessages,
    isLoading,
    error 
  } = useMailStore();

  useEffect(() => {
    // Load initial data when component mounts
    loadChannels();
    loadDirectMessages();
  }, [loadChannels, loadDirectMessages]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading ForvaraMail...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-2">⚠️ Error</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full bg-white">
      {/* ForvaraHub-style sidebar */}
      <div className="w-72 bg-gray-50 border-r border-gray-200 flex-shrink-0">
        <ChannelSidebar />
      </div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedChannelId ? (
          <MessageArea channelId={selectedChannelId} />
        ) : (
          <WelcomePane />
        )}
      </div>
    </div>
  );
};

export default Mail;