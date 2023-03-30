import DetailPage from './pages/detail/index.vue';
import PayRecordPage from './pages/charge/record.vue';
import DayRecordPage from './pages/detail/everyday.vue';
import ChoosePage from './pages/index/choose.vue';
import NoticeListPage from './pages/notification/list.vue';
import NoticeDetailPage from './pages/notification/detail.vue';
import ChargePage from './pages/charge/index.vue';
import MapPage from './pages/charge/map.vue';
import FeedbackPage from './pages/feedback/index.vue';
import TipPage from './pages/charge/tip.vue';

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
    path: '/notification/list',
    component: NoticeListPage
  },
  {
    path: '/notification/detail/:link',
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
    path: '/charge/tip',
    component: TipPage
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
