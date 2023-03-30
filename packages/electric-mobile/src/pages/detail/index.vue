<template>
  <f7-page name="detail">
    <div class="page-content pull-to-refresh-content">
      <div class="pull-to-refresh-layer">
        <div class="preloader preloader-white"></div>
        <div class="pull-to-refresh-arrow"></div>
      </div>
      <div class="cost-area">
        <div class="cost-title" @click="charge">剩余电量(度)</div>
        <div class="cost-content number" @click="charge" ref="left">0.00</div>
        <div class="cost-button" @click="charge">充值电费</div>
        <div class="cost-wrapper" @click="charge" ref="wave">
          <div class="cost-wave"></div>
        </div>
        <div class="cost-bottom row">
          <div class="col-50">
            <div class="cost-bottom-title">当日用电(度)</div>
            <div class="cost-bottom-content number" ref="todayCost">0.00</div>
          </div>
          <div class="col-50">
            <div class="cost-bottom-title">当日电费(元)</div>
            <div class="cost-bottom-content number" ref="todayPrice">0.00</div>
          </div>
        </div>
      </div>
      <f7-list>
        <li class="list-group-title" style="justify-content: space-between">
          <div>
            <img :src="icons.home">
            <span>宿舍信息</span>
          </div>
          <a class="link-after link" @click="change">更换宿舍</a>
        </li>
        <f7-list-item title="宿舍" :after="electric.name"></f7-list-item>
        <f7-list-item title="电表状态" :after="electric.status"></f7-list-item>
        <f7-list-item title="电表编号" :after="electric.no"></f7-list-item>
      </f7-list>
      <f7-list>
        <li class="list-group-title">
          <img :src="icons.pay">
          <span>支付信息</span>
        </li>
        <li>
          <a class="item-link item-content" href="/charge/record">
            <div class="item-inner">
              <div class="item-title">购电详情</div>
            </div>
          </a>
        </li>
        <li>
          <a class="item-link item-content" href="/detail/everyday">
            <div class="item-inner">
              <div class="item-title">每日用电</div>
            </div>
          </a>
        </li>
        <f7-list-item title="用电趋势" :after="'预计' + remain + '用完'"></f7-list-item>
        <li>
          <a class="item-link item-content" href="/notification/list">
            <div class="item-inner">
              <div class="item-title">停电通知</div>
            </div>
          </a>
        </li>
        <li class="item-content">
          <div class="item-inner">
            <div class="item-title">当月电费</div>
            <div class="item-after">{{electric.month.use|do}}/{{electric.month.price|yuan}}</div>
          </div>
        </li>
        <li class="item-content">
          <div class="item-inner">
            <div class="item-title">总共用电</div>
            <div class="item-after">{{electric.sum|do}}</div>
          </div>
        </li>
        <li class="item-content">
          <div class="item-inner">
            <div class="item-title">电费单价</div>
            <div class="item-after">{{electric.unit_price|unit}}</div>
          </div>
        </li>
        <li class="item-content">
          <div class="item-inner">
            <div class="item-title">剩余电量不足时提醒</div>
            <div class="item-after">
              <f7-input type="switch" v-model="warning.show"></f7-input>
            </div>
          </div>
        </li>
        <li class="item-content" v-show="warning.show">
          <div class="item-inner">
            <div class="item-title label">剩余电量警告值</div>
            <mt-range :min="1" :max="120" :step="1" v-model="warning.value"></mt-range>
            <div class="item-after item-range">{{warning.value}}</div>
          </div>
        </li>
      </f7-list>
      <f7-list>
        <li class="list-group-title">
          <img :src="icons.rank">
          <span>排名信息</span>
        </li>
        <li class="item-content">
          <div class="item-inner">
            <div class="item-title label">用电排名</div>
            <div class="item-after item-range">{{electric.rank[0] + '/' + electric.rank[1]}}</div>
          </div>
        </li>
        <li>
          <a class="item-link item-content" @click="showStation">
            <div class="item-inner">
              <div class="item-title">线下充值点</div>
            </div>
          </a>
        </li>
        <li>
          <a class="item-link item-content" href="/feedback">
            <div class="item-inner">
              <div class="item-title">帮助与建议</div>
            </div>
          </a>
        </li>
        <li>
          <a class="item-link item-content" @click="miniProgram">
            <div class="item-inner">
              <div class="item-title">打开小程序</div>
            </div>
          </a>
        </li>
      </f7-list>
      <div class="content-block">
        <p>以上电费信息更新于&nbsp;{{electric.time}}，关注微信/QQ小程序“武汉理工大学电费查询”也可以查询哦</p>
      </div>
    </div>
  </f7-page>
