<template>
  <van-page>
    <van-nav-bar title="More features" />
    <van-cell-group>
      <van-cell
        v-for="(item, index) in features"
        :key="index"
        :title="item.title"
        :icon="item.icon"
        is-link
        @click="navigateTo(item.url)"
      />
    </van-cell-group>
  </van-page>
  <TabBar />
</template>

<script setup>
import { useRouter } from 'vue-router';
import TabBar from '@/components/TabBar.vue';

const router = useRouter();

const features = [
  {
    title: 'RSA Signature',
    icon: 'edit', // 使用 vant 内置的锁图标
    url: '/sign',
  },
  {
    title: 'Guichat',
    icon: 'chat-o', // 使用 vant 内置的好友图标
    url: 'http://www.guichat.xyz', // 外部链接
  },
  {
    title: 'LookOutward (Web3 Solution)',
    icon: 'eye-o', // 使用 vant 内置的好友图标
    url: 'http://www.lookoutward.xyz', // 外部链接
  },
  {
    title: 'Donate',
    icon: 'balance-o', // 使用 vant 内置的好友图标
    url: 'http://www.lookoutward.xyz/#/pay', // 外部链接
  },
];

// 导航函数
const navigateTo = (url) => {
  // 检查是否为外部链接
  if (url.startsWith('http')) {
    window.location.href = url;
  } else {
    router.push(url);
  }
};
</script>

<style scoped>
.page-bd {
  padding: 16px;
}
</style>
