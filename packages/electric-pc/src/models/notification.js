import { getNotificationList, getNotificationDetail } from 'electric-service';

export default {
  namespace: 'notification',

  state: {
    list: [],
  },

  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(getNotificationList, payload);
      yield put({
        type: 'saveNotificationList',
        payload: response,
      });
    },
    *detail({ link }, { call }) {
      return yield call(getNotificationDetail, link);
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
