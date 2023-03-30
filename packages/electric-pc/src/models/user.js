import { getUserInfo } from 'electric-service';

export default {
  namespace: 'user',

  state: {
    current: {},
    authority: 'user',
  },

  effects: {
    *fetchCurrent(_, { call, put }) {
      const response = yield call(getUserInfo);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        current: action.payload,
      };
    },
  },
};
