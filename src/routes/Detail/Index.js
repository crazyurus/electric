import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import {
  Avatar,
  Row,
  Col,
  Icon,
  Card,
  Tabs,
  Tooltip,
  message,
} from 'antd';
import numeral from 'numeral';
import {
  ChartCard,
  Field,
  Bar,
} from 'components/Charts';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './Index.less';

const { TabPane } = Tabs;

const rankingListData = [];
for (let i = 0; i < 7; i += 1) {
  rankingListData.push({
    title: `工大路 ${i} 号店`,
    total: 323234,
  });
}

const Yuan = ({ children }) => {
  return children ? '¥' + children.replace('元', '') : ''; /* eslint-disable-line react/no-danger */
};

const Do = ({ children }) => {
  return children ? children.replace('度', '').replace('千瓦时', '') : '0.00'; /* eslint-disable-line react/no-danger */
};

@connect(({ room, loading }) => ({
  room,
  detailLoading: loading.effects['room/fetchRoomDetail'],
  updateLoading: loading.effects['room/updateRoomDetail'],
}))
export default class Index extends Component {

  componentDidMount() {
    if (!this.props.room.detail.left) {
      this.props.dispatch({
        type: 'room/fetchRoomDetail',
      });
    }
  }

  handleChangeSalesType = e => {
    this.setState({
      salesType: e.target.value,
    });
  };

  updateRoomDetail = () => {
    this.props.dispatch({
      type: 'room/updateRoomDetail',
    }).then(response => {
      if (response.errCode === 0) message.success('抄表成功');
      else message.error('抄表失败');
    });
  };

  transAreaName(area) {
    switch (area.valueOf()) {
      case 1: return '南湖校区';
      case 2: return '东院';
      case 3: return '西院/鉴湖校区';
      case 7: return '余家头校区';
      default: return '未知';
    }
  }

  calcRemainDay(left, speed) {
    if (!speed || speed === -1) return '很久之后';
    const remain = Math.floor(left.replace('度', '') / speed);
    const now = new Date();
    const predict = new Date(now.getFullYear(), now.getMonth(), now.getDate() + remain);
    return (predict.getFullYear() === now.getFullYear() ? '' : predict.getFullYear() + '年') + (predict.getMonth() + 1) + '月' + predict.getDate() + '日';
  }

  isActive(type) {

  }

  render() {
    const { room, detailLoading, updateLoading, chartLoading } = this.props;

    const monthChoose = (
      <div className={styles.salesExtraWrap}>
        <div className={styles.salesExtra}>
          <a className={this.isActive('today')} onClick={() => this.selectDate('today')}>
            四月
          </a>
          <a className={this.isActive('week')} onClick={() => this.selectDate('week')}>
            五月
          </a>
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
          <div>{this.transAreaName(room.room.area)} | No.{room.detail.no || '000000000000'}</div>
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
          <p>暂无</p>
        </div>
      </div>
    );

    const leftCardFooter = (
      <Fragment>
        <Tooltip title="预计用完日期仅供参考">
          <Icon type="info-circle-o" className={styles.leftCardFooterIcon} />
        </Tooltip>
        <Field label={'预计' + this.calcRemainDay(this.props.room.detail.left, this.props.room.detail.speed) + '用完'} value="" />
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
                action={<a href="#" title="刷新电量" onClick={this.updateRoomDetail}>刷新</a>}
                total={<Do>{room.detail.left}</Do>}
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
              footer={<Field label="当日电费" value={<Yuan>{room.detail.today.price}</Yuan>} />}
              contentHeight={46}
              loading={detailLoading}
            />
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="当月用电"
              total={<Do>{room.detail.month.use}</Do>}
              footer={<Field label="当月电费" value={<Yuan>{room.detail.month.price}</Yuan>} />}
              contentHeight={46}
              loading={detailLoading}
            />
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="累计用电"
              action={<Tooltip title="该宿舍电表累计示数"><Icon type="info-circle-o" /></Tooltip>}
              total={numeral(room.detail.sum.replace('千瓦时', '')).format('0,0')}
              footer={<Field label="电费单价" value={<Yuan>{room.detail.unit_price}</Yuan>} />}
              contentHeight={46}
              loading={detailLoading}
            />
          </Col>
        </Row>

        <Card bordered={false} bodyStyle={{ padding: 0 }}>
          <div className={styles.salesCard}>
            <Tabs tabBarExtraContent={monthChoose} size="large" tabBarStyle={{ marginBottom: 24 }}>
              <TabPane tab="每日用电" key="sales">
                <Row>
                  <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                    <div className={styles.salesBar} />
                  </Col>
                  <Col xl={8} lg={12} md={12} sm={24} xs={24}>
                    <div className={styles.salesRank}>
                      <h4 className={styles.rankingTitle}>门店销售额排名</h4>
                      <ul className={styles.rankingList}>
                        {rankingListData.map((item, i) => (
                          <li key={item.title}>
                            <span className={i < 3 ? styles.active : ''}>{i + 1}</span>
                            <span>{item.title}</span>
                            <span>{numeral(item.total).format('0,0')}</span>
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
          label={<Fragment><Icon type="info-circle" />&nbsp;&nbsp;以上电费信息更新于&nbsp;</Fragment>}
          value={room.detail.time}
          className={styles.updateTimeField}
        />
      </PageHeaderLayout>
    );
  }
}
