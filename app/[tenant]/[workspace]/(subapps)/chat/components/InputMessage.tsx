import React, {useRef, useEffect, useState} from 'react';
import {Send, Paperclip, Type, X} from 'lucide-react';
import FormattingToolbar from './formatBar';

const InputMessage = ({
  messageText,
  setMessageText,
  fileInputRef,
  handleFileSelect,
  triggerFileInput,
  isSendEnabled,
  handleMessageSend,
  chatContainerRef,
  postReply,
  setPostReply,
}: {
  messageText: string;
  setMessageText: (value: string) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  triggerFileInput: () => void;
  isSendEnabled: boolean;
  handleMessageSend: () => void;
  chatContainerRef: React.RefObject<HTMLDivElement>;
  postReply: any;
  setPostReply: (post: any) => void;
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [textareaHeight, setTextareaHeight] = useState(20);
  const [showFormatting, setShowFormatting] = useState(false);
  const MIN_HEIGHT = 20;
  const MAX_HEIGHT = 150;

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    if (chatContainer) {
      const {scrollTop, scrollHeight, clientHeight} = chatContainer;
      const isScrolledToBottom = scrollHeight - scrollTop === clientHeight;
      adjustTextareaHeight();
      if (isScrolledToBottom) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }
  }, [messageText]);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      const currentHeight = textarea.style.height;
      textarea.style.height = `${MIN_HEIGHT}px`;
      const scrollHeight = textarea.scrollHeight;
      const newHeight = Math.max(
        MIN_HEIGHT,
        Math.min(scrollHeight, MAX_HEIGHT),
      );
      textarea.style.height = `${newHeight}px`;
      if (newHeight !== parseInt(currentHeight)) {
        setTextareaHeight(newHeight);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleMessageSend();
    }
  };

  const toggleFormatting = () => {
    setShowFormatting(!showFormatting);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 0);
  };

  const handleCancelReply = () => {
    setPostReply(null);
  };

  return (
    <div className="p-4 border-t">
      {postReply && (
        <div className="mb-2 p-2 bg-gray-200 rounded-lg flex justify-between items-center">
          <div className="truncate">Réponse à : {postReply.message}</div>
          <X
            size={16}
            className="text-gray-500 cursor-pointer"
            onClick={handleCancelReply}
          />
        </div>
      )}
      <div className="flex flex-col bg-gray-100 rounded-lg p-2">
        <div className="flex items-end">
          <textarea
            ref={textareaRef}
            placeholder="Écrire un message..."
            className="flex-grow bg-transparent focus:outline-none resize-none overflow-y-auto"
            value={messageText}
            onChange={e => setMessageText(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{
              height: `${textareaHeight}px`,
              minHeight: `${MIN_HEIGHT}px`,
              maxHeight: `${MAX_HEIGHT}px`,
            }}
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
          <Type
            size={20}
            className="text-gray-400 cursor-pointer mr-2"
            onClick={toggleFormatting}
          />
          <Send
            size={20}
            className={`cursor-pointer transition-colors duration-200 ${
              isSendEnabled ? 'text-blue-500' : 'text-gray-400'
            }`}
            onClick={handleMessageSend}
          />
        </div>
        {showFormatting && (
          <FormattingToolbar
            textareaRef={textareaRef}
            messageText={messageText}
            setMessageText={setMessageText}
          />
        )}
      </div>
    </div>
  );
};

export default InputMessage;
