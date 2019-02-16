<template>
  <f7-page name="choose">
    <div class="title">宿舍</div>
    <div class="content-block-title">{{$store.state.userName}}同学你好，请选择你的宿舍</div>
    <f7-list>
      <f7-list-item smart-select title="校区" smart-select-searchbar-placeholder="搜索校区" smart-select-searchbar-cancel="取消">
        <select @change="changeAreaPicker">
          <option value="">请选择</option>
          <optgroup label="马房山校区">
            <option value="1*Area*南湖">南湖</option>
            <option value="2*Area*东院">东院</option>
            <option value="3*Area*西院">西院</option>
            <option value="3*Area*鉴湖">鉴湖</option>
            <option value="0*Area*升升" disabled>升升公寓</option>
          </optgroup>
          <optgroup label="余家头校区">
            <option value="7*Area*余区">余区</option>
          </optgroup>
        </select>
      </f7-list-item>
      <f7-list-item smart-select title="宿舍楼" smart-select-searchbar-placeholder="搜索宿舍楼" smart-select-searchbar-cancel="取消">
        <select @change="changeArcPicker">
          <option value="">请选择</option>
          <option v-for="arc in roomInfo.architecture" :key="arc.id" :value="arc.id">{{arc.name}}</option>
        </select>
      </f7-list-item>
      <li class="item-content" v-show="canInputNo">
        <div class="item-inner item-no-border">
          <div class="item-title label">房间号</div>
          <div class="item-input">
            <input type="tel" placeholder="如：409" maxlength="3" :disabled="!setInputFocus" v-focus="setInputFocus" @input="onInput">
          </div>
          <div class="item-after">
            <a href="#" class="list-button" @click.prevent="showRoomPicker">选择宿舍</a>
          </div>
        </div>
      </li>
      <f7-list-item smart-select title="楼层" smart-select-searchbar-placeholder="搜索楼层" smart-select-searchbar-cancel="取消" v-show="!canInputNo">

        <select @change="changeFloorPicker">
          <option value="">请选择</option>
          <option v-for="floor in roomInfo.floor" :key="floor.id" :value="floor.id">{{floor.name}}</option>
        </select>
      </f7-list-item>
      <f7-list-item smart-select title="房间" smart-select-searchbar-placeholder="搜索房间" smart-select-searchbar-cancel="取消" v-show="!canInputNo">
        <select @change="changeMeterPicker">
          <option value="">请选择</option>
          <option v-for="meter in roomInfo.meter" :key="meter.id" :value="meter.id">{{meter.name}}</option>
        </select>
      </f7-list-item>
      <f7-list-label>* 暂不支持升升公寓的电费查询</f7-list-label>
    </f7-list>
    <div class="button-area">
      <button class="button button-big button-fill color-blue" :disabled="!canSubmit" @click="queryMeterDetail">查询</button>
      <template v-if="$store.state.sno === 'anonymous'">
        <button class="button button-big button-fill color-red" @click="download">下载掌上理工大App</button>
        <button class="button button-big button-fill color-green" @click="wechat">关注Token团队电费查询小程序</button>
      </template>
    </div>
    <footer>
      <img src="/act/girlsday/img/token.png" @click="about">
    </footer>
  </f7-page>
</template>

