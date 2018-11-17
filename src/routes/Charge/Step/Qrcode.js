import React, { Fragment, Component } from 'react';
import { connect } from 'dva';
import { Icon } from 'antd';
import { routerRedux } from 'dva/router';
import QRCode from 'qrcode.react';
import styles from '../style.less';

class ChargeQrcode extends Component {
  state = {};

  componentDidMount() {
    this.state.timer = setInterval(::this.checkPaySuccess, 2000);
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
    const isCwsf = this.props.pay.qrcode.indexOf('.icbc.') > -1;
    return (
      <div className={styles.qrcode}>
        <div className={styles.title}>
          请打开 <Icon type="wechat" /> <strong>微信</strong>
          {isCwsf ? (
            <Fragment>
              {' '}
              或 <Icon type="alipay" /> <strong>支付宝</strong>
            </Fragment>
          ) : null}{' '}
          扫描二维码支付
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
