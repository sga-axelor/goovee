'use client';

import React, {useRef, useEffect, useState} from 'react';
import {SendHorizontal, Paperclip, Type, X, Eye, EyeOff} from 'lucide-react';
import {MarkdownRenderer, FormattingToolbar} from '../../atoms';
import {Post} from '../../../types/types';

export const InputMessage = ({
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
  setPostReply: (post: Post) => void;
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [textareaHeight, setTextareaHeight] = useState(20);
  const [showFormatting, setShowFormatting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);
  const MIN_HEIGHT = 20;
  const MAX_HEIGHT = 150;

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const focusInterval = setInterval(() => {
      if (
        textareaRef.current &&
        document.activeElement !== textareaRef.current
      ) {
        textareaRef.current.focus();
      }
    }, 100);

    return () => clearInterval(focusInterval);
  }, []);

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
  }, [messageText, chatContainerRef]);

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

  const onClickSend = () => {
    handleMessageSend();
    setShowPreview(false);
  };

  const handleKeyPress = (
    e: React.KeyboardEvent<HTMLTextAreaElement | HTMLDivElement>,
  ) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleMessageSend();
      setShowPreview(false);
    }
  };

  const toggleFormatting = () => {
    setShowFormatting(!showFormatting);
    setShowPreview(false);
    setTimeout(() => {
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }, 0);
  };

  const togglePreview = () => {
    setShowPreview(!showPreview);
    setTimeout(() => {
      if (showPreview) {
        textareaRef.current?.focus();
      } else {
        previewRef.current?.focus();
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
          {!showPreview ? (
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
          ) : (
            <div
              ref={previewRef}
              className="flex-grow bg-transparent focus:outline-none resize-none overflow-y-auto"
              style={{maxHeight: `${MAX_HEIGHT}px`}}
              tabIndex={0}
              onKeyPress={handleKeyPress}>
              <MarkdownRenderer content={messageText} />
            </div>
          )}
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
            className={`text-gray-400 cursor-pointer mr-2 ${
              showFormatting ? 'text-blue-500' : ''
            }`}
            onClick={toggleFormatting}
          />
          {showPreview ? (
            <EyeOff
              size={20}
              className={`text-gray-400 cursor-pointer mr-2 ${
                showPreview ? 'text-blue-500' : ''
              }`}
              onClick={togglePreview}
            />
          ) : (
            <Eye
              size={20}
              className={`text-gray-400 cursor-pointer mr-2 ${
                showPreview ? 'text-blue-500' : ''
              }`}
              onClick={togglePreview}
            />
          )}
          <SendHorizontal
            size={20}
            className={`cursor-pointer transition-colors duration-200 ${
              isSendEnabled ? 'text-blue-500' : 'text-gray-400'
            }`}
            onClick={onClickSend}
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
