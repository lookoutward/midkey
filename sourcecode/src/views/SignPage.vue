<template>
  <van-page>
    <van-nav-bar title="RSA1024 Signature" />

    <div class="button-container">
      <van-button type="primary" @click="sign">Private Key Signature</van-button>
    </div>

    <van-cell-group>
      <van-field v-model="plaintext" label="Clear Text" type="textarea" placeholder="Clear text to be signed">
        <template #button>
          <van-button size="mini" @click="copyPlaintextToClipboard">Copy</van-button>
        </template>
      </van-field>
    </van-cell-group>

    <van-cell-group>
      <van-field v-model="signature" label="Signature Result" type="textarea" placeholder="Signature result">
        <template #button>
          <van-button size="mini" @click="copySignatureToClipboard">Copy</van-button>
        </template>
      </van-field>
    </van-cell-group>

    <div class="button-container">
      <van-button type="primary" @click="verify">Public Key Verification</van-button>
    </div>

    <van-divider />

    <van-cell-group>
      <van-field v-model="privateKey" label="Private Key" type="textarea" placeholder="Enter private key when signing">
        <template #button>
          <van-button size="mini" @click="copyPrivateKey">Copy</van-button>
        </template>
      </van-field>
    </van-cell-group>

    <van-cell-group>
      <van-field v-model="publicKey" label="Public Key" type="textarea" placeholder="Enter public key during verification">
        <template #button>
          <van-button size="mini" @click="copyPublicKey">Copy</van-button>
        </template>
      </van-field>
    </van-cell-group>

    <div class="button-container">
      <van-button type="primary" @click="generateKeyPair">Generate Key Pair</van-button>
    </div>

    <van-divider />

    <van-cell>
      <div class="usage-scenarios">
        <span class="bold">RSA Signature Usage Scenarios:</span>
        <div>
          1. Private key signature;<br />
          2. Public key verification.
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
import { Toast } from 'vant';
import { JSEncrypt } from 'jsencrypt';
import CryptoJS from 'crypto-js'; // 引入 CryptoJS
import TabBar from '@/components/TabBar.vue'; // 确保路径正确

export default {
  name: 'RsaSignaturePage',
  components: {
    TabBar, // 确保 TabBar 组件被注册
  },
  setup() {
    const plaintext = ref('');
    const signature = ref('');
    const privateKey = ref('');
    const publicKey = ref('');

    // Generate RSA key pair
    const generateKeyPair = () => {
      const encrypt = new JSEncrypt({ default_key_size: 1024 });
      privateKey.value = encrypt.getPrivateKey();
      publicKey.value = encrypt.getPublicKey();
      Toast('Key pair generated!');
    };

    // Sign plaintext
    const sign = () => {
      const encrypt = new JSEncrypt();
      encrypt.setPrivateKey(privateKey.value.trim());
      const hash = CryptoJS.SHA256(plaintext.value).toString(); // 计算 SHA256 哈希
      signature.value = encrypt.sign(hash, CryptoJS.SHA256, "sha256");
      console.log('Signature:', signature.value);
    };

    // Verify signature
    const verify = () => {
      const encrypt = new JSEncrypt();
      encrypt.setPublicKey(publicKey.value.trim());
      const hash = CryptoJS.SHA256(plaintext.value).toString(); // 计算 SHA256 哈希
      const isValid = encrypt.verify(hash, signature.value, CryptoJS.SHA256);
      console.log('Verification Result:', isValid);
      Toast(isValid ? 'Signature verified successfully' : 'Signature verification failed');
    };

    // Copy functions
    const copyToClipboard = (text) => {
      const dummy = document.createElement("textarea");
      document.body.appendChild(dummy);
      dummy.value = text;
      dummy.select();
      document.execCommand("copy");
      document.body.removeChild(dummy);
    };

    const copyPrivateKey = () => {
      copyToClipboard(privateKey.value);
      Toast('The private key has been copied');
    };

    const copyPublicKey = () => {
      copyToClipboard(publicKey.value);
      Toast('The public key has been copied');
    };

    const copyPlaintextToClipboard = () => {
      copyToClipboard(plaintext.value);
      Toast('The plaintext has been copied');
    };

    const copySignatureToClipboard = () => {
      copyToClipboard(signature.value);
      Toast('The signature has been copied');
    };

    return {
      plaintext,
      signature,
      privateKey,
      publicKey,
      generateKeyPair,
      sign,
      verify,
      copyPrivateKey,
      copyPublicKey,
      copyPlaintextToClipboard,
      copySignatureToClipboard,
    };
  },
};
</script>

<style scoped>
.van-page {
  padding: 16px;
}

.button-container {
  text-align: center;
  margin-bottom: 16px;
}

.usage-scenarios {
  width: 100%;
  text-align: left;
}

.bold {
  font-weight: bold;
}
</style>
