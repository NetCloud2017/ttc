// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './router';
import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import axios from 'axios';
import Vuex from 'vuex';
import store from './store/';
import VueLazyload from 'vue-lazyload';
import infiniteScroll from 'vue-infinite-scroll';
import 'font-awesome/css/font-awesome.css';
import Mixin from './mixins';
import Bus from 'src/vueBus';
import filters from './filters';
import { enums, PcCookie, PcLockr, PcEncrypt } from 'utils/';
import 'element-ui/lib/theme-chalk/index.css';
import './style.less';
import './assets/iconfont/iconfont.css';
import permission from 'utils/permission/permission';
import { refreshToken } from 'src/api/index.js';
import {validateTips} from 'utils/tips';
import VideoPlayer from 'vue-video-player';
import Egrid from 'components/Egrid/index';
import preview from 'vue-photo-preview';
import 'vue-photo-preview/dist/skin.css';
import htmlToPdf from 'src/utils/html/htmlToPdf';
import imcc from '../static/imcc/webchat_pop';
import myCharts from 'src/utils/echarts/myCharts';
import infoTip from '@/components/dialog/infoTips';
import {
  Table,
  tableColumn,
  Row,
  Col,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Input,
  Select,
  Switch,
  Option,
  Button,
  Menu,
  Submenu,
  menuItem,
  menuItemGroup,
  Breadcrumb,
  breadcrumbItem,
  Dialog,
  Pagination,
  Form,
  formItem,
  MessageBox,
  Message,
  Loading,
  Checkbox,
  checkboxGroup,
  Radio,
  RadioGroup,
  RadioButton,
  Upload,
  Tree,
  Tabs,
  TabPane,
  Tooltip,
  Transfer,
  Cascader,
  Notification,
  DatePicker
} from 'element-ui';

const components = [
  Table,
  tableColumn,
  Row,
  Col,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Input,
  Select,
  Switch,
  Option,
  Button,
  Menu,
  Submenu,
  menuItem,
  menuItemGroup,
  Breadcrumb,
  breadcrumbItem,
  Dialog,
  Pagination,
  Form,
  formItem,
  Checkbox,
  checkboxGroup,
  Radio,
  RadioGroup,
  RadioButton,
  Upload,
  Tree,
  Tabs,
  TabPane,
  Tooltip,
  Transfer,
  Cascader,
  Notification,
  DatePicker
];
require('video.js/dist/video-js.css');
require('vue-video-player/src/custom-theme.css');
require('videojs-contrib-hls/dist/videojs-contrib-hls');
Vue.use(Egrid);
Vue.use(preview);
Vue.use(VideoPlayer);
Vue.use(htmlToPdf);
Vue.use(myCharts);
Vue.prototype.$ELEMENT = { size: 'small' };
components.map(component => {
  Vue.component(component.name, component);
});
Vue.use(Loading.directive);
Vue.use(permission);
Vue.prototype.$errorTip = Mixin.errorTip;
Vue.prototype.$notify = Notification;
Vue.prototype.$pcLoading = Loading.service;
Vue.prototype.$pcMessageBox = MessageBox;
Vue.prototype.$pcMessage = Message;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$pcNProgress = NProgress;
Vue.prototype.$pcBus = Bus;
Vue.prototype.$pcEnum = enums;
Vue.prototype.$pcEncrypt = PcEncrypt;
Vue.prototype.$pcLockr = PcLockr;
Vue.prototype.$pcCookie = PcCookie;
Vue.prototype.$imcc = imcc;
Vue.prototype.$infoTip = infoTip.install;

