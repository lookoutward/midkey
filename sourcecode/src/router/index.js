import { createRouter, createWebHashHistory } from 'vue-router'; // 引入 createWebHashHistory
import AboutPage from '../views/AboutPage.vue';
import PayPage from '../views/PayPage.vue';
import HashPage from '../views/HashPage.vue';
import DhkePage from '../views/DhkePage.vue';
import RsaPage from '../views/RsaPage.vue';
import SignPage from '../views/SignPage.vue';
import ShamirPage from '../views/ShamirPage.vue'; 
import AesPage from '../views/AesPage.vue'; 
import MorePage from '../views/MorePage.vue'; 

const routes = [
  {
    path: '/pay',
    name: 'PayPage',
    component: PayPage,
    meta: { title: 'midkey' } // 统一标题
  },
  {
    path: '/about',
    name: 'AboutPage',
    component: AboutPage,
    meta: { title: 'midkey' } // 统一标题
  },
  {
    path: '/hash',
    name: 'HashPage',
    component: HashPage,
    meta: { title: 'midkey' } // 统一标题
  },
  {
    path: '/dhke',
    name: 'DhkePage',
    component: DhkePage,
    meta: { title: 'midkey' } // 统一标题
  },
  {
    path: '/rsa',
    name: 'RsaPage',
    component: RsaPage,
    meta: { title: 'midkey' } // 统一标题
  },
  {
    path: '/sign',
    name: 'SignPage',
    component: SignPage,
    meta: { title: 'midkey' } // 统一标题
  },
  {
    path: '/shamir',
    name: 'ShamirPage',
    component: ShamirPage,
    meta: { title: 'midkey' } // 统一标题
  },
  {
    path: '/',
    name: 'AesPage',
    component: AesPage,
    meta: { title: 'midkey' } // 统一标题
  },
  {
    path: '/more',
    name: 'MorePage',
    component: MorePage,
    meta: { title: 'midkey' } // 统一标题
  }
];

const router = createRouter({
  history: createWebHashHistory(), // 使用 createWebHashHistory
  routes
});

export default router;
