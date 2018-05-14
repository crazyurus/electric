import DetailPage from './pages/detail/index'
import ChoosePage from './pages/index/choose'
import NoticeListPage from './pages/notice/list'
import NoticeDetailPage from './pages/notice/detail'

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
    path: '/notice/list',
    component: NoticeListPage
  },
  {
    path: '/notice/detail/:link',
    component: NoticeDetailPage
  }
]