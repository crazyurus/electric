import request from '../utils/request';

const host = '';

export default {
  async user() {
    return request(host, '/api/user.json');
  },
  async room() {
    return request(host, '/api/room.json');
  },
  async register(params) {
    return request(host, '/login/register.json', {
      method: 'POST',
      body: params,
    });
  },
  async prepare(params) {
    return request(host, '/pay/prepare.json', {
      method: 'POST',
      body: params,
    });
  },
  async cwsf(params) {
    return request(host, '/cwsf/pay.json', {
      method: 'POST',
      body: params,
    });
  },
  async check(params) {
    return request(host, '/pay/check.json', {
      method: 'POST',
      body: params,
    });
  },
};
