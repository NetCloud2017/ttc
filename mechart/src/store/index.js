import user from './user/';
import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import global from './global/';
import formTable from './formtable/';
import browser from './browser/';
import header from './header/';
import permission from './permission/permission';
import topicDetail from './topicDetail';
import skHomeData from './skhomeData/index';
Vue.use(Vuex);
Vue.prototype.$http = axios.create({
  timeout: 60000
});

export default new Vuex.Store({
  modules: {
    user,
    global,
    formTable,
    browser,
    header,
    permission,
    topicDetail,
    skHomeData
  }
});
