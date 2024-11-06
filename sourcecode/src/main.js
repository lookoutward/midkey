import { createApp } from 'vue';
import App from './App.vue';
import 'vant/lib/index.css'; // 引入样式
import { Button, NavBar, Cell, CellGroup, Field, Picker } from 'vant'; // 引入需要的组件
import router from './router';

const app = createApp(App);

// 注册组件
app.use(Button);
app.use(NavBar);
app.use(Cell);
app.use(CellGroup);
app.use(Field);
app.use(Picker);

// 使用路由
app.use(router);

// 挂载应用
app.mount('#app');



  router.beforeEach((to) => {
    // 设置标题
    document.title = to.meta.title || 'Midkey';
  
    // 设置 favicon
    if (to.meta.favicon) {
      const link = document.querySelector("link[rel*='icon']");
      if (link) {
        link.href = to.meta.favicon;
      }
    }
  });
  