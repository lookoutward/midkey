<template>
  <div class="container">
    <van-nav-bar title="About" />

    <div class="content">
      <div>
        <div><strong>LookOutward: Unlocking the Potential of Web3.</strong></div>
        <div>&nbsp;</div>

        <div>
          Web3, or "Web 3.0," represents the next phase in the evolution of the internet, aimed at enhancing user control and data privacy through decentralized technologies. Unlike the traditional Web 2.0 model, Web3 leverages blockchain technology and smart contracts, enabling users to interact directly with applications without intermediaries. This decentralized structure empowers users to own their data, conduct trustless transactions, and participate in the ecosystem of digital assets and cryptocurrencies.        </div>
        <div>&nbsp;</div>

        <div>
          Web3 also emphasizes the importance of community and user participation, encouraging users to have voting and decision-making power on platforms. Through emerging concepts like decentralized finance (DeFi), non-fungible tokens (NFTs), and decentralized applications (dApps), Web3 has the potential to reshape the digital economy, offering a more equitable, transparent, and efficient online experience. As technology evolves, Web3 could become the foundation of the future internet, driving digital progress toward a more autonomous and open direction.        </div>
    
      <div>&nbsp;</div>
      <div>&nbsp;</div>
      <div>&nbsp;</div>
      <div>&nbsp;</div>
      <div>&nbsp;</div>
      <div>&nbsp;</div>
      <div>&nbsp;</div>
    </div>

    
    </div>




    <TabBar />
  </div>
</template>

<script>
import TabBar from '@/components/TabBar.vue'; // 确保路径正确

export default {
  components: {
    TabBar, // 确保 TabBar 组件被注册
  },
}
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px;
  overflow-y: auto; /* 添加滚动条支持，防止内容溢出 */
}
</style>
