<template>
  <f7-page name="charge">
    <div class="list-block">
      <ul>
        <li class="item-content">
          <div class="item-inner">
            <div class="item-title-row">
              <div class="item-title item-cardno">{{$store.state.meter.split('*')[2]}}</div>
              <div class="item-text" style="font-weight:300">微信支付　<a href="javascript:;" @click="change">更换</a></div>
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
  </f7-page>
</template>

<script>
  import Token from '../../libs/Token'

  export default {
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
              Token.message.toast("无效的金额");
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
      charge (amount) {
        if (this.$store.state.area == 7) {
          if (this.isWeChat()) {
            Token.message.alert('暂不支持微信内支付，请关注小程序“武汉理工大学电费查询”');
            return;
          }
          if (amount < 1) Token.message.toast('充值金额必须大于1元');
          else {
            Token.indicator.show();
            this.$http.get('https://palmwhut.sinaapp.com/ip.php').then(ip => {
              let param = {
                area: this.$store.state.area,
                amount: amount,
                sno: this.$store.state.sno,
                meter: this.$store.state.meter,
                type: 'MWEB'
              };
              if (ip.data) param['ip'] = ip.data;

              this.$http.post('/electric/pay/prepare', param).then(result => {
                location.assign(result.data.data.return.mweb_url + '&redirect_url=' + encodeURIComponent('https://web.wutnews.net/electric/pay/callback?order=' + result.data.data.return.prepay_id));
              });
            });
          }
        } else this.openLocation();
      },
      change () {
        Token.message.toast('暂只支持微信支付');
      },
      openLocation () {
        this.$f7.modal({
          title: '充值失败',
          text: "马房山校区、南湖校区线上充值功能暂未开放，敬请期待~<br>请前往线下充值点缴费<br>人工窗口工作时间：周一到周五 8:00-11:30 14:00-16:30<br>自助充值机充值时间：每日6:00-24:00<br>注意不可以跨校区充值哦",
          buttons: [{
            text: '关闭',
          }, {
            text: '查看充值点',
            bold: true,
            onClick: this.showStation
          }]
        });
      },
      isWeChat () {
        return navigator.userAgent.indexOf('MicroMessenger') > -1;
      },
      showStation () {
        let buttons = [];
        const station = [{
          name: '南湖',
          position: [30.512500, 114.329079],
          telephone: '87756329',
          address: '后街医务室旁，北七宿舍对面'
        }, {
          name: '西院/鉴湖',
          position: [30.513068, 114.343386],
          telephone: '87381736',
          address: '鉴湖主教学楼西侧'
        }, {
          name: '东院',
          position: [30.521752, 114.351904],
          telephone: '87859134',
          address: '东院大门右侧'
        }, {
          name: '余区',
          position: [30.607892, 114.357253],
          telephone: '86860918',
          address: '余27栋后勤办公室'
        }, {
          name: '升升公寓',
          position: [30.504560, 114.344748],
          telephone: '',
          address: '物业办公楼一层'
        }];

        for (let i in station) {
            buttons.push({
              text: station[i].name,
              onClick: () => {
                let name = station[i].name + '电费充值点';
                location.assign('/electric/charge/map.html?lat=' + station[i].position[0] + '&lng=' + station[i].position[1] + '&title=' + name + '&address=' + (i == 4 ? '武汉升升学府物业管理有限公司' : '武汉理工大学水电管理中心') + '&telephone=' + station[i].telephone);
              }
            });
        }

        this.$f7.actions([buttons, [{
          text: '取消',
          color: 'red'
        }]]);
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
</style>