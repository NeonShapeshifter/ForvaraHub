import React, { useEffect, useState } from 'react';
import { useMailStore } from '../../stores/mailStore';

interface TypingIndicatorProps {
  channelId: string;
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ channelId }) => {
  const { typingUsers } = useMailStore();
  const [visibleTypers, setVisibleTypers] = useState<string[]>([]);

  // Filter typing users for this channel and remove old ones
  useEffect(() => {
    const channelTypers = typingUsers
      .filter(typer => typer.channelId === channelId)
      .filter(typer => Date.now() - typer.timestamp < 5000) // Remove after 5 seconds
      .map(typer => typer.userName);

    setVisibleTypers(channelTypers);
  }, [typingUsers, channelId]);

  if (visibleTypers.length === 0) {
    return null;
  }

  const formatTypingText = () => {
    if (visibleTypers.length === 1) {
      return `${visibleTypers[0]} está escribiendo...`;
    } else if (visibleTypers.length === 2) {
      return `${visibleTypers[0]} y ${visibleTypers[1]} están escribiendo...`;
    } else {
      return `${visibleTypers[0]} y ${visibleTypers.length - 1} más están escribiendo...`;
    }
  };

  return (
    <div className="px-4 py-2 text-sm text-gray-500 italic">
      <div className="flex items-center space-x-2">
        {/* Animated dots */}
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
        <span>{formatTypingText()}</span>
      </div>
    </div>
  );
};

export default TypingIndicator;