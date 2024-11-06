<template>
  <van-page>
    <van-nav-bar title="Diffie–Hellman key exchange" />

  <div>
    <van-field v-model="privateKeyA" label="Private Key A" rows="2" type="textarea"
      placeholder="Please enter the private key">
      <template #button>
        <van-button size="mini" @click="copyPrivateKeyA">Copy</van-button>
      </template>
    </van-field>

    <van-field v-model="publicKeyA" label="Public Key A" rows="2" type="textarea"
      placeholder="Please enter the public key">
      <template #button>
        <van-button size="mini" @click="copyPublicKeyA">Copy</van-button>
      </template>
    </van-field>

    <!-- 使用 Flexbox 容器保持按钮的上下位置不变并水平居中 -->
    <div class="button-container">
      <van-button type="primary" @click="generateKeys">Generate Key Pair</van-button>
    </div>

    <van-field v-model="publicKeyB" label="Other Party's Public Key" rows="2" type="textarea"
      placeholder="Please enter the other party's public key">
      <template #button>
        <van-button size="mini" @click="copyPublicKeyB">Copy</van-button>
      </template>
    </van-field>

    <van-field v-model="sharedSecret" label="Shared Key" rows="2" type="textarea" readonly placeholder="Shared key">
      <template #button>
        <van-button size="mini" @click="copySharedSecret">Copy</van-button>
      </template>
    </van-field>

    <!-- 使用 Flexbox 容器保持按钮的上下位置不变并水平居中 -->
    <div class="button-container">
      <van-button type="primary" @click="calculateSharedSecret">Calculate the Shared Key</van-button>
    </div>
  </div>

  <van-cell>
      <div style="width: 100%;">
        <span style="font-weight: bold;">Use cases of Dhke:</span>
        <div class="use-cases">
          1. Secure communication: In network communication, two communicating parties can use the DH algorithm to generate a shared key, which is used for encryption and decryption in subsequent communication processes, ensuring the confidentiality of the communication.<br />
2. Party A generates a public-private key pair and sends its public key to party B. Similarly, party B generates a public-private key pair and sends its public key to party A.<br />
3. Each party calculates the shared key using their own public-private key pair and the other party's public key. The calculation result should be the same for both parties.
<br />
          
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
import { Toast } from 'vant'; // 确保 Toast 组件已经导入
import BN from 'bn.js';
import TabBar from '@/components/TabBar.vue'; // 确保路径正确

export default {
  components: {
    TabBar, // 确保 TabBar 组件被注册
  },
  setup() {
    // 定义响应式变量
    const privateKeyA = ref('');
    const publicKeyA = ref('');
    const publicKeyB = ref('');
    const sharedSecret = ref('');
    const p = new BN('114179812305190573251285406962627163971195067122210512231600037100200647772758065447574577201147959');
    const g = new BN('2');

    // 生成密钥对
    const generateKeys = () => {
      const a = new BN(crypto.getRandomValues(new Uint8Array(32)), 'hex'); 
      const A = g.toRed(BN.red(p)).redPow(a);

      privateKeyA.value = a.toString('hex');
      publicKeyA.value = A.toString('hex');
    };

    // 计算共享密钥
    const calculateSharedSecret = () => {
      const a = new BN(privateKeyA.value, 'hex');
      const B = new BN(publicKeyB.value, 'hex');

      const sharedKey = B.toRed(BN.red(p)).redPow(a).fromRed();
      sharedSecret.value = sharedKey.toString('hex');
    };

    // 复制到剪贴板
    const copyToClipboard = async (text) => {
      try {
        await navigator.clipboard.writeText(text);
        Toast('Copied to clipboard');
      } catch (err) {
        Toast('Failed to copy');
      }
    };

    // 复制私钥、公钥和共享密钥
    const copyPrivateKeyA = () => copyToClipboard(privateKeyA.value);
    const copyPublicKeyA = () => copyToClipboard(publicKeyA.value);
    const copyPublicKeyB = () => copyToClipboard(publicKeyB.value);
    const copySharedSecret = () => copyToClipboard(sharedSecret.value);

    return {
      privateKeyA,
      publicKeyA,
      publicKeyB,
      sharedSecret,
      generateKeys,
      calculateSharedSecret,
      copyPrivateKeyA,
      copyPublicKeyA,
      copyPublicKeyB,
      copySharedSecret,
    };
  },
};
</script>

<style>
.button-container {
  display: flex; /* 使用 Flexbox 布局 */
  justify-content: center; /* 水平居中 */
  margin: 20px 0; /* 上下间距 */
}
</style>
