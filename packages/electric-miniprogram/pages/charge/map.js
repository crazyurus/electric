Page({
  data: {
    title: '',
    address: '',
    telephone: '',
    longitude: 0,
    latitude: 0
  },
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: options.title
    });

    this.setData(options);
  },
  makePhoneCall() {
    wx.makePhoneCall({
      phoneNumber: this.data.telephone
    });
  },
  openLocation() {
    wx.openLocation({
      latitude: Number.parseFloat(this.data.latitude),
      longitude: Number.parseFloat(this.data.longitude),
      scale: 18,
      name: this.data.title,
      address: this.data.address
    });
  }
})