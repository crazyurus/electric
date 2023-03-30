import { pay, prepare, check, getInformationCharge } from 'electric-service';
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
      const response = yield call(pay, payload);
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
      const response = yield call(prepare, payload);
      yield put({
        type: 'saveQrcode',
        payload: {
          type: payload.type,
          ...response.return,
        },
      });
    },
    *check({ payload }, { call }) {
      const response = yield call(check, payload);
      return response.status;
    },
    *record(_, { select, call, put }) {
      const room = yield select(state => state.room.room);
      const response = yield call(getInformationCharge, refactRoom(room));
      yield put({
        type: 'saveChargeList',
        payload: response,
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
