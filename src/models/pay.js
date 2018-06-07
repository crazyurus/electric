import web from '../services/web';
import sae from '../services/sae';

export default {
  namespace: 'pay',

  state: {
    qrcode: '',
    order: '',
  },

  effects: {
    *prepare({ payload }, { call, put }) {
      const response = yield call(web.prepare, payload);
      yield put({
        type: 'saveQrcode',
        payload: response.data.return,
      });
    },
    *ip(_, { call }) {
      const response = yield call(sae.ip);
      return response.ip;
    },
    *check({ payload }, { call }) {
      const response = yield call(web.check, payload);
      return response.status;
    },
  },

  reducers: {
    saveQrcode(state, { payload }) {
      return {
        ...state,
        qrcode: payload.code_url,
        order: payload.prepay_id,
      };
    },
  },
};
