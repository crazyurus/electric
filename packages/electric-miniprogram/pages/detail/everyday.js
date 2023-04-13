import * as echarts from '../../utils/ec-canvas/ec-canvas/echarts.js';

const app = getApp();
Page({
  data: {
    ec: {
      lazyLoad: true
    }
  },
  onShow() {
    const ecComponent = this.selectComponent('#chart');
    const [meter, area] = app.getMeterAndArea();
    const self = this;

    app.request
      .post(
        'https://raw.githubusercontent.com/crazyurus/electric-pc/master/packages/electric-service/data/information/statistics.json',
        {
          id: meter,
          area
        }
      )
      .then(result => {
        // 数据处理
        let data = new Map();
        for (let item in result) {
          let date = item.split('-');
          if (!data.has(date[0])) data.set(date[0], []);
          data.get(date[0]).push(result[item]);
        }
        const keys = data.keys();
        let months = [];
        for (let key of keys) {
          months.push(key);
        }
        const legends = months.map(month => {
          return { name: parseInt(month) + '月' };
        });
        const month1 = data.get(months[0]);
        const month2 = data.get(months[1]);
        // 日期定义
        let day = [];
        for (let i = 1; i <= Math.max(month1.length, month2.length); ++i) {
          day.push(i + '日');
        }
        // 渲染
        wx.getSystemInfo({
          success(deviceInfo) {
            ecComponent.init((canvas, width, height) => {
              const chart = echarts.init(canvas, null, {
                width: deviceInfo.windowWidth - 30,
                height: deviceInfo.windowHeight - 70
              });
              chart.setOption({
                legend: {
                  data: legends
                },
                grid: {
                  top: 25,
                  bottom: 25,
                  left: 50,
                  right: 0
                },
                xAxis: {
                  type: 'value'
                },
                yAxis: {
                  type: 'category',
                  data: day,
                  inverse: true,
                  splitLine: {
                    show: true
                  }
                },
                series: [
                  {
                    type: 'bar',
                    name: legends[0].name,
                    data: month1,
                    label: {
                      show: true,
                      position: 'right',
                      color: '#666666'
                    },
                    itemStyle: {
                      color: 'rgba(69, 200, 220, 0.2)',
                      borderWidth: 1,
                      borderColor: '#45c8dc'
                    }
                  },
                  {
                    type: 'bar',
                    name: legends[1].name,
                    data: month2,
                    label: {
                      show: true,
                      position: 'right',
                      color: '#666666'
                    },
                    itemStyle: {
                      color: 'rgba(252,171,83, 0.2)',
                      borderWidth: 1,
                      borderColor: '#fcab53'
                    }
                  }
                ]
              });
              return chart;
            });
          }
        });
      });
  }
});
