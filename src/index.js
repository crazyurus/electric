import dva from 'dva';
import { createBrowserHistory } from 'history';
import createLoading from 'dva-loading';
import 'moment/locale/zh-cn';
import './index.less';

const app = dva({
  history: createBrowserHistory({
    basename: '/',
  }),
});

app.use(createLoading());
app.model(require('./models/global').default);
app.router(require('./router').default);
app.start('#app');

export default app._store;
