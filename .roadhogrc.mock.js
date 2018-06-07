import { delay } from 'roadhog-api-doc';

// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
const api = [
  'GET /electric/api/user',
  'GET /electric/api/room',
  'POST /electric/info/detail',
  'POST /electric/info/day',
  'POST /electric/info/update',
  'POST /electric/choose/architecture',
  'POST /electric/choose/floor',
  'POST /electric/choose/meter',
  'POST /electric/login/register',
  'POST /electric/pay/prepare',
  'POST /electric/pay/check',
  'GET /electric/ip.php',
];

const proxy = {};
api.forEach(url => {
  proxy[url] = require('./mock/' + url.split(' ')[1].substring(10));
});

export default (noProxy ? {} : delay(proxy, 1000));
