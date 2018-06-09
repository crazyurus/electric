import React, { PureComponent } from 'react';
import { Menu, Icon, Spin, Dropdown, Avatar, Divider, Tooltip, Popover } from 'antd';
import Debounce from 'lodash-decorators/debounce';
import { Link } from 'dva/router';
import styles from './index.less';

export default class GlobalHeader extends PureComponent {
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
  render() {
    const {
      currentUser = {},
      collapsed,
      isMobile,
      logo,
      onMenuClick,
    } = this.props;
    const menu = currentUser.sno === 'anonymous' ? '' : (
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
          <a
            target="_blank"
            href="/electric/api/logout"
            rel="noopener noreferrer"
          >
            <Icon type="logout" />退出登录
          </a>
        </Menu.Item>
      </Menu>
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
          <Popover placement="bottom" title={<center>微信扫一扫打开小程序</center>} content={<img src="//web.wutnews.net/Application/Electric/Assets/image/mina.jpg" style={{ width: '200px', height: '200px' }} />}>
            <a className={styles.action}><Icon type="wechat" /></a>
          </Popover>
          <Tooltip title="帮助建议">
            <a
              target="_blank"
              href="https://support.qq.com/product/23798"
              rel="noopener noreferrer"
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
