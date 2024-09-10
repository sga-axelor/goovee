import {createReaction, removeReactionFromAPost} from '../api/api';

export const addReaction = async (
  setCurrentChannel: any,
  name: string,
  postId: string,
  userId: string,
  token: string,
) => {
  let created: boolean = true;
  setCurrentChannel((prevChannel: any) => {
    const updatedGroupsPosts = prevChannel.groupsPosts.map((group: any) => {
      const updatedGroup = group.map((post: any) => {
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
            created = false;
            updatedPost.metadata.reactions =
              updatedPost.metadata.reactions.filter(
                (_: any, index: number) => index !== existingReactionIndex,
              );
          } else {
            created = true;
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

          updatedPost.has_reactions = updatedPost.metadata.reactions.length > 0;

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
  if (created) {
    await createReaction(userId, postId, name, 1717413805209, token);
  } else {
    await removeReactionFromAPost(userId, postId, name, token);
  }
};
