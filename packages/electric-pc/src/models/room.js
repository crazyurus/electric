import { register, getRoomInfo, getInformationDetail, updateInformation, getInformationStatistics } from 'electric-service';
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
      rank: [0, 0],
    },
    everyday: {},
  },

  effects: {
    *fetchCurrent(_, { call, put }) {
      const response = yield call(getRoomInfo);
      yield put({
        type: 'saveCurrentRoom',
        payload: response,
      });
      return response;
    },
    *fetchRoomDetail(_, { select, call, put }) {
      const room = yield select(state => state.room.room);
      const response = yield call(getInformationDetail, refactRoom(room));
      yield put({
        type: 'saveRoomDetail',
        payload: response,
      });
    },
    *updateRoomDetail(_, { select, call, put }) {
      const room = yield select(state => state.room.room);
      const response = yield call(updateInformation, refactRoom(room));
      if (response)
        yield put({
          type: 'update',
          payload: response,
        });
      return response;
    },
    *fetchEverydayInfo(_, { select, call, put }) {
      const room = yield select(state => state.room.room);
      const response = yield call(getInformationStatistics, refactRoom(room));

      const everyday = {};
      let month = 0;
      for (const day in response) {
        const current = day.split('-');
        month = Number.parseInt(current[0]);
        if (!everyday[month]) everyday[month] = [];
        everyday[month].push({
          x: Number.parseInt(current[1]),
          y: Number.parseFloat(response[day]),
        });
      }

      yield put({
        type: 'saveEverydayInfo',
        payload: everyday,
      });

      return month;
    },
    *register({ payload }, { call, put }) {
      const response = yield call(register, payload);
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
          rank: [0, 0],
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
