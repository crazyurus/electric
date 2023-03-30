<template>
  <f7-page name="map">
    <div id="container"></div>
    <div class="info">
      <img :src="iconNav" alt="nav" />
      <div class="title">{{ decodeURIComponent(title) }}</div>
      <div class="desc">{{ decodeURIComponent(address) }}</div>
      <div class="tel">
        <span>联系电话：</span>
        <span v-if="telephone === 'empty'">暂无</span>
        <a :href="'tel:' + telephone" class="external" v-else>{{ telephone }}</a>
      </div>
    </div>
  </f7-page>
</template>

<script>
import axios from 'axios';
import jsonpAdapter from 'axios-jsonp';
import iconNav from '@/images/nav.png';

export default {
  props: ['latitude', 'longitude', 'title', 'address', 'telephone'],
  data() {
    return {
      iconNav
    };
  },
  mounted() {
    const accessKey = 'ECCBZ-HMTKQ-SJY5I-GL4YB-EEKS6-ZKFDN';

    axios({
      url: `//map.qq.com/api/js?v=2.exp&key=${accessKey}`,
      adapter: jsonpAdapter
    }).then(() => {
      const center = new qq.maps.LatLng(this.latitude, this.longitude);
      const map = new qq.maps.Map(document.getElementById('container'), {
        center,
        disableDefaultUI: true,
        zoom: 17
      });

      new qq.maps.Marker({
        position: center,
        map
      });
    });
  }
};
</script>

<style scoped>
#container {
  height: calc(100% - 107px);
}
.info {
  height: 107px;
  box-sizing: border-box;
  padding: 20px 15px;
  position: relative;
  background: #fff;
}
.info::before {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  right: auto;
  bottom: auto;
  height: 1px;
  width: 100%;
  background-color: #c8c7cc;
  display: block;
  z-index: 15;
  -webkit-transform: scaleY(0.5);
  transform: scaleY(0.5);
  -webkit-transform-origin: 0 0;
  transform-origin: 0 0;
}
.info img {
  float: right;
  width: 50px;
  height: 50px;
  padding-top: 10px;
}
.info .title {
  font-size: 21px;
}
.info .desc,
.info .tel {
  font-size: 13px;
  color: #999;
  height: 23px;
  line-height: 23px;
}
</style>
