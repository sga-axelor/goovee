import React from 'react';
import {Send, Paperclip} from 'lucide-react';

const InputMessage = ({
  inputRef,
  messageText,
  handleKeyPress,
  setMessageText,
  fileInputRef,
  handleFileSelect,
  triggerFileInput,
  isSendEnabled,
  handleMessageSend,
}: {
  inputRef: any;
  messageText: any;
  handleKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  setMessageText: (value: string) => void;
  fileInputRef: any;
  handleFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  triggerFileInput: () => void;
  isSendEnabled: boolean;
  handleMessageSend: () => void;
}) => {
  return (
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
  );
};

export default InputMessage;
