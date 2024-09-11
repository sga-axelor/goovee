import axios, {AxiosResponse} from 'axios';
import {asyncForEach, generateUniqueId} from '../services/services';

// Configuration de base pour l'API Mattermost
const MATTERMOST_URL = 'http://localhost:8065'; // Remplacez par l'URL de votre instance Mattermost
export const API_URL = `${MATTERMOST_URL}/api/v4`;

interface AuthResponse {
  token: string;
  user_id: string;
}

// Interface pour les identifiants de l'utilisateur
interface Credentials {
  login_id: string; // Peut être un email ou un nom d'utilisateur
  password: string;
}

// Interface pour définir la structure d'un canal
interface Channel {
  id: string;
  create_at: number;
  update_at: number;
  delete_at: number;
  team_id: string;
  type: string;
  display_name: string;
  name: string;
  header: string;
  purpose: string;
  last_post_at: number;
  total_msg_count: number;
  extra_update_at: number;
  creator_id: string;
}

export const getChannelsTeam = async (token: any, teamId: any, userId: any) => {
  try {
    const {data} = await axios.get(
      `${API_URL}/users/${userId}/teams/${teamId}/channels`,
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

export const getPostsChannel = async (token: any, channelId: any) => {
  try {
    const {data} = await axios.get(`${API_URL}/channels/${channelId}/posts`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return data;
  } catch (error) {
    console.error('Erreur lors de la récupération des canaux:', error);
    throw error;
  }
};

export const getAuthToken = async (login: string, password: string) => {
  try {
    const {data, headers} = await axios.post(
      `${API_URL}/users/login`,
      {
        login_id: login,
        password: password,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    const token = headers.token;

    if (!token) {
      throw new Error('Token not found');
    }

    return {data, token};
  } catch (error) {
    console.error("Erreur lors de l'authentification: ", error);
    throw error;
  }
};

export const getChannelById = async (channelId: string, token: string) => {
  const {data} = await axios({
    method: 'get',
    url: `${API_URL}/channels/${channelId}`,
    headers: {Authorization: `Bearer ${token}`},
  });
  return data;
};

export const getChannelUsers = async (channelId: string, token: string) => {
  const {data: user} = await axios({
    method: 'get',
    url: `${API_URL}/users`,
    headers: {Authorization: `Bearer ${token}`},
    params: {in_channel: channelId},
  });

  return user;
};

export const getFileInfoById = async (fileId: string, token: string) => {
  const {data} = await axios({
    method: 'get',
    url: `${API_URL}/files/${fileId}/info`,
    headers: {Authorization: `Bearer ${token}`},
  });
  return data;
};

export const getUserProfileImage = async (userId: string, token: string) => {
  const {data} = await axios({
    responseType: 'blob',
    method: 'get',
    url: `${API_URL}/users/${userId}/image`,
    headers: {Authorization: `Bearer ${token}`},
  });
  const blob = new Blob([data], {type: 'image/png'});
  return URL.createObjectURL(blob);
};

export const createReaction = async (
  userId: string,
  postId: string,
  emojiName: string,
  createAt: number,
  token: string,
) => {
  const {data: reaction} = await axios({
    method: 'post',
    url: `${API_URL}/reactions`,
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

export const removeReactionFromAPost = async (
  userId: string,
  postId: string,
  emojiName: string,
  token: string,
) => {
  const {data} = await axios({
    method: 'delete',
    url: `${API_URL}/users/${userId}/posts/${postId}/reactions/${emojiName}`,
    headers: {Authorization: `Bearer ${token}`},
  });
  return data.status;
};

export const getPostReactions = async (postId: string, token: string) => {
  const {data} = await axios({
    method: 'get',
    url: `${API_URL}/posts/${postId}/reactions`,
    headers: {Authorization: `Bearer ${token}`},
  });
  return data;
};

export const createPost = async (
  channelId: string,
  message: string,
  rootId: string | null,
  files: any,
  token: string,
) => {
  let data: any = {
    channel_id: channelId,
    message,
  };
  if (rootId) {
    data = {...data, root_id: rootId};
  }
  if (files) {
    let fileIds: any = [];
    await asyncForEach(files, async (file: any) => {
      if (!file.id) {
        const fileInfo = await uploadFile(channelId, file.completeFile, token);
        const {file_infos} = fileInfo;
        if (file_infos && file_infos[0]) {
          fileIds.push(file_infos[0].id);
        }
      } else {
        fileIds.push(file.id);
      }
    });
    data = {...data, file_ids: fileIds};
  }
  const {data: post} = await axios({
    method: 'post',
    url: `${API_URL}/posts`,
    headers: {Authorization: `Bearer ${token}`},
    data: data,
  });
  return post;
};

export const uploadFile = async (
  channelId: string,
  file: File,
  token: string,
) => {
  const formData = new FormData();
  const uniqueId = generateUniqueId();
  formData.append('channel_id', channelId);
  formData.append('client_ids', uniqueId);
  formData.append('files', file);
  const {data} = await axios.post(`${API_URL}/files`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
    transformRequest: formData => formData,
  });
  return data;
};
