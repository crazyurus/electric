import api from '../services/api';

export default {
  namespace: 'notice',

  state: {
    list: [],
  },

  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(api.NoticeList, payload);
      yield put({
        type: 'saveNoticeList',
        payload: response.data,
      });
    },
  },

  reducers: {
    saveNoticeList(state, action) {
      return {
        ...state,
        list: state.list.concat(action.payload),
      };
    },
  },
};
