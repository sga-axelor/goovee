const PATH_ROOT = '/api/v4';

export const USERS_API_ENDPOINT = `${PATH_ROOT}/users`;
export const TEAMS_API_ENDPOINT = `${PATH_ROOT}/teams`;
export const CHANNELS_API_ENDPOINT = `${PATH_ROOT}/channels`;
export const POSTS_API_ENDPOINT = `${PATH_ROOT}/posts`;
export const REACTIONS_API_ENDPOINT = `${PATH_ROOT}/reactions`;
export const FILES_API_ENDPOINT = `${PATH_ROOT}/files`;

// /**
//  * Remove all the special char (minus space and - )
//  * Replace all the space by -
//  * Remove all accents
//  * Make it lowerCase
//  * @param str the string to format
//  */
// export const formatNameForApi = (str: string) => {
//   if (!str) {
//     return '';
//   }

//   return str
//     .replaceAll(' ', '-')
//     .replaceAll(/[~`!@#$%^&*(){}\[\];:"'<,.>?\/\\|_+=]/g, '')
//     .normalize('NFD')
//     .replaceAll(/[\u0300-\u036f]/g, '')
//     .toLowerCase();
// };
