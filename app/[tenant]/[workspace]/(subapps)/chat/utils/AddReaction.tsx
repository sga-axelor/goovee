//

import {
  createReaction,
  removeReactionFromAPost,
  getPostReactions,
} from '../api';

const checkIfReactionExists = async (
  postId: string,
  userId: string,
  emojiName: string,
  token: string,
): Promise<boolean> => {
  try {
    const reactions = await getPostReactions(postId, token);
    const reactionExists = reactions?.some(
      (reaction: any) =>
        reaction.user_id === userId && reaction.emoji_name === emojiName,
    );

    return reactionExists;
  } catch (error) {
    console.error('Erreur lors de la vérification de la réaction:', error);
    return false;
  }
};

export const addReaction = async (
  setCurrentChannel: any,
  name: string,
  postId: string,
  userId: string,
  token: string,
  byMe: boolean,
) => {
  if (byMe) {
    let created: boolean;
    let serverResponse;
    try {
      const reactionExists = await checkIfReactionExists(
        postId,
        userId,
        name,
        token,
      );

      if (reactionExists) {
        serverResponse = await removeReactionFromAPost(
          userId,
          postId,
          name,
          token,
        );
        created = false;
      } else {
        serverResponse = await createReaction(
          userId,
          postId,
          name,
          Date.now(),
          token,
        );
        created = true;
      }

      updateLocalState(setCurrentChannel, postId, userId, name);
    } catch (error) {
      console.error(
        'Erreur lors de la mise à jour de la réaction sur le serveur:',
        error,
      );
    }
  } else {
    updateLocalState(setCurrentChannel, postId, userId, name);
  }
};

const updateLocalState = (
  setCurrentChannel: any,
  postId: string,
  userId: string,
  name: string,
) => {
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

          if (existingReactionIndex === -1) {
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
          if (existingReactionIndex !== -1) {
            updatedPost.metadata.reactions.splice(existingReactionIndex, 1);
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
};
