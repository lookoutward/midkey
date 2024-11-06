<template>
  <div class="container">
    <van-nav-bar title="Donation" />

    <div class="content">
      <p>
        Note: Please install the
        <a href="https://www.xverse.app/download"
          target="_blank" rel="noopener noreferrer">Xverse Wallet</a>
      </p>
      

      <van-field v-model="amount" label="Amount" placeholder="Enter amount" type="number" min="0" step="0.01"
        class="input-field custom-width">
        <template #right-icon>
          <span class="unit">stx</span>
        </template>
      </van-field>

      <van-button type="primary" @click="getBalance" class="payment-button">Make Payment with Xverse Wallet</van-button>
    </div>

    <van-tabbar>
      <a href="http://www.midkey.xyz" target="_blank" rel="noopener noreferrer" class="tabbar-link">
        <van-tabbar-item icon="arrow-left">Back</van-tabbar-item>
      </a>
    </van-tabbar>

  </div>
</template>

<script>
import { ref } from 'vue';
import { request } from 'sats-connect';
import { Button, NavBar, Tabbar, TabbarItem, Field } from 'vant';

export default {
  components: {
    'van-button': Button,
    'van-nav-bar': NavBar,
    'van-tabbar': Tabbar,
    'van-tabbar-item': TabbarItem,
    'van-field': Field
  },
  setup() {
    const amount = ref(0); // Initialize the amount with a default value
    const balanceStatus = ref('Balance Status');


    // const contractAddress = ref('ST1MFQKYE1TDJ7Z7SKJBJ32THGEPVZTEEZM62S27H'); // 替换为你的合约地址
    // const contractName = ref('confused-indigo-cicada'); // 替换为你的合约名称


    const getBalance = async () => {
      try {
    //     const response = await request("stx_getAccounts", {});
    //     if (response.status === "success") {
    //       alert("Successfully retrieved accounts. Check console for details.");
    //       console.log("Accounts:", response.result);
    //     } else {
    //       alert("Error retrieving accounts. Check console for details.");
    //       console.error(response);
    //     }


    //     // 调用智能合约的 `deposit` 函数
    //     const clarityAmount = uintCV(Number(amount.value)); // 将存款金额转换为 Clarity 值
    //     const functionArgs = [clarityAmount].map(cvToString); // 将 Clarity 值转换为字符串格式

    //     const contractResponse = await request("stx_callContract", {
    //       contract: `${contractAddress.value}.${contractName.value}`,
    //       functionName: 'deposit',
    //       arguments: functionArgs, // 使用转换后的参数
    //     });

    //     if (contractResponse.status === "success") {
    //       console.log("合约调用成功:", contractResponse.result);
    //       alert(`合约调用成功，交易 ID: ${contractResponse.result.txid}`);
    //     } else {
    //       console.error("合约调用失败:", contractResponse);
    //       alert("合约调用失败，请查看控制台日志");
    //     }


        const response1 = await request("stx_transferStx", {
          recipient: 'SP1QMZ9X8G3NG2A8QY4P7E88YEYC5FYAVB4T6CN9Q',
          amount: Number(amount.value * 1000000), // Convert amount to a number
          memo: 'Optional transaction memo',
        });

        if ("result" in response1) {
          alert(`Transaction ID: ${response1.result.txid}`);
        } else {
          alert(`Error: ${response1.error.message}`);
        }

        
      } catch (error) {
        console.error(error);
        balanceStatus.value = 'Error occurred';
      }
    };

    return {
      amount,
      balanceStatus,
      getBalance
    };
  }
};
</script>

<style scoped>
.custom-width {
  width: 5ch;
  /* 限制输入框宽度为5个字符的宽度 */
}

.unit {
  color: #e20e0e;
  /* 或其他你想要的样式 */
}



.tabbar-link {
  display: flex;
  flex: 1;
  justify-content: center;
}


.container {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  /* justify-content: center;  注释掉这行以取消垂直方向居中 */
  align-items: center;
  padding: 16px;
}

p {
  margin-bottom: 16px;
}

a {
  color: #007bff;
  text-decoration: none;
}

a:hover {
  text-decoration: underline;
}

.input-field {
  margin-bottom: 16px;
  width: 100%;
  max-width: 400px;
  /* Optional: limit the max width */
}

.payment-button {
  width: 100%;
  max-width: 400px;
  /* Optional: limit the max width */
}

.van-tabbar {
  position: fixed;
  bottom: 0;
  width: 100%;
}
</style>
