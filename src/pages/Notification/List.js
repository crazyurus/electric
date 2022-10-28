import React, { Component } from 'react';
import { connect } from 'dva';
import { Link } from 'dva/router';
import { Card, List, Icon, Button } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

@connect(({ room, notification, loading }) => ({
  room: room.room,
  notification,
  loading: loading.effects['notification/list'],
}))
export default class NotificationList extends Component {
  state = {
    page: 1,
  };

  componentDidMount() {
    this.fetchMore();
  }

  fetchMore = () => {
    this.props.dispatch({
      type: 'notification/list',
      payload: {
        page: this.state.page,
        area: this.props.room.area,
      },
    });
    this.state.page++;
  };

  render() {
    const { notification: { list }, loading } = this.props;

    const loadMore =
      list.length > 0 ? (
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <Button onClick={this.fetchMore} style={{ paddingLeft: 48, paddingRight: 48 }}>
            {loading ? (
              <span>
                <Icon type="loading" /> 加载中...
              </span>
            ) : (
              '加载更多'
            )}
          </Button>
        </div>
      ) : null;

    return (
      <PageHeaderLayout
        title="停电通知"
        content={
          '以下通知来源于武汉理工大学' +
          (this.props.room.area === 7 ? '余家头校区管理委员会' : '后勤保障处')
        }
      >
        <Card
          style={{ marginTop: 24 }}
          bordered={false}
          bodyStyle={{ padding: '8px 32px 32px 32px' }}
        >
          <List
            size="large"
            loading={list.length === 0 ? loading : false}
            rowKey="link"
            itemLayout="vertical"
            loadMore={loadMore}
            dataSource={list}
            renderItem={item => (
              <List.Item key={item.link}>
                <List.Item.Meta
                  title={
                    <Link to={'/notification/detail/' + encodeURIComponent(item.link)}>{item.title}</Link>
                  }
                  description={item.time}
                  style={{ marginBottom: 0 }}
                />
              </List.Item>
            )}
          />
        </Card>
      </PageHeaderLayout>
    );
  }
}
