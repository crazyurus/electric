import request from '../utils/request';

const host = 'web.wutnews.net';

export default {
  async user() {
    return request(host, '/api/user');
  },
  async room() {
    return request(host, '/api/room');
  },
}
