import React, {useEffect, useState} from 'react';
import ReactMarkdown from 'react-markdown';
import EmojiItem from './emojiItem';
import MenuReaction from './menuReaction';
import FilePreview from './filePreview';
import MarkdownRenderer from './markdownRenderer';

interface Reaction {
  count: number;
  users: string[];
}

interface GroupedReactions {
  [emojiName: string]: Reaction;
}

const Post = ({
  post,
  onEmojiClick,
  getPost,
  setPostReply,
}: {
  post: any;
  onEmojiClick: (name: string, postId: string) => void;
  getPost: (rootId: string) => any;
  setPostReply: (post: any) => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [_previousPost, setPreviousPost] = useState<any>();

  const onClick = (name: string) => {
    onEmojiClick(name, post.id);
  };

  const groupedReactions: GroupedReactions = post.metadata?.reactions
    ? post.metadata.reactions.reduce((acc: GroupedReactions, reaction: any) => {
        if (!acc[reaction.emoji_name]) {
          acc[reaction.emoji_name] = {count: 0, users: []};
        }
        acc[reaction.emoji_name].count += 1;
        acc[reaction.emoji_name].users.push(reaction.user_id);
        return acc;
      }, {})
    : {};

  const onReplyClick = () => {
    setPostReply(post);
  };

  useEffect(() => {
    const fetParentPost = async () => {
      const previousPost = await getPost(post.root_id);
      setPreviousPost(previousPost);
    };
    if (post.root_id) {
      fetParentPost();
    }
  }, [post.root_id, getPost]);

  return (
    <div
      className={`p-2 rounded-md transition-colors duration-200 relative ${
        isHovered ? 'bg-gray-100' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      {post.root_id && _previousPost && (
        <div className="mb-2 p-2 bg-gray-200 rounded-md text-sm">
          <p className="font-semibold">En réponse à :</p>
          <MarkdownRenderer content={_previousPost.message} />
        </div>
      )}
      <MarkdownRenderer content={post.message} />
      {post.metadata.files && post.metadata.files.length > 0 && (
        <div className="mt-2 flex flex-wrap">
          {post.metadata.files.map((file: any) => (
            <FilePreview key={file.id} file={file} />
          ))}
        </div>
      )}
      {isHovered && (
        <MenuReaction onEmojiClick={onClick} onReplyClick={onReplyClick} />
      )}
      {Object.keys(groupedReactions).length > 0 && (
        <div className="flex flex-wrap mt-2">
          {Object.entries(groupedReactions).map(([emojiName, data]) => (
            <EmojiItem
              key={emojiName}
              name={emojiName}
              count={data.count}
              onEmojiClick={onClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Post;
