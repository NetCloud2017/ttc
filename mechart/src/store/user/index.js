import { refreshToken } from 'src/api/index.js';
import { PcCookie, PcLockr, enums } from '../../utils/';
const state = {
  loginName: '',
  userName: '',
  roleId: null,
  rememberMe: '',
  menuList: [],
  authToken: {
    access_token: '',
    expires_in: '',
    timestamp: ''
  },
  refreshToken: {
    refresh_token: ''
  },
  companyStatus: ''
};

const getters = {
  getLoginName: (state) => {
    if (state.loginName === '') {
      state.loginName = PcCookie.get(enums.USER.LOGIN_NAME);
    }
    return state.loginName;
  },
  getUserName: (state) => {
    if (state.userName === '') {
      state.userName = PcCookie.get(enums.USER.USER_NAME);
    }
    return state.userName;
  },
  getRoleId: (state) => {
    if (state.roleId === '' || state.roleId === null) {
      state.roleId = PcCookie.get(enums.USER.ROLE_ID);
    }
    return state.roleId;
  },
  getMenuList: (state) => {
    if (!state.menuList || state.menuList.length === 0) {
      state.menuList = PcLockr.get(enums.USER.MENU_LIST);
    }
    return state.menuList;
  },
  getRememberMe: (state) => {
    if (!state.rememberMe) {
      state.rememberMe = !!PcCookie.get(enums.USER.REMEMBER_ME);
    }
    return state.rememberMe;
  },
  getRefreshToken: (state) => {
    // console.log('getRefreshToken------------->state.refreshToken: ' + JSON.stringify(state.refreshToken));
    if (!state.refreshToken || !state.refreshToken.refresh_token) {
      state.refreshToken = PcCookie.get(enums.USER.REFRESH_TOKEN) ? JSON.parse(PcCookie.get(enums.USER.REFRESH_TOKEN)) : {};
    }
    // console.log('getRefreshToken--PcCookie after----------->state.refreshToken: ' + JSON.stringify(state.refreshToken));
    return state.refreshToken.refresh_token;
  },
  getAccessToken: (state) => {
    if (!state.authToken || state.authToken.access_token === '') {
      state.authToken = PcCookie.get(enums.USER.AUTH_TOKEN) ? JSON.parse(PcCookie.get(enums.USER.AUTH_TOKEN)) : {};
    }
    return state.authToken.access_token;
  },
  getAuthToken: (state) => {
    if (!state.authToken || state.authToken.access_token === '') {
      state.authToken = PcCookie.get(enums.USER.AUTH_TOKEN) ? JSON.parse(PcCookie.get(enums.USER.AUTH_TOKEN)) : {};
    }
    return state.authToken;
  },
  getCompanyStatus: (state) => {
    if (!state.companyStatus) {
      let companyStatus = PcCookie.get(enums.USER.COMPANY_STATUS);
      state.companyStatus = PcCookie.get(enums.USER.COMPANY_STATUS) ? companyStatus : '';
    }
    return state.companyStatus;
  }
};

