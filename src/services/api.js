import request from '../utils/request';

const host = '';

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
    return request(host, '/info/day', {
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
  async NoticeList(params) {
    return request(host, '/notice/api', {
      method: 'POST',
      body: params,
    });
  },
  async NoticeDetail(link) {
    return request(host, '/notice/content?link=' + link);
  },
};
