const app = getApp();
Page({
  data: {
    article: {
      title: '关于掌上理工大电费功能及电费查询小程序无法使用的公告',
      content: '亲爱的同学们：<br><br>　　感谢大家一直以来对于掌上理工大及Token团队的支持。<br>　　为了解决与教育部及学校相关规定不符的问题，掌上理工大将暂时关闭全部服务，包括微信/QQ小程序平台在内的电费查询与充值服务，并进行整改。对各位同学学习生活造成的不便，我们深表歉意。<br>　　从2013年到2019年，掌上理工大陪伴理工学子走过了大学生活中的风风雨雨。是同学们的厚爱让我们坚守初心，只做能真正让用户觉得好用的产品。告别是暂时的，Token团队将会负重前行，用更好的产品服务理工学子。<br>　　掌上理工大整改完成后，我们将尽快恢复服务，期待与同学们的再次相会。<br><p style="text-align:right"><br>Token团队<br>2019.9.14</p><br><i>同学们可以在电脑上访问学校的缴费平台网站 <a style="color:#45c8dc">http://cwsf.whut.edu.cn/</a>，完成电费的查询和充值。</i>',
      time: '2010-09-14',
      attachment: false
    }
  },
  onLoad(options) {
    // app.request.get('https://api.wutnews.net/electric/notice/content?link=' + options.link).then(result => {
    //   wx.setNavigationBarTitle({
    //     title: ''
    //   });

    //   this.setData({
    //     article: result
    //   });
    // });
  },
  onShareAppMessage(res) {
    return {
      title: this.data.article.title,
      success(res) {
        app.toast('分享成功');
      }
    }
  }
});