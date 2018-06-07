import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Radio, Divider, Alert } from 'antd';
import { routerRedux } from 'dva/router';
import styles from '../style.less';

const formItemLayout = {
  labelCol: {
    span: 5,
  },
  wrapperCol: {
    span: 19,
  },
};

@Form.create()
class ChargeForm extends React.PureComponent {

  onValidateForm = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.props.dispatch({
          type: 'pay/ip',
        }).then(ip => {
         return this.props.dispatch({
           type: 'pay/prepare',
           payload: {
             area: this.props.room.room.area,
             amount: values.amount,
             sno: this.props.user.currentUser.sno,
             meter: this.props.room.room.meter,
             type: 'NATIVE',
             ip,
           },
         });
        }).then(() => {
          return this.props.dispatch(routerRedux.push('/charge/index/qrcode'));
        });
      }
    });
  };

  render() {
    const { form, room, submitLoading } = this.props;
    const { getFieldDecorator } = form;
    const isYuArea = room.room.area === 7;
    const isOffline = room.detail.status.indexOf('离线') > -1;

    return (
      <Fragment>
        <Form layout="horizontal" className={styles.stepForm} onSubmit={this.onValidateForm} hideRequiredMark>
          {
            isYuArea ? '' : <Alert showIcon message="马房山校区的宿舍暂不支持在线充值" style={{ marginBottom: 24 }} />
          }
          {
            !isYuArea && isOffline ? <Alert showIcon message="宿舍电表处于离线状态暂不支持在线充值" style={{ marginBottom: 24 }} /> : ''
          }
          <Form.Item {...formItemLayout} label="宿舍">
            <strong>{room.room.meter.split('*')[2]}</strong>
          </Form.Item>
          <Form.Item {...formItemLayout} label="充值金额">
            {getFieldDecorator('amount', {
              initialValue: 100,
              validateFirst: true,
              rules: [
                {
                  required: true,
                  message: '请输入充值金额',
                },
                {
                  pattern: /^(\d+)$/,
                  message: '充值金额必须是整数',
                },
                {
                  validator(rule, value, callback) {
                    if (value.valueOf() < 1) callback('充值金额不能小于1元');
                    else callback();
                  },
                },
              ],
            })(<Input prefix="￥" placeholder="请输入充值金额" maxLength="3" />)}
          </Form.Item>
          <Form.Item {...formItemLayout} label="支付方式">
            {getFieldDecorator('type', {
              initialValue: 1,
              rules: [{ required: true, message: '支付方式必选' }],
            })(
              <Radio.Group>
                <Radio value={1}>微信支付</Radio>
                <Radio value={2} disabled>支付宝</Radio>
                <Radio value={3} disabled>校园卡电子账户</Radio>
              </Radio.Group>
            )}
          </Form.Item>
          <Form.Item
            wrapperCol={{
              xs: { span: 24, offset: 0 },
              sm: {
                span: formItemLayout.wrapperCol.span,
                offset: formItemLayout.labelCol.span,
              },
            }}
          >
            <Button type="primary" htmlType="submit" loading={submitLoading} disabled={!isYuArea || isOffline}>
              支付
            </Button>
            <Button type="default" style={{ marginLeft: '12px' }} onClick={() => this.props.dispatch(routerRedux.push('/detail/pay'))}>
              充值记录
            </Button>
          </Form.Item>
        </Form>
        <Divider style={{ margin: '40px 0 24px' }} />
        <div className={styles.desc}>
          <h3>充值说明</h3>
          <h4>线上充值范围</h4>
          <p>目前余家头校区的宿舍支持在线充值，马房山校区的宿舍暂不支持需要前往线下充值点缴费。<a href="#">点击查看各个校区的线下充值点</a></p>
          <h4>充值后未成功下发电</h4>
          <p>请联系余家头校区管理委员会后勤办公室，电话：<a href="tel:027-86860918">027-86860918</a>。</p>
        </div>
      </Fragment>
    );
  }
}

export default connect(({ user, room, pay, loading }) => ({
  user,
  room: room,
  pay,
  submitLoading: loading.effects['pay/prepare'] || loading.effects['pay/ip'],
}))(ChargeForm);
