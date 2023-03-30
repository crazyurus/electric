import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Avatar, Divider, Row, Col, Icon, Card, Tabs, Tooltip, message } from 'antd';
import numeral from 'numeral';
import { ChartCard, Field, Bar } from '@/components/Charts';
import Trend from '@/components/Trend';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import styles from './Index.less';

const { TabPane } = Tabs;
const Yuan = ({ children }) => {
  return children ? '¥' + children.replace('元', '') : ''; /* eslint-disable-line react/no-danger */
};
const Do = ({ className, children }) => {
  return (
    <span className={className}>
      {children ? children.replace('度', '').replace('千瓦时', '') : '0.00'}
    </span>
  ); /* eslint-disable-line react/no-danger */
};

@connect(({ room, loading }) => ({
  room,
  detailLoading: loading.effects['room/fetchRoomDetail'],
  updateLoading: loading.effects['room/updateRoomDetail'],
  chartLoading: loading.effects['room/fetchEverydayInfo'],
}))
export default class Index extends Component {
  state = {
    month: 0,
    rankList: [],
  };

  componentDidMount() {
    if (!this.props.room.detail.left) {
      this.props.dispatch({
        type: 'room/fetchRoomDetail',
      });
    }
    this.props
      .dispatch({
        type: 'room/fetchEverydayInfo',
      })
      .then(month => {
        this.setMonth(month);
      });
  }

  setMonth = month => {
    let monthData = [].concat(this.props.room.everyday[month]);
    monthData.sort((a, b) => b.y - a.y);
    const rankList = [];
    for (let i = 0; i < Math.min(monthData.length, 8); ++i) {
      rankList.push({
        title: month + '月' + monthData[i].x + '日',
        total: monthData[i].y + '度',
      });
    }
    this.setState({ month, rankList });
  };

  updateRoomDetail = e => {
    e.preventDefault();

    this.props
      .dispatch({
        type: 'room/updateRoomDetail',
      })
      .then(() => {
        message.success('抄表成功');
      }).catch(error => {
        message.error(error.message || '抄表失败');
      });
  };

  transAreaName(area) {
    switch (Number(area)) {
      case 1:
        return '南湖校区';
      case 2:
        return '东院';
      case 3:
        return '西院/鉴湖校区';
      case 7:
        return '余家头校区';
      default:
        return '未知';
    }
  }

  calcRemainDay(left, speed) {
    if (!speed || speed === -1) return '很久之后';
    const remain = Math.floor(left.replace('度', '') / speed);
    const now = new Date();
    const predict = new Date(now.getFullYear(), now.getMonth(), now.getDate() + remain);
    return (
      (predict.getFullYear() === now.getFullYear() ? '' : predict.getFullYear() + '年') +
      (predict.getMonth() + 1) +
      '月' +
      predict.getDate() +
      '日'
    );
  }

