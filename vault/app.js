/* app.js
 * Midkey Vault（文件驱动版）
 * - 不使用 localStorage 保存金库
 * - 金库文件为唯一来源：打开文件 -> 解锁 -> 编辑 -> 导出/写回
 * - 若浏览器支持 File System Access API，则可写回原文件；否则下载导出
 */
(() => {
  'use strict';

  // --------------------
  // 全局状态（解锁期间只存在内存中）
  // --------------------
  const State = {
    encrypted: null,          // 已加载的加密 JSON（内存）
    vault: null,              // 解密后的 vault（仅内存）
    unlocked: false,

    // 解锁所需材料（仅内存；退出即清空）
    masterPassword: null,
    passphrase: null,
    keyfileBytes: null,

    // 文件绑定
    fileName: '',
    fileHandle: null,         // FileSystemFileHandle（仅在 FSA 打开时存在）

    // UI 选择
    currentGroupId: null,
    currentEntryId: null,
    showFavorites: false,
    search: '',
    tagFilter: '',

    // 自动锁定
    inactivityTimer: null,
    inactivityMs: 5 * 60 * 1000,

    // 剪贴板清空
    clipboardTimer: null,

    // 分组/条目编辑
    editingGroupId: null,
    editingEntryId: null
  };

  // --------------------
  // DOM
  // --------------------
  const $ = (id) => document.getElementById(id);

  const el = {
    // views
    authView: $('authView'),
    appView: $('appView'),

    // topbar
    vaultStatusBadge: $('vaultStatusBadge'),
    btnTheme: $('btnTheme'),
    btnExport: $('btnExport'),
    btnSettings: $('btnSettings'),
    btnExit: $('btnExit'),

    // open/unlock/create
    btnOpenVault: $('btnOpenVault'),
    selectedVaultName: $('selectedVaultName'),
    fileImportVault: $('fileImportVault'),

    unlockMaster: $('unlockMaster'),
    unlockPassphrase: $('unlockPassphrase'),
    unlockKeyfile: $('unlockKeyfile'),
    btnUnlock: $('btnUnlock'),
    unlockMsg: $('unlockMsg'),

    newVaultName: $('newVaultName'),
    newMaster: $('newMaster'),
    newMaster2: $('newMaster2'),
    chkUsePassphrase: $('chkUsePassphrase'),
    newPassphrase: $('newPassphrase'),
    chkUseKeyfile: $('chkUseKeyfile'),
    newKeyfile: $('newKeyfile'),
    kdfIterations: $('kdfIterations'),
    btnCreateVault: $('btnCreateVault'),
    createMsg: $('createMsg'),

    // settings modal
    settingsModal: $('settingsModal'),
    btnCloseSettings: $('btnCloseSettings'),
    btnCancelSettings: $('btnCancelSettings'),
    btnSaveSettings: $('btnSaveSettings'),
    vaultFileInfo: $('vaultFileInfo'),
    autoLockMinutes: $('autoLockMinutes'),
    clipboardClearSeconds: $('clipboardClearSeconds'),

    // sidebar
    groupTree: $('groupTree'),
    btnAddGroup: $('btnAddGroup'),
    btnFavorites: $('btnFavorites'),
    btnAll: $('btnAll'),
    tagFilter: $('tagFilter'),

    // main
    searchInput: $('searchInput'),
    btnClearSearch: $('btnClearSearch'),
    btnAddEntry: $('btnAddEntry'),
    entryList: $('entryList'),
    detailsPane: $('detailsPane'),
    listTitle: $('listTitle'),
    listCount: $('listCount'),

    // entry modal
    entryModal: $('entryModal'),
    btnCloseEntryModal: $('btnCloseEntryModal'),
    btnCancelEntry: $('btnCancelEntry'),
    btnSaveEntry: $('btnSaveEntry'),
    btnDeleteEntry: $('btnDeleteEntry'),
    entryMeta: $('entryMeta'),

    eTitle: $('eTitle'),
    eGroup: $('eGroup'),
    eUsername: $('eUsername'),
    eUrl: $('eUrl'),
    ePassword: $('ePassword'),
    btnTogglePw: $('btnTogglePw'),
    btnCopyPw: $('btnCopyPw'),
    eNotes: $('eNotes'),
    eTags: $('eTags'),
    eFav: $('eFav'),
    customFields: $('customFields'),
    btnAddCustomField: $('btnAddCustomField'),

    pwStrengthBar: $('pwStrengthBar'),
    pwStrengthText: $('pwStrengthText'),

    genLen: $('genLen'),
    genLenLabel: $('genLenLabel'),
    genUpper: $('genUpper'),
    genLower: $('genLower'),
    genNums: $('genNums'),
    genSyms: $('genSyms'),
    btnGeneratePw: $('btnGeneratePw'),
    btnUseGenerated: $('btnUseGenerated'),
    genOut: $('genOut'),

    // group modal
    groupModal: $('groupModal'),
    btnCloseGroupModal: $('btnCloseGroupModal'),
    btnCancelGroup: $('btnCancelGroup'),
    btnSaveGroup: $('btnSaveGroup'),
    btnDeleteGroup: $('btnDeleteGroup'),
    gName: $('gName'),
    gParent: $('gParent')
  };

  // --------------------
  // 工具函数
  // --------------------
  const ui = {
    msg: (node, text, type = 'info') => {
      node.textContent = text || '';
      node.style.color = (type === 'error') ? 'var(--danger)'
                       : (type === 'ok') ? 'var(--ok)'
                       : 'var(--muted)';
    },
    show: (node) => node.classList.remove('hidden'),
    hide: (node) => node.classList.add('hidden'),
    escapeHtml: (s) => (s ?? '').replace(/[&<>\"']/g, (c) => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '\"': '&quot;', "'": '&#39;'
    }[c])),
    clampInt: (v, min, max, fallback) => {
      const n = parseInt(v, 10);
      if (Number.isNaN(n)) return fallback;
      return Math.max(min, Math.min(max, n));
    },
    clearInput: (...nodes) => nodes.forEach(n => { if (n) n.value = ''; })
  };

  const parseTags = (s) => (s || '')
    .split(',')
    .map(x => x.trim())
    .filter(Boolean)
    .slice(0, 40);

  const formatDate = (iso) => {
    if (!iso) return '';
    try { return new Date(iso).toLocaleString(); } catch { return iso; }
  };

  const downloadJson = (obj, filename) => {
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const sanitizeFileStem = (name) => {
    const s = (name || '').trim() || 'vault';
    return s.replace(/[^0-9A-Za-z\u4e00-\u9fa5-_]+/g, '_').replace(/_+/g, '_').slice(0, 60);
  };

  const ts2 = (n) => String(n).padStart(2, '0');
  const formatTimestamp = (d = new Date()) => {
    const Y = d.getFullYear();
    const M = ts2(d.getMonth() + 1);
    const D = ts2(d.getDate());
    const h = ts2(d.getHours());
    const m = ts2(d.getMinutes());
    return `${Y}-${M}-${D}_${h}-${m}`;
  };

  const computeExportFileName = () => {
    const stem = sanitizeFileStem(State.vault?.name || State.encrypted?.name || 'vault');
    return `${stem}-vault-${formatTimestamp()}.json`;
  };

  // --------------------
  // File System Access API：能力检测与读写
  // --------------------
  const supportsFSA = () =>
    typeof window.showOpenFilePicker === 'function' &&
    typeof FileSystemFileHandle !== 'undefined';

  const refreshSelectedVaultUi = () => {
    const name = State.fileName ? State.fileName : '未选择文件';
    el.selectedVaultName.textContent = name;
    refreshVaultFileInfoUi();
  };

  const refreshVaultFileInfoUi = () => {
    const canWriteBack = !!State.fileHandle && supportsFSA() && window.isSecureContext;
    if (el.vaultFileInfo) {
      el.vaultFileInfo.textContent = canWriteBack
        ? `已打开：${State.fileName || '（未知文件）'}（支持写回原文件）`
        : (State.fileName ? `已打开：${State.fileName}（导出将下载新文件）` : '未选择文件');
    }

    if (el.btnExport) {
      el.btnExport.title = canWriteBack
        ? `保存：将写回原文件（${State.fileName || ''}）`
        : '导出：将下载新文件（若需写回，请在 Chrome/Edge 的 HTTPS/localhost 环境打开并重新“打开 Vault”）';
    }
  };

  const ensureReadWritePermissionIfNeeded = async (handle) => {
    if (!handle || typeof handle.queryPermission !== 'function') return true;

    const cur = await handle.queryPermission({ mode: 'readwrite' });
    if (cur === 'granted') return true;

    const req = await handle.requestPermission({ mode: 'readwrite' });
    return req === 'granted';
  };

  const writeEncryptedBackToHandle = async (handle, encryptedObj) => {
    const ok = await ensureReadWritePermissionIfNeeded(handle);
    if (!ok) throw new Error('未获得写入权限');

    const writable = await handle.createWritable();
    const text = JSON.stringify(encryptedObj, null, 2);
    await writable.write(new Blob([text], { type: 'application/json' }));
    await writable.close();
  };

  const loadEncryptedFromText = (text) => {
    const obj = JSON.parse(text);
    Vault.assertEncryptedShape(obj);
    State.encrypted = obj;
  };

  // 单按钮打开：自动选择 FSA 或 file input fallback
  const openVaultAuto = async () => {
    if (supportsFSA() && window.isSecureContext) {
      const [handle] = await window.showOpenFilePicker({
        multiple: false,
        excludeAcceptAllOption: true,
        types: [{
          description: 'Vault JSON',
          accept: { 'application/json': ['.json'] }
        }]
      });

      const file = await handle.getFile();
      const text = await file.text();
      loadEncryptedFromText(text);

      State.fileHandle = handle;
      State.fileName = file.name || 'vault.json';

      refreshSelectedVaultUi();
      ui.msg(el.unlockMsg, `已打开：${State.fileName}。请输入主密码后点击“解锁”。`, 'ok');
      return;
    }

    // fallback（只读）
    el.fileImportVault.click();
  };

  // --------------------
  // 安全：自动锁定 & 活动检测
  // --------------------
  const resetInactivityTimer = () => {
    if (!State.unlocked) return;
    if (State.inactivityTimer) clearTimeout(State.inactivityTimer);
    State.inactivityTimer = setTimeout(() => {
      exitToLogin('自动锁定：长时间无操作');
    }, State.inactivityMs);
  };

  const attachInactivityListeners = () => {
    const events = ['mousemove','mousedown','keydown','scroll','touchstart'];
    events.forEach(evt => window.addEventListener(evt, resetInactivityTimer, { passive: true }));
  };

  const setAutoLockMinutes = (minutes) => {
    const m = ui.clampInt(minutes, 1, 240, 5);
    State.inactivityMs = m * 60 * 1000;
    resetInactivityTimer();
  };

  // --------------------
  // 剪贴板：复制 + 自动清空
  // --------------------
  const writeClipboard = async (text) => {
    if (navigator.clipboard?.writeText) {
      return navigator.clipboard.writeText(text);
    }
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    if (!ok) throw new Error('复制失败：浏览器不允许剪贴板操作');
  };

  const scheduleClipboardClear = async () => {
    const sec = ui.clampInt(el.clipboardClearSeconds.value, 1, 300, 20);
    if (State.clipboardTimer) clearTimeout(State.clipboardTimer);
    State.clipboardTimer = setTimeout(async () => {
      try { await writeClipboard(''); } catch { /* 忽略 */ }
    }, sec * 1000);
  };

  // --------------------
  // 状态切换：未登录 / 已登录
  // --------------------
  const enterLoggedInUi = () => {
    State.unlocked = true;
    ui.hide(el.authView);
    ui.show(el.appView);

    el.btnExport.disabled = false;
    el.btnSettings.disabled = false;
    el.btnExit.disabled = false;

    el.vaultStatusBadge.textContent = '已登录';
    el.vaultStatusBadge.style.color = 'var(--ok)';

    State.currentGroupId = State.vault.rootGroupId;
    State.currentEntryId = null;
    State.showFavorites = false;
    State.search = '';
    State.tagFilter = '';

    el.autoLockMinutes.value = State.vault.settings.autoLockMinutes ?? 5;
    el.clipboardClearSeconds.value = State.vault.settings.clipboardClearSeconds ?? 20;
    setAutoLockMinutes(el.autoLockMinutes.value);

    refreshAll();
    resetInactivityTimer();
    refreshVaultFileInfoUi();
  };

  const exitToLogin = (reason) => {
    State.unlocked = false;
    State.vault = null;
    State.masterPassword = null;
    State.passphrase = null;
    State.keyfileBytes = null;
    State.currentEntryId = null;

    if (State.inactivityTimer) clearTimeout(State.inactivityTimer);
    State.inactivityTimer = null;

    if (State.clipboardTimer) clearTimeout(State.clipboardTimer);
    State.clipboardTimer = null;

    ui.show(el.authView);
    ui.hide(el.appView);

    el.btnExport.disabled = true;
    el.btnSettings.disabled = true;
    el.btnExit.disabled = true;

    el.vaultStatusBadge.textContent = '未登录';
    el.vaultStatusBadge.style.color = '';

    ui.clearInput(el.unlockMaster, el.unlockPassphrase, el.newMaster, el.newMaster2, el.newPassphrase);
    el.unlockKeyfile.value = '';
    el.newKeyfile.value = '';

    ui.msg(el.unlockMsg, reason || '已退出', 'info');
  };

  // --------------------
  // 加密刷新（内存里保持密文是最新）
  // --------------------
  const saveEncryptedNow = async () => {
    if (!State.vault || !State.encrypted) return;

    const saltBytes = CryptoUtil.b64ToBytes(State.encrypted.kdf.saltB64);
    const iterations = State.encrypted.kdf.iterations;
    const factors = State.encrypted.factors || { passphrase: false, keyfile: false };

    const encrypted = await Vault.encryptVault({
      decryptedVault: State.vault,
      masterPassword: State.masterPassword,
      passphrase: State.passphrase,
      keyfileBytes: State.keyfileBytes,
      iterations,
      saltBytes,
      factors
    });

    State.encrypted = encrypted;
  };

  // --------------------
  // 打开/解锁/创建
  // --------------------
  const unlockWithEncrypted = async (encrypted, masterPassword, passphrase, keyfileBytes) => {
    const vault = await Vault.decryptVault({ encrypted, masterPassword, passphrase, keyfileBytes });

    State.encrypted = encrypted;
    State.vault = vault;

    State.masterPassword = masterPassword;
    State.passphrase = passphrase || null;
    State.keyfileBytes = keyfileBytes || null;

    enterLoggedInUi();
  };

  const createNewVault = async () => {
    const name = (el.newVaultName.value || '').trim() || 'vault';
    const mp = el.newMaster.value || '';
    const mp2 = el.newMaster2.value || '';

    if (!mp || mp.length < 8) throw new Error('主密码至少 8 位（建议更长）');
    if (mp !== mp2) throw new Error('两次输入的主密码不一致');

    const usePassphrase = !!el.chkUsePassphrase.checked;
    const passphrase = usePassphrase ? (el.newPassphrase.value || '') : '';
    if (usePassphrase && passphrase.length < 6) throw new Error('第二因子口令建议至少 6 位');

    const useKeyfile = !!el.chkUseKeyfile.checked;
    let keyfileBytes = null;
    if (useKeyfile) {
      const f = el.newKeyfile.files?.[0];
      if (!f) throw new Error('已勾选 Keyfile，请选择文件');
      keyfileBytes = await CryptoUtil.readFileAsArrayBuffer(f);
    }

    const iterations = ui.clampInt(el.kdfIterations.value, 100000, 2000000, 200000);
    const saltBytes = CryptoUtil.randomBytes(16);

    const vault = Vault.createEmptyDecryptedVault({ name });
    Vault.addGroup(vault, { name: '网站', parentId: vault.rootGroupId });
    Vault.addGroup(vault, { name: '邮箱', parentId: vault.rootGroupId });
    Vault.addGroup(vault, { name: '银行', parentId: vault.rootGroupId });

    const encrypted = await Vault.encryptVault({
      decryptedVault: vault,
      masterPassword: mp,
      passphrase: usePassphrase ? passphrase : '',
      keyfileBytes,
      iterations,
      saltBytes,
      factors: { passphrase: usePassphrase, keyfile: useKeyfile }
    });

    State.encrypted = encrypted;
    State.fileHandle = null;
    State.fileName = '';
    refreshSelectedVaultUi();

    await unlockWithEncrypted(encrypted, mp, usePassphrase ? passphrase : '', keyfileBytes);

    alert('金库已创建并进入系统。请点击右上角“导出金库（加密）”保存为文件。');
  };

  // --------------------
  // 设置弹窗
  // --------------------
  const openSettingsModal = () => {
    if (!State.vault) return;
    el.autoLockMinutes.value = State.vault.settings.autoLockMinutes ?? 5;
    el.clipboardClearSeconds.value = State.vault.settings.clipboardClearSeconds ?? 20;
    refreshVaultFileInfoUi();
    ui.show(el.settingsModal);
  };

  const closeSettingsModal = () => ui.hide(el.settingsModal);

  // --------------------
  // Groups tree / Entries 渲染（以下保持原交互）
  // --------------------
  const buildGroupOptions = (vault, includeNone = false) => {
    const groups = Vault.listGroups(vault);
    Vault.sortGroupsByOrder(vault);

    const childrenMap = new Map();
    groups.forEach(g => {
      const pid = g.parentId ?? null;
      if (!childrenMap.has(pid)) childrenMap.set(pid, []);
      childrenMap.get(pid).push(g);
    });
    const root = vault.rootGroupId;

    const options = [];
    if (includeNone) options.push({ id: '', label: '（无 / 顶级）' });

    const walk = (parentId, depth) => {
      const kids = (childrenMap.get(parentId ?? null) || [])
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      for (const g of kids) {
        if (g.id === root && includeNone) continue;
        const prefix = '—'.repeat(depth);
        options.push({ id: g.id, label: `${prefix}${prefix ? ' ' : ''}${g.name}` });
        walk(g.id, depth + 1);
      }
    };
    walk(null, 0);
    return options;
  };

  const safeParseDrag = (s) => { try { return JSON.parse(s); } catch { return null; } };

  const isGroupDescendant = (vault, candidateChildId, candidateParentId) => {
    let cur = vault.groups.find(g => g.id === candidateParentId);
    while (cur) {
      if (cur.parentId === candidateChildId) return true;
      cur = vault.groups.find(g => g.id === cur.parentId);
    }
    return false;
  };

  const tryMoveGroup = async (groupId, newParentId) => {
    const vault = State.vault;
    if (!vault) return;
    if (groupId === vault.rootGroupId) return;
    if (groupId === newParentId) return;
    if (isGroupDescendant(vault, groupId, newParentId)) return;

    Vault.updateGroup(vault, groupId, { parentId: newParentId, order: Vault.computeNextGroupOrder(vault, newParentId) });
    await saveEncryptedNow();
    refreshAll();
  };

  const tryReorderGroup = async (dragGroupId, dropOnGroupId) => {
    const vault = State.vault;
    if (!vault) return;

    const a = vault.groups.find(g => g.id === dragGroupId);
    const b = vault.groups.find(g => g.id === dropOnGroupId);
    if (!a || !b) return;
    if ((a.parentId ?? null) !== (b.parentId ?? null)) return;

    const tmp = a.order ?? 0;
    a.order = b.order ?? 0;
    b.order = tmp;
    a.modifiedAt = Vault.nowIso();
    b.modifiedAt = Vault.nowIso();

    await saveEncryptedNow();
    refreshAll();
  };

  const renderGroupTree = () => {
    const vault = State.vault;
    if (!vault) return;

    Vault.sortGroupsByOrder(vault);

    const groups = Vault.listGroups(vault);
    const childrenMap = new Map();
    groups.forEach(g => {
      const pid = g.parentId ?? null;
      if (!childrenMap.has(pid)) childrenMap.set(pid, []);
      childrenMap.get(pid).push(g);
    });

    el.groupTree.innerHTML = '';

    const makeGroupRow = (g, depth) => {
      const row = document.createElement('div');
      row.className = 'groupItem' + (State.currentGroupId === g.id ? ' active' : '');
      row.dataset.groupId = g.id;
      row.draggable = (g.id !== vault.rootGroupId);

      row.addEventListener('dragstart', (ev) => {
        ev.dataTransfer.setData('text/plain', JSON.stringify({ type: 'group', groupId: g.id }));
        ev.dataTransfer.effectAllowed = 'move';
      });
      row.addEventListener('dragover', (ev) => {
        ev.preventDefault();
        row.style.borderColor = 'rgba(91,140,255,.7)';
      });
      row.addEventListener('dragleave', () => { row.style.borderColor = ''; });
      row.addEventListener('drop', (ev) => {
        ev.preventDefault();
        row.style.borderColor = '';
        const payload = safeParseDrag(ev.dataTransfer.getData('text/plain'));
        if (!payload) return;

        if (payload.type === 'entry') {
          tryMoveEntryToGroup(payload.entryId, g.id);
          return;
        }
        if (payload.type === 'group') {
          tryMoveGroup(payload.groupId, g.id);
          return;
        }
        if (payload.type === 'group-reorder') {
          tryReorderGroup(payload.groupId, g.id);
          return;
        }
      });

      const left = document.createElement('div');
      left.className = 'groupLeft';

      const depthDot = document.createElement('div');
      depthDot.className = 'groupDepth';
      depthDot.style.marginLeft = `${depth * 10}px`;

      const name = document.createElement('div');
      name.className = 'groupName';
      name.textContent = (g.id === vault.rootGroupId) ? '全部条目（根）' : g.name;

      left.appendChild(depthDot);
      left.appendChild(document.createTextNode('📁'));
      left.appendChild(name);

      const actions = document.createElement('div');
      actions.className = 'groupActions';

      const btnEdit = document.createElement('button');
      btnEdit.className = 'btn small ghost';
      btnEdit.textContent = '编辑';
      btnEdit.disabled = (g.id === vault.rootGroupId);
      btnEdit.addEventListener('click', (ev) => {
        ev.stopPropagation();
        openGroupModal(g.id);
      });

      const btnReorder = document.createElement('button');
      btnReorder.className = 'btn small ghost';
      btnReorder.textContent = '拖拽排序';
      btnReorder.disabled = (g.id === vault.rootGroupId);
      btnReorder.draggable = (g.id !== vault.rootGroupId);
      btnReorder.addEventListener('dragstart', (ev) => {
        ev.dataTransfer.setData('text/plain', JSON.stringify({ type: 'group-reorder', groupId: g.id }));
        ev.dataTransfer.effectAllowed = 'move';
      });

      actions.appendChild(btnEdit);
      actions.appendChild(btnReorder);

      row.appendChild(left);
      row.appendChild(actions);

      row.addEventListener('click', () => {
        State.showFavorites = false;
        State.currentGroupId = g.id;
        State.currentEntryId = null;
        renderAllMain();
        renderGroupTree();
      });

      return row;
    };

    const walk = (parentId, depth) => {
      const kids = (childrenMap.get(parentId ?? null) || []).slice()
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      for (const g of kids) {
        el.groupTree.appendChild(makeGroupRow(g, depth));
        walk(g.id, depth + 1);
      }
    };

    walk(null, 0);
  };

  const getFilteredEntries = () => {
    const vault = State.vault;
    if (!vault) return [];

    Vault.sortEntriesByOrder(vault);

    let list = vault.entries.slice();

    if (State.showFavorites) list = list.filter(e => !!e.favorite);
    else if (State.currentGroupId) list = list.filter(e => e.groupId === State.currentGroupId);

    if (State.tagFilter) list = list.filter(e => (e.tags || []).includes(State.tagFilter));

    const q = (State.search || '').trim().toLowerCase();
    if (q) {
      list = list.filter(e => {
        const hay = [
          e.title, e.username, e.url, e.notes,
          ...(e.tags || []),
          ...(e.customFields || []).flatMap(cf => [cf.key, cf.value])
        ].join('\n').toLowerCase();
        return hay.includes(q);
      });
    }

    return list;
  };

  const renderEntryList = () => {
    const vault = State.vault;
    if (!vault) return;

    const list = getFilteredEntries();
    el.entryList.innerHTML = '';

    el.listTitle.textContent = State.showFavorites ? '收藏' : '条目';
    el.listCount.textContent = `${list.length} 个`;

    for (const e of list) {
      const card = document.createElement('div');
      card.className = 'entryCard' + (State.currentEntryId === e.id ? ' active' : '');
      card.dataset.entryId = e.id;
      card.draggable = true;

      card.addEventListener('dragstart', (ev) => {
        ev.dataTransfer.setData('text/plain', JSON.stringify({ type: 'entry', entryId: e.id }));
        ev.dataTransfer.effectAllowed = 'move';
      });

      card.addEventListener('click', () => {
        State.currentEntryId = e.id;
        renderEntryList();
        renderDetailsPane();
      });

      const row = document.createElement('div');
      row.className = 'entryTitleRow';

      const title = document.createElement('div');
      title.className = 'entryTitle';
      title.textContent = e.title || '(无标题)';

      const star = document.createElement('div');
      star.textContent = e.favorite ? '★' : '';
      star.style.color = 'var(--warn)';

      row.appendChild(title);
      row.appendChild(star);

      const meta = document.createElement('div');
      meta.className = 'entryMeta';

      const u = document.createElement('span');
      u.textContent = e.username ? `👤 ${e.username}` : '👤 —';
      meta.appendChild(u);

      const t = document.createElement('span');
      t.textContent = e.url ? `🔗 ${e.url}` : '🔗 —';
      meta.appendChild(t);

      const tags = (e.tags || []).slice(0, 3);
      tags.forEach(tag => {
        const pill = document.createElement('span');
        pill.className = 'tag';
        pill.textContent = `#${tag}`;
        meta.appendChild(pill);
      });

      card.appendChild(row);
      card.appendChild(meta);
      el.entryList.appendChild(card);
    }

    if (!list.some(x => x.id === State.currentEntryId)) {
      State.currentEntryId = null;
      renderDetailsPane();
    }
  };

  const renderDetailsPane = () => {
    const vault = State.vault;
    if (!vault) return;

    const e = vault.entries.find(x => x.id === State.currentEntryId);
    if (!e) {
      el.detailsPane.innerHTML = `<div class="placeholder">选择一个条目查看详情</div>`;
      return;
    }

    const group = vault.groups.find(g => g.id === e.groupId);
    const groupName = group ? group.name : '（未知分组）';

    const tagsHtml = (e.tags || []).map(t => `<span class="tag">#${ui.escapeHtml(t)}</span>`).join(' ');

    const cfHtml = (e.customFields || [])
      .map(cf => `
        <div class="detailItem">
          <div class="detailLabel">${ui.escapeHtml(cf.key || '字段')}</div>
          <div class="detailValue">${ui.escapeHtml(cf.value || '')}</div>
        </div>
      `).join('');

    el.detailsPane.innerHTML = `
      <div class="detailsHead">
        <div>
          <div class="detailsTitle">${ui.escapeHtml(e.title || '(无标题)')} ${e.favorite ? '<span style="color:var(--warn)">★</span>' : ''}</div>
          <div class="muted small">分组：${ui.escapeHtml(groupName)} &nbsp;|&nbsp; ${tagsHtml || '<span class="muted">无标签</span>'}</div>
        </div>
        <div class="detailsActions">
          <button class="btn small" id="dCopyUser">复制用户名</button>
          <button class="btn small" id="dCopyPw">复制密码</button>
          <button class="btn small ghost" id="dToggleFav">${e.favorite ? '取消收藏' : '收藏'}</button>
          <button class="btn small" id="dEdit">编辑</button>
        </div>
      </div>

      <div class="detailsGrid">
        <div class="detailItem">
          <div class="detailLabel">用户名</div>
          <div class="detailValue">${ui.escapeHtml(e.username || '')}</div>
        </div>

        <div class="detailItem">
          <div class="detailLabel">URL</div>
          <div class="detailValue">${ui.escapeHtml(e.url || '')}</div>
        </div>

        <div class="detailItem">
          <div class="detailLabel">密码（不显示，点击复制）</div>
          <div class="detailValue">••••••••••••</div>
        </div>

        <div class="detailItem">
          <div class="detailLabel">备注</div>
          <div class="detailValue">${ui.escapeHtml(e.notes || '')}</div>
        </div>

        ${cfHtml || ''}
      </div>

      <div class="muted small" style="margin-top:10px">
        创建：${ui.escapeHtml(formatDate(e.createdAt))} &nbsp;|&nbsp;
        修改：${ui.escapeHtml(formatDate(e.modifiedAt))}
      </div>
    `;

    $('dEdit').addEventListener('click', () => openEntryModal(e.id));
    $('dToggleFav').addEventListener('click', async () => {
      Vault.updateEntry(vault, e.id, { favorite: !e.favorite });
      await saveEncryptedNow();
      refreshAllMainOnly();
    });

    $('dCopyUser').addEventListener('click', async () => {
      try {
        await writeClipboard(e.username || '');
        await scheduleClipboardClear();
      } catch (err) {
        alert(err.message);
      }
    });

    $('dCopyPw').addEventListener('click', async () => {
      try {
        await writeClipboard(e.password || '');
        await scheduleClipboardClear();
      } catch (err) {
        alert(err.message);
      }
    });
  };

  const renderTagFilter = () => {
    const vault = State.vault;
    if (!vault) return;

    const tags = Vault.listTags(vault);
    el.tagFilter.innerHTML = `<option value="">（全部标签）</option>` +
      tags.map(t => `<option value="${ui.escapeHtml(t)}">${ui.escapeHtml(t)}</option>`).join('');

    el.tagFilter.value = State.tagFilter || '';
  };

  const renderAllMain = () => {
    renderTagFilter();
    renderEntryList();
    renderDetailsPane();
  };

  const refreshAllMainOnly = () => {
    renderEntryList();
    renderDetailsPane();
    renderTagFilter();
  };

  const refreshAll = () => {
    renderGroupTree();
    renderAllMain();
  };

  // --------------------
  // Entry modal / Group modal / Entry move（略：与原逻辑一致）
  // --------------------
  const updateStrengthUi = (pw) => {
    const st = CryptoUtil.estimatePasswordStrength(pw);
    const pct = [0, 25, 50, 75, 100][st.score];
    el.pwStrengthBar.style.width = `${pct}%`;
    el.pwStrengthBar.style.background =
      (st.score <= 1) ? 'var(--danger)' :
      (st.score === 2) ? 'var(--warn)' :
      'var(--ok)';
    el.pwStrengthText.textContent = `强度：${st.label}（约 ${st.bits} bits）`;
  };

  const addCustomFieldRow = (key = '', value = '') => {
    const row = document.createElement('div');
    row.className = 'cfRow';

    const k = document.createElement('input');
    k.type = 'text';
    k.placeholder = '字段名';
    k.value = key;

    const v = document.createElement('input');
    v.type = 'text';
    v.placeholder = '值';
    v.value = value;

    const del = document.createElement('button');
    del.className = 'btn small danger';
    del.textContent = '删除';
    del.type = 'button';
    del.addEventListener('click', () => row.remove());

    row.appendChild(k);
    row.appendChild(v);
    row.appendChild(del);
    el.customFields.appendChild(row);
  };

  const collectCustomFields = () => {
    const rows = Array.from(el.customFields.querySelectorAll('.cfRow'));
    return rows.map(r => {
      const inputs = r.querySelectorAll('input');
      return { key: (inputs[0].value || '').trim(), value: (inputs[1].value || '').trim() };
    }).filter(cf => cf.key || cf.value).slice(0, 40);
  };

  const openEntryModal = (entryId) => {
    const vault = State.vault;
    if (!vault) return;

    State.editingEntryId = entryId || null;
    const isNew = !entryId;

    const entry = entryId
      ? vault.entries.find(x => x.id === entryId)
      : {
          title: '',
          username: '',
          password: '',
          url: '',
          notes: '',
          tags: [],
          customFields: [],
          favorite: false,
          groupId: State.currentGroupId || vault.rootGroupId
        };

    const opts = buildGroupOptions(vault, false);
    el.eGroup.innerHTML = opts.map(o => `<option value="${o.id}">${ui.escapeHtml(o.label)}</option>`).join('');
    el.eGroup.value = entry.groupId || vault.rootGroupId;

    el.eTitle.value = entry.title || '';
    el.eUsername.value = entry.username || '';
    el.eUrl.value = entry.url || '';
    el.ePassword.value = entry.password || '';
    el.eNotes.value = entry.notes || '';
    el.eTags.value = (entry.tags || []).join(', ');
    el.eFav.checked = !!entry.favorite;

    el.customFields.innerHTML = '';
    (entry.customFields || []).forEach(cf => addCustomFieldRow(cf.key, cf.value));

    el.entryMeta.textContent = entryId
      ? `创建：${formatDate(entry.createdAt)}  |  修改：${formatDate(entry.modifiedAt)}`
      : '新条目';

    el.btnDeleteEntry.style.display = isNew ? 'none' : 'inline-flex';

    updateStrengthUi(el.ePassword.value);

    ui.show(el.entryModal);
    $('entryModalTitle').textContent = isNew ? '新增条目' : '编辑条目';
    el.eTitle.focus();
  };

  const closeEntryModal = () => {
    ui.hide(el.entryModal);
    State.editingEntryId = null;
    el.ePassword.value = '';
  };

  const openGroupModal = (groupId) => {
    const vault = State.vault;
    if (!vault) return;

    State.editingGroupId = groupId || null;
    const isNew = !groupId;

    const g = groupId
      ? vault.groups.find(x => x.id === groupId)
      : { name: '', parentId: null };

    const opts = buildGroupOptions(vault, true).filter(o => o.id !== groupId);
    el.gParent.innerHTML = opts.map(o => `<option value="${o.id}">${ui.escapeHtml(o.label)}</option>`).join('');
    el.gParent.value = g.parentId ?? '';

    el.gName.value = g.name || '';
    el.btnDeleteGroup.style.display = isNew ? 'none' : 'inline-flex';

    ui.show(el.groupModal);
    $('groupModalTitle').textContent = isNew ? '新增分组' : '编辑分组';
    el.gName.focus();
  };

  const closeGroupModal = () => {
    ui.hide(el.groupModal);
    State.editingGroupId = null;
  };

  const tryMoveEntryToGroup = async (entryId, newGroupId) => {
    const vault = State.vault;
    if (!vault) return;

    const e = vault.entries.find(x => x.id === entryId);
    if (!e) return;

    Vault.updateEntry(vault, entryId, { groupId: newGroupId, order: Vault.computeNextEntryOrder(vault, newGroupId) });
    await saveEncryptedNow();
    refreshAllMainOnly();
    renderGroupTree();
  };

  // --------------------
  // 导出：写回 or 下载
  // --------------------
  const exportEncrypted = async () => {
    if (!State.unlocked || !State.vault || !State.encrypted) {
      alert('请先解锁金库');
      return;
    }

    await saveEncryptedNow();

    const canWriteBack = !!State.fileHandle && supportsFSA() && window.isSecureContext;
    if (canWriteBack) {
      try {
        await writeEncryptedBackToHandle(State.fileHandle, State.encrypted);
        alert(`已保存到原文件：${State.fileName || 'vault.json'}`);
        return;
      } catch (e) {
        console.warn(e);
      }
    }

    downloadJson(State.encrypted, computeExportFileName());
  };

  // --------------------
  // 事件绑定
  // --------------------
  const bindEvents = () => {
    // theme
    el.btnTheme.addEventListener('click', () => {
      const isLight = document.body.classList.toggle('light');
      Vault.setTheme(isLight ? 'light' : 'dark');
    });

    // open vault（单按钮）
    el.btnOpenVault.addEventListener('click', async () => {
      try {
        await openVaultAuto();
      } catch (e) {
        ui.msg(el.unlockMsg, e.message, 'error');
      }
    });

    // fallback file input（只读）
    el.fileImportVault.addEventListener('change', async () => {
      try {
        const file = el.fileImportVault.files?.[0];
        if (!file) return;
        const text = await file.text();
        loadEncryptedFromText(text);

        State.fileHandle = null;
        State.fileName = file.name || 'vault.json';

        refreshSelectedVaultUi();
        ui.msg(el.unlockMsg, `已打开：${State.fileName}（只读方式）。请输入主密码后点击“解锁”。`, 'ok');
      } catch (e) {
        ui.msg(el.unlockMsg, e.message, 'error');
      } finally {
        el.fileImportVault.value = '';
      }
    });

    // unlock
    el.btnUnlock.addEventListener('click', async () => {
      try {
        ui.msg(el.unlockMsg, '解锁中…');

        if (!State.encrypted) throw new Error('请先点击“打开 Vault”选择 JSON 文件');

        const masterPassword = el.unlockMaster.value || '';
        if (!masterPassword) throw new Error('请输入主密码');

        const passphrase = el.unlockPassphrase.value || '';

        let keyfileBytes = null;
        const kf = el.unlockKeyfile.files?.[0];
        if (kf) keyfileBytes = await CryptoUtil.readFileAsArrayBuffer(kf);

        await unlockWithEncrypted(State.encrypted, masterPassword, passphrase, keyfileBytes);
        ui.msg(el.unlockMsg, '解锁成功', 'ok');
      } catch (e) {
        ui.msg(el.unlockMsg, e.message, 'error');
      }
    });

    // create vault
    el.chkUsePassphrase.addEventListener('change', () => {
      el.newPassphrase.disabled = !el.chkUsePassphrase.checked;
      if (!el.chkUsePassphrase.checked) el.newPassphrase.value = '';
    });
    el.chkUseKeyfile.addEventListener('change', () => {
      el.newKeyfile.disabled = !el.chkUseKeyfile.checked;
      if (!el.chkUseKeyfile.checked) el.newKeyfile.value = '';
    });

    el.btnCreateVault.addEventListener('click', async () => {
      try {
        ui.msg(el.createMsg, '创建中…');
        await createNewVault();
        ui.msg(el.createMsg, '创建成功（请导出保存为文件）', 'ok');
      } catch (e) {
        ui.msg(el.createMsg, e.message, 'error');
      }
    });

    // export
    el.btnExport.addEventListener('click', async () => {
      try {
        await exportEncrypted();
      } catch (e) {
        alert(e.message);
      }
    });

    // settings
    el.btnSettings.addEventListener('click', openSettingsModal);
    el.btnCloseSettings.addEventListener('click', closeSettingsModal);
    el.btnCancelSettings.addEventListener('click', closeSettingsModal);

    el.btnSaveSettings.addEventListener('click', async () => {
      try {
        if (!State.vault) return;
        const m = ui.clampInt(el.autoLockMinutes.value, 1, 240, 5);
        const s = ui.clampInt(el.clipboardClearSeconds.value, 1, 300, 20);
        State.vault.settings.autoLockMinutes = m;
        State.vault.settings.clipboardClearSeconds = s;
        await saveEncryptedNow();
        setAutoLockMinutes(m);
        alert('设置已保存');
        closeSettingsModal();
      } catch (e) {
        alert(e.message);
      }
    });

    // exit
    el.btnExit.addEventListener('click', () => exitToLogin('已退出'));

    // sidebar filters
    el.btnFavorites.addEventListener('click', () => {
      State.showFavorites = true;
      State.currentEntryId = null;
      renderAllMain();
      renderGroupTree();
    });

    el.btnAll.addEventListener('click', () => {
      State.showFavorites = false;
      State.currentGroupId = State.vault?.rootGroupId || null;
      State.currentEntryId = null;
      renderAllMain();
      renderGroupTree();
    });

    el.tagFilter.addEventListener('change', () => {
      State.tagFilter = el.tagFilter.value || '';
      State.currentEntryId = null;
      renderAllMain();
    });

    // search
    el.searchInput.addEventListener('input', () => {
      State.search = el.searchInput.value || '';
      State.currentEntryId = null;
      renderAllMain();
    });

    el.btnClearSearch.addEventListener('click', () => {
      el.searchInput.value = '';
      State.search = '';
      State.currentEntryId = null;
      renderAllMain();
    });

    // add group / entry
    el.btnAddGroup.addEventListener('click', () => openGroupModal(null));
    el.btnAddEntry.addEventListener('click', () => openEntryModal(null));

    // entry modal
    el.btnCloseEntryModal.addEventListener('click', closeEntryModal);
    el.btnCancelEntry.addEventListener('click', closeEntryModal);

    el.btnAddCustomField.addEventListener('click', () => addCustomFieldRow('', ''));

    el.btnTogglePw.addEventListener('click', () => {
      el.ePassword.type = (el.ePassword.type === 'password') ? 'text' : 'password';
    });

    el.btnCopyPw.addEventListener('click', async () => {
      try {
        await writeClipboard(el.ePassword.value || '');
        await scheduleClipboardClear();
      } catch (e) {
        alert(e.message);
      }
    });

    el.ePassword.addEventListener('input', () => updateStrengthUi(el.ePassword.value));

    // generator
    el.genLen.addEventListener('input', () => el.genLenLabel.textContent = el.genLen.value);

    el.btnGeneratePw.addEventListener('click', () => {
      try {
        const pw = CryptoUtil.generatePassword({
          length: ui.clampInt(el.genLen.value, 8, 64, 16),
          upper: el.genUpper.checked,
          lower: el.genLower.checked,
          nums: el.genNums.checked,
          syms: el.genSyms.checked
        });
        el.genOut.value = pw;
      } catch (e) {
        alert(e.message);
      }
    });

    el.btnUseGenerated.addEventListener('click', () => {
      if (!el.genOut.value) return;
      el.ePassword.value = el.genOut.value;
      updateStrengthUi(el.ePassword.value);
    });

    el.btnSaveEntry.addEventListener('click', async () => {
      try {
        const vault = State.vault;
        if (!vault) return;

        const patch = {
          title: (el.eTitle.value || '').trim(),
          username: (el.eUsername.value || '').trim(),
          password: el.ePassword.value || '',
          url: (el.eUrl.value || '').trim(),
          notes: el.eNotes.value || '',
          tags: parseTags(el.eTags.value),
          favorite: !!el.eFav.checked,
          groupId: el.eGroup.value || vault.rootGroupId,
          customFields: collectCustomFields()
        };

        if (!patch.title) patch.title = '未命名条目';

        if (!State.editingEntryId) {
          const e = Vault.addEntry(vault, patch);
          State.currentEntryId = e.id;
        } else {
          Vault.updateEntry(vault, State.editingEntryId, patch);
          State.currentEntryId = State.editingEntryId;
        }

        await saveEncryptedNow();
        closeEntryModal();
        refreshAll();
      } catch (e) {
        alert(e.message);
      }
    });

    el.btnDeleteEntry.addEventListener('click', async () => {
      try {
        const vault = State.vault;
        if (!vault) return;
        if (!State.editingEntryId) return;
        if (!confirm('确定删除该条目？')) return;

        Vault.deleteEntry(vault, State.editingEntryId);
        await saveEncryptedNow();
        closeEntryModal();
        State.currentEntryId = null;
        refreshAllMainOnly();
      } catch (e) {
        alert(e.message);
      }
    });

    // group modal
    el.btnCloseGroupModal.addEventListener('click', closeGroupModal);
    el.btnCancelGroup.addEventListener('click', closeGroupModal);

    el.btnSaveGroup.addEventListener('click', async () => {
      try {
        const vault = State.vault;
        if (!vault) return;

        const name = (el.gName.value || '').trim();
        if (!name) throw new Error('请输入分组名称');

        const parentId = el.gParent.value || null;
        if (State.editingGroupId) {
          const gid = State.editingGroupId;
          if (parentId && isGroupDescendant(vault, gid, parentId)) {
            throw new Error('不能将分组移动到自己的子分组中');
          }
          Vault.updateGroup(vault, gid, { name, parentId });
        } else {
          Vault.addGroup(vault, { name, parentId });
        }

        await saveEncryptedNow();
        closeGroupModal();
        refreshAll();
      } catch (e) {
        alert(e.message);
      }
    });

    el.btnDeleteGroup.addEventListener('click', async () => {
      try {
        const vault = State.vault;
        if (!vault) return;
        if (!State.editingGroupId) return;
        if (!confirm('确定删除该分组？该分组下条目将自动移动到父分组。')) return;

        Vault.deleteGroup(vault, State.editingGroupId);
        await saveEncryptedNow();
        closeGroupModal();
        refreshAll();
      } catch (e) {
        alert(e.message);
      }
    });

    // keyboard shortcuts
    window.addEventListener('keydown', (ev) => {
      if (ev.key === 'Escape') {
        if (!el.settingsModal.classList.contains('hidden')) closeSettingsModal();
        if (!el.entryModal.classList.contains('hidden')) closeEntryModal();
        if (!el.groupModal.classList.contains('hidden')) closeGroupModal();
      }

      if (ev.ctrlKey && ev.key.toLowerCase() === 'f') {
        ev.preventDefault();
        if (State.unlocked) el.searchInput.focus();
      }

      if (ev.ctrlKey && ev.key.toLowerCase() === 'n') {
        ev.preventDefault();
        if (State.unlocked) openEntryModal(null);
      }

      if (ev.ctrlKey && ev.key.toLowerCase() === 'l') {
        ev.preventDefault();
        if (State.unlocked) exitToLogin('已退出（快捷键）');
      }
    });
  };

  // --------------------
  // 启动
  // --------------------
  const boot = () => {
    const theme = Vault.getTheme();
    if (theme === 'light') document.body.classList.add('light');

    attachInactivityListeners();
    bindEvents();

    ui.show(el.authView);
    ui.hide(el.appView);

    el.btnExport.disabled = true;
    el.btnSettings.disabled = true;
    el.btnExit.disabled = true;

    el.vaultStatusBadge.textContent = '未登录';

    State.encrypted = null;
    State.fileHandle = null;
    State.fileName = '';
    refreshSelectedVaultUi();

    ui.msg(el.unlockMsg, '请先点击“打开 Vault”选择 JSON 文件，然后输入主密码解锁。', 'info');
  };

  boot();
})();
