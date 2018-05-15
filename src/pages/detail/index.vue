<template>
  <div class="page" data-page="detail">
    <div class="page-content">
      <div class="cost-area">
        <div class="cost-title">剩余电量(度)</div>
        <div class="cost-content" id="txtLeft">0.00</div>
        <div class="cost-bottom row">
          <div class="col-50">
            <div class="cost-bottom-title">当日用电(度)</div>
            <div class="cost-bottom-content" id="txtTodayCost">0.00</div>
          </div>
          <div class="col-50">
            <div class="cost-bottom-title">当日电费(元)</div>
            <div class="cost-bottom-content" id="txtTodayPrice">0.00</div>
          </div>
        </div>
      </div>
      <div class="list-block">
        <ul>
          <li class="list-group-title">
            <img src="/Application/Electric/Assets/image/home.svg">
            <span>宿舍信息</span>
          </li>
          <li class="item-content">
            <div class="item-inner">
              <div class="item-title">宿舍</div>
              <div class="item-after">{{electric.name}}</div>
            </div>
          </li>
          <li class="item-content">
            <div class="item-inner">
              <div class="item-title">电表状态</div>
              <div class="item-after">{{electric.status}}</div>
            </div>
          </li>
          <li class="item-content">
            <div class="item-inner">
              <div class="item-title">电表编号</div>
              <div class="item-after">{{electric.no}}</div>
            </div>
          </li>
        </ul>
      </div>
      <div class="list-block">
        <ul>
          <li class="list-group-title">
            <img src="/Application/Electric/Assets/image/pay.svg">
            <span>支付信息</span>
          </li>
          <li>
            <a class="item-link item-content" href="/detail/pay">
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
          <li class="item-content">
            <div class="item-inner">
              <div class="item-title">用电趋势</div>
              <div class="item-after">预计{{remain}}用完</div>
            </div>
          </li>
          <li>
            <a class="item-link item-content" href="/notice/list">
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
          <template v-if="$store.state.sno !== 'anonymous'">
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
                <range :min="1" :max="120" :step="1" v-model="warning.value"></range>
                <div class="item-after item-range">{{warning.value}}</div>
              </div>
            </li>
          </template>
        </ul>
      </div>
      <div class="list-block">
        <ul>
          <li class="list-group-title">
            <img src="/Application/Electric/Assets/image/rank.svg">
            <span>排名信息</span>
          </li>
          <li class="item-content">
            <div class="item-inner">
              <div class="item-title">区域用电排名</div>
              <div class="item-after text-red">暂无</div>
            </div>
          </li>
          <li class="item-content">
            <div class="item-inner">
              <div class="item-title">建筑用电排名</div>
              <div class="item-after text-red">暂无</div>
            </div>
          </li>
          <li v-if="$store.state.sno !== 'anonymous'">
            <a class="item-link item-content external" href="/feedback?from=electric">
              <div class="item-inner">
                <div class="item-title">帮助与建议</div>
              </div>
            </a>
          </li>
        </ul>
      </div>
      <div class="content-block" style="margin-bottom: 80px">
        <p>以上电费信息更新于&nbsp;{{electric.time}}，关注微信小程序“武汉理工大学电费查询”也可以查询哦</p>
        <p class="text-center" v-if="$store.state.sno === 'anonymous'">本服务由 <a href="http://token.team/">Token团队</a> 提供技术支持</p>
      </div>
    </div>
    <f7-toolbar class="toolbar" v-if="$store.state.sno !== 'anonymous'">
      <a href="javascript:;" class="link" :class="{ 'link-disabled': !isChargable }" @click="charge">充值</a>
      <a href="javascript:;" class="link" @click="update">刷新电量</a>
      <a href="javascript:;" class="link" @click="change">更换宿舍</a>
    </f7-toolbar>
  </div>
</template>

