let state = {
  assetsManagement: [],
  skHomeMarket: [],
  currentRow: {},
  skMarketList: [],
  twoTag: [],
  tagItemRow: {}
};
let mutations = {
  skAssets (state, {data}) {
    state.assetsManagement = data;
  },
  skHomeMarket (state, {data}) {
    state.skMarketData = data;
  },
  selectCurrentRow (state, {row}) {
    state.currentRow = row;
  },
  skMarketList (state, {data}) {
    state.skMarketList = data;
  },
  quotTwoTag (state, {data}) {
    // 二级标数据
    state.twoTag = data;
  },
  twoTagRowItem (state, {row}) {
    // 二级标的某个row ;
    console.log('twoTagRowItem,拿到row没呢？', row);
    state.tagItemRow = row;
  }
};
let actions = {
  sendSkAssets ({commit}, data) {
    commit('skAssets', {data});
  },
  sendMarketData ({commit}, data) {
    commit('skHomeMarket', {data});
  },
  sendCurrentRow ({commit}, row) {
    console.log('sendCurrentRow', row);
    commit('selectCurrentRow', {row});
  },
  sendMarketList ({commit}, data) {
    console.log('sendmarketList', data);
    commit('skMarketList', {data});
  },
  sendToTag ({commit}, data) {
    commit('quotTwoTag', {data});
  },
  sendToTagRow ({commit}, row) {
    // 二级标的某个row
    commit('twoTagRowItem', {row});
  }
};
export default{
  state,
  mutations,
  actions
  // getters
};
