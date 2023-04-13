const app = getApp();
Page({
  data: {
    list: [],
    page: 1,
    loading: false,
    area: 0
  },
  onReady() {
    const [meter, area] = app.getMeterAndArea();

    this.data.area = area;
    this.loadNoticeList();

    this.setData({
      from: area == 7 ? '余家头校区管理委员会' : '后勤保障处'
    });
  },
  onReachBottom() {
    this.loadNoticeList();
  },
  loadNoticeList() {
    if (this.data.loading) return;

    this.data.loading = true;
    wx.showNavigationBarLoading();
    app.request
      .post(
        'https://raw.githubusercontent.com/crazyurus/electric-pc/master/packages/electric-service/data/notification/list.json',
        {
          page: this.data.page,
          area: this.data.area
        },
        {
          loading: false
        }
      )
      .then(result => {
        if (result.length === 0) return;

        this.data.loading = false;
        this.data.page++;
        wx.hideNavigationBarLoading();

        this.setData({
          list: this.data.list.concat(result)
        });
      });
  }
});