// Vue.prototype.$API_WESOCKET = process.env.API_WEBSOCKET;
Vue.prototype.$http = axios.create({
  timeout: 60000
});
Vue.prototype.$http.defaults.baseURL = process.env.API_ROOT;
function updateUserMenu () {
  let authToken = store.getters.getAuthToken;
  if (authToken && authToken.access_token && !authToken.updateMenuFlag) {
    Vue.prototype.$http({
      method: 'post',
      url: '/uac/user/loginAfter/1',
      data: ''
    })
      .then((res) => {
        Bus.$emit('roleId', res.result.loginAuthDto.roleId);
        authToken.updateMenuFlag = true;
        // 通知菜单 因为菜单先加载 而获取菜单耗时较多
        Bus.$emit('logined', res.result.menuList);
        // console.log(JSON.stringify(res.result.menuList, null, 2));
        store.dispatch('update_user_info', res.result.loginAuthDto.loginName);
        store.dispatch('update_user_name', res.result.loginAuthDto.userName);
        store.dispatch('update_user_role', res.result.loginAuthDto.roleId);
        store.dispatch('update_user_menu', res.result.menuList);
        store.dispatch('update_user_permission', res.result.authCodeSet);
        // store.dispatch('update_auth_token', authToken);
      })
      .catch((error) => {
        console.log(error);
      });
  } else {
    console.log('updateUserMenu.false-----false: ' + JSON.stringify(authToken));
  }
}

function jumpLoginPage () {
  window.location.href = process.env.JUMP_LOGIN_PAGE;
}

