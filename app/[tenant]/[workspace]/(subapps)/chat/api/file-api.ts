import axios from 'axios';
import {FILES_API_ENDPOINT} from './path-helpers';
import {generateUniqueId} from '../services/services';
import {getHOST} from '../utils';

export const getFileInfoById = async (fileId: string, token: string) => {
  const {data} = await axios({
    method: 'get',
    url: `${getHOST()}${FILES_API_ENDPOINT}/${fileId}/info`,
    headers: {Authorization: `Bearer ${token}`},
  });
  return data;
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
  const {data} = await axios.post(`${HOST}${FILES_API_ENDPOINT}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
    transformRequest: formData => formData,
  });
  return data;
};

export const getFilePreview = async (fileId: string, token: string) => {
  const {data} = await axios({
    responseType: 'blob',
    method: 'get',
    url: `${getHOST()}${FILES_API_ENDPOINT}/${fileId}/preview`,
    headers: {Authorization: `Bearer ${token}`},
  });
  const blob = new Blob([data], {type: 'image/png'});
  return URL.createObjectURL(blob);
};

export const getFileLink = async (fileId: string, token: string) => {
  const {data} = await axios({
    method: 'get',
    url: `${getHOST()}${FILES_API_ENDPOINT}/${fileId}/link`,
    headers: {Authorization: `Bearer ${token}`},
  });
  return data;
};
