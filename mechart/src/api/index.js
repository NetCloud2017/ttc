import axios from 'axios';
import store from '../store/';
const REFRESH_TOKEN_URL = process.env.REFRESH_TOKEN_URL;
export function refreshToken () {
  return axios({
    method: 'GET',
    url: REFRESH_TOKEN_URL,
    auth: {
      username: 'mali-soa-client-uac',
      password: 'maliSoaClientSecret'
    },
    params: {
      refreshToken: store.getters.getRefreshToken,
      accessToken: store.getters.getAccessToken
    }
  });
}