  render() {
    const { room, detailLoading, updateLoading, chartLoading } = this.props;

    const months = [];
    for (const month in room.everyday) {
      months.push(month);
    }

    const monthChoose = (
      <div className={styles.salesExtraWrap}>
        <div className={styles.salesExtra}>
          {months.map(month => (
            <a
              key={month}
              className={month == this.state.month ? styles.currentDate : null}
              onClick={() => this.setMonth(month)}
            >
              {month}月
            </a>
          ))}
        </div>
      </div>
    );

    const pageHeaderContent = (
      <div className={styles.pageHeaderContent}>
        <div className={styles.avatar}>
          <Avatar
            size="large"
            src="//gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png"
          />
        </div>
        <div className={styles.content}>
          <div className={styles.contentTitle}>{room.detail.name || '加载中…'}</div>
          <div>
            {this.transAreaName(room.room.area)}
            <Divider type="vertical" style={{ color: 'rgba(0,0,0,.45)' }} />No.{room.detail.no ||
              '000000000000'}
          </div>
        </div>
      </div>
    );

    const extraContent = (
      <div className={styles.extraContent}>
        <div className={styles.statItem}>
          <p>联网状态</p>
          <p>{room.detail.status ? room.detail.status.split('，')[0] : '暂无'}</p>
        </div>
        <div className={styles.statItem}>
          <p>工作状态</p>
          <p>{room.detail.status ? room.detail.status.split('，')[1] : '暂无'}</p>
        </div>
        <div className={styles.statItem}>
          <p>用电排行</p>
          <p>{room.detail.rank[0]} / <span style={{ color: 'inherit' }}>{room.detail.rank[1]}</span></p>
        </div>
      </div>
    );

    const leftCardFooter = (
      <Fragment>
        <Tooltip title="预计用完日期仅供参考">
          <Icon type="info-circle-o" className={styles.leftCardFooterIcon} />
        </Tooltip>
        <Field
          label={'预计' + this.calcRemainDay(room.detail.left, room.detail.speed) + '用完'}
          value=""
        />
      </Fragment>
    );

    const topColResponsiveProps = {
      xs: 24,
      sm: 12,
      md: 12,
      lg: 12,
      xl: 6,
      style: { marginBottom: 24 },
    };

    return (
      <PageHeaderLayout content={pageHeaderContent} extraContent={extraContent}>
        <Row gutter={24}>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="剩余电量"
              action={
                <a href="#" title="刷新电量" onClick={this.updateRoomDetail}>
                  刷新
                </a>
              }
              total={
                room.detail.left && room.detail.left.replace('度', '') < 15 ? (
                  <Do className={styles.txtRed}>{room.detail.left}</Do>
                ) : (
                  <Do>{room.detail.left}</Do>
                )
              }
              footer={leftCardFooter}
              contentHeight={46}
              loading={detailLoading || updateLoading}
            />
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="今日用电"
              total={<Do>{room.detail.today.use}</Do>}
              footer={
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Field label="当日电费" value={<Yuan>{room.detail.today.price}</Yuan>} />
                  <Trend flag="up">12%</Trend>
                </div>
              }
              contentHeight={46}
              loading={detailLoading}
            />
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="当月用电"
              total={<Do>{room.detail.month.use}</Do>}
              footer={
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Field label="当月电费" value={<Yuan>{room.detail.month.price}</Yuan>} />
                  <Trend flag="down">30%</Trend>
                </div>
              }
              contentHeight={46}
              loading={detailLoading}
            />
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="累计用电"
              action={
                <Tooltip title="该宿舍电表累计示数">
                  <Icon type="info-circle-o" />
                </Tooltip>
              }
              total={numeral(room.detail.sum.replace('千瓦时', '')).format('0,0')}
              footer={<Field label="电费单价" value={<Yuan>{room.detail.unit_price}</Yuan>} />}
              contentHeight={46}
              loading={detailLoading}
            />
          </Col>
        </Row>

        <Card bordered={false} bodyStyle={{ padding: 0 }} loading={chartLoading}>
          <div className={styles.salesCard}>
            <Tabs tabBarExtraContent={monthChoose} size="large" tabBarStyle={{ marginBottom: 24 }}>
              <TabPane tab="每日用电" key="sales">
                <Row>
                  <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                    <div className={styles.salesBar}>
                      <Bar
                        height={340}
                        title={this.state.month + '月'}
                        data={room.everyday[this.state.month]}
                      />
                    </div>
                  </Col>
                  <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                    <div className={styles.salesRank}>
                      <h4 className={styles.rankingTitle}>{this.state.month}月用电排名</h4>
                      <ul className={styles.rankingList}>
                        {this.state.rankList.map((item, i) => (
                          <li key={item.title}>
                            <span className={i < 3 ? styles.active : ''}>{i + 1}</span>
                            <span>{item.title}</span>
                            <span>{item.total}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          </div>
        </Card>
        <Field
          label={
            <Fragment>
              <Icon type="info-circle" />&nbsp;&nbsp;以上电费信息更新于&nbsp;
            </Fragment>
          }
          value={room.detail.time}
          className={styles.updateTimeField}
        />
      </PageHeaderLayout>
    );
  }
}
