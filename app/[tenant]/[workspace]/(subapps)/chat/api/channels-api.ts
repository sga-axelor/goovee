import axios from 'axios';
import {CHANNELS_API_ENDPOINT} from './path-helpers';
import {getHOST} from '../utils';

export const getPostsChannel = async (
  token: string,
  channelId: string,
  options: any = {},
) => {
  const {before, per_page = 60, after} = options;
  try {
    const {data} = await axios.get(
      `${getHOST()}${CHANNELS_API_ENDPOINT}/${channelId}/posts`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        params: {
          before,
          after,
          per_page,
        },
      },
    );

    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des canaux:', error);
    throw error;
  }
};

export const getChannelById = async (channelId: string, token: string) => {
  const {data} = await axios({
    method: 'get',
    url: `${HOST}${CHANNELS_API_ENDPOINT}/${channelId}`,
    headers: {Authorization: `Bearer ${token}`},
  });
  return data;
};

export const viewChannel = async (
  userId: string,
  channelId: string,
  token: string,
) => {
  const data = await axios({
    method: 'post',
    url: `${HOST}${CHANNELS_API_ENDPOINT}/members/${userId}/view`,
    headers: {Authorization: `Bearer ${token}`},
    data: {
      channel_id: channelId,
    },
  });
  return data;
};

export const getChannelMembers = async (channelId: string, token: string) => {
  const {data} = await axios({
    method: 'get',
    url: `${HOST}${CHANNELS_API_ENDPOINT}/${channelId}/members`,
    headers: {Authorization: `Bearer ${token}`},
  });
  return data;
};
