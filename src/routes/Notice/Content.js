import React, { Component } from 'react';
import { connect } from 'dva';
import { Card, Tooltip, Icon } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

@connect(({ notice, loading }) => ({
  notice,
  loading: loading.effects['notice/detail'],
}))
export default class NoticeContent extends Component {
  state = {
    article: {},
  };

  componentDidMount() {
    this.props
      .dispatch({
        type: 'notice/detail',
        link: this.props.match.params.link,
      })
      .then(response => {
        this.setState({
          article: response.data,
        });
      });
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
              分享到：<Tooltip title="QQ">
                <Icon type="qq" />
              </Tooltip>　<Tooltip title="微信">
                <Icon type="wechat" />
              </Tooltip>　<Tooltip title="微信">
                <Icon type="weibo" />
              </Tooltip>
            </div>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
