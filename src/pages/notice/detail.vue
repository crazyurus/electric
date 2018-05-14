<template>
  <f7-page name="content">
    <f7-card>
      <f7-card-header>
        <p class="card-title">{{article.title}}</p>
      </f7-card-header>
      <f7-card-content>
        <div class="card-content-inner" v-html="article.content"></div>
      </f7-card-content>
      <f7-card-footer>
        <template v-if="article.attachment.length > 0">
          附件：<a :href="'/electric/notice/attachment?link=' + item.url" class="external" target="_blank" v-for="item in article.attachment">{{item.name}}</a>
        </template>
        <span v-else>{{article.time.trim()}}</span>
      </f7-card-footer>
    </f7-card>
  </f7-page>
</template>

<script>
  import Token from '../../libs/Token'

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
      Token.indicator.show();
      this.$http.get('https://api.wutnews.net/electric/notice/content?link=' + decodeURIComponent(this.link)).then(result => {
        Token.indicator.hide();
        this.article = result.data.data;
      })
    }
  }
</script>

<style scoped>
  .card-footer {
    display: block;
  }
  .card-title {
    border-left: 6px solid #45c8dc;
    padding-left: 15px;
  }
  .card-content-inner {
    word-break: break-all;
  }
</style>