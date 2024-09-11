'use client';

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ChannelList} from './channelList';
import {ChannelView} from './channelView';
import {
  getChannelsTeam,
  createReaction,
  removeReactionFromAPost,
} from '../api/api';
import {Socket} from './Socket';
import {getChannelInfosByChannelId} from '../services/services';
import {addReaction} from '../utils/AddReaction';
import {addPost} from '../utils/addPost';

const ChatView = ({
  token,
  userId,
  username,
}: {
  token: any;
  userId: any;
  username: string;
}) => {
  const [activeChannel, setActiveChannel] = useState<any>();
  const [_channels, setChannels] = useState<any>(null);
  const [_currentChannel, setCurrentChannel] = useState<any>();
  const [channelJustSelected, setChannelJustSelected] = useState(false);
  const [newMessage, setNewMessage] = useState<boolean>(false);
  const activeChannelRef = useRef(activeChannel);
  const teamId: any = '7efg3j4y3pgfpyjkjtmhnoxrcc';

  useEffect(() => {
    const fetchChannels = async () => {
      const channels = await getChannelsTeam(token, teamId, userId);
      const filteredChannels = channels.filter((channel: any) => {
        return (
          channel.display_name != null && channel.display_name.trim() !== ''
        );
      });
      setChannels(filteredChannels);
      setActiveChannel(filteredChannels[0].id);
    };
    fetchChannels();
  }, []);

  useEffect(() => {
    console.log('active channel ', activeChannel);
    activeChannelRef.current = activeChannel;
    const fetchCurrentChannel = async () => {
      const currentChannel = await getChannelInfosByChannelId(
        activeChannel,
        token,
      );
      setCurrentChannel(currentChannel);
      setChannelJustSelected(true);
    };
    if (activeChannel) {
      fetchCurrentChannel();
    }
  }, [activeChannel]);

  const handleNewPost = useCallback(
    async (channelId: string, rootId: string, post: any) => {
      if (channelId == activeChannelRef.current && userId !== post.user_id) {
        addPost(setCurrentChannel, channelId, token, false, post);
      }
      setNewMessage(true);
    },
    [activeChannel, setCurrentChannel],
  );

  const sendMessage = (postText: string, channelId: string, files?: File[]) => {
    addPost(setCurrentChannel, channelId, token, true, postText, files);
  };

  const handleNewReaction = useCallback(
    async (channelId: string, postId: string, reaction: any) => {
      if (
        channelId === activeChannelRef.current &&
        userId !== reaction.user_id
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
    [activeChannel, setCurrentChannel],
  );

  const handleEmojiClick = useCallback(
    (name: string, postId: string) => {
      addReaction(setCurrentChannel, name, postId, userId, token, true);
    },
    [userId, setCurrentChannel],
  );

  return (
    <div className="flex h-screen">
      <ChannelList
        channels={_channels}
        activeChannel={activeChannel}
        setActiveChannel={setActiveChannel}
        token={token}
      />
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
      />
      <Socket
        token={token}
        connectedUserId={userId}
        handleNewPost={handleNewPost}
        handleReaction={handleNewReaction}
      />
    </div>
  );
};

export default ChatView;
