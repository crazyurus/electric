const app = getApp();
Page({
  data: {
    canSubmit: false,
    canInputNo: false,
    setInputFocus: false,
    inputValue: '',
    userInfo: {},
    roomInfo: {
      architecture: [],
      floor: [],
      meter: []
    },
    area: -1,
    login: {
      sno: '',
      password: '',
      show: false
    },
    select: {
      area: app.globalData.selectedArea,
      architecture: {
        id: 0,
        name: '请选择'
      },
      floor: {
        id: 0,
        name: '请选择'
      },
      meter: {
        id: 0,
        name: '请选择'
      }
    }
  },
  onShow() {
    let return_area = app.globalData.selectedArea.id == -1 ? -1 : app.globalData.selectedArea.id.split('*')[0];
    if (app.globalData.selectedArea.id == '1*Area*余区') return_area = '7';
    this.setData({
      'select.area': app.globalData.selectedArea
    });

    if (return_area == this.data.area) return;
    this.data.area = return_area;
    if (return_area != 0 || true) this.changeAreaPicker(app.globalData.selectedArea);
  },
  changeAreaPicker(select) {
    if (select.name === '升升公寓') {
      const ssArc = [
        '升升A栋',
        '升升B栋',
        '升升C栋',
        '升升E栋',
        '升升F栋',
        '升升H栋',
        '升升I栋',
        '升升J栋',
        '升升K栋',
        '升升L栋'
      ];
      let result = ssArc.map(arc => {
        return {
          id: arc,
          name: arc
        };
      });
      this.setData({
        'roomInfo.architecture': result
      });
      return;
    }

    this.getChooseInfo('architecture', select.id).then(result => {
      for (let item of result) {
        item.name = this.transMeterName(item.name);
      }
      this.setData({
        'roomInfo.architecture': result
      });
    });
  },
  changeArcPicker(e) {
    let select = this.data.roomInfo.architecture[e.detail.value];

    this.setData({
      'select.architecture': select
    });

    if (select.id === select.name) {
      app.toast('暂不支持');
      return;
    }

    this.getChooseInfo('floor', select.id).then(result => {
      if (result) {
        this.setData({
          'roomInfo.floor': result,
          setInputFocus: this.data.canInputNo
        });
      } else app.toast('暂不支持');
    });
  },
  changeFloorPicker(e) {
    let select = e.detail ? this.data.roomInfo.floor[e.detail.value] : e;

    this.getChooseInfo('meter', select.id).then(result => {
      result.sort((a, b) => {
        return a.name.split('-')[1] - b.name.split('-')[1];
      });

      this.setData({
        'select.floor': select,
        'roomInfo.meter': result
      });
    });
  },
  changeMeterPicker(e) {
    let select = e.detail ? this.data.roomInfo.meter[e.detail.value] : e;

    this.setData({
      'select.meter': select,
      canSubmit: true
    });
  },
  queryMeterDetail(e) {
    wx.setStorageSync('meter', this.data.select.meter.id);
    wx.setStorageSync('area', this.data.area);

    app.globalData.selectedArea = {
      id: -1,
      name: '请选择'
    };

    wx.redirectTo({
      url: '/pages/detail/index'
    });
  },
  about() {
    app.about();
  },
  showRoomPicker() {
    this.setData({
      canInputNo: false
    });
  },
  getChooseInfo(api, id) {
    return app.request.post(
      'https://raw.githubusercontent.com/crazyurus/electric-pc/master/packages/electric-service/data/choose/' +
        api +
        '.json',
      {
        id: id,
        area: this.data.area
      }
    );
  },
  transMeterName(arc) {
    switch (arc) {
      case '学海15栋':
        return '学海G栋/西15栋';
      case '学海16栋':
        return '学海F栋/西16栋';
      case '学海17栋':
        return '学海D栋/西17栋';
      case '学海18栋':
        return '学海E栋/西18栋';
      case '学海19栋':
        return '学海C栋/西19栋';
      case '学海20栋':
        return '学海B栋/西20栋';
      case '学海21栋':
        return '学海A栋/西21栋';
      default:
        return arc;
    }
  }
});
