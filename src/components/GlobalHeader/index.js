import React, { PureComponent } from 'react';
import {
  Menu,
  Button,
  Icon,
  Spin,
  Dropdown,
  Avatar,
  Divider,
  Tooltip,
  Popover,
  Form,
  Switch,
  Slider,
} from 'antd';
import Debounce from 'lodash-decorators/debounce';
import { Link } from 'dva/router';
import styles from './index.less';

export default class GlobalHeader extends PureComponent {
  state = {
    showWarning: false,
    showSetting: false,
  };

  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }

  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };

  /* eslint-disable*/
  @Debounce(600)
  triggerResizeEvent() {
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }

  changeWarning = checked => {
    this.setState({
      showWarning: checked,
    });
  };

  changeSetting = value => {
    this.setState({
      showSetting: value,
    });
  };

  hideSetting = () => {
    this.changeSetting(false);
  };

  render() {
    const { currentUser = {}, collapsed, isMobile, logo, onMenuClick } = this.props;
    const menu =
      currentUser.sno === 'anonymous' ? (
        ''
      ) : (
        <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
          <Menu.Item>
            <a
              target="_blank"
              href="http://zhlgd.whut.edu.cn/tp_idc/idc?m=icdc"
              rel="noopener noreferrer"
            >
              <Icon type="user" />个人中心
            </a>
          </Menu.Item>
          <Menu.Item>
            <a
              target="_blank"
              href="http://zhlgd.whut.edu.cn/tp_up/view?m=up#act=sys/uacm/profile"
              rel="noopener noreferrer"
            >
              <Icon type="safety" />账户安全
            </a>
          </Menu.Item>
          <Menu.Divider />
          <Menu.Item key="logout">
            <a target="_blank" href="/electric/api/logout" rel="noopener noreferrer">
              <Icon type="logout" />退出登录
            </a>
          </Menu.Item>
        </Menu>
      );

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    const setting = (
      <Form style={{ width: '200px' }}>
        <Form.Item
          labelCol={{ span: 18 }}
          wrapperCol={{ span: 6 }}
          style={{ marginBottom: 0 }}
          label="剩余电量不足时提醒"
        >
          <Switch onChange={this.changeWarning} />
        </Form.Item>
        {this.state.showWarning && (
          <Form.Item
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            style={{ marginBottom: 0 }}
            label="警告值"
          >
            <Slider defaultValue={20} max={120} min={1} />
          </Form.Item>
        )}
        <Form.Item style={{ marginBottom: 0 }}>
          <Button
            type="primary"
            htmlType="submit"
            size="small"
            style={{ margin: '0 8px' }}
            onClick={this.hideSetting}
          >
            确定
          </Button>
          <Button type="default" size="small" onClick={this.hideSetting}>
            取消
          </Button>
        </Form.Item>
      </Form>
    );

    return (
      <div className={styles.header}>
        {isMobile && [
          <Link to="/" className={styles.logo} key="logo">
            <img src={logo} alt="logo" width="32" />
          </Link>,
          <Divider type="vertical" key="line" />,
        ]}
        <Icon
          className={styles.trigger}
          type={collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={this.toggle}
        />
        <div className={styles.right}>
          <Popover
            placement="bottom"
            title={<center>微信扫一扫打开小程序</center>}
            content={
              <img
                src="//web.wutnews.net/Application/Electric/Assets/image/mina.jpg"
                style={{ width: '200px', height: '200px' }}
              />
            }
          >
            <a className={styles.action}>
              <Icon type="wechat" />
            </a>
          </Popover>
          <Popover
            placement="bottom"
            title="设置"
            content={setting}
            visible={this.state.showSetting}
            trigger="click"
            onVisibleChange={this.changeSetting}
          >
            <Tooltip title="设置">
              <a className={styles.action}>
                <Icon type="setting" />
              </a>
            </Tooltip>
          </Popover>
          <Tooltip title="反馈">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://support.qq.com/product/23798"
              className={styles.action}
            >
              <Icon type="question-circle-o" />
            </a>
          </Tooltip>
          {currentUser.name ? (
            <Dropdown overlay={menu}>
              <span className={`${styles.action} ${styles.account}`}>
                <Avatar size="small" className={styles.avatar} src={currentUser.avatar} />
                <span className={styles.name}>{currentUser.name}</span>
              </span>
            </Dropdown>
          ) : (
            <Spin size="small" style={{ marginLeft: 8 }} />
          )}
        </div>
      </div>
    );
  }
}
