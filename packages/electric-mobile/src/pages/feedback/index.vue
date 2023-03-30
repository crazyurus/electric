<template>
  <f7-page name="feedback">
    <f7-block-title>请选择一种反馈方式</f7-block-title>
    <f7-list media-list>
      <f7-list-item title="吐个槽社区" text="欢迎随时来吐槽" after="推荐" link @click="tucao"></f7-list-item>
      <f7-list-item title="掌上理工大用户群" text="掌理粉丝聚集地" link-external link="mqqapi://card/show_pslcard?src_type=internal&version=1&uin=420082599&card_type=group&source=qrcode"></f7-list-item>
      <f7-list-item title="电费充值故障群" text="在缴费平台充值遇到问题" link-external link="mqqapi://card/show_pslcard?src_type=internal&version=1&uin=939924027&card_type=group&source=qrcode"></f7-list-item>
      <f7-list-item title="小纬客服" text="Token团队的萌妹子" link-external link="mqqwpa://im/chat?chat_type=wpa&uin=2577438164&version=1&src_type=web&web_src=web.wutnews.net"></f7-list-item>
      <f7-list-item title="拨打电话" text="工作日联系各个校区水电中心" link @click="telephone"></f7-list-item>
    </f7-list>
  </f7-page>
</template>

<script>
  import Tucao from '@/libs/tucao';
  import stations from '@/data/station';

  export default {
    methods: {
      tucao() {
        Tucao.request(23796, {
          nickname: window.electric.userName,
          avatar: window.electric.avatar,
          openid: window.electric.sno
        });
      },
      telephone() {
        const stationButtons = stations
          .filter(station => station.telephone !== 'empty')
          .map(station => ({
            text: station.name,
            onClick() {
              location.assign('tel:' + station.telephone);
            }
          }));
        const cancelButtons = [{
          text: '关闭',
          color: 'red'
        }];

        stationButtons.unshift({
          text: '联系电话',
          label: true
        });

        this.$f7.actions([stationButtons, cancelButtons]);
      }
    }
  }
</script>

<style>
  html.ios-gt-8 .list-block.media-list .item-title {
    font-weight: 500;
  }
</style>
