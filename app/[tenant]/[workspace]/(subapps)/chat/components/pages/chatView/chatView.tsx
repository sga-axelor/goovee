'use client';

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ChannelList} from '../../atoms';
import {ChannelView} from '../../organisms';
import {getPostById, viewChannel} from '../../../api';
import {Socket} from '../../Socket';
import {
  getChannelInfosByChannelId,
  getChannelsWithUnreadCount,
} from '../../../services/services';
import {addReaction} from '../../../utils/AddReaction';
import {addPost} from '../../../utils/addPost';

export const ChatView = ({
  token,
  user,
  userStatus,
  users,
  teamId,
}: {
  token: any;
  user: any;
  userStatus: any;
  users: any[];
  teamId: string;
}) => {
  const [activeChannel, setActiveChannel] = useState<any>();
  const [_channels, setChannels] = useState<any>(null);
  const [_currentChannel, setCurrentChannel] = useState<any>();
  const [channelJustSelected, setChannelJustSelected] = useState(false);
  const [newMessage, setNewMessage] = useState<boolean>(false);
  const activeChannelRef = useRef(activeChannel);

  const updateChannelUnread = (channelId: string, newMessage: boolean) => {
    setChannels((prevChannels: any) =>
      prevChannels.map((channel: any) =>
        channel.id === channelId
          ? {...channel, unread: newMessage ? channel.unread + 1 : 0}
          : channel,
      ),
    );
  };

  useEffect(() => {
    const fetchChannels = async () => {
      const channels = await getChannelsWithUnreadCount(token, teamId, user.id);
      const filteredChannels = channels.filter((channel: any) => {
        return (
          channel.display_name != null && channel.display_name.trim() !== ''
        );
      });
      setChannels(filteredChannels);
      if (userStatus && userStatus !== '') {
        setActiveChannel(userStatus.active_channel);
      } else {
        setActiveChannel(filteredChannels[0].id);
      }
    };
    fetchChannels();
  }, [teamId, token, user.id, userStatus]);

  useEffect(() => {
    activeChannelRef.current = activeChannel;
    const fetchCurrentChannel = async () => {
      const currentChannel = await getChannelInfosByChannelId(
        activeChannel,
        token,
      );
      console.log('curretnchannel : ', currentChannel);
      setCurrentChannel(currentChannel);
      setChannelJustSelected(true);
      const data = await viewChannel(user.id, activeChannel, token);
      updateChannelUnread(activeChannel, false);
    };
    if (activeChannel) {
      fetchCurrentChannel();
    }
  }, [activeChannel, token, user.id]);

  const handleNewPost = useCallback(
    async (channelId: string, rootId: string, post: any) => {
      if (channelId == activeChannelRef.current && user.id !== post.user_id) {
        addPost(setCurrentChannel, channelId, token, false, user, post);
        setNewMessage(true);
      } else if (channelId !== activeChannelRef.current) {
        updateChannelUnread(channelId, true);
      }
    },
    [setCurrentChannel, token, user],
  );

  const sendMessage = (
    postText: string,
    channelId: string,
    files?: File[],
    postReply?: any,
  ) => {
    addPost(
      setCurrentChannel,
      channelId,
      token,
      true,
      user,
      postText,
      files,
      postReply,
    );
  };

  const handleDeletedPost = useCallback(
    async (channelId: string, rootId: string, post: any) => {
      if (channelId == activeChannelRef.current) {
        console.log('ce post a été effecé : ', post);
      }
    },
    [],
  );

  const handleNewReaction = useCallback(
    async (channelId: string, postId: string, reaction: any) => {
      if (
        channelId === activeChannelRef.current &&
        user.id !== reaction.user_id
      ) {
        addReaction(
          setCurrentChannel,
          reaction.emoji_name,
          postId,
          reaction.user_id,
          token,
          false,
        );
      }
    },
    [setCurrentChannel, token, user.id],
  );

  const handleEmojiClick = useCallback(
    (name: string, postId: string) => {
      addReaction(setCurrentChannel, name, postId, user.id, token, true);
    },
    [user, setCurrentChannel, token],
  );

  const loadMoreMessages = async () => {
    if (
      !_currentChannel ||
      !_currentChannel.groupsPosts ||
      _currentChannel.groupsPosts.length === 0
    ) {
      console.log('Pas de messages à charger');
      return;
    }

    const oldestPostId = _currentChannel.groupsPosts[0][0].id;

    try {
      const oldCurrentCHannel = await getChannelInfosByChannelId(
        activeChannel,
        token,
        {
          before: oldestPostId,
          per_page: 60,
        },
      );

      const olderMessages = oldCurrentCHannel.groupsPosts;

      if (olderMessages && olderMessages.length > 0) {
        setCurrentChannel((prevChannel: any) => {
          const updatedGroupsPosts = [
            ...olderMessages,
            ...prevChannel.groupsPosts,
          ];

          return {
            ...prevChannel,
            groupsPosts: updatedGroupsPosts,
          };
        });
      } else {
        console.log('Pas de messages plus anciens à charger');
      }
    } catch (error) {
      console.error(
        'Erreur lors du chargement des messages plus anciens:',
        error,
      );
    }
  };

  const getPost = async (root_id: string) => {
    const previousPost = await getPostById(root_id, token);
    return previousPost;
  };

  return (
    <div className="flex h-100">
      <ChannelList
        channels={_channels}
        activeChannel={activeChannel}
        setActiveChannel={setActiveChannel}
        token={token}
      />
      {_currentChannel && (
        <ChannelView
          channel={_currentChannel}
          token={token}
          onEmojiClick={handleEmojiClick}
          channelId={activeChannel}
          channelJustSelected={channelJustSelected}
          setChannelJustSelected={setChannelJustSelected}
          newMessage={newMessage}
          setNewMessage={setNewMessage}
          sendMessage={sendMessage}
          loadMoreMessages={loadMoreMessages}
          getPost={getPost}
          users={users}
        />
      )}
      <Socket
        token={token}
        connectedUserId={user.id}
        handleNewPost={handleNewPost}
        handleReaction={handleNewReaction}
        handleDeletedPost={handleDeletedPost}
      />
    </div>
  );
};
