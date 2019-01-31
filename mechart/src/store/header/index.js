/**
 * @desc 首页头部全局提示数据
 * @author chendezhi
 * @date 2018-0911
 */
import { PcCookie, enums } from '../../utils/';
export default {
  state: {
    showPaddingTaskTip: false, // 是否显示待办事项红点
    showNotifyInfoTip: false // 是否显示消息提醒红点
  },
  mutations: {
    setPaddingTaskTip(state, show) {
      state.showPaddingTaskTip = show;
      PcCookie.set({
        key: enums.USER.SHOW_PADDING_TASK_POINT,
        value: state.showPaddingTaskTip
      });
    },
    setNotifyInfoTip(state, show) {
      state.showNotifyInfoTip = show;
      PcCookie.set({
        key: enums.USER.SHOW_NOTICE_POINT,
        value: state.showNotifyInfoTip
      });
    }
  },
  actions: {

  },
  getters: {
    getShowNoticePoint: (state) => {
      if (!state.showNotifyInfoTip) {
        let showStr = PcCookie.get(enums.USER.SHOW_NOTICE_POINT);
        state.showNotifyInfoTip = showStr ? showStr === 'true' : false;
      }
      return state.showNotifyInfoTip;
    },
    getShowPaddingTaskPoint: (state) => {
      if (!state.showPaddingTaskTip) {
        let showStr = PcCookie.get(enums.USER.SHOW_PADDING_TASK_POINT);
        state.showPaddingTaskTip = showStr ? showStr === 'true' : false;
      }
      return state.showPaddingTaskTip;
    }
  }
};