</template>

<script>
  import Vue from 'vue'
  import { Range } from 'mint-ui';
  import CountUp from '@/libs/CountUp.js';

  import svgHome from '@/images/detail/home.svg';
  import svgPay from '@/images/detail/pay.svg';
  import svgRank from '@/images/detail/rank.svg';

  import stations from '@/data/station';

  Vue.component(Range.name, Range);

  const MAX_INDICATOR_LEFT = 300;

  export default {
    data() {
      return {
        electric: {
          name: '',
          status: '加载中……',
          left: MAX_INDICATOR_LEFT,
          today: {
            use: '',
            price: ''
          },
          month: {},
          rank: [0, 0],
        },
        warning: {
          show: false,
          value: 20
        },
        icons: {
          home: svgHome,
          pay: svgPay,
          rank: svgRank
        }
      }
    },
    mounted() {
      const { meter, area } = this.$store.state;
      const self = this;
      this.electric.name = meter.split('*')[2];

      Vue.nextTick(() => {
        this.$f7.showIndicator();
        this.$http.get('/information/detail.json', {
          id: meter,
          area: area
        }).then(result => {
          this.$f7.hideIndicator();

          new CountUp(this.$refs.todayCost, 0, Number.parseFloat(result.today.use.replace('千瓦时', '')), 2, 1).start();
          new CountUp(this.$refs.todayPrice, 0, Number.parseFloat(result.today.price.replace('千瓦时', '')), 2, 1).start();

          this.electric = {
            ...result,
            left: Number.parseFloat(result.left.replace('度', ''))
          };
        }).catch(() => {
          this.$f7.hideIndicator();
          this.$message.toast('无法读取电表数据');
        });

        this.Dom7('.pull-to-refresh-content').on('ptr:refresh', e => {
          this.update();
        });
      });
    },
    methods: {
      charge() {
        if (this.electric.status.includes("未开户")) {
          this.$message.alert('由于上一次缴费系统主服务器故障，导致部分宿舍线上显示未开户，这部分宿舍暂时只能通过线下缴费点缴费，预计下学期全部恢复。');
        } else if (this.electric.status.includes('在线')) {
          this.$f7.mainView.router.loadPage('/charge/index');
        } else this.$message.alert('电表处于离线状态，暂不可以充值电费，请前往自助充值点缴费');
      },
      change(e) {
        this.$message.confirm("确定要更换宿舍信息吗？").then(() => {
          this.$f7.showPreloader("更换宿舍中…");
          e.target.disabled = true;
          return this.$http.post('/user/logout.json');
        }).then(() => {
          this.$f7.hidePreloader();
          this.$f7.mainView.router.reloadPage('/index/choose');
        });
      },
      update() {
        // this.$f7.showPreloader("正在抄表中…");
        this.$http.get('/information/update.json', {
          id: this.$store.state.meter,
          area: this.$store.state.area
        }).then(result => {
          this.electric.time = result.time.split('.')[0].replace('T', ' ').replace('-0', '/').replace('-0', '/').replace('-', '/').replace('-', '/');
          this.electric.left = result.left;

          this.$f7.pullToRefreshDone();
        }).catch(error => {
          this.$message.alert(error.message);
        });
      },
      showStation() {
        const stationButtons = stations.map((station, index) => ({
          text: station.name,
          onClick: () => {
            const name = encodeURIComponent(station.name + '电费充值点');
            this.$f7.mainView.router.loadPage('/charge/map/' + station.position[0] + '/' + station.position[1] + '/' + name + '/' + encodeURIComponent(index === 4 ? '武汉升升学府物业管理有限公司' : '武汉理工大学水电管理中心') + '/' + station.telephone);
          }
        }));
        const cancelButtons = [{
          text: '关闭',
          color: 'red'
        }];

        stationButtons.unshift({
          text: '线下电费充值点',
          label: true
        });

        this.$f7.actions([stationButtons, cancelButtons]);
      },
      miniProgram() {
        this.$navigator.open('mqqapi://microapp/open?mini_appid=1109559705&fakeUrl=https://m.q.qq.com/a/s/11c84551edb3b31057d38c468a0a0818&xcxPath=pages/index/index.html&xcxSourceType=0');
      }
    },
    computed: {
      isChargable() {
        return this.$store.state.area == 7 && this.electric.status.indexOf('离线') < 0;
      },
      remain() {
        const speed = this.electric.speed;
        if (!speed || speed == -1) return '很久之后';
        let remain = Math.floor(this.electric.left / speed);
        let now = new Date();
        let predict = new Date(now.getFullYear(), now.getMonth(), now.getDate() + remain);
        return (predict.getFullYear() === now.getFullYear() ? '' : predict.getFullYear() + '年') + (predict.getMonth() + 1) + '月' + predict.getDate() + '日';
      }
    },
    watch: {
      ['electric.left'](value, oldValue) {
        const percent = value / MAX_INDICATOR_LEFT;
        const dom = this.$refs.wave;

        new CountUp(this.$refs.left, oldValue, value, 2, 1).start();

        if (value <= 15 && value > 5) dom.className = 'cost-wrapper warning';
        else if (value < 5) dom.className = 'cost-wrapper danger';
      }
    },
    filters: {
      yuan(value) {
        return value ? '￥' + Number.parseFloat(value.replace('元', '')).toFixed(2) : '';
      },
      do(value) {
        return value ? value.replace('千瓦时', '') : '';
      },
      unit(value) {
        return value ? '￥' + value.replace('元', '') + '/度' : '';
      }
    }
  }
