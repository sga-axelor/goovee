export const deletePost = async (setCurrentChannel: any, post: any) => {
  setCurrentChannel((prevChannel: any) => {
    const updatedGroupsPosts = JSON.parse(
      JSON.stringify(prevChannel.groupsPosts),
    );
    for (let i = 0; i < updatedGroupsPosts.length; i++) {
      const group = updatedGroupsPosts[i];

      const messageIndex = group.findIndex((msg: any) => msg.id === post.id);

      if (messageIndex !== -1) {
        group.splice(messageIndex, 1);

        if (group.length === 0) {
          updatedGroupsPosts.splice(i, 1);
        }
        break;
      }
    }

    return {
      ...prevChannel,
      groupsPosts: updatedGroupsPosts,
    };
  });
};
