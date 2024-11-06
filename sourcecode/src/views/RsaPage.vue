<template>
  <van-page>
    <van-nav-bar title="RSA1024" />

    <!-- Centered Public Key Encryption Button -->
    <div style="text-align: center; margin-bottom: 16px;">
      <van-button type="primary" @click="encrypt">Public Key Encryption</van-button>
    </div>

    <van-cell-group>
      <van-field v-model="plaintext" label="Plaintext" type="textarea"
        placeholder="Enter plaintext (max 100 characters)" maxlength="100">
        <template #button>
          <van-button size="mini" @click="copyPlaintextToClipboard">Copy</van-button>
        </template>
      </van-field>
    </van-cell-group>

    <van-cell-group>
      <van-field v-model="keyInput" label="Key" type="textarea"
        placeholder="Public key for encryption/Private key for decryption" />
    </van-cell-group>

    <van-cell-group>
      <van-field v-model="ciphertext" label="Ciphertext" type="textarea"
        placeholder="Display ciphertext or enter ciphertext for decryption">
        <template #button>
          <van-button size="mini" @click="copyCiphertextToClipboard">Copy</van-button>
        </template>
      </van-field>
    </van-cell-group>

    <!-- Centered Private Key Decryption Button -->
    <div style="text-align: center; margin-bottom: 16px;">
      <van-button type="primary" @click="decrypt">Private Key Decryption</van-button>
    </div>

    <van-divider />

    <van-cell-group>
      <van-cell>
        <van-field v-model="privateKey" label="Private Key" type="textarea" readonly>
          <template #button>
            <van-button size="mini" @click="copyPrivateKey">Copy</van-button>
          </template>
        </van-field>
      </van-cell>
      <van-cell>
        <van-field v-model="publicKey" label="Public Key" type="textarea" readonly>
          <template #button>
            <van-button size="mini" @click="copyPublicKey">Copy</van-button>
          </template>
        </van-field>
      </van-cell>
      <van-cell title="">
        <div style="margin-bottom: 8px;">
          <van-button type="primary" @click="generateKeyPair">Generate Key Pair</van-button>
        </div>
      </van-cell>      
    </van-cell-group>

    <van-divider />

    <van-cell>
      <div style="width: 100%;">
        <span style="font-weight: bold;">Use Cases of RSA</span>
        <div class="use-cases">
          1. Encrypting sensitive data such as keys.<br />
          2. Generating a key pair where the private key is kept secret and the public key is made public. Other parties
          can encrypt data using the public key, send the ciphertext to you, and then you can decrypt it using the private key.
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
import { ref } from 'vue';
import { Toast } from 'vant';
import { JSEncrypt } from 'jsencrypt'
import TabBar from '@/components/TabBar.vue'; // 确保路径正确

export default {
  name: 'RsaPage',
  components: {
    TabBar, // 确保 TabBar 组件被注册
  },

  setup() {
    const plaintext = ref('');
    const keyInput = ref('');
    const ciphertext = ref('');
    const privateKey = ref('');
    const publicKey = ref('');

    // Generate RSA key pair
    function generateKeyPair() {
      const crypt = new JSEncrypt({ default_key_size: 2048 });
      crypt.getKey();
      publicKey.value = crypt.getPublicKey();
      privateKey.value = crypt.getPrivateKey();
      Toast('Key pair generated!');
    }

    function setPublicKeyAndEncrypt(text) {
      const encrypt = new JSEncrypt();
      encrypt.setPublicKey(keyInput.value);
      return encrypt.encrypt(text);
    }

    function setPrivateKeyAndDecrypt(encryptedText) {
      const decrypt = new JSEncrypt();
      decrypt.setPrivateKey(keyInput.value);
      return decrypt.decrypt(encryptedText);
    }

    // Encrypt plaintext
    function encrypt() {
      const encrypted = setPublicKeyAndEncrypt(plaintext.value);
      ciphertext.value = encrypted;
    }

    // Decrypt ciphertext
    function decrypt() {
      const decrypted = setPrivateKeyAndDecrypt(ciphertext.value);
      plaintext.value = decrypted;
    }


    // Copy key functions
    function copyPrivateKey() {
      copyToClipboard(privateKey.value);
      Toast('Private key copied!');
    }

    function copyPublicKey() {
      copyToClipboard(publicKey.value);
      Toast('Public key copied!');
    }

    function copyPlaintextToClipboard() {
      copyToClipboard(plaintext.value);
      Toast('Plaintext copied!');
    }

    function copyCiphertextToClipboard() {
      copyToClipboard(ciphertext.value);
      Toast('Ciphertext copied!');
    }

    function copyToClipboard(text) {
      const dummy = document.createElement("textarea");
      document.body.appendChild(dummy);
      dummy.value = text;
      dummy.select();
      document.execCommand("copy");
      document.body.removeChild(dummy);
    }






    return {
      plaintext,
      keyInput,
      ciphertext,
      privateKey,
      publicKey,
      generateKeyPair,
      encrypt,
      decrypt,
      copyPrivateKey,
      copyPublicKey,
      copyPlaintextToClipboard,
      copyCiphertextToClipboard
    };
  },
};
</script>



<style scoped>
.van-page {
  padding: 16px;
}

.use-cases {
  text-align: left; /* Align text to the left */
}

</style>
