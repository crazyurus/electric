<template>
  <f7-page name="charge">
    <div class="room-block">
      <div class="item-cardno">{{ $store.state.meter.split('*')[2] }}</div>
      <div class="link" @click="change">{{ type }}</div>
    </div>
    <div class="list-block card-block">
      <div class="row">
        <div class="col-33" @click="portal"><span class="money">10</span><span class="yuan">元</span></div>
        <div class="col-33" @click="portal"><span class="money">20</span><span class="yuan">元</span></div>
        <div class="col-33" @click="portal"><span class="money">30</span><span class="yuan">元</span></div>
      </div>
      <div class="row">
        <div class="col-33" @click="portal"><span class="money">50</span><span class="yuan">元</span></div>
        <div class="col-33" @click="portal"><span class="money">80</span><span class="yuan">元</span></div>
        <div class="col-33" @click="portal"><span class="money">100</span><span class="yuan">元</span></div>
      </div>
      <div class="row">
        <div class="col-33" @click="portal"><span class="money">150</span><span class="yuan">元</span></div>
        <div class="col-33" @click="portal"><span class="money">200</span><span class="yuan">元</span></div>
        <div class="col-33 col-special" @click="portal"><span class="extra">其它</span></div>
      </div>
    </div>
    <footer>
      <div class="link" @click="showStation">线下充值点</div>
    </footer>
    <mt-actionsheet :actions="sheet.actions" v-model="sheet.show"> </mt-actionsheet>
  </f7-page>
</template>

<script>
import Vue from 'vue';
import { Actionsheet, Indicator } from 'mint-ui';
import { prepare, pay, getStations } from 'electric-service';

Vue.component(Actionsheet.name, Actionsheet);
Vue.use(Indicator);

export default {
  data() {
    return {
      sheet: {
        actions: [],
        show: false
      },
      type: '微信支付'
    };
  },
  methods: {
    portal(e) {
      const $$ = this.Dom7;
      const $this = $$(e.currentTarget);
      const self = this;

      $$('.list-block .col-33').removeClass('active');

      if ($this.hasClass('col-special')) {
        let $footer = $$('footer');
        $footer.hide();
        $this.html('');
        let $input = $$(
          '<input type="number" inputmode="numeric" pattern="[0-9]*" class="special-input" maxlength="3">'
        );
        $input
          .appendTo($this)
          .focus()
          .change(function () {
            let money = parseFloat(this.value);

            if (!isNaN(money)) {
              $this.html('<span class="money">' + money + '</span><span class="yuan">元</span>').addClass('active');
              $footer.show();
              self.charge(money);
            } else {
              self.$message.toast('无效的金额');
              $this.html('<span class="extra">其它</span>');
              $footer.show();
            }
          })
          .blur(function () {
            if (this.value.trim() === '') {
              $this.html('<span class="extra">其它</span>');
              $footer.show();
            }
          });
      } else {
        $this.addClass('active');
        self.charge(parseFloat($this.find('.money').text()));
      }
    },
    qrcode(text, url) {
      this.$f7.modal({
        title: '电费查询',
        text,
        afterText: '<img src="' + url + '" style="width: 200px; height: 200px">',
        buttons: [
          {
            text: '确定',
            bold: true
          }
        ]
      });
    },
    charge(amount) {
      if (amount < 1) {
        this.$message.toast('充值金额必须大于1元');
        return;
      }

      Indicator.open(this.type);
      if (this.type === '微信支付') this.chargeWechat(amount);
      else this.chargeAlipay(amount);
    },
    chargeWechat(amount) {
      const param = {
        area: this.$store.state.area,
        amount: amount,
        sno: this.$store.state.sno,
        meter: this.$store.state.meter,
        type: this.$detect.mobile() ? 'MWEB' : 'NATIVE',
        ip: ''
      };

      prepare(param).then(result => {
        Indicator.close();
        if (result.return.mweb_url) {
          const orderId = result.return.prepay_id;
          const url =
            result.return.mweb_url + '&redirect_url=' + encodeURIComponent('/pay/callback.json?order=' + orderId);

          this.$f7.mainView.router.load({
            url: '/charge/tip',
            ignoreCache: true,
            query: {
              orderId,
              url
            }
          });
        }
        if (result.return.code_url)
          this.qrcode(
            '请用微信扫码完成支付',
            'https://api.qrserver.com/v1/create-qr-code/?data=' + encodeURIComponent(result.return.code_url)
          );
      });
    },
    chargeAlipay(amount) {
      pay({
        area: this.$store.state.area,
        amount: amount,
        meter: this.$store.state.meter,
        captcha: ''
      }).then(result => {
        Indicator.close();

        if (result.return.url) {
          const url = 'alipays://platformapi/startapp?appId=20000067&url=' + encodeURIComponent(result.return.url);
          location.assign(url);
        } else this.$message.toast('订单生成失败');
      });
    },
    change() {
      this.sheet = {
        show: true,
        actions: [
          {
            name: '微信支付',
            method: () => {
              this.type = '微信支付';
            }
          },
          {
            name: '支付宝',
            method: () => {
              this.type = '支付宝';
            }
          }
        ]
      };
    },
    showStation() {
      const buttons = getStations().map((station, index) => ({
        name: station.name,
        method: () => {
          const name = encodeURIComponent(station.name + '电费充值点');
          this.$f7.mainView.router.loadPage(
            '/charge/map/' +
              station.position[0] +
              '/' +
              station.position[1] +
              '/' +
              name +
              '/' +
              encodeURIComponent(index == 4 ? '武汉升升学府物业管理有限公司' : '武汉理工大学水电管理中心') +
              '/' +
              station.telephone
          );
        }
      }));

      this.sheet = {
        show: true,
        actions: buttons
      };
    }
  }
};
</script>

