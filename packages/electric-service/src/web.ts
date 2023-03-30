import axios from './base';

export function getUserInfo() {
  return axios.get('/user/me.json');
}

export function getRoomInfo() {
  return axios.get('/room.json');
}

export function getChooseInfo(api: string, id: number, area: number) {
  return axios.post('/choose/' + api + '.json', {
    id,
    area
  });
}

export function register(params: any) {
  return axios.put('/user/register.json', params);
}

export function prepare(params: any) {
  return axios.post('/pay/prepare.json', params);
}

export function pay(params: any) {
  return axios.post('/pay/cwsf.json', params);
}

export function check(params: any) {
  return axios.post('/pay/check.json', params);
}
