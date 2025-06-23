import axios from 'axios';
import {REACTIONS_API_ENDPOINT} from './path-helpers';
import {getHOST} from '../utils';

export const createReaction = async (
  userId: string,
  postId: string,
  emojiName: string,
  createAt: number,
  token: string,
) => {
  const {data: reaction} = await axios({
    method: 'post',
    url: `${getHOST()}${REACTIONS_API_ENDPOINT}`,
    headers: {Authorization: `Bearer ${token}`},
    data: {
      user_id: userId,
      post_id: postId,
      emoji_name: emojiName,
      create_at: createAt,
    },
  });
  return reaction;
};
