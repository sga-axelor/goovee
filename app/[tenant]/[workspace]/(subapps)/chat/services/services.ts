import {
  getChannelById,
  getChannelUsers,
  getFileInfoById,
  getPostsChannel,
} from '../api/api';

const characters =
  'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

export const getDisplayName = (user: any | undefined): string => {
  if (!user) {
    return '';
  }
  if (!user.first_name || !user.last_name) {
    if (!user.nickname) {
      return user.username || '';
    }
    return user.nickname;
  }
  return `${user.first_name} ${user.last_name}`;
};

export async function asyncForEach(array: any, callback: any) {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
}

export const getFiles = async (fileIds: File[], token: string) => {
  let files: File[] = [];
  await asyncForEach(fileIds, async (fileId: string) => {
    const fileInfo = await getFileInfoById(fileId, token);
    if ('status_code' in fileInfo) {
      return;
    }
    if (fileInfo) {
      files.push(fileInfo);
    }
  });

  return files;
};

export const getFormattedPosts = async (
  channelId: string,
  users: any[],
  token: string,
  options: any = {},
) => {
  const data = await getPostsChannel(token, channelId, options);
  if ('status_code' in data) {
    return [];
  }
  const {posts} = data;
  let postList: any[] = [];
  await asyncForEach(Object.keys(posts), async (key: string) => {
    let post = posts[key];
    let root = {author: '', text: '', postId: ''};
    let files: any = [];
    if (post.file_ids) {
      files = await getFiles(post.file_ids, token);
    }
    let postUser = users.find((u: any) => u.id === post.user_id);
    let displayName = getDisplayName(postUser);
    postList.push({
      ...post,
      displayName,
      root: root,
      files: files,
    });
  });
  return postList;
};

export const getChannelInfosByChannelId = async (
  channelId: string,
  token: string,
  options: any = {},
) => {
  const channel = await getChannelById(channelId, token);
  if ('status_code' in channel) {
    return {posts: [], name: '', users: [], channel: {id: undefined}};
  }
  const channelUsers: any[] = await getChannelUsers(channelId, token);
  if ('status_code' in channelUsers) {
    return {posts: [], name: '', users: [], channel};
  }
  let posts: any[] = await getFormattedPosts(
    channelId,
    channelUsers,
    token,
    options,
  );
  posts.sort((a: any, b: any) => {
    return a.create_at - b.create_at;
  });

  const groups = posts.reduce((groups, post) => {
    const lastGroup = groups[groups.length - 1];

    if (lastGroup && lastGroup[0].displayName === post.displayName) {
      lastGroup.push(post);
    } else {
      groups.push([post]);
    }

    return groups;
  }, []);

  return {
    groupsPosts: groups,
    name: channel.displayName,
    users: channelUsers,
    channel,
  };
};

export const generateUniqueId = () => {
  let result = ' ';
  const charactersLength = characters.length;
  for (let i = 0; i < 36; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result;
};
