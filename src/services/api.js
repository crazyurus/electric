import request from '../utils/request';

const host = 'api.wutnews.net';

export default {
  async InfoDetail(params) {
    return request(host, '/info/detail', {
      method: 'POST',
      body: params,
    });
  },
  async InfoCharge(params) {
    return request(host, '/info/pay', {
      method: 'POST',
      body: params,
    });
  },
  async InfoEveryday(params) {
    return request(host, '/info/everyday', {
      method: 'POST',
      body: params,
    });
  },
  async InfoUpdate(params) {
    return request(host, '/info/update', {
      method: 'POST',
      body: params,
    });
  },
}
