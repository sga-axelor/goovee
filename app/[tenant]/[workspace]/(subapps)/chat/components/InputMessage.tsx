import React, {useRef, useEffect, useState} from 'react';
import {Send, Paperclip} from 'lucide-react';

const InputMessage = ({
  messageText,
  setMessageText,
  fileInputRef,
  handleFileSelect,
  triggerFileInput,
  isSendEnabled,
  handleMessageSend,
  chatContainerRef,
}: {
  messageText: string;
  setMessageText: (value: string) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  triggerFileInput: () => void;
  isSendEnabled: boolean;
  handleMessageSend: () => void;
  chatContainerRef: React.RefObject<HTMLDivElement>; // Nouvelle prop
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [textareaHeight, setTextareaHeight] = useState<number>(20);

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
      const previousHeight = textarea.style.height;
      textarea.style.height = 'auto';
      const scrollHeight = textarea.scrollHeight;
      const newHeight = Math.max(
        MIN_HEIGHT,
        Math.min(scrollHeight, MAX_HEIGHT),
      );
      textarea.style.height = `${newHeight}px`;

      if (newHeight !== parseInt(previousHeight)) {
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

  const handleSendMessage = () => {
    handleMessageSend();
    setTextareaHeight(MIN_HEIGHT);
  };

  return (
    <div className="flex items-end bg-gray-100 rounded-lg p-2">
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
      <Send
        size={20}
        className={`cursor-pointer transition-colors duration-200 ${
          isSendEnabled ? 'text-blue-500' : 'text-gray-400'
        }`}
        onClick={handleSendMessage}
      />
    </div>
  );
};

export default InputMessage;
