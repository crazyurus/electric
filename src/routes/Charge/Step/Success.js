import React, { Fragment } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Button } from 'antd';
import Result from 'components/Result';

class ChargeSuccess extends React.PureComponent {
  render() {
    return (
      <Result
        type="success"
        title="支付成功"
        description="充值的电量预计1-10分钟后下发到电表，可以在购电详情中查询。若长时间仍未成功下发，请咨询所在校区充值点的工作人员。"
        actions={
          <Fragment>
            <Button
              onClick={() => this.props.dispatch(routerRedux.push('/charge/record'))}
              type="primary"
            >
              查看充值记录
            </Button>
            <Button onClick={() => this.props.dispatch(routerRedux.push('/detail/index'))}>
              返回首页
            </Button>
          </Fragment>
        }
        style={{ marginTop: 48, marginBottom: 16 }}
      />
    );
  }
}

export default connect()(ChargeSuccess);
