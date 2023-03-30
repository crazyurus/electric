<template>
  <f7-page name="content">
    <article>
      <header>{{article.title}}</header>
      <main v-html="article.content"></main>
      <footer>
        <button @click="share">分享</button>
      </footer>
    </article>
  </f7-page>
</template>

<script>
  export default {
    props: ['link'],
    data () {
      return {
        article: {
          title: '加载中',
          content: '内容加载中……<br>若长时间未加载完成，请尝试在掌上理工大App中查看',
          time: '2000-03-19',
          link: '',
          attachment: []
        }
      }
    },
    mounted () {
      this.$indicator.show();
      this.$http.get('/notification/detail.json', {
        link: decodeURIComponent(this.link)
      }).then(result => {
        this.$indicator.hide();
        this.article = result;
      })
    },
    methods: {
      share() {
        navigator.share({
          url: location.href,
          title: this.article.title,
        });
      }
    }
  }
</script>

<style scoped>
  article {
    height: 100%;
  }
  header {
    background-color: #45c8dc;
    color: #fff;
    font-size: 22px;
    font-weight: bold;
    padding: 120px 0 20px 20px;
  }
  main {
    word-break: break-all;
    margin: 20px 0;
    padding: 0 20px;
    font-size: 16px;
    color: #666;
    min-height: calc(100% - 296px);
  }
  footer {
    margin: 35px auto 0;
    padding-bottom: 35px;
  }
  footer button {
    position: relative;
    display: block;
    margin-left: auto;
    margin-right: auto;
    padding: 6px 24px;
    box-sizing: border-box;
    font-weight: bold;
    font-size: 16px;
    text-align: center;
    text-decoration: none;
    color: #45c8dc;
    background-color: #F2F2F2;;
    line-height: 1.5;
    border-radius: 4px;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    overflow: hidden;
    border: none;
    cursor: pointer;
    outline: none;
  }
  footer button:active {
    background-color: #D9D9D9;
  }
</style>
