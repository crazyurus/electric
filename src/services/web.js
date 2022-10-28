import request from '../utils/request';

export default {
  user() {
    return request('/user/me.json');
  },
  room() {
    return request('/room.json');
  },
  register(params) {
    return request('/user/register.json', {
      method: 'PUT',
      body: params,
    });
  },
  prepare(params) {
    return request('/pay/prepare.json', {
      method: 'POST',
      body: params,
    });
  },
  cwsf(params) {
    return request('/pay/cwsf.json', {
      method: 'POST',
      body: params,
    });
  },
  check(params) {
    return request('/pay/check.json', {
      method: 'POST',
      body: params,
    });
  },
};
