import axios from 'axios';
import {HOST} from '../constants';
import {POSTS_API_ENDPOINT} from './path-helpers';
import {asyncForEach} from '../services/services';
import {uploadFile} from '../api';
import {File} from '../types/types';

export const getPostReactions = async (postId: string, token: string) => {
  const {data} = await axios({
    method: 'get',
    url: `${HOST}${POSTS_API_ENDPOINT}/${postId}/reactions`,
    headers: {Authorization: `Bearer ${token}`},
  });
  return data;
};

export const createPost = async (
  channelId: string,
  message: string,
  rootId: string | null,
  files: File,
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
    const fileIds: any = [];
    await asyncForEach(files, async (file: any) => {
      if (!file.id) {
        const fileInfo = await uploadFile(channelId, file, token);
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
    url: `${HOST}${POSTS_API_ENDPOINT}`,
    headers: {Authorization: `Bearer ${token}`},
    data: data,
  });
  return post;
};

export const getPostById = async (postId: string, token: string) => {
  const {data} = await axios({
    method: 'get',
    url: `${HOST}${POSTS_API_ENDPOINT}/${postId}`,
    headers: {Authorization: `Bearer ${token}`},
  });
  return data;
};
