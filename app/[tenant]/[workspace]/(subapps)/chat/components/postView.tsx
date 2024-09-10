import React from "react";
//import { Avatar } from '@/components/ui/avatar';

const PostView = ({ post }: { post: any }) => {
  return (
    <div className="flex items-start space-x-4 p-4 border-b border-gray-200">
      {/* <Avatar>
        <img src={post.user.avatar_url} alt={post.user.username} className="w-10 h-10 rounded-full" />
      </Avatar> */}
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <span className="font-semibold">{post.displayName}</span>
          <span className="text-gray-500 text-sm">
            {new Date(post.create_at).toLocaleString()}
          </span>
        </div>
        <p className="mt-1">{post.message}</p>
        <div className="mt-2 flex items-center space-x-4">
          <button className="text-gray-500 hover:text-blue-500">Reply</button>
          <button className="text-gray-500 hover:text-red-500">Delete</button>
        </div>
      </div>
    </div>
  );
};

export default PostView;
