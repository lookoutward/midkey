/* vault.js
 * 负责：
 * - 金库数据结构（groups/entries/tags/metadata/settings）
 * - 加密/解密（调用 CryptoUtil）
 * - 导入/导出加密 JSON
 *
 * 注意：持久化（LocalStorage、导出文件）永远只保存加密 JSON。
 */
(() => {
  'use strict';

  const Vault = {};

  const LOCAL_KEY = 'opm.vault.encrypted.v1';
  const THEME_KEY = 'opm.theme';

  Vault.getTheme = () => localStorage.getItem(THEME_KEY) || 'dark';
  Vault.setTheme = (theme) => localStorage.setItem(THEME_KEY, theme);

  // 生成稳定 ID（不依赖外部库）
  Vault.id = (prefix='id') => {
    const b = CryptoUtil.randomBytes(16);
    return `${prefix}_${CryptoUtil.bytesToB64(b).replace(/=+/g,'').replace(/[+/]/g,'_')}`;
  };

  Vault.nowIso = () => new Date().toISOString();

  Vault.createEmptyDecryptedVault = ({ name }) => {
    const rootId = Vault.id('grp');
    return {
      schemaVersion: 1,
      vaultId: Vault.id('vault'),
      name: name || '未命名金库',
      createdAt: Vault.nowIso(),
      updatedAt: Vault.nowIso(),

      settings: {
        autoLockMinutes: 5,
        clipboardClearSeconds: 20
      },

      groups: [
        { id: rootId, name: '根分组', parentId: null, order: 0, createdAt: Vault.nowIso(), modifiedAt: Vault.nowIso() }
      ],
      rootGroupId: rootId,

      entries: [],
      // 预留：可以做密码历史/过期策略/多金库等
      meta: {}
    };
  };

  // 加密金库 JSON 格式（磁盘与 LocalStorage 都用这一份）
  // 仅暴露极少 metadata：kdf 参数、salt、iv、是否启用 passphrase/keyfile 等
  Vault.wrapEncrypted = ({ name, kdf, cipher, factors, ciphertextB64, vaultId, updatedAt }) => {
    return {
      format: 'OfflinePasswordManagerVault',
      version: 1,
      name: name || 'Vault',
      vaultId,
      updatedAt,
      kdf,      // { name:'PBKDF2', hash:'SHA-256', iterations, saltB64 }
      cipher,   // { name:'AES-GCM', keyBits:256, ivB64 }
      factors,  // { passphrase:boolean, keyfile:boolean }
      dataB64: ciphertextB64
    };
  };

  Vault.assertEncryptedShape = (obj) => {
    if (!obj || obj.format !== 'OfflinePasswordManagerVault' || obj.version !== 1) {
      throw new Error('不是受支持的加密金库格式');
    }
    if (!obj.kdf?.iterations || !obj.kdf?.saltB64 || !obj.cipher?.ivB64 || !obj.dataB64) {
      throw new Error('加密金库缺少必要字段');
    }
  };

  // 将解密态 vault -> 加密 JSON（生成新 iv；salt 通常保持不变）
  Vault.encryptVault = async ({
    decryptedVault,
    masterPassword,
    passphrase,
    keyfileBytes,
    iterations,
    saltBytes,
    factors
  }) => {
    const kdfMaterial = await CryptoUtil.buildKdfMaterial({ masterPassword, passphrase, keyfileBytes });
    const key = await CryptoUtil.deriveAesKey({
      kdfMaterial,
      saltBytes,
      iterations
    });

    const ivBytes = CryptoUtil.randomBytes(12); // AES-GCM 推荐 96-bit IV
    const aadBytes = CryptoUtil.utf8ToBytes(`opm:v1:${decryptedVault.vaultId}`);

    decryptedVault.updatedAt = Vault.nowIso();

    const ciphertextB64 = await CryptoUtil.encryptJson({
      key,
      ivBytes,
      jsonObj: decryptedVault,
      aadBytes
    });

    return Vault.wrapEncrypted({
      name: decryptedVault.name,
      vaultId: decryptedVault.vaultId,
      updatedAt: decryptedVault.updatedAt,
      kdf: {
        name: 'PBKDF2',
        hash: 'SHA-256',
        iterations,
        saltB64: CryptoUtil.bytesToB64(saltBytes)
      },
      cipher: {
        name: 'AES-GCM',
        keyBits: 256,
        ivB64: CryptoUtil.bytesToB64(ivBytes)
      },
      factors: {
        passphrase: !!factors?.passphrase,
        keyfile: !!factors?.keyfile
      },
      ciphertextB64
    });
  };

  // 解锁：encrypted JSON + 主密码(+可选因子) -> 解密态 vault
  Vault.decryptVault = async ({ encrypted, masterPassword, passphrase, keyfileBytes }) => {
    Vault.assertEncryptedShape(encrypted);

    const saltBytes = CryptoUtil.b64ToBytes(encrypted.kdf.saltB64);
    const ivBytes = CryptoUtil.b64ToBytes(encrypted.cipher.ivB64);
    const iterations = encrypted.kdf.iterations;

    const kdfMaterial = await CryptoUtil.buildKdfMaterial({ masterPassword, passphrase, keyfileBytes });
    const key = await CryptoUtil.deriveAesKey({ kdfMaterial, saltBytes, iterations });

    const aadBytes = CryptoUtil.utf8ToBytes(`opm:v1:${encrypted.vaultId}`);

    const vault = await CryptoUtil.decryptJson({
      key,
      ivBytes,
      ciphertextB64: encrypted.dataB64,
      aadBytes
    });

    // 最低限度校验
    if (!vault || vault.schemaVersion !== 1 || !Array.isArray(vault.groups) || !Array.isArray(vault.entries)) {
      throw new Error('解密成功但金库结构无效/已损坏');
    }
    return vault;
  };

  Vault.saveEncryptedToLocal = (encrypted) => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(encrypted));
  };

  Vault.loadEncryptedFromLocal = () => {
    const s = localStorage.getItem(LOCAL_KEY);
    if (!s) return null;
    try {
      const obj = JSON.parse(s);
      Vault.assertEncryptedShape(obj);
      return obj;
    } catch {
      return null;
    }
  };

  Vault.clearLocal = () => localStorage.removeItem(LOCAL_KEY);

  // --- 数据操作（在解密态 vault 上进行） ---
  Vault.getRootGroup = (vault) => vault.groups.find(g => g.id === vault.rootGroupId);

  Vault.listGroups = (vault) => vault.groups.slice();

  Vault.addGroup = (vault, { name, parentId }) => {
    const g = {
      id: Vault.id('grp'),
      name: name || '新分组',
      parentId: parentId ?? null,
      order: Vault.computeNextGroupOrder(vault, parentId ?? null),
      createdAt: Vault.nowIso(),
      modifiedAt: Vault.nowIso()
    };
    vault.groups.push(g);
    vault.updatedAt = Vault.nowIso();
    return g;
  };

  Vault.updateGroup = (vault, groupId, patch) => {
    const g = vault.groups.find(x => x.id === groupId);
    if (!g) throw new Error('分组不存在');
    Object.assign(g, patch);
    g.modifiedAt = Vault.nowIso();
    vault.updatedAt = Vault.nowIso();
    return g;
  };

  Vault.deleteGroup = (vault, groupId) => {
    if (groupId === vault.rootGroupId) throw new Error('不能删除根分组');
    const hasChildren = vault.groups.some(g => g.parentId === groupId);
    if (hasChildren) throw new Error('该分组下还有子分组，请先移动/删除子分组');

    // 将该分组下条目移动到父分组（或根分组）
    const g = vault.groups.find(x => x.id === groupId);
    if (!g) throw new Error('分组不存在');

    const fallback = g.parentId ?? vault.rootGroupId;
    vault.entries.forEach(e => {
      if (e.groupId === groupId) e.groupId = fallback;
    });

    vault.groups = vault.groups.filter(x => x.id !== groupId);
    vault.updatedAt = Vault.nowIso();
  };

  Vault.computeNextGroupOrder = (vault, parentId) => {
    const siblings = vault.groups.filter(g => (g.parentId ?? null) === (parentId ?? null));
    return siblings.length ? Math.max(...siblings.map(s => s.order ?? 0)) + 1 : 0;
  };

  Vault.computeNextEntryOrder = (vault, groupId) => {
    const siblings = vault.entries.filter(e => e.groupId === groupId);
    return siblings.length ? Math.max(...siblings.map(s => s.order ?? 0)) + 1 : 0;
  };

  Vault.addEntry = (vault, entry) => {
    const now = Vault.nowIso();
    const e = {
      id: Vault.id('ent'),
      title: entry.title || '新条目',
      username: entry.username || '',
      password: entry.password || '',
      url: entry.url || '',
      notes: entry.notes || '',
      tags: Array.isArray(entry.tags) ? entry.tags : [],
      customFields: Array.isArray(entry.customFields) ? entry.customFields : [],
      favorite: !!entry.favorite,
      groupId: entry.groupId || vault.rootGroupId,
      order: Vault.computeNextEntryOrder(vault, entry.groupId || vault.rootGroupId),
      createdAt: now,
      modifiedAt: now
    };
    vault.entries.push(e);
    vault.updatedAt = now;
    return e;
  };

  Vault.updateEntry = (vault, entryId, patch) => {
    const e = vault.entries.find(x => x.id === entryId);
    if (!e) throw new Error('条目不存在');
    Object.assign(e, patch);
    e.modifiedAt = Vault.nowIso();
    vault.updatedAt = Vault.nowIso();
    return e;
  };

  Vault.deleteEntry = (vault, entryId) => {
    vault.entries = vault.entries.filter(x => x.id !== entryId);
    vault.updatedAt = Vault.nowIso();
  };

  Vault.listTags = (vault) => {
    const set = new Set();
    vault.entries.forEach(e => (e.tags || []).forEach(t => set.add(t)));
    return Array.from(set).sort((a,b)=>a.localeCompare(b,'zh-CN'));
  };

  Vault.sortGroupsByOrder = (vault) => {
    vault.groups.sort((a,b) => (a.order ?? 0) - (b.order ?? 0));
  };

  Vault.sortEntriesByOrder = (vault) => {
    vault.entries.sort((a,b) => (a.order ?? 0) - (b.order ?? 0));
  };

  window.Vault = Vault;
})();
