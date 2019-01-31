/**
 * @desc 自定义权限控制指令
 * @author chendezhi
 * @date 2018-09-14
 */
/* eslint-disable */
import Vue from 'vue';
import store from 'store/';

const permission = Vue.directive('permission', {
  bind: function (el, binding) {
    //console.log(JSON.stringify(binding));
    let permissions = store.getters.getPermission;
    let result = 0;
    for (let permission of permissions) {
      for (let bind of binding.value) {
        // console.log('permission-----bind : ' + bind + ' ---permission: ' + permission);
        if (permission === bind) {
          result += 1;
        }
      }
    }
    // console.log('permission-----result : ' + result);
    if (result > 0) {
      el.style.display = "";
    } else {
      el.style.display = "none";
    }
  }
});
// 判断用户是否有权限(当按钮有用v-if控制是否显示会与v-permission产生冲突,这是改用这个函数校验)
const checkPermission = function(bindPermissions) {
  let permissions = store.getters.getPermission;
  let result = 0;
  for (let permission of permissions) {
    for (let bind of bindPermissions) {
      // console.log('permission-----bind : ' + bind + ' ---permission: ' + permission);
      if (permission === bind) {
        result += 1;
      }
    }
  }
  // console.log('permission-----result : ' + result);
  return result > 0;
};
export default {
  permission,
  checkPermission
};
