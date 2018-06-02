import request from '../utils/request';

const host = 'api.wutnews.net';

export default {
  async InfoDetail(params) {
    return request(host, '/info/detail', {
      method: 'POST',
      body: params,
    });
  },
  async InfoEveryday() {
    return request(host, '/info/everyday');
  },
  async InfoUpdate(params) {
    return request(host, '/info/update', {
      method: 'POST',
      body: params,
    });
  },
}
