import axios from 'axios';
import { useAuth0 } from '@auth0/auth0-react';

export function useApi() {
  const { getAccessTokenSilently } = useAuth0();

  const apiCall = async (config) => {
    const token = await getAccessTokenSilently();
    return axios({
      ...config,
      baseURL: import.meta.env.VITE_API_URL,
      headers: {
        ...config.headers,
        Authorization: `Bearer ${token}`
      }
    });
  };

  return apiCall;
}
