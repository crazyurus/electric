<template>
  <f7-page name="feedback">
    <f7-block-title>请选择一种反馈方式</f7-block-title>
    <f7-list media-list>
      <f7-list-item title="吐个槽社区" text="欢迎随时来吐槽" after="推荐" link @click="tucao"></f7-list-item>
      <f7-list-item title="掌上理工大用户群" text="掌理粉丝聚集地" link-external link="mqqapi://card/show_pslcard?src_type=internal&version=1&uin=420082599&card_type=group&source=qrcode"></f7-list-item>
      <f7-list-item title="小纬客服" text="Token团队的萌妹子" link-external link="mqqwpa://im/chat?chat_type=wpa&uin=2577438164&version=1&src_type=web&web_src=web.wutnews.net"></f7-list-item>
      <f7-list-item title="拨打电话" text="周一至周五下午办公室值班" link-external link="tel:027-87855617"></f7-list-item>
    </f7-list>
  </f7-page>
</template>

<script>
  import Tucao from '@/libs/tucao';

  export default {
    methods: {
      tucao() {
        Tucao.request(66640, {
          nickname: window.electric.userName,
          avatar: window.electric.avatar,
          openid: window.electric.sno
        });
      }
    }
  }
</script>

<style>
  html.ios-gt-8 .list-block.media-list .item-title {
    font-weight: 500;
  }
</style>
