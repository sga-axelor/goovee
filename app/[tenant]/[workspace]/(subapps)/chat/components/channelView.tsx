import React, {useCallback, useEffect, useRef, useState} from 'react';
import {X, Send, Paperclip, Loader} from 'lucide-react';
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
  loadMoreMessages,
}: {
  channel: any;
  token: string;
  onEmojiClick: (name: string, postId: string) => void;
  channelId: string;
  channelJustSelected: boolean;
  setChannelJustSelected: (value: boolean) => void;
  newMessage: boolean;
  setNewMessage: (value: boolean) => void;
  sendMessage: (messageText: string, channelId: string, files?: File[]) => void;
  loadMoreMessages: () => Promise<void>;
}) => {
  if (!channel) {
    return <div>Chargement du canal</div>;
  }
  const [messageText, setMessageText] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const groupsPosts = Object.values(channel.groupsPosts);
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const prevHeightRef = useRef<number>(0);

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

  const isBottom = () => {
    if (messagesRef.current) {
      const scrollThreshold = 150;
      return (
        messagesRef.current.scrollHeight - messagesRef.current.scrollTop <=
        messagesRef.current.clientHeight + scrollThreshold
      );
    }
  };

  const handleScroll = useCallback(() => {
    if (
      messagesRef.current &&
      messagesRef.current.scrollTop === 0 &&
      !isLoading
    ) {
      setIsLoading(true);
      prevHeightRef.current = messagesRef.current.scrollHeight;
      loadMoreMessages().then(() => {
        setIsLoading(false);
      });
    }
  }, [loadMoreMessages, isLoading]);

  useEffect(() => {
    if (messagesRef.current && prevHeightRef.current > 0) {
      const newScrollTop =
        messagesRef.current.scrollHeight - prevHeightRef.current;
      messagesRef.current.scrollTop = newScrollTop;
      prevHeightRef.current = 0;
    }
  }, [channel.groupsPosts]);

  useEffect(() => {
    const currentMessagesRef = messagesRef.current;
    if (currentMessagesRef) {
      currentMessagesRef.addEventListener('scroll', handleScroll);
    }
    return () => {
      if (currentMessagesRef) {
        currentMessagesRef.removeEventListener('scroll', handleScroll);
      }
    };
  }, [handleScroll]);

  useEffect(() => {
    if (channelJustSelected) {
      scrollToBottom('instant');
      setChannelJustSelected(false);
    }
  }, [channelJustSelected, setChannelJustSelected, scrollToBottom]);

  useEffect(() => {
    if (isBottom()) {
      scrollToBottom('smooth');
    }
    setNewMessage(false);
  }, [newMessage, setNewMessage, scrollToBottom, isBottom]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleMessageSend();
    }
  };

  const handleMessageSend = () => {
    if (messageText.trim() !== '' || selectedFiles.length > 0) {
      sendMessage(messageText, channelId, selectedFiles);
      setMessageText('');
      setSelectedFiles([]);
      if (inputRef.current) {
        inputRef.current.focus();
      }
      scrollToBottom('smooth');
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const newFiles = Array.from(event.target.files);
      setSelectedFiles(prevFiles => [...prevFiles, ...newFiles]);
    }
  };

  const removeFile = (fileToRemove: File) => {
    setSelectedFiles(prevFiles =>
      prevFiles.filter(file => file !== fileToRemove),
    );
  };

  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const isSendEnabled = messageText.trim() !== '' || selectedFiles.length > 0;

  return (
    <div className="flex flex-col h-h-[calc(100vh-120px) bg-white flex-grow">
      <div className="bg-gray-100 p-4 border-b">
        <h2 className="font-semibold text-xl">
          #{channel.channel.display_name}
        </h2>
      </div>
      <div className="flex-grow overflow-y-auto p-4" ref={messagesRef}>
        {isLoading && (
          <div className="flex justify-center items-center py-2">
            <Loader className="animate-spin" />
          </div>
        )}
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
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileSelect}
            multiple
          />
          <Paperclip
            size={20}
            className="text-gray-400 cursor-pointer mr-2"
            onClick={triggerFileInput}
          />
          <Send
            size={20}
            className={`cursor-pointer transition-colors duration-200 ${
              isSendEnabled ? 'text-blue-500' : 'text-gray-400'
            }`}
            onClick={handleMessageSend}
          />
        </div>
        {selectedFiles.length > 0 && (
          <div className="mt-2">
            <h4 className="text-sm font-semibold text-gray-700">
              Fichiers sélectionnés:
            </h4>
            <ul className="list-disc pl-5">
              {selectedFiles.map((file, index) => (
                <li
                  key={index}
                  className="text-sm text-gray-600 flex items-center justify-between">
                  <span>{file.name}</span>
                  <X
                    size={16}
                    className="text-red-500 cursor-pointer"
                    onClick={() => removeFile(file)}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
