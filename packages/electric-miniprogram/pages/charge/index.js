const app = getApp();
Page({
  data: {
    area: 0,
    meter: '',
    room: '',
    paytype: '',
    active: [],
    extra: [false, true, true],
    amount: 0,
    amtArr: [10, 20, 30, 50, 80, 100, 150, 200]
  },
  onLoad(param) {
    if (param.openid) app.globalData.openid = param.openid;
  },
  onShow() {
    const [meter, area] = app.getMeterAndArea();

    this.setData({
      room: meter.substring(meter.lastIndexOf('*') + 1),
      meter: meter,
      area: area,
      paytype: area == 7 ? '微信支付' : '缴费平台支付'
    });
  },
  about() {
    app.about();
  },
  offlineCharge() {
    const self = this;
    wx.hideLoading();
    wx.showModal({
      title: '提示',
      confirmColor: '#45c8dc',
      confirmText: '复制网址',
      cancelText: '关闭',
      content: '马房山校区暂不支持小程序内支付，请前往校园缴费平台充值\r\nhttp://cwsf.whut.edu.cn',
      success(res) {
        if (res.confirm)
          wx.setClipboardData({
            data: 'http://cwsf.whut.edu.cn/casLogin?myurl=elecdetails516E023'
          });
      }
    });
  },
  check() {
    const self = this;
    if (this.data.area == 7) this.wxPayCharge();
    else this.offlineCharge();

    wx.showLoading({
      title: '支付中'
    });
    wx.checkIsSupportSoterAuthentication({
      success(res) {
        if (res.supportMode.length !== 0 && res.supportMode.includes('fingerPrint')) {
          wx.startSoterAuthentication({
            requestAuthModes: ['fingerPrint'],
            challenge: 'token.team',
            authContent: '需要验证身份以继续充值电费',
            success: self.cardCharge,
            fail() {
              wx.hideLoading();
              app.alert({
                title: '充值失败',
                content: '未通过身份验证，无法继续充值'
              });
            }
          });
        } else self.cardCharge();
      },
      fail: self.cardCharge
    });
  },
  cardCharge() {
    wx.hideLoading();
    app.alert({
      title: '充值失败',
      content: '尚未开通校园卡电子账户充值'
    });
  },
  wxPayCharge() {
    app
      .login()
      .then(result => {
        return app.request.post(
          'https://raw.githubusercontent.com/crazyurus/electric-pc/master/packages/electric-service/data/pay/prepare.json',
          {
            openid: result.openid,
            area: this.data.area,
            amount: this.data.amount,
            sno: wx.getStorageSync('sno'),
            meter: this.data.meter,
            type: 'JSAPI'
          }
        );
      })
      .then(result => {
        wx.requestPayment({
          timeStamp: String(result.sign.timestamp),
          nonceStr: result.return.nonce_str,
          package: 'prepay_id=' + result.return.prepay_id,
          signType: 'MD5',
          paySign: result.sign.str,
          success() {
            app.alert({
              title: '支付成功',
              content:
                '充值的电量预计1-10分钟后下发到电表，可以在购电详情中查询。若长时间仍未成功下发，请咨询所在校区充值点的工作人员。'
            });
            wx.reportAnalytics('charge', {
              amount: this.data.amount,
              paytype: this.data.paytype
            });
          }
        });
      });
  },
  clickChangeBtn() {
    const payTypeArr = ['校园卡电子账户支付', '微信支付'];
    const self = this;
    wx.showActionSheet({
      itemList: payTypeArr,
      success(res) {
        self.setData({
          paytype: payTypeArr[res.tapIndex]
        });
      }
    });
  },
  clickChargeAmt(e) {
    let id = e.currentTarget.dataset.id;
    let arr = new Array(9);
    arr[id] = true;

    if (id == 8) {
      this.setData({
        extra: [true, false, true]
      });
    } else {
      this.setData({
        active: arr,
        amount: this.data.amtArr[id]
      });
      this.check();
    }
  },
  chargeExtraAmt(e) {
    let arr = new Array(9);
    arr[8] = true;

    this.setData({
      extraAmt: e.detail.value,
      extra: [true, true, false],
      active: arr,
      amount: e.detail.value
    });
    this.check();
  },
  clickOfflineBtn() {
    const station = require('electric-service').getStations();
    const names = ['南湖', '西院/鉴湖', '东院', '余区', '升升公寓'];

    wx.showActionSheet({
      itemList: names,
      success(res) {
        const index = res.tapIndex;
        wx.navigateTo({
          url:
            '/pages/charge/map?' +
            'title=' +
            names[index] +
            '电费充值点' +
            '&address=' +
            (index == 4 ? '武汉升升学府物业管理有限公司' : '武汉理工大学水电管理中心') +
            '&telephone=' +
            station[index].telephone +
            '&latitude=' +
            station[index].position[0] +
            '&longitude=' +
            station[index].position[1]
        });
      }
    });
  }
});
