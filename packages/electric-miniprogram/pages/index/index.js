Page({
  onLoad: function (options) {
    wx.redirectTo({
      url: wx.getStorageSync('meter') ? '/pages/detail/index' : '/pages/index/choose'
    });
  }
});
