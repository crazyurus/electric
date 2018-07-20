import React from 'react';
import { connect } from 'dva';
import { Icon } from 'antd';
import { routerRedux } from 'dva/router';
import styles from '../style.less';

class ChargeQrcode extends React.PureComponent {
  state = {};

  componentDidMount() {
    this.state.timer = setInterval(::this.checkPaySuccess, 2000);
  }

  componentWillUnmount() {
    clearInterval(this.state.timer);
  }

  checkPaySuccess() {
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
          请打开 <Icon type="wechat" /> <strong>微信</strong> 扫描二维码支付
        </div>
        <div className={styles.image}>
          <img
            src={'/electric/api/qrcode?url=' + encodeURIComponent(this.props.pay.qrcode)}
            alt="二维码"
          />
        </div>
      </div>
    );
  }
}

export default connect(({ pay }) => ({
  pay,
}))(ChargeQrcode);
