import axios from 'axios';
import {USERS_API_ENDPOINT} from './path-helpers';
import {getHOST} from '../utils';

export const getChannelsTeam = async (token: any, teamId: any, userId: any) => {
  try {
    const {data} = await axios.get(
      `${getHOST()}${USERS_API_ENDPOINT}/${userId}/teams/${teamId}/channels`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des canaux:', error);
    throw error;
  }
};

export const getChannelUsers = async (channelId: string, token: string) => {
  const {data: user} = await axios({
    method: 'get',
    url: `${getHOST()}${USERS_API_ENDPOINT}`,
    headers: {Authorization: `Bearer ${token}`},
    params: {in_channel: channelId},
  });

  return user;
};

export const getUserProfileImage = async (userId: string, token: string) => {
  const {data} = await axios({
    responseType: 'blob',
    method: 'get',
    url: `${getHOST()}${USERS_API_ENDPOINT}/${userId}/image`,
    headers: {Authorization: `Bearer ${token}`},
  });
  const blob = new Blob([data], {type: 'image/png'});
  return URL.createObjectURL(blob);
};

export const removeReactionFromAPost = async (
  userId: string,
  postId: string,
  emojiName: string,
  token: string,
) => {
  const {data} = await axios({
    method: 'delete',
    url: `${getHOST()}${USERS_API_ENDPOINT}/${userId}/posts/${postId}/reactions/${emojiName}`,
    headers: {Authorization: `Bearer ${token}`},
  });
  return data.status;
};

export const getUnreadChannel = async (
  channelId: string,
  userId: string,
  token: string,
) => {
  const data = await axios({
    method: 'get',
    url: `${getHOST()}${USERS_API_ENDPOINT}/${userId}/channels/${channelId}/unread`,
    headers: {Authorization: `Bearer ${token}`},
  });
  return data;
};

export const getUserStatus = async (userId: string, token: string) => {
  const {data} = await axios({
    method: 'get',
    url: `${getHOST()}${USERS_API_ENDPOINT}/${userId}/status`,
    headers: {Authorization: `Bearer ${token}`},
  });
  return data;
};

export const getUsers = async (token: string) => {
  const {data} = await axios({
    method: 'get',
    url: `${getHOST()}${USERS_API_ENDPOINT}`,
    headers: {Authorization: `Bearer ${token}`},
  });
  return data;
};
