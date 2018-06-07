import web from '../services/web';
import api from '../services/api';
import sae from '../services/sae';
import { refactRoom } from '../utils/utils';

export default {
  namespace: 'pay',

  state: {
    qrcode: '',
    order: '',
    record: [],
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
    *record(_, { select, call, put }) {
      const room = yield select(state => state.room.room);
      const response = yield call(api.InfoCharge, refactRoom(room));
      yield put({
        type: 'saveChargeList',
        payload: response.data,
      });
    },
  },

  reducers: {
    saveChargeList(state, { payload }) {
      return {
        ...state,
        record: payload,
      }
    },
    saveQrcode(state, { payload }) {
      return {
        ...state,
        qrcode: payload.code_url,
        order: payload.prepay_id,
      };
    },
  },
};
