import React from 'react';
import { MailMessage } from '../../stores/mailStore';
import MessageItem from './MessageItem';

interface MessageListProps {
  messages: MailMessage[];
  channelId: string;
}

const MessageList: React.FC<MessageListProps> = ({ messages, channelId }) => {
  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <div className="text-4xl mb-4">💬</div>
          <p className="text-lg font-medium mb-2">No messages yet</p>
          <p className="text-sm">Be the first to send a message in this channel!</p>
        </div>
      </div>
    );
  }

  // Group messages by sender and time (similar to Slack)
  const groupedMessages = groupMessages(messages);

  return (
    <div className="space-y-1 p-4">
      {groupedMessages.map((group, index) => (
        <MessageGroup 
          key={`group-${index}`}
          messages={group}
          channelId={channelId}
        />
      ))}
    </div>
  );
};

interface MessageGroupProps {
  messages: MailMessage[];
  channelId: string;
}

const MessageGroup: React.FC<MessageGroupProps> = ({ messages, channelId }) => {
  const firstMessage = messages[0];
  
  return (
    <div className="group hover:bg-gray-50 -mx-4 px-4 py-2">
      {/* First message with full header */}
      <MessageItem 
        message={firstMessage}
        channelId={channelId}
        showAvatar={true}
        showTimestamp={true}
        isGroupStart={true}
      />
      
      {/* Subsequent messages in the group (condensed) */}
      {messages.slice(1).map((message) => (
        <MessageItem
          key={message.id}
          message={message}
          channelId={channelId}
          showAvatar={false}
          showTimestamp={false}
          isGroupStart={false}
        />
      ))}
    </div>
  );
};

// Helper function to group messages (similar to Slack's grouping logic)
function groupMessages(messages: MailMessage[]): MailMessage[][] {
  const groups: MailMessage[][] = [];
  let currentGroup: MailMessage[] = [];
  
  messages.forEach((message, index) => {
    const prevMessage = messages[index - 1];
    
    // Start a new group if:
    // 1. It's the first message
    // 2. Different sender
    // 3. More than 5 minutes apart
    // 4. Previous message was edited/deleted
    const shouldStartNewGroup = 
      !prevMessage ||
      prevMessage.sender_id !== message.sender_id ||
      isMoreThanFiveMinutesApart(prevMessage.created_at, message.created_at) ||
      prevMessage.is_edited ||
      prevMessage.deleted_at;
    
    if (shouldStartNewGroup) {
      if (currentGroup.length > 0) {
        groups.push(currentGroup);
      }
      currentGroup = [message];
    } else {
      currentGroup.push(message);
    }
  });
  
  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }
  
  return groups;
}

function isMoreThanFiveMinutesApart(time1: string, time2: string): boolean {
  const date1 = new Date(time1);
  const date2 = new Date(time2);
  const diffMs = Math.abs(date2.getTime() - date1.getTime());
  const diffMinutes = diffMs / (1000 * 60);
  return diffMinutes > 5;
}

export default MessageList;