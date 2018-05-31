import { queryRoomDetail, queryEverydayInfo } from '../services/api';
import { room } from '../services/web';

export default {
  namespace: 'room',

  state: {
    room: {
      meter: '',
      area: 0,
    },
    detail: {},
    everyday: {},
  },

  effects: {
    *fetchCurrent(_, { call, put }) {
      const response = yield call(room);
      yield put({
        type: 'saveCurrentRoom',
        payload: response,
      });
    },
    *fetchRoomDetail({ payload }, { call, put }) {
      const response = yield call(queryRoomDetail, payload);
      yield put({
        type: 'saveRoomDetail',
        payload: response.data,
      });
    },
    *fetchEverydayInfo(_, { call, put }) {
      const response = yield call(queryEverydayInfo);
      yield put({
        type: 'saveEverydayInfo',
        payload: response.data,
      });
    },
  },

  reducers: {
    saveCurrentRoom(state, action) {
      return {
        ...state,
        room: action.payload,
      };
    },
    saveRoomDetail(state, action) {
      return {
        ...state,
        detail: action.payload,
      };
    },
    saveEverydayInfo(state, action) {
      return {
        ...state,
        everyday: action.payload,
      };
    },
    clear() {
      return {
        room: {},
        detail: {},
        everyday: {},
      }
    },
  },
};
