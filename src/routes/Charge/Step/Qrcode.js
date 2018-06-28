import React from 'react';
import { connect } from 'dva';
import { Icon, Button, Modal } from 'antd';
import { routerRedux } from 'dva/router';
import styles from '../style.less';

class ChargeQrcode extends React.PureComponent {
  checkPaySuccess() {
    this.props
      .dispatch({
        type: 'pay/check',
        payload: {
          order: this.props.pay.order,
        },
      })
      .then(status => {
        if (status === 0) this.props.dispatch(routerRedux.push('/charge/index/success'));
        else
          Modal.error({
            title: '电费支付失败',
            content: '可能是支付尚未完成或银行卡余额不足，请再次扫码支付',
          });
      });
  }

  render() {
    return (
      <div className={styles.qrcode}>
        <div className={styles.title}>
          请使用 <Icon type="wechat" /> <strong>微信</strong> 扫描二维码支付
        </div>
        <div className={styles.image}>
          <img
            src={'/electric/api/qrcode?url=' + encodeURIComponent(this.props.pay.qrcode)}
            alt="二维码"
          />
        </div>
        <Button
          type="primary"
          style={{ marginTop: '20px' }}
          loading={this.props.checkLoading}
          onClick={this.checkPaySuccess.bind(this)}
        >
          已完成支付
        </Button>
      </div>
    );
  }
}

export default connect(({ pay, loading }) => ({
  pay,
  checkLoading: loading.effects['pay/check'],
}))(ChargeQrcode);
