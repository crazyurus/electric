<template>
  <f7-page name="choose">
    <div class="title">宿舍</div>
    <div class="content-block-title">{{$store.state.userName}}同学你好，请选择你的宿舍</div>
    <f7-list>
      <f7-list-item smart-select title="校区" smart-select-searchbar-placeholder="搜索校区" smart-select-searchbar-cancel="取消">
        <select @change="changeAreaPicker">
          <option value="">请选择</option>
          <optgroup label="学生宿舍区">
            <option value="1*Area*南湖">南湖</option>
            <option value="2*Area*东院">东院</option>
            <option value="3*Area*西院">西院</option>
            <option value="3*Area*鉴湖">鉴湖</option>
            <option value="1*Area*余区">余区</option>
            <option value="0*Area*升升" disabled>升升公寓</option>
          </optgroup>
          <optgroup label="教工宿舍区">
            <option value="28*Area*2500西院教工宿舍">西院教工宿舍</option>
            <option value="29*Area*1500东院教工宿舍">东院教工宿舍</option>
            <option value="30*Area*5500余区教工宿舍">余区教工宿舍</option>
          </optgroup>
        </select>
      </f7-list-item>
      <f7-list-item smart-select title="宿舍楼" smart-select-searchbar-placeholder="搜索宿舍楼" smart-select-searchbar-cancel="取消">
        <select @change="changeArcPicker">
          <option value="">请选择</option>
          <option v-for="arc in roomInfo.architecture" :key="arc.id" :value="arc.id">{{arc.name}}</option>
        </select>
      </f7-list-item>
      <f7-list-item smart-select title="楼层" smart-select-searchbar-placeholder="搜索楼层" smart-select-searchbar-cancel="取消">
        <select @change="changeFloorPicker">
          <option value="">请选择</option>
          <option v-for="floor in roomInfo.floor" :key="floor.id" :value="floor.id">{{floor.name}}</option>
        </select>
      </f7-list-item>
      <f7-list-item smart-select title="房间" smart-select-searchbar-placeholder="搜索房间" smart-select-searchbar-cancel="取消">
        <select @change="changeMeterPicker">
          <option value="">请选择</option>
          <option v-for="meter in roomInfo.meter" :key="meter.id" :value="meter.id">{{meter.name}}</option>
        </select>
      </f7-list-item>
      <f7-list-label>* 暂不支持升升公寓的电费查询</f7-list-label>
    </f7-list>
    <div class="button-area">
      <button class="button button-big button-fill color-blue" :disabled="!canSubmit" @click="queryMeterDetail">查询</button>
    </div>
    <footer>
      <img :src="tokenLogo" @click="about">
    </footer>
  </f7-page>
</template>

<script>
  import { register, getChooseInfo } from 'electric-service';
  import TokenLogo from '@/images/token.png';

  export default {
    data() {
      return {
        canSubmit: false,
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
        },
        tokenLogo: TokenLogo
      }
    },
    methods: {
      changeAreaPicker (e) {
        let select = e.target.value;
        this.select.area = select.split('*')[0];

        if (select === '0*Area*升升') {
          let ssArc = ['升升A栋', '升升B栋', '升升C栋', '升升E栋', '升升F栋', '升升H栋', '升升I栋', '升升J栋', '升升K栋', '升升L栋'];
          this.roomInfo.architecture = ssArc.map(arc => ({
            id: arc,
            name: arc
          }));

          return;
        }

        if (select === '1*Area*余区') {
          this.select.area = "7";
        }

        this.$indicator.show();
        this.getChooseInfo('architecture', select).then(result => {
          this.$indicator.hide();

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
          this.$message.toast('暂不支持');
          return;
        }

        this.$indicator.show();
        this.getChooseInfo('floor', select).then(result => {
          this.$indicator.hide();

          this.roomInfo.floor = result;
        });
      },
      changeFloorPicker (e) {
        let select = e.target ? e.target.value : e.id;

        if (e.target) this.$indicator.show();
        this.getChooseInfo('meter', select).then(result => {
          if (e.target) this.$indicator.hide();

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
        this.$f7.showPreloader('正在查询，请稍后…');
        register({
          meter: this.select.meter,
          area: this.select.area
        }).then(() => {
          this.$f7.hidePreloader();

          this.$store.commit('meter', this.select);
          this.$f7.mainView.router.reloadPage('/detail/index');
        }).catch(() => {
          this.$message.toast('未知异常，请联系管理员');
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
        return getChooseInfo(api, id, this.select.area).catch(error => {
          this.$message.toast(error.message);
        });
      },
      about () {
        this.$message.alert('Token团队出品');
      }
    }
  }
</script>

<style scoped>
  .content-block-title {
    margin: 20px 20px 10px;
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
