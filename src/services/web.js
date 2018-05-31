import request from '../utils/request';

const host = 'web.wutnews.net';

export async function user() {
  return request(host, '/api/user');
}

export async function room() {
  return request(host, '/api/room');
}