const mutations = {
  updateRememberMe (state) {
    state.rememberMe = !state.rememberMe;
    if (state.rememberMe) {
      PcCookie.set({
        key: enums.USER.REMEMBER_ME,
        value: state.rememberMe
      });
    } else {
      PcCookie.delete({
        key: enums.USER.REMEMBER_ME
      });
    }
  },
  updateCompanyStatus(state, companyStatus) {
    state.companyStatus = companyStatus;
    PcCookie.set({
      key: enums.USER.COMPANY_STATUS,
      value: companyStatus
    });
  },
  updateUserInfo (state, loginName) {
    state.loginName = loginName;
    PcCookie.set({
      key: enums.USER.LOGIN_NAME,
      value: loginName
    });
  },
  updateUserName (state, userName) {
    state.userName = userName;
    PcCookie.set({
      key: enums.USER.USER_NAME,
      value: userName
    });
  },
  updateUserRole (state, roleId) {
    state.roleId = roleId;
    PcCookie.set({
      key: enums.USER.ROLE_ID,
      value: roleId
    });
  },
  updateUserMenu (state, menuList) {
    state.menuList = menuList;
    PcLockr.set(enums.USER.MENU_LIST, menuList);
  },
  updateAuthToken (state, authToken) {
    // console.log('updateAuthToken------------------->authToken: ' + JSON.stringify(authToken));
    state.authToken = authToken;
    // https://github.com/js-cookie/js-cookie/wiki/Frequently-Asked-Questions#expire-cookies-in-less-than-a-day
    let expires = 2 / 24;
    let isRemember = !!PcCookie.get(enums.USER.REMEMBER_ME);
    if (isRemember) {
      expires = 7;
    }
    // debugger;
    delete authToken['jti'];
    delete authToken['token_type'];
    let refreshToken = {};
    Object.assign(refreshToken, authToken);
    // delete authToken['scope'];
    delete authToken['refresh_token'];
    delete refreshToken['access_token'];
    state.refreshToken = refreshToken;
    // console.log('updateAuthToken------------------------>token:' + JSON.stringify(authToken));
    // console.log('updateAuthToken------------------------>refreshToken:' +  JSON.stringify(authToken));
    PcCookie.set({
      key: enums.USER.AUTH_TOKEN,
      value: authToken,
      expires: expires
    });
    PcCookie.set({
      key: enums.USER.REFRESH_TOKEN,
      value: refreshToken,
      expires: expires
    });
  },
  deleteUserInfo (state) {
    PcCookie.delete({
      key: enums.USER.LOGIN_NAME
    });
    state.loginName = '';
    PcCookie.delete({
      key: enums.USER.REMEMBER_ME
    });
    state.rememberMe = false;
  },
  deleteUserRole (state) {
    PcCookie.delete({
      key: enums.USER.ROLE_ID
    });
    state.roleId = '';
  },
  deleteAuthToken (state) {
    PcCookie.delete({
      key: enums.USER.AUTH_TOKEN
    });
    state.authToken = {};
  },
  deleteMenuList (state) {
    PcLockr.delete(enums.USER.MENU_LIST);
    state.menuList = [];
  },
  deleteRememberMe (state) {
    PcLockr.delete(enums.USER.REMEMBER_ME);
    state.rememberMe = '';
  },
  // 删除refreshToken
  deleteRefreshToken (state) {
    let refreshToken = PcCookie.get(enums.USER.REFRESH_TOKEN) ? JSON.parse(PcCookie.get(enums.USER.REFRESH_TOKEN)) : {};
    if (refreshToken && refreshToken.refresh_token && refreshToken.refresh_token !== '') {
      PcCookie.delete({
        key: enums.USER.REFRESH_TOKEN
      });
    }
    state.refreshToken = { refresh_token: '' };
  }
};

const actions = {
  get_access_token({commit}, cb) {
    if (!state.authToken || state.authToken.access_token === '') {
      state.authToken = PcCookie.get(enums.USER.AUTH_TOKEN) ? JSON.parse(PcCookie.get(enums.USER.AUTH_TOKEN)) : {};
    }
    // console.log('get_access_token->refreshToken->state.authToken: ' + JSON.stringify(state.authToken));
    if (state.authToken) {
      // 判断是否需要续租
      if ((new Date().getTime() - state.authToken.timestamp) > 100 * 60 * 1000) {
        refreshToken().then(res => {
          // console.log('get_access_token->refreshToken->res: ' + JSON.stringify(res));
          if (res.data.code === 200) {
            commit('updateAuthToken', res.data.result);
          } else {
            // console.log('get_access_token->refreshToken->deletePermissions');
            commit('deleteUserInfo');
            commit('deleteUserRole');
            commit('deleteAuthToken');
            commit('deleteMenuList');
            commit('deletePermissions');
            commit('deleteRememberMe');
            jumpLoginPage();
          }
        });
      }
    }
    cb && cb(state.authToken.access_token);
  },
  update_remember_me ({commit}) {
    commit('updateRememberMe');
  },
  update_user_info ({commit}, loginName) {
    commit('updateUserInfo', loginName);
  },
  update_user_name ({commit}, userName) {
    commit('updateUserName', userName);
  },
  update_user_role ({commit}, roleId) {
    commit('updateUserRole', roleId);
  },
  update_user_menu ({commit}, menuList) {
    commit('updateUserMenu', menuList);
  },
  update_company_status ({commit}, companyStatus) {
    commit('updateCompanyStatus', companyStatus);
  },
  delete_user_info ({commit}) {
    commit('deleteUserInfo');
    commit('deleteUserRole');
    commit('deleteAuthToken');
    commit('deleteMenuList');
    commit('deletePermissions');
    commit('deleteRememberMe');
  },
  update_auth_token ({commit}, authToken) {
    commit('updateAuthToken', authToken);
  },
  delete_refresh_token({commit}) {
    commit('deleteRefreshToken');
    commit('deleteUserInfo');
    commit('deleteUserRole');
    commit('deleteAuthToken');
    commit('deleteRememberMe');
  }
};

function jumpLoginPage () {
  window.location.href = process.env.JUMP_LOGIN_PAGE;
}

export default {
  state,
  getters,
  actions,
  mutations
};
