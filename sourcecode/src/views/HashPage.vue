<template>

  <van-page>
    <van-nav-bar title="Hash SHA-3 256-bit" />
    <van-cell-group>
      <!-- Input text -->
      <van-field v-model="input" label="Text" placeholder="Enter text to hash..." rows="5" type="textarea" />

      <!-- Input hash salt -->
      <van-field v-model="salt" label="Hash Salt" placeholder="Enter random string (optional)" type="textarea" />

      <!-- Calculate hash button -->
      <!-- 使用 Flexbox 容器保持按钮的上下位置不变并水平居中 -->
      <div class="button-container">
        <van-button type="primary" @click="calculateHash">Calculate Hash</van-button>
      </div>
      <!-- Display input text and hash -->
      <van-field v-model="inputAndSalt" label="Input + Salt" type="textarea" readonly>
        <template #button>
          <van-button size="mini" @click="copyTextToClipboard">Copy Text</van-button>
        </template>
      </van-field>

      <van-field v-model="hash" label="Hash Value" type="textarea" readonly>
        <template #button>
          <van-button size="mini" @click="copyHashToClipboard">Copy Hash</van-button>
        </template>
      </van-field>
    </van-cell-group>

    <van-divider />

    <!-- Scene description -->

    <van-cell>
      <div style="width: 100%;">
        <span style="font-weight: bold;">Use Cases of Hash</span>
        <div class="use-cases">
          1. Converting text of any length into a fixed-length string;<br />
          2. For prediction games, generate a hash for each person’s prediction and publish it in advance. After the
          event, reveal the predictions.
        </div>
      </div>
    </van-cell>


    <van-divider />

  </van-page>
  <div>&nbsp;</div>
  <div>&nbsp;</div>
  <div>&nbsp;</div>
  <div>&nbsp;</div>
  <div>&nbsp;</div>
  <div>&nbsp;</div>
  <div>&nbsp;</div>

  <TabBar />

</template>


<script>
import { ref, onMounted } from 'vue';
import TabBar from '@/components/TabBar.vue'; // 确保路径正确

export default {
  name: 'HashPage',
  components: {
    TabBar, // 确保 TabBar 组件被注册
  },
  setup() {
    const input = ref('');
    const salt = ref('');
    const inputAndSalt = ref('');
    const hash = ref('');
    let sha3_256; // 用于存储 sha3_256 函数

    const calculateHash = () => {
      if (!sha3_256) {
        alert('SHA-3库未加载，请稍后再试。');
        return;
      }
      inputAndSalt.value = input.value.trim() + salt.value.trim();
      hash.value = sha3_256(inputAndSalt.value);
    };

    const copyTextToClipboard = () => {
      navigator.clipboard.writeText(inputAndSalt.value).then(() => {
        alert('Text copied');
      });
    };

    const copyHashToClipboard = () => {
      navigator.clipboard.writeText(hash.value).then(() => {
        alert('Hash copied');
      });
    };

    // 在组件挂载时加载外部库
    onMounted(() => {
      const script = document.createElement("script");
      script.src = "https://cdn.jsdelivr.net/npm/js-sha3@0.8.0/src/sha3.min.js";
      script.async = true;
      script.onload = () => {
        sha3_256 = window.sha3_256; // 确保在库加载后引用函数
      };
      document.head.appendChild(script);
    });

    return {
      input,
      salt,
      inputAndSalt,
      hash,
      calculateHash,
      copyTextToClipboard,
      copyHashToClipboard,
    };
  },
};
</script>


<style scoped>
.van-page {
  padding: 16px;
}

.use-cases {
  text-align: left;
  /* Align text to the left */
}
</style>