<script>
  import Token from '../../libs/Token'

  export default {
    data() {
      return {
        canSubmit: false,
        canInputNo: false,
        setInputFocus: false,
        inputValue: '',
        roomInfo: {
          architecture: [],
          floor: [],
          meter: []
        },
        select: {
          area: -1,
          architecture: '0',
          floor: '0',
          meter: '0'
        }
      }
    },
    methods: {
      changeAreaPicker (e) {
        let select = e.target.value;
        this.select.area = select.split('*')[0];

        if (select === '0*Area*升升') {
          let ssArc = ['升升A栋', '升升B栋', '升升C栋', '升升E栋', '升升F栋', '升升H栋', '升升I栋', '升升J栋', '升升K栋', '升升L栋'];
          this.roomInfo.architecture = ssArc.map(arc => {
            return {
              id: arc,
              name: arc
            }
          });

          return;
        }

        Token.indicator.show();
        this.getChooseInfo('architecture', select).then(res => {
          let result = res.data.data;
          Token.indicator.hide();

          result.forEach(item => {
            item.name = this.transMeterName(item.name);
          });

          this.roomInfo.architecture = result;
        });
      },
      changeArcPicker (e) {
        let select = e.target.value;
        this.select.architecture = select;

        if (select.indexOf('升升') > -1) {
          Token.message.toast('暂不支持');
          return;
        }

        this.setInputFocus = this.canInputNo;
        Token.indicator.show();
        this.getChooseInfo('floor', select).then(res => {
          let result = res.data.data;
          Token.indicator.hide();

          if (res) this.roomInfo.floor = result;
          else Token.message.toast('暂不支持');
        });
      },
      changeFloorPicker (e) {
        let select = e.target ? e.target.value : e.id;

        if (e.target) Token.indicator.show();
        this.getChooseInfo('meter', select).then(res => {
          let result = res.data.data;
          if (e.target) Token.indicator.hide();

          result.sort(function(a, b) {
            return a.name.split("-")[1] - b.name.split("-")[1];
          });

          this.select.floor = select;
          this.roomInfo.meter = result;
        });
      },
      changeMeterPicker (e) {
        let select = e.target ? e.target.value : e.id;

        this.select.meter = select;
        this.canSubmit = true;
      },
      queryMeterDetail () {
        if (this.select.meter == 0) {
          if (this.roomInfo.meter.length === 0) {
            Token.message.toast('数据加载中');
            return;
          }
          let meter = this.roomInfo.meter.filter(item => {
            return item.name.indexOf(this.inputValue) > -1;
          });
          if (meter && meter.length > 0) this.changeMeterPicker(meter[0]);
          else {
            Token.message.toast('无此房间');
            return;
          }
        }
        this.$f7.showPreloader('正在查询，请稍后…');
        this.$http.post('/electric/login/register', {
          meter: this.select.meter,
          area: this.select.area
        }).then(result => {
          this.$f7.hidePreloader();
          if (result.data.errCode === 0) {
            if (typeof token !== 'undefined' && token.setMeter) token.setMeter(this.select.meter + '|' + this.select.area);
            this.$store.commit('meter', this.select);
            this.$f7.mainView.router.reloadPage('/detail/index');
          }
          else Token.message.toast('未知异常，请联系管理员');
        });
      },
      transMeterName (arc) {
        switch (arc) {
          case "学海15栋": return "学海G栋/西15栋";
          case "学海16栋": return "学海F栋/西16栋";
          case "学海17栋": return "学海D栋/西17栋";
          case "学海18栋": return "学海E栋/西18栋";
          case "学海19栋": return "学海C栋/西19栋";
          case "学海20栋": return "学海B栋/西20栋";
          case "学海21栋": return "学海A栋/西21栋";
          default: return arc;
        }
      },
      getChooseInfo (api, id) {
        return this.$http.post('https://api.wutnews.net/electric/choose/' + api, {
          id: id,
          area: this.select.area
        });
      },
      download () {
        location.assign("http://app.wutnews.net/");
      },
      wechat () {
        const photoBrowser = this.$f7.photoBrowser({
          loop: false,
          photos: {
            url: '/Application/Electric/Assets/image/qrcode.png',
            caption: 'Token团队微信公众号'
          },
          navbar: false,
          toolbar: false,
          ofText: ' / ',
          lazyLoading: true,
          onClick (swiper, event) {
            photoBrowser.close();
          }
        });
        photoBrowser.open();
      },
      showRoomPicker () {
        this.canInputNo = false;
      },
      onInput (e) {
        let value = e.target.value;
        if (value.length === 1 && value != this.select.floor.split('*')[0]) {
          let floor = this.roomInfo.floor.filter(item => {
            return item.name === value + '楼层';
          });
          if (floor.length > 0) this.changeFloorPicker(floor[0]);
          else Token.message.toast('无此楼层');
        }
        this.canSubmit = value.length === 3;
        this.inputValue = value;
      },
      about () {
        Token.message.alert('Token团队出品<br>产品：廖星 石明阳<br>设计&开发：廖星');
      }
    },
    directives: {
      focus: {
        update (el, obj) {
          if (obj.value) el.focus();
        }
      }
    }
  }
</script>

<style scoped>
  .content-block-title {
    margin: 20px 20px 10px;
  }
  .button-fill.color-red {
    background-color: rgb(254, 50, 101) !important;
    margin-top: 1rem;
  }
  .button-fill.color-green {
    background: rgb(80, 227, 194) !important;
    margin-top: 1rem;
  }
  .list-button {
    display: inline-block !important;
    padding-left: 1rem !important;
    border-left: 1px #c8c7cc solid;
    font-size: 17px !important;
    line-height: 1.4 !important;
    padding: 0 3px 0 15px !important;
    text-align: center !important;
    color: #45c8dc !important;
  }
  .ios .list-button {
    border-left: 0.5px #c8c7cc solid;
  }
  .item-no-border::after {
    display: none;
  }
  .title {
    margin: 16px 25px 0;
    font-weight: 900;
    font-size: 32px;
  }
  .list-block .item-divider {
    padding-left: 20px;
  }
  footer {
    position: absolute;
    width: 100%;
    text-align: center;
    left: 0;
    bottom: 1rem;
    font-size: 14px;
    color: #8e8e93;
    z-index: 10;
  }
  footer > img {
    width: 88px;
    height: 33px;
  }
</style>
