'use client';

import React, {useCallback, useEffect, useRef, useState} from 'react';
import {ChannelList} from './channelList';
import {ChannelView} from './channelView';
import {getChannelsTeam, getPostsChannel} from '../api/api';
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
      console.log('on passe dans handlenewpost');
      console.log('channelId', channelId);
      console.log('activeChannel ref', activeChannelRef.current);
      if (channelId == activeChannelRef.current) {
        console.log('on est bien dans la bonne channel');
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

  return (
    <div className="flex h-screen">
      <ChannelList
        channels={_channels}
        activeChannel={activeChannel}
        setActiveChannel={setActiveChannel}
        token={token}
      />
      <ChannelView channel={_currentChannel} token={token} />
      <Socket
        token={token}
        connectedUserId={userId}
        handleNewPost={handleNewPost}
      />
    </div>
  );
};

export default ChatView;
