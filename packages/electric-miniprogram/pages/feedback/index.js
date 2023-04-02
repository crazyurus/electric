const app = getApp();
Page({
  tucao() {
    wx.navigateToMiniProgram({
      appId: 'wx8abaf00ee8c3202e',
      extraData: {
        id: 66640,
        customData: {
          customInfo: wx.getStorageSync('sno')
        }
      }
    });
  },
  telephone() {
    const station = require('electric-service').getStations();
    const names = ['南湖', '西院/鉴湖', '东院', '余区'];

    wx.showActionSheet({
      itemList: names,
      success(res) {
        const index = res.tapIndex;

        wx.makePhoneCall({
          phoneNumber: station[index].telephone
        });
      }
    });
  },
  group(e) {
    const { gid } = e.currentTarget.dataset;

    wx.showModal({
      title: '加入QQ群',
      confirmColor: '#45c8dc',
      confirmText: '复制群号',
      cancelText: '关闭',
      content: `请复制群号 ${gid} 并打开QQ加入`,
      success(res) {
        if (res.confirm) wx.setClipboardData({
          data: gid,
        });
      }
    });
  }
});