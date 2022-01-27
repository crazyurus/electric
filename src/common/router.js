import { createElement } from 'react';
import dynamic from 'dva/dynamic';
import pathToRegexp from 'path-to-regexp';
import { getMenuData } from './menu';

let routerDataCache;

const modelNotExisted = (app, model) =>
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf('/') + 1);
  });

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // () => require('module')
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf('.then(') < 0) {
    models.forEach(model => {
      if (modelNotExisted(app, model)) {
        // eslint-disable-next-line
        app.model(require(`../models/${model}`).default);
      }
    });
    return props => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache,
      });
    };
  }
  // () => import('module')
  return dynamic({
    app,
    models: () =>
      models.filter(model => modelNotExisted(app, model)).map(m => import(`../models/${m}.js`)),
    // add routerData prop
    component: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then(raw => {
        const Component = raw.default || raw;
        return props =>
          createElement(Component, {
            ...props,
            routerData: routerDataCache,
          });
      });
    },
  });
};

function getFlatMenuData(menus) {
  let keys = {};
  menus.forEach(item => {
    if (item.children) {
      keys[item.path] = { ...item };
      keys = { ...keys, ...getFlatMenuData(item.children) };
    } else {
      keys[item.path] = { ...item };
    }
  });
  return keys;
}

export const getRouterData = app => {
  const routerConfig = {
    '/': {
      component: dynamicWrapper(app, ['user', 'room'], () => import('../layouts/BasicLayout')),
    },
    '/detail/index': {
      name: '概况',
      component: dynamicWrapper(app, ['room'], () => import('../routes/Detail/Index')),
      authority: ['user'],
    },
    '/charge/record': {
      name: '充值记录',
      component: dynamicWrapper(app, [], () => import('../routes/Detail/Pay')),
      authority: ['user'],
    },
    '/notice/list': {
      name: '通知列表',
      component: dynamicWrapper(app, ['room', 'notice'], () => import('../routes/Notice/List')),
      authority: ['user'],
    },
    '/notice/detail/:link': {
      name: '通知详情',
      component: dynamicWrapper(app, ['notice'], () => import('../routes/Notice/Content')),
      authority: ['user'],
    },
    '/index/choose': {
      name: '选择宿舍',
      component: dynamicWrapper(app, ['user', 'room'], () => import('../routes/Index/Choose')),
      authority: ['user', 'guest'],
    },
    '/charge/index': {
      component: dynamicWrapper(app, ['pay'], () => import('../routes/Charge/Index')),
      authority: ['user'],
    },
    '/charge/index/form': {
      name: '填写充值信息',
      component: dynamicWrapper(app, ['pay', 'room', 'user'], () =>
        import('../routes/Charge/Step/Form')
      ),
      authority: ['user'],
    },
    '/charge/index/qrcode': {
      name: '扫码支付',
      component: dynamicWrapper(app, ['pay'], () => import('../routes/Charge/Step/Qrcode')),
      authority: ['user'],
    },
    '/charge/index/success': {
      name: '完成',
      component: dynamicWrapper(app, ['pay'], () => import('../routes/Charge/Step/Success')),
      authority: ['user'],
    },
    '/charge/map': {
      name: '线下充值点',
      component: dynamicWrapper(app, [], () => import('../routes/Charge/Map')),
      authority: ['user'],
    },
    '/feedback': {
      name: '帮助建议',
      component: dynamicWrapper(app, [], () => import('../routes/Feedback')),
      authority: ['user', 'guest'],
    },
    '/mobile': {
      name: '手机版',
      component: dynamicWrapper(app, [], () => import('../routes/Index/Mobile')),
      authority: ['user'],
    },
    '/exception/403': {
      component: dynamicWrapper(app, [], () => import('../routes/Exception/403')),
    },
  };

  const menuData = getFlatMenuData(getMenuData());
  const routerData = {};

  Object.keys(routerConfig).forEach(path => {
    const pathRegexp = pathToRegexp(path);
    const menuKey = Object.keys(menuData).find(key => pathRegexp.test(`${key}`));
    let menuItem = {};

    if (menuKey) {
      menuItem = menuData[menuKey];
    }
    let router = routerConfig[path];

    router = {
      ...router,
      name: router.name || menuItem.name,
      authority: router.authority || menuItem.authority,
      hideInBreadcrumb: router.hideInBreadcrumb || menuItem.hideInBreadcrumb,
    };
    routerData[path] = router;
  });
  return routerData;
};
