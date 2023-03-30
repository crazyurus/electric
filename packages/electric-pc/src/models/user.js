import web from '../services/web';

export default {
  namespace: 'user',

  state: {
    current: {},
    authority: 'user',
  },

  effects: {
    *fetchCurrent(_, { call, put }) {
      const response = yield call(web.user);
      yield put({
        type: 'saveCurrentUser',
        payload: response.data,
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
