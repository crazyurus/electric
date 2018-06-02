import { stringify } from 'qs';
import request from '../utils/request';

const host = 'api.wutnews.net';

export async function queryRoomDetail(params) {
  return request(host, '/info/detail', {
    method: 'POST',
    body: params,
  });
}

export async function queryEverydayInfo() {
  return request(host, '/info/everyday');
}

export async function updateRoomDetail(params) {
  return request(host, '/info/update', {
    method: 'POST',
    body: params,
  });
}
