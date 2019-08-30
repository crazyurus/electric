<template>
  <f7-page name="content">
    <article>
      <header>{{article.title}}</header>
      <main v-html="article.content"></main>
      <footer>
        <button @click="share">分享</button>
        <a @click="offline">查看线下充值点</a>
      </footer>
    </article>
  </f7-page>
</template>

<script>
  import { Base64 } from 'js-base64';
  import stations from '@/data/station';

  export default {
    props: ['link'],
    data () {
      return {
        article: {
          title: '关于掌上理工大电费功能及电费查询小程序无法使用的公告',
          content: '亲爱的同学们：<br><br>　　感谢大家一直以来对于掌上理工大及Token团队的支持。<br>　　为了解决与教育部及学校相关规定不符的问题，掌上理工大将暂时关闭全部服务，包括微信/QQ小程序平台在内的电费查询与充值服务，并进行整改。对各位同学学习生活造成的不便，我们深表歉意。<br>　　从2013年到2019年，掌上理工大陪伴理工学子走过了大学生活中的风风雨雨。是同学们的厚爱让我们坚守初心，只做能真正让用户觉得好用的产品。告别是暂时的，Token团队将会负重前行，用更好的产品服务理工学子。<br>　　掌上理工大整改完成后，我们将尽快恢复服务，期待与同学们的再次相会。<br><p align="right">Token团队<br>2019.9.14</p><br><i>同学们可以在电脑上访问学校的缴费平台网站 <a>http://cwsf.whut.edu.cn/</a>，或前往各校区线下充值点，完成电费的查询和充值。</i><br>',
          time: '2010-09-14',
          link: '',
          attachment: []
        }
      }
    },
    mounted () {
      // this.$indicator.show();
      // this.$http.post('https://api.wutnews.net/electric/notice/content', {
      //   link: decodeURIComponent(this.link)
      // }).then(result => {
      //   this.$indicator.hide();
      //   this.article = result.data.data;
      // })
    },
    methods: {
      share() {
        if (window.token && token.invokeShare) token.invokeShare(this.article.title, location.href, 0);
        else if (window.tokenNative && tokenNative.showShare) {
          tokenNative.showShare({
            title: this.article.title,
            link: location.href,
            desc: '来自掌上理工大电费查询'
          });
        } else location.assign('mqqapi://share/to_fri?src_type=web&version=1&file_type=news&share_id=1109559705&title=' + Base64.encode(this.article.title) + '&thirdAppDisplayName=5o6M5LiK55CG5bel5aSn&url=' + Base64.encode(location.href) + '&description=' + Base64.encode('来自掌上理工大电费查询'));
      },
      offline() {
        const stationButtons = stations.map((station, index) => ({
          text: station.name,
          onClick: () => {
            const name = encodeURIComponent(station.name + '电费充值点');
            this.$f7.mainView.router.loadPage('/charge/map/' + station.position[0] + '/' + station.position[1] + '/' + name + '/' + encodeURIComponent(index === 4 ? '武汉升升学府物业管理有限公司' : '武汉理工大学水电管理中心') + '/' + station.telephone);
          }
        }));
        const cancelButtons = [{
          text: '关闭',
          color: 'red'
        }];

        stationButtons.unshift({
          text: '电费充值点',
          label: true
        });

        this.$f7.actions([stationButtons, cancelButtons]);
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
    line-height: 1.25;
    padding: 120px 20px 20px 20px;
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
    text-align: center;
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
  footer a {
    line-height: 3.6;
    cursor: pointer;
  }
</style>
