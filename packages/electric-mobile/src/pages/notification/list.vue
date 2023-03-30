<template>
  <f7-page infinite-scroll @infinite="load" name="list">
    <div class="content-block-title">以下通知来源于武汉理工大学{{ $store.state.area == 7 ? '余家头校区管理委员会' : '后勤保障处' }}</div>
    <div class="list-block media-list record-list">
      <ul>
        <li class="swipeout" v-for="item in list" :key="item.link">
          <a :href="'/notification/detail/' + encodeURIComponent(item.link)" class="item-link item-content swipeout-content">
            <div class="item-inner">
              <div class="item-title-row">
                <div class="item-title">
                  <span class="circle bg-green"></span>{{item.title}}
                </div>
              </div>
              <div class="item-text">{{item.time}}</div>
            </div>
          </a>
          <div class="swipeout-actions-right">
            <a href="#" class="swipeout-delete">删除</a>
          </div>
        </li>
      </ul>
    </div>
  </f7-page>
</template>

<script>
  export default {
    data () {
      return {
        page: 1,
        loading: false,
        list: []
      }
    },
    mounted () {
      this.$indicator.show();
      this.load();
    },
    methods: {
      load () {
        if (this.loading) return;

        this.loading = true;
        this.$http.get('/notification/list.json', {
          page: this.page,
          area: this.$store.state.area
        }).then(result => {
          if (this.page === 1) this.$indicator.hide();

          if (result.length !== 0) {
            this.page++;
            this.loading = false;
            this.list = this.list.concat(result);
          }
        });
      }
    }
  }
</script>

<style>
  .infinite-scroll-preloader {
    margin-bottom: 1.6rem;
    text-align: center;
  }
  .infinite-scroll-preloader .preloader {
    width: 1.8rem;
    height: 1.8rem;
  }
</style>
