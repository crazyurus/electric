<template>
  <f7-page name="everyday">
    <div class="content-block-title">以下是近二个月每天的用电情况（单位：度）</div>
    <div class="content-block" style="height: calc(100% - 70px); margin-bottom: 0;" id="chart"></div>
  </f7-page>
</template>

<script>
  export default {
    mounted () {
      this.$indicator.show();
      Promise.all([
        import('echarts/lib/echarts'),
        import('echarts/lib/chart/bar'),
        import('echarts/lib/component/legendScroll')
      ]).then(([ echarts ]) => {
        this.$http.get('/information/statistics.json', {
          id: this.$store.state.meter,
          area: this.$store.state.area
        }).then(result => {
          // 数据处理
          const data = new Map();
          for (let item in result) {
            const date = item.split('-');
            if (!data.has(date[0])) data.set(date[0], []);
            data.get(date[0]).push(result[item]);
          }
          const keys = data.keys();
          const months = [];
          for (let key of keys) {
            months.push(key);
          }
          const legends = months.map(month => {
            return { name: parseInt(month) + '月' }
          });
          const month1 = data.get(months[0]);
          const month2 = data.get(months[1]);

          // 日期定义
          const day = [];
          for (let i = 1; i <= Math.max(month1.length, month2.length); ++i) {
            day.push(i + '日');
          }

          // 数据渲染
          const ElectricChart = echarts.init(document.getElementById('chart'));
          const option = {
            legend: {
              data: legends
            },
            grid: {
              top: 25,
              bottom: 25,
              left: 35,
              right: 15
            },
            xAxis: {
              type: 'value',
            },
            yAxis: {
              type: 'category',
              data: day,
              inverse: true,
              splitLine: {
                show: true
              }
            },
            series: [{
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
            }, {
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
            }]
          };

          this.$indicator.hide();
          ElectricChart.setOption(option);
        });
      });
    }
  }
</script>

<style scoped>

</style>
