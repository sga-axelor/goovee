import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Send} from 'lucide-react';
import GroupPost from './groupPost';

export const ChannelView = ({
  channel,
  token,
  onEmojiClick,
  channelId,
  channelJustSelected,
  setChannelJustSelected,
  newMessage,
  setNewMessage,
  sendMessage,
}: {
  channel: any;
  token: string;
  onEmojiClick: (name: string, postId: string) => void;
  channelId: string;
  channelJustSelected: boolean;
  setChannelJustSelected: (value: boolean) => void;
  newMessage: boolean;
  setNewMessage: (value: boolean) => void;
  sendMessage: (messageText: string, channelId: string) => void;
}) => {
  if (!channel) {
    return <div>Chargement du canal</div>;
  }

  const [messageText, setMessageText] = useState<string>('');
  const groupsPosts = Object.values(channel.groupsPosts);
  const messagesRef = useRef<HTMLInputElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  console.log('test test channel : ', channel);

  const scrollToBottom = useCallback(
    (behavior: ScrollBehavior, timer = 0) => {
      if (messagesRef && messagesRef.current) {
        messagesRef.current.scrollTo({
          top: messagesRef.current.scrollHeight,
          behavior: behavior,
        });
      }
    },
    [messagesRef],
  );

  console.log('voici les posts : ', channel);

  const isBottom = () => {
    if (messagesRef.current) {
      const scrollThreshold = 100;
      return (
        messagesRef.current.scrollHeight - messagesRef.current.scrollTop <=
        messagesRef.current.clientHeight + scrollThreshold
      );
    }
  };

  useEffect(() => {
    if (channelJustSelected) {
      scrollToBottom('instant');
      setChannelJustSelected(false);
    }
  }, [channelJustSelected, setChannelJustSelected]);

  useEffect(() => {
    if (isBottom()) {
      scrollToBottom('smooth');
    }
    setNewMessage(false);
  }, [newMessage, setNewMessage]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleMessageSend();
    }
  };

  const handleMessageSend = () => {
    if (messageText.trim() !== '') {
      sendMessage(messageText, channelId);
      setMessageText('');
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white flex-grow">
      <div className="bg-gray-100 p-4 border-b">
        <h2 className="font-semibold text-xl">
          #{channel.channel.display_name}
        </h2>
      </div>
      <div className="flex-grow overflow-y-auto p-4" ref={messagesRef}>
        {groupsPosts.map((group: any, i) => (
          <GroupPost
            key={i}
            group={group}
            token={token}
            onEmojiClick={onEmojiClick}
          />
        ))}
      </div>
      <div className="p-4 border-t">
        <div className="flex items-center bg-gray-100 rounded-lg p-2">
          <input
            ref={inputRef}
            type="text"
            placeholder="Écrire un message..."
            className="flex-grow bg-transparent focus:outline-none"
            value={messageText}
            onChange={e => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Send
            size={20}
            className="text-gray-400 cursor-pointer"
            onClick={handleMessageSend}
          />
        </div>
      </div>
    </div>
  );
};
