import Mock from 'mockjs';

Mock.setup({
  timeout: '300-800',
});

Mock.mock('/electric/api/user', 'get', require('./api/user.json'));
Mock.mock('/electric/api/room', 'get', require('./api/room.json'));

Mock.mock('/electric/info/detail', 'get', require('./info/detail.json'));
Mock.mock('/electric/info/day', 'get', require('./info/day.json'));
Mock.mock('/electric/info/update', 'get', require('./info/update.json'));
Mock.mock('/electric/info/pay', 'get', require('./info/pay.json'));

Mock.mock('/electric/choose/architecture', 'post', require('./choose/architecture.json'));
Mock.mock('/electric/choose/floor', 'post', require('./choose/floor.json'));
Mock.mock('/electric/choose/meter', 'post', require('./choose/meter.json'));

Mock.mock('/electric/login/register', 'put', require('./login/register.json'));

Mock.mock('/electric/pay/prepare', 'post', require('./pay/prepare.json'));
Mock.mock('/electric/pay/check', 'post', require('./pay/check.json'));
Mock.mock('/electric/pay/cwsf', 'post', require('./pay/cwsf.json'));

Mock.mock('/electric/notice/list', 'get', require('./notice/list.json'));
Mock.mock('/electric/notice/content', 'get', require('./notice/content.json'));