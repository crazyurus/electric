import axios from './base';

export function getInformationDetail() {
  return axios.get('/information/detail.json');
}

export function getInformationCharge() {
  return axios.get('/information/pay.json');
}

export function getInformationStatistics() {
  return axios.get('/information/statistics.json');
}

export function updateInformation() {
  return axios.get('/information/update.json');
}

export function getNotificationList() {
  return axios.get('/notification/list.json');
}

export function getNotificationDetail(link: string) {
  return axios.get('/notification/detail.json?link=' + link);
}
