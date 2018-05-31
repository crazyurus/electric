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
} from 'antd';
import numeral from 'numeral';
import {
  ChartCard,
  yuan,
  Field,
  Bar,
} from 'components/Charts';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './Analysis.less';

const { TabPane } = Tabs;

const rankingListData = [];
for (let i = 0; i < 7; i += 1) {
  rankingListData.push({
    title: `工大路 ${i} 号店`,
    total: 323234,
  });
}

const Yuan = ({ children }) => (
  <span dangerouslySetInnerHTML={{ __html: yuan(children) }}/> /* eslint-disable-line react/no-danger */
);

@connect(({ room, loading }) => ({
  room,
  loading: loading.effects['room/fetchRoomDetail'],
}))
export default class Analysis extends Component {
  state = {
    salesType: 'all',
  };

  componentDidMount() {
    this.props.dispatch({
      type: 'room/fetchRoomDetail',
      payload: this.props.room.room,
    });
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: 'room/clear',
    });
  }

  handleChangeSalesType = e => {
    this.setState({
      salesType: e.target.value,
    });
  };

  isActive(type) {
    return;
  }

  render() {
    const { room, loading } = this.props;

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
            src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png"
          />
        </div>
        <div className={styles.content}>
          <div className={styles.contentTitle}>{room.detail.name ? room.detail.name : '加载中…'}</div>
          <div>鉴湖校区 | No.{room.detail.no}</div>
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
          <Icon type="info-circle-o" className={styles.leftCardFooterIcon}/>
        </Tooltip>
        <Field label="预计7月13日用完" value=""/>
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
              action={<a href="#" title="刷新电量">刷新</a>}
              total={() => <Yuan>126560</Yuan>}
              footer={leftCardFooter}
              contentHeight={46}
            >
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="今日用电"
              total={numeral(8846).format('0,0')}
              footer={<Field label="当日电费" value={numeral(1234).format('0,0')}/>}
              contentHeight={46}
            >
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="当月用电"
              total={numeral(8846).format('0,0')}
              footer={<Field label="当月电费" value={numeral(1234).format('0,0')}/>}
              contentHeight={46}
            >
            </ChartCard>
          </Col>
          <Col {...topColResponsiveProps}>
            <ChartCard
              bordered={false}
              title="累计用电"
              action={<Tooltip title="该宿舍电表累计示数"><Icon type="info-circle-o"/></Tooltip>}
              total={numeral(8846).format('0,0')}
              footer={<Field label="电费单价" value={numeral(1234).format('0,0')}/>}
              contentHeight={46}
            >
            </ChartCard>
          </Col>
        </Row>

        <Card loading={loading} bordered={false} bodyStyle={{ padding: 0 }}>
          <div className={styles.salesCard}>
            <Tabs tabBarExtraContent={monthChoose} size="large" tabBarStyle={{ marginBottom: 24 }}>
              <TabPane tab="每日用电" key="sales">
                <Row>
                  <Col xl={16} lg={12} md={12} sm={24} xs={24}>
                    <div className={styles.salesBar}>

                    </div>
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
        <Field label={<Fragment><Icon type="info-circle"/>&nbsp;&nbsp;以上电费信息更新于&nbsp;</Fragment>} value={room.detail.time}
               className={styles.updateTimeField}/>
      </PageHeaderLayout>
    );
  }
}
