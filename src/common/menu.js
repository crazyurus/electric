import { isUrl } from '../utils/utils';

const menuData = [
  {
    name: '概况',
    icon: 'dashboard',
    path: 'detail/index',
    authority: ['user'],
  },
  {
    name: '充值',
    icon: 'pay-circle',
    path: 'charge',
    redirect: 'charge/index',
    authority: ['user'],
  },
  {
    name: '停电通知',
    icon: 'profile',
    path: 'notice',
    redirect: 'notice/list',
    authority: ['user'],
  },
  {
    name: '选择宿舍',
    icon: 'cloud',
    path: 'index/choose',
    authority: ['guest'],
  },
  {
    name: '帮助建议',
    icon: 'question-circle',
    path: 'feedback',
    authority: ['user', 'guest'],
  },
  {
    name: '更换宿舍',
    icon: 'cloud',
    path: 'index/choose',
    authority: ['user'],
  },
];

function formatter(data, parentPath = '/', parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority,
    };
    if (item.children) {
      result.children = formatter(item.children, `${parentPath}${item.path}/`, item.authority);
    }
    return result;
  });
}

export const getMenuData = () => formatter(menuData);
