'use client';

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ChannelList} from './channelList';
import {ChannelView} from './channelView';
import {getChannelsTeam, createReaction} from '../api/api';
import {Socket} from './Socket';
import {getChannelInfosByChannelId} from '../services/services';

const ChatView = ({token, userId}: {token: any; userId: any}) => {
  const [activeChannel, setActiveChannel] = useState<any>();
  const [_channels, setChannels] = useState<any>(null);
  const [_currentChannel, setCurrentChannel] = useState<any>();
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
    };
    if (activeChannel) {
      fetchCurrentChannel();
    }
  }, [activeChannel]);

  const handleNewPost = useCallback(
    async (channelId: string, rootId: string, post: any) => {
      if (channelId == activeChannelRef.current) {
        setCurrentChannel((prevChannel: any) => {
          const updatedGroupsPosts = [...prevChannel.groupsPosts];
          const lastGroup = updatedGroupsPosts[updatedGroupsPosts.length - 1];

          if (lastGroup && lastGroup[0].displayName === post.displayName) {
            updatedGroupsPosts[updatedGroupsPosts.length - 1] = [
              ...lastGroup,
              post,
            ];
          } else {
            updatedGroupsPosts.push([post]);
          }

          return {
            ...prevChannel,
            groupsPosts: updatedGroupsPosts,
          };
        });
      }
    },
    [activeChannel, setCurrentChannel],
  );

  const handleEmojiClick = useCallback(
    (name: string, postId: string) => {
      setCurrentChannel((prevChannel: any) => {
        const updatedGroupsPosts = prevChannel.groupsPosts.map(group => {
          const updatedGroup = group.map(post => {
            if (post.id === postId) {
              const updatedPost = {...post};
              if (!updatedPost.metadata) {
                updatedPost.metadata = {};
              }
              if (!updatedPost.metadata.reactions) {
                updatedPost.metadata.reactions = [];
              }

              const existingReactionIndex =
                updatedPost.metadata.reactions.findIndex(
                  (reaction: any) =>
                    reaction.emoji_name === name && reaction.user_id === userId,
                );

              if (existingReactionIndex !== -1) {
                updatedPost.metadata.reactions =
                  updatedPost.metadata.reactions.filter(
                    (_: any, index: number) => index !== existingReactionIndex,
                  );
              } else {
                updatedPost.metadata.reactions.push({
                  user_id: userId,
                  post_id: postId,
                  emoji_name: name,
                  create_at: Date.now(),
                  update_at: Date.now(),
                  delete_at: 0,
                  remote_id: '',
                  channel_id: prevChannel.channel.id,
                });
              }

              updatedPost.has_reactions =
                updatedPost.metadata.reactions.length > 0;

              return updatedPost;
            }
            return post;
          });

          return updatedGroup;
        });

        return {
          ...prevChannel,
          groupsPosts: updatedGroupsPosts,
        };
      });
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
      />
      <Socket
        token={token}
        connectedUserId={userId}
        handleNewPost={handleNewPost}
      />
    </div>
  );
};

export default ChatView;
