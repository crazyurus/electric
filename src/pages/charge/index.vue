<template>
  <f7-page name="charge">
    <div class="list-block">
      <ul>
        <li class="item-content">
          <div class="item-inner">
            <div class="item-title-row">
              <div class="item-title item-cardno">{{$store.state.meter.split('*')[2]}}</div>
              <div class="item-text" style="font-weight:300">{{type}}　<a href="javascript:;" @click="change">更换</a></div>
            </div>
          </div>
        </li>
      </ul>
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
      <a href="javascript:;" @click="showStation">线下充值点</a>
    </footer>
    <mt-actionsheet
        :actions="sheet.actions"
        v-model="sheet.show">
    </mt-actionsheet>
  </f7-page>
</template>

<script>
  import Vue from 'vue'
  import { Actionsheet, Indicator } from 'mint-ui';
  import copy from 'copy-to-clipboard';

  Vue.component(Actionsheet.name, Actionsheet);
  Vue.use(Indicator);

  export default {
    data () {
      return {
        sheet: {
          actions: [],
          show: false
        },
        type: this.$store.state.area == 7 ? '微信支付' : '支付宝支付'
      }
    },
    methods: {
      portal (e) {
        const $$ = this.Dom7;
        const $this = $$(e.currentTarget);
        const self = this;

        $$(".list-block .col-33").removeClass("active");

        if ($this.hasClass("col-special")) {
          let $footer = $$("footer");
          $footer.hide();
          $this.html("");
          let $input = $$('<input type="number" inputmode="numeric" pattern="[0-9]*" class="special-input" maxlength="3">');
          $input.appendTo($this).focus().change(function () {
            let money = parseFloat(this.value);

            if (!isNaN(money)) {
              $this.html('<span class="money">' + money + '</span><span class="yuan">元</span>').addClass("active");
              $footer.show();
              self.charge(money);
            } else {
              self.$message.toast("无效的金额");
              $this.html('<span class="extra">其它</span>');
              $footer.show();
            }
          }).blur(function () {
            if (this.value.trim() === "") {
              $this.html('<span class="extra">其它</span>');
              $footer.show();
            }
          });
        }
        else {
          $this.addClass("active");
          self.charge(parseFloat($this.find(".money").text()));
        }
      },
      qrcode (text, url) {
        this.$f7.modal({
          title: '电费查询',
          text,
          afterText: '<img src="' + url + '" style="width: 200px; height: 200px">',
          buttons: [{
            text: '确定',
            bold: true
          }]
        });
      },
      charge (amount) {
        if (this.$detect.wechat()) {
          this.qrcode('暂不支持微信内支付，请长按打开小程序“武汉理工大学电费查询”', '/Application/Electric/Assets/image/mina.jpg');
          return;
        }
        if (amount < 1) {
          this.$message.toast('充值金额必须大于1元');
          return;
        }
        if (this.type === '微信支付') this.chargeWechat(amount);
        else this.chargeAlipay(amount);
      },
      chargeWechat(amount) {
        Indicator.open('微信支付');

        let param = {
          area: this.$store.state.area,
          amount: amount,
          sno: this.$store.state.sno,
          meter: this.$store.state.meter,
          type: this.$detect.mobile() ? 'MWEB' : 'NATIVE',
          ip: "0.0.0.0"
        };

        this.$http({
          method: 'get',
          url: 'https://jkyip.market.alicloudapi.com/ip',
          headers: {'Authorization': 'APPCODE fb013fbe90924aca829cb36b361a3f8f'}
        }).then(result => {
          function intToIP(num) {  
            var str;  
            var tt = new Array();  
            tt[0] = (num >>> 24) >>> 0;  
            tt[1] = ((num << 8) >>> 24) >>> 0;  
            tt[2] = (num << 16) >>> 24;  
            tt[3] = (num << 24) >>> 24;  
            str = String(tt[0]) + "." + String(tt[1]) + "." + String(tt[2]) + "." + String(tt[3]);  
            return str;  
          }
          param.ip = intToIP(result.data["message"][0]["ip"]);

          this.$http.post('/electric/pay/prepare', param).then(result => {
          Indicator.close();
          if (result.data.data.return.mweb_url) {
            const url = result.data.data.return.mweb_url + '&redirect_url=' + encodeURIComponent('https://web.wutnews.net/electric/pay/callback?order=' + result.data.data.return.prepay_id);
            if (typeof tokenNative === 'undefined') location.assign('newtab:https://web.wutnews.net/electric/api/wechatPay?url=' + encodeURIComponent(url));
            else location.assign(url);
          }
          if (result.data.data.return.code_url) this.qrcode('请用微信扫码完成支付', '/electric/api/qrcode?url=' + encodeURIComponent(result.data.data.return.code_url));
        });
        });
      },
      chargeAlipay(amount) {
        const now = new Date();
        const $$ = this.Dom7;
        if (
          (now.getHours() === 23 && now.getMinutes() >= 20) ||
          (now.getHours() === 0 && now.getMinutes() <= 10)
        ) {
          this.$message.alert('23:20至次日00:10为校园缴费平台结算时间，暂不可充值');
          return false;
        }

        this.$f7.modal({
          title: "校园缴费平台",
          text: "请输入下方图片中的数字",
          afterText: '<div class="input-field modal-input-double modal-input-captcha"><input type="tel" maxlength="4" class="modal-text-input" id="txtCaptcha" placeholder="验证码"><img src="/electric/cwsf/captcha" alt="点击刷新" onclick="this.src = this.src;"></div>',
          buttons: [
            {
              text: '验证',
              bold: true
            }
          ],
          onClick: (modal, index) => {
            if(index === 0) {
              const captcha = $$("#txtCaptcha").val();

              if(captcha.trim() === "") {
                this.$message.toast("验证码输入不完整");
                return;
              }

              Indicator.open('支付宝');
              let param = {
                area: this.$store.state.area,
                amount: amount,
                meter: this.$store.state.meter,
                captcha,
              };

              this.$http.post('/electric/cwsf/pay', param).then(result => {
                Indicator.close();
                if (result.data.url) {
                  const url = 'alipays://platformapi/startapp?appId=20000067&url=' + encodeURIComponent(result.data.url);
                  if (typeof tokenNative === 'undefined') location.assign(url);
                  else tokenNative.openAppWithURL({ url });
                }
                else this.$message.toast('订单生成失败');
              });
            }
          }
        });
        $$("#txtCaptcha").focus();
      },
      change () {
        // 屏蔽缴费平台支付
        this.$message.alert('只支持微信支付，支付宝/校园缴费平台渠道暂时下线');
        return;

        if (this.$store.state.area != 7) {
          this.$message.toast('暂只支持支付宝支付');
          return;
        }

        this.sheet = {
          show: true,
          actions: [{
            name: '微信支付',
            method: () => {
              this.type = '微信支付'
            }
          }, {
            name: '支付宝支付',
            method: () => {
              this.type = '支付宝支付'
            }
          }]
        };
      },
      openLocation () {
        this.$f7.modal({
          title: '请选择充值方式',
          text: "马房山校区的宿舍请在00:10-23:20间用电脑访问以下网址缴费<br><strong>https://cwsf.whut.edu.cn/</strong><br>人工窗口工作时间：周一到周五 8:00-11:30 14:00-16:30<br>自助充值机充值时间：每日6:00-24:00<br>注意不可以跨校区充值哦",
          verticalButtons: true,
          buttons: [{
            text: '复制缴费网址',
            bold: true,
            onClick: () => {
              copy('https://cwsf.whut.edu.cn/');
              this.$message.toast('复制成功');
            }
          }, {
            text: '查看线下充值点',
            bold: false,
            onClick: this.showStation
          }, {
            text: '关闭',
          }]
        });
      },
      showStation () {
        let buttons = [];
        const station = [{
          name: '南湖',
          position: [30.512500, 114.329079],
          telephone: '13317102360',
          address: '后街医务室旁，北七宿舍对面'
        }, {
          name: '西院/鉴湖',
          position: [30.513068, 114.343386],
          telephone: '027-87381736',
          address: '鉴湖主教学楼西侧'
        }, {
          name: '东院',
          position: [30.521752, 114.351904],
          telephone: '027-87859134',
          address: '东院大门右侧'
        }, {
          name: '余区',
          position: [30.607892, 114.357253],
          telephone: '027-86860918',
          address: '水电中心收费大厅'
        }, {
          name: '升升公寓',
          position: [30.504560, 114.344748],
          telephone: 'empty',
          address: '物业办公楼一层'
        }];

        for (let i in station) {
            buttons.push({
              name: station[i].name,
              method: () => {
                let name = encodeURIComponent(station[i].name + '电费充值点');
                this.$f7.mainView.router.loadPage('/charge/map/' + station[i].position[0] + '/' + station[i].position[1] + '/' + name + '/' + encodeURIComponent(i == 4 ? '武汉升升学府物业管理有限公司' : '武汉理工大学水电管理中心') + '/' + station[i].telephone);
              }
            });
        }

        this.sheet = {
          show: true,
          actions: buttons
        };
      }
    }
  }
