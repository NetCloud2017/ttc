let state = {
  isClose: true
};
let mutations = {
  changeStatus (state) {
    state.isClose = !state.isClose;
  }
};

let actions = {
  closeDetail ({commit}) {
    commit('changeStatus');
  }
};
export default{
  state,
  mutations,
  actions
};
