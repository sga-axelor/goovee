import {createPost} from '../api/api';

export const addPost = async (
  setCurrentChannel: any,
  channelId: string,
  token: string,
  byMe: boolean,
  post?: any,
  files?: File[],
) => {
  if (byMe) {
    let postCreated;
    postCreated = await createPost(channelId, post, null, files, token);
    updateLocalState(setCurrentChannel, postCreated);
  } else {
    updateLocalState(setCurrentChannel, post);
  }
};

const updateLocalState = (setCurrentChannel: any, post: any) => {
  setCurrentChannel((prevChannel: any) => {
    const updatedGroupsPosts = [...prevChannel.groupsPosts];
    const lastGroup = updatedGroupsPosts[updatedGroupsPosts.length - 1];

    if (lastGroup && lastGroup[0].user_id === post.user_id) {
      updatedGroupsPosts[updatedGroupsPosts.length - 1] = [...lastGroup, post];
    } else {
      updatedGroupsPosts.push([post]);
    }

    return {
      ...prevChannel,
      groupsPosts: updatedGroupsPosts,
    };
  });
};