Vue.prototype.$http.interceptors.request.use((config) => {
  // console.log('interceptors.request-----config: ' + JSON.stringify(config));
  if (!config.url.indexOf('/auth') >= 0) {
    store.dispatch('get_access_token', (res) => {
      // console.log('main interceptors.request-----res: ' + JSON.stringify(res));
      if (res) {
        config.headers.Authorization = 'Bearer ' + res;
      } else {
        jumpLoginPage();
      }
    });
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

Vue.prototype.$http.interceptors.response.use((res) => {
  // console.log('拦截器');
  // console.log(res);
  // 富文本编辑器上传图片增加res.data.code === 0 判断
  if (res.data.code === 200 || res.data.code === 0) {
    if (res.data) {
      return res.data;
    }
  }
  if (res.data.code === 10011039 || res.data.code === 10011040 || res.data.code === 10011041) {
    // 验证token失败 || 解析header失败 || 页面已过期,请重新登录
    console.info(validateTips.LOGIN_TIMEOUT, res.data);
    // store.dispatch('delete_user_info');
    // window.location.href = '/';
    return Promise.reject(res);
  } else {
    let contentType = res.headers['content-type']; // 获取response headers 的content-type
    // 如果是文件流则不弹提示
    if (contentType && !contentType.startsWith('application/octet-stream') && !contentType.startsWith('application/vnd.ms-excel')) {
      Vue.prototype.$pcMessage.error({
        showClose: true,
        dangerouslyUseHTMLString: true,
        message: '<strong>' + res.data.message + '</strong>',
        duration: 3000
      });
    }
    // 导出execl
    if (res.status === 200) {
      return res;
    }
  }
}, (error) => {
  // console.log('main-interceptors.response-----error: ' + JSON.stringify(error));
  if (error.response) {
    // console.log('main-interceptors.response-----error.response: ' + JSON.stringify(error.response));
    switch (error.response.status) {
      case 401:
        // console.log('main-interceptors.response---parse before--error.config: ' + JSON.stringify(error.config));
        // let config = JSON.parse(error.config);
        let config = error.config;
        let configData = error.config.data;
        if (configData && configData !== '') {
          config.data = JSON.parse(error.config.data);
        } else {
          config.data = error.config.data;
        }
        config.params = error.config.params;
        // console.log('main-interceptors.response-----error.config: ' + JSON.stringify(config));

        // 判断是否已经刷新过token
        if (!config.isRetryRequest) {
          return refreshToken()
            .then(res => {
              // 修改flag
              config.isRetryRequest = true;
              // console.log('get_access_token->refreshToken->res: ' + JSON.stringify(res));
              if (res.data.code === 200) {
                // 用vuex重新设置用户身份信息
                store.commit('updateAuthToken', res.data.result);
                // 修改原请求的token
                config.headers.Authorization = 'Bearer ' + store.getters.getAccessToken;
                // console.log('main-interceptors.response-isRetryRequest->true----error.config: ' + JSON.stringify(config));
                /* 这边不需要baseURL是因为会重新请求url
                 *url中已经包含baseURL的部分了
                 *如果不修改成空字符串，会变成'api/api/xxxx'的情况 */
                // config.baseURL = '';
                // 重新请求
                return Vue.prototype.$http(config);
              } else {
                // console.log('get_access_token->refreshToken->deletePermissions');
                store.commit('deleteUserInfo');
                store.commit('deleteAuthToken');
                store.commit('deleteMenuList');
                store.commit('deletePermissions');
                store.commit('deleteRememberMe');
                jumpLoginPage();
              }
            })
            .catch(function () {
              // 刷新token失败只能跳转到登录页重新登录
              store.commit('deleteUserInfo');
              store.commit('deleteAuthToken');
              store.commit('deleteMenuList');
              store.commit('deletePermissions');
              store.commit('deleteRememberMe');
              jumpLoginPage();
              // throw error;
            });
        }
        return;
      default:
    }
  }
  let options = {
    autoClose: true,
    content: error.response.data.message
  };
  if (error.response) {
    console.error('error: ', error.response);
    if (error.response.status === 500) {
      options.content = error.response.data.message;
    } else if (error.response.status === 401) {
      options.content = validateTips.NOT_ALLOWED;
    } else {
      console.log('Error', error.message);
      options.content = validateTips.API_ERROR;
    }
  } else {
    options.content = validateTips.API_ERROR;
  }
  store.dispatch('new_notice', options);
});

router.beforeEach((to, from, next) => {
  PcCookie.setDomain(process.env.GBS_DOMAIN); // 设置获取cookie数据的域名
  PcCookie.set({
    key: enums.USER.REDIRECT_URI,
    value: window.location.href
  });
  let authToken = store.getters.getAuthToken;
  // console.log('beforeEach->getAuthToken---: ' + JSON.stringify(authToken));
  // store.dispatch('delete_user_info'); // 删除 .malicloud.net domain 下的cookie的用户数据
  store.dispatch('delete_refresh_token'); // 删除 .malicloud.net domain 下的cookie的refreshToken数据
  // console.log('beforeEach delete_user_info after->getAuthToken---: ' + JSON.stringify(authToken));
  PcCookie.setDomain(process.env.GBS_WEB_DOMAIN); // 设置获取cookie数据的域名
  let webAuthToken = store.getters.getAuthToken; // 获取系统的cookie缓存的authToken
  if (webAuthToken && webAuthToken.access_token) {
    authToken = webAuthToken;
  }
  /*  if (authToken && authToken.access_token) {
   // let permissions = store.getters.getPermission()
   store.dispatch('update_auth_token', authToken);
   store.dispatch('update_company_status', authToken.companyStatus);
   } */

  // console.log(store.getters.getCompanyStatus);
  // console.log('beforeEach->change domain getAuthToken---: ' + JSON.stringify(store.getters.getAuthToken));
  // console.log('beforeEach->coolies---geteAll: ' + JSON.stringify(PcCookie.geteAll()));
  // console.log('beforeEach->window.location.href: ' + window.location.href + ' next: ' + next);
  if (authToken && authToken.access_token) {
    store.dispatch('update_auth_token', authToken); // 保存登录成功后用户的数据到新domain下的cookie
    store.dispatch('update_company_status', authToken.companyStatus);
    updateUserMenu();
    NProgress.start();
    next();
  } else {
    jumpLoginPage();
  }
});
router.afterEach(transition => {
  NProgress.done();
});
Vue.directive('loadmore', {
  bind (el, binding) {
    var p = 0;
    var t = 0;
    var down = true;
    var selectWrap = el.querySelector('.el-table__body-wrapper');
    selectWrap.addEventListener('scroll', function () {
      // 判断是否向下滚动
      p = this.scrollTop;
      // if ( t < p){down=true}else{down=false}
      if (t < p) {
        down = true;
      } else {
        down = false;
      }
      t = p;
      // 判断是否到底
      const sign = 20;
      const scrollDistance = this.scrollHeight - this.scrollTop - this.clientHeight;
      // console.log('scrollDistance ' + scrollDistance)
      if (scrollDistance <= sign && down) {
        binding.value();
      }
    });
  }
});
Vue.config.productionTip = false;
Vue.use(Vuex);
Vue.use(VueLazyload, {
  loading: '/static/loading-svg/loading-bars.svg',
  try: 1 // default 1
});
Vue.use(infiniteScroll);
Vue.mixin(Mixin);
Object.keys(filters).forEach(k => Vue.filter(k, filters[k]));
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
