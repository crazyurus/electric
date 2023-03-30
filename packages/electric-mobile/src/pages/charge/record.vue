<template>
  <f7-page name="pay">
    <div class="content-block-title">
      <span>以下是电费缴纳记录</span>
      <a v-if="type === false" @click="changeView">列表</a>
      <a v-if="type === true" @click="changeView">时间轴</a>
    </div>
    <div class="timeline" v-if="type === false">
      <div class="timeline-item" v-for="item in record" :key="item.no">
        <div class="timeline-item-date" v-if="item.out_time">{{item.pay_time}}</div>
        <div class="timeline-item-date" v-else>{{item.out_time}}</div>
        <div class="timeline-item-divider" :class="item.type|typeToColor"></div>
        <div class="timeline-item-content">
          <div class="timeline-item-title">{{item.type}}</div>
          <div class="timeline-item-subtitle">{{item.count}} /￥{{item.price|amtToFix2}}</div>
          <div class="timeline-item-text">{{item.status}} / {{item.no}}</div>
        </div>
      </div>
    </div>
    <div class="list-block media-list record-list" v-if="type === true">
      <ul>
        <li v-for="item in record" :key="item.no">
          <a href="javascript:;" class="item-content item-link">
            <div class="item-inner">
              <div class="item-title-row">
                <div class="item-title">
                  <span class="circle" :class="item.type|typeToColor"></span>{{item.type}}
                </div>
                <div class="item-after">{{item.count}}/￥{{item.price|amtToFix2}}</div>
              </div>
              <div class="item-text item-no">
                <div>{{item.no}}</div>
                <div>{{item.status}}</div>
              </div>
              <div class="item-text">
                <div v-if="item.out_time">{{item.pay_time}}</div>
                <div v-else>{{item.out_time}}</div>
              </div>
            </div>
          </a>
        </li>
      </ul>
    </div>
  </f7-page>
</template>

<script>
  export default {
    data () {
      return {
        record: [],
        type: true
      }
    },
    mounted () {
      this.$indicator.show();
      this.$http.get('/information/pay.json', {
        id: this.$store.state.meter,
        area: this.$store.state.area
      }).then(result => {
        this.$indicator.hide();

        this.record = result;
      }).catch(() => {
        this.$message.toast('网络请求错误');
      });
    },
    filters: {
      typeToColor (type) {
        switch (type) {
          case '微信支付': return 'bg-green';
          case '缴费平台支付': return 'bg-purple';
          case '系统售电': return 'bg-blue';
          case '统一月补': return 'bg-orange';
          case '临时调剂': return 'bg-red';
          case '一卡通售电': return 'bg-yellow';
          default: return 'bg-gray';
        }
      },
      amtToFix2 (amt) {
        return parseFloat(amt).toFixed(2);
      }
    },
    methods: {
      changeView () {
        this.type = !this.type;
      }
    }
  }
</script>

<style scoped>
  .list-block.media-list .item-link .item-title-row {
    padding-right: 0;
    background: none;
  }
  .item-no {
    display: flex !important;
    justify-content: space-between;
  }
  .timeline {
    font-weight: 300;
  }
  .timeline-item-title {
    font-weight: normal !important;
  }
  .timeline-item-date {
    width: 72px;
  }
  .timeline-item-divider:before, .timeline-item-divider:after {
    background-color: #bbb;
  }
  .timeline-item-subtitle, .timeline-item-text {
    color: #999;
  }
  .content-block-title > a {
    float: right;
  }
</style>
