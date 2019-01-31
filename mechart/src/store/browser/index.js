import { PcCookie, enums } from '../../utils/';
const state = {
  browserWidth: '',
  browserHeight: '',
  leftMenuWidth: '190px', // 190px
  rightContentWidth: '',
  mainContentHeight: '',
  menu_flag: true // 左侧菜单 true: 展开状态, false: 收缩
};

const getters = {
  getBrowserWidth: state => state.browserWidth,
  getBrowserHeight: state => state.browserHeight,
  getLeftMenuWidth: (state) => {
    if (state.leftMenuWidth === '') {
      state.leftMenuWidth = PcCookie.get(enums.BROWSER.LEFT_MENU_WIDTH);
    }
    return state.leftMenuWidth;
  },
  getRightContentWidth: state => state.rightContentWidth,
  getMainContentHeight: state => state.mainContentHeight,
  getMenuFlag: state => state.menu_flag
};

const mutations = {
  setBrowserWidth (state, browserWidth) {
    state.browserWidth = browserWidth;
    // 更新右边内容区的宽度 去掉px
    browserWidth = browserWidth.replace(/px/g, '');
    let leftMenuWidth = state.leftMenuWidth.replace(/px/g, '');
    state.rightContentWidth = browserWidth - leftMenuWidth + 'px';
  },
  setBrowserHeight (state, browserHeight) {
    state.browserHeight = browserHeight;
    // 更新主内容区的高度
    browserHeight = browserHeight.replace(/px/g, '');
    state.mainContentHeight = (browserHeight - 60) + 'px';
  },
  setLeftMenuWidth (state, leftMenuWidth) {
    state.leftMenuWidth = leftMenuWidth;
    PcCookie.set({
      key: enums.BROWSER.LEFT_MENU_WIDTH,
      value: leftMenuWidth
    });
    // 更新右边内容区的宽度
    let browserWidth = state.browserWidth.replace(/px/g, '');
    leftMenuWidth = leftMenuWidth.replace(/px/g, '');
    state.rightContentWidth = (browserWidth - leftMenuWidth) + 'px';
  },
  setMenuOpen (state) {
    state.menu_flag = true;
    PcCookie.set({
      key: enums.BROWSER.MENU_FLAG,
      value: true
    });
  },
  setMenuClose (state) {
    state.menu_flag = false;
    PcCookie.set({
      key: enums.BROWSER.MENU_FLAG,
      value: false
    });
  }
};

const actions = {
  set_browser_width ({commit}, browserWidth) {
    commit('setBrowserWidth', browserWidth);
  },
  set_browser_height ({commit}, browserHeight) {
    commit('setBrowserHeight', browserHeight);
  },
  set_left_menu_width ({commit}, leftMenuWidth) {
    commit('setLeftMenuWidth', leftMenuWidth);
  },
  set_menu_open ({commit}) {
    commit('setLeftMenuWidth', '190px');
    commit('setMenuOpen');
  },
  set_menu_close ({commit}) {
    commit('setLeftMenuWidth', '50px');
    commit('setMenuClose');
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
