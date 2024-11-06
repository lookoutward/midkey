<template>
  <van-page>
    <van-nav-bar title="Shamir Secret Sharing" />
    <van-cell-group>
      <van-cell>
        <van-field
          v-model="secret"
          placeholder="Enter the secret; when synthesizing, the secret will be displayed"
          type="textarea"
        >
          <template #button>
            <van-button size="mini" @click="copyToClipboard(secret)">Copy</van-button>
          </template>
        </van-field>
      </van-cell>

      <van-cell>
        <van-picker
          v-model="threshold"
          :columns="thresholdOptions"
          @confirm="onThresholdConfirm"
          @cancel="onThresholdCancel"
          :show-toolbar="true"
        >
          <template #default>
            <van-cell-title>Choose Threshold</van-cell-title>
          </template>
        </van-picker>
      </van-cell>

      <!-- Centered Buttons -->
      <div class="button-container">
        <van-button type="primary" @click="generateKeys">Decompose Secret</van-button>
      </div>

      <van-divider />

      <van-cell-group>
        <van-cell v-for="(subKey, index) in subKeys" :key="index">
          <van-field
            v-model="subKeys[index]"
            placeholder="Please enter the sub-secret"
            type="textarea"
          >
            <template #button>
              <van-button size="mini" @click="copySubKeyToClipboard(index)">Copy</van-button>
            </template>
          </van-field>
        </van-cell>
      </van-cell-group>
    </van-cell-group>

    <div class="button-container">
      <van-button type="primary" @click="combineKeys">Synthesize Secret</van-button>
    </div>

    <van-dialog
      v-model="secretDialogVisible"
      title="Secret"
      show-cancel-button
      @cancel="secretDialogVisible = false"
      @confirm="secretDialogVisible = false"
    >
      {{ secret }}
    </van-dialog>

    <van-toast />
  </van-page>
  <div>&nbsp;</div>
  <div>&nbsp;</div>
  <div>&nbsp;</div>
  <div>&nbsp;</div>
  <div>&nbsp;</div>
  <div>&nbsp;</div>
  <div>&nbsp;</div>


</template>

<script>
import { ref } from 'vue';
import { Toast } from 'vant';
import { split, combine } from 'shamirs-secret-sharing';

// Base64 编码和解码函数
const base64Encode = (str) => {
  return btoa(unescape(encodeURIComponent(str)));
};

const base64Decode = (str) => {
  return decodeURIComponent(escape(atob(str)));
};

export default {
  setup() {
    const secret = ref('');
    const threshold = ref(3);
    const subKeys = ref(Array(5).fill('')); // 初始时有 5 个子密钥
    const secretDialogVisible = ref(false);
    const thresholdOptions = ref([2, 3, 4]); // 使用 ref() 确保它是响应式的

    // 分解秘密
    const generateKeys = () => {
      if (!secret.value.trim()) {
        Toast('Please enter the secret！');
        return;
      }

      // 使用 shamirs-secret-sharing 库的 split 函数分解秘密
      const shares = split(base64Encode(secret.value), { shares: 5, threshold: threshold.value });
      subKeys.value = shares.map(share => base64Encode(share)); // 对每个子密钥进行 Base64 编码
      Toast('The secret has been successfully decomposed!'); // 提示成功分解
    };

    // 合成秘密
    const combineKeys = () => {
      const sharesArray = subKeys.value.filter(val => val !== "").map(share => base64Decode(share)); // 对输入的子密钥进行解码

      if (sharesArray.length < threshold.value) {
        Toast('The number of sub-secrets does not reach the threshold！');
        return;
      }

      // 只选择足够的子密钥进行合成
      const requiredShares = sharesArray.slice(0, threshold.value);

      try {
        const secretKey = combine(requiredShares);
        secret.value = base64Decode(secretKey); // 对合成的密钥进行解码
        secretDialogVisible.value = true; // 显示合成后的秘密
        Toast('The secret has been successfully synthesized！');
      } catch (error) {
        console.error("An error occurred: " + error.message);
        Toast('Failed to reconstruct the secret, number of sub-secrets did not meet the threshold！');
      }
    };

    // 复制到剪贴板
    const copyToClipboard = (text) => {
      const dummy = document.createElement("textarea");
      document.body.appendChild(dummy);
      dummy.value = text;
      dummy.select();
      document.execCommand("copy");
      document.body.removeChild(dummy);
    };

    const copySubKeyToClipboard = (index) => {
      copyToClipboard(subKeys.value[index]);
      Toast(`The sub-secret ${index + 1} has been copied`);
    };

    const onThresholdConfirm = (value) => {
      threshold.value = value;
    };

    const onThresholdCancel = () => {
      // 处理取消逻辑，如果需要的话
    };

    return {
      secret,
      threshold,
      subKeys,
      generateKeys,
      combineKeys,
      copySubKeyToClipboard,
      secretDialogVisible,
      thresholdOptions,
      onThresholdConfirm,
      onThresholdCancel,
      copyToClipboard
    };
  }
};
</script>

<style scoped>
.button-container {
  display: flex;
  justify-content: center; /* 水平居中 */
  margin: 20px 0; /* 上下间距 */
}

.button-container .van-button {
  margin: 0 10px; /* 按钮之间的水平间距 */
}
</style>
