import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    sno: '',
    userName: '',
    meter: '',
    area: 0
  },
  mutations: {
    init (state, response) {
      state.sno = response.sno;
      state.userName = response.userName;
      state.meter = response.meter;
      state.area = response.area;
    },
    meter (state, response) {
      state.meter = response.meter;
      state.area = response.area;
    }
  },
  strict: process.env.NODE_ENV !== 'production'
});
