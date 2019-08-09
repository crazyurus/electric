import axios from 'axios';

axios.interceptors.request.use(config => {
  config.headers['Content-Type'] = 'application/x-www-form-urlencoded';
  config.transformRequest = [data => {
    let ret = [];
    for (let item in data) {
      ret.push(encodeURIComponent(item) + '=' + encodeURIComponent(data[item]));
    }
    return ret.join('&');
  }];

  if (process.env.NODE_ENV === 'development' && !config.url.includes('alicloudapi.com')) {
    if (!config.url.includes('wutnews.net')) config.url = 'https://web.wutnews.net' + config.url;

    const objUrl = new URL(config.url);
    const service = objUrl.host.split('.')[0];
    config.url = `/${service}${objUrl.pathname}`;
  }

  return config;
});

export default {
  install(Vue) {
    Vue.prototype.$http = axios;
  }
};
