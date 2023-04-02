const app = getApp();
Page({
  data: {
    active: {
      '请选择': false,
      '南湖': false,
      '东院': false,
      '西院': false,
      '鉴湖': false,
      '余区': false,
      '西院教工宿舍': false,
      '东院教工宿舍': false,
      '余区教工宿舍': false
    },
    info: {
      '升升公寓': '0*Area*升升',
      '南湖': '1*Area*南湖',
      '东院': '2*Area*东院',
      '西院': '3*Area*西院',
      '鉴湖': '3*Area*西院',
      '余区': '1*Area*余区',
      '西院教工宿舍': '28*Area*2500西院教工宿舍',
      '东院教工宿舍': '29*Area*1500东院教工宿舍',
      '余区教工宿舍': '30*Area*5500余区教工宿舍'
    },
    pos: {
      '南湖': [30.511150, 114.333920],
      '东院': [30.518820, 114.354210],
      '西院': [30.521900, 114.348290],
      '鉴湖': [30.512930, 114.344050],
      '升升公寓': [30.504910, 114.343150],
      '余区': [30.607400, 114.356410]
    },
    location: {
      show: false,
      name: ''
    },
    search: {
      show: false
    },
    device: {}
  },
  onLoad() {
    let arr = {};
    let self = this;

    arr[app.globalData.selectedArea.name] = true;

    wx.getLocation({
      'type': 'gcj02',
      success(res) {
        let max_value = -999;
        let max_area = '';
        let current = [res.latitude, res.longitude];

        for (let area in self.data.pos) {
          let distance = self.distance(current, self.data.pos[area]);
          if (distance > max_value) {
            max_value = distance;
            max_area = area;
          }
        }

        self.setData({
          location: {
            show: true,
            name: max_area
          },
          device: wx.getSystemInfoSync()
        });
      }
    });

    this.setData({
      active: arr
    });
  },
  callback(e) {
    let name = e.currentTarget.dataset.name;
    let arr = {};
    arr[name] = true;
    this.setData({
      active: arr
    });

    app.globalData.selectedArea = {
      id: this.data.info[name],
      name: name
    }

    wx.navigateBack();
  },
  distance(pos1, pos2) {
    return Math.sin(pos1[0]) * Math.sin(pos2[0]) * Math.cos(pos1[1] - pos2[1]) + Math.cos(pos1[0]) * Math.cos(pos2[0]);
  },
  setSearchFocus() {
    this.setData({
      'search.show': true
    });
  },
  lostSearchFocus() {
    this.setData({
      'search.show': false
    });
  },
  support() {
    app.toast('暂不支持');
  }
});