</script>

<style scoped>
  @import "../../css/wave.css";

  .link-disabled {
    opacity: 0.55;
  }

  .cost-area {
    position: relative;
    background: #45c8dc;
    color: #fff;
    text-align: center;
  }

  .cost-title {
    position: absolute;
    top: 44px;
    width: 100%;
    text-align: center;
    z-index: 30;
    font-size: 16px;
  }

  .cost-content {
    position: absolute;
    font-size: 42px;
    top: 66px;
    width: 100%;
    text-align: center;
    z-index: 30;
  }

  .cost-button {
    position: absolute;
    top: 128px;
    left: calc(50% - 40px);
    width: 80px;
    height: 24px;
    line-height: 24px;
    font-size: 12px;
    text-align: center;
    z-index: 30;
    border: 1px solid #83DBE8;
    border-radius: 13px;
  }

  .cost-bottom {
    padding: 0.5rem 0;
    background: rgb(98, 206, 223);
  }

  .cost-bottom-title {
    font-size: 0.95rem;
    padding-bottom: 0.3rem;
    font-weight: 300;
  }

  .cost-bottom-content {
    font-size: 1rem;
  }

  .cost-wrapper {
    position: relative;
    width: 180px;
    height: 180px;
    top: 100px;
    left: 50%;
    border: 1px solid #83DBE8;
    transform: translate(-50%, -50%);
    border-radius: 50%;
    overflow: hidden;
    margin-bottom: 40px;
  }

  .toolbar-inner a.link {
    display: inline-block;
    width: 50%;
    text-align: center;
  }

  .list-group-title {
    font-size: 1.08rem;
    height: 3rem;
    font-weight: 300;
    display: flex;
    align-items: center;
  }

  .list-group-title img {
    width: 1.5rem;
    height: 1.5rem;
    display: inline-block;
    vertical-align: text-bottom;
    margin-right: 0.35rem;
  }

  .list-block {
    margin: 0;
    font-weight: 300;
  }

  .item-range {
    width: 2rem;
    justify-content: flex-end;
  }

  .mt-range {
    flex: 1;
    margin-left: 20px;
  }

  .link-after {
    font-size: 16px;
    font-weight: normal;
  }

  .pull-to-refresh-layer {
    background-color: #45c8dc;
  }

  .pull-to-refresh-layer .pull-to-refresh-arrow {
    background-image: url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%2026%2040'%3E%3Cpolygon%20points%3D'9%2C22%209%2C0%2017%2C0%2017%2C22%2026%2C22%2013.5%2C40%200%2C22'%20fill%3D'%23ffffff'%2F%3E%3C%2Fsvg%3E");
  }
</style>