</script>

<style>
  .page[data-page=charge] .item-cardno {
    font-size: 1.5rem;
    font-weight: normal;
  }
  .page[data-page=charge] .list-block > .row {
    margin: 0 1rem 1rem;
  }
  .page[data-page=charge] .list-block > .row > .col-33 {
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
  .page[data-page=charge] .list-block > .row > .col-33.active {
    color: #fff;
    background-color: #45c8dc;
  }
  .page[data-page=charge] .col-special > .extra {
    font-size: 1rem;
  }
  .page[data-page=charge] .list-block > .row > .col-33 > .yuan {
    font-size: 1rem;
    padding-top: 0.3rem;
  }
  .page[data-page=charge] footer {
    position: absolute;
    width: 100%;
    left: 0;
    bottom: 1rem;
    text-align: center;
    font-size: 1rem;
    font-weight: 300;
  }
  .page[data-page=charge] .picker-modal {
    background: #f7f7f8;
  }
  .page[data-page=charge] .button-area {
    margin-top: 2rem;
  }
  .page[data-page=charge] .picker-modal-inner > .list-block {
    margin-top: 1.5rem;
    font-weight: 300;
  }
  .page[data-page=charge] .button-area .button-fill {
    color: #fff;
    background: #45c8dc;
    width: 100%;
    border-color: #45c8dc;
  }
  a {
    color: #45c8dc;
  }
  #btnPay {
    height: 2.8rem;
    font-size: 1rem;
  }
  .page[data-page=charge] .special-input {
    text-align: center;
    font-size: 1.5rem !important;
    color: #45c8dc !important;
    font-weight: 300 !important;
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
</style>