<style>
.room-block {
  margin: 30px 1rem;
}
.room-block .item-cardno {
  font-size: 28px;
  font-weight: normal;
  font-family: DINAlternate-Bold, DINCondensed-Bold, DIN, 'PingFang SC', Arial, Helvetica, sans-serif;
}
.page[data-page='charge'] .link {
  color: #45c8dc;
  line-height: 1.8;
  cursor: pointer;
  font-size: 16px;
  font-weight: normal;
}
.page[data-page='charge'] .list-block > .row {
  margin: 0 1rem 1rem;
}
.page[data-page='charge'] .list-block > .row > .col-33 {
  text-align: center;
  border: 1px #45c8dc solid;
  border-radius: 0.2rem;
  height: 4rem;
  background-color: #fff;
  color: #45c8dc;
  font-size: 1.5rem;
  font-weight: 300;
  display: flex;
  align-items: center;
  justify-content: center;
}
.page[data-page='charge'] .list-block > .row > .col-33.active {
  color: #fff;
  background-color: #45c8dc;
}
.page[data-page='charge'] .col-special > .extra {
  font-size: 1rem;
}
.page[data-page='charge'] .list-block > .row > .col-33 > .yuan {
  font-size: 1rem;
  padding-top: 0.3rem;
}
.page[data-page='charge'] footer {
  position: absolute;
  width: 100%;
  left: 0;
  bottom: 1rem;
  text-align: center;
  font-size: 1rem;
  font-weight: 300;
}
.page[data-page='charge'] .picker-modal {
  background: #f7f7f8;
}
.page[data-page='charge'] .button-area {
  margin-top: 2rem;
}
.page[data-page='charge'] .picker-modal-inner > .list-block {
  margin-top: 1.5rem;
  font-weight: 300;
}
.page[data-page='charge'] .button-area .button-fill {
  color: #fff;
  background: #45c8dc;
  width: 100%;
  border-color: #45c8dc;
}
#btnPay {
  height: 2.8rem;
  font-size: 1rem;
}
.page[data-page='charge'] .special-input {
  text-align: center;
  font-size: 1.5rem !important;
  color: #45c8dc !important;
  font-family: DINAlternate-Bold, DINCondensed-Bold, DIN, Arial, Helvetica, sans-serif;
}
.modal-input-captcha > input {
  display: inline-block;
  width: calc(100% - 60px);
  vertical-align: bottom;
}
.modal-input-captcha > img {
  height: 26px;
  width: 60px;
  display: inline-block;
  vertical-align: bottom;
}
.page[data-page='charge'] .money {
  font-family: DINAlternate-Bold, DINCondensed-Bold, DIN, Arial, Helvetica, sans-serif;
}
</style>
