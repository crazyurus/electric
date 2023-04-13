import CountUp from './../../utils/countup';

const app = getApp();
Page({
  data: {
    area: 0,
    showRange: false,
    result: {
      left: 0,
      today: {
        use: 0,
        price: 0
      }
    },
    predict: '若干天后',
    broadcast: {}
  },
  onLoad() {
    this.fetchMeterData();

    wx.setNavigationBarTitle({
      title: ' '
    });
  },
  onPullDownRefresh() {
    this.updateLeftData(false);
  },
  onShareAppMessage() {
    return {
      title: '武汉理工大学电费查询'
    };
  },
  onPageScroll(e) {
    if (e.scrollTop <= 140 && this.data.title) {
      this.data.title = false;
      wx.setNavigationBarTitle({
        title: ' '
      });
    }
    if (e.scrollTop > 140 && !this.data.title) {
      this.data.title = true;
      wx.setNavigationBarTitle({
        title: '电费查询'
      });
    }
  },
  fetchMeterData() {
    const [meter, area] = app.getMeterAndArea();
    const self = this;

    app.request
      .post(
        'https://raw.githubusercontent.com/crazyurus/electric-pc/master/packages/electric-service/data/information/detail.json',
        {
          id: meter,
          area: area
        },
        {
          loading: '加载电费中'
        }
      )
      .then(result => {
        result.today.use = cut_kwh(result.today.use);
        result.today.price = Number.parseFloat(cut_yuan(result.today.price)).toFixed(2);
        result.sum = cut_kwh(result.sum);
        result.month.use = cut_kwh(result.month.use);
        result.month.price = cut_yuan(result.month.price);
        result.last.use = cut_kwh(result.last.use);
        result.last.price = cut_yuan(result.last.price);
        result.unit_price = cut_yuan(result.unit_price);

        let remain = calc_remain(result.left, result.speed);
        self.updateTopText(cut_do(result.left), remain);
        self.setData({
          result: result,
          predict: remain,
          area: area
        });
      })
      .catch(() => {
        app.toast('无法读取电表数据');
      });

    /* wx.request({
      url: 'https://web.wutnews.net/electric/api/broadcast',
      method: 'GET',
      success(result) {
        if (result.data) {
          if (result.data.link.indexOf('http') === 0) result.data.link = '/pages/charge/webview?url=' + encodeURIComponent(result.data.link);
          self.setData({ broadcast: result.data });
        }
      }
    }); */
  },
  updateLeftData(loading = true) {
    const [meter, area] = app.getMeterAndArea();

    if (!loading) {
      wx.showNavigationBarLoading();
      wx.setNavigationBarTitle({
        title: '抄表中'
      });
    }
    app.request
      .post(
        'https://raw.githubusercontent.com/crazyurus/electric-pc/master/packages/electric-service/data/information/update.json',
        {
          id: meter,
          area: area
        },
        {
          loading: loading ? '抄表中' : false
        }
      )
      .then(
        result => {
          if (!loading) {
            wx.hideNavigationBarLoading();
            wx.setNavigationBarTitle({
              title: ' '
            });
          }

          let remain = calc_remain(result.left, this.data.result.speed);
          this.updateTopText(result.left, remain, this.data.result.left);
          this.setData({
            'result.time': result.time
              .split('.')[0]
              .replace('T', ' ')
              .replace('-0', '/')
              .replace('-0', '/')
              .replace('-', '/')
              .replace('-', '/'),
            predict: remain
          });
        },
        result => {
          app.toast(result.errMsg);
        }
      );
  },
  updateTopText(left, remain, origin = 0) {
    new CountUp(this, 'result.left', origin, left, 2, 1).start();
    wx.setTopBarText({
      text: '宿舍剩余电量：' + left + ' 度'
    });
  },
  clickChargeBtn() {
    if (this.data.result.status && this.data.result.status.includes('未开户')) {
      app.alert('电表未开户，暂不可以充值电费，请前往自助充值点缴费');
    } else if (this.data.result.status && this.data.result.status.includes('在线')) {
      wx.navigateTo({
        url: '/pages/charge/index'
      });
    } else app.alert('电表处于离线状态，暂不可以充值电费，请前往线下充值点缴费');
  },
  clickRefreshBtn() {
    this.updateLeftData();
  },
  clickChangeBtn() {
    wx.showModal({
      title: '电费查询',
      content: '确定要更换宿舍信息吗？',
      confirmColor: '#45c8dc',
      success(res) {
        if (res.confirm) {
          wx.clearStorageSync();
          wx.setTopBarText({
            text: '武汉理工大学电费查询：请选择宿舍'
          });
          wx.redirectTo({
            url: '/pages/index/choose'
          });
        }
      }
    });
  },
  switchNoticeLeft(e) {
    this.setData({
      showRange: e.detail.value
    });
  },
  offlineStation() {
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

function cut_kwh(str) {
  return str.replace('千瓦时', '');
}

function cut_do(str) {
  return str.replace('度', '');
}

function cut_yuan(str) {
  return str.replace('元', '');
}

function str_do(str) {
  return str.replace('千瓦时', '度');
}

function str_yuan(str) {
  return '￥' + cut_yuan(str);
}

function calc_remain(left, speed) {
  if (speed == -1) return '很久之后';
  var remain = Math.floor(cut_do(left) / speed);
  var now = new Date();
  var predict = new Date(now.getFullYear(), now.getMonth(), now.getDate() + remain);
  return (
    (predict.getFullYear() == now.getFullYear() ? '' : predict.getFullYear() + '年') +
    (predict.getMonth() + 1) +
    '月' +
    predict.getDate() +
    '日'
  );
}
