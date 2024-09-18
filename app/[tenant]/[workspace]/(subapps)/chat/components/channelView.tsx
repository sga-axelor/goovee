import React, {useCallback, useEffect, useRef, useState} from 'react';
import {X, Send, Paperclip, Loader, ChevronDown, Users} from 'lucide-react';
import GroupPost from './groupPost';
import InputMessage from './InputMessage';
import DocumentList from './documentList';
import {getChannelMembers} from '../api/api';

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
  users: any[];
}) => {
  if (!channel) {
    return <div>Chargement du canal</div>;
  }
  const [messageText, setMessageText] = useState<string>('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const groupsPosts = Object.values(channel.groupsPosts);
  const messagesRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const prevHeightRef = useRef<number>(0);
  const [showNewMessageIndicator, setShowNewMessageIndicator] =
    useState<boolean>(false);
  const [postReply, setPostReply] = useState<any>(null);
  const [_users, setUsers] = useState<any[]>();
  const [showUserPopup, setShowUserPopup] = useState(false);
  const userPopupRef = useRef<HTMLDivElement>(null);
  const userButtonRef = useRef<HTMLButtonElement>(null);

  const scrollToBottom = useCallback(
    (behavior: ScrollBehavior) => {
      if (messagesRef.current) {
        const scrollHeight = messagesRef.current.scrollHeight;
        const height = messagesRef.current.clientHeight;
        const maxScrollTop = scrollHeight - height;
        messagesRef.current.scrollTo({
          top: maxScrollTop > 0 ? maxScrollTop : 0,
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
    const fetchMembers = async () => {
      const members = await getChannelMembers(channelId, token);
      const filteredUsers = users.filter(user =>
        members.some((member: any) => member.user_id === user.id),
      );
      setUsers(filteredUsers);
    };
    fetchMembers();
  }, []);

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
  };

  const handleScrollToBottom = () => {
    scrollToBottom('smooth');
    setShowNewMessageIndicator(false);
  };

  const toggleUserPopup = () => {
    setShowUserPopup(!showUserPopup);
  };

  const isSendEnabled = messageText.trim() !== '' || selectedFiles.length > 0;

  return (
    <div className="flex flex-col h-h-[calc(100vh-120px) bg-white flex-grow">
      <div className="bg-gray-100 p-4 border-b">
        <div className="flex flex-col items-start">
          <h2 className="font-semibold text-xl mb-2">
            #{channel.channel.display_name}
          </h2>
          <div className="relative">
            <button
              ref={userButtonRef}
              onClick={toggleUserPopup}
              className="flex items-center text-sm text-gray-600 hover:text-gray-800 transition-colors duration-200">
              <Users size={16} className="mr-1" />
              <span>{_users ? _users.length : 0}</span>
            </button>
            {showUserPopup && (
              <div
                ref={userPopupRef}
                className="absolute left-0 mt-2 w-64 bg-white rounded-lg shadow-xl z-10">
                <div className="p-2 border-b border-gray-200">
                  <h3 className="font-semibold">Membres du channel</h3>
                </div>
                <ul className="max-h-60 overflow-y-auto">
                  {_users &&
                    _users.map(user => (
                      <li key={user.id} className="p-2">
                        {user.nickname}
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="flex-grow overflow-y-auto p-4" ref={messagesRef}>
        {isLoading && (
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
