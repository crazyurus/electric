import request from '../utils/request';

const host = '';

export default {
  async InfoDetail(params) {
    return request(host, '/info/detail', {
      method: 'GET',
      body: params,
    });
  },
  async InfoCharge(params) {
    return request(host, '/info/pay', {
      method: 'GET',
      body: params,
    });
  },
  async InfoEveryday(params) {
    return request(host, '/info/day', {
      method: 'GET',
      body: params,
    });
  },
  async InfoUpdate(params) {
    return request(host, '/info/update', {
      method: 'GET',
      body: params,
    });
  },
  async NoticeList(params) {
    return request(host, '/notice/list', {
      method: 'GET',
      body: params,
    });
  },
  async NoticeDetail(link) {
    return request(host, '/notice/content', {
      method: 'GET',
      body: {
        link,
      },
    });
  },
};
