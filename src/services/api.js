import request from '../utils/request';

const host = '';

export default {
  async InfoDetail(params) {
    return request(host, '/info/detail.json', {
      method: 'POST',
      body: params,
    });
  },
  async InfoCharge(params) {
    return request(host, '/info/pay.json', {
      method: 'POST',
      body: params,
    });
  },
  async InfoEveryday(params) {
    return request(host, '/info/day.json', {
      method: 'POST',
      body: params,
    });
  },
  async InfoUpdate(params) {
    return request(host, '/info/update.json', {
      method: 'POST',
      body: params,
    });
  },
  async NoticeList(params) {
    return request(host, '/notice/api.json', {
      method: 'POST',
      body: params,
    });
  },
  async NoticeDetail(link) {
    return request(host, '/notice/content.json?link=' + link);
  },
};
