import { delay } from 'roadhog-api-doc';

// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
const api = [
  'GET /electric/api/user.json',
  'GET /electric/api/room.json',
  'POST /electric/info/detail.json',
  'POST /electric/info/day.json',
  'POST /electric/info/update.json',
  'POST /electric/info/pay.json',
  'POST /electric/choose/architecture.json',
  'POST /electric/choose/floor.json',
  'POST /electric/choose/meter.json',
  'POST /electric/login/register.json',
  'POST /electric/pay/prepare.json',
  'POST /electric/pay/check.json',
  'POST /electric/pay/cwsf.json',
  'POST /electric/notice/api.json',
  'GET /electric/notice/content.json'
];

const proxy = {};
api.forEach(url => {
  proxy[url] = require('./mock/' + url.split(' ')[1].substring(10));
});

export default (noProxy ? {} : delay(proxy, 1000));
