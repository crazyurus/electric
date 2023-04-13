const app = getApp();
Page({
  onReady() {
    const [meter, area] = app.getMeterAndArea();

    app.request
      .post(
        'https://raw.githubusercontent.com/crazyurus/electric-pc/master/packages/electric-service/data/information/pay.json',
        {
          id: meter,
          area: area
        }
      )
      .then(result => {
        for (let item of result) {
          item.price = amtToFix2(item.price);
          item.color = typeToColor(item.type);
          item.out_time = item.out_time == '' ? item.pay_time : item.out_time;
        }

        this.setData({
          record: result
        });
      });
  }
});

function typeToColor(type) {
  switch (type) {
    case '微信支付':
      return 'bg-green';
    case '缴费平台支付':
      return 'bg-purple';
    case '系统售电':
      return 'bg-blue';
    case '统一月补':
      return 'bg-orange';
    case '临时调剂':
      return 'bg-red';
    case '一卡通售电':
      return 'bg-yellow';
    default:
      return 'bg-gray';
  }
}

function amtToFix2(amt) {
  return Number.parseFloat(amt).toFixed(2);
}
