import Mock from 'mockjs';
import APIUser from './api/user.json';
import APIRoom from './api/room.json';
import InfoDetail from './info/detail.json';
import InfoDay from './info/day.json';
import InfoUpdate from './info/update.json';
import InfoPay from './info/pay.json';
import ChooseArchitecture from './choose/architecture.json';
import ChooseFloor from './choose/floor.json';
import ChooseMeter from './choose/meter.json';
import LoginRegister from './login/register.json';
import LoginLogout from './login/logout.json';
import PayPrepare from './pay/prepare.json';
import PayCheck from './pay/check.json';
import PayCWSF from './pay/cwsf.json';
import NoticeList from './notice/list.json';
import NoticeContent from './notice/content.json';

Mock.setup({
  timeout: '300-800',
});

Mock.mock('/electric/api/user', 'get', APIUser);
Mock.mock('/electric/api/room', 'get', APIRoom);

Mock.mock('/electric/info/detail', 'get', InfoDetail);
Mock.mock('/electric/info/day', 'get', InfoDay);
Mock.mock('/electric/info/update', 'get', InfoUpdate);
Mock.mock('/electric/info/pay', 'get', InfoPay);

Mock.mock('/electric/choose/architecture', 'post', ChooseArchitecture);
Mock.mock('/electric/choose/floor', 'post', ChooseFloor);
Mock.mock('/electric/choose/meter', 'post', ChooseMeter);

Mock.mock('/electric/login/register', 'put', LoginRegister);
Mock.mock('/electric/login/logout', 'post', LoginLogout);

Mock.mock('/electric/pay/prepare', 'post', PayPrepare);
Mock.mock('/electric/pay/check', 'post', PayCheck);
Mock.mock('/electric/pay/cwsf', 'post', PayCWSF);

Mock.mock('/electric/notice/list', 'get', NoticeList);
Mock.mock('/electric/notice/content', 'get', NoticeContent);