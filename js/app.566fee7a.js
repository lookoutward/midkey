(function(){var e={8159:function(e,t,a){"use strict";var n=a(5130),l=a(6768);function o(e,t,a,n,o,i){const r=(0,l.g2)("router-view");return(0,l.uX)(),(0,l.Wv)(r)}var i={name:"App"},r=a(1241);const u=(0,r.A)(i,[["render",o]]);var c=u,d=(a(2241),a(122)),s=a(2195),p=a(8139),b=a(3788),y=a(3384),v=a(6231),k=a(1387);const m=e=>((0,l.Qi)("data-v-f1d25d00"),e=e(),(0,l.jt)(),e),h={class:"button-area"},f={class:"button-area"},g=m((()=>(0,l.Lk)("div",{style:{width:"100%"}},[(0,l.Lk)("span",{style:{"font-weight":"bold"}},"Use cases of AES256:"),(0,l.Lk)("div",{class:"use-cases"},[(0,l.eW)(" 1. Encrypting very long texts."),(0,l.Lk)("br"),(0,l.eW)(" 2. Encrypting and decrypting using the same key. ")])],-1))),C=m((()=>(0,l.Lk)("div",null," ",-1))),F=m((()=>(0,l.Lk)("div",null," ",-1))),_=m((()=>(0,l.Lk)("div",null," ",-1))),K=m((()=>(0,l.Lk)("div",null," ",-1))),x=m((()=>(0,l.Lk)("div",null," ",-1))),L=m((()=>(0,l.Lk)("div",null," ",-1))),P=m((()=>(0,l.Lk)("div",null," ",-1)));function S(e,t,a,n,o,i){const r=(0,l.g2)("van-nav-bar"),u=(0,l.g2)("van-button"),c=(0,l.g2)("van-field"),d=(0,l.g2)("van-cell"),s=(0,l.g2)("van-page"),p=(0,l.g2)("TabBar");return(0,l.uX)(),(0,l.CE)(l.FK,null,[(0,l.bF)(s,null,{default:(0,l.k6)((()=>[(0,l.bF)(r,{title:"AES256"}),(0,l.Lk)("div",h,[(0,l.bF)(u,{type:"primary",onClick:n.encrypt},{default:(0,l.k6)((()=>[(0,l.eW)("Encrypt")])),_:1},8,["onClick"])]),(0,l.bF)(c,{modelValue:n.encryptInput,"onUpdate:modelValue":t[0]||(t[0]=e=>n.encryptInput=e),label:"Plaintext",type:"textarea",rows:"5",placeholder:"When encrypting, enter the plaintext, and when decrypting, display the plaintext"},{button:(0,l.k6)((()=>[(0,l.bF)(u,{size:"mini",onClick:n.copyPlaintextToClipboard},{default:(0,l.k6)((()=>[(0,l.eW)("Copy")])),_:1},8,["onClick"])])),_:1},8,["modelValue"]),(0,l.bF)(c,{modelValue:n.keyInput,"onUpdate:modelValue":t[1]||(t[1]=e=>n.keyInput=e),label:"Key",type:"textarea",rows:"2",placeholder:"Enter the key"},null,8,["modelValue"]),(0,l.bF)(c,{modelValue:n.decryptInput,"onUpdate:modelValue":t[2]||(t[2]=e=>n.decryptInput=e),label:"Ciphertext",type:"textarea",rows:"5",placeholder:"When encrypting, display the ciphertext, and when decrypting, enter the ciphertext"},{button:(0,l.k6)((()=>[(0,l.bF)(u,{size:"mini",onClick:n.copyCiphertextToClipboard},{default:(0,l.k6)((()=>[(0,l.eW)("Copy")])),_:1},8,["onClick"])])),_:1},8,["modelValue"]),(0,l.Lk)("div",f,[(0,l.bF)(u,{type:"primary",onClick:n.decrypt},{default:(0,l.k6)((()=>[(0,l.eW)("Decrypt")])),_:1},8,["onClick"])]),(0,l.bF)(d,null,{default:(0,l.k6)((()=>[g])),_:1})])),_:1}),C,F,_,K,x,L,P,(0,l.bF)(p)],64)}var w=a(144),V=a(3169),T=a.n(V),W=a(4531);function A(e,t,a,n,o,i){const r=(0,l.g2)("van-tabbar-item"),u=(0,l.g2)("router-link"),c=(0,l.g2)("van-tabbar");return(0,l.uX)(),(0,l.Wv)(c,null,{default:(0,l.k6)((()=>[(0,l.bF)(u,{to:"/aes",class:"tabbar-link"},{default:(0,l.k6)((()=>[(0,l.bF)(r,{icon:"home-o"},{default:(0,l.k6)((()=>[(0,l.eW)("Home")])),_:1})])),_:1}),(0,l.bF)(u,{to:"/rsa",class:"tabbar-link"},{default:(0,l.k6)((()=>[(0,l.bF)(r,{icon:"hot-o"},{default:(0,l.k6)((()=>[(0,l.eW)("Rsa")])),_:1})])),_:1}),(0,l.bF)(u,{to:"/dhke",class:"tabbar-link"},{default:(0,l.k6)((()=>[(0,l.bF)(r,{icon:"sign"},{default:(0,l.k6)((()=>[(0,l.eW)("Dhke")])),_:1})])),_:1}),(0,l.bF)(u,{to:"/more",class:"tabbar-link"},{default:(0,l.k6)((()=>[(0,l.bF)(r,{icon:"more-o"},{default:(0,l.k6)((()=>[(0,l.eW)("More")])),_:1})])),_:1})])),_:1})}var E=a(311),R=a(9990),U={name:"TabBar",components:{"van-tabbar":E.H,"van-tabbar-item":R.g}};const B=(0,r.A)(U,[["render",A],["__scopeId","data-v-255a1880"]]);var z=B,I={components:{TabBar:z},setup(){const e=(0,w.KR)(""),t=(0,w.KR)(""),a=(0,w.KR)(""),n=()=>{const n=e.value,l=t.value,o=T().AES.encrypt(n,l,{keySize:8}).toString();a.value=o},l=()=>{const n=a.value,l=t.value,o=T().AES.decrypt(n,l,{keySize:8}),i=o.toString(T().enc.Utf8);e.value=i},o=e=>{const t=document.createElement("textarea");document.body.appendChild(t),t.value=e,t.select(),document.execCommand("copy"),document.body.removeChild(t)},i=()=>{o(e.value),(0,W.y)("The plaintext has been copied")},r=()=>{o(a.value),(0,W.y)("The ciphertext has been copied")};return{encryptInput:e,keyInput:t,decryptInput:a,encrypt:n,decrypt:l,copyPlaintextToClipboard:i,copyCiphertextToClipboard:r}}};const H=(0,r.A)(I,[["render",S],["__scopeId","data-v-f1d25d00"]]);var D=H;const X=e=>((0,l.Qi)("data-v-3170eff8"),e=e(),(0,l.jt)(),e),j={class:"button-container"},O=X((()=>(0,l.Lk)("div",{style:{width:"100%"}},[(0,l.Lk)("span",{style:{"font-weight":"bold"}},"Use Cases of Hash"),(0,l.Lk)("div",{class:"use-cases"},[(0,l.eW)(" 1. Converting text of any length into a fixed-length string;"),(0,l.Lk)("br"),(0,l.eW)(" 2. For prediction games, generate a hash for each person’s prediction and publish it in advance. After the event, reveal the predictions. ")])],-1))),M=X((()=>(0,l.Lk)("div",null," ",-1))),N=X((()=>(0,l.Lk)("div",null," ",-1))),Q=X((()=>(0,l.Lk)("div",null," ",-1))),G=X((()=>(0,l.Lk)("div",null," ",-1))),Y=X((()=>(0,l.Lk)("div",null," ",-1))),$=X((()=>(0,l.Lk)("div",null," ",-1))),q=X((()=>(0,l.Lk)("div",null," ",-1)));function Z(e,t,a,n,o,i){const r=(0,l.g2)("van-nav-bar"),u=(0,l.g2)("van-field"),c=(0,l.g2)("van-button"),d=(0,l.g2)("van-cell-group"),s=(0,l.g2)("van-divider"),p=(0,l.g2)("van-cell"),b=(0,l.g2)("van-page"),y=(0,l.g2)("TabBar");return(0,l.uX)(),(0,l.CE)(l.FK,null,[(0,l.bF)(b,null,{default:(0,l.k6)((()=>[(0,l.bF)(r,{title:"Hash SHA-3 256-bit"}),(0,l.bF)(d,null,{default:(0,l.k6)((()=>[(0,l.bF)(u,{modelValue:n.input,"onUpdate:modelValue":t[0]||(t[0]=e=>n.input=e),label:"Text",placeholder:"Enter text to hash...",rows:"5",type:"textarea"},null,8,["modelValue"]),(0,l.bF)(u,{modelValue:n.salt,"onUpdate:modelValue":t[1]||(t[1]=e=>n.salt=e),label:"Hash Salt",placeholder:"Enter random string (optional)",type:"textarea"},null,8,["modelValue"]),(0,l.Lk)("div",j,[(0,l.bF)(c,{type:"primary",onClick:n.calculateHash},{default:(0,l.k6)((()=>[(0,l.eW)("Calculate Hash")])),_:1},8,["onClick"])]),(0,l.bF)(u,{modelValue:n.inputAndSalt,"onUpdate:modelValue":t[2]||(t[2]=e=>n.inputAndSalt=e),label:"Input + Salt",type:"textarea",readonly:""},{button:(0,l.k6)((()=>[(0,l.bF)(c,{size:"mini",onClick:n.copyTextToClipboard},{default:(0,l.k6)((()=>[(0,l.eW)("Copy Text")])),_:1},8,["onClick"])])),_:1},8,["modelValue"]),(0,l.bF)(u,{modelValue:n.hash,"onUpdate:modelValue":t[3]||(t[3]=e=>n.hash=e),label:"Hash Value",type:"textarea",readonly:""},{button:(0,l.k6)((()=>[(0,l.bF)(c,{size:"mini",onClick:n.copyHashToClipboard},{default:(0,l.k6)((()=>[(0,l.eW)("Copy Hash")])),_:1},8,["onClick"])])),_:1},8,["modelValue"])])),_:1}),(0,l.bF)(s),(0,l.bF)(p,null,{default:(0,l.k6)((()=>[O])),_:1}),(0,l.bF)(s)])),_:1}),M,N,Q,G,Y,$,q,(0,l.bF)(y)],64)}var J={name:"HashPage",components:{TabBar:z},setup(){const e=(0,w.KR)(""),t=(0,w.KR)(""),a=(0,w.KR)(""),n=(0,w.KR)("");let o;const i=()=>{o?(a.value=e.value.trim()+t.value.trim(),n.value=o(a.value)):alert("SHA-3库未加载，请稍后再试。")},r=()=>{navigator.clipboard.writeText(a.value).then((()=>{alert("Text copied")}))},u=()=>{navigator.clipboard.writeText(n.value).then((()=>{alert("Hash copied")}))};return(0,l.sV)((()=>{const e=document.createElement("script");e.src="https://cdn.jsdelivr.net/npm/js-sha3@0.8.0/src/sha3.min.js",e.async=!0,e.onload=()=>{o=window.sha3_256},document.head.appendChild(e)})),{input:e,salt:t,inputAndSalt:a,hash:n,calculateHash:i,copyTextToClipboard:r,copyHashToClipboard:u}}};const ee=(0,r.A)(J,[["render",Z],["__scopeId","data-v-3170eff8"]]);var te=ee;const ae={class:"button-container"},ne={class:"button-container"},le=(0,l.Lk)("div",{style:{width:"100%"}},[(0,l.Lk)("span",{style:{"font-weight":"bold"}},"Use cases of Dhke:"),(0,l.Lk)("div",{class:"use-cases"},[(0,l.eW)(" 1. Secure communication: In network communication, two communicating parties can use the DH algorithm to generate a shared key, which is used for encryption and decryption in subsequent communication processes, ensuring the confidentiality of the communication."),(0,l.Lk)("br"),(0,l.eW)(" 2. Party A generates a public-private key pair and sends its public key to party B. Similarly, party B generates a public-private key pair and sends its public key to party A."),(0,l.Lk)("br"),(0,l.eW)(" 3. Each party calculates the shared key using their own public-private key pair and the other party's public key. The calculation result should be the same for both parties. "),(0,l.Lk)("br")])],-1),oe=(0,l.Lk)("div",null," ",-1),ie=(0,l.Lk)("div",null," ",-1),re=(0,l.Lk)("div",null," ",-1),ue=(0,l.Lk)("div",null," ",-1),ce=(0,l.Lk)("div",null," ",-1),de=(0,l.Lk)("div",null," ",-1),se=(0,l.Lk)("div",null," ",-1);function pe(e,t,a,n,o,i){const r=(0,l.g2)("van-nav-bar"),u=(0,l.g2)("van-button"),c=(0,l.g2)("van-field"),d=(0,l.g2)("van-cell"),s=(0,l.g2)("van-page"),p=(0,l.g2)("TabBar");return(0,l.uX)(),(0,l.CE)(l.FK,null,[(0,l.bF)(s,null,{default:(0,l.k6)((()=>[(0,l.bF)(r,{title:"Diffie–Hellman key exchange"}),(0,l.Lk)("div",null,[(0,l.bF)(c,{modelValue:n.privateKeyA,"onUpdate:modelValue":t[0]||(t[0]=e=>n.privateKeyA=e),label:"Private Key A",rows:"2",type:"textarea",placeholder:"Please enter the private key"},{button:(0,l.k6)((()=>[(0,l.bF)(u,{size:"mini",onClick:n.copyPrivateKeyA},{default:(0,l.k6)((()=>[(0,l.eW)("Copy")])),_:1},8,["onClick"])])),_:1},8,["modelValue"]),(0,l.bF)(c,{modelValue:n.publicKeyA,"onUpdate:modelValue":t[1]||(t[1]=e=>n.publicKeyA=e),label:"Public Key A",rows:"2",type:"textarea",placeholder:"Please enter the public key"},{button:(0,l.k6)((()=>[(0,l.bF)(u,{size:"mini",onClick:n.copyPublicKeyA},{default:(0,l.k6)((()=>[(0,l.eW)("Copy")])),_:1},8,["onClick"])])),_:1},8,["modelValue"]),(0,l.Lk)("div",ae,[(0,l.bF)(u,{type:"primary",onClick:n.generateKeys},{default:(0,l.k6)((()=>[(0,l.eW)("Generate Key Pair")])),_:1},8,["onClick"])]),(0,l.bF)(c,{modelValue:n.publicKeyB,"onUpdate:modelValue":t[2]||(t[2]=e=>n.publicKeyB=e),label:"Other Party's Public Key",rows:"2",type:"textarea",placeholder:"Please enter the other party's public key"},{button:(0,l.k6)((()=>[(0,l.bF)(u,{size:"mini",onClick:n.copyPublicKeyB},{default:(0,l.k6)((()=>[(0,l.eW)("Copy")])),_:1},8,["onClick"])])),_:1},8,["modelValue"]),(0,l.bF)(c,{modelValue:n.sharedSecret,"onUpdate:modelValue":t[3]||(t[3]=e=>n.sharedSecret=e),label:"Shared Key",rows:"2",type:"textarea",readonly:"",placeholder:"Shared key"},{button:(0,l.k6)((()=>[(0,l.bF)(u,{size:"mini",onClick:n.copySharedSecret},{default:(0,l.k6)((()=>[(0,l.eW)("Copy")])),_:1},8,["onClick"])])),_:1},8,["modelValue"]),(0,l.Lk)("div",ne,[(0,l.bF)(u,{type:"primary",onClick:n.calculateSharedSecret},{default:(0,l.k6)((()=>[(0,l.eW)("Calculate the Shared Key")])),_:1},8,["onClick"])])]),(0,l.bF)(d,null,{default:(0,l.k6)((()=>[le])),_:1})])),_:1}),oe,ie,re,ue,ce,de,se,(0,l.bF)(p)],64)}a(6573),a(8100),a(7936),a(7467),a(4732),a(9577);var be=a(2487),ye=a.n(be),ve={components:{TabBar:z},setup(){const e=(0,w.KR)(""),t=(0,w.KR)(""),a=(0,w.KR)(""),n=(0,w.KR)(""),l=new(ye())("114179812305190573251285406962627163971195067122210512231600037100200647772758065447574577201147959"),o=new(ye())("2"),i=()=>{const a=new(ye())(crypto.getRandomValues(new Uint8Array(32)),"hex"),n=o.toRed(ye().red(l)).redPow(a);e.value=a.toString("hex"),t.value=n.toString("hex")},r=()=>{const t=new(ye())(e.value,"hex"),o=new(ye())(a.value,"hex"),i=o.toRed(ye().red(l)).redPow(t).fromRed();n.value=i.toString("hex")},u=async e=>{try{await navigator.clipboard.writeText(e),(0,W.y)("Copied to clipboard")}catch(t){(0,W.y)("Failed to copy")}},c=()=>u(e.value),d=()=>u(t.value),s=()=>u(a.value),p=()=>u(n.value);return{privateKeyA:e,publicKeyA:t,publicKeyB:a,sharedSecret:n,generateKeys:i,calculateSharedSecret:r,copyPrivateKeyA:c,copyPublicKeyA:d,copyPublicKeyB:s,copySharedSecret:p}}};const ke=(0,r.A)(ve,[["render",pe]]);var me=ke;const he=e=>((0,l.Qi)("data-v-782fa403"),e=e(),(0,l.jt)(),e),fe={style:{"text-align":"center","margin-bottom":"16px"}},ge={style:{"text-align":"center","margin-bottom":"16px"}},Ce={style:{"margin-bottom":"8px"}},Fe=he((()=>(0,l.Lk)("div",{style:{width:"100%"}},[(0,l.Lk)("span",{style:{"font-weight":"bold"}},"Use Cases of RSA"),(0,l.Lk)("div",{class:"use-cases"},[(0,l.eW)(" 1. Encrypting sensitive data such as keys."),(0,l.Lk)("br"),(0,l.eW)(" 2. Generating a key pair where the private key is kept secret and the public key is made public. Other parties can encrypt data using the public key, send the ciphertext to you, and then you can decrypt it using the private key. ")])],-1))),_e=he((()=>(0,l.Lk)("div",null," ",-1))),Ke=he((()=>(0,l.Lk)("div",null," ",-1))),xe=he((()=>(0,l.Lk)("div",null," ",-1))),Le=he((()=>(0,l.Lk)("div",null," ",-1))),Pe=he((()=>(0,l.Lk)("div",null," ",-1))),Se=he((()=>(0,l.Lk)("div",null," ",-1))),we=he((()=>(0,l.Lk)("div",null," ",-1)));function Ve(e,t,a,n,o,i){const r=(0,l.g2)("van-nav-bar"),u=(0,l.g2)("van-button"),c=(0,l.g2)("van-field"),d=(0,l.g2)("van-cell-group"),s=(0,l.g2)("van-divider"),p=(0,l.g2)("van-cell"),b=(0,l.g2)("van-page"),y=(0,l.g2)("TabBar");return(0,l.uX)(),(0,l.CE)(l.FK,null,[(0,l.bF)(b,null,{default:(0,l.k6)((()=>[(0,l.bF)(r,{title:"RSA1024"}),(0,l.Lk)("div",fe,[(0,l.bF)(u,{type:"primary",onClick:n.encrypt},{default:(0,l.k6)((()=>[(0,l.eW)("Public Key Encryption")])),_:1},8,["onClick"])]),(0,l.bF)(d,null,{default:(0,l.k6)((()=>[(0,l.bF)(c,{modelValue:n.plaintext,"onUpdate:modelValue":t[0]||(t[0]=e=>n.plaintext=e),label:"Plaintext",type:"textarea",placeholder:"Enter plaintext (max 100 characters)",maxlength:"100"},{button:(0,l.k6)((()=>[(0,l.bF)(u,{size:"mini",onClick:n.copyPlaintextToClipboard},{default:(0,l.k6)((()=>[(0,l.eW)("Copy")])),_:1},8,["onClick"])])),_:1},8,["modelValue"])])),_:1}),(0,l.bF)(d,null,{default:(0,l.k6)((()=>[(0,l.bF)(c,{modelValue:n.keyInput,"onUpdate:modelValue":t[1]||(t[1]=e=>n.keyInput=e),label:"Key",type:"textarea",placeholder:"Public key for encryption/Private key for decryption"},null,8,["modelValue"])])),_:1}),(0,l.bF)(d,null,{default:(0,l.k6)((()=>[(0,l.bF)(c,{modelValue:n.ciphertext,"onUpdate:modelValue":t[2]||(t[2]=e=>n.ciphertext=e),label:"Ciphertext",type:"textarea",placeholder:"Display ciphertext or enter ciphertext for decryption"},{button:(0,l.k6)((()=>[(0,l.bF)(u,{size:"mini",onClick:n.copyCiphertextToClipboard},{default:(0,l.k6)((()=>[(0,l.eW)("Copy")])),_:1},8,["onClick"])])),_:1},8,["modelValue"])])),_:1}),(0,l.Lk)("div",ge,[(0,l.bF)(u,{type:"primary",onClick:n.decrypt},{default:(0,l.k6)((()=>[(0,l.eW)("Private Key Decryption")])),_:1},8,["onClick"])]),(0,l.bF)(s),(0,l.bF)(d,null,{default:(0,l.k6)((()=>[(0,l.bF)(p,null,{default:(0,l.k6)((()=>[(0,l.bF)(c,{modelValue:n.privateKey,"onUpdate:modelValue":t[3]||(t[3]=e=>n.privateKey=e),label:"Private Key",type:"textarea",readonly:""},{button:(0,l.k6)((()=>[(0,l.bF)(u,{size:"mini",onClick:n.copyPrivateKey},{default:(0,l.k6)((()=>[(0,l.eW)("Copy")])),_:1},8,["onClick"])])),_:1},8,["modelValue"])])),_:1}),(0,l.bF)(p,null,{default:(0,l.k6)((()=>[(0,l.bF)(c,{modelValue:n.publicKey,"onUpdate:modelValue":t[4]||(t[4]=e=>n.publicKey=e),label:"Public Key",type:"textarea",readonly:""},{button:(0,l.k6)((()=>[(0,l.bF)(u,{size:"mini",onClick:n.copyPublicKey},{default:(0,l.k6)((()=>[(0,l.eW)("Copy")])),_:1},8,["onClick"])])),_:1},8,["modelValue"])])),_:1}),(0,l.bF)(p,{title:""},{default:(0,l.k6)((()=>[(0,l.Lk)("div",Ce,[(0,l.bF)(u,{type:"primary",onClick:n.generateKeyPair},{default:(0,l.k6)((()=>[(0,l.eW)("Generate Key Pair")])),_:1},8,["onClick"])])])),_:1})])),_:1}),(0,l.bF)(s),(0,l.bF)(p,null,{default:(0,l.k6)((()=>[Fe])),_:1}),(0,l.bF)(s)])),_:1}),_e,Ke,xe,Le,Pe,Se,we,(0,l.bF)(y)],64)}var Te=a(5422),We={name:"RsaPage",components:{TabBar:z},setup(){const e=(0,w.KR)(""),t=(0,w.KR)(""),a=(0,w.KR)(""),n=(0,w.KR)(""),l=(0,w.KR)("");function o(){const e=new Te.v({default_key_size:2048});e.getKey(),l.value=e.getPublicKey(),n.value=e.getPrivateKey(),(0,W.y)("Key pair generated!")}function i(e){const a=new Te.v;return a.setPublicKey(t.value),a.encrypt(e)}function r(e){const a=new Te.v;return a.setPrivateKey(t.value),a.decrypt(e)}function u(){const t=i(e.value);a.value=t}function c(){const t=r(a.value);e.value=t}function d(){y(n.value),(0,W.y)("Private key copied!")}function s(){y(l.value),(0,W.y)("Public key copied!")}function p(){y(e.value),(0,W.y)("Plaintext copied!")}function b(){y(a.value),(0,W.y)("Ciphertext copied!")}function y(e){const t=document.createElement("textarea");document.body.appendChild(t),t.value=e,t.select(),document.execCommand("copy"),document.body.removeChild(t)}return{plaintext:e,keyInput:t,ciphertext:a,privateKey:n,publicKey:l,generateKeyPair:o,encrypt:u,decrypt:c,copyPrivateKey:d,copyPublicKey:s,copyPlaintextToClipboard:p,copyCiphertextToClipboard:b}}};const Ae=(0,r.A)(We,[["render",Ve],["__scopeId","data-v-782fa403"]]);var Ee=Ae;const Re=e=>((0,l.Qi)("data-v-00257ff4"),e=e(),(0,l.jt)(),e),Ue={class:"button-container"},Be={class:"button-container"},ze={class:"button-container"},Ie=Re((()=>(0,l.Lk)("div",{class:"usage-scenarios"},[(0,l.Lk)("span",{class:"bold"},"RSA Signature Usage Scenarios:"),(0,l.Lk)("div",null,[(0,l.eW)(" 1. Private key signature;"),(0,l.Lk)("br"),(0,l.eW)(" 2. Public key verification. ")])],-1))),He=Re((()=>(0,l.Lk)("div",null," ",-1))),De=Re((()=>(0,l.Lk)("div",null," ",-1))),Xe=Re((()=>(0,l.Lk)("div",null," ",-1))),je=Re((()=>(0,l.Lk)("div",null," ",-1))),Oe=Re((()=>(0,l.Lk)("div",null," ",-1))),Me=Re((()=>(0,l.Lk)("div",null," ",-1))),Ne=Re((()=>(0,l.Lk)("div",null," ",-1)));function Qe(e,t,a,n,o,i){const r=(0,l.g2)("van-nav-bar"),u=(0,l.g2)("van-button"),c=(0,l.g2)("van-field"),d=(0,l.g2)("van-cell-group"),s=(0,l.g2)("van-divider"),p=(0,l.g2)("van-cell"),b=(0,l.g2)("van-page"),y=(0,l.g2)("TabBar");return(0,l.uX)(),(0,l.CE)(l.FK,null,[(0,l.bF)(b,null,{default:(0,l.k6)((()=>[(0,l.bF)(r,{title:"RSA1024 Signature"}),(0,l.Lk)("div",Ue,[(0,l.bF)(u,{type:"primary",onClick:n.sign},{default:(0,l.k6)((()=>[(0,l.eW)("Private Key Signature")])),_:1},8,["onClick"])]),(0,l.bF)(d,null,{default:(0,l.k6)((()=>[(0,l.bF)(c,{modelValue:n.plaintext,"onUpdate:modelValue":t[0]||(t[0]=e=>n.plaintext=e),label:"Clear Text",type:"textarea",placeholder:"Clear text to be signed"},{button:(0,l.k6)((()=>[(0,l.bF)(u,{size:"mini",onClick:n.copyPlaintextToClipboard},{default:(0,l.k6)((()=>[(0,l.eW)("Copy")])),_:1},8,["onClick"])])),_:1},8,["modelValue"])])),_:1}),(0,l.bF)(d,null,{default:(0,l.k6)((()=>[(0,l.bF)(c,{modelValue:n.signature,"onUpdate:modelValue":t[1]||(t[1]=e=>n.signature=e),label:"Signature Result",type:"textarea",placeholder:"Signature result"},{button:(0,l.k6)((()=>[(0,l.bF)(u,{size:"mini",onClick:n.copySignatureToClipboard},{default:(0,l.k6)((()=>[(0,l.eW)("Copy")])),_:1},8,["onClick"])])),_:1},8,["modelValue"])])),_:1}),(0,l.Lk)("div",Be,[(0,l.bF)(u,{type:"primary",onClick:n.verify},{default:(0,l.k6)((()=>[(0,l.eW)("Public Key Verification")])),_:1},8,["onClick"])]),(0,l.bF)(s),(0,l.bF)(d,null,{default:(0,l.k6)((()=>[(0,l.bF)(c,{modelValue:n.privateKey,"onUpdate:modelValue":t[2]||(t[2]=e=>n.privateKey=e),label:"Private Key",type:"textarea",placeholder:"Enter private key when signing"},{button:(0,l.k6)((()=>[(0,l.bF)(u,{size:"mini",onClick:n.copyPrivateKey},{default:(0,l.k6)((()=>[(0,l.eW)("Copy")])),_:1},8,["onClick"])])),_:1},8,["modelValue"])])),_:1}),(0,l.bF)(d,null,{default:(0,l.k6)((()=>[(0,l.bF)(c,{modelValue:n.publicKey,"onUpdate:modelValue":t[3]||(t[3]=e=>n.publicKey=e),label:"Public Key",type:"textarea",placeholder:"Enter public key during verification"},{button:(0,l.k6)((()=>[(0,l.bF)(u,{size:"mini",onClick:n.copyPublicKey},{default:(0,l.k6)((()=>[(0,l.eW)("Copy")])),_:1},8,["onClick"])])),_:1},8,["modelValue"])])),_:1}),(0,l.Lk)("div",ze,[(0,l.bF)(u,{type:"primary",onClick:n.generateKeyPair},{default:(0,l.k6)((()=>[(0,l.eW)("Generate Key Pair")])),_:1},8,["onClick"])]),(0,l.bF)(s),(0,l.bF)(p,null,{default:(0,l.k6)((()=>[Ie])),_:1})])),_:1}),He,De,Xe,je,Oe,Me,Ne,(0,l.bF)(y)],64)}var Ge={name:"RsaSignaturePage",components:{TabBar:z},setup(){const e=(0,w.KR)(""),t=(0,w.KR)(""),a=(0,w.KR)(""),n=(0,w.KR)(""),l=()=>{const e=new Te.v({default_key_size:1024});a.value=e.getPrivateKey(),n.value=e.getPublicKey(),(0,W.y)("Key pair generated!")},o=()=>{const n=new Te.v;n.setPrivateKey(a.value.trim());const l=T().SHA256(e.value).toString();t.value=n.sign(l,T().SHA256,"sha256"),console.log("Signature:",t.value)},i=()=>{const a=new Te.v;a.setPublicKey(n.value.trim());const l=T().SHA256(e.value).toString(),o=a.verify(l,t.value,T().SHA256);console.log("Verification Result:",o),(0,W.y)(o?"Signature verified successfully":"Signature verification failed")},r=e=>{const t=document.createElement("textarea");document.body.appendChild(t),t.value=e,t.select(),document.execCommand("copy"),document.body.removeChild(t)},u=()=>{r(a.value),(0,W.y)("The private key has been copied")},c=()=>{r(n.value),(0,W.y)("The public key has been copied")},d=()=>{r(e.value),(0,W.y)("The plaintext has been copied")},s=()=>{r(t.value),(0,W.y)("The signature has been copied")};return{plaintext:e,signature:t,privateKey:a,publicKey:n,generateKeyPair:l,sign:o,verify:i,copyPrivateKey:u,copyPublicKey:c,copyPlaintextToClipboard:d,copySignatureToClipboard:s}}};const Ye=(0,r.A)(Ge,[["render",Qe],["__scopeId","data-v-00257ff4"]]);var $e=Ye,qe=a(4232);const Ze=e=>((0,l.Qi)("data-v-78160e78"),e=e(),(0,l.jt)(),e),Je={class:"button-container"},et={class:"button-container"},tt=Ze((()=>(0,l.Lk)("div",null," ",-1))),at=Ze((()=>(0,l.Lk)("div",null," ",-1))),nt=Ze((()=>(0,l.Lk)("div",null," ",-1))),lt=Ze((()=>(0,l.Lk)("div",null," ",-1))),ot=Ze((()=>(0,l.Lk)("div",null," ",-1))),it=Ze((()=>(0,l.Lk)("div",null," ",-1))),rt=Ze((()=>(0,l.Lk)("div",null," ",-1)));function ut(e,t,a,n,o,i){const r=(0,l.g2)("van-nav-bar"),u=(0,l.g2)("van-button"),c=(0,l.g2)("van-field"),d=(0,l.g2)("van-cell"),s=(0,l.g2)("van-cell-title"),p=(0,l.g2)("van-picker"),b=(0,l.g2)("van-divider"),y=(0,l.g2)("van-cell-group"),v=(0,l.g2)("van-dialog"),k=(0,l.g2)("van-toast"),m=(0,l.g2)("van-page");return(0,l.uX)(),(0,l.CE)(l.FK,null,[(0,l.bF)(m,null,{default:(0,l.k6)((()=>[(0,l.bF)(r,{title:"Shamir Secret Sharing"}),(0,l.bF)(y,null,{default:(0,l.k6)((()=>[(0,l.bF)(d,null,{default:(0,l.k6)((()=>[(0,l.bF)(c,{modelValue:n.secret,"onUpdate:modelValue":t[1]||(t[1]=e=>n.secret=e),placeholder:"Enter the secret; when synthesizing, the secret will be displayed",type:"textarea"},{button:(0,l.k6)((()=>[(0,l.bF)(u,{size:"mini",onClick:t[0]||(t[0]=e=>n.copyToClipboard(n.secret))},{default:(0,l.k6)((()=>[(0,l.eW)("Copy")])),_:1})])),_:1},8,["modelValue"])])),_:1}),(0,l.bF)(d,null,{default:(0,l.k6)((()=>[(0,l.bF)(p,{modelValue:n.threshold,"onUpdate:modelValue":t[2]||(t[2]=e=>n.threshold=e),columns:n.thresholdOptions,onConfirm:n.onThresholdConfirm,onCancel:n.onThresholdCancel,"show-toolbar":!0},{default:(0,l.k6)((()=>[(0,l.bF)(s,null,{default:(0,l.k6)((()=>[(0,l.eW)("Choose Threshold")])),_:1})])),_:1},8,["modelValue","columns","onConfirm","onCancel"])])),_:1}),(0,l.Lk)("div",Je,[(0,l.bF)(u,{type:"primary",onClick:n.generateKeys},{default:(0,l.k6)((()=>[(0,l.eW)("Decompose Secret")])),_:1},8,["onClick"])]),(0,l.bF)(b),(0,l.bF)(y,null,{default:(0,l.k6)((()=>[((0,l.uX)(!0),(0,l.CE)(l.FK,null,(0,l.pI)(n.subKeys,((e,t)=>((0,l.uX)(),(0,l.Wv)(d,{key:t},{default:(0,l.k6)((()=>[(0,l.bF)(c,{modelValue:n.subKeys[t],"onUpdate:modelValue":e=>n.subKeys[t]=e,placeholder:"Please enter the sub-secret",type:"textarea"},{button:(0,l.k6)((()=>[(0,l.bF)(u,{size:"mini",onClick:e=>n.copySubKeyToClipboard(t)},{default:(0,l.k6)((()=>[(0,l.eW)("Copy")])),_:2},1032,["onClick"])])),_:2},1032,["modelValue","onUpdate:modelValue"])])),_:2},1024)))),128))])),_:1})])),_:1}),(0,l.Lk)("div",et,[(0,l.bF)(u,{type:"primary",onClick:n.combineKeys},{default:(0,l.k6)((()=>[(0,l.eW)("Synthesize Secret")])),_:1},8,["onClick"])]),(0,l.bF)(v,{modelValue:n.secretDialogVisible,"onUpdate:modelValue":t[3]||(t[3]=e=>n.secretDialogVisible=e),title:"Secret","show-cancel-button":"",onCancel:t[4]||(t[4]=e=>n.secretDialogVisible=!1),onConfirm:t[5]||(t[5]=e=>n.secretDialogVisible=!1)},{default:(0,l.k6)((()=>[(0,l.eW)((0,qe.v_)(n.secret),1)])),_:1},8,["modelValue"]),(0,l.bF)(k)])),_:1}),tt,at,nt,lt,ot,it,rt],64)}a(4979);var ct=a(6303);const dt=e=>btoa(unescape(encodeURIComponent(e))),st=e=>decodeURIComponent(escape(atob(e)));var pt={setup(){const e=(0,w.KR)(""),t=(0,w.KR)(3),a=(0,w.KR)(Array(5).fill("")),n=(0,w.KR)(!1),l=(0,w.KR)([2,3,4]),o=()=>{if(!e.value.trim())return void(0,W.y)("Please enter the secret！");const n=(0,ct.lD)(dt(e.value),{shares:5,threshold:t.value});a.value=n.map((e=>dt(e))),(0,W.y)("The secret has been successfully decomposed!")},i=()=>{const l=a.value.filter((e=>""!==e)).map((e=>st(e)));if(l.length<t.value)return void(0,W.y)("The number of sub-secrets does not reach the threshold！");const o=l.slice(0,t.value);try{const t=(0,ct.kg)(o);e.value=st(t),n.value=!0,(0,W.y)("The secret has been successfully synthesized！")}catch(i){console.error("An error occurred: "+i.message),(0,W.y)("Failed to reconstruct the secret, number of sub-secrets did not meet the threshold！")}},r=e=>{const t=document.createElement("textarea");document.body.appendChild(t),t.value=e,t.select(),document.execCommand("copy"),document.body.removeChild(t)},u=e=>{r(a.value[e]),(0,W.y)(`The sub-secret ${e+1} has been copied`)},c=e=>{t.value=e},d=()=>{};return{secret:e,threshold:t,subKeys:a,generateKeys:o,combineKeys:i,copySubKeyToClipboard:u,secretDialogVisible:n,thresholdOptions:l,onThresholdConfirm:c,onThresholdCancel:d,copyToClipboard:r}}};const bt=(0,r.A)(pt,[["render",ut],["__scopeId","data-v-78160e78"]]);var yt=bt,vt=(a(4114),{__name:"MorePage",setup(e){const t=(0,k.rd)(),a=[{title:"Tools",icon:"edit",url:"/tool"},{title:"About",icon:"phone-o",url:"/about"}],n=e=>{e.startsWith("http")?window.location.href=e:t.push(e)};return(e,t)=>{const o=(0,l.g2)("van-nav-bar"),i=(0,l.g2)("van-cell"),r=(0,l.g2)("van-cell-group"),u=(0,l.g2)("van-page");return(0,l.uX)(),(0,l.CE)(l.FK,null,[(0,l.bF)(u,null,{default:(0,l.k6)((()=>[(0,l.bF)(o,{title:"More"}),(0,l.bF)(r,null,{default:(0,l.k6)((()=>[((0,l.uX)(),(0,l.CE)(l.FK,null,(0,l.pI)(a,((e,t)=>(0,l.bF)(i,{key:t,title:e.title,icon:e.icon,"is-link":"",onClick:t=>n(e.url)},null,8,["title","icon","onClick"]))),64))])),_:1})])),_:1}),(0,l.bF)(z)],64)}}});const kt=(0,r.A)(vt,[["__scopeId","data-v-7a3cb276"]]);var mt=kt,ht={__name:"ToolsPage",setup(e){const t=(0,k.rd)(),a=[{title:"AES256",icon:"star-o",url:"/aes"},{title:"RSA1024",icon:"star-o",url:"/rsa"},{title:"RSA Signature",icon:"star-o",url:"/sign"},{title:"Hash",icon:"star-o",url:"/hash"},{title:"dhke",icon:"star-o",url:"/dhke"},{title:"shamir",icon:"star-o",url:"/shamir"}],n=e=>{e.startsWith("http")?window.location.href=e:t.push(e)};return(e,t)=>{const o=(0,l.g2)("van-nav-bar"),i=(0,l.g2)("van-cell"),r=(0,l.g2)("van-cell-group"),u=(0,l.g2)("van-page");return(0,l.uX)(),(0,l.CE)(l.FK,null,[(0,l.bF)(u,null,{default:(0,l.k6)((()=>[(0,l.bF)(o,{title:"Tools"}),(0,l.bF)(r,null,{default:(0,l.k6)((()=>[((0,l.uX)(),(0,l.CE)(l.FK,null,(0,l.pI)(a,((e,t)=>(0,l.bF)(i,{key:t,title:e.title,icon:e.icon,"is-link":"",onClick:t=>n(e.url)},null,8,["title","icon","onClick"]))),64))])),_:1})])),_:1}),(0,l.bF)(z)],64)}}};const ft=(0,r.A)(ht,[["__scopeId","data-v-2b404ac8"]]);var gt=ft;const Ct={class:"container"},Ft=(0,l.Fv)('<div class="content" data-v-5586c224><div data-v-5586c224><div data-v-5586c224><strong data-v-5586c224>BNS: Bitcoin Name System. </strong></div><div data-v-5586c224><p data-v-5586c224>Decentralized names are secured on the Bitcoin blockchain, registered by Stacks. You can use your .btc name to sign into hundreds of decentralized apps and to send and receive STX. At Gamma, your BNS name is used as your decentralized identity, and is automatically reserved as a profile URL for your NFT collection.</p><p data-v-5586c224>BNS names also function much like traditional domain names. Compatibility via a web bridge with the DNS system of web 2.0 allows you to use a .btc name for a business or personal site.</p><p data-v-5586c224></p></div></div><div data-v-5586c224><strong data-v-5586c224>Register Your Bitcoin Domain and Step into the Future of Web3! </strong></div><div data-v-5586c224><p data-v-5586c224> Looking for a unique .btc domain? Now’s your chance! Perfect for personal branding, business websites, or even as your crypto wallet address, a .btc domain is your gateway to the decentralized web.</p><p data-v-5586c224>✅ Secure and Reliable: Powered by blockchain technology, tamper-proof, and fully verifiable.</p><p data-v-5586c224>✅ Decentralized Ownership: Your domain, your rules—no third-party interference.</p><p data-v-5586c224>✅ Endless Possibilities: Wallet integration, smart contracts, and more Web3 features.</p></div></div><div data-v-5586c224> </div><div data-v-5586c224> </div><div data-v-5586c224> </div>',4);function _t(e,t,a,n,o,i){const r=(0,l.g2)("van-nav-bar"),u=(0,l.g2)("TabBar");return(0,l.uX)(),(0,l.CE)("div",Ct,[(0,l.bF)(r,{title:"BNS"}),Ft,(0,l.bF)(u)])}var Kt={components:{TabBar:z}};const xt=(0,r.A)(Kt,[["render",_t],["__scopeId","data-v-5586c224"]]);var Lt=xt;const Pt=e=>((0,l.Qi)("data-v-efe68b3c"),e=e(),(0,l.jt)(),e),St={class:"container"},wt={class:"content"},Vt=Pt((()=>(0,l.Lk)("p",null,[(0,l.eW)(" Note: Please install the "),(0,l.Lk)("a",{href:"https://www.xverse.app/download",target:"_blank",rel:"noopener noreferrer"},"Xverse Wallet")],-1))),Tt=Pt((()=>(0,l.Lk)("span",{class:"unit"},"stx",-1))),Wt={href:"http://www.midkey.xyz",target:"_blank",rel:"noopener noreferrer",class:"tabbar-link"};function At(e,t,a,n,o,i){const r=(0,l.g2)("van-nav-bar"),u=(0,l.g2)("van-field"),c=(0,l.g2)("van-button"),d=(0,l.g2)("van-tabbar-item"),s=(0,l.g2)("van-tabbar");return(0,l.uX)(),(0,l.CE)("div",St,[(0,l.bF)(r,{title:"Donation"}),(0,l.Lk)("div",wt,[Vt,(0,l.bF)(u,{modelValue:n.amount,"onUpdate:modelValue":t[0]||(t[0]=e=>n.amount=e),label:"Amount",placeholder:"Enter amount",type:"number",min:"0",step:"0.01",class:"input-field custom-width"},{"right-icon":(0,l.k6)((()=>[Tt])),_:1},8,["modelValue"]),(0,l.bF)(c,{type:"primary",onClick:n.getBalance,class:"payment-button"},{default:(0,l.k6)((()=>[(0,l.eW)("Make Payment with Xverse Wallet")])),_:1},8,["onClick"])]),(0,l.bF)(s,null,{default:(0,l.k6)((()=>[(0,l.Lk)("a",Wt,[(0,l.bF)(d,{icon:"arrow-left"},{default:(0,l.k6)((()=>[(0,l.eW)("Back")])),_:1})])])),_:1})])}var Et=a(4121),Rt={components:{"van-button":d.$,"van-nav-bar":s.j,"van-tabbar":E.H,"van-tabbar-item":R.g,"van-field":y.D},setup(){const e=(0,w.KR)(0),t=(0,w.KR)("Balance Status"),a=async()=>{try{const t=await(0,Et.Em)("stx_transferStx",{recipient:"SP1QMZ9X8G3NG2A8QY4P7E88YEYC5FYAVB4T6CN9Q",amount:Number(1e6*e.value),memo:"Optional transaction memo"});"result"in t?alert(`Transaction ID: ${t.result.txid}`):alert(`Error: ${t.error.message}`)}catch(a){console.error(a),t.value="Error occurred"}};return{amount:e,balanceStatus:t,getBalance:a}}};const Ut=(0,r.A)(Rt,[["render",At],["__scopeId","data-v-efe68b3c"]]);var Bt=Ut;const zt=e=>((0,l.Qi)("data-v-c378e6bc"),e=e(),(0,l.jt)(),e),It={class:"container"},Ht=zt((()=>(0,l.Lk)("div",{class:"content"},[(0,l.Lk)("div",null,[(0,l.Lk)("div",null,[(0,l.Lk)("strong",null,"Midkey: Unlocking the Power of Cybersecurity.")]),(0,l.Lk)("div",null,[(0,l.Lk)("p",null," We are a small enterprise dedicated to information security, committed to providing efficient and practical network security solutions for small and medium-sized enterprises. Our services include vulnerability scanning, penetration testing, network monitoring, and security consulting. We use advanced tools combined with professional team experience to help clients identify and fix potential risks. Whether you need to protect your internal network, optimize firewall configuration, or respond to data breach threats, we can provide customized support to ensure the security of your business. ")]),(0,l.Lk)("div",null,[(0,l.Lk)("strong",null,"WeChat: midkeyxyz")]),(0,l.Lk)("div",null,[(0,l.Lk)("p")]),(0,l.Lk)("div",null," "),(0,l.Lk)("div",null," "),(0,l.Lk)("div",null," ")])],-1)));function Dt(e,t,a,n,o,i){const r=(0,l.g2)("van-nav-bar"),u=(0,l.g2)("TabBar");return(0,l.uX)(),(0,l.CE)("div",It,[(0,l.bF)(r,{title:"About"}),Ht,(0,l.bF)(u)])}var Xt={components:{TabBar:z}};const jt=(0,r.A)(Xt,[["render",Dt],["__scopeId","data-v-c378e6bc"]]);var Ot=jt;const Mt=[{path:"/",redirect:"/aes"},{path:"/bns",name:"BnsPage",component:Lt,meta:{title:"Midkey"}},{path:"/pay",name:"PayPage",component:Bt,meta:{title:"midkey"}},{path:"/tool",name:"ToolPage",component:gt,meta:{title:"midkey"}},{path:"/hash",name:"HashPage",component:te,meta:{title:"midkey"}},{path:"/dhke",name:"DhkePage",component:me,meta:{title:"midkey"}},{path:"/rsa",name:"RsaPage",component:Ee,meta:{title:"midkey"}},{path:"/sign",name:"SignPage",component:$e,meta:{title:"midkey"}},{path:"/shamir",name:"ShamirPage",component:yt,meta:{title:"midkey"}},{path:"/aes",name:"AesPage",component:D,meta:{title:"midkey"}},{path:"/more",name:"MorePage",component:mt,meta:{title:"midkey"}},{path:"/about",name:"AboutPage",component:Ot,meta:{title:"midkey"}}],Nt=(0,k.aE)({history:(0,k.Bt)(),routes:Mt});var Qt=Nt;const Gt=(0,n.Ef)(c);Gt.use(d.$),Gt.use(s.j),Gt.use(p.f),Gt.use(b.Q),Gt.use(y.D),Gt.use(v.L),Gt.use(Qt),Gt.mount("#app"),Qt.beforeEach((e=>{if(document.title=e.meta.title||"Midkey",e.meta.favicon){const t=document.querySelector("link[rel*='icon']");t&&(t.href=e.meta.favicon)}}))},4923:function(){},7790:function(){},477:function(){},2632:function(){}},t={};function a(n){var l=t[n];if(void 0!==l)return l.exports;var o=t[n]={id:n,loaded:!1,exports:{}};return e[n].call(o.exports,o,o.exports,a),o.loaded=!0,o.exports}a.m=e,function(){var e=[];a.O=function(t,n,l,o){if(!n){var i=1/0;for(d=0;d<e.length;d++){n=e[d][0],l=e[d][1],o=e[d][2];for(var r=!0,u=0;u<n.length;u++)(!1&o||i>=o)&&Object.keys(a.O).every((function(e){return a.O[e](n[u])}))?n.splice(u--,1):(r=!1,o<i&&(i=o));if(r){e.splice(d--,1);var c=l();void 0!==c&&(t=c)}}return t}o=o||0;for(var d=e.length;d>0&&e[d-1][2]>o;d--)e[d]=e[d-1];e[d]=[n,l,o]}}(),function(){a.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return a.d(t,{a:t}),t}}(),function(){a.d=function(e,t){for(var n in t)a.o(t,n)&&!a.o(e,n)&&Object.defineProperty(e,n,{enumerable:!0,get:t[n]})}}(),function(){a.g=function(){if("object"===typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"===typeof window)return window}}()}(),function(){a.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)}}(),function(){a.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})}}(),function(){a.nmd=function(e){return e.paths=[],e.children||(e.children=[]),e}}(),function(){var e={524:0};a.O.j=function(t){return 0===e[t]};var t=function(t,n){var l,o,i=n[0],r=n[1],u=n[2],c=0;if(i.some((function(t){return 0!==e[t]}))){for(l in r)a.o(r,l)&&(a.m[l]=r[l]);if(u)var d=u(a)}for(t&&t(n);c<i.length;c++)o=i[c],a.o(e,o)&&e[o]&&e[o][0](),e[o]=0;return a.O(d)},n=self["webpackChunkclient"]=self["webpackChunkclient"]||[];n.forEach(t.bind(null,0)),n.push=t.bind(null,n.push.bind(n))}();var n=a.O(void 0,[504],(function(){return a(8159)}));n=a.O(n)})();
//# sourceMappingURL=app.566fee7a.js.map