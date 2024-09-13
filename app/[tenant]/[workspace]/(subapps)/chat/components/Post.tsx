import React, {useState} from 'react';
import ReactMarkdown from 'react-markdown';
import EmojiItem from './emojiItem';
import MenuReaction from './menuReaction';
import FilePreview from './filePreview';

// Définissez une interface pour la structure de vos réactions
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
}: {
  post: any;
  onEmojiClick: (name: string, postId: string) => void;
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const onClick = (name: string) => {
    onEmojiClick && onEmojiClick(name, post.id);
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

  return (
    <div
      className={`p-2 rounded-md transition-colors duration-200 relative ${
        isHovered ? 'bg-gray-100' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}>
      <ReactMarkdown className="mt-1">{post.message}</ReactMarkdown>

      {post.metadata.files && post.metadata.files.length > 0 && (
        <div className="mt-2 flex flex-wrap">
          {post.metadata.files.map((file: any) => (
            <FilePreview key={file.id} file={file} />
          ))}
        </div>
      )}

      {isHovered && <MenuReaction onEmojiClick={onClick} />}

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
