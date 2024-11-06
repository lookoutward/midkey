<template>
  <van-page>
    <van-nav-bar title="AES256" />

    <div class="button-area">
      <van-button type="primary" @click="encrypt">Encrypt</van-button>
    </div>

    <van-field v-model="encryptInput" label="Plaintext" type="textarea" rows="5"
      placeholder="When encrypting, enter the plaintext, and when decrypting, display the plaintext">
      <template #button>
        <van-button size="mini" @click="copyPlaintextToClipboard">Copy</van-button>
      </template>
    </van-field>

    <van-field v-model="keyInput" label="Key" type="textarea" rows="2" placeholder="Enter the key" />

    <van-field v-model="decryptInput" label="Ciphertext" type="textarea" rows="5"
      placeholder="When encrypting, display the ciphertext, and when decrypting, enter the ciphertext">
      <template #button>
        <van-button size="mini" @click="copyCiphertextToClipboard">Copy</van-button>
      </template>
    </van-field>

    <div class="button-area">
      <van-button type="primary" @click="decrypt">Decrypt</van-button>
    </div>


    <van-cell>
      <div style="width: 100%;">
        <span style="font-weight: bold;">Use cases of AES256:</span>
        <div class="use-cases">
          1. Encrypting very long texts.<br />
          2. Encrypting and decrypting using the same key.
        </div>
      </div>
    </van-cell>

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
import { ref } from 'vue';
import CryptoJS from 'crypto-js';
import { Toast } from 'vant';
import TabBar from '@/components/TabBar.vue'; // 确保路径正确

export default {
  components: {
    TabBar, // 确保 TabBar 组件被注册
  },
  setup() {
    const encryptInput = ref('');
    const keyInput = ref('');
    const decryptInput = ref('');

    const encrypt = () => {
      const plaintext = encryptInput.value;
      const key = keyInput.value;
      const encrypted = CryptoJS.AES.encrypt(plaintext, key, { keySize: 256 / 32 }).toString();
      decryptInput.value = encrypted;
    };

    const decrypt = () => {
      const ciphertext = decryptInput.value;
      const key = keyInput.value;
      const bytes = CryptoJS.AES.decrypt(ciphertext, key, { keySize: 256 / 32 });
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);
      encryptInput.value = decrypted;
    };

    const copyToClipboard = (text) => {
      const dummy = document.createElement('textarea');
      document.body.appendChild(dummy);
      dummy.value = text;
      dummy.select();
      document.execCommand('copy');
      document.body.removeChild(dummy);
    };

    const copyPlaintextToClipboard = () => {
      copyToClipboard(encryptInput.value);
      Toast('The plaintext has been copied');

    };

    const copyCiphertextToClipboard = () => {
      copyToClipboard(decryptInput.value);
      Toast('The ciphertext has been copied');

    };

    return {
      encryptInput,
      keyInput,
      decryptInput,
      encrypt,
      decrypt,
      copyPlaintextToClipboard,
      copyCiphertextToClipboard,
    };
  },
};
</script>

<style scoped>
.container {
  padding: 16px;
}

.button-area {
  display: flex;
  justify-content: center;
  /* 水平居中对齐 */
  margin-bottom: 16px;
}

.use-cases {
  margin-top: 16px;
  font-size: 14px;
}
</style>
