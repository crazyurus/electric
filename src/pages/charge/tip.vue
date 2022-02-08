<template>
  <f7-page name="tip">
    <div class="weui-msg">
      <div class="weui-msg__icon-area"><i class="weui-icon-waiting weui-icon_msg"></i></div>
      <div class="weui-msg__text-area">
        <h2 class="weui-msg__title">正在支付中</h2>
        <p class="weui-msg__desc">正在支付电费，请确认是否已经在微信完成支付</p>
      </div>
      <div class="weui-msg__opr-area">
        <p class="weui-btn-area">
          <a @click="query" class="weui-btn weui-btn_primary">我已支付</a>
          <a @click="retry" class="weui-btn weui-btn_default">我还没有支付</a>
        </p>
      </div>
      <div class="weui-msg__tips-area">
        <p class="weui-msg__tips">如果订单信息错误或放弃支付，请<a @click="cancel">取消订单</a></p>
      </div>
      <div class="weui-msg__extra-area">
        <div class="weui-footer">
          <p class="weui-footer__text">Token团队</p>
        </div>
      </div>
    </div>
  </f7-page>
</template>

<script>
  export default {
    data() {
      return {
        orderId: '',
        url: ''
      }
    },
    mounted() {
      this.orderId = this.$route.options.query.orderId;
      this.url = this.$route.options.query.url;

      this.retry();
    },
    methods: {
      query() {
        location.replace('/electric/pay/tip?order=' + this.orderId);
      },
      retry() {
        this.$navigator.open('weixin://dl?url=' + encodeURIComponent(this.url));
      },
      cancel() {
        this.$f7.mainView.router.back();
      }
    }
  }
</script>

<style scoped>
  @import "../../css/weui.css";

</style>
