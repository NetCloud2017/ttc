/**
 * @desc 全局状态-权限数据
 * @author chendezhi
 * @date 2018-0911
 */
import { PcLockr, enums } from 'utils/';
export default {
  state: {
    permissions: []
  },
  mutations: {
    setPermissions(state, permissions) {
     // console.log('setPermissions state: ' + JSON.stringify(state) + ' ---permissions: ' + JSON.stringify(permissions));
      state.permissions = permissions;
      PcLockr.set(enums.USER.USER_PERMISSIONS, permissions);
    },
    deletePermissions (state) {
      PcLockr.delete(enums.USER.USER_PERMISSIONS);
      state.permissions = [];
    }
  },
  getters: {
    getPermission: (state) => {
      if (!state.permissions || state.permissions.length === 0) {
        state.permissions = PcLockr.get(enums.USER.USER_PERMISSIONS);
      }
      if (!state.permissions || state.permissions.length === 0) {
        state.permissions = [];
      }
     // console.log('getPermission state: ' + JSON.stringify(state) + ' ---permissions: ' + JSON.stringify(state.permissions));
      return state.permissions;
    }
  },
  actions: {
    update_user_permission ({commit}, permissionList) {
      commit('setPermissions', permissionList);
    }
  }

};
