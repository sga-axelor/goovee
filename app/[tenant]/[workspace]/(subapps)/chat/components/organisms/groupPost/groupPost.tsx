'use client';

import React, {useEffect, useState} from 'react';
import {getUserProfileImage} from '../../../api';
import {Post} from '../post/Post';

export const GroupPost = ({
  group,
  token,
  onEmojiClick,
  isLast,
  getPost,
  setPostReply,
}: {
  group: any[];
  token: string;
  onEmojiClick: (name: string, postId: string) => void;
  isLast?: boolean;
  getPost: (rootId: string) => any;
  setPostReply: (post: any) => void;
}) => {
  const [profileImage, setProfileImage] = useState<any>(null);

  useEffect(() => {
    const retrieveImage = async () => {
      const userImage: any = await getUserProfileImage(group[0].user_id, token);
      setProfileImage(userImage);
    };
    void retrieveImage();
  }, [group[0].user_id, token]);

  return (
    <div
      className={`flex items-start space-x-4 p-4 ${
        !isLast ? 'border-b border-gray-200' : ''
      }`}>
      {profileImage && (
        <img src={profileImage} alt="" className="w-10 h-10 rounded-full" />
      )}
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <span className="font-semibold">{group[0].displayName}</span>
          <span className="text-gray-500 text-sm">
            {new Date(group[0].create_at).toLocaleString()}
          </span>
        </div>
        {group.map((post: any, index) => (
          <Post
            key={index}
            post={post}
            onEmojiClick={onEmojiClick}
            getPost={getPost}
            setPostReply={setPostReply}
          />
        ))}
      </div>
    </div>
  );
};
