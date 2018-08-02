import React, { Fragment } from 'react';
import { connect } from 'dva';
import { Form, Input, Button, Radio, Divider, Alert, Menu, Dropdown } from 'antd';
import { routerRedux, Link } from 'dva/router';
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
        this.props
          .dispatch({
            type: 'pay/ip',
          })
          .then(ip => {
            return this.props.dispatch({
              type: 'pay/prepare',
              payload: {
                area: this.props.room.room.area,
                amount: values.amount,
                sno: this.props.currentUser.sno,
                meter: this.props.room.room.meter,
                type: 'NATIVE',
                ip,
              },
            });
          })
          .then(() => {
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
    const station = [
      {
        name: '南湖',
        position: [30.5125, 114.329079],
        telephone: '87756329',
        address: '后街医务室旁，北七宿舍对面',
      },
      {
        name: '西院/鉴湖',
        position: [30.513068, 114.343386],
        telephone: '87381736',
        address: '鉴湖主教学楼西侧',
      },
      {
        name: '东院',
        position: [30.521752, 114.351904],
        telephone: '87859134',
        address: '东院大门右侧',
      },
      {
        name: '余区',
        position: [30.607892, 114.357253],
        telephone: '86860918',
        address: '余27栋后勤办公室',
      },
      {
        name: '升升公寓',
        position: [30.50456, 114.344748],
        telephone: null,
        address: '物业办公楼一层',
      },
    ];

    const menu = (
      <Menu>
        {station.map(item => {
          const path = {
            pathname: '/charge/map',
            query: item,
          };
          return (
            <Menu.Item key={item.name}>
              <Link to={path}>{item.name}</Link>
            </Menu.Item>
          );
        })}
      </Menu>
    );

    return (
      <Fragment>
        <Form
          layout="horizontal"
          className={styles.stepForm}
          onSubmit={this.onValidateForm}
          hideRequiredMark
        >
          {isOffline ? (
            <Alert
              showIcon
              message="宿舍电表处于离线状态暂不支持在线充值"
              style={{ marginBottom: 24 }}
            />
          ) : (
            ''
          )}
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
                    if (Number.parseFloat(value) < 1) callback('充值金额不能小于1元');
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
              isYuArea ? (
                <Radio.Group>
                  <Radio value={1}>微信支付</Radio>
                  <Radio value={2} disabled>
                    支付宝
                  </Radio>
                  <Radio value={3} disabled>
                    校园卡电子账户
                  </Radio>
                </Radio.Group>
              ) : (
                <Radio.Group>
                  <Radio value={1}>收费平台支付</Radio>
                </Radio.Group>
              )
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
            {isYuArea ? (
              <Button type="primary" htmlType="submit" loading={submitLoading} disabled={isOffline}>
                支付
              </Button>
            ) : (
              <Button
                type="primary"
                htmlType="button"
                onClick={() => document.getElementById('cwsfForm').submit()}
              >
                前往收费平台
              </Button>
            )}
            <Button
              type="default"
              style={{ marginLeft: '12px' }}
              onClick={() => this.props.dispatch(routerRedux.push('/charge/record'))}
            >
              充值记录
            </Button>
          </Form.Item>
        </Form>
        {isYuArea ? null : (
          <div style={{ visibility: 'hidden' }}>
            <img alt="" src="http://cwsf.whut.edu.cn/casLogin" />
            <form
              id="cwsfForm"
              method="POST"
              action="http://cwsf.whut.edu.cn/elecPayprojectCreateOrder"
              target="_blank"
            >
              <input type="hidden" name="factorycode" value="E023" />
              <input type="hidden" name="roomno" value="学海20栋-409" />
              <input type="hidden" name="roomid" value="4511" />
              <input type="hidden" name="floor" value="4楼" />
              <input type="hidden" name="loudong" value="学海20栋" />
              <input type="hidden" name="payAmt" value="0.1" />
              <input type="hidden" name="payProjectId" value="6" />
              <input type="hidden" name="schoolid" value="3" />
              <input type="hidden" name="area" value="9002" />
            </form>
          </div>
        )}
        <Divider style={{ margin: '40px 0 24px' }} />
        <div className={styles.desc}>
          <h3>充值说明</h3>
          <h4>线上充值范围</h4>
          <p>
            目前余家头校区的宿舍支持在线微信充值，马房山校区的宿舍可在收费平台缴费或前往线下充值点。<Dropdown
              overlay={menu}
              trigger={['click']}
            >
              <a className="ant-dropdown-link">点击查看各个校区的线下充值点</a>
            </Dropdown>
            <br />人工窗口工作时间：周一到周五 8:00-11:30
            14:00-16:30；自助充值机充值时间：每日6:00-24:00。注意不可以跨校区充值。
          </p>
          <h4>充值后未成功下发电</h4>
          <p>
            马房山校区的同学请联系后勤保障处水电管理中心或线下充值点。<br />余家头校区的同学请联系余区管委会后勤办公室，电话：<a href="tel:027-86860918">
              027-86860918
            </a>。
          </p>
        </div>
      </Fragment>
    );
  }
}

export default connect(({ user, room, pay, loading }) => ({
  currentUser: user.current,
  room,
  pay,
  submitLoading: loading.effects['pay/prepare'] || loading.effects['pay/ip'],
}))(ChargeForm);