<script>
  import Token from '../../libs/Token'
  import { Loader } from '../../libs/Loader'
  import Vue from 'vue'
  import { Range } from 'vux'

  export default {
    components: { Range },
    data () {
      return {
        electric: {
          name: '加载中……',
          status: '',
          left: 0,
          today: {
            use: '',
            price: ''
          },
          month: {}
        },
        warning: {
          show: false,
          value: 20
        }
      }
    },
    mounted () {
      Vue.nextTick(() => {
        const { meter, area } = this.$store.state;
        this.$f7.showIndicator();
        this.$http.post('https://api.wutnews.net/electric/info/detail', {
          id: meter,
          area: area
        }).then(result => {
          this.$f7.hideIndicator();

          result = result.data;
          if(result.errCode === 0) {
            Loader('/Application/Electric/Assets/js/count.js').then(() => {
              new CountUp("txtLeft", 0, Number.parseFloat(result.data.left.replace('度', '')), 2, 1).start();
              new CountUp("txtTodayCost", 0, Number.parseFloat(result.data.today.use.replace('千瓦时', '')), 2, 1).start();
              new CountUp("txtTodayPrice", 0, Number.parseFloat(result.data.today.price.replace('千瓦时', '')), 2, 1).start();
            });

            this.electric = result.data;
          }
          else Token.message.alert(result.errMsg);
        });

        if (location.search.indexOf('refresh=') > -1) token.setMeter(meter + '|' + area);
      });
    },
    methods: {
      charge () {
        if (this.electric.status.indexOf('离线') < 0) this.$f7.mainView.router.loadPage('/charge/index');
        else Token.message.alert('电表处于离线状态，暂不可以充值电费，请前往自助充值点缴费');
      },
      change (e) {
        Token.message.confirm("确定要更换宿舍信息吗？").then(() => {
          this.$f7.showPreloader("更换宿舍中…");
          e.target.disabled = true;
          return this.$http.get('/electric/login/logout');
        }).then(() => {
          if (typeof token !== 'undefined' && token.setMeter) token.setMeter('');
          this.$f7.hidePreloader();
          this.$f7.mainView.router.reloadPage('/index/choose');
        });
      },
      update () {
        this.$f7.showPreloader("正在抄表中…");
        this.$http.post('https://api.wutnews.net/electric/info/update', {
          id: this.$store.state.meter,
          area: this.$store.state.area
        }).then(result => {
          this.$f7.hidePreloader();

          const left = this.electric.left.replace('度', '');
          this.electric.time = result.data.data.time.split('.')[0].replace('T', ' ').replace('-0', '/').replace('-0', '/').replace('-', '/').replace('-', '/');
          this.electric.left = result.data.data.left;
          new CountUp('txtLeft', Number.parseFloat(left), Number.parseFloat(result.data.data.left), 2, 1).start();
        }).catch(result => {
          Token.message.alert(result.data.errMsg);
        });
      }
    },
    computed: {
      isChargable () {
        return this.$store.state.area == 7 && this.electric.status.indexOf('离线') < 0;
      },
      remain () {
        const speed = this.electric.speed;
        if (!speed || speed == -1) return '很久之后';
        let remain = Math.floor(this.electric.left.replace('度', '') / speed);
        let now = new Date();
        let predict = new Date(now.getFullYear(), now.getMonth(), now.getDate() + remain);
        return (predict.getFullYear() === now.getFullYear() ? '' : predict.getFullYear() + '年') + (predict.getMonth() + 1) + '月' + predict.getDate() + '日';
      }
    },
    filters: {
      yuan (value) {
        return value ? '￥' + Number.parseFloat(value.replace('元', '')).toFixed(2) : '';
      },
      do (value) {
        return value ? value.replace('千瓦时', '') : '';
      },
      unit (value) {
        return value ? '￥' + value.replace('元', '') + '/度' : '';
      }
    }
  }
</script>

<style scoped>
  .vux-range-input-box {
    flex: 1;
    margin: 0 !important;
  }
  .link-disabled {
    opacity: 0.55;
  }
  .cost-area {
    background: #45c8dc;
    color: #fff;
    text-align: center;
  }
  .cost-title {
    padding-top: 1.3rem;
    padding-bottom: 0.4rem;
    font-size: 1.05rem;
  }
  .cost-content {
    font-size: 3.3rem;
    padding-bottom: 1.3rem;
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

  .list-group-title > img {
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

  .text-red {
    color: red !important;
  }

  .item-range {
    width: 2rem;
    justify-content: flex-end;
  }
</style>