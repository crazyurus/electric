App({
  globalData: {
    selectedArea: {
      id: -1,
      name: '请选择'
    },
    gid: 1,
    openid: null
  },
  fetch(options) {
    const self = this;
    const { loading = true, ...restOptions } = options;

    return new Promise((resolve, reject) => {
      if (loading) {
        wx.showLoading({
          title: loading === true ? '加载中' : loading,
          mask: true
        });
      }

      wx.request({
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        success(response) {
          if (response.statusCode === 200 && response.data && response.data.code === 0) {
            resolve(response.data.data);
          } else {
            self.toast(
              response.statusCode === 200 ? response.data.message : response.statusCode + ' ' + response.message
            );
            reject(response);
          }
        },
        fail: reject,
        complete() {
          if (loading) wx.hideLoading();
        },
        ...restOptions
      });
    });
  },
  get request() {
    const self = this;

    return {
      get(url, options) {
        return self.fetch({
          method: 'GET',
          url,
          ...options
        });
      },
      post(url, data, options) {
        return self.fetch({
          method: 'GET',
          url,
          data,
          ...options
        });
      }
    };
  },
  getMeterAndArea() {
    let meter = wx.getStorageSync('meter');
    let area = wx.getStorageSync('area');
    return [meter, area];
  },
  alert(param) {
    if (typeof param === 'string') {
      param = {
        content: param
      };
    }

    wx.showModal({
      title: param.title || '电费查询',
      content: param.content,
      showCancel: false,
      confirmColor: '#45c8dc'
    });
  },
  toast(title) {
    wx.showToast({
      title,
      icon: 'none'
    });
  },
  about() {
    this.alert('Token团队出品');
  },
  login() {
    const self = this;
    return new Promise((resolve, reject) => {
      if (this.globalData.userLogin) resolve(this.globalData.userLogin);
      else {
        wx.login({
          success(res) {
            self.request
              .post(
                'https://web.wutnews.net/electric/login/weapp',
                {
                  code: res.code
                },
                {
                  loading: false
                }
              )
              .then(result => {
                if (!result.openid) reject();
                self.globalData.userLogin = result;
                resolve(result);
              });
          },
          fail: reject
        });
      }
    });
  }
});
