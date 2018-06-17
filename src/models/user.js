import web from '../services/web';
import { setAuthority } from '../utils/authority';

export default {
  namespace: 'user',

  state: {
    current: {},
    authority: 'anonymous',
  },

  effects: {
    *fetchCurrent(_, { call, put }) {
      const response = yield call(web.user);
      yield put({
        type: 'saveCurrentUser',
        payload: response,
      });
    },
  },

  reducers: {
    saveCurrentUser(state, action) {
      const authority = action.payload.room
        ? action.payload.sno === 'anonymous' ? 'anonymous' : 'user'
        : 'guest';
      setAuthority(authority);
      return {
        ...state,
        current: action.payload,
        authority,
      };
    },
  },
};
