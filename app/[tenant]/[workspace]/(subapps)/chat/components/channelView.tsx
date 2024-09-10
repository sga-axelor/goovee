import React, {useCallback, useEffect, useRef, useState} from 'react';
import {Send} from 'lucide-react';
import PostView from './postView';

export const ChannelView = ({channel}: {channel: any}) => {
  if (!channel) {
    return <div>Chargement du canal</div>;
  }

  const posts = Object.values(channel.posts);
  const messagesRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(
    (timer = 0) => {
      if (messagesRef && messagesRef.current) {
        messagesRef.current.scrollTo({
          top: messagesRef.current.scrollHeight,
          behavior: 'instant',
        });
      }
    },
    [messagesRef],
  );

  console.log('voici les posts : ', channel);

  useEffect(() => {
    scrollToBottom();
  }, [channel]);

  return (
    <div className="flex flex-col h-screen bg-white flex-grow">
      <div className="bg-gray-100 p-4 border-b">
        <h2 className="font-semibold text-xl">
          #{channel.channel.display_name}
        </h2>
      </div>
      <div className="flex-grow overflow-y-auto p-4" ref={messagesRef}>
        {posts.map((post: any) => (
          // <div key={post.id} className="mb-4">
          //   <div className="font-semibold">{post.displayName}</div>
          //   <div>{post.message}</div>
          //   <div className="text-xs text-gray-500">{post.create_at}</div>
          // </div>
          <PostView post={post} />
        ))}
      </div>
      <div className="p-4 border-t">
        <div className="flex items-center bg-gray-100 rounded-lg p-2">
          <input
            type="text"
            placeholder="Écrire un message..."
            className="flex-grow bg-transparent focus:outline-none"
          />
          <Send size={20} className="text-gray-400 cursor-pointer" />
        </div>
      </div>
    </div>
  );
};
