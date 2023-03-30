import axios from 'axios';

const instance = axios.create({
  baseURL: 'https://raw.githubusercontent.com/crazyurus/electric-pc/master/data',
});

instance.interceptors.request.use(config => {
  config.method = 'GET';
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

instance.interceptors.response.use(response => {
  if (response.status === 200) {
    if (response.data.code === 0) {
      return response.data.data;
    }

    throw new Error(response.data.message);
  }

  throw new Error(response.statusText);
})

export default {
  install(Vue) {
    Vue.prototype.$http = instance;
  }
};
