import web from '../services/web';
import { setAuthority } from '../utils/authority';

export default {
  namespace: 'user',

  state: {
    currentUser: {},
    currentAuthority: 'anonymous',
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
      const authority = action.payload.sno === 'anonymous' ? 'anonymous' : 'user';
      setAuthority(authority);
      return {
        ...state,
        currentUser: action.payload,
        currentAuthority: authority,
      };
    },
  },
};
