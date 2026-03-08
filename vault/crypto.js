/* crypto.js
 * 仅包含密码学相关：PBKDF2 派生密钥、AES-256-GCM 加解密、Base64 编解码、哈希等。
 * 严禁在这里做 UI 逻辑。
 */
(() => {
  'use strict';

  const CryptoUtil = {};

  // --- 基础工具：Base64 <-> Uint8Array（兼容离线环境） ---
  CryptoUtil.bytesToB64 = (bytes) => {
    let bin = '';
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return btoa(bin);
  };

  CryptoUtil.b64ToBytes = (b64) => {
    const bin = atob(b64);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  };

  CryptoUtil.utf8ToBytes = (str) => new TextEncoder().encode(str);
  CryptoUtil.bytesToUtf8 = (bytes) => new TextDecoder().decode(bytes);

  CryptoUtil.randomBytes = (len) => {
    const b = new Uint8Array(len);
    crypto.getRandomValues(b);
    return b;
  };

  // SHA-256：用于 keyfile 摘要、辅助派生材料等
  CryptoUtil.sha256 = async (bytes) => {
    const hash = await crypto.subtle.digest('SHA-256', bytes);
    return new Uint8Array(hash);
  };

  CryptoUtil.readFileAsArrayBuffer = (file) => new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onerror = () => reject(new Error('读取文件失败'));
    fr.onload = () => resolve(fr.result);
    fr.readAsArrayBuffer(file);
  });

  // 将 master password + 可选 passphrase + 可选 keyfile（其 SHA-256）组合成 PBKDF2 输入材料
  CryptoUtil.buildKdfMaterial = async ({ masterPassword, passphrase, keyfileBytes }) => {
    const parts = [];
    parts.push(masterPassword ?? '');
    parts.push('\u0000'); // 分隔符
    parts.push(passphrase ?? '');
    parts.push('\u0000');

    if (keyfileBytes && keyfileBytes.byteLength) {
      const hash = await CryptoUtil.sha256(new Uint8Array(keyfileBytes));
      parts.push(CryptoUtil.bytesToB64(hash));
    } else {
      parts.push(''); // 不启用 keyfile 时固定为空，避免分支差异
    }

    return parts.join('');
  };

  // PBKDF2 派生 AES-256-GCM key
  CryptoUtil.deriveAesKey = async ({ kdfMaterial, saltBytes, iterations }) => {
    if (!iterations || iterations < 100000) {
      throw new Error('PBKDF2 迭代次数必须 ≥ 100,000');
    }
    const baseKey = await crypto.subtle.importKey(
      'raw',
      CryptoUtil.utf8ToBytes(kdfMaterial),
      'PBKDF2',
      false,
      ['deriveKey']
    );

    return crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: saltBytes,
        iterations,
        hash: 'SHA-256'
      },
      baseKey,
      {
        name: 'AES-GCM',
        length: 256
      },
      false,
      ['encrypt', 'decrypt']
    );
  };

  // AES-256-GCM 加密 JSON（返回 b64 密文 + iv）
  CryptoUtil.encryptJson = async ({ key, ivBytes, jsonObj, aadBytes }) => {
    const plaintext = CryptoUtil.utf8ToBytes(JSON.stringify(jsonObj));
    const alg = { name: 'AES-GCM', iv: ivBytes };
    if (aadBytes) alg.additionalData = aadBytes;

    const ct = await crypto.subtle.encrypt(alg, key, plaintext);
    return CryptoUtil.bytesToB64(new Uint8Array(ct));
  };

  // AES-256-GCM 解密 JSON
  CryptoUtil.decryptJson = async ({ key, ivBytes, ciphertextB64, aadBytes }) => {
    const ctBytes = CryptoUtil.b64ToBytes(ciphertextB64);
    const alg = { name: 'AES-GCM', iv: ivBytes };
    if (aadBytes) alg.additionalData = aadBytes;

    let pt;
    try {
      pt = await crypto.subtle.decrypt(alg, key, ctBytes);
    } catch (e) {
      // 不泄露细节（避免被用于 side-channel 反馈）
      throw new Error('解密失败：主密码/因子错误或金库已损坏');
    }
    const json = CryptoUtil.bytesToUtf8(new Uint8Array(pt));
    return JSON.parse(json);
  };

  // 轻量强度估算：基于字符集与长度的“近似熵”
  CryptoUtil.estimatePasswordStrength = (pw) => {
    const s = pw || '';
    let pool = 0;
    if (/[a-z]/.test(s)) pool += 26;
    if (/[A-Z]/.test(s)) pool += 26;
    if (/[0-9]/.test(s)) pool += 10;
    if (/[^A-Za-z0-9]/.test(s)) pool += 33; // 粗略符号集
    if (pool === 0) return { score: 0, bits: 0, label: '空' };

    const bits = Math.log2(pool) * s.length;
    // score 0-4
    let score = 0;
    if (bits > 20) score = 1;
    if (bits > 35) score = 2;
    if (bits > 55) score = 3;
    if (bits > 75) score = 4;

    const labels = ['很弱', '弱', '一般', '强', '很强'];
    return { score, bits: Math.round(bits), label: labels[score] };
  };

  // 密码生成器（使用 Web Crypto 随机）
  CryptoUtil.generatePassword = ({ length, upper, lower, nums, syms }) => {
    const U = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const L = 'abcdefghijklmnopqrstuvwxyz';
    const N = '0123456789';
    const S = '!@#$%^&*()-_=+[]{};:,.<>/?|~';

    let chars = '';
    if (upper) chars += U;
    if (lower) chars += L;
    if (nums) chars += N;
    if (syms) chars += S;
    if (!chars) throw new Error('至少选择一种字符集');

    const out = [];
    const rnd = CryptoUtil.randomBytes(length);
    for (let i = 0; i < length; i++) {
      out.push(chars[rnd[i] % chars.length]);
    }
    return out.join('');
  };

  window.CryptoUtil = CryptoUtil;
})();
