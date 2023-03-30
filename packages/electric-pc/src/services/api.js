import request from '../utils/request';

export default {
  getInformationDetail(params) {
    return request('/information/detail.json', {
      method: 'GET',
      body: params,
    });
  },
  getInformationCharge(params) {
    return request('/information/pay.json', {
      method: 'GET',
      body: params,
    });
  },
  getInformationStatistics(params) {
    return request('/information/statistics.json', {
      method: 'GET',
      body: params,
    });
  },
  updateInformation(params) {
    return request('/information/update.json', {
      method: 'GET',
      body: params,
    });
  },
  getNotificationList(params) {
    return request('/notification/list.json', {
      method: 'GET',
      body: params,
    });
  },
  getNotificationDetail(link) {
    return request('/notification/detail.json', {
      method: 'GET',
      body: {
        link,
      },
    });
  },
};
