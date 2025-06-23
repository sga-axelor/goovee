import axios from 'axios';
import {USERS_API_ENDPOINT} from './path-helpers';
import {getHOST} from '../utils';

export const getAuthToken = async (
  login: string | undefined,
  password: string | undefined,
) => {
  try {
    const {data, headers} = await axios.post(
      `${getHOST()}${USERS_API_ENDPOINT}/login`,
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
