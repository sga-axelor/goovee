'use client';

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Loader, ChevronDown, LoaderCircle} from 'lucide-react';
import {DocumentList, ChannelHeader} from '../../atoms';
import {InputMessage} from '../../molecules';
import {GroupPost} from '../groupPost/groupPost';
import {User, File} from '../../../types/types';
import {focusInputMessage} from '../../../utils/focusOnInput';

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
  getPost,
  users,
}: {
  channel: any;
  token: string;
  onEmojiClick: (name: string, postId: string) => void;
  channelId: string;
  channelJustSelected: boolean;
  setChannelJustSelected: (value: boolean) => void;
  newMessage: boolean;
  setNewMessage: (value: boolean) => void;
  sendMessage: (
    messageText: string,
    channelId: string,
    files?: File[],
    postReply?: any,
  ) => void;
  loadMoreMessages: () => Promise<void>;
  getPost: (rootId: string) => void;
  users: User[];
}) => {
  const [messageText, setMessageText] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const groupsPosts = Object.values(channel.groupsPosts);
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoadingOld, setIsLoadingOld] = useState<boolean>(false);
  const prevHeightRef = useRef<number>(0);
  const [showNewMessageIndicator, setShowNewMessageIndicator] =
    useState<boolean>(false);
  const [postReply, setPostReply] = useState<any>(null);
  const [showUserPopup, setShowUserPopup] = useState(false);
  const userPopupRef = useRef<HTMLDivElement>(null);
  const userButtonRef = useRef<HTMLButtonElement>(null);
  const [isChannelReady, setIsChannelReady] = useState<boolean>(false);

  const scrollToBottom = useCallback(
    (behavior: ScrollBehavior) => {
      if (messagesRef && messagesRef.current) {
        setTimeout(() => {
          const scrollHeight = messagesRef.current?.scrollHeight;
          const height = messagesRef.current?.clientHeight;
          const maxScrollTop = scrollHeight! - height!;
          messagesRef.current?.scrollTo({
            top: maxScrollTop > 0 ? maxScrollTop : 0,
            behavior: behavior,
          });
        }, 100);
      }
    },
    [messagesRef],
  );

  const isBottom = useCallback(() => {
    if (messagesRef.current) {
      const scrollThreshold = 150;
      return (
        messagesRef.current.scrollHeight - messagesRef.current.scrollTop <=
        messagesRef.current.clientHeight + scrollThreshold
      );
    }
  }, []);

  const handleScroll = useCallback(() => {
    if (
      messagesRef.current &&
      messagesRef.current.scrollTop === 0 &&
      !isLoadingOld
    ) {
      setIsLoadingOld(true);
      prevHeightRef.current = messagesRef.current.scrollHeight;
      loadMoreMessages().then(() => {
        setIsLoadingOld(false);
      });
    }
  }, [loadMoreMessages, isLoadingOld]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        showUserPopup &&
        userPopupRef.current &&
        userButtonRef.current &&
        !userPopupRef.current.contains(event.target as Node) &&
        !userButtonRef.current.contains(event.target as Node)
      ) {
        setShowUserPopup(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showUserPopup]);

  useEffect(() => {
    if (messagesRef.current && prevHeightRef.current > 0) {
      const newScrollTop =
        messagesRef.current.scrollHeight - prevHeightRef.current;
      messagesRef.current.scrollTop = newScrollTop;
      prevHeightRef.current = 0;
    }
    focusInputMessage();
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
      setIsChannelReady(false);
      setTimeout(() => {
        scrollToBottom('instant');
        setTimeout(() => {
          scrollToBottom('instant');
        }, 50);
      }, 0);
      setTimeout(() => {
        setIsChannelReady(true);
      }, 300);
      setChannelJustSelected(false);
    }
  }, [
    channelJustSelected,
    setChannelJustSelected,
    scrollToBottom,
    channelId,
    token,
    users,
  ]);

  useEffect(() => {
    if (newMessage) {
      setTimeout(() => {
        if (isBottom()) {
          scrollToBottom('smooth');
        } else {
          setShowNewMessageIndicator(true);
        }
      }, 100);
    }
    setNewMessage(false);
  }, [newMessage, setNewMessage, scrollToBottom, isBottom]);

  const handleMessageSend = () => {
    if (messageText.trim() !== '' || selectedFiles.length > 0) {
      sendMessage(messageText, channelId, selectedFiles, postReply);
      setMessageText('');
      setSelectedFiles([]);
      if (inputRef.current) {
        inputRef.current.focus();
      }
      setTimeout(() => {
        scrollToBottom('smooth');
      }, 100);
      setPostReply(null);
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
    focusInputMessage();
  };

  const handleScrollToBottom = () => {
    scrollToBottom('smooth');
    setShowNewMessageIndicator(false);
  };

  const isSendEnabled = messageText.trim() !== '' || selectedFiles.length > 0;

  if (!channel) {
    return <div>Chargement du canal</div>;
  }

  return (
    <div
      className="flex flex-col bg-white flex-grow relative"
      onClick={focusInputMessage}>
      <ChannelHeader channelName={channel.channel.display_name} />

      <div className="flex-grow overflow-hidden relative h-72">
        <div
          className={`h-full overflow-y-auto p-4 ${
            isChannelReady ? '' : 'invisible'
          }`}
          ref={messagesRef}>
          {isLoadingOld && (
            <div className="flex justify-center items-center py-2">
              <Loader className="animate-spin" />
            </div>
          )}
          {groupsPosts.map((group: any, index: number) => (
            <GroupPost
              key={group[0].id || index}
              group={group}
              token={token}
              onEmojiClick={onEmojiClick}
              isLast={index === groupsPosts.length - 1}
              getPost={getPost}
              setPostReply={setPostReply}
            />
          ))}
        </div>

        {!isChannelReady && (
          <div className="absolute inset-0 flex justify-center items-center bg-white bg-opacity-80">
            <LoaderCircle className="animate-spin" size={48} />
          </div>
        )}
      </div>

      {showNewMessageIndicator && (
        <div
          className="absolute bottom-16 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white px-4 py-2 rounded-full cursor-pointer flex items-center shadow-lg"
          onClick={handleScrollToBottom}>
          <ChevronDown size={20} className="mr-2" />
          Nouveau message
        </div>
      )}

      <InputMessage
        fileInputRef={fileInputRef}
        setMessageText={setMessageText}
        messageText={messageText}
        handleFileSelect={handleFileSelect}
        triggerFileInput={triggerFileInput}
        isSendEnabled={isSendEnabled}
        handleMessageSend={handleMessageSend}
        chatContainerRef={messagesRef}
        postReply={postReply}
        setPostReply={setPostReply}
      />

      {selectedFiles.length > 0 && (
        <DocumentList selectedFiles={selectedFiles} removeFile={removeFile} />
      )}
    </div>
  );
};
