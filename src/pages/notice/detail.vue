<template>
  <f7-page name="content">
    <article>
      <header>{{article.title}}</header>
      <main v-html="article.content"></main>
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
      this.$http.post('https://api.wutnews.net/electric/notice/content', {
        link: decodeURIComponent(this.link)
      }).then(result => {
        this.$indicator.hide();
        this.article = result.data.data;
      })
    }
  }
</script>

<style scoped>
  header {
    background-color: #45c8dc;
    color: #fff;
    font-size: 22px;
    font-weight: bold;
    padding: 160px 0 20px 20px;
  }
  main {
    word-break: break-all;
    margin: 20px 0;
    padding: 0 20px;
    font-size: 16px;
    color: #666;
  }
</style>
