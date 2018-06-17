import api from '../services/api';
import web from '../services/web';
import { refactRoom } from '../utils/utils';
import { setAuthority } from '../utils/authority';

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
    *fetchRoomDetail(_, { select, call, put }) {
      const room = yield select(state => state.room.room);
      const response = yield call(api.InfoDetail, refactRoom(room));
      yield put({
        type: 'saveRoomDetail',
        payload: response.data,
      });
    },
    *updateRoomDetail(_, { select, call, put }) {
      const room = yield select(state => state.room.room);
      const response = yield call(api.InfoUpdate, refactRoom(room));
      if (response.data)
        yield put({
          type: 'update',
          payload: response.data,
        });
      return response;
    },
    *fetchEverydayInfo(_, { select, call, put }) {
      const room = yield select(state => state.room.room);
      const response = yield call(api.InfoEveryday, refactRoom(room));

      const everyday = {};
      let month = 0;
      for (const day in response.data) {
        const current = day.split('-');
        month = Number.parseInt(current[0]);
        if (!everyday[month]) everyday[month] = [];
        everyday[month].push({
          x: Number.parseInt(current[1]),
          y: Number.parseFloat(response.data[day]),
        });
      }

      yield put({
        type: 'saveEverydayInfo',
        payload: everyday,
      });

      return month;
    },
    *register({ payload }, { call, put }) {
      const response = yield call(web.register, payload);
      yield put({
        type: 'saveCurrentRoom',
        payload,
      });
      return response;
    },
  },

  reducers: {
    saveCurrentRoom(state, action) {
      setAuthority(action.payload.meter ? 'user' : 'guest');
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
      const detail = { ...state.detail };
      detail.time = action.payload.time
        .split('.')[0]
        .replace('T', ' ')
        .replace('-0', '/')
        .replace('-0', '/')
        .replace('-', '/')
        .replace('-', '/');
      detail.left = action.payload.left;
      return {
        ...state,
        detail,
      };
    },
    reset(state) {
      return {
        room: state.room,
        detail: {
          sum: '0',
          today: {},
          month: {},
        },
        everyday: {},
      };
    },
    saveEverydayInfo(state, { payload }) {
      return {
        ...state,
        everyday: payload,
      };
    },
  },
};
