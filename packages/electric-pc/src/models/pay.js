import web from '../services/web';
import api from '../services/api';
import { refactRoom } from '../utils/utils';

export default {
  namespace: 'pay',

  state: {
    type: 0,
    qrcode: '',
    order: '',
    record: [],
  },

  effects: {
    *cwsf({ payload }, { call, put }) {
      const response = yield call(web.cwsf, payload);
      yield put({
        type: 'saveQrcode',
        payload: {
          code_url: response.url,
          prepay_id: '',
        },
      });
      return response;
    },
    *prepare({ payload }, { call, put }) {
      const response = yield call(web.prepare, payload);
      yield put({
        type: 'saveQrcode',
        payload: {
          type: payload.type,
          ...response.data.return,
        },
      });
    },
    *check({ payload }, { call }) {
      const response = yield call(web.check, payload);
      return response.status;
    },
    *record(_, { select, call, put }) {
      const room = yield select(state => state.room.room);
      const response = yield call(api.getInformationCharge, refactRoom(room));
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
      };
    },
    saveQrcode(state, { payload }) {
      return {
        ...state,
        qrcode: payload.code_url,
        order: payload.prepay_id,
        type: payload.type,
      };
    },
  },
};
