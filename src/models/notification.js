import api from '../services/api';

export default {
  namespace: 'notification',

  state: {
    list: [],
  },

  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(api.getNotificationList, payload);
      yield put({
        type: 'saveNotificationList',
        payload: response.data,
      });
    },
    *detail({ link }, { call }) {
      return yield call(api.getNotificationDetail, link);
    },
  },

  reducers: {
    saveNotificationList(state, action) {
      return {
        ...state,
        list: state.list.concat(action.payload),
      };
    },
  },
};
