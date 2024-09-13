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

const ChatView = ({token, user}: {token: any; user: any}) => {
  const [activeChannel, setActiveChannel] = useState<any>();
  const [_channels, setChannels] = useState<any>(null);
  const [_currentChannel, setCurrentChannel] = useState<any>();
  const [channelJustSelected, setChannelJustSelected] = useState(false);
  const [newMessage, setNewMessage] = useState<boolean>(false);
  const activeChannelRef = useRef(activeChannel);
  const teamId: any = '7efg3j4y3pgfpyjkjtmhnoxrcc';

  useEffect(() => {
    const fetchChannels = async () => {
      const channels = await getChannelsTeam(token, teamId, user.id);
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
      if (channelId == activeChannelRef.current && user.id !== post.user_id) {
        addPost(setCurrentChannel, channelId, token, false, user, post);
      }
      setNewMessage(true);
    },
    [activeChannel, setCurrentChannel],
  );

  const sendMessage = (postText: string, channelId: string, files?: File[]) => {
    addPost(setCurrentChannel, channelId, token, true, user, postText, files);
  };

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
    [activeChannel, setCurrentChannel],
  );

  const handleEmojiClick = useCallback(
    (name: string, postId: string) => {
      addReaction(setCurrentChannel, name, postId, user.id, token, true);
    },
    [user, setCurrentChannel],
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

    console.log('currentChannel : ', _currentChannel);

    const oldestPostId = _currentChannel.groupsPosts[0][0].id;

    console.log('voici le oldest postid : ', oldestPostId);

    try {
      const oldCurrentCHannel = await getChannelInfosByChannelId(
        activeChannel,
        token,
        {
          before: oldestPostId,
          per_page: 60,
        },
      );
      // const olderMessages = await getChannelMessages(activeChannel, token, {
      //   before: oldestPostId,
      //   per_page: 60,
      // });

      const olderMessages = oldCurrentCHannel.groupsPosts;

      console.log('older messages recup : ', olderMessages);

      if (olderMessages && olderMessages.length > 0) {
        setCurrentChannel(prevChannel => {
          const updatedGroupsPosts = [
            ...olderMessages,
            ...prevChannel.groupsPosts,
          ];

          console.log('voici le updated grou post : ', updatedGroupsPosts);
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

  return (
    <div className="flex h-[calc(100vh-120px)]">
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
        loadMoreMessages={loadMoreMessages}
      />
      <Socket
        token={token}
        connectedUserId={user.id}
        handleNewPost={handleNewPost}
        handleReaction={handleNewReaction}
      />
    </div>
  );
};

export default ChatView;
