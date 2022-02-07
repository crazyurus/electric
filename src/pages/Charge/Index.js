import React, { PureComponent, Fragment } from 'react';
import { Route, Redirect, Switch } from 'dva/router';
import { Card, Steps } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import NotFound from '../Exception/404';
import { getRoutes } from '../../utils/utils';
import styles from './style.less';

const { Step } = Steps;

export default class ChargeIndex extends PureComponent {
  getCurrentStep() {
    const { location } = this.props;
    const { pathname } = location;
    const pathList = pathname.split('/');
    switch (pathList[pathList.length - 1]) {
      case 'form':
        return 0;
      case 'qrcode':
        return 1;
      case 'success':
        return 2;
      default:
        return 0;
    }
  }
  render() {
    const { match, routerData, location } = this.props;
    return (
      <PageHeaderLayout
        title="电费充值"
        tabActiveKey={location.pathname}
        content="为宿舍在线缴纳电费，自动下发到电表"
      >
        <Card bordered={false}>
          <Steps current={this.getCurrentStep()} className={styles.steps}>
            <Step title="填写充值信息" />
            <Step title="扫码支付" />
            <Step title="完成" />
          </Steps>
          <Switch>
            {getRoutes(match.path, routerData).map(item => (
              <Route
                key={item.key}
                path={item.path}
                component={item.component}
                exact={item.exact}
              />
            ))}
            <Redirect exact from="/charge/index" to="/charge/index/form" />
            <Route render={NotFound} />
          </Switch>
        </Card>
      </PageHeaderLayout>
    );
  }
}
