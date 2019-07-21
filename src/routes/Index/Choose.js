import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { routerRedux } from 'dva/router';
import { Form, Select, Cascader, Button, Card, message } from 'antd';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import request from '../../utils/request';

const { Option, OptGroup } = Select;

@connect(({ user, room, loading }) => ({
  user,
  room,
  submitLoading: loading.effects['room/register'],
}))
@Form.create()
export default class ChooseForm extends PureComponent {
  static transMeterName(arc) {
    switch (arc) {
      case '学海15栋':
        return '学海G栋/西15栋';
      case '学海16栋':
        return '学海F栋/西16栋';
      case '学海17栋':
        return '学海D栋/西17栋';
      case '学海18栋':
        return '学海E栋/西18栋';
      case '学海19栋':
        return '学海C栋/西19栋';
      case '学海20栋':
        return '学海B栋/西20栋';
      case '学海21栋':
        return '学海A栋/西21栋';
      default:
        return arc;
    }
  }

  state = {
    data: [],
    select: {
      area: 0,
      meter: '',
    },
  };

  getChooseInfo = (api, id) => {
    return request('api.wutnews.net', '/choose/' + api, {
      method: 'POST',
      body: {
        id,
        area: this.state.select.area,
      },
    });
  };

  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll(err => {
      if (!err) {
        this.props
          .dispatch({
            type: 'room/register',
            payload: this.state.select,
          })
          .then(res => {
            this.props.dispatch({
              type: 'room/reset',
            });
            if (res.errCode === 0) this.props.dispatch(routerRedux.push('/detail/index'));
            else message.error('选择宿舍失败，请稍后再试');
          });
      }
    });
  };

  changeAreaPicker = value => {
    const area = value.includes('余区') ? 7 : Number.parseInt(value.split('*')[0], 10);
    this.state.select.area = area;
    this.getChooseInfo('architecture', value).then(res => {
      this.setState({
        select: { area },
        data: res.data.map(item => ({
          id: item.id,
          type: 'architecture',
          name: ChooseForm.transMeterName(item.name),
          isLeaf: false,
        })),
      });
    });
  };

  changeMeterPicker = value => {
    const meter = value[value.length - 1];
    this.setState({
      select: Object.assign({}, this.state.select, { meter }),
    });
  };

  changeCascader = selectedOptions => {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    const childType = targetOption.type === 'architecture' ? 'floor' : 'meter';
    targetOption.loading = true;

    this.getChooseInfo(childType, targetOption.id).then(res => {
      let { data } = res;

      if (childType !== 'meter') {
        data = data.map(item => ({
          id: item.id,
          name: item.name,
          type: childType,
          isLeaf: false,
        }));
      }

      targetOption.loading = false;
      targetOption.children = data;

      this.setState({
        data: [...this.state.data],
      });
    });
  };

  render() {
    const { submitLoading } = this.props;
    const { getFieldDecorator } = this.props.form;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const submitFormLayout = {
      wrapperCol: {
        xs: { span: 24, offset: 0 },
        sm: { span: 10, offset: 7 },
      },
    };

    const { current: currentUser, authority: currentAuthority } = this.props.user;

    return (
      <PageHeaderLayout
        title="宿舍"
        content={
          (currentAuthority === 'anonymous' ? `来自${currentUser.name}的` : currentUser.name) +
          '同学你好，请选择你的宿舍'
        }
      >
        <Card bordered={false}>
          <Form onSubmit={this.handleSubmit} hideRequiredMark style={{ marginTop: 8 }}>
            <Form.Item {...formItemLayout} label="校区">
              {getFieldDecorator('title', {
                rules: [
                  {
                    required: true,
                    message: '请选择校区',
                  },
                ],
              })(
                <Select
                  placeholder="请选择校区"
                  style={{ width: '100%' }}
                  onChange={this.changeAreaPicker}
                >
                  <OptGroup label="马房山校区">
                    <Option value="1*Area*南湖">南湖</Option>
                    <Option value="2*Area*东院">东院</Option>
                    <Option value="3*Area*西院">西院</Option>
                    <Option value="3*Area*鉴湖">鉴湖</Option>
                    <Option value="0*Area*升升" disabled>
                      升升公寓
                    </Option>
                  </OptGroup>
                  <OptGroup label="余家头校区">
                    <Option value="1*Area*余区">余区</Option>
                  </OptGroup>
                </Select>
              )}
            </Form.Item>
            <Form.Item {...formItemLayout} label="宿舍" extra="暂不支持升升公寓的电费查询">
              {getFieldDecorator('date', {
                rules: [
                  {
                    required: true,
                    message: '请选择宿舍',
                  },
                ],
              })(
                <Cascader
                  disabled={this.state.data.length === 0}
                  placeholder="请选择宿舍"
                  options={this.state.data}
                  loadData={this.changeCascader}
                  onChange={this.changeMeterPicker}
                  filedNames={{ label: 'name', value: 'id' }}
                />
              )}
            </Form.Item>
            <Form.Item {...submitFormLayout} style={{ marginTop: 32 }}>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitLoading}
                disabled={!this.state.select.area || !this.state.select.meter}
              >
                查询
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </PageHeaderLayout>
    );
  }
}
