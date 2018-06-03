import api from '../services/api';
import web from '../services/web';

export default {
  namespace: 'room',

  state: {
    room: {
      meter: '',
      area: 0,
    },
    detail: {
      sum: '0',
      today: {},
      month: {},
    },
    everyday: {},
  },

  effects: {
    *fetchCurrent(_, { call, put }) {
      const response = yield call(web.room);
      yield put({
        type: 'saveCurrentRoom',
        payload: response,
      });
      return response;
    },
    *fetchRoomDetail({ payload }, { call, put }) {
      const response = yield call(api.InfoDetail, payload);
      yield put({
        type: 'saveRoomDetail',
        payload: response.data,
      });
    },
    *updateRoomDetail({ payload }, { call, put }) {
      const response = yield call(api.InfoUpdate, payload);
      if (response.data) yield put({
        type: 'update',
        payload: response.data,
      });
      return response;
    },
    *fetchEverydayInfo(_, { call, put }) {
      const response = yield call(api.InfoEveryday);
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
    update(state, action) {
      const detail = {...state.detail};
      detail.time = action.payload.time.split('.')[0].replace('T', ' ').replace('-0', '/').replace('-0', '/').replace('-', '/').replace('-', '/');
      detail.left = action.payload.left;
      return {
        ...state,
        detail,
      };
    },
    saveEverydayInfo(state, action) {
      return {
        ...state,
        everyday: action.payload,
      };
    },
  },
};
