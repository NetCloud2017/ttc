const state = {
  formDataList: [],
  params: {},
  url: ''
};

const getters = {
  getFormDataList: state => state.formDataList
};

const actions = {
  fetchFormDataListAction ({commit, state}) {
    this.$http({
      method: 'POST',
      url: state.url,
      data: state.params
    }).then((res) => {
      commit('updateFormDataList', res.data.result);
    }).catch((err) => {
      console.log(err);
    });
  }
};

const mutations = {
  updateFormDataList (state, payload) {
    state.formDataList = payload;
  }
};

export default {
  state,
  getters,
  actions,
  mutations
};
