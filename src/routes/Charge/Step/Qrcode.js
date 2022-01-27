import React, { Fragment, Component } from 'react';
import { connect } from 'dva';
import { Icon } from 'antd';
import { routerRedux } from 'dva/router';
import QRCode from 'qrcode.react';
import styles from '../style.less';

class ChargeQrcode extends Component {
  state = {};

  componentDidMount() {
    this.state.timer = setInterval(::this.checkPaySuccess, 5000);
  }

  componentWillUnmount() {
    clearInterval(this.state.timer);
  }

  checkPaySuccess() {
    if (!this.props.pay.order) return;
    this.props
      .dispatch({
        type: 'pay/check',
        payload: {
          order: this.props.pay.order,
        },
      })
      .then(status => {
        if (status === 0) {
          this.props.dispatch(routerRedux.push('/charge/index/success'));
          clearInterval(this.state.timer);
        }
      });
  }

  render() {
    return (
      <div className={styles.qrcode}>
        <div className={styles.title}>
          请打开{' '}{this.props.pay.type === 1 ? (
            <Fragment>
              <Icon type="wechat" /> <strong>微信</strong>
            </Fragment>
          ) : (
            <Fragment>
              <Icon type="alipay" /> <strong>支付宝</strong>
            </Fragment>
          )}{' '}扫描二维码支付
        </div>
        <div className={styles.image}>
          <QRCode value={this.props.pay.qrcode} size={248} />
        </div>
      </div>
    );
  }
}

export default connect(({ pay }) => ({
  pay,
}))(ChargeQrcode);
