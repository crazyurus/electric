import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Tooltip, Icon } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { share } from '../../utils/utils';

@connect(({ notification, loading }) => ({
  notification,
  loading: loading.effects['notification/detail'],
}))
export default class NotificationContent extends Component {
  state = {
    article: {},
  };

  componentDidMount() {
    this.props
      .dispatch({
        type: 'notification/detail',
        link: this.props.match.params.link,
      })
      .then(response => {
        this.setState({
          article: response.data,
        });
      });
  }

  shareToSNS(e) {
    const classList = e.target.className.split('anticon-');
    const type = classList[1].split(' ', 1)[0];
    share(type, this.state.article.title);
  }

  render() {
    const { article } = this.state;

    return (
      <PageHeaderLayout title={article.title} content={article.time}>
        <Card
          style={{ marginTop: 24 }}
          bordered={false}
          bodyStyle={{ padding: '24px 32px' }}
          loading={this.props.loading}
        >
          <div dangerouslySetInnerHTML={{ __html: article.content }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px' }}>
            <Tooltip title="需要校园网或校园VPN下访问">
              <a
                href={
                  'http://i.whut.edu.cn/xxtg/znbm/' +
                  decodeURIComponent(this.props.match.params.link)
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                阅读原文
              </a>
            </Tooltip>
            <div style={{ color: '#8c8c8c', cursor: 'pointer' }}>
              <span>分享到：</span>
              <Tooltip title="QQ">
                <Icon type="qq" onClick={this.shareToSNS.bind(this)} />
              </Tooltip>
              {'　'}
              <Tooltip title="微信">
                <Icon type="wechat" />
              </Tooltip>
              {'　'}
              <Tooltip title="微博">
                <Icon type="weibo" onClick={this.shareToSNS.bind(this)} />
              </Tooltip>
            </div>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
