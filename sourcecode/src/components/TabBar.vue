<template>
  <van-tabbar>
    <router-link to="/" class="tabbar-link">
      <van-tabbar-item icon="home-o">Aes</van-tabbar-item>
    </router-link>

    <router-link to="/dhke" class="tabbar-link">
      <van-tabbar-item icon="shield-o">Dhke</van-tabbar-item>
    </router-link>

    <router-link to="/rsa" class="tabbar-link">
      <van-tabbar-item icon="sign">Rsa</van-tabbar-item>
    </router-link>

    <router-link to="/hash" class="tabbar-link">
      <van-tabbar-item icon="notes-o">Hash</van-tabbar-item>
    </router-link>

    <router-link to="/more" class="tabbar-link">
      <van-tabbar-item icon="more-o">More</van-tabbar-item>
    </router-link>
  </van-tabbar>
</template>




<script>
import { Tabbar, TabbarItem } from 'vant';

export default {
  name: 'TabBar',
  components: {
    'van-tabbar': Tabbar,
    'van-tabbar-item': TabbarItem,
  }
}
</script>



<style scoped>
.van-tabbar {
  position: fixed; /* 确保它固定在底部 */
  bottom: 0; /* 距离底部为0 */
  width: 100%; /* 确保宽度为100% */
  background-color: #fff; /* 设置背景色以确保可见 */
  box-shadow: 0 -2px 8px rgba(0, 0, 0, 0.1); /* 可选：添加阴影效果 */
}



/* 确保 TabBar 项目横向排列 */
.tabbar-link {
  display: flex; /* 使其支持 Flexbox */
  justify-content: center; /* 居中对齐 */
  align-items: center; /*垂直居中对齐*/
  flex: 1; /* 让每个 tabbar 项目平分空间 */
}
</style>
