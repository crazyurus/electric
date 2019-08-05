import DetailPage from './pages/detail/index';
import PayRecordPage from './pages/charge/record';
import DayRecordPage from './pages/detail/everyday';
import ChoosePage from './pages/index/choose';
import NoticeListPage from './pages/notice/list';
import NoticeDetailPage from './pages/notice/detail';
import ChargePage from './pages/charge/index';
import MapPage from './pages/charge/map';
import FeedbackPage from './pages/feedback/index';

export default [
  {
    path: '/index/choose',
    component: ChoosePage
  },
  {
    path: '/detail/index',
    component: DetailPage
  },
  {
    path: '/detail/everyday',
    component: DayRecordPage
  },
  {
    path: '/notice/list',
    component: NoticeListPage
  },
  {
    path: '/notice/detail/:link',
    component: NoticeDetailPage
  },
  {
    path: '/charge/index',
    component: ChargePage
  },
  {
    path: '/charge/record',
    component: PayRecordPage
  },
  {
    path: '/charge/map/:latitude/:longitude/:title/:address/:telephone',
    component: MapPage
  },
  {
    path: '/feedback',
    component: FeedbackPage
  }
];
