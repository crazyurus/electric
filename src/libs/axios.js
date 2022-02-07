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

  return config;
});

export default {
  install(Vue) {
    Vue.prototype.$http = axios;
  }
};
