import request from '../utils/request';

const host = '';

export default {
  async user() {
    return request(host, '/api/user');
  },
  async room() {
    return request(host, '/api/room');
  },
  async register(params) {
    return request(host, '/login/register', {
      method: 'POST',
      body: params,
    });
  },
  async prepare(params) {
    return request(host, '/pay/prepare', {
      method: 'POST',
      body: params,
    });
  },
  async cwsf(params) {
    return request(host, '/cwsf/pay', {
      method: 'POST',
      body: params,
    });
  },
  async check(params) {
    return request(host, '/pay/check', {
      method: 'POST',
      body: params,
    });
  },
};
