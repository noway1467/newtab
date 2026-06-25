// Default Configuration
const defaultShortcuts = [
    { name: 'Bilibili', url: 'https://www.bilibili.com' },
    { name: 'GitHub', url: 'https://github.com' },
    { name: 'YouTube', url: 'https://www.youtube.com' },
    { name: 'Google', url: 'https://www.google.com' },
    { name: 'Bing', url: 'https://www.bing.com' }
];

const DEFAULT_WALLPAPER = 'https://bing.biturl.top/?resolution=1920&format=image&index=0&mkt=zh-CN';

const DEFAULT_HOT_LIST_SOURCES = [
    {
        key: 'weibo',
        name: '微博',
        homeUrl: 'https://s.weibo.com/top/summary',
        endpoints: ['https://api.cenguigui.cn/api/juhe/hotlist.php?type=weibo'],
        builtIn: true
    },
    {
        key: 'baidu',
        name: '百度',
        homeUrl: 'https://top.baidu.com/board?tab=realtime',
        endpoints: ['https://api.cenguigui.cn/api/juhe/hotlist.php?type=baidu'],
        builtIn: true
    },
    {
        key: 'github',
        name: 'GitHub',
        homeUrl: 'https://github.com/trending',
        endpoints: ['https://api.github.com/search/repositories?q=stars:%3E50000&sort=stars&order=desc&per_page=20'],
        builtIn: true
    },
    {
        key: 'readhub',
        name: 'ReadHub',
        homeUrl: 'https://readhub.cn/',
        endpoints: ['https://api.readhub.cn/news?lastCursor=&pageSize=20'],
        builtIn: true
    },
    {
        key: 'juejin',
        name: '掘金',
        homeUrl: 'https://juejin.cn/hot/articles',
        endpoints: ['https://api.juejin.cn/content_api/v1/content/article_rank?category_id=1&type=hot'],
        itemUrlTemplate: 'https://juejin.cn/post/{id}',
        builtIn: true
    }
];

function cloneDefaultHotListSources() {
    return DEFAULT_HOT_LIST_SOURCES.map(source => ({
        ...source,
        endpoints: [...source.endpoints]
    }));
}

function readJsonStorage(key, fallback) {
    const raw = localStorage.getItem(key);
    if (raw === null) return fallback;

    try {
        const parsed = JSON.parse(raw);
        return parsed ?? fallback;
    } catch (error) {
        console.warn(`[Storage] 配置 ${key} 解析失败，已使用默认值。`, error);
        return fallback;
    }
}


const defaultEngineCategories = {
    common: {
        name: '常用',
        engines: {
            bing: { name: 'Bing', url: 'https://www.bing.com/search?q=', icon: 'https://www.bing.com/sa/simg/favicon-2x.ico' },
            google: { name: 'Google', url: 'https://www.google.com/search?q=', icon: 'https://favicon.im/google.com?larger=true' },
            baidu: { name: '百度', url: 'https://www.baidu.com/s?wd=', icon: 'https://www.baidu.com/favicon.ico' }
        }
    },
    video: {
        name: '影视',
        engines: {
            douban: { name: '豆瓣', url: 'https://search.douban.com/movie/subject_search?search_text=', icon: 'https://www.douban.com/favicon.ico' },
            boju: { name: '播剧网', url: 'https://www.ysxq.cc/vodsearch/-------------.html?wd=%s', icon: 'https://favicon.im/ysxq.cc?larger=true' },
            guanying: { name: '观影', url: 'https://www.gying.net/s/1---1/%s', icon: 'https://favicon.im/gying.net?larger=true' },
            ntdm: { name: 'NT动漫', url: 'https://www.ntdm8.com/search/-------------.html?wd=%s&page=1', icon: 'https://favicon.im/ntdm8.com?larger=true' },
            bilibili: { name: 'Bilibili', url: 'https://search.bilibili.com/all?keyword=', icon: 'https://www.bilibili.com/favicon.ico' }
        }
    },
    reading: {
        name: '阅读',
        engines: {
            qidian: { name: '起点', url: 'https://www.qidian.com/soushu/', icon: 'https://www.qidian.com/favicon.ico' },
            biquge: { name: '铅笔小说', url: 'https://www.23qb.net/search.html?searchkey=%s', icon: 'https://favicon.im/23qb.net?larger=true' },
            weread: { name: '微信读书', url: 'https://weread.qq.com/web/search/books?keyword=', icon: 'https://weread.qq.com/favicon.ico' }
        }
    },
    resource: {
        name: '资料',
        engines: {
            zhihu: { name: '知乎', url: 'https://www.zhihu.com/search?type=content&q=', icon: 'https://www.zhihu.com/favicon.ico' },
            csdn: { name: 'CSDN', url: 'https://so.csdn.net/so/search?q=', icon: 'https://www.csdn.net/favicon.ico' },
            github: { name: 'GitHub', url: 'https://github.com/search?q=', icon: 'https://github.com/favicon.ico' }
        }
    }
};

const DEFAULT_SETTINGS = {
    maxRows: 2,
    maxCols: 5,
    borderRadius: 50,
    iconGap: 10,
    iconSize: 80,
    searchWidth: 600,
    searchHeight: 50,
    searchRadius: 25,
    searchOpacity: 100,
    searchBlur: 10,
    darkMode: false,
    autoNightMode: false,
    globalBrightness: 100,
    showShortcuts: true,
    searchInNewTab: false,
    shortcutInNewTab: false,
    categoryOrder: readJsonStorage('categoryOrder', []),
    showClock: true,
    clockSize: 4,
    clockColor: '#ffffff',
    clockBorderColor: '#000000',
    clockVerticalOffset: -20,
    searchVerticalOffset: -20,
    shortcutsVerticalOffset: 0,
    autoFill: false,
    showNoteWidget: true,
    showHotWidget: true,
    showMusicWidget: false,
    widgetVisibilityOrder: ['hot', 'note', 'music'],
    hotListSource: 'weibo',
    hotListSources: cloneDefaultHotListSources(),
    noteWidgetPosition: 'left',
    exportIncludeWallpaper: true
};

function createDefaultFolderStyle() {
    return {
        bgColor: '#ffffff',
        opacity: 24,
        radius: 18
    };
}

function normalizeFolderStyle(folderStyle = {}, fallback = {}) {
    const base = createDefaultFolderStyle();
    return {
        bgColor: folderStyle.bgColor || fallback.bgColor || base.bgColor,
        opacity: folderStyle.opacity ?? fallback.opacity ?? base.opacity,
        radius: folderStyle.radius ?? fallback.radius ?? base.radius
    };
}

function ensureFolderVisualStyle(folder) {
    if (!folder || folder.type !== 'folder') return folder;
    folder.style = normalizeFolderStyle(folder.style, {
        bgColor: folder.bgColor,
        opacity: folder.opacity,
        radius: folder.radius
    });
    delete folder.bgColor;
    delete folder.opacity;
    delete folder.radius;
    if (Array.isArray(folder.items)) {
        folder.items.forEach(item => ensureFolderVisualStyle(item));
    }
    return folder;
}

function colorToRgba(color, alpha = 1) {
    const value = String(color || '').trim();
    if (!value) return `rgba(255, 255, 255, ${alpha})`;
    if (/^rgba?\(/i.test(value)) {
        const numbers = value.match(/[\d.]+/g) || [];
        const [r = '255', g = '255', b = '255'] = numbers;
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }
    const hex = value.replace('#', '');
    const normalized = hex.length === 3
        ? hex.split('').map(char => char + char).join('')
        : hex.padEnd(6, '0').slice(0, 6);
    const r = parseInt(normalized.slice(0, 2), 16);
    const g = parseInt(normalized.slice(2, 4), 16);
    const b = parseInt(normalized.slice(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// State
let state = {
    shortcuts: readJsonStorage('shortcuts', defaultShortcuts),
    engineCategories: readJsonStorage('engineCategories', defaultEngineCategories),
    categoryOrder: readJsonStorage('categoryOrder', []),
    engineCategory: localStorage.getItem('engineCategory') || 'common',
    engine: localStorage.getItem('engine') || 'google',
    settings: { ...DEFAULT_SETTINGS, ...readJsonStorage('settings', {}) },
    wallpaper: localStorage.getItem('wallpaper') || DEFAULT_WALLPAPER,
    cachedIcons: {}
};

// Batch Mode State
let isBatchMode = false;
let selectedIndices = new Set();
let lastCategoryWheelAt = 0;
const CATEGORY_WHEEL_DELAY = 180;
const ICON_LOAD_FALLBACK_DELAY = 1800;

// Batch Mode Functions
window.toggleBatchMode = () => {
    isBatchMode = !isBatchMode;
    const toolbar = document.getElementById('batchToolbar');

    if (isBatchMode) {
        toolbar.classList.remove('hidden');
        document.getElementById('selectedCount').textContent = '0';
    } else {
        toolbar.classList.add('hidden');
        selectedIndices.clear();
    }
    renderShortcuts();
};
window.toggleSelectAll = () => {
    const pageSize = state.settings.maxCols * state.settings.maxRows;
    const scrollLeft = els.shortcutsContainer.scrollLeft;
    const pageWidth = els.shortcutsContainer.clientWidth;
    const currentPage = Math.round(scrollLeft / pageWidth);

    const startIndex = currentPage * pageSize;
    const endIndex = Math.min(startIndex + pageSize, state.shortcuts.length);

    let allSelected = true;
    for (let i = startIndex; i < endIndex; i++) {
        if (state.shortcuts[i] && !selectedIndices.has(i)) {
            allSelected = false;
            break;
        }
    }

    for (let i = startIndex; i < endIndex; i++) {
        if (state.shortcuts[i]) {
            if (allSelected) {
                selectedIndices.delete(i);
            } else {
                selectedIndices.add(i);
            }
        }
    }

    document.getElementById('selectedCount').textContent = selectedIndices.size;
    renderShortcuts();
};

window.navPage = (dir) => {
    // Deprecated as per user request
};

window.batchDelete = () => {
    if (selectedIndices.size === 0) return;
    if (!confirm(`确定要删除选中的 ${selectedIndices.size} 个快捷方式吗？`)) return;

    // Sort indices descending to delete correctly if shifting
    const indicesToDelete = Array.from(selectedIndices).sort((a, b) => b - a);

    if (state.settings.autoFill !== false) {
        // Shifting behavior (splice)
        indicesToDelete.forEach(index => {
            state.shortcuts.splice(index, 1);
        });
    } else {
        // Fixed position behavior (set to null)
        indicesToDelete.forEach(index => {
            state.shortcuts[index] = null;
        });
    }

    selectedIndices.clear();
    saveShortcuts();
    renderShortcuts();
    document.getElementById('selectedCount').textContent = '0';
    toggleBatchMode();
};

window.batchMoveToPage = () => {
    const pageInput = document.getElementById('moveToPageInput');
    const targetPage = parseInt(pageInput.value);

    if (!targetPage || targetPage < 1) {
        alert('请输入有效的页码');
        return;
    }

    if (selectedIndices.size === 0) return;

    // Extract items
    const sortedIndices = Array.from(selectedIndices).sort((a, b) => a - b);
    const itemsToMove = sortedIndices.map(index => state.shortcuts[index]);

    // Remove items (from back to front)
    for (let i = sortedIndices.length - 1; i >= 0; i--) {
        state.shortcuts.splice(sortedIndices[i], 1);
    }

    // Calculate Insert Position
    const pageSize = state.settings.maxCols * state.settings.maxRows;
    const insertIndex = (targetPage - 1) * pageSize;

    // Fill page block with items + nulls to ensure "Independent Page"
    const paddingCount = Math.max(0, pageSize - itemsToMove.length);
    const pageBlock = [...itemsToMove, ...Array(paddingCount).fill(null)];

    // Ensure array is long enough to reach insertIndex
    while (state.shortcuts.length < insertIndex) {
        state.shortcuts.push(null);
    }

    state.shortcuts.splice(insertIndex, 0, ...pageBlock);

    selectedIndices.clear();
    saveShortcuts();
    renderShortcuts();

    document.getElementById('selectedCount').textContent = '0';
    toggleBatchMode();
    alert(`已移动到第 ${targetPage} 页`);
};

// Migration for existing users: Ensure maxRows exists
if (!state.settings.maxRows) {
    state.settings.maxRows = 2;
    state.settings.maxCount = undefined; // Cleanup old setting
    localStorage.setItem('settings', JSON.stringify(state.settings));
}

// Migration for Auto Night Mode (Default OFF)
if (state.settings.autoNightMode === undefined) {
    state.settings.autoNightMode = false;
    localStorage.setItem('settings', JSON.stringify(state.settings));
}

// Migration for Auto Fill (Default OFF)
if (state.settings.autoFill === undefined) {
    state.settings.autoFill = false;
    localStorage.setItem('settings', JSON.stringify(state.settings));
}

// Migration for widgets
const widgetSettingDefaults = {
    showNoteWidget: true,
    showHotWidget: true,
    showMusicWidget: false,
    widgetVisibilityOrder: ['hot', 'note', 'music'],
    hotListSource: 'weibo',
    hotListSources: cloneDefaultHotListSources(),
    noteWidgetPosition: 'left'
};
let widgetSettingsChanged = false;
Object.entries(widgetSettingDefaults).forEach(([key, value]) => {
    if (state.settings[key] === undefined) {
        state.settings[key] = value;
        widgetSettingsChanged = true;
    }
});
if (widgetSettingsChanged) {
    localStorage.setItem('settings', JSON.stringify(state.settings));
}

let folderStyleMigrated = false;
state.shortcuts = (state.shortcuts || []).map(item => {
    const normalized = ensureFolderVisualStyle(item);
    if (normalized?.type === 'folder') folderStyleMigrated = true;
    return normalized;
});
if (folderStyleMigrated) {
    localStorage.setItem('shortcuts', JSON.stringify(state.shortcuts));
}

// Migration for category order
if (!state.categoryOrder || state.categoryOrder.length === 0) {
    const keys = Object.keys(state.engineCategories);
    // Heuristic: Strings first (default categories), Numbers last (custom user IDs usually)
    const strKeys = keys.filter(k => isNaN(Number(k)));
    const numKeys = keys.filter(k => !isNaN(Number(k))); // Like '111'
    state.categoryOrder = [...strKeys, ...numKeys];
    localStorage.setItem('categoryOrder', JSON.stringify(state.categoryOrder));
}

function syncCategoryOrder() {
    const currentKeys = Object.keys(state.engineCategories || {});
    const ordered = (state.categoryOrder || []).filter(key => currentKeys.includes(key));
    const missing = currentKeys.filter(key => !ordered.includes(key));
    state.categoryOrder = [...ordered, ...missing];
    localStorage.setItem('categoryOrder', JSON.stringify(state.categoryOrder));
    return state.categoryOrder;
}

function getOrderedCategoryKeys() {
    return syncCategoryOrder().filter(key => state.engineCategories[key]);
}

function getFirstCategoryWithEngines() {
    const orderedKeys = getOrderedCategoryKeys();
    return orderedKeys.find(key => Object.keys(state.engineCategories[key]?.engines || {}).length > 0) || orderedKeys[0] || null;
}

// Helper to get current category's engines
function getCurrentEngines() {
    if (!state.engineCategories[state.engineCategory]) {
        state.engineCategory = getFirstCategoryWithEngines() || 'common';
        localStorage.setItem('engineCategory', state.engineCategory);
    }

    return state.engineCategories[state.engineCategory]?.engines || {};
}

function getActiveEngine() {
    const engines = getCurrentEngines();
    const keys = Object.keys(engines);
    if (keys.length === 0) {
        return { engines, key: '', engine: null };
    }

    if (!engines[state.engine]) {
        state.engine = keys[0];
        localStorage.setItem('engine', state.engine);
    }

    return { engines, key: state.engine, engine: engines[state.engine] };
}

// Ensure current engine exists in current category, fallback to first available
getActiveEngine();

// DOM Elements
const els = {
    clockWidget: document.getElementById('clockWidget'),
    wallpaper: document.getElementById('wallpaper'),
    searchInput: document.getElementById('searchInput'),
    clearSearchBtn: document.getElementById('clearSearchBtn'),
    searchBtn: document.getElementById('searchBtn'),
    searchEngineSelector: document.getElementById('searchEngineSelector'),
    currentEngineIcon: document.getElementById('currentEngineIcon'),
    engineDropdown: document.getElementById('engineDropdown'),
    shortcutsContainer: document.getElementById('shortcutsContainer'),
    settingsToggle: document.getElementById('settingsToggle'),
    settingsPanel: document.getElementById('settingsPanel'),
    closeSettings: document.getElementById('closeSettings'),
    // Settings Inputs
    maxRows: document.getElementById('maxRows'),
    maxCols: document.getElementById('maxCols'),
    borderRadius: document.getElementById('borderRadius'),
    iconGap: document.getElementById('iconGap'),
    iconSize: document.getElementById('iconSize'),
    // Settings Values
    maxRowsVal: document.getElementById('maxRowsVal'),
    maxColsVal: document.getElementById('maxColsVal'),
    borderRadiusVal: document.getElementById('borderRadiusVal'),
    iconGapVal: document.getElementById('iconGapVal'),
    iconSizeVal: document.getElementById('iconSizeVal'),
    // Wallpaper
    bingWallpaperBtn: document.getElementById('bingWallpaperBtn'),
    uploadWallpaper: document.getElementById('uploadWallpaper'),
    resetSettings: document.getElementById('resetSettings'),
    // Engine Management
    settingsEngineList: document.getElementById('settingsEngineList'),
    addEngineBtn: document.getElementById('addEngineBtn'),
    // Edit Shortcut Modal
    editModal: document.getElementById('editModal'),
    modalTitle: document.getElementById('modalTitle'),
    shortcutName: document.getElementById('shortcutName'),
    shortcutUrl: document.getElementById('shortcutUrl'),
    cancelEdit: document.getElementById('cancelEdit'),
    saveEdit: document.getElementById('saveEdit'),
    // Edit Engine Modal
    engineModal: document.getElementById('engineModal'),
    engineModalTitle: document.getElementById('engineModalTitle'),
    engineName: document.getElementById('engineName'),
    engineUrl: document.getElementById('engineUrl'),
    engineIcon: document.getElementById('engineIcon'),
    cancelEngineEdit: document.getElementById('cancelEngineEdit'),
    saveEngineEdit: document.getElementById('saveEngineEdit'),
    // New Settings
    searchWidth: document.getElementById('searchWidth'),
    searchHeight: document.getElementById('searchHeight'),
    searchRadius: document.getElementById('searchRadius'),
    searchOpacity: document.getElementById('searchOpacity'),
    searchWidthVal: document.getElementById('searchWidthVal'),
    searchHeightVal: document.getElementById('searchHeightVal'),
    searchRadiusVal: document.getElementById('searchRadiusVal'),

    searchOpacityVal: document.getElementById('searchOpacityVal'),
    searchBlur: document.getElementById('searchBlur'),
    searchBlurVal: document.getElementById('searchBlurVal'),
    // Clock Settings
    showClock: document.getElementById('showClock'),
    clockSize: document.getElementById('clockSize'),
    clockColor: document.getElementById('clockColor'),
    clockBorderColor: document.getElementById('clockBorderColor'),
    clockSizeVal: document.getElementById('clockSizeVal'),
    darkMode: document.getElementById('darkMode'),
    autoNightMode: document.getElementById('autoNightMode'),
    globalBrightness: document.getElementById('globalBrightness'),
    globalBrightnessVal: document.getElementById('globalBrightnessVal'),
    showShortcuts: document.getElementById('showShortcuts'),
    searchInNewTab: document.getElementById('searchInNewTab'),
    shortcutInNewTab: document.getElementById('shortcutInNewTab'),
    currentCategoryName: document.getElementById('currentCategoryName'),
    engineCategoryTabs: document.getElementById('engineCategoryTabs'),
    searchContainer: document.querySelector('.search-container'),
    clockVerticalOffset: document.getElementById('clockVerticalOffset'), // Added
    clockVerticalOffsetVal: document.getElementById('clockVerticalOffsetVal'), // Added
    searchVerticalOffset: document.getElementById('searchVerticalOffset'), // Added
    searchVerticalOffsetVal: document.getElementById('searchVerticalOffsetVal'), // Added
    shortcutsVerticalOffset: document.getElementById('shortcutsVerticalOffset'),
    shortcutsVerticalOffsetVal: document.getElementById('shortcutsVerticalOffsetVal'),
    engineCategorySelect: document.getElementById('engineCategorySelect'),
    darkModeToggle: document.getElementById('darkModeToggle'),
    // WebDAV Elements
    webdavUrl: document.getElementById('webdavUrl'),
    webdavProxyUrl: document.getElementById('webdavProxyUrl'),
    webdavUser: document.getElementById('webdavUser'),
    webdavPassword: document.getElementById('webdavPassword'),
    webdavTestBtn: document.getElementById('webdavTestBtn'),
    webdavUploadBtn: document.getElementById('webdavUploadBtn'),
    webdavDownloadBtn: document.getElementById('webdavDownloadBtn'),
    webdavStatus: document.getElementById('webdavStatus'),
    webdavIncludeWallpaper: document.getElementById('webdavIncludeWallpaper'),
    exportIncludeWallpaper: document.getElementById('exportIncludeWallpaper'),

    deleteEngineFromModal: document.getElementById('deleteEngineFromModal'),
    manageCategoriesBtn: document.getElementById('manageCategoriesBtn'),
    categoryModal: document.getElementById('categoryModal'),
    addCategoryBtn: document.getElementById('addCategoryBtn'),
    closeCategoryModal: document.getElementById('closeCategoryModal'),
    // Import/Export
    exportConfigBtn: document.getElementById('exportConfigBtn'),
    importConfigBtn: document.getElementById('importConfigBtn'),
    importFileInput: document.getElementById('importFileInput'),
    exportIncludeWallpaper: document.getElementById('exportIncludeWallpaper'),
    resetSettings: document.getElementById('resetSettings'),
    clearAllDataBtn: document.getElementById('clearAllDataBtn'),
    autoFill: document.getElementById('autoFill'),
    // Folder Edits
    folderEditModal: document.getElementById('folderEditModal'),
    folderEditName: document.getElementById('folderEditName'),
    folderEditBgColor: document.getElementById('folderEditBgColor'),
    folderEditOpacity: document.getElementById('folderEditOpacity'),
    folderEditOpacityVal: document.getElementById('folderEditOpacityVal'),
    folderEditRadius: document.getElementById('folderEditRadius'),
    folderEditRadiusVal: document.getElementById('folderEditRadiusVal'),
    cancelFolderEdit: document.getElementById('cancelFolderEdit'),
    saveFolderEdit: document.getElementById('saveFolderEdit'),
    folderContextMenu: document.getElementById('folderContextMenu'),
    // FABs
    fixedAddBtn: document.getElementById('fixedAddBtn'),
    batchManageBtn: document.getElementById('batchManageBtn'),
    // Widgets
    widgetsArea: document.getElementById('widgetsArea'),
    noteWidget: document.getElementById('noteWidget'),
    hotWidget: document.getElementById('hotWidget'),
    musicWidget: document.getElementById('musicWidget'),
    quickNoteInput: document.getElementById('quickNoteInput'),
    notesGrid: document.getElementById('notesGrid'),
    addNoteBtn: document.getElementById('addNoteBtn'),
    clearNoteBtn: document.getElementById('clearNoteBtn'),
    noteSavedStatus: document.getElementById('noteSavedStatus'),
    hotList: document.getElementById('hotList'),
    hotListStatus: document.getElementById('hotListStatus'),
    hotSourceTabs: document.getElementById('hotSourceTabs'),
    refreshHotListBtn: document.getElementById('refreshHotListBtn'),
    musicStatus: document.getElementById('musicStatus'),
    musicList: document.getElementById('musicList'),
    musicAudio: document.getElementById('musicAudio'),
    musicCover: document.getElementById('musicCover'),
    musicCurrentTitle: document.getElementById('musicCurrentTitle'),
    musicLoginBtn: document.getElementById('musicLoginBtn'),
    musicLoginModal: document.getElementById('musicLoginModal'),
    musicLoginQrImage: document.getElementById('musicLoginQrImage'),
    musicLoginQrStatus: document.getElementById('musicLoginQrStatus'),
    closeMusicLoginModal: document.getElementById('closeMusicLoginModal'),
    retryMusicLoginBtn: document.getElementById('retryMusicLoginBtn'),
    openMusicWebLoginBtn: document.getElementById('openMusicWebLoginBtn'),
    refreshMusicBtn: document.getElementById('refreshMusicBtn'),
    musicPlayBtn: document.getElementById('musicPlayBtn'),
    musicLikeBtn: document.getElementById('musicLikeBtn'),
    musicNextBtn: document.getElementById('musicNextBtn'),
    musicProgress: document.getElementById('musicProgress'),
    musicProgressFill: document.getElementById('musicProgressFill'),
    showNoteWidget: document.getElementById('showNoteWidget'),
    showHotWidget: document.getElementById('showHotWidget'),
    showMusicWidget: document.getElementById('showMusicWidget'),
    hotSourceSettingList: document.getElementById('hotSourceSettingList'),
    hotSourceNameInput: document.getElementById('hotSourceNameInput'),
    hotSourceUrlInput: document.getElementById('hotSourceUrlInput'),
    hotSourceHomeInput: document.getElementById('hotSourceHomeInput'),
    addHotSourceBtn: document.getElementById('addHotSourceBtn'),
    noteWidgetPosition: document.getElementById('noteWidgetPosition')
};

let editingIndex = -1;
let editingSubIndex = -1; // For icon inside folder
let editingFolderIndex = -1;
let editingSubFolderIndex = -1; // For folder inside folder

let currentRootIndex = -1; // Top-level shortcut index
let currentViewingFolder = null; // The folder object currently shown in primary modal
let currentChildFolder = null; // Sub-folder currently shown in secondary window
let editingTargetItem = null; // The specific item being right-clicked
let editingTargetSubIndex = -1; // The index within its parent's items
let editingTargetParent = null; // Parent folder of the item being edited/right-clicked
let hotListRequestToken = 0;

let editingEngineKey = null;

let dragSourceFolderIndex = -1;
let dragSourceSubIndex = -1;

// Drag and Drop State
let dragSource = null;
let dragSourceType = null; // 'category' or 'engine'

const DEFAULT_WEBDAV_CONFIG = { url: '', user: '', password: '', proxyUrl: '' };

// WebDAV Client (direct by default, optional self-hosted proxy)
const WebDAV = {
    getConfig() {
        return { ...DEFAULT_WEBDAV_CONFIG, ...readJsonStorage('webdavConfig', {}) };
    },

    saveConfig(config) {
        localStorage.setItem('webdavConfig', JSON.stringify(config));
    },

    getHeaders(user, password, extra = {}) {
        return {
            'Authorization': 'Basic ' + btoa(unescape(encodeURIComponent(`${user}:${password}`))),
            'Content-Type': 'application/json',
            ...extra
        };
    },

    // 默认直连 WebDAV；填写中转地址后才通过自部署 Worker 转发。
    async proxyRequest(targetUrl, method, headers = {}, body = null) {
        const config = this.getConfig();
        const proxyUrl = String(config.proxyUrl || '').trim();

        if (!proxyUrl) {
            const directOptions = {
                method,
                headers: new Headers(headers)
            };
            if (body) directOptions.body = body;
            return fetch(targetUrl, directOptions);
        }

        const proxyHeaders = new Headers(headers);
        proxyHeaders.set('X-Target-Url', targetUrl);
        const options = {
            method: method,
            headers: proxyHeaders
        };
        if (body) options.body = body;

        // Send to proxy
        const response = await fetch(proxyUrl, options);
        if (response.status === 502) {
            const text = await response.text();
            throw new Error(text); // Proxy error
        }
        return response;
    },

    async checkConnection(url, user, password) {
        if (!url.endsWith('/')) url += '/';
        const response = await this.proxyRequest(url, 'PROPFIND', this.getHeaders(user, password, { 'Depth': '0' }));
        if (response.status >= 200 && response.status < 300) return true;
        if (response.status === 401) throw new Error('用户名或密码错误');
        if (response.status === 404) throw new Error('路径不存在');
        throw new Error(`连接失败: ${response.status}`);
    },

    async upload(data) {
        const config = this.getConfig();
        if (!config.url) throw new Error('未配置 WebDAV');

        let url = config.url;
        if (!url.endsWith('/')) url += '/';
        const targetUrl = url + 'newtab-config.json';

        const response = await this.proxyRequest(targetUrl, 'PUT', this.getHeaders(config.user, config.password), JSON.stringify(data));

        if (!response.ok) throw new Error(`上传失败: ${response.status} ${response.statusText}`);
        return true;
    },

    async download() {
        const config = this.getConfig();
        if (!config.url) throw new Error('未配置 WebDAV');

        let url = config.url;
        if (!url.endsWith('/')) url += '/';
        const targetUrl = url + 'newtab-config.json';

        const response = await this.proxyRequest(targetUrl, 'GET', this.getHeaders(config.user, config.password));

        if (response.status === 404) throw new Error('云端没有找到配置文件');
        if (!response.ok) throw new Error(`下载失败: ${response.status}`);

        return await response.json();
    }
};

// Initialize WebDAV UI
function initWebDAV() {
    const config = WebDAV.getConfig();
    if (els.webdavUrl) els.webdavUrl.value = config.url;
    if (els.webdavProxyUrl) els.webdavProxyUrl.value = config.proxyUrl;
    if (els.webdavUser) els.webdavUser.value = config.user;
    if (els.webdavPassword) els.webdavPassword.value = config.password;

    const updateStatus = (msg, color = 'var(--text-color)') => {
        if (els.webdavStatus) {
            els.webdavStatus.textContent = msg;
            els.webdavStatus.style.color = color;
            setTimeout(() => els.webdavStatus.textContent = '', 5000);
        }
    };

    const saveUIConfig = () => {
        const newConfig = {
            url: els.webdavUrl.value.trim(),
            proxyUrl: els.webdavProxyUrl.value.trim(),
            user: els.webdavUser.value.trim(),
            password: els.webdavPassword.value
        };
        WebDAV.saveConfig(newConfig);
        return newConfig;
    };

    if (els.webdavTestBtn) {
        els.webdavTestBtn.onclick = async () => {
            const cfg = saveUIConfig();
            if (!cfg.url) return updateStatus('请输入服务器地址', 'red');
            updateStatus('正在连接...', 'orange');
            try {
                await WebDAV.checkConnection(cfg.url, cfg.user, cfg.password);
                updateStatus('连接成功！', '#4caf50');
            } catch (e) {
                updateStatus(e.message, 'red');
            }
        };
    }

    // Init Persistence for WebDAV Wallpaper Setting
    if (els.webdavIncludeWallpaper) {
        if (state.settings.webdavIncludeWallpaper === undefined) {
            state.settings.webdavIncludeWallpaper = false; // Default false for cloud sync to save bandwidth
        }
        els.webdavIncludeWallpaper.checked = state.settings.webdavIncludeWallpaper;

        els.webdavIncludeWallpaper.onchange = () => {
            state.settings.webdavIncludeWallpaper = els.webdavIncludeWallpaper.checked;
            localStorage.setItem('settings', JSON.stringify(state.settings));
        };
    }

    if (els.webdavUploadBtn) {
        els.webdavUploadBtn.onclick = async () => {const allCachedIcons = await IconCache.getAll();

            if (!confirm('确定要覆盖云端配置吗？')) return;
            saveUIConfig();
            updateStatus('正在上传...', 'orange');
            try {
                const exportData = {
                    shortcuts: state.shortcuts,
                    engineCategories: state.engineCategories,
                    engineCategory: state.engineCategory,
                    engine: state.engine,
                    settings: state.settings,
                    // Use dedicated toggle for WebDAV upload
                    wallpaper: els.webdavIncludeWallpaper.checked ? state.wallpaper : undefined,
                    cachedIcons: allCachedIcons,
                    categoryOrder: state.categoryOrder,
                    widgets: getWidgetsExportData(),
                    exportDate: new Date().toISOString()
                };
                await WebDAV.upload(exportData);
                updateStatus('上传成功！', '#4caf50');
            } catch (e) {
                console.error(e);
                updateStatus('上传失败: ' + e.message, 'red');
            }
        };
    }

    if (els.webdavDownloadBtn) {
        els.webdavDownloadBtn.onclick = async () => {
            if (!confirm('警告：下载配置将覆盖本地所有数据！确定继续吗？')) return;
            saveUIConfig();
            updateStatus('正在下载...', 'orange');
            try {
                const data = await WebDAV.download();

                if (data.shortcuts) localStorage.setItem('shortcuts', JSON.stringify(data.shortcuts));
                if (data.engineCategories) localStorage.setItem('engineCategories', JSON.stringify(data.engineCategories));
                if (data.engineCategory) localStorage.setItem('engineCategory', data.engineCategory);
                if (data.engine) localStorage.setItem('engine', data.engine);
                if (data.settings) localStorage.setItem('settings', JSON.stringify(data.settings));
                if (data.wallpaper && data.wallpaper.startsWith('data:image')) localStorage.setItem('wallpaper', data.wallpaper);
                if (data.cachedIcons) { await importCachedIcons(data.cachedIcons); }
                if (data.categoryOrder) localStorage.setItem('categoryOrder', JSON.stringify(data.categoryOrder));
                restoreWidgetsFromConfig(data.widgets);

                updateStatus('下载成功，即将刷新...', '#4caf50');
                setTimeout(() => location.reload(), 1500);
            } catch (e) {
                console.error(e);
                updateStatus('下载失败: ' + e.message, 'red');
            }
        };
    }
}

// Icon Cache System - 使用 localStorage 状态存储图标（原有 IndexedDB 作为迁移源）
const IconCache = {
    dbName: 'IconCacheDB',
    storeName: 'icons',
    db: null,
    memoryCache: new Map(), // 内存缓存，加速同步访问
    initPromise: null,

    async openDB() {
        if (this.db) return this.db;
        if (typeof indexedDB === 'undefined') {
            console.warn('[IconCache] 浏览器不支持 IndexedDB，已降级为纯内存模式');
            return null;
        }
        return new Promise((resolve) => {
            try {
                const request = indexedDB.open(this.dbName, 1);
                request.onerror = () => {
                    console.warn('[IconCache] 无法打开 IndexedDB 数据库，已降级:', request.error);
                    resolve(null);
                };
                request.onsuccess = () => {
                    this.db = request.result;
                    resolve(this.db);
                };
                request.onupgradeneeded = (e) => {
                    const db = e.target.result;
                    if (!db.objectStoreNames.contains(this.storeName)) {
                        db.createObjectStore(this.storeName, { keyPath: 'url' });
                    }
                };
                request.onblocked = () => {
                    console.warn('[IconCache] IndexedDB 数据库被占用/受阻，已降级');
                    resolve(null);
                };
            } catch (e) {
                console.warn('[IconCache] 初始化 IndexedDB 抛出异常，已降级:', e);
                resolve(null);
            }
        });
    },

    async getFromDB(url) {
        try {
            const db = await this.openDB();
            if (!db) return null;
            return new Promise((resolve) => {
                const transaction = db.transaction(this.storeName, 'readonly');
                const store = transaction.objectStore(this.storeName);
                const request = store.get(url);
                request.onsuccess = () => {
                    resolve(request.result ? request.result.data : null);
                };
                request.onerror = () => resolve(null);
            });
        } catch (e) {
            console.warn('[IconCache] getFromDB 失败:', e);
            return null;
        }
    },

    async saveToDB(url, base64) {
        try {
            const db = await this.openDB();
            if (!db) return false;
            return new Promise((resolve) => {
                const transaction = db.transaction(this.storeName, 'readwrite');
                const store = transaction.objectStore(this.storeName);
                const request = store.put({ url, data: base64, updatedAt: Date.now() });
                request.onsuccess = () => resolve(true);
                request.onerror = () => resolve(false);
            });
        } catch (e) {
            console.warn('[IconCache] saveToDB 失败:', e);
            return false;
        }
    },

    async deleteFromDB(url) {
        try {
            const db = await this.openDB();
            if (!db) return false;
            return new Promise((resolve) => {
                const transaction = db.transaction(this.storeName, 'readwrite');
                const store = transaction.objectStore(this.storeName);
                const request = store.delete(url);
                request.onsuccess = () => resolve(true);
                request.onerror = () => resolve(false);
            });
        } catch (e) {
            console.warn('[IconCache] deleteFromDB 失败:', e);
            return false;
        }
    },

    async clearDB() {
        try {
            const db = await this.openDB();
            if (!db) return false;
            return new Promise((resolve) => {
                const transaction = db.transaction(this.storeName, 'readwrite');
                const store = transaction.objectStore(this.storeName);
                const request = store.clear();
                request.onsuccess = () => resolve(true);
                request.onerror = () => resolve(false);
            });
        } catch (e) {
            console.warn('[IconCache] clearDB 失败:', e);
            return false;
        }
    },

    // 预加载当前第一页可见快捷方式和常用搜索引擎的图标
    async preloadVisibleIcons() {
        const urlsToLoad = new Set();

        // 1. 收集当前分类下的搜索引擎图标
        try {
            const engines = getCurrentEngines();
            Object.values(engines).forEach(eng => {
                getEngineIconCandidateUrls(eng).forEach(url => urlsToLoad.add(url));
            });
        } catch (e) {}

        // 2. 收集第一页快捷方式图标
        try {
            const pageSize = (state.settings.maxCols || 5) * (state.settings.maxRows || 2);
            const firstPageItems = state.shortcuts.slice(0, pageSize);
            firstPageItems.forEach(item => {
                if (!item) return;
                if (item.type === 'folder') {
                    if (item.items) {
                        item.items.slice(0, 4).forEach(sub => {
                            if (sub && sub.url) {
                                getIconCandidateUrls(sub.url).forEach(u => urlsToLoad.add(u));
                            }
                        });
                    }
                } else if (item.url) {
                    getIconCandidateUrls(item.url).forEach(u => urlsToLoad.add(u));
                }
            });
        } catch (e) {}

        // 3. 批量从 IndexedDB 读取并塞入内存缓存
        if (urlsToLoad.size > 0) {
            const loadPromises = Array.from(urlsToLoad).map(async (url) => {
                const data = await this.getFromDB(url);
                if (data) {
                    this.memoryCache.set(url, data);
                }
            });
            await Promise.all(loadPromises);
            console.log('[IconCache] 已从 IndexedDB 预加载 ' + this.memoryCache.size + ' 个可见图标至内存');
        }
    },

    // 异步获取所有缓存图标（用于打包上传 WebDAV 和备份导出）
    async getAll() {
        try {
            const db = await this.openDB();
            if (!db) return {};
            return new Promise((resolve) => {
                const transaction = db.transaction(this.storeName, 'readonly');
                const store = transaction.objectStore(this.storeName);
                const getAllRequest = store.getAll();
                getAllRequest.onsuccess = () => {
                    const result = {};
                    const items = getAllRequest.result || [];
                    items.forEach(item => {
                        result[item.url] = item.data;
                    });
                    resolve(result);
                };
                getAllRequest.onerror = () => resolve({});
            });
        } catch (e) {
            return {};
        }
    },

    // 初始化缓存：异步迁移并完成首屏预载
    async init() {
        if (this.initPromise) return this.initPromise;

        this.initPromise = (async () => {
            const db = await this.openDB();
            if (!db) {
                console.warn('[IconCache] 数据库开启失败，跳过初始化并直接以内存模式运行');
                return;
            }

            // 迁移旧的 localStorage 缓存到 IndexedDB
            const oldIconsStr = localStorage.getItem('cachedIcons');
            if (oldIconsStr) {
                try {
                    const oldIcons = JSON.parse(oldIconsStr);
                    console.log('[IconCache] 检测到 localStorage 中有 ' + Object.keys(oldIcons).length + ' 个旧图标，开始后台迁移...');
                    
                    const entries = Object.entries(oldIcons);
                    for (const [url, data] of entries) {
                        await this.saveToDB(url, data);
                    }
                    
                    localStorage.removeItem('cachedIcons');
                    state.cachedIcons = {};
                    console.log('[IconCache] 成功迁移所有图标并清空 localStorage！');
                } catch (e) {
                    console.error('[IconCache] 迁移旧图标失败:', e);
                }
            }

            // 预加载首屏图标
            try {
                await this.preloadVisibleIcons();
            } catch (e) {
                console.warn('[IconCache] 预加载可见图标失败:', e);
            }
        })();

        return this.initPromise;
    },

    // 同步获取（从内存缓存）
    get(url) {
        return this.memoryCache.get(url) || null;
    },

    // 异步获取（如果没有则从 IndexedDB 中载入内存）
    async getAsync(url) {
        const cached = this.get(url);
        if (cached) return cached;

        const data = await this.getFromDB(url);
        if (data) {
            this.memoryCache.set(url, data);
            return data;
        }
        return null;
    },

    // 保存到缓存
    async set(url, base64) {
        if (!url || !base64) return false;
        this.memoryCache.set(url, base64);
        // 异步存入数据库，不阻塞主线程
        this.saveToDB(url, base64);
        return true;
    },

    // 删除缓存
    async delete(url) {
        this.memoryCache.delete(url);
        await this.deleteFromDB(url);
        return true;
    },

    // 清空所有缓存
    async clear() {
        this.memoryCache.clear();
        await this.clearDB();
        return true;
    }
};

// 主动下载并缓存图标（解决 CORS 问题）
async function fetchAndCacheIcon(iconUrl) {
    if (!iconUrl) return null;

    // 先检查缓存
    const cached = IconCache.get(iconUrl);
    if (cached) return cached;

    console.log(`[IconCache] 尝试缓存: ${iconUrl}`);

    // 定义下载函数，支持 URL 和模式
    const download = async (url) => {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
        const blob = await response.blob();
        if (!blob.type.startsWith('image/') || blob.size < 50) {
            throw new Error(`Invalid icon response: ${blob.type || 'unknown'} ${blob.size}`);
        }
        return blob;
    };

    let blob = null;

    try {
        // 1. 尝试直连下载
        try {
            blob = await download(iconUrl);
        } catch (e) {
            console.warn(`[IconCache] 直连失败: ${iconUrl}, 尝试使用 CORS 代理...`);
            // 2. 直连失败，尝试使用 CORS 代理 (AllOrigins)
            // 注意：公共代理可能不稳定，但在纯前端环境下是为数不多的解法之一
            const proxyUrl = `https://api.allorigins.win/raw?url=${encodeURIComponent(iconUrl)}`;
            blob = await download(proxyUrl);
        }

        if (!blob) throw new Error('All fetch methods failed');

        // 转换为 base64
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.onloadend = async () => {
                const base64 = reader.result;
                if (base64 && base64.length > 50) { // 简单检查是否有效
                    await IconCache.set(iconUrl, base64);
                    console.log(`[IconCache] 成功缓存 (Base64 length: ${base64.length})`);
                    resolve(base64);
                } else {
                    resolve(null);
                }
            };
            reader.onerror = () => resolve(null);
            reader.readAsDataURL(blob);
        });

    } catch (e) {
        console.warn(`[IconCache] 最终无法缓存: ${iconUrl}`, e);
        return null;
    }
}

function getIconCandidateUrls(siteUrl) {
    try {
        const url = new URL(siteUrl);
        const origin = url.origin;
        const hostname = url.hostname;
        return [
            `https://favicon.im/${hostname}?larger=true`,
            `https://www.google.com/s2/favicons?domain=${encodeURIComponent(hostname)}&sz=128`,
            `${origin}/favicon.ico`,
            `${origin}/favicon.png`,
            `${origin}/apple-touch-icon.png`,
            `${origin}/apple-touch-icon-precomposed.png`
        ];
    } catch (e) {
        return [];
    }
}

function uniqueUrls(urls) {
    return urls
        .filter(url => typeof url === 'string' && /^https?:\/\//i.test(url))
        .filter((url, index, arr) => arr.indexOf(url) === index);
}

function getEngineIconCandidateUrls(engine) {
    const candidates = [];
    if (engine?.icon) candidates.push(engine.icon);
    if (engine?.url) {
        try {
            const searchUrl = new URL(engine.url);
            const hostname = searchUrl.hostname;
            candidates.push(
                `https://www.google.com/s2/favicons?domain=${encodeURIComponent(hostname)}&sz=128`,
                `https://favicon.im/${hostname}?larger=true`,
                `${searchUrl.origin}/favicon.ico`,
                `${searchUrl.origin}/favicon.png`,
                `${searchUrl.origin}/apple-touch-icon.png`
            );
        } catch (e) {}
    }
    return uniqueUrls(candidates);
}

function getPreviewIconCandidateUrls(siteUrl) {
    try {
        const hostname = new URL(siteUrl).hostname;
        return [
            `https://www.google.com/s2/favicons?domain=${encodeURIComponent(hostname)}&sz=128`,
            `https://favicon.im/${hostname}?larger=true`
        ];
    } catch (e) {
        return getIconCandidateUrls(siteUrl).slice(0, 2);
    }
}

function getFallbackInitial(name, url = '') {
    const text = String(name || '').trim();
    if (text) return Array.from(text)[0].toLocaleUpperCase();

    try {
        const host = new URL(url).hostname.replace(/^www\./i, '');
        return Array.from(host)[0]?.toLocaleUpperCase() || '?';
    } catch (e) {
        return '?';
    }
}

function getCachedIconFromCandidates(candidates) {
    for (const url of candidates) {
        const cached = IconCache.get(url);
        if (cached) return { src: cached, cacheUrl: url, cached: true };
    }
    return { src: candidates[0] || '', cacheUrl: candidates[0] || '', cached: false };
}

function fetchIconCandidates(candidates) {
    candidates.forEach(url => {
        if (url && !IconCache.get(url)) fetchAndCacheIcon(url);
    });
}

function applyShortcutIcon(img, fallback, siteUrl, customCandidates = null) {
    const candidates = Array.isArray(customCandidates) && customCandidates.length > 0
        ? customCandidates
        : getIconCandidateUrls(siteUrl);
    const initial = getCachedIconFromCandidates(candidates);
    let index = Math.max(0, candidates.indexOf(initial.cacheUrl));
    let loadFallbackTimer = null;

    img.style.display = '';
    img.removeAttribute('data-cached');
    img.removeAttribute('crossorigin');
    if (fallback) fallback.style.display = 'none';

    const clearLoadFallbackTimer = () => {
        if (loadFallbackTimer) {
            clearTimeout(loadFallbackTimer);
            loadFallbackTimer = null;
        }
    };

    const scheduleLoadFallback = () => {
        clearLoadFallbackTimer();
        loadFallbackTimer = setTimeout(() => {
            if (!img.complete || img.naturalWidth === 0 || img.naturalHeight === 0) {
                tryNext();
            }
        }, ICON_LOAD_FALLBACK_DELAY);
    };

    const setIconSource = (src, cacheUrl) => {
        img.dataset.cacheUrl = cacheUrl;
        img.src = src;
        scheduleLoadFallback();
    };

    const showFallback = () => {
        clearLoadFallbackTimer();
        img.style.display = 'none';
        if (fallback) fallback.style.display = 'flex';
    };

    const tryNext = () => {
        clearLoadFallbackTimer();
        index += 1;
        while (index < candidates.length && IconCache.get(candidates[index])) {
            setIconSource(IconCache.get(candidates[index]), candidates[index]);
            return;
        }
        if (index < candidates.length) {
            setIconSource(candidates[index], candidates[index]);
            fetchAndCacheIcon(candidates[index]);
            return;
        }
        showFallback();
    };

    if (!initial.src) {
        showFallback();
        return;
    }

    img.draggable = false;
    img.onload = function () {
        clearLoadFallbackTimer();
        if (this.naturalWidth < 8 || this.naturalHeight < 8) {
            tryNext();
        } else if (!IconCache.get(this.dataset.cacheUrl)) {
            cacheImage(this, this.dataset.cacheUrl);
        }
    };
    img.onerror = () => {
        tryNext();
    };
    if (!initial.cached) {
        IconCache.getAsync(initial.cacheUrl).then(cachedData => {
            if (cachedData) {
                setIconSource(cachedData, initial.cacheUrl);
                img.setAttribute('data-cached', 'true');
            } else {
                fetchIconCandidates(candidates.slice(0, 2));
            }
        });
    }
    setIconSource(initial.src, initial.cacheUrl);
}

function getPreviewFallbackText(item) {
    return getFallbackInitial(item?.name, item?.url);
}

function createFolderPreviewNode(item) {
    if (item?.type === 'folder') {
        const miniFolder = document.createElement('div');
        miniFolder.className = 'folder-preview folder-preview-folder';
        miniFolder.textContent = item.name ? String(item.name).trim().charAt(0).toUpperCase() : 'F';
        return miniFolder;
    }

    const tile = document.createElement('div');
    tile.className = 'folder-preview';

    const img = document.createElement('img');
    img.className = 'folder-preview-image';
    img.alt = item?.name || '预览图标';

    const fallback = document.createElement('div');
    fallback.className = 'folder-preview-fallback';
    fallback.textContent = getPreviewFallbackText(item);
    fallback.style.display = 'none';

    tile.appendChild(img);
    tile.appendChild(fallback);
    applyShortcutIcon(img, fallback, item?.url || '', getPreviewIconCandidateUrls(item?.url || ''));
    return tile;
}

// 图片加载后缓存 (Canvas 方式)
function cacheImage(img, url) {
    if (!url || img.getAttribute('data-cached') === 'true') return;

    // 如果已有缓存，直接标记
    if (IconCache.get(url)) {
        img.setAttribute('data-cached', 'true');
        return;
    }

    // 必须等待图片加载完成
    if (!img.complete || img.naturalWidth === 0) {
        return;
    }

    try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const base64 = canvas.toDataURL('image/png');

        IconCache.set(url, base64);
        img.setAttribute('data-cached', 'true');
        console.log(`[IconCache] 通过 Canvas 缓存成功: ${url}`);
    } catch (e) {
        console.warn(`[IconCache] Canvas 缓存失败 (可能是 CORS): ${url}. 尝试 Fetch 方式...`);
        // Canvas 失败通常是因为 CORS taint，尝试重新 fetch
        fetchAndCacheIcon(url).then(cached => {
            if (cached) {
                img.setAttribute('data-cached', 'true');
            }
        });
    }
}

// Clock

// Clock
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    const clock = document.getElementById('clockWidget');
    if (clock) {
        clock.textContent = `${hours}:${minutes}:${seconds}`;
    }
}

function checkAutoNightMode() {
    if (!state.settings.autoNightMode) return;
    const hour = new Date().getHours();
    const isNight = hour >= 19 || hour < 6;

    if (state.settings.darkMode !== isNight) {
        state.settings.darkMode = isNight;
        localStorage.setItem('settings', JSON.stringify(state.settings));
        applySettings();
    }
}

// Widgets
const SCHEDULED_REFRESH_CHECK_INTERVAL = 60 * 1000;
const QUICK_NOTES_KEY = 'quickNotes';
const LEGACY_QUICK_NOTE_KEY = 'quickNote';
const MUSIC_CACHE_KEY = 'musicRecommendCache';
const MUSIC_CACHE_VERSION = 2;
const MUSIC_LIKED_IDS_KEY = 'neteaseMusicLikedIds';
const MUSIC_LOGIN_STATE_KEY = 'neteaseMusicLoginState';
const MUSIC_URL_TTL = 10 * 60 * 1000;
const NETEASE_RECOMMEND_URL = 'https://music.163.com/api/personalized/newsong?limit=10';
const NETEASE_ACCOUNT_URL = 'https://music.163.com/api/nuser/account/get';
const NETEASE_ACCOUNT_RECOMMEND_URL = 'https://music.163.com/api/v3/discovery/recommend/songs';
const NETEASE_PLAYER_URL = 'https://music.163.com/api/song/enhance/player/url/v1';
const NETEASE_USER_PLAYLIST_URL = 'https://music.163.com/api/user/playlist';
const NETEASE_PLAYLIST_TRACKS_URL = 'https://music.163.com/api/playlist/manipulate/tracks';
const NETEASE_QR_KEY_URL = 'https://music.163.com/api/login/qrcode/unikey?type=1';
const NETEASE_QR_CHECK_URL = 'https://music.163.com/api/login/qrcode/client/login?type=1';
const NETEASE_LOGOUT_URL = 'https://music.163.com/api/logout';
const NETEASE_WEB_LOGIN_URL = 'https://music.163.com/#/login';
const NETEASE_QR_IMAGE_URL = 'https://api.qrserver.com/v1/create-qr-code/?size=180x180&margin=8&data=';
const NETEASE_FALLBACK_SEARCH_URL = 'https://api.vkeys.cn/v2/music/netease?word=%E7%83%AD%E6%AD%8C%E6%A6%9C';
const NETEASE_FALLBACK_DETAIL_URL = 'https://api.vkeys.cn/v2/music/netease?id=';
const WIDGET_SETTING_KEYS = {
    hot: 'showHotWidget',
    note: 'showNoteWidget',
    music: 'showMusicWidget'
};
let quickNotes = [];
let noteSaveTimers = new Map();
let musicTracks = [];
let currentMusicIndex = -1;
let musicLoginPollingTimer = null;
let currentMusicLoginKey = '';
let lastScheduledRefreshSlot = '';

function getScheduledRefreshSlot(date = new Date()) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hourSlot = date.getHours() >= 12 ? '12' : '00';
    return `${year}-${month}-${day}-${hourSlot}`;
}

function shouldRefreshForCurrentSlot(cache, force = false) {
    if (force) return true;
    if (!cache) return true;
    return cache.refreshSlot !== getScheduledRefreshSlot();
}

function normalizeHotSource(source, fallbackIndex = 0) {
    if (!source || typeof source !== 'object') return null;
    const name = String(source.name || '').trim();
    const endpointList = Array.isArray(source.endpoints) ? source.endpoints : [source.url || source.endpoint];
    const endpoints = endpointList
        .map(endpoint => String(endpoint || '').trim())
        .filter(endpoint => /^https?:\/\//i.test(endpoint));
    if (!name || endpoints.length === 0) return null;

    const defaultSource = DEFAULT_HOT_LIST_SOURCES.find(item => item.key === source.key);
    const keyBase = String(source.key || name || `custom_${fallbackIndex}`).trim()
        .toLowerCase()
        .replace(/[^a-z0-9_-]+/g, '_')
        .replace(/^_+|_+$/g, '') || `custom_${fallbackIndex}`;

    return {
        key: defaultSource?.key || keyBase,
        name,
        homeUrl: /^https?:\/\//i.test(String(source.homeUrl || '')) ? String(source.homeUrl).trim() : endpoints[0],
        endpoints,
        itemUrlTemplate: source.itemUrlTemplate || defaultSource?.itemUrlTemplate || '',
        enabled: source.enabled !== false,
        builtIn: Boolean(defaultSource || source.builtIn)
    };
}

function ensureHotListSources() {
    const seen = new Set();
    const normalized = [];
    const configured = Array.isArray(state.settings.hotListSources) ? state.settings.hotListSources : [];
    const candidates = [...configured, ...cloneDefaultHotListSources()];

    candidates.forEach((source, index) => {
        const normalizedSource = normalizeHotSource(source, index);
        if (!normalizedSource || seen.has(normalizedSource.key)) return;
        seen.add(normalizedSource.key);
        normalized.push(normalizedSource);
    });

    if (normalized.length === 0) {
        normalized.push(...cloneDefaultHotListSources());
    }

    state.settings.hotListSources = normalized;
    if (!normalized.some(source => source.enabled)) {
        normalized[0].enabled = true;
    }
    const enabledSources = normalized.filter(source => source.enabled);
    if (!enabledSources.some(source => source.key === state.settings.hotListSource)) {
        state.settings.hotListSource = enabledSources[0].key;
    }
    return normalized;
}

function saveSettings() {
    localStorage.setItem('settings', JSON.stringify(state.settings));
}

function getHotListSources() {
    return ensureHotListSources();
}

function getEnabledHotListSources() {
    return getHotListSources().filter(source => source.enabled !== false);
}

function getHotSource(sourceKey) {
    const sources = getEnabledHotListSources();
    return sources.find(source => source.key === sourceKey) || sources[0];
}

function getCurrentHotSourceKey() {
    return getHotSource(state.settings.hotListSource)?.key || 'weibo';
}

function getHotCacheKey(sourceKey) {
    return `hotListCache:${sourceKey}`;
}

function readHotListCache(sourceKey) {
    try {
        return JSON.parse(localStorage.getItem(getHotCacheKey(sourceKey))) || null;
    } catch (e) {
        return null;
    }
}

function saveHotListCache(sourceKey, items) {
    localStorage.setItem(getHotCacheKey(sourceKey), JSON.stringify({
        updatedAt: Date.now(),
        refreshSlot: getScheduledRefreshSlot(),
        items
    }));
}

function findHotArray(payload) {
    if (Array.isArray(payload)) return payload;
    if (!payload || typeof payload !== 'object') return [];

    const candidates = [
        payload.data,
        payload.result,
        payload.list,
        payload.newslist,
        payload.items,
        payload.data?.data,
        payload.data?.list,
        payload.result?.list
    ];

    for (const candidate of candidates) {
        if (Array.isArray(candidate)) return candidate;
    }

    for (const value of Object.values(payload)) {
        if (Array.isArray(value)) return value;
    }
    return [];
}

function getHotItemTitle(item, content) {
    return content.title
        || item.title
        || item.word
        || item.keyword
        || item.query
        || item.full_name
        || item.name
        || item.hotword
        || item.desc
        || item.summary;
}

function getHotItemUrl(item, content, source, templateUrl) {
    return item.html_url
        || item.url
        || item.link
        || item.mobileUrl
        || item.mobilUrl
        || item.href
        || content.url
        || templateUrl
        || source.homeUrl;
}

function getHotItemValue(item, source) {
    if (source.key === 'github' && item.stargazers_count) {
        return `★ ${formatCompactNumber(item.stargazers_count)}`;
    }
    if (source.key === 'readhub') {
        return formatHotValue(item.summary || item.siteName || item.publishDate || '');
    }
    if (source.key === 'juejin') {
        return formatHotValue(item.content_counter?.hot_rank || item.content_counter?.view || item.hot || '');
    }
    return formatHotValue(
        item.hot
        || item.heat
        || item.score
        || item.hotValue
        || item.view
        || item.desc
        || item.siteName
        || ''
    );
}

function normalizeHotItems(payload, source) {
    const rawItems = findHotArray(payload);
    return rawItems
        .map((item, index) => {
            if (!item || typeof item !== 'object') return null;
            const content = item.content || item.article_info || item.item_info?.article_info || item;
            const title = getHotItemTitle(item, content);
            if (!title) return null;

            const itemId = content.content_id || content.article_id || item.id || item.content_id;
            const templateUrl = source.itemUrlTemplate && itemId
                ? source.itemUrlTemplate.replace('{id}', encodeURIComponent(itemId))
                : '';
            const url = getHotItemUrl(item, content, source, templateUrl);
            const hot = getHotItemValue(item, source);
            return {
                rank: Number(item.index || item.rank || index + 1),
                title: String(title),
                url: String(url),
                hot: String(hot || '')
            };
        })
        .filter(Boolean)
        .slice(0, 10);
}

function formatHotValue(value) {
    if (typeof value === 'number') return formatCompactNumber(value);
    return String(value || '');
}

function formatCompactNumber(value) {
    const num = Number(value);
    if (!Number.isFinite(num)) return String(value || '');
    if (num >= 100000000) return `${(num / 100000000).toFixed(num >= 1000000000 ? 1 : 2).replace(/\\.0+$/, '')}亿`;
    if (num >= 10000) return `${(num / 10000).toFixed(num >= 100000 ? 1 : 2).replace(/\\.0+$/, '')}万`;
    return String(Math.round(num));
}

async function fetchWithTimeout(url, options = {}, timeout = 6000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
        return await fetch(url, {
            cache: 'no-store',
            ...options,
            signal: controller.signal
        });
    } finally {
        clearTimeout(timer);
    }
}

async function fetchHotList(sourceKey) {
    const source = getHotSource(sourceKey);
    if (!source) throw new Error('没有可用热榜数据源');
    let lastError = null;

    for (const endpoint of source.endpoints) {
        try {
            const response = await fetchWithTimeout(endpoint);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const items = normalizeHotItems(await response.json(), source);
            if (items.length > 0) return items;
        } catch (error) {
            lastError = error;
            console.warn('[HotList] 加载失败，尝试下一个来源:', endpoint, error);
        }
    }

    throw lastError || new Error('没有可用热榜数据');
}

function renderHotStatus(message) {
    if (!els.hotList) return;
    els.hotList.innerHTML = '';
    const li = document.createElement('li');
    li.className = 'hot-status';
    li.textContent = message;
    els.hotList.appendChild(li);
}

function renderHotList(items, meta = {}) {
    if (!els.hotList) return;
    els.hotList.innerHTML = '';

    const source = getHotSource(state.settings.hotListSource);
    const statusText = meta.cached ? `${source.name} · 缓存` : `${source.name} · 已更新`;
    if (els.hotListStatus) els.hotListStatus.textContent = statusText;

    if (!items || items.length === 0) {
        renderHotStatus('暂时没有热榜数据');
        return;
    }

    items.forEach((item, index) => {
        const li = document.createElement('li');
        li.className = 'hot-item';

        const link = document.createElement('a');
        link.href = item.url || source.homeUrl;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';

        const rank = document.createElement('span');
        rank.className = 'hot-rank';
        rank.textContent = String(item.rank || index + 1);

        const title = document.createElement('span');
        title.className = 'hot-title';
        title.textContent = item.title;

        const score = document.createElement('span');
        score.className = 'hot-score';
        score.textContent = item.hot;

        link.appendChild(rank);
        link.appendChild(title);
        link.appendChild(score);
        li.appendChild(link);
        els.hotList.appendChild(li);
    });
}

async function loadHotList(force = false) {
    if (!els.hotList || state.settings.showHotWidget === false) return;

    const sourceKey = getCurrentHotSourceKey();
    const source = getHotSource(sourceKey);
    const requestToken = ++hotListRequestToken;
    const cached = readHotListCache(sourceKey);
    const hasCache = cached && Array.isArray(cached.items) && cached.items.length > 0;

    if (hasCache && !shouldRefreshForCurrentSlot(cached, force)) {
        if (requestToken === hotListRequestToken && state.settings.hotListSource === sourceKey) {
            renderHotList(cached.items, { cached: true });
        }
        return;
    }

    if (els.hotListStatus) els.hotListStatus.textContent = `${source.name} · 加载中`;
    renderHotStatus('正在加载...');

    try {
        const items = await fetchHotList(sourceKey);
        if (requestToken !== hotListRequestToken || state.settings.hotListSource !== sourceKey) return;
        saveHotListCache(sourceKey, items);
        renderHotList(items);
    } catch (error) {
        if (requestToken !== hotListRequestToken || state.settings.hotListSource !== sourceKey) return;
        console.warn('[HotList] 所有来源都不可用:', error);
        if (cached?.items?.length) {
            renderHotList(cached.items, { cached: true });
            if (els.hotListStatus) els.hotListStatus.textContent = `${source.name} · 使用缓存`;
        } else {
            if (els.hotListStatus) els.hotListStatus.textContent = `${source.name} · 暂不可用`;
            renderHotStatus('热榜 API 暂时不可用');
        }
    }
}

function setHotListSource(sourceKey, shouldReload = true) {
    if (!getEnabledHotListSources().some(source => source.key === sourceKey)) return;
    state.settings.hotListSource = sourceKey;
    saveSettings();
    renderHotSourceTabs();
    renderHotSourceSettings();
    if (shouldReload) loadHotList(true);
}

function createHotSourceKey(name) {
    const base = String(name || 'hot')
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9_-]+/g, '_')
        .replace(/^_+|_+$/g, '') || 'hot';
    const existing = new Set(getHotListSources().map(source => source.key));
    let key = `custom_${base}`;
    let index = 1;
    while (existing.has(key)) {
        key = `custom_${base}_${index}`;
        index += 1;
    }
    return key;
}

function reorderHotSources(sourceKey, targetKey) {
    const sources = getHotListSources();
    const fromIndex = sources.findIndex(source => source.key === sourceKey);
    const toIndex = sources.findIndex(source => source.key === targetKey);
    if (fromIndex < 0 || toIndex < 0 || fromIndex === toIndex) return;

    const [item] = sources.splice(fromIndex, 1);
    sources.splice(toIndex, 0, item);
    state.settings.hotListSources = sources;
    saveSettings();
    renderHotSourceTabs();
    renderHotSourceSettings();
}

function updateHotSourceName(sourceKey, name) {
    const source = getHotListSources().find(item => item.key === sourceKey);
    const nextName = String(name || '').trim();
    if (!source || !nextName) {
        return false;
    }
    source.name = nextName;
    saveSettings();
    renderHotSourceTabs();
    if (state.settings.hotListSource === sourceKey && els.hotListStatus) {
        const statusSuffix = els.hotListStatus.textContent.split('·')[1]?.trim();
        if (statusSuffix) els.hotListStatus.textContent = `${nextName} · ${statusSuffix}`;
    }
    return true;
}

function setHotSourceEnabled(sourceKey, enabled) {
    const sources = getHotListSources();
    const source = sources.find(item => item.key === sourceKey);
    if (!source) return;
    const enabledCount = sources.filter(item => item.enabled !== false).length;
    if (!enabled && enabledCount <= 1) {
        alert('至少保留一个热榜数据源');
        renderHotSourceSettings();
        return;
    }
    source.enabled = enabled;
    if (!enabled && state.settings.hotListSource === sourceKey) {
        state.settings.hotListSource = sources.find(item => item.enabled !== false && item.key !== sourceKey)?.key || sourceKey;
        loadHotList(true);
    }
    saveSettings();
    renderHotSourceTabs();
    renderHotSourceSettings();
}

function renderHotSourceTabs() {
    if (!els.hotSourceTabs) return;
    const sources = getEnabledHotListSources();
    const activeKey = getCurrentHotSourceKey();
    els.hotSourceTabs.innerHTML = '';
    els.hotSourceTabs.onwheel = (e) => {
        if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
        e.preventDefault();
        els.hotSourceTabs.scrollLeft += e.deltaY;
    };

    sources.forEach(source => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'hot-source-tab draggable-item';
        btn.textContent = source.name;
        btn.title = source.name;
        btn.draggable = true;
        btn.setAttribute('draggable', 'true');
        btn.dataset.draggable = 'true';
        btn.dataset.key = source.key;
        btn.classList.toggle('active', source.key === activeKey);
        btn.onclick = () => setHotListSource(source.key, true);
        btn.ondragstart = (e) => handleHotSourceDragStart(e, source.key);
        btn.ondragover = window.handleDragOver;
        btn.ondragenter = handleDragEnter;
        btn.ondragleave = handleDragLeave;
        btn.ondrop = (e) => handleHotSourceDrop(e, source.key);
        els.hotSourceTabs.appendChild(btn);
    });
}

function renderHotSourceSettings() {
    if (!els.hotSourceSettingList) return;
    const sources = getHotListSources();
    const activeKey = getCurrentHotSourceKey();
    els.hotSourceSettingList.innerHTML = '';

    sources.forEach(source => {
        const item = document.createElement('div');
        item.className = 'hot-source-setting-item';
        item.classList.toggle('disabled', source.enabled === false);
        item.dataset.key = source.key;

        const enableLabel = document.createElement('label');
        enableLabel.className = 'hot-source-enable';
        enableLabel.title = source.enabled === false ? '启用数据源' : '关闭数据源';

        const enableInput = document.createElement('input');
        enableInput.type = 'checkbox';
        enableInput.checked = source.enabled !== false;
        enableInput.draggable = false;
        enableInput.onchange = () => setHotSourceEnabled(source.key, enableInput.checked);
        enableLabel.appendChild(enableInput);

        const name = document.createElement('input');
        name.type = 'text';
        name.className = 'hot-source-setting-name';
        name.value = source.name;
        name.title = source.name;
        name.draggable = false;
        name.addEventListener('input', () => {
            const isValid = updateHotSourceName(source.key, name.value);
            name.classList.toggle('invalid', !isValid);
            if (isValid) name.title = name.value.trim();
        });
        name.addEventListener('change', () => {
            const isValid = updateHotSourceName(source.key, name.value);
            if (isValid) {
                name.value = name.value.trim();
                name.classList.remove('invalid');
            } else {
                name.value = source.name;
                name.classList.remove('invalid');
            }
        });
        name.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') name.blur();
        });

        const url = document.createElement('div');
        url.className = 'hot-source-setting-url';
        url.textContent = source.endpoints[0] || '';
        url.title = source.endpoints[0] || '';

        const actions = document.createElement('div');
        actions.className = 'hot-source-setting-actions';

        const activeBtn = document.createElement('button');
        activeBtn.type = 'button';
        activeBtn.className = 'btn-secondary';
        activeBtn.textContent = source.enabled === false ? '已关' : (source.key === activeKey ? '当前' : '使用');
        activeBtn.disabled = source.enabled === false || source.key === activeKey;
        activeBtn.onclick = () => setHotListSource(source.key, true);

        const deleteBtn = document.createElement('button');
        deleteBtn.type = 'button';
        deleteBtn.className = 'hot-source-delete-btn';
        deleteBtn.textContent = '×';
        deleteBtn.title = '删除';
        deleteBtn.classList.toggle('hidden', source.builtIn);
        deleteBtn.onclick = () => deleteHotSource(source.key);

        actions.appendChild(activeBtn);
        actions.appendChild(deleteBtn);
        item.appendChild(enableLabel);
        item.appendChild(name);
        item.appendChild(url);
        item.appendChild(actions);
        els.hotSourceSettingList.appendChild(item);
    });
}

function addHotSourceFromSettings() {
    const name = els.hotSourceNameInput?.value.trim() || '';
    const endpoint = els.hotSourceUrlInput?.value.trim() || '';
    const homeUrl = els.hotSourceHomeInput?.value.trim() || '';

    if (!name || !/^https?:\/\//i.test(endpoint)) {
        alert('请填写名称和有效的 JSON API 地址');
        return;
    }
    if (homeUrl && !/^https?:\/\//i.test(homeUrl)) {
        alert('主页地址需要以 http:// 或 https:// 开头');
        return;
    }

    const sources = getHotListSources();
    const source = normalizeHotSource({
        key: createHotSourceKey(name),
        name,
        homeUrl: homeUrl || endpoint,
        endpoints: [endpoint],
        builtIn: false
    }, sources.length);
    if (!source) {
        alert('数据源格式不完整');
        return;
    }

    sources.push(source);
    state.settings.hotListSources = sources;
    state.settings.hotListSource = source.key;
    saveSettings();

    if (els.hotSourceNameInput) els.hotSourceNameInput.value = '';
    if (els.hotSourceUrlInput) els.hotSourceUrlInput.value = '';
    if (els.hotSourceHomeInput) els.hotSourceHomeInput.value = '';

    renderHotSourceTabs();
    renderHotSourceSettings();
    loadHotList(true);
}

function deleteHotSource(sourceKey) {
    const sources = getHotListSources();
    const source = sources.find(item => item.key === sourceKey);
    if (!source || source.builtIn) return;

    state.settings.hotListSources = sources.filter(item => item.key !== sourceKey);
    if (state.settings.hotListSource === sourceKey) {
        state.settings.hotListSource = getEnabledHotListSources()[0]?.key || 'weibo';
        loadHotList(true);
    }
    saveSettings();
    renderHotSourceTabs();
    renderHotSourceSettings();
}

function createQuickNote(content = '') {
    return {
        id: `note_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        content,
        updatedAt: Date.now()
    };
}

function readQuickNotes() {
    try {
        const notes = JSON.parse(localStorage.getItem(QUICK_NOTES_KEY));
        if (Array.isArray(notes) && notes.length > 0) {
            return notes.map(note => ({
                id: note.id || createQuickNote().id,
                content: String(note.content || ''),
                updatedAt: note.updatedAt || Date.now()
            }));
        }
    } catch (e) {
        console.warn('[Notes] 读取多便签失败，尝试旧数据:', e);
    }

    const legacyNote = localStorage.getItem(LEGACY_QUICK_NOTE_KEY) || '';
    return [createQuickNote(legacyNote)];
}

function saveQuickNotes() {
    localStorage.setItem(QUICK_NOTES_KEY, JSON.stringify(quickNotes));
    // 保留旧 key，老配置或旧版本脚本仍能读到第一张便签。
    localStorage.setItem(LEGACY_QUICK_NOTE_KEY, quickNotes[0]?.content || '');
}

function getWidgetsExportData() {
    const notes = quickNotes.length > 0 ? quickNotes : readQuickNotes();
    return {
        quickNotes: notes,
        quickNote: notes[0]?.content || ''
    };
}

function restoreWidgetsFromConfig(widgets) {
    if (!widgets) return;
    if (Array.isArray(widgets.quickNotes)) {
        localStorage.setItem(QUICK_NOTES_KEY, JSON.stringify(widgets.quickNotes));
        localStorage.setItem(LEGACY_QUICK_NOTE_KEY, widgets.quickNotes[0]?.content || '');
    } else if (widgets.quickNote !== undefined) {
        localStorage.setItem(LEGACY_QUICK_NOTE_KEY, widgets.quickNote);
        localStorage.removeItem(QUICK_NOTES_KEY);
    }
}

function setNoteStatus(text) {
    if (els.noteSavedStatus) els.noteSavedStatus.textContent = text;
}

function formatNoteTime(timestamp) {
    const date = new Date(timestamp);
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

function scheduleNoteSave(note) {
    if (noteSaveTimers.has(note.id)) clearTimeout(noteSaveTimers.get(note.id));
    setNoteStatus('保存中');

    const timer = setTimeout(() => {
        note.updatedAt = Date.now();
        saveQuickNotes();
        setNoteStatus(`已保存 ${formatNoteTime(note.updatedAt)}`);
    }, 300);
    noteSaveTimers.set(note.id, timer);
}

function renderNotes() {
    if (!els.notesGrid) return;
    els.notesGrid.innerHTML = '';

    quickNotes.forEach((note, index) => {
        const card = document.createElement('div');
        card.className = 'note-card';

        const header = document.createElement('div');
        header.className = 'note-card-header';

        const meta = document.createElement('span');
        meta.textContent = `便签 ${index + 1}`;

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'note-delete-btn';
        deleteBtn.type = 'button';
        deleteBtn.title = '删除便签';
        deleteBtn.setAttribute('aria-label', '删除便签');
        deleteBtn.textContent = '×';
        deleteBtn.onclick = () => {
            if (quickNotes.length === 1) {
                note.content = '';
            } else {
                quickNotes = quickNotes.filter(item => item.id !== note.id);
            }
            saveQuickNotes();
            renderNotes();
            setNoteStatus('已删除');
        };

        const textarea = document.createElement('textarea');
        textarea.className = 'note-textarea';
        textarea.placeholder = '写点临时想法...';
        textarea.spellcheck = false;
        textarea.value = note.content;
        textarea.dataset.noteId = note.id;
        textarea.addEventListener('input', () => {
            note.content = textarea.value;
            scheduleNoteSave(note);
        });

        header.appendChild(meta);
        header.appendChild(deleteBtn);
        card.appendChild(header);
        card.appendChild(textarea);
        els.notesGrid.appendChild(card);
    });
}

function addQuickNote() {
    const note = createQuickNote();
    quickNotes.push(note);
    saveQuickNotes();
    renderNotes();
    setNoteStatus('已新增');
    requestAnimationFrame(() => {
        const textarea = els.notesGrid?.querySelector(`textarea[data-note-id="${note.id}"]`);
        textarea?.focus();
    });
}

function initNotes() {
    quickNotes = readQuickNotes();
    saveQuickNotes();
    renderNotes();

    if (els.addNoteBtn) {
        els.addNoteBtn.onclick = addQuickNote;
    }

    if (els.clearNoteBtn) {
        els.clearNoteBtn.onclick = () => {
            const hasContent = quickNotes.some(note => note.content.trim());
            if (!hasContent) return;
            if (!confirm('确定要清空全部便签吗？')) return;
            quickNotes = [createQuickNote()];
            saveQuickNotes();
            renderNotes();
            if (els.noteSavedStatus) els.noteSavedStatus.textContent = '已清空';
        };
    }
}

function getWidgetOrder() {
    const validKeys = Object.keys(WIDGET_SETTING_KEYS);
    const configured = Array.isArray(state.settings.widgetVisibilityOrder) ? state.settings.widgetVisibilityOrder : [];
    const order = configured.filter(key => validKeys.includes(key));
    validKeys.forEach(key => {
        if (!order.includes(key)) order.push(key);
    });
    state.settings.widgetVisibilityOrder = order;
    return order;
}

function setWidgetEnabled(widgetKey, enabled) {
    const settingKey = WIDGET_SETTING_KEYS[widgetKey];
    if (!settingKey) return;
    state.settings[settingKey] = enabled;
    if (enabled) {
        const order = getWidgetOrder().filter(key => key !== widgetKey);
        order.push(widgetKey);
        state.settings.widgetVisibilityOrder = order;
    }
    enforceWidgetLimit(enabled ? widgetKey : null);
    saveSettings();
    applySettings();
    if (widgetKey === 'hot' && enabled) loadHotList(false);
    if (widgetKey === 'music' && enabled) loadMusicList(false);
}

function refreshWidgetsOnSchedule() {
    const currentSlot = getScheduledRefreshSlot();
    if (lastScheduledRefreshSlot === currentSlot) return;
    lastScheduledRefreshSlot = currentSlot;

    if (state.settings.showHotWidget !== false) {
        loadHotList(false);
    }
    if (state.settings.showMusicWidget === true) {
        loadMusicList(false);
    }
}

function enforceWidgetLimit(preferredKey = null) {
    const order = getWidgetOrder();
    let changed = false;
    const enabledKeys = Object.entries(WIDGET_SETTING_KEYS)
        .filter(([, settingKey]) => state.settings[settingKey] !== false)
        .map(([key]) => key);

    while (enabledKeys.length > 3) {
        const removeKey = order.find(key => enabledKeys.includes(key) && key !== preferredKey) || enabledKeys[0];
        state.settings[WIDGET_SETTING_KEYS[removeKey]] = false;
        changed = true;
        enabledKeys.splice(enabledKeys.indexOf(removeKey), 1);
    }
    return changed;
}

function readMusicCache(source = 'public') {
    try {
        const cache = JSON.parse(localStorage.getItem(MUSIC_CACHE_KEY)) || null;
        if (!cache) return null;
        if (cache.version !== MUSIC_CACHE_VERSION) return null;
        if (!cache.source && source === 'public') return cache;
        return cache.source === source ? cache : null;
    } catch (e) {
        return null;
    }
}

function saveMusicCache(tracks, source = 'public') {
    localStorage.setItem(MUSIC_CACHE_KEY, JSON.stringify({
        version: MUSIC_CACHE_VERSION,
        updatedAt: Date.now(),
        refreshSlot: getScheduledRefreshSlot(),
        source,
        tracks
    }));
}

function readMusicLoginState() {
    try {
        return JSON.parse(localStorage.getItem(MUSIC_LOGIN_STATE_KEY)) || { loggedIn: false };
    } catch (e) {
        return { loggedIn: false };
    }
}

function saveMusicLoginState(profile) {
    const currentState = readMusicLoginState();
    const loginState = {
        loggedIn: true,
        userId: profile?.userId || profile?.userId === 0 ? profile.userId : profile?.id,
        nickname: profile?.nickname || '已登录',
        avatarUrl: profile?.avatarUrl || '',
        favoritePlaylistId: profile?.favoritePlaylistId || currentState.favoritePlaylistId || '',
        updatedAt: Date.now()
    };
    localStorage.setItem(MUSIC_LOGIN_STATE_KEY, JSON.stringify(loginState));
    updateMusicLoginButton();
    return loginState;
}

function saveMusicFavoritePlaylistId(playlistId) {
    const loginState = readMusicLoginState();
    if (!playlistId) return loginState;
    loginState.favoritePlaylistId = String(playlistId);
    localStorage.setItem(MUSIC_LOGIN_STATE_KEY, JSON.stringify(loginState));
    return loginState;
}

function clearMusicLoginState() {
    localStorage.removeItem(MUSIC_LOGIN_STATE_KEY);
    updateMusicLoginButton();
}

function readMusicLikedIds() {
    try {
        const ids = JSON.parse(localStorage.getItem(MUSIC_LIKED_IDS_KEY)) || [];
        return Array.isArray(ids) ? ids.map(String) : [];
    } catch (e) {
        return [];
    }
}

function saveMusicLikedIds(ids) {
    localStorage.setItem(MUSIC_LIKED_IDS_KEY, JSON.stringify([...new Set(ids.map(String))]));
}

function markMusicTrackLiked(track) {
    if (!track?.id) return;
    const ids = readMusicLikedIds();
    ids.push(String(track.id));
    saveMusicLikedIds(ids);
}

function unmarkMusicTrackLiked(track) {
    if (!track?.id) return;
    saveMusicLikedIds(readMusicLikedIds().filter(id => id !== String(track.id)));
}

function isMusicTrackLiked(track) {
    return Boolean(track?.id && readMusicLikedIds().includes(String(track.id)));
}

function updateMusicLoginButton() {
    if (!els.musicLoginBtn) return;
    const loginState = readMusicLoginState();
    els.musicLoginBtn.classList.toggle('active', loginState.loggedIn === true);
    els.musicLoginBtn.textContent = loginState.loggedIn ? '退' : '登';
    els.musicLoginBtn.title = loginState.loggedIn
        ? `退出网易云${loginState.nickname ? `：${loginState.nickname}` : ''}`
        : '登录网易云';
    els.musicLoginBtn.setAttribute('aria-label', els.musicLoginBtn.title);
}

function updateMusicLikeButton(track = musicTracks[currentMusicIndex]) {
    if (!els.musicLikeBtn) return;
    const hasTrack = Boolean(track?.id);
    const liked = hasTrack && isMusicTrackLiked(track);
    els.musicLikeBtn.disabled = !hasTrack;
    els.musicLikeBtn.classList.toggle('active', liked);
    els.musicLikeBtn.textContent = liked ? '♥' : '♡';
    const label = liked ? '从我最喜欢取消收藏' : '收藏到我最喜欢';
    els.musicLikeBtn.title = label;
    els.musicLikeBtn.setAttribute('aria-label', label);
}

function setMusicLoginStatus(message) {
    if (els.musicLoginQrStatus) els.musicLoginQrStatus.textContent = message;
}

function stopMusicLoginPolling() {
    if (musicLoginPollingTimer) {
        clearInterval(musicLoginPollingTimer);
        musicLoginPollingTimer = null;
    }
    currentMusicLoginKey = '';
}

function closeMusicLoginModal() {
    stopMusicLoginPolling();
    if (els.musicLoginModal) els.musicLoginModal.classList.add('hidden');
}

function getNeteaseFetchOptions(options = {}) {
    return {
        credentials: 'include',
        ...options,
        headers: { Accept: 'application/json', ...(options.headers || {}) }
    };
}

async function fetchNeteaseJson(url, options = {}, timeout = 8000) {
    const separator = url.includes('?') ? '&' : '?';
    const response = await fetchWithTimeout(`${url}${separator}timestamp=${Date.now()}`, getNeteaseFetchOptions(options), timeout);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return response.json();
}

function findMusicItems(payload) {
    const candidates = [
        payload?.data?.dailySongs,
        payload?.data?.recommend,
        payload?.data?.songs,
        payload?.data?.list,
        payload?.result,
        payload?.recommend,
        payload?.data
    ];
    return candidates.find(Array.isArray) || [];
}

function normalizeMusicTracks(payload, limit = 10) {
    const rawItems = findMusicItems(payload);
    if (!Array.isArray(rawItems)) return [];

    return rawItems
        .map(item => {
            const song = item.song && typeof item.song === 'object' ? item.song : item;
            const id = item.id || song.id;
            const name = item.name || (typeof item.song === 'string' ? item.song : '') || song.name;
            const artists = song.artists || song.ar || item.artists || [];
            const artist = Array.isArray(artists) && artists.length > 0
                ? artists.map(person => person.name).filter(Boolean).join(' / ')
                : (item.singer || '网易云音乐');
            const album = song.album || song.al || item.album || {};
            const cover = item.picUrl || item.pic || item.cover || song.picUrl || album.picUrl || '';
            if (!id || !name) return null;
            return {
                id: String(id),
                name: String(name),
                artist,
                cover: normalizeMusicImageUrl(cover),
                url: normalizeMusicAudioUrl(item.url || `https://music.163.com/song/media/outer/url?id=${id}.mp3`),
                resolvedAt: item.url ? Date.now() : 0
            };
        })
        .filter(Boolean)
        .slice(0, limit);
}

function normalizeMusicAudioUrl(url) {
    const text = String(url || '');
    if (text.startsWith('http://') && text.includes('.music.126.net/')) {
        return text.replace(/^http:\/\//, 'https://');
    }
    return text;
}

function normalizeMusicImageUrl(url) {
    const text = String(url || '');
    if (text.startsWith('http://') && text.includes('.music.126.net/')) {
        return text.replace(/^http:\/\//, 'https://');
    }
    return text;
}

function needsMusicUrlResolve(track) {
    if (!track?.id) return false;
    if (!track.url) return true;
    if (track.url.includes('/song/media/outer/url')) return true;
    if (track.url.includes('.music.126.net/') && Date.now() - (track.resolvedAt || 0) > MUSIC_URL_TTL) {
        return true;
    }
    return false;
}

async function fetchNeteasePlayableUrlMap(ids) {
    const uniqueIds = [...new Set(ids.map(id => String(id)).filter(Boolean))];
    if (uniqueIds.length === 0) return new Map();
    const idsParam = encodeURIComponent(JSON.stringify(uniqueIds.map(id => Number(id)).filter(Number.isFinite)));
    const payload = await fetchNeteaseJson(`${NETEASE_PLAYER_URL}?ids=${idsParam}&level=standard&encodeType=mp3`, {}, 10000);
    const data = Array.isArray(payload?.data) ? payload.data : [];
    const urlMap = new Map();
    data.forEach(item => {
        if (!item?.id || !item.url) return;
        urlMap.set(String(item.id), normalizeMusicAudioUrl(item.url));
    });
    return urlMap;
}

async function resolveMusicTrackUrls(tracks) {
    const targets = tracks.filter(needsMusicUrlResolve);
    if (targets.length === 0) return tracks;
    const urlMap = await fetchNeteasePlayableUrlMap(targets.map(track => track.id));
    const resolvedAt = Date.now();
    return tracks
        .map(track => {
            const resolvedUrl = urlMap.get(String(track.id));
            if (!resolvedUrl) return track;
            return { ...track, url: resolvedUrl, resolvedAt };
        })
        .filter(track => track.url && !track.url.includes('/song/media/outer/url'));
}

async function fetchFallbackMusicTracks() {
    const listResponse = await fetchWithTimeout(NETEASE_FALLBACK_SEARCH_URL, {
        headers: { Accept: 'application/json' }
    }, 8000);
    if (!listResponse.ok) throw new Error(`HTTP ${listResponse.status}`);
    const listPayload = await listResponse.json();
    const listTracks = normalizeMusicTracks(listPayload).slice(0, 10);

    const detailedTracks = await Promise.all(listTracks.map(async (track) => {
        try {
            const detailResponse = await fetchWithTimeout(`${NETEASE_FALLBACK_DETAIL_URL}${encodeURIComponent(track.id)}`, {
                headers: { Accept: 'application/json' }
            }, 8000);
            if (!detailResponse.ok) return track;
            const detailPayload = await detailResponse.json();
            const detail = detailPayload?.data;
            if (!detail?.url) return track;
            return {
                id: String(detail.id || track.id),
                name: String(detail.song || track.name),
                artist: String(detail.singer || track.artist),
                cover: normalizeMusicImageUrl(detail.pic || detail.cover || track.cover || ''),
                url: normalizeMusicAudioUrl(detail.url),
                resolvedAt: Date.now()
            };
        } catch (e) {
            return track;
        }
    }));

    return detailedTracks.filter(track => track.url).slice(0, 10);
}

async function fetchAccountMusicTracks() {
    const payload = await fetchNeteaseJson(NETEASE_ACCOUNT_RECOMMEND_URL, {}, 8000);
    const tracks = await resolveMusicTrackUrls(normalizeMusicTracks(payload, 40));
    if (tracks.length === 0) throw new Error('账号每日推荐为空');
    return tracks;
}

function findFavoritePlaylist(playlists, userId) {
    if (!Array.isArray(playlists)) return null;
    const ownPlaylists = playlists.filter(item => !userId || String(item.userId) === String(userId));
    return ownPlaylists.find(item => item.specialType === 5)
        || ownPlaylists.find(item => /我.*喜欢|最喜欢|喜欢的音乐/.test(String(item.name || '')))
        || playlists.find(item => item.specialType === 5)
        || playlists.find(item => /我.*喜欢|最喜欢|喜欢的音乐/.test(String(item.name || '')))
        || null;
}

async function getFavoritePlaylistId(loginState) {
    if (loginState?.favoritePlaylistId) return String(loginState.favoritePlaylistId);
    const userId = loginState?.userId || (await verifyMusicAccount()).userId;
    if (!userId && userId !== 0) throw new Error('没有读取到网易云用户 ID');
    const payload = await fetchNeteaseJson(`${NETEASE_USER_PLAYLIST_URL}?uid=${encodeURIComponent(userId)}&limit=1000&offset=0`, {}, 8000);
    const playlist = findFavoritePlaylist(payload?.playlist, userId);
    if (!playlist?.id) throw new Error('没有找到我最喜欢歌单');
    saveMusicFavoritePlaylistId(playlist.id);
    return String(playlist.id);
}

async function updateFavoritePlaylistTrack(track, loginState, op) {
    const playlistId = await getFavoritePlaylistId(loginState);
    const trackId = Number(track.id);
    if (!Number.isFinite(trackId)) throw new Error('歌曲 ID 无效');
    const trackIds = encodeURIComponent(JSON.stringify([trackId]));
    const action = op === 'del' ? 'del' : 'add';
    return fetchNeteaseJson(`${NETEASE_PLAYLIST_TRACKS_URL}?op=${action}&pid=${encodeURIComponent(playlistId)}&trackIds=${trackIds}&imme=true`, {
        method: 'POST'
    }, 10000);
}

async function verifyMusicAccount() {
    const payload = await fetchNeteaseJson(NETEASE_ACCOUNT_URL, {}, 8000);
    const profile = payload?.profile;
    if (!profile?.userId && profile?.userId !== 0) throw new Error('未读取到网易云账号');
    const loginState = saveMusicLoginState(profile);
    renderMusicStatus(`网易云 · ${loginState.nickname}`);
    return loginState;
}

async function startMusicLogin() {
    if (!els.musicLoginModal) return;
    stopMusicLoginPolling();
    els.musicLoginModal.classList.remove('hidden');
    if (els.musicLoginQrImage) {
        els.musicLoginQrImage.removeAttribute('src');
        els.musicLoginQrImage.alt = '网易云登录二维码';
    }
    setMusicLoginStatus('正在生成二维码...');

    try {
        const payload = await fetchNeteaseJson(NETEASE_QR_KEY_URL, {}, 8000);
        const key = payload?.unikey;
        if (!key) throw new Error('没有拿到二维码 key');
        currentMusicLoginKey = key;
        const loginUrl = `https://music.163.com/login?codekey=${encodeURIComponent(key)}`;
        if (els.musicLoginQrImage) {
            els.musicLoginQrImage.src = `${NETEASE_QR_IMAGE_URL}${encodeURIComponent(loginUrl)}`;
        }
        setMusicLoginStatus('请用网易云音乐 App 扫码登录');
        musicLoginPollingTimer = setInterval(() => checkMusicLoginStatus(key), 2200);
    } catch (error) {
        console.warn('[Music] 生成网易云登录二维码失败:', error);
        setMusicLoginStatus('二维码生成失败，可网页登录后刷新推荐');
    }
}

async function checkMusicLoginStatus(key) {
    if (!key || key !== currentMusicLoginKey) return;
    try {
        const payload = await fetchNeteaseJson(`${NETEASE_QR_CHECK_URL}&key=${encodeURIComponent(key)}`, {}, 8000);
        if (payload.code === 801) {
            setMusicLoginStatus('等待扫码...');
            return;
        }
        if (payload.code === 802) {
            setMusicLoginStatus('已扫码，请在手机上确认');
            return;
        }
        if (payload.code === 803) {
            setMusicLoginStatus('登录成功，正在读取推荐...');
            stopMusicLoginPolling();
            try {
                await verifyMusicAccount();
                setTimeout(() => {
                    if (els.musicLoginModal) els.musicLoginModal.classList.add('hidden');
                    loadMusicList(true);
                }, 500);
            } catch (verifyError) {
                console.warn('[Music] 网易云账号校验失败:', verifyError);
                clearMusicLoginState();
                setMusicLoginStatus('登录成功但读取账号失败，可刷新重试');
            }
            return;
        }
        if (payload.code === 800) {
            stopMusicLoginPolling();
            setMusicLoginStatus('二维码已过期，请刷新二维码');
            return;
        }
        setMusicLoginStatus(payload.message || '登录状态未知');
    } catch (error) {
        console.warn('[Music] 检查网易云登录状态失败:', error);
        setMusicLoginStatus('登录状态检查失败，稍后重试');
    }
}

async function logoutMusicAccount() {
    stopMusicLoginPolling();
    try {
        await fetchNeteaseJson(NETEASE_LOGOUT_URL, {}, 5000);
    } catch (error) {
        console.warn('[Music] 网易云退出接口不可用，已清除本地状态:', error);
    }
    clearMusicLoginState();
    renderMusicStatus('网易云 · 已退出');
    loadMusicList(true);
}

async function handleMusicLoginButton() {
    const loginState = readMusicLoginState();
    if (loginState.loggedIn) {
        if (!confirm('退出网易云登录吗？')) return;
        await logoutMusicAccount();
        return;
    }
    startMusicLogin();
}

function openMusicWebLogin() {
    window.open(NETEASE_WEB_LOGIN_URL, '_blank', 'noopener,noreferrer');
    setMusicLoginStatus('网页登录完成后，回来点刷新推荐');
}

async function likeCurrentMusicTrack() {
    const track = musicTracks[currentMusicIndex];
    if (!track?.id) {
        renderMusicStatus('先选一首歌');
        updateMusicLikeButton(track);
        return;
    }

    const shouldUnlike = isMusicTrackLiked(track);

    let loginState = readMusicLoginState();
    if (!loginState.loggedIn) {
        renderMusicStatus('请先登录网易云');
        startMusicLogin();
        return;
    }
    if (!loginState.userId && loginState.userId !== 0) {
        try {
            loginState = await verifyMusicAccount();
        } catch (error) {
            renderMusicStatus('请先登录网易云');
            startMusicLogin();
            return;
        }
    }

    if (els.musicLikeBtn) els.musicLikeBtn.disabled = true;
    renderMusicStatus(shouldUnlike ? '正在取消收藏' : '正在收藏到我最喜欢');

    try {
        const payload = await updateFavoritePlaylistTrack(track, loginState, shouldUnlike ? 'del' : 'add');
        if (payload.code !== 200 && (!shouldUnlike && payload.code !== 502)) {
            throw new Error(payload.message || `收藏失败：${payload.code}`);
        }
        if (shouldUnlike) {
            unmarkMusicTrackLiked(track);
            renderMusicStatus('已取消收藏');
        } else {
            markMusicTrackLiked(track);
            renderMusicStatus(payload.code === 502 ? '已在我最喜欢' : '已收藏到我最喜欢');
        }
    } catch (error) {
        console.warn('[Music] 收藏歌曲失败:', error);
        renderMusicStatus(error.message || '收藏失败，请确认已登录');
    } finally {
        updateMusicLikeButton(track);
    }
}

function renderMusicStatus(message) {
    if (els.musicStatus) els.musicStatus.textContent = message;
}

function renderMusicList(tracks) {
    if (!els.musicList) return;
    els.musicList.innerHTML = '';

    if (!tracks || tracks.length === 0) {
        if (els.musicCurrentTitle) els.musicCurrentTitle.textContent = '暂无可播放歌曲';
        updateMusicCover(null);
        updateMusicLikeButton(null);
        const empty = document.createElement('div');
        empty.className = 'hot-status';
        empty.textContent = '暂无推荐歌曲';
        els.musicList.appendChild(empty);
        return;
    }

    tracks.forEach((track, index) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'music-item';
        btn.classList.toggle('active', index === currentMusicIndex);
        btn.onclick = () => selectMusicTrack(index, true);

        const rank = document.createElement('span');
        rank.className = 'music-index';
        rank.textContent = String(index + 1);

        const meta = document.createElement('span');
        meta.className = 'music-meta';

        const name = document.createElement('span');
        name.className = 'music-name';
        name.textContent = track.name;

        const artist = document.createElement('span');
        artist.className = 'music-artist';
        artist.textContent = track.artist;

        meta.appendChild(name);
        meta.appendChild(artist);
        btn.appendChild(rank);
        btn.appendChild(meta);
        els.musicList.appendChild(btn);
    });
}

function updateMusicControls() {
    if (!els.musicAudio) return;
    if (els.musicPlayBtn) {
        els.musicPlayBtn.textContent = els.musicAudio.paused ? '▶' : 'Ⅱ';
    }
    if (els.musicProgressFill) {
        const duration = Number.isFinite(els.musicAudio.duration) && els.musicAudio.duration > 0 ? els.musicAudio.duration : 0;
        const percent = duration ? Math.min(100, Math.max(0, (els.musicAudio.currentTime / duration) * 100)) : 0;
        els.musicProgressFill.style.width = `${percent}%`;
    }
}

function updateMusicCover(track) {
    if (!els.musicCover) return;
    const cover = track?.cover || '';
    els.musicCover.classList.toggle('has-cover', Boolean(cover));
    els.musicCover.style.backgroundImage = cover ? `url("${cover.replace(/"/g, '%22')}")` : '';
}

async function ensureMusicTrackPlayable(index) {
    const track = musicTracks[index];
    if (!track) return false;
    if (!needsMusicUrlResolve(track)) return true;
    renderMusicStatus('正在解析播放地址');
    try {
        const resolvedTracks = await resolveMusicTrackUrls([track]);
        if (!resolvedTracks[0]?.url) return false;
        musicTracks[index] = { ...track, ...resolvedTracks[0] };
        return true;
    } catch (error) {
        console.warn('[Music] 播放地址解析失败:', error);
        return false;
    }
}

async function playMusicAudioWithRecovery() {
    if (!els.musicAudio) return;
    try {
        await els.musicAudio.play();
    } catch (error) {
        console.warn('[Music] 播放失败:', error);
        renderMusicStatus('这首暂不可播放');
        updateMusicControls();
    }
}

async function toggleMusicPlayback() {
    if (!els.musicAudio) return;
    if (currentMusicIndex < 0 && musicTracks.length > 0) {
        await selectMusicTrack(0, true);
        return;
    }
    if (musicTracks[currentMusicIndex] && (!els.musicAudio.src || needsMusicUrlResolve(musicTracks[currentMusicIndex]))) {
        await selectMusicTrack(currentMusicIndex, false);
    }
    if (els.musicAudio.paused) {
        await playMusicAudioWithRecovery();
    } else {
        els.musicAudio.pause();
    }
}

async function playNextMusicTrack() {
    if (musicTracks.length === 0) return;
    await selectMusicTrack((currentMusicIndex + 1 + musicTracks.length) % musicTracks.length, true);
}

function seekMusicByEvent(e) {
    if (!els.musicAudio || !els.musicProgress) return;
    const duration = Number.isFinite(els.musicAudio.duration) && els.musicAudio.duration > 0 ? els.musicAudio.duration : 0;
    if (!duration) return;
    const rect = els.musicProgress.getBoundingClientRect();
    const ratio = Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
    els.musicAudio.currentTime = duration * ratio;
    updateMusicControls();
}

async function selectMusicTrack(index, shouldPlay = false) {
    if (!musicTracks[index] || !els.musicAudio) return;
    currentMusicIndex = index;
    const track = musicTracks[index];
    if (els.musicCurrentTitle) els.musicCurrentTitle.textContent = `${track.name} - ${track.artist}`;
    updateMusicCover(track);
    updateMusicLikeButton(track);
    renderMusicList(musicTracks);
    updateMusicControls();

    const playable = await ensureMusicTrackPlayable(index);
    if (index !== currentMusicIndex) return;
    const resolvedTrack = musicTracks[index];
    if (!playable || !resolvedTrack?.url) {
        renderMusicStatus('这首暂不可播放');
        updateMusicLikeButton(resolvedTrack);
        return;
    }
    if (els.musicAudio.src !== resolvedTrack.url) {
        els.musicAudio.src = resolvedTrack.url;
    }
    if (shouldPlay) {
        await playMusicAudioWithRecovery();
    }
}

async function loadMusicList(force = false) {
    if (!els.musicList || state.settings.showMusicWidget === false) return;

    let loginState = readMusicLoginState();
    if (!loginState.loggedIn && force) {
        try {
            loginState = await verifyMusicAccount();
        } catch (error) {
            clearMusicLoginState();
        }
    }
    const preferredSource = loginState.loggedIn ? 'account' : 'public';
    const cached = readMusicCache(preferredSource);
    const hasCache = cached && Array.isArray(cached.tracks) && cached.tracks.length > 0;
    if (hasCache && !shouldRefreshForCurrentSlot(cached, force)) {
        musicTracks = cached.tracks;
        renderMusicStatus(preferredSource === 'account' ? `账号推荐 · 缓存 ${musicTracks.length}首` : '网易云 · 缓存');
        currentMusicIndex = musicTracks.length > 0 ? 0 : -1;
        renderMusicList(musicTracks);
        if (currentMusicIndex >= 0) await selectMusicTrack(currentMusicIndex, false);
        else updateMusicControls();
        return;
    }

    renderMusicStatus(preferredSource === 'account' ? '账号推荐 · 加载中' : '网易云 · 加载中');
    try {
        let tracks = [];
        let source = 'public';
        if (loginState.loggedIn) {
            try {
                tracks = await fetchAccountMusicTracks();
                source = 'account';
            } catch (accountError) {
                console.warn('[Music] 账号每日推荐不可用，尝试公开推荐:', accountError);
                renderMusicStatus('账号推荐不可用 · 切公开');
            }
        }
        try {
            if (tracks.length === 0) {
                const response = await fetchWithTimeout(NETEASE_RECOMMEND_URL, {
                    headers: { Accept: 'application/json' }
                }, 3500);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                tracks = normalizeMusicTracks(await response.json());
                source = 'public';
            }
        } catch (primaryError) {
            console.warn('[Music] 网易云推荐新歌不可用，尝试公开热歌兜底:', primaryError);
            tracks = await fetchFallbackMusicTracks();
            source = 'public';
        }
        if (tracks.length === 0) throw new Error('没有可播放歌曲');
        musicTracks = tracks;
        currentMusicIndex = 0;
        saveMusicCache(tracks, source);
        renderMusicStatus(source === 'account' ? `账号推荐 · ${tracks.length}首` : '网易云 · 已更新');
        renderMusicList(tracks);
        await selectMusicTrack(0, false);
    } catch (error) {
        console.warn('[Music] 推荐歌曲加载失败:', error);
        if (cached?.tracks?.length) {
            musicTracks = cached.tracks;
            currentMusicIndex = 0;
            renderMusicStatus(preferredSource === 'account' ? `账号推荐 · 缓存 ${musicTracks.length}首` : '网易云 · 使用缓存');
            renderMusicList(musicTracks);
            await selectMusicTrack(0, false);
        } else {
            renderMusicStatus('网易云 · 暂不可用');
            renderMusicList([]);
        }
    }
}

function initWidgets() {
    initNotes();
    lastScheduledRefreshSlot = getScheduledRefreshSlot();

    ensureHotListSources();
    renderHotSourceTabs();
    renderHotSourceSettings();
    if (els.refreshHotListBtn) {
        els.refreshHotListBtn.onclick = () => loadHotList(true);
    }
    if (els.refreshMusicBtn) {
        els.refreshMusicBtn.onclick = () => loadMusicList(true);
    }
    updateMusicLoginButton();
    if (els.musicLoginBtn) {
        els.musicLoginBtn.onclick = handleMusicLoginButton;
    }
    if (els.closeMusicLoginModal) {
        els.closeMusicLoginModal.onclick = closeMusicLoginModal;
    }
    if (els.retryMusicLoginBtn) {
        els.retryMusicLoginBtn.onclick = startMusicLogin;
    }
    if (els.openMusicWebLoginBtn) {
        els.openMusicWebLoginBtn.onclick = openMusicWebLogin;
    }
    if (els.musicLoginModal) {
        els.musicLoginModal.onclick = (e) => {
            if (e.target === els.musicLoginModal) closeMusicLoginModal();
        };
    }
    if (els.musicPlayBtn) {
        els.musicPlayBtn.onclick = toggleMusicPlayback;
    }
    updateMusicLikeButton(null);
    if (els.musicLikeBtn) {
        els.musicLikeBtn.onclick = likeCurrentMusicTrack;
    }
    if (els.musicNextBtn) {
        els.musicNextBtn.onclick = playNextMusicTrack;
    }
    if (els.musicProgress) {
        els.musicProgress.onclick = seekMusicByEvent;
    }
    if (els.musicAudio) {
        els.musicAudio.onended = playNextMusicTrack;
        els.musicAudio.ontimeupdate = updateMusicControls;
        els.musicAudio.onplay = updateMusicControls;
        els.musicAudio.onpause = updateMusicControls;
        els.musicAudio.onloadedmetadata = updateMusicControls;
    }
    if (els.addHotSourceBtn) {
        els.addHotSourceBtn.onclick = addHotSourceFromSettings;
    }
    [els.hotSourceNameInput, els.hotSourceUrlInput, els.hotSourceHomeInput].forEach(input => {
        if (!input) return;
        input.onkeydown = (e) => {
            if (e.key === 'Enter') addHotSourceFromSettings();
        };
    });

    loadHotList(false);
    loadMusicList(false);
    setInterval(refreshWidgetsOnSchedule, SCHEDULED_REFRESH_CHECK_INTERVAL);
}

// Initialization
async function init() {
    document.body.classList.add('app-loading');
    // 先初始化图标缓存系统，做防崩溃加固保护
    try {
        await IconCache.init();
    } catch (e) {
        console.error('[Init] 图标缓存系统初始化失败，降级运行:', e);
    }

    // 初始化 WebDAV UI
    initWebDAV();

    // Init Persistence for Export Settings
    if (els.exportIncludeWallpaper) {
        // Initialize from State
        if (state.settings.exportIncludeWallpaper === undefined) {
            state.settings.exportIncludeWallpaper = true; // Default
        }
        els.exportIncludeWallpaper.checked = state.settings.exportIncludeWallpaper;

        // Save on Change
        els.exportIncludeWallpaper.onchange = () => {
            state.settings.exportIncludeWallpaper = els.exportIncludeWallpaper.checked;
            localStorage.setItem('settings', JSON.stringify(state.settings));
        };
    }

    setInterval(() => {
        updateClock();
        checkAutoNightMode();
    }, 1000);
    updateClock();
    checkAutoNightMode();
    applySettings();
    renderSearchEngine();
    renderShortcuts();
    initWidgets();
    loadWallpaper();
    setupEventListeners();
    setTimeout(() => {
        document.body.classList.remove('app-loading');
        document.body.classList.add('app-ready');
    }, 0);

    // Mouse Wheel Looping for Shortcuts
    els.shortcutsContainer.addEventListener('wheel', (e) => {
        if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return; // Only vertical wheel translates to horizontal scroll
        const container = els.shortcutsContainer;
        const scrollLeft = container.scrollLeft;
        const maxScroll = container.scrollWidth - container.clientWidth;

        if (e.deltaY > 0 && scrollLeft >= maxScroll - 5) {
            e.preventDefault();
            container.scrollTo({ left: 0, behavior: 'smooth' });
        } else if (e.deltaY < 0 && scrollLeft <= 5) {
            e.preventDefault();
            container.scrollTo({ left: maxScroll, behavior: 'smooth' });
        }
    }, { passive: false });
}

// Render Functions
function hideAllShortcutMenus() {
    document.querySelectorAll('.shortcut-actions.visible').forEach(el => el.classList.remove('visible'));
}

function renderSearchEngine() {
    const { engines, engine } = getActiveEngine();
    let currentFallback = document.getElementById('currentEngineFallback');
    if (!currentFallback && els.currentEngineIcon) {
        currentFallback = document.createElement('span');
        currentFallback.id = 'currentEngineFallback';
        currentFallback.className = 'engine-icon-fallback';
        currentFallback.setAttribute('aria-hidden', 'true');
        currentFallback.style.display = 'none';
        els.currentEngineIcon.insertAdjacentElement('afterend', currentFallback);
    }

    if (engine) {
        if (currentFallback) currentFallback.textContent = getFallbackInitial(engine.name, engine.url);
        els.currentEngineIcon.alt = engine.name;
        applyShortcutIcon(
            els.currentEngineIcon,
            currentFallback,
            engine.url,
            getEngineIconCandidateUrls(engine)
        );
    } else {
        els.currentEngineIcon.removeAttribute('src');
        els.currentEngineIcon.style.display = 'none';
        if (currentFallback) {
            currentFallback.textContent = '?';
            currentFallback.style.display = 'flex';
        }
    }

    // Render Category Tabs
    if (els.engineCategoryTabs) {
        const categoryKeys = getOrderedCategoryKeys();

        els.engineCategoryTabs.innerHTML = categoryKeys.map(key => {
            const cat = state.engineCategories[key];
            if (!cat) return '';
            const isActive = key === state.engineCategory;
            return `<span class="category-tab ${isActive ? 'active' : ''}" data-category="${key}">${cat.name}</span>`;
        }).join('');

        // Tab Click Event
        Array.from(els.engineCategoryTabs.children).forEach(tab => {
            tab.onclick = (e) => {
                e.stopPropagation();
                switchCategory(tab.dataset.category);
            };
        });

        // Mouse Wheel Event for Category Tabs
        els.engineCategoryTabs.onwheel = (e) => {
            const delta = Math.abs(e.deltaY) >= Math.abs(e.deltaX) ? e.deltaY : e.deltaX;
            if (delta === 0) return;
            e.preventDefault();
            e.stopPropagation();
            switchCategoryByWheel(delta);
        };
    }

    // Populate Dropdown
    els.engineDropdown.innerHTML = ''; // Clear

    Object.keys(engines).forEach(key => {
        const eng = engines[key];

        const div = document.createElement('div');
        div.className = `engine-option ${key === state.engine ? 'selected' : ''}`;
        div.dataset.key = key;
        // Event listeners
        div.onclick = () => setEngine(key);
        div.oncontextmenu = (e) => handleEngineRightClick(e, key);

        const img = document.createElement('img');
        img.alt = eng.name;

        const fallback = document.createElement('span');
        fallback.className = 'engine-icon-fallback';
        fallback.setAttribute('aria-hidden', 'true');
        fallback.textContent = getFallbackInitial(eng.name, eng.url);
        fallback.style.display = 'none';
        applyShortcutIcon(img, fallback, eng.url, getEngineIconCandidateUrls(eng));

        const span = document.createElement('span');
        span.textContent = eng.name;

        div.appendChild(img);
        div.appendChild(fallback);
        div.appendChild(span);
        els.engineDropdown.appendChild(div);
    });

    // Add "Add Engine" button
    const addDiv = document.createElement('div');
    addDiv.className = 'engine-option add-engine-option';
    addDiv.onclick = openAddEngineModal;
    addDiv.innerHTML = '<span class="add-icon">+</span><span>添加</span>';
    els.engineDropdown.appendChild(addDiv);

    renderSettingsEngineList();
}

function switchCategory(category) {
    if (!state.engineCategories[category] || category === state.engineCategory) return;

    state.engineCategory = category;
    localStorage.setItem('engineCategory', category);

    // 切到新分类时优先选中该分类的第一个搜索引擎；空分类保留为空状态。
    const engines = getCurrentEngines();
    state.engine = Object.keys(engines)[0] || '';
    localStorage.setItem('engine', state.engine);
    renderSearchEngine();
}

function switchCategoryByWheel(delta) {
    const categories = getOrderedCategoryKeys();
    if (categories.length <= 1) return;

    const now = Date.now();
    if (now - lastCategoryWheelAt < CATEGORY_WHEEL_DELAY) return;
    lastCategoryWheelAt = now;

    let currentIndex = categories.indexOf(state.engineCategory);
    if (currentIndex < 0) currentIndex = 0;

    const nextIndex = delta > 0
        ? (currentIndex + 1) % categories.length
        : (currentIndex - 1 + categories.length) % categories.length;
    switchCategory(categories[nextIndex]);
}

window.handleEngineRightClick = (e, key) => {
    e.preventDefault();
    openEditEngineModalForCategory(key, state.engineCategory);
    els.engineDropdown.classList.add('hidden');
};

window.openAddEngineModal = () => {
    editingEngineKey = null;
    editingEngineCategory = state.engineCategory;
    els.engineModalTitle.textContent = '添加搜索引擎';
    els.engineName.value = '';
    els.engineUrl.value = '';
    els.engineIcon.value = '';
    els.engineModal.classList.remove('hidden');
    els.engineDropdown.classList.add('hidden');
};

// Track which category is selected in settings panel
let settingsCategory = 'common';

function renderSettingsEngineList() {
    const categoryKeys = getOrderedCategoryKeys();
    if (!state.engineCategories[settingsCategory]) {
        settingsCategory = categoryKeys[0] || state.engineCategory;
    }
    const engines = state.engineCategories[settingsCategory]?.engines || {};
    // Populate Category Select
    if (els.engineCategorySelect) {
        els.engineCategorySelect.innerHTML = categoryKeys.map(key => {
            const cat = state.engineCategories[key];
            return cat ? `<option value="${key}">${cat.name}</option>` : '';
        }).join('');
        els.engineCategorySelect.value = settingsCategory;
    }

    els.settingsEngineList.innerHTML = ''; // Clear

    Object.keys(engines).forEach(key => {
        const engine = engines[key];

        const div = document.createElement('div');
        div.className = 'settings-engine-item draggable-item';
        div.draggable = true;
        div.dataset.key = key;

        // Drag handlers
        div.ondragstart = (e) => handleEngineDragStart(e, key);
        div.ondragover = handleDragOver;
        div.ondragenter = handleDragEnter;
        div.ondragleave = handleDragLeave;
        div.ondrop = (e) => handleEngineDrop(e, key);

        // Content
        const infoDiv = document.createElement('div');
        infoDiv.className = 'settings-engine-info';

        const img = document.createElement('img');
        img.alt = engine.name;

        const fallback = document.createElement('span');
        fallback.className = 'engine-icon-fallback';
        fallback.setAttribute('aria-hidden', 'true');
        fallback.textContent = getFallbackInitial(engine.name, engine.url);
        fallback.style.display = 'none';
        applyShortcutIcon(img, fallback, engine.url, getEngineIconCandidateUrls(engine));

        const span = document.createElement('span');
        span.textContent = engine.name;

        infoDiv.appendChild(img);
        infoDiv.appendChild(fallback);
        infoDiv.appendChild(span);

        // Actions
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'settings-engine-actions';

        const editBtn = document.createElement('button');
        editBtn.className = 'edit-engine-btn';
        editBtn.textContent = '✎';
        editBtn.onclick = () => openEditEngineModalForCategory(key, settingsCategory);

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-engine-btn';
        deleteBtn.textContent = '×';
        deleteBtn.onclick = () => deleteEngineFromCategory(key, settingsCategory);

        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(deleteBtn);

        div.appendChild(infoDiv);
        div.appendChild(actionsDiv);

        els.settingsEngineList.appendChild(div);
    });
}

function renderShortcuts() {
    els.shortcutsContainer.innerHTML = '';
    // Ensure container handles drag over for edge scrolling
    els.shortcutsContainer.ondragover = window.handleDragOver;

    const pageSize = state.settings.maxCols * state.settings.maxRows;

    // Migration: Ensure shortcuts array is at least enough for one page or matches existing length
    // But for "Free Positioning", we ideally want a sparse array or an array with nulls.
    // Let's migrate "compact" array to "positioned" array if needed.
    // Cleanup trailing empty pages but keep at least one page
    function trimShortcuts() {
        const pageSize = state.settings.maxCols * state.settings.maxRows;
        let newShortcuts = [];
        let pagesCount = 0;

        // Process in page blocks
        for (let i = 0; i < state.shortcuts.length; i += pageSize) {
            const page = state.shortcuts.slice(i, i + pageSize);
            const isEmpty = page.every(item => !item);
            if (!isEmpty) {
                newShortcuts.push(...page);
                pagesCount++;
            }
        }

        state.shortcuts = newShortcuts;
        localStorage.setItem('shortcuts', JSON.stringify(state.shortcuts));
    }

    // 自动补位：当 autoFill 开启时，移除所有 null 值让图标紧凑排列
    function compactShortcuts() {
        if (state.settings.autoFill !== false) {
            // 过滤掉所有 null 值
            state.shortcuts = state.shortcuts.filter(item => item !== null);
            localStorage.setItem('shortcuts', JSON.stringify(state.shortcuts));
        }
    }

    compactShortcuts();
    trimShortcuts();

    const totalPages = Math.ceil(state.shortcuts.length / pageSize) || 1;

    // Update CSS Variable for Rows
    document.documentElement.style.setProperty('--max-rows', state.settings.maxRows);

    for (let i = 0; i < totalPages; i++) {
        const pageEl = document.createElement('div');
        pageEl.className = 'shortcuts-page';
        pageEl.style.gridTemplateColumns = `repeat(${state.settings.maxCols}, 1fr)`;

        for (let j = 0; j < pageSize; j++) {
            const globalIndex = i * pageSize + j;
            if (globalIndex >= state.shortcuts.length) state.shortcuts.push(null);

            const shortcut = state.shortcuts[globalIndex];
            const slot = document.createElement('div');
            slot.className = 'shortcut-slot';
            slot.dataset.index = globalIndex;
            slot.ondragover = handleDragOver;
            slot.ondragenter = (e) => e.currentTarget.classList.add('drag-over');
            slot.ondragleave = (e) => e.currentTarget.classList.remove('drag-over');
            slot.ondrop = (e) => handleShortcutDrop(e, globalIndex);

            if (shortcut) {
                const item = document.createElement('div');
                item.className = 'shortcut-item draggable-item';
                item.draggable = true;
                item.dataset.index = globalIndex;
                item.ondragstart = (e) => handleShortcutDragStart(e, globalIndex);

                if (shortcut.type === 'folder') {
                    // Folder Rendering
                    item.classList.add('folder-item');
                    const style = normalizeFolderStyle(shortcut.style, {
                        bgColor: shortcut.bgColor,
                        opacity: shortcut.opacity,
                        radius: shortcut.radius
                    });
                    const bgColor = style.bgColor;
                    const opacity = style.opacity / 100;
                    const radius = style.radius + 'px';

                    // Icon Container
                    const iconDiv = document.createElement('div');
                    iconDiv.className = 'shortcut-icon glass';
                    iconDiv.classList.add('folder-shortcut-icon');
                    iconDiv.style.cssText = `background: ${colorToRgba(bgColor, Math.max(0.18, opacity + 0.22))}; opacity: 1; border-radius: ${radius};`;

                    const bgDiv = document.createElement('div');
                    bgDiv.style.cssText = `position:absolute; top:0; left:0; width:100%; height:100%; background:${colorToRgba(bgColor, opacity)}; border-radius:inherit; z-index:-1`;
                    iconDiv.appendChild(bgDiv);

                    // Previews
                    shortcut.items.slice(0, 4).forEach(sub => {
                        iconDiv.appendChild(createFolderPreviewNode(sub));
                    });

                    const titleDiv = document.createElement('div');
                    titleDiv.className = 'shortcut-title';
                    titleDiv.textContent = shortcut.name;

                    item.appendChild(iconDiv);
                    item.appendChild(titleDiv);

                    item.onclick = (e) => {
                        if (isBatchMode) return;
                        openFolderModal(globalIndex);
                    };
                    item.oncontextmenu = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        openFolderContextMenu(e, null, globalIndex);
                    };
                } else {
                    // Regular Icon Rendering
                    const target = state.settings.shortcutInNewTab ? '_blank' : '_self';

                    const link = document.createElement('a');
                    link.className = 'shortcut-icon';
                    link.target = target;
                    link.draggable = !isBatchMode;
                    if (isBatchMode) {
                        link.href = 'javascript:void(0)';
                    } else {
                        link.href = shortcut.url;
                        link.oncontextmenu = (e) => { e.preventDefault(); return false; }; // Allow bubbling to item.oncontextmenu
                    }

                    const img = document.createElement('img');

                    const fallbackDiv = document.createElement('div');
                    fallbackDiv.className = 'shortcut-fallback';
                    fallbackDiv.style.display = 'none';
                    fallbackDiv.textContent = getFallbackInitial(shortcut.name, shortcut.url);
                    applyShortcutIcon(img, fallbackDiv, shortcut.url);

                    link.appendChild(img);
                    link.appendChild(fallbackDiv);

                    const titleDiv = document.createElement('div');
                    titleDiv.className = 'shortcut-title';
                    titleDiv.textContent = shortcut.name;

                    item.appendChild(link);
                    item.appendChild(titleDiv);


                    if (!isBatchMode) {
                        item.oncontextmenu = (e) => {
                            e.preventDefault(); e.stopPropagation();
                            openEditModal(globalIndex, -1, null);
                        };
                    }
                }

                if (isBatchMode) {
                    if (selectedIndices.has(globalIndex)) {
                        slot.classList.add('selected');
                        item.classList.add('selected');
                        const selectionIndex = Array.from(selectedIndices).indexOf(globalIndex) + 1;
                        item.setAttribute('data-selection-index', selectionIndex);
                    }
                    slot.onclick = (e) => {
                        e.preventDefault(); e.stopPropagation();
                        if (selectedIndices.has(globalIndex)) selectedIndices.delete(globalIndex);
                        else selectedIndices.add(globalIndex);
                        renderShortcuts();
                        document.getElementById('selectedCount').textContent = selectedIndices.size;
                    };
                }
                slot.appendChild(item);
            }
            pageEl.appendChild(slot);
        }
        els.shortcutsContainer.appendChild(pageEl);
    }
}

function applySettings() {
    const root = document.documentElement;
    root.style.setProperty('--grid-cols', state.settings.maxCols);
    root.style.setProperty('--icon-radius', state.settings.borderRadius + '%');
    root.style.setProperty('--grid-gap', state.settings.iconGap + 'px');
    root.style.setProperty('--icon-size', state.settings.iconSize + 'px');
    root.style.setProperty('--clock-vertical-offset', (state.settings.clockVerticalOffset ?? -20) + 'px');
    root.style.setProperty('--search-vertical-offset', (state.settings.searchVerticalOffset ?? -20) + 'px');
    root.style.setProperty('--shortcuts-vertical-offset', (state.settings.shortcutsVerticalOffset ?? 0) + 'px');

    // Global Brightness
    if (state.settings.globalBrightness === undefined) state.settings.globalBrightness = 100;
    root.style.filter = `brightness(${state.settings.globalBrightness}%)`;
    if (els.globalBrightness) {
        els.globalBrightness.value = state.settings.globalBrightness;
        els.globalBrightnessVal.textContent = state.settings.globalBrightness + '%';
    }

    // Update Input Values
    els.maxRows.value = state.settings.maxRows;
    els.maxRowsVal.textContent = state.settings.maxRows;

    els.maxCols.value = state.settings.maxCols;
    els.maxColsVal.textContent = state.settings.maxCols;

    els.borderRadius.value = state.settings.borderRadius;
    els.borderRadiusVal.textContent = state.settings.borderRadius + '%';

    els.iconGap.value = state.settings.iconGap;
    els.iconGapVal.textContent = state.settings.iconGap + 'px';

    els.iconSize.value = state.settings.iconSize;
    els.iconSizeVal.textContent = state.settings.iconSize + 'px';

    if (els.clockVerticalOffset) {
        els.clockVerticalOffset.value = state.settings.clockVerticalOffset ?? -20;
        els.clockVerticalOffsetVal.textContent = (state.settings.clockVerticalOffset ?? -20) + 'px';
    }
    if (els.searchVerticalOffset) {
        els.searchVerticalOffset.value = state.settings.searchVerticalOffset ?? -20;
        els.searchVerticalOffsetVal.textContent = (state.settings.searchVerticalOffset ?? -20) + 'px';
    }
    if (els.shortcutsVerticalOffset) {
        els.shortcutsVerticalOffset.value = state.settings.shortcutsVerticalOffset ?? 0;
        els.shortcutsVerticalOffsetVal.textContent = (state.settings.shortcutsVerticalOffset ?? 0) + 'px';
    }

    // Search Box Settings
    root.style.setProperty('--search-width', state.settings.searchWidth + 'px');
    root.style.setProperty('--search-height', state.settings.searchHeight + 'px');
    root.style.setProperty('--search-radius', state.settings.searchRadius + 'px');
    root.style.setProperty('--search-opacity', state.settings.searchOpacity / 100);
    root.style.setProperty('--search-blur', (state.settings.searchBlur || 0) + 'px');

    if (els.searchWidth) {
        els.searchWidth.value = state.settings.searchWidth;
        els.searchWidthVal.textContent = state.settings.searchWidth + 'px';
    }
    if (els.searchHeight) {
        els.searchHeight.value = state.settings.searchHeight;
        els.searchHeightVal.textContent = state.settings.searchHeight + 'px';
    }
    if (els.searchRadius) {
        els.searchRadius.value = state.settings.searchRadius;
        els.searchRadiusVal.textContent = state.settings.searchRadius + 'px';
    }
    if (els.searchOpacity) {
        els.searchOpacity.value = state.settings.searchOpacity;
        els.searchOpacityVal.textContent = state.settings.searchOpacity + '%';
    }
    if (els.searchBlur) {
        els.searchBlur.value = state.settings.searchBlur !== undefined ? state.settings.searchBlur : 10;
        els.searchBlurVal.textContent = (state.settings.searchBlur !== undefined ? state.settings.searchBlur : 10) + 'px';
    }

    // Click Settings
    const clockWidget = document.getElementById('clockWidget');
    if (clockWidget) {
        clockWidget.style.display = state.settings.showClock !== false ? 'block' : 'none';
    }
    if (els.showClock) els.showClock.checked = state.settings.showClock !== false;
    if (els.clockWidget) {
        els.clockWidget.style.fontSize = (state.settings.clockSize || 6) + 'em';
        els.clockWidget.style.color = state.settings.clockColor || '#ffffff';
        // Update CSS variable for border color
        root.style.setProperty('--clock-border-color', state.settings.clockBorderColor || '#000000');
    }
    if (els.clockSize) {
        els.clockSize.value = state.settings.clockSize || 6;
        els.clockSizeVal.textContent = (state.settings.clockSize || 6) + 'em';
    }

    // Sync Inputs
    if (els.clockColor) {
        els.clockColor.value = state.settings.clockColor || '#ffffff';
    }
    if (els.clockBorderColor) {
        els.clockBorderColor.value = state.settings.clockBorderColor || '#000000';
    }

    // Dark Mode
    if (els.darkMode) {
        els.darkMode.checked = state.settings.darkMode;
    }
    document.body.classList.toggle('dark-mode', state.settings.darkMode);

    // Auto Night Mode
    if (els.autoNightMode) {
        els.autoNightMode.checked = state.settings.autoNightMode;
    }

    // Show Shortcuts
    if (els.showShortcuts) {
        els.showShortcuts.checked = state.settings.showShortcuts;
    }
    if (els.shortcutsContainer) {
        els.shortcutsContainer.style.display = state.settings.showShortcuts ? 'flex' : 'none';
    }

    // Widgets
    if (enforceWidgetLimit()) saveSettings();
    const showNoteWidget = state.settings.showNoteWidget !== false;
    const showHotWidget = state.settings.showHotWidget !== false;
    const showMusicWidget = state.settings.showMusicWidget === true;
    const visibleWidgetCount = [showHotWidget, showNoteWidget, showMusicWidget].filter(Boolean).length;
    const hasVisibleWidgets = visibleWidgetCount > 0;
    if (els.noteWidget) {
        els.noteWidget.classList.toggle('hidden', !showNoteWidget);
    }
    if (els.hotWidget) els.hotWidget.classList.toggle('hidden', !showHotWidget);
    if (els.musicWidget) els.musicWidget.classList.toggle('hidden', !showMusicWidget);
    if (els.widgetsArea) {
        els.widgetsArea.classList.toggle('hidden', !hasVisibleWidgets);
        els.widgetsArea.classList.toggle('widgets-count-1', visibleWidgetCount === 1);
        els.widgetsArea.classList.toggle('widgets-count-2', visibleWidgetCount === 2);
        els.widgetsArea.classList.toggle('widgets-count-3', visibleWidgetCount === 3);
    }
    document.body.classList.toggle('widgets-collapsed', !hasVisibleWidgets);
    if (els.showNoteWidget) els.showNoteWidget.checked = showNoteWidget;
    if (els.showHotWidget) els.showHotWidget.checked = showHotWidget;
    if (els.showMusicWidget) els.showMusicWidget.checked = showMusicWidget;
    const hotListSource = getCurrentHotSourceKey();
    if (hotListSource !== state.settings.hotListSource) {
        state.settings.hotListSource = hotListSource;
        saveSettings();
    }
    renderHotSourceTabs();
    renderHotSourceSettings();

    // New Link Target Settings
    if (els.searchInNewTab) {
        els.searchInNewTab.checked = state.settings.searchInNewTab;
    }
    if (els.shortcutInNewTab) {
        els.shortcutInNewTab.checked = state.settings.shortcutInNewTab;
    }

    if (els.autoFill) {
        els.autoFill.checked = state.settings.autoFill === true;
    }
}

// Edit engine from settings panel (with specific category)
let editingEngineCategory = null;

window.openEditEngineModalForCategory = (key, category) => {
    editingEngineKey = key;
    editingEngineCategory = category;
    const engine = state.engineCategories[category]?.engines[key];
    if (!engine) return;
    els.engineModalTitle.textContent = '编辑搜索引擎';
    els.engineName.value = engine.name;
    els.engineUrl.value = engine.url;
    els.engineIcon.value = engine.icon;
    els.engineModal.classList.remove('hidden');
};

window.deleteEngineFromCategory = (key, category) => {
    const engines = state.engineCategories[category]?.engines;
    if (!engines || !engines[key]) return false;

    const engineKeys = Object.keys(engines);
    const engineIcon = engines[key]?.icon; // 保存图标 URL 用于清除缓存

    // Case 1: More than 1 engine in category -> Normal delete
    if (engineKeys.length > 1) {
        if (confirm('确定删除此搜索引擎吗？')) {
            delete engines[key];
            localStorage.setItem('engineCategories', JSON.stringify(state.engineCategories));

            // 清除对应图标缓存
            if (engineIcon) {
                IconCache.delete(engineIcon).then(() => {
                    console.log('[IconCache] 已删除搜索引擎图标缓存:', engineIcon);
                });
            }

            renderSettingsEngineList();

            if (state.engineCategory === category && state.engine === key) {
                const remaining = getCurrentEngines();
                state.engine = Object.keys(remaining)[0];
                localStorage.setItem('engine', state.engine);
                renderSearchEngine();
            }
            return true;
        }
        return false;
    }

    // Case 2: Only 1 engine in category
    const categoryKeys = Object.keys(state.engineCategories);

    // Case 2a: This is the LAST category globally -> Prevent delete
    if (categoryKeys.length <= 1) {
        alert('这是最后一个分类中的最后一个搜索引擎，无法删除！请至少保留一个搜索引擎。');
        return false;
    }

    // Case 2b: Other categories exist -> Confirm delete category
    if (confirm('该分类下只剩一个搜索引擎，删除将同时删除该分类，是否继续？')) {
        deleteCategory(category);
        return true;
    }

    return false;
};

// Category Management
window.openCategoryManager = () => {
    els.categoryModal.classList.remove('hidden');
    renderCategoryList();
};

function renderCategoryList() {
    const list = document.getElementById('categoryList');
    if (!list) return;

    list.innerHTML = '';

    getOrderedCategoryKeys().forEach(key => {
        const cat = state.engineCategories[key];
        if (!cat) return;

        const div = document.createElement('div');
        div.className = 'category-list-item draggable-item';
        div.draggable = true;
        div.dataset.key = key;

        // Drag events
        div.ondragstart = (e) => handleCategoryDragStart(e, key);
        div.ondragover = handleDragOver;
        div.ondragenter = handleDragEnter;
        div.ondragleave = handleDragLeave;
        div.ondrop = (e) => handleCategoryDrop(e, key);

        // Content
        const info = document.createElement('div');
        info.className = 'category-info';

        const nameSpan = document.createElement('span');
        nameSpan.className = 'category-name';
        nameSpan.textContent = cat.name;

        const idSpan = document.createElement('span');
        idSpan.className = 'category-id';
        idSpan.textContent = key;

        info.appendChild(nameSpan);
        info.appendChild(idSpan);

        const actions = document.createElement('div');
        actions.className = 'category-actions';

        const editBtn = document.createElement('button');
        editBtn.className = 'btn-secondary';
        editBtn.textContent = '编辑';
        editBtn.style.cssText = 'padding: 4px 8px; font-size: 12px; margin-right: 5px;';
        editBtn.onclick = () => editCategory(key); // Assuming editCategory is global or needs to be found

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn-danger';
        deleteBtn.textContent = '删除';
        deleteBtn.style.cssText = 'padding: 4px 8px; font-size: 12px;';
        deleteBtn.onclick = () => deleteCategory(key);

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);

        div.appendChild(info);
        div.appendChild(actions);

        list.appendChild(div);
    });
}
// Add explicit global handlers if they were relied upon being on window
// But here we assign directly to onclick, so it uses the scope chain. 
// We need to ensure editCategory and deleteCategory are available.
// deleteCategory is defined at 1480 (but inside deleteEngineFromCategory context? No.)
// Let's check where `editCategory` is defined.

window.editCategory = (key) => {
    console.log('Editing category:', key);
    const cat = state.engineCategories[key];
    if (!cat) return alert('分类不存在');

    const newName = prompt('请输入新的分类名称:', cat.name);
    if (newName !== null) {
        const trimmedName = newName.trim();
        if (trimmedName !== '') {
            cat.name = trimmedName;
            localStorage.setItem('engineCategories', JSON.stringify(state.engineCategories));
            console.log('Category updated:', cat);
            renderCategoryList();
            renderSettingsEngineList();
            renderSearchEngine();
        } else {
            alert('分类名称不能为空');
        }
    }
};

window.addCategory = () => {
    const nameInput = document.getElementById('newCategoryName');
    const idInput = document.getElementById('newCategoryId');
    const name = nameInput.value.trim();
    let id = idInput.value.trim();

    if (!name || !id) return alert('请填写分类名称和ID');
    if (!/^[a-zA-Z0-9_]+$/.test(id)) return alert('ID只能包含字母、数字和下划线');
    if (state.engineCategories[id]) return alert('该ID已存在');

    state.engineCategories[id] = {
        name: name,
        engines: {}
    };
    state.categoryOrder.push(id);
    localStorage.setItem('engineCategories', JSON.stringify(state.engineCategories));
    localStorage.setItem('categoryOrder', JSON.stringify(state.categoryOrder));

    nameInput.value = '';
    idInput.value = '';
    // Force re-render to reflect new order
    renderCategoryList();
    renderSettingsEngineList();
    renderSearchEngine();
};

window.deleteCategory = (key) => {
    if (confirm(`确定删除分类 "${state.engineCategories[key].name}" 及其所有搜索引擎吗？`)) {
        delete state.engineCategories[key];
        state.categoryOrder = state.categoryOrder.filter(id => id !== key);
        localStorage.setItem('engineCategories', JSON.stringify(state.engineCategories));
        localStorage.setItem('categoryOrder', JSON.stringify(state.categoryOrder));

        // If deleted current category, switch to first available
        if (state.engineCategory === key) {
            if (state.categoryOrder.length > 0) {
                state.engineCategory = state.categoryOrder[0];
                localStorage.setItem('engineCategory', state.engineCategory);
                // Switch to first engine in new category
                const engines = getCurrentEngines();
                state.engine = Object.keys(engines)[0] || 'google';
                localStorage.setItem('engine', state.engine);
            } else {
                alert('已删除所有分类，将重置为默认状态');
                localStorage.removeItem('engineCategories');
                location.reload();
                return;
            }
        }

        // If deleted settings category, switch to common
        if (settingsCategory === key) {
            settingsCategory = 'common';
        }

        renderCategoryList();
        renderSettingsEngineList();
        renderSearchEngine();
    }
};

async function importCachedIcons(icons) {
    if (!icons || typeof icons !== 'object') return;
    const entries = Object.entries(icons);
    for (const [url, data] of entries) {
        await IconCache.saveToDB(url, data);
    }
}

async function loadWallpaper() {
    const wallpaperUrl = state.wallpaper || DEFAULT_WALLPAPER;
    
    if (wallpaperUrl.startsWith('data:')) {
        els.wallpaper.style.backgroundImage = `url('${wallpaperUrl}')`;
        return;
    }
    
    // 安全检查，防崩溃
    if (typeof caches !== 'undefined') {
        try {
            const cache = await caches.open('newtab-wallpaper');
            const cachedResponse = await cache.match(wallpaperUrl);
            if (cachedResponse) {
                const blob = await cachedResponse.blob();
                const localUrl = URL.createObjectURL(blob);
                els.wallpaper.style.backgroundImage = `url('${localUrl}')`;
                console.log('[Wallpaper] 成功加载缓存壁纸');
                return;
            }
        } catch (e) {
            console.warn('[Wallpaper] 读取缓存壁纸失败:', e);
        }
    }
    
    els.wallpaper.style.backgroundImage = `url('${wallpaperUrl}')`;
    
    if (navigator.onLine) {
        fetchAndCacheWallpaper(wallpaperUrl);
    }
}

async function fetchAndCacheWallpaper(url) {
    if (typeof caches === 'undefined') return;
    try {
        const response = await fetch(url);
        if (response.ok) {
            const cache = await caches.open('newtab-wallpaper');
            await cache.put(url, response.clone());
            console.log('[Wallpaper] 成功缓存在线壁纸');
        }
    } catch (e) {
        console.warn('[Wallpaper] 缓存壁纸失败:', e);
    }
}

// WebDAV Functions
// Actions
window.setEngine = (engineKey) => {
    if (!engineKey || !getCurrentEngines()[engineKey]) {
        renderSearchEngine();
        els.engineDropdown.classList.add('hidden');
        return;
    }
    state.engine = engineKey;
    localStorage.setItem('engine', engineKey);
    renderSearchEngine();
    els.engineDropdown.classList.add('hidden');
};

window.deleteEngine = (key) => {
    if (confirm('确定删除此搜索引擎吗？')) {
        const engines = getCurrentEngines();
        delete engines[key];
        localStorage.setItem('engineCategories', JSON.stringify(state.engineCategories));

        // If deleted current engine, switch to first available
        if (state.engine === key) {
            const remainingEngines = getCurrentEngines();
            const nextKey = Object.keys(remainingEngines)[0] || '';
            if (nextKey) {
                setEngine(nextKey);
            } else {
                state.engine = '';
                localStorage.setItem('engine', state.engine);
                renderSearchEngine();
            }
        } else {
            renderSearchEngine();
        }
    }
};




// ... existing exportConfig ...


window.exportConfig = async () => {
    const config = {
        shortcuts: state.shortcuts,
        engineCategories: state.engineCategories,
        engineCategory: state.engineCategory,
        engine: state.engine,
        settings: state.settings,
        wallpaper: els.exportIncludeWallpaper && els.exportIncludeWallpaper.checked ? state.wallpaper : null,
        categoryOrder: state.categoryOrder,
        cachedIcons: await IconCache.getAll(),
        widgets: getWidgetsExportData()
    };
    const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newtab-config-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
};

window.importConfig = () => {
    if (els.importFileInput) els.importFileInput.click();
};

window.openEditModal = (index, subIndex = -1, targetParent = null) => {
    const activeEvent = window.event;
    if (activeEvent && activeEvent.preventDefault) {
        activeEvent.preventDefault();
        activeEvent.stopPropagation();
    }

    editingIndex = index;
    editingSubIndex = subIndex;
    editingTargetParent = targetParent;
    els.editModal.classList.remove('hidden');

    const deleteBtn = document.getElementById('deleteShortcutBtn');
    const rootFolder = (index >= 0 && state.shortcuts[index]?.type === 'folder') ? state.shortcuts[index] : null;
    const parentFolder = targetParent || rootFolder;
    const item = parentFolder && subIndex >= 0 ? parentFolder.items[subIndex] : state.shortcuts[index];

    if (item) {
        els.modalTitle.textContent = (parentFolder && subIndex >= 0 ? '编辑文件夹内图标' : '编辑快捷网站');
        els.shortcutName.value = item.name;
        els.shortcutUrl.value = item.url;
        if (deleteBtn) deleteBtn.classList.remove('hidden');
    } else {
        els.modalTitle.textContent = '添加快捷网站';
        els.shortcutName.value = '';
        els.shortcutUrl.value = '';
        if (deleteBtn) deleteBtn.classList.add('hidden');
    }
};

// ... existing saveShortcuts ...

// ... existing drag handlers ...

function saveShortcuts() {
    localStorage.setItem('shortcuts', JSON.stringify(state.shortcuts));
}

// Drag and Drop Handlers
let dragSourceIndex = -1;

window.handleShortcutDragStart = (e, index) => {
    dragSourceIndex = index;
    dragSourceType = 'shortcut';
    e.dataTransfer.effectAllowed = 'move';
    // Slight delay to allow visual to be created
    setTimeout(() => e.target.classList.add('dragging'), 0);

    // Disable scroll snap on container
    document.getElementById('shortcutsContainer').classList.add('dragging');
};

window.handleShortcutDrop = (e, targetIndex) => {
    e.preventDefault(); e.stopPropagation();
    const slot = e.currentTarget; slot.classList.remove('drag-over');

    if (dragSourceType !== 'shortcut') return;

    const rect = slot.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const isInsideMergeZone = (x > rect.width * 0.25 && x < rect.width * 0.75 && y > rect.height * 0.1 && y < rect.height * 0.6);

    const targetItem = state.shortcuts[targetIndex];
    let itemToMove;
    let sourceParent = (dragSourceFolderIndex === -1) ? null : editingTargetParent;

    // 1. 获取移动对象
    if (dragSourceFolderIndex === -1) {
        if (dragSourceIndex === targetIndex) return resetDragState();
        itemToMove = state.shortcuts[dragSourceIndex];
        // 关键：先把源位置设为空，创造一个空位
        state.shortcuts[dragSourceIndex] = null;
    } else {
        if (!sourceParent) return resetDragState();
        itemToMove = sourceParent.items[dragSourceSubIndex];
        sourceParent.items.splice(dragSourceSubIndex, 1);
    }

    if (!itemToMove) return resetDragState();

    // 2. 处理目标位置
    if (targetItem && isInsideMergeZone) {
        // --- 合并文件夹 ---
        if (targetItem.type === 'folder') {
            targetItem.items.push(itemToMove);
        } else {
            state.shortcuts[targetIndex] = ensureFolderVisualStyle({
                type: 'folder',
                name: '新建文件夹',
                items: [targetItem, itemToMove],
                style: createDefaultFolderStyle()
            });
        }
    } else {
        // --- 插入/挤位逻辑 ---
        if (!targetItem) {
            // 目标为空，直接放入
            state.shortcuts[targetIndex] = itemToMove;
        } else {
            // 目标有图标，需要“挤”一下
            // 策略：在当前页寻找最近的一个空位(null)，将其移除，从而腾出空间
            const pageSize = state.settings.maxCols * state.settings.maxRows;
            const pageStart = Math.floor(targetIndex / pageSize) * pageSize;
            const pageEnd = pageStart + pageSize;

            let emptyIndex = -1;

            // 优先向后找空位 (Target -> End)
            for (let i = targetIndex + 1; i < pageEnd; i++) {
                if (state.shortcuts[i] === null) {
                    emptyIndex = i;
                    break;
                }
            }
            // 如果后面没空位，向前找 (Target -> Start)
            if (emptyIndex === -1) {
                for (let i = targetIndex - 1; i >= pageStart; i--) {
                    if (state.shortcuts[i] === null) {
                        emptyIndex = i;
                        break;
                    }
                }
            }

            if (emptyIndex !== -1) {
                // 找到了本页空位，执行“挤位”
                // 1. 删除空位
                state.shortcuts.splice(emptyIndex, 1);
                // 2. 在目标位置插入新图标 (splice 会自动移动中间的元素)
                // 注意：如果空位在目标前面，删除空位会导致目标索引前移，但我们需要插在"视觉上的目标位置"
                // 经过推算，直接使用 targetIndex 进行插入，视觉效果符合预期（替换当前位置，原元素后移）
                // 只有当空位在目标左侧且我们需要模拟"交换"时才需微调，但在网格拖拽中，直接插入是标准行为。
                // 修正：如果删除了前面的元素，targetIndex 对应的元素已经变成了原本 targetIndex+1 的元素
                // 但我们想要占据的是“原来的 targetIndex 位置”，在删除后的数组中，这个位置就是 targetIndex - 1 (如果 empty < target)
                // 经测试：直接使用 targetIndex 插入最符合直觉（把别人挤走）。

                // 修正逻辑：如果删除了前面的空位，所有后续索引减1。
                // 此时原来的 targetIndex 指向的是原 targetIndex+1 的元素。
                // 我们想插在原 targetIndex 元素的前面（挤走它）。
                // 原 targetIndex 元素现在位于 targetIndex - 1。
                // 所以应该插在 targetIndex - 1。
                let insertPos = targetIndex;
                if (emptyIndex < targetIndex) {
                    insertPos = targetIndex - 1;
                }
                state.shortcuts.splice(insertPos, 0, itemToMove);
            } else {
                // 本页已满，无奈只能插入（会导致溢出到下一页）
                // 或者我们可以强制交换？用户说“图标换位”，如果满页，交换是最好的维持布局的手段。
                // 但为了逻辑统一，这里保持插入行为，只有在满页时才会挤到下一页。
                state.shortcuts.splice(targetIndex, 0, itemToMove);
            }
        }
    }

    // 3. 清理空源文件夹
    if (sourceParent && sourceParent.items.length === 0) {
        if (dragSourceFolderIndex !== -1) {
            const rootFolder = state.shortcuts[dragSourceFolderIndex];
            if (sourceParent === rootFolder) {
                state.shortcuts[dragSourceFolderIndex] = null;
            }
        }
    }

    saveShortcuts();
    renderShortcuts();
    resetDragState();
    document.querySelectorAll('.folder-modal-overlay').forEach(el => el.remove());
    resetFolderModalState();
};
const getNextAlphaName = (parent) => {
    const count = (parent.items || []).filter(i => i && i.type === 'folder').length;
    const alpha = String.fromCharCode(65 + (count % 26)); // A, B, C...
    return alpha;
};

window.handleFolderItemDrop = (e, targetParent, targetSubIndex) => {
    e.preventDefault(); e.stopPropagation();
    const slot = e.currentTarget; slot.classList.remove('drag-over');

    if (dragSourceType !== 'shortcut' || !targetParent) return;

    const rect = slot.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const isInsideMergeZone = (x > rect.width * 0.25 && x < rect.width * 0.75 && y > rect.height * 0.1 && y < rect.height * 0.6);

    const targetItem = targetParent.items[targetSubIndex];
    let itemToMove;
    let sourceParent = (dragSourceFolderIndex === -1) ? null : editingTargetParent;

    // 1. Validation & Reference
    if (dragSourceFolderIndex === -1) {
        itemToMove = state.shortcuts[dragSourceIndex];
    } else {
        if (!sourceParent) return resetDragState();
        itemToMove = sourceParent.items[dragSourceSubIndex];
    }

    if (!itemToMove || itemToMove === targetParent) return resetDragState(); // Block move into self container
    if (targetItem === itemToMove) return resetDragState(); // Block move into self icon

    // 2. Execute
    if (dragSourceFolderIndex === -1) {
        state.shortcuts[dragSourceIndex] = null;
    } else {
        sourceParent.items.splice(dragSourceSubIndex, 1);
    }

    if (targetItem && isInsideMergeZone && targetItem.type !== 'folder') {
        const currentDepth = (targetParent === currentViewingFolder) ? 1 : 2;
        if (currentDepth < 2) {
            targetParent.items[targetSubIndex] = ensureFolderVisualStyle({
                type: 'folder',
                name: getNextAlphaName(targetParent),
                items: [targetItem, itemToMove],
                style: createDefaultFolderStyle()
            });
        } else {
            targetParent.items.splice(targetSubIndex, 0, itemToMove);
        }
    } else if (targetItem && isInsideMergeZone && targetItem.type === 'folder') {
        targetItem.items.push(itemToMove);
    } else {
        targetParent.items.splice(targetSubIndex, 0, itemToMove);
    }

    // 3. Cleanup
    let childToKeep = (targetParent === currentViewingFolder) ? currentChildFolder : targetParent;

    if (sourceParent && sourceParent.items.length === 0) {
        const rootFolder = state.shortcuts[dragSourceFolderIndex];
        if (sourceParent === rootFolder) {
            state.shortcuts[dragSourceFolderIndex] = null;
        } else if (rootFolder && rootFolder.items) {
            const idx = rootFolder.items.indexOf(sourceParent);
            if (idx !== -1) rootFolder.items.splice(idx, 1);
        }
        // If the folder we were viewing in child window is now gone, close it
        if (sourceParent === childToKeep) childToKeep = null;
    }

    saveShortcuts(); renderShortcuts(); resetDragState();
    openFolderModal(currentRootIndex, currentViewingFolder, childToKeep);
};

window.dissolveFolder = () => {
    if (!editingTargetItem) return;
    const targetParent = editingTargetParent;
    const items = editingTargetItem.items || [];
    const dissolvedItems = [...items]; // 复制一份要解散出来的图标

    if (targetParent === null) {
        // --- 顶层根文件夹解散逻辑 ---
        const index = editingTargetSubIndex; // 使用正确的右键点击索引
        state.shortcuts[index] = null; // 彻底从原位置删除文件夹

        const pageSize = state.settings.maxCols * state.settings.maxRows;
        const currentPageStart = Math.floor(index / pageSize) * pageSize;
        const currentPageEnd = currentPageStart + pageSize;

        // 1. 优先补位到当前页的空位
        for (let i = currentPageStart; i < currentPageEnd && dissolvedItems.length > 0; i++) {
            if (state.shortcuts[i] === null) {
                state.shortcuts[i] = dissolvedItems.shift();
            }
        }

        // 2. 如果还有剩余，搜索全局其他页面的空位
        for (let i = 0; i < state.shortcuts.length && dissolvedItems.length > 0; i++) {
            if (state.shortcuts[i] === null) {
                state.shortcuts[i] = dissolvedItems.shift();
            }
        }

        // 3. 如果依然有剩余，追加到列表最后
        while (dissolvedItems.length > 0) {
            state.shortcuts.push(dissolvedItems.shift());
        }

        // 解散后关闭所有打开的文件夹弹窗
        document.querySelectorAll('.folder-modal-overlay').forEach(el => el.remove());
        resetFolderModalState();
    } else {
        // --- 子文件夹解散逻辑 (文件夹套文件夹) ---
        const idx = targetParent.items.indexOf(editingTargetItem);
        if (idx !== -1) {
            // 在原位置插入子项
            targetParent.items.splice(idx, 1, ...dissolvedItems);
        }
        // 刷新当前显示的文件夹视图
        openFolderModal(currentRootIndex, currentViewingFolder, currentChildFolder);
    }

    resetDragState();
    saveShortcuts();   // 保存到本地存储
    renderShortcuts(); // 重新渲染界面
};


function resetFolderModalState() {
    currentRootIndex = -1;
    currentViewingFolder = null;
    currentChildFolder = null;
}

window.openFolderContextMenu = (e, targetParent, subIndex = -1) => {
    editingTargetParent = targetParent;
    editingTargetSubIndex = subIndex;
    if (targetParent === null) {
        editingTargetItem = state.shortcuts[subIndex];
    } else {
        editingTargetItem = (subIndex === -1) ? targetParent : targetParent.items[subIndex];
    }

    const menu = els.folderContextMenu;
    menu.style.display = 'flex';
    menu.style.left = '-9999px';
    menu.style.top = '-9999px';

    requestAnimationFrame(() => {
        const viewportPadding = 12;
        const { innerWidth, innerHeight } = window;
        const rect = menu.getBoundingClientRect();
        const left = Math.min(
            Math.max(viewportPadding, e.clientX),
            Math.max(viewportPadding, innerWidth - rect.width - viewportPadding)
        );
        const top = Math.min(
            Math.max(viewportPadding, e.clientY),
            Math.max(viewportPadding, innerHeight - rect.height - viewportPadding)
        );
        menu.style.left = `${left}px`;
        menu.style.top = `${top}px`;
    });

    const closeMenu = () => {
        menu.style.display = 'none';
        document.removeEventListener('click', closeMenu);
    };
    setTimeout(() => document.addEventListener('click', closeMenu), 0);
};

window.handleContextMenuAction = (action) => {
    if (!editingTargetItem) return;

    if (action === 'edit') {
        openFolderEditModal();
    } else if (action === 'dissolve') {
        if (confirm(`确定要解散文件夹 "${editingTargetItem.name}" 吗？`)) {
            dissolveFolder();
        }
    }
};

window.openFolderEditModal = () => {
    const folder = editingTargetItem;
    if (!folder) return;

    const style = normalizeFolderStyle(folder.style, {
        bgColor: folder.bgColor,
        opacity: folder.opacity,
        radius: folder.radius
    });
    els.folderEditName.value = folder.name;
    els.folderEditBgColor.value = style.bgColor;
    els.folderEditOpacity.value = style.opacity;
    els.folderEditOpacityVal.textContent = style.opacity + '%';
    els.folderEditRadius.value = style.radius;
    els.folderEditRadiusVal.textContent = style.radius + 'px';
    els.folderEditModal.classList.remove('hidden');
};

window.openFolderModal = (index, parentFolder = null, childFolder = null) => {
    currentRootIndex = index;
    currentViewingFolder = parentFolder || state.shortcuts[index];
    // Ensure childFolder is still relevant (e.g. not moved or parent not dead)
    currentChildFolder = childFolder;
    if (!currentViewingFolder) {
        document.querySelectorAll('.folder-modal-overlay').forEach(el => el.remove());
        resetFolderModalState();
        return;
    }

    document.querySelectorAll('.folder-modal-overlay').forEach(el => el.remove());

    const folderOverlay = document.createElement('div');
    folderOverlay.className = 'modal-overlay folder-modal-overlay';
    folderOverlay.onclick = (e) => {
        if (e.target === folderOverlay) {
            if (currentChildFolder) {
                openFolderModal(currentRootIndex, currentViewingFolder, null);
            } else {
                folderOverlay.remove();
                resetFolderModalState();
            }
        }
    };

    // Helper to render a folder window
    const createFolderWindow = (folderObj, isChild = false) => {
        const win = document.createElement('div');
        win.className = 'modal glass folder-modal-content' + (isChild ? ' child-win' : ' parent-win');
        win.style.pointerEvents = 'auto'; // CRITICAL: Allow clicks/drops inside the window

        const style = normalizeFolderStyle(folderObj.style, {
            bgColor: folderObj.bgColor,
            opacity: folderObj.opacity,
            radius: folderObj.radius
        });
        const bgColor = style.bgColor;
        const opacity = style.opacity / 100;
        const radius = style.radius + 'px';

        win.style.background = 'none'; // Clear default glass background to allow custom layer
        win.style.borderRadius = radius;
        win.style.overflow = 'hidden'; // Ensure rounded corners clip content

        // Add a dynamic background layer for custom opacity
        const bgLayer = document.createElement('div');
        bgLayer.style.cssText = `position:absolute; top:0; left:0; width:100%; height:100%; background:${colorToRgba(bgColor, opacity)}; border-radius:inherit; z-index:-1`;
        win.appendChild(bgLayer);

        if (isChild) {
            const closeBtn = document.createElement('div');
            closeBtn.innerHTML = '×';
            closeBtn.className = 'folder-close-btn';
            closeBtn.onclick = (e) => { e.stopPropagation(); openFolderModal(currentRootIndex, currentViewingFolder, null); };
            win.appendChild(closeBtn);
        }

        win.oncontextmenu = (e) => {
            if (e.target === win || e.target.className === 'folder-grid') {
                e.preventDefault(); e.stopPropagation();
                openFolderContextMenu(e, folderObj, -1);
            }
        };

        const titleInput = document.createElement('input');
        titleInput.className = 'folder-title-input';
        titleInput.value = folderObj.name;
        titleInput.onchange = (e) => { folderObj.name = e.target.value; saveShortcuts(); renderShortcuts(); };

        const grid = document.createElement('div');
        grid.className = 'folder-grid';
        grid.ondragover = (e) => { e.preventDefault(); grid.classList.add('drag-over'); };
        grid.ondragleave = () => grid.classList.remove('drag-over');
        grid.ondrop = (e) => { if (e.target === grid) handleFolderItemDrop(e, folderObj, folderObj.items.length); };

        folderObj.items.forEach((item, subIdx) => {
            const subEl = document.createElement('div');
            subEl.className = 'shortcut-item draggable-item';
            subEl.draggable = true;
            subEl.ondragstart = (e) => {
                dragSourceType = 'shortcut';
                dragSourceIndex = -1;
                dragSourceFolderIndex = index;
                dragSourceSubIndex = subIdx;
                editingTargetParent = folderObj; // TRACK SOURCE
                e.dataTransfer.effectAllowed = 'move';
                folderOverlay.style.pointerEvents = 'none';
            };

            if (item.type === 'folder') {
                // Folder items inside a folder (is this possible? Logic allows it)
                const iconDiv = document.createElement('div');
                iconDiv.className = 'shortcut-icon glass';
                iconDiv.classList.add('folder-shortcut-icon');

                // Previews
                item.items.slice(0, 4).forEach(sub => {
                    iconDiv.appendChild(createFolderPreviewNode(sub));
                });

                const titleDiv = document.createElement('div');
                titleDiv.className = 'shortcut-title';
                titleDiv.textContent = item.name;

                subEl.appendChild(iconDiv);
                subEl.appendChild(titleDiv);

                subEl.onclick = (e) => { e.stopPropagation(); openFolderModal(index, folderObj, item); };
                subEl.oncontextmenu = (e) => { e.preventDefault(); e.stopPropagation(); openFolderContextMenu(e, folderObj, subIdx); };
            } else {
                const link = document.createElement('a');
                link.href = item.url;
                link.target = state.settings.shortcutInNewTab ? '_blank' : '_self';
                link.className = 'shortcut-icon';
                link.draggable = false;

                const img = document.createElement('img');

                const fallback = document.createElement('div');
                fallback.className = 'shortcut-fallback';
                fallback.style.display = 'none';
                fallback.textContent = getFallbackInitial(item.name, item.url);
                applyShortcutIcon(img, fallback, item.url);

                link.appendChild(img);
                link.appendChild(fallback);

                const titleDiv = document.createElement('div');
                titleDiv.className = 'shortcut-title';
                titleDiv.textContent = item.name;

                subEl.appendChild(link);
                subEl.appendChild(titleDiv);

                subEl.oncontextmenu = (e) => { e.preventDefault(); e.stopPropagation(); openEditModal(index, subIdx, folderObj); };
            }

            subEl.ondragover = (e) => { e.preventDefault(); subEl.classList.add('drag-over'); };
            subEl.ondragleave = () => subEl.classList.remove('drag-over');
            subEl.ondrop = (e) => handleFolderItemDrop(e, folderObj, subIdx);
            grid.appendChild(subEl);
        });

        win.appendChild(titleInput);
        win.appendChild(grid);
        return win;
    };

    const parentWin = createFolderWindow(currentViewingFolder, false);
    folderOverlay.appendChild(parentWin);

    if (currentChildFolder) {
        const childWin = createFolderWindow(currentChildFolder, true);
        folderOverlay.appendChild(childWin);
    }

    document.body.appendChild(folderOverlay);
};

let scrollInterval = null;
let currentScrollDir = null;

window.handleDragOver = (e) => {
    e.preventDefault(); // Necessary for drop to work
    e.dataTransfer.dropEffect = 'move';

    // Auto-scroll when dragging near edges
    const container = document.getElementById('shortcutsContainer');
    const threshold = 100; // Distance from edge to start scrolling
    const scrollSpeed = 15;
    const containerRect = container.getBoundingClientRect();

    let newDir = null;

    if (e.clientX < containerRect.left + threshold) {
        newDir = 'left';
    } else if (e.clientX > containerRect.right - threshold) {
        newDir = 'right';
    } else {
        newDir = null;
    }

    // Only change interval if direction changes
    if (newDir !== currentScrollDir) {
        if (scrollInterval) {
            clearInterval(scrollInterval);
            scrollInterval = null;
        }

        if (newDir === 'left') {
            scrollInterval = setInterval(() => {
                container.scrollLeft -= scrollSpeed;
            }, 16);
        } else if (newDir === 'right') {
            scrollInterval = setInterval(() => {
                container.scrollLeft += scrollSpeed;
            }, 16);
        }

        currentScrollDir = newDir;
    }
};

// 改进后的重置状态函数，确保所有拖拽残留都被清理
function resetDragState() {
    dragSourceIndex = -1;
    dragSource = null;
    dragSourceType = null;
    dragSourceFolderIndex = -1;
    dragSourceSubIndex = -1;

    // 1. 清理自动滚动定时器（防止页面自动乱滚）
    if (typeof scrollInterval !== 'undefined' && scrollInterval) {
        clearInterval(scrollInterval);
        scrollInterval = null;
    }
    if (typeof currentScrollDir !== 'undefined') {
        currentScrollDir = null;
    }

    // 2. 移除容器的拖拽状态（关键：修复无法翻页的问题）
    const container = document.getElementById('shortcutsContainer');
    if (container) {
        container.classList.remove('dragging');
        // 强制重置滚动对齐
        container.style.scrollSnapType = '';
        container.style.scrollBehavior = '';
    }

    // 3. 移除所有图标的拖拽样式
    document.querySelectorAll('.draggable-item.dragging').forEach(el => el.classList.remove('dragging'));
    document.querySelectorAll('.drag-over').forEach(el => el.classList.remove('drag-over'));

    // 4. 恢复文件夹弹窗的鼠标交互（防止文件夹卡死）
    const overlay = document.querySelector('.folder-modal-overlay');
    if (overlay) {
        overlay.style.pointerEvents = 'auto';
    }
}

// 监听全局拖拽结束事件，无论是在哪松开鼠标，都强制重置
window.addEventListener('dragend', () => {
    resetDragState();
});


// Wheel Support for Dragging
window.addEventListener('wheel', (e) => {
    if (dragSourceType === 'shortcut') {
        e.preventDefault();
        const container = document.getElementById('shortcutsContainer');
        container.scrollLeft += e.deltaY; // Horizontal scroll with vertical wheel
    }
}, { passive: false });

window.handleDragEnter = (e) => {
    e.target.closest('.draggable-item')?.classList.add('drag-over');
};

window.handleDragLeave = (e) => {
    e.target.closest('.draggable-item')?.classList.remove('drag-over');
};

// Engine Drag Handlers
window.handleEngineDragStart = (e, key) => {
    dragSource = key;
    dragSourceType = 'engine';
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
};

window.handleEngineDrop = (e, targetKey) => {
    e.preventDefault();
    const item = e.target.closest('.draggable-item');
    item?.classList.remove('drag-over', 'dragging');

    if (dragSourceType !== 'engine' || dragSource === targetKey) return;

    const category = settingsCategory; // Current category in settings panel
    const engines = state.engineCategories[category]?.engines;
    if (!engines) return;

    const keys = Object.keys(engines);
    const fromIndex = keys.indexOf(dragSource);
    const toIndex = keys.indexOf(targetKey);

    if (fromIndex >= 0 && toIndex >= 0) {
        // Reorder keys
        keys.splice(fromIndex, 1);
        keys.splice(toIndex, 0, dragSource);

        // Reconstruct object in new order
        const newEngines = {};
        keys.forEach(k => {
            newEngines[k] = engines[k];
        });

        state.engineCategories[category].engines = newEngines;
        localStorage.setItem('engineCategories', JSON.stringify(state.engineCategories));

        renderSettingsEngineList();
        renderSearchEngine(); // Update main UI
    }
};

// Hot list source drag handlers
window.handleHotSourceDragStart = (e, key) => {
    dragSource = key;
    dragSourceType = 'hotSource';
    e.currentTarget.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
};

window.handleHotSourceDrop = (e, targetKey) => {
    e.preventDefault();
    const item = e.target.closest('.draggable-item');
    item?.classList.remove('drag-over', 'dragging');

    if (dragSourceType !== 'hotSource' || dragSource === targetKey) return;
    reorderHotSources(dragSource, targetKey);
};

// Category Drag Handlers
window.handleCategoryDragStart = (e, key) => {
    dragSource = key;
    dragSourceType = 'category';
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
};

window.handleCategoryDrop = (e, targetKey) => {
    e.preventDefault();
    const item = e.target.closest('.draggable-item');
    item?.classList.remove('drag-over', 'dragging');

    if (dragSourceType !== 'category' || dragSource === targetKey) return;

    const fromIndex = state.categoryOrder.indexOf(dragSource);
    const toIndex = state.categoryOrder.indexOf(targetKey);

    if (fromIndex >= 0 && toIndex >= 0) {
        // Reorder array
        state.categoryOrder.splice(fromIndex, 1);
        state.categoryOrder.splice(toIndex, 0, dragSource);

        localStorage.setItem('categoryOrder', JSON.stringify(state.categoryOrder));

        renderCategoryList();
        renderSearchEngine(); // Update tabs, etc.
        renderSettingsEngineList(); // Re-render in case selector logic depends on order
    }
};

function performSearch() {
    const query = els.searchInput.value.trim();
    if (query) {
        const { engine } = getActiveEngine();
        if (!engine?.url) {
            alert('当前分类没有可用的搜索引擎，请先添加一个');
            return;
        }
        // 支持 %s 占位符
        let targetUrl;
        if (engine.url.includes('%s')) {
            targetUrl = engine.url.replace('%s', encodeURIComponent(query));
        } else {
            targetUrl = engine.url + encodeURIComponent(query);
        }

        if (state.settings.searchInNewTab) {
            window.open(targetUrl, '_blank');
        } else {
            window.location.href = targetUrl;
        }
    }
}

// Event Listeners
function setupEventListeners() {
    // External Dark Mode Toggle
    if (els.darkModeToggle) {
        els.darkModeToggle.onclick = () => {
            state.settings.darkMode = !state.settings.darkMode;
            localStorage.setItem('settings', JSON.stringify(state.settings));
            applySettings();
        };
    }

    // Context Menu Actions (Refactored from inline)
    const ctxEditBtn = document.getElementById('ctxEditBtn');
    if (ctxEditBtn) {
        ctxEditBtn.onclick = () => handleContextMenuAction('edit');
    }
    if (ctxDissolveBtn) {
        ctxDissolveBtn.onclick = () => handleContextMenuAction('dissolve');
    }

    // Shortcut Management
    if (els.fixedAddBtn) els.fixedAddBtn.onclick = () => openEditModal(-1);
    if (els.batchManageBtn) els.batchManageBtn.onclick = toggleBatchMode;

    // Batch Actions
    const selectAllBtn = document.getElementById('selectAllBtn');
    if (selectAllBtn) selectAllBtn.onclick = toggleSelectAll;

    const batchDeleteBtn = document.getElementById('batchDeleteBtn');
    if (batchDeleteBtn) batchDeleteBtn.onclick = batchDelete;

    const batchMoveToPageBtn = document.getElementById('batchMoveToPageBtn');
    if (batchMoveToPageBtn) batchMoveToPageBtn.onclick = batchMoveToPage;

    const exitBatchModeBtn = document.getElementById('exitBatchModeBtn');
    if (exitBatchModeBtn) exitBatchModeBtn.onclick = toggleBatchMode;



    // Search
    els.searchBtn.onclick = performSearch;
    els.searchInput.onkeypress = (e) => {
        if (e.key === 'Enter') performSearch();
    };

    els.searchEngineSelector.onclick = (e) => {
        e.stopPropagation();
        els.engineDropdown.classList.toggle('hidden');
    };

    document.onclick = (e) => {
        // Close Engine Dropdown
        if (!els.searchEngineSelector.contains(e.target)) {
            els.engineDropdown.classList.add('hidden');
        }

        // Hide Context Menus if clicking outside
        if (!e.target.closest('.action-btn')) {
            hideAllShortcutMenus();
        }

        // Close Settings Panel
        // Only close if not clicking inside settings panel, not clicking toggle, 
        // AND not clicking inside any other open modal or its overlay
        const isClickingModal = e.target.closest('.modal') || e.target.closest('.modal-overlay');
        if (!els.settingsPanel.contains(e.target) &&
            !els.settingsToggle.contains(e.target) &&
            !isClickingModal) {
            els.settingsPanel.classList.remove('active');
            setTimeout(() => {
                els.settingsPanel.classList.add('hidden');
            }, 400);
        }
    };

    // Settings Panel Tabs
    const settingsTabs = document.querySelectorAll('.settings-tab');
    const settingsContents = document.querySelectorAll('.settings-tab-content');

    settingsTabs.forEach(tab => {
        tab.onclick = () => {
            // Remove active class from all tabs
            settingsTabs.forEach(t => t.classList.remove('active'));
            // Add active class to clicked tab
            tab.classList.add('active');

            // Hide all contents
            settingsContents.forEach(c => c.classList.remove('active'));
            // Show target content
            const targetId = `settings-tab-${tab.dataset.tab}`;
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        };
    });

    // Settings Panel Toggle
    els.settingsToggle.onclick = () => {
        renderSettingsEngineList(); // Refresh list
        els.settingsPanel.classList.remove('hidden');
        setTimeout(() => {
            els.settingsPanel.classList.add('active');
        }, 10);
    };
    els.closeSettings.onclick = () => {
        els.settingsPanel.classList.remove('active');
        setTimeout(() => {
            els.settingsPanel.classList.add('hidden');
        }, 400); // Wait for transition
    };

    // Settings Inputs
    const updateSetting = (key, value, suffix = '') => {
        state.settings[key] = parseInt(value);
        localStorage.setItem('settings', JSON.stringify(state.settings));
        applySettings();
        if (key === 'maxRows' || key === 'maxCols') renderShortcuts();
    };

    els.maxRows.oninput = (e) => updateSetting('maxRows', e.target.value);
    els.maxCols.oninput = (e) => updateSetting('maxCols', e.target.value);
    els.borderRadius.oninput = (e) => updateSetting('borderRadius', e.target.value, '%');
    els.iconGap.oninput = (e) => updateSetting('iconGap', e.target.value, 'px');
    els.iconSize.oninput = (e) => updateSetting('iconSize', e.target.value, 'px');

    // Search Box Settings
    if (els.searchWidth) els.searchWidth.oninput = (e) => updateSetting('searchWidth', e.target.value, 'px');
    if (els.searchHeight) els.searchHeight.oninput = (e) => updateSetting('searchHeight', e.target.value, 'px');
    if (els.searchRadius) els.searchRadius.oninput = (e) => updateSetting('searchRadius', e.target.value, 'px');
    if (els.searchOpacity) els.searchOpacity.oninput = (e) => updateSetting('searchOpacity', e.target.value, '%');
    if (els.searchBlur) els.searchBlur.oninput = (e) => updateSetting('searchBlur', e.target.value, 'px');

    // Dark Mode Toggle
    if (els.darkMode) {
        els.darkMode.onchange = (e) => {
            state.settings.darkMode = e.target.checked;
            localStorage.setItem('settings', JSON.stringify(state.settings));
            applySettings();
        };
    }

    // Show Shortcuts Toggle
    if (els.showShortcuts) {
        els.showShortcuts.onchange = (e) => {
            state.settings.showShortcuts = e.target.checked;
            localStorage.setItem('settings', JSON.stringify(state.settings));
            applySettings();
        };
    }

    if (els.showNoteWidget) {
        els.showNoteWidget.onchange = (e) => {
            setWidgetEnabled('note', e.target.checked);
        };
    }

    if (els.showHotWidget) {
        els.showHotWidget.onchange = (e) => {
            setWidgetEnabled('hot', e.target.checked);
        };
    }

    if (els.showMusicWidget) {
        els.showMusicWidget.onchange = (e) => {
            setWidgetEnabled('music', e.target.checked);
        };
    }

    if (els.noteWidgetPosition) {
        els.noteWidgetPosition.onchange = (e) => {
            state.settings.noteWidgetPosition = e.target.value === 'left' ? 'left' : 'right';
            localStorage.setItem('settings', JSON.stringify(state.settings));
            applySettings();
        };
    }

    // New Link Target Settings
    if (els.searchInNewTab) {
        els.searchInNewTab.onchange = (e) => {
            state.settings.searchInNewTab = e.target.checked;
            localStorage.setItem('settings', JSON.stringify(state.settings));
        };
    }

    if (els.shortcutInNewTab) {
        els.shortcutInNewTab.onchange = (e) => {
            state.settings.shortcutInNewTab = e.target.checked;
            localStorage.setItem('settings', JSON.stringify(state.settings));
            renderShortcuts();
        };
    }

    if (els.autoFill) {
        els.autoFill.onchange = (e) => {
            state.settings.autoFill = e.target.checked;
            localStorage.setItem('settings', JSON.stringify(state.settings));
            renderShortcuts();
        };
    }

    if (els.clockVerticalOffset) {
        els.clockVerticalOffset.oninput = (e) => {
            state.settings.clockVerticalOffset = parseInt(e.target.value);
            localStorage.setItem('settings', JSON.stringify(state.settings));
            applySettings();
        };
    }
    if (els.searchVerticalOffset) {
        els.searchVerticalOffset.oninput = (e) => {
            state.settings.searchVerticalOffset = parseInt(e.target.value);
            localStorage.setItem('settings', JSON.stringify(state.settings));
            applySettings();
        };
    }
    if (els.shortcutsVerticalOffset) {
        els.shortcutsVerticalOffset.oninput = (e) => {
            state.settings.shortcutsVerticalOffset = parseInt(e.target.value);
            localStorage.setItem('settings', JSON.stringify(state.settings));
            applySettings();
        };
    }

    // Clock Settings Events
    if (els.showClock) {
        els.showClock.onchange = (e) => {
            state.settings.showClock = e.target.checked;
            localStorage.setItem('settings', JSON.stringify(state.settings));
            applySettings();
        };
    }
    if (els.clockSize) {
        els.clockSize.oninput = (e) => {
            state.settings.clockSize = parseFloat(e.target.value);
            els.clockSizeVal.textContent = state.settings.clockSize + 'em';
            localStorage.setItem('settings', JSON.stringify(state.settings));
            applySettings();
        };
    }
    if (els.clockColor) {
        els.clockColor.oninput = (e) => {
            state.settings.clockColor = e.target.value;
            localStorage.setItem('settings', JSON.stringify(state.settings));
            applySettings();
        };
    }
    if (els.clockBorderColor) {
        els.clockBorderColor.oninput = (e) => {
            state.settings.clockBorderColor = e.target.value;
            localStorage.setItem('settings', JSON.stringify(state.settings));
            applySettings();
        };
    }

    els.searchEngineSelector.oncontextmenu = (e) => {
        e.preventDefault();
        openEditEngineModalForCategory(state.engine, state.engineCategory);
    };

    // Wallpaper Toggle
    const wallpaperToggle = document.getElementById('wallpaperToggle');
    const wallpaperMenu = document.getElementById('wallpaperMenu');

    wallpaperToggle.onclick = (e) => {
        e.stopPropagation();
        wallpaperMenu.classList.toggle('hidden');
    };

    els.bingWallpaperBtn.onclick = () => {
        const bingUrl = DEFAULT_WALLPAPER;
        state.wallpaper = bingUrl;
        localStorage.setItem('wallpaper', bingUrl);
        loadWallpaper();
        wallpaperMenu.classList.add('hidden');
    };

    els.uploadWallpaper.onchange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                state.wallpaper = e.target.result;
                localStorage.setItem('wallpaper', state.wallpaper);
                loadWallpaper();
                wallpaperMenu.classList.add('hidden');
            };
            reader.readAsDataURL(file);
        }
    };

    // Click outside to close wallpaper menu
    document.addEventListener('click', (e) => {
        if (!wallpaperMenu.contains(e.target) && !wallpaperToggle.contains(e.target)) {
            wallpaperMenu.classList.add('hidden');
        }
    });

    els.resetSettings.onclick = () => {
        if (confirm('确定要恢复初期设置吗 (保留快捷方式 和 搜索引擎) ？')) {
            localStorage.removeItem('settings');
            localStorage.removeItem('wallpaper'); // Reset wallpaper
            state.settings = {
                ...DEFAULT_SETTINGS,
                categoryOrder: readJsonStorage('categoryOrder', [])
            };
            state.wallpaper = DEFAULT_WALLPAPER; // Reset state wallpaper
            applySettings();
            renderShortcuts();
            loadWallpaper(); // Reload wallpaper
        }
    };

    // Clear All Data
    if (els.clearAllDataBtn) {
        els.clearAllDataBtn.onclick = async () => {
            if (confirm('危险！确定要清除所有数据吗？\n\n这将删除：\n1. 所有自定义快捷方式\n2. 所有搜索引擎设置\n3. 所有图标缓存\n4. 所有个性化配置\n\n此操作不可恢复！')) {
                localStorage.clear();
                // 同时清除 IndexedDB 图标缓存
                await IconCache.clear();
                location.reload();
            }
        };
    }

    // Force Refresh Icons
    const refreshIconsBtn = document.getElementById('refreshIconsBtn');
    if (refreshIconsBtn) {
        refreshIconsBtn.onclick = async () => {
            if (confirm('确定要强制重新缓存所有图标吗？\n这将重新下载所有快捷方式和搜索引擎的图标。')) {
                const loadingMsg = document.createElement('div');
                loadingMsg.style.cssText = 'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:rgba(0,0,0,0.8);color:white;padding:20px;border-radius:10px;z-index:9999;';
                loadingMsg.textContent = '正在刷新图标缓存...';
                document.body.appendChild(loadingMsg);

                try {
                    // Helper to extract URLs
                    const getAllIcons = (list) => {
                        let urls = [];
                        list.forEach(item => {
                            if (!item) return;
                            if (item.type === 'folder') {
                                if (item.items) urls = urls.concat(getAllIcons(item.items));
                            } else {
                                urls.push(...getIconCandidateUrls(item.url));
                            }
                        });
                        return urls;
                    };

                    const shortcutUrls = getAllIcons(state.shortcuts);

                    const engineUrls = [];
                    Object.values(state.engineCategories).forEach(cat => {
                        if (cat.engines) {
                            Object.values(cat.engines).forEach(eng => {
                                getEngineIconCandidateUrls(eng).forEach(url => engineUrls.push(url));
                            });
                        }
                    });

                    const allUrls = [...new Set([...shortcutUrls, ...engineUrls])];
                    console.log(`[IconRefresh] Start refreshing ${allUrls.length} icons...`);

                    // Force re-fetch by deleting first
                    for (const url of allUrls) {
                        await IconCache.delete(url);
                        await fetchAndCacheIcon(url);
                    }

                    alert(`刷新完成，已处理 ${allUrls.length} 个图标`);
                    location.reload();
                } catch (e) {
                    alert('刷新失败: ' + e.message);
                } finally {
                    if (loadingMsg.parentNode) loadingMsg.parentNode.removeChild(loadingMsg);
                }
            }
        };
    }

    // Mouse Wheel Switch for Search Engine
    if (els.searchEngineSelector) {
        els.searchEngineSelector.addEventListener('wheel', (e) => {
            e.preventDefault();

            const engines = getCurrentEngines();
            const keys = Object.keys(engines);
            if (keys.length <= 1) return;

            let currentIndex = keys.indexOf(state.engine);
            if (currentIndex === -1) currentIndex = 0;

            if (e.deltaY > 0) {
                // Next
                const nextIndex = (currentIndex + 1) % keys.length;
                setEngine(keys[nextIndex]);
            } else {
                // Prev
                const prevIndex = (currentIndex - 1 + keys.length) % keys.length;
                setEngine(keys[prevIndex]);
            }
        });
    }

    // Import/Export Events
    if (els.exportConfigBtn) els.exportConfigBtn.onclick = window.exportConfig;
    if (els.importConfigBtn) els.importConfigBtn.onclick = window.importConfig;
    if (els.importFileInput) {
        els.importFileInput.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = async (e) => {
                try {
                    const config = JSON.parse(e.target.result);
                    // Basic validation
                    if (config.shortcuts && config.engineCategories && config.settings) {
                        if (confirm('导入配置将覆盖当前所有设置，是否继续？')) {
                            localStorage.setItem('shortcuts', JSON.stringify(config.shortcuts));
                            localStorage.setItem('engineCategories', JSON.stringify(config.engineCategories));
                            localStorage.setItem('engineCategory', config.engineCategory || 'common');
                            localStorage.setItem('engine', config.engine || 'google');
                            localStorage.setItem('settings', JSON.stringify(config.settings));
                            if (config.wallpaper) localStorage.setItem('wallpaper', config.wallpaper);
                            if (config.categoryOrder) localStorage.setItem('categoryOrder', JSON.stringify(config.categoryOrder));
                            if (config.cachedIcons) { await importCachedIcons(config.cachedIcons); }
                            restoreWidgetsFromConfig(config.widgets);

                            alert('导入成功，页面将刷新');
                            location.reload();
                        }
                    } else {
                        alert('配置文件格式错误: 缺少必要字段');
                    }
                } catch (err) {
                    alert('读取配置文件失败: ' + err.message);
                }
                // Reset input
                els.importFileInput.value = '';
            };
            reader.readAsText(file);
        };
    }

    // Drag Scrolling Logic
    const container = els.shortcutsContainer;
    let isDown = false;
    let startX;
    let scrollLeft;

    // Clear Search Button
    if (els.clearSearchBtn) {
        els.clearSearchBtn.onclick = () => {
            els.searchInput.value = '';
            els.clearSearchBtn.classList.add('hidden');
            els.searchInput.focus();
        };
    }

    // Input handlers
    els.searchInput.addEventListener('input', (e) => {
        if (els.clearSearchBtn) {
            if (e.target.value.length > 0) {
                els.clearSearchBtn.classList.remove('hidden');
            } else {
                els.clearSearchBtn.classList.add('hidden');
            }
        }
    });

    container.addEventListener('mousedown', (e) => {
        // Prevent swipe if clicking on an icon/item
        if (e.target.closest('.shortcut-item') || e.target.closest('.shortcut-icon')) return;

        isDown = true;
        container.classList.add('dragging');
        startX = e.pageX - container.offsetLeft;
        scrollLeft = container.scrollLeft;
    });

    container.addEventListener('mouseleave', () => {
        isDown = false;
        container.classList.remove('dragging');
    });

    container.addEventListener('mouseup', () => {
        isDown = false;
        container.classList.remove('dragging');
    });

    container.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - container.offsetLeft;
        const walk = (x - startX) * 2; // Scroll-fast
        container.scrollLeft = scrollLeft - walk;
    });

    // Mouse Wheel Scrolling
    container.addEventListener('wheel', (e) => {
        e.preventDefault();
        const direction = e.deltaY > 0 ? 1 : -1;
        const scrollAmount = container.clientWidth;

        container.scrollBy({
            left: direction * scrollAmount,
            behavior: 'smooth'
        });
    });

    // Engine Management
    if (els.addEngineBtn) {
        els.addEngineBtn.onclick = () => {
            editingEngineKey = null;
            editingEngineCategory = settingsCategory; // Use settings panel category
            els.engineModalTitle.textContent = '添加搜索引擎';
            els.engineName.value = '';
            els.engineUrl.value = '';
            els.engineIcon.value = '';
            els.engineModal.classList.remove('hidden');
        };
    }

    // Engine category select in settings
    if (els.engineCategorySelect) {
        els.engineCategorySelect.onchange = (e) => {
            settingsCategory = e.target.value;
            renderSettingsEngineList();
        };
    }

    if (els.cancelEngineEdit) {
        els.cancelEngineEdit.onclick = () => els.engineModal.classList.add('hidden');
    }

    // Delete button in engine modal
    if (els.deleteEngineFromModal) {
        els.deleteEngineFromModal.onclick = () => {
            if (editingEngineKey && editingEngineCategory) {
                if (deleteEngineFromCategory(editingEngineKey, editingEngineCategory)) {
                    els.engineModal.classList.add('hidden');
                }
            } else {
                els.engineModal.classList.add('hidden');
            }
        };
    }

    // Category Management Events
    if (els.manageCategoriesBtn) {
        els.manageCategoriesBtn.onclick = openCategoryManager;
    }
    if (els.addCategoryBtn) {
        els.addCategoryBtn.onclick = addCategory;
    }
    if (els.closeCategoryModal) {
        els.closeCategoryModal.onclick = () => els.categoryModal.classList.add('hidden');
    }

    if (els.saveEngineEdit) {
        els.saveEngineEdit.onclick = () => {
            const name = els.engineName.value.trim();
            const url = els.engineUrl.value.trim();
            let icon = els.engineIcon.value.trim();

            if (!name || !url) return alert('请填写名称和网址');

            // Default icon if empty
            if (!icon) {
                try {
                    const domain = new URL(url).hostname;
                    // Use favicon.im API as requested
                    icon = `https://favicon.im/${domain}?larger=true`;
                } catch (e) {
                    icon = 'https://www.google.com/favicon.ico';
                }
            }

            // Determine target category
            const targetCategory = editingEngineCategory || settingsCategory || state.engineCategory;
            const engines = state.engineCategories[targetCategory]?.engines;

            if (!engines) return;

            if (editingEngineKey) {
                // Update existing
                engines[editingEngineKey] = { name, url, icon };
            } else {
                // Create new
                const id = 'custom_' + Date.now();
                engines[id] = { name, url, icon };
            }

            localStorage.setItem('engineCategories', JSON.stringify(state.engineCategories));

            // 主动缓存多个候选图标源，避免单个 favicon 服务或站点防护拦截。
            fetchIconCandidates(getEngineIconCandidateUrls({ name, url, icon }));

            renderSearchEngine();
            renderSettingsEngineList();
            els.engineModal.classList.add('hidden');
            editingEngineCategory = null;
        };
    }

    // Folder Edit Events
    if (els.cancelFolderEdit) {
        els.cancelFolderEdit.onclick = () => els.folderEditModal.classList.add('hidden');
    }

    if (els.saveFolderEdit) {
        els.saveFolderEdit.onclick = () => {
            const folder = editingTargetItem;
            if (!folder) return;
            const shouldRefreshFolderModal = !!document.querySelector('.folder-modal-overlay');

            folder.name = els.folderEditName.value.trim() || '新建文件夹';
            folder.style = normalizeFolderStyle({
                bgColor: els.folderEditBgColor.value,
                opacity: parseInt(els.folderEditOpacity.value),
                radius: parseInt(els.folderEditRadius.value)
            });

            saveShortcuts();
            renderShortcuts();
            els.folderEditModal.classList.add('hidden');

            if (shouldRefreshFolderModal) {
                openFolderModal(currentRootIndex, currentViewingFolder, currentChildFolder);
            }
        };
    }

    if (els.folderEditOpacity) {
        els.folderEditOpacity.oninput = (e) => {
            els.folderEditOpacityVal.textContent = e.target.value + '%';
        };
    }

    if (els.folderEditRadius) {
        els.folderEditRadius.oninput = (e) => {
            els.folderEditRadiusVal.textContent = e.target.value + 'px';
        };
    }

    // Enter key to save
    if (els.shortcutName) {
        els.shortcutName.onkeydown = (e) => {
            if (e.key === 'Enter') els.saveEdit.click();
        };
    }
    if (els.shortcutUrl) {
        els.shortcutUrl.onkeydown = (e) => {
            if (e.key === 'Enter') els.saveEdit.click();
        };
    }

    // Auto Night Mode Toggle
    if (els.autoNightMode) {
        els.autoNightMode.onchange = (e) => {
            state.settings.autoNightMode = e.target.checked;
            localStorage.setItem('settings', JSON.stringify(state.settings));
            checkAutoNightMode(); // Check immediately
            applySettings(); // Sync UI
        };
    }

    // Global Brightness
    if (els.globalBrightness) {
        els.globalBrightness.oninput = (e) => {
            state.settings.globalBrightness = parseInt(e.target.value);
            localStorage.setItem('settings', JSON.stringify(state.settings));
            applySettings();
        };
    }

    // Modal
    els.cancelEdit.onclick = () => els.editModal.classList.add('hidden');

    const deleteShortcutBtn = document.getElementById('deleteShortcutBtn');
    if (deleteShortcutBtn) {
        deleteShortcutBtn.onclick = () => {
            // Ensure editingIndex is valid
            if (editingIndex >= 0) {
                if (deleteShortcut(editingIndex)) {
                    els.editModal.classList.add('hidden');
                }
            }
        };
    }

    window.deleteShortcut = (index) => {
        if (window.event && window.event.preventDefault) { window.event.preventDefault(); window.event.stopPropagation(); }

        if (confirm('确定删除此快捷网站吗？')) {
            let deletedItem = null;

            if (editingSubIndex >= 0 && editingTargetParent) {
                // 文件夹内的子项，始终使用 splice
                deletedItem = editingTargetParent.items[editingSubIndex];
                editingTargetParent.items.splice(editingSubIndex, 1);
            } else {
                deletedItem = state.shortcuts[index];
                // 根据 autoFill 设置决定删除方式
                if (state.settings.autoFill !== false) {
                    // 自动补位模式：使用 splice 删除，后续图标自动前移
                    state.shortcuts.splice(index, 1);
                } else {
                    // 固定位置模式：设为 null，保留空位
                    state.shortcuts[index] = null;
                }
                editingSubIndex = -1;
            }

            // 清除对应图标缓存
            if (deletedItem && deletedItem.url) {
                getIconCandidateUrls(deletedItem.url).forEach(iconUrl => {
                    IconCache.delete(iconUrl).then(() => {
                        console.log('[IconCache] 已删除快捷网站图标缓存:', iconUrl);
                    });
                });
            }

            saveShortcuts(); renderShortcuts();

            if (editingTargetParent) {
                if (editingTargetParent.items.length === 0 && editingTargetParent !== currentViewingFolder) {
                    // If a child folder became empty, close child win
                    openFolderModal(currentRootIndex, currentViewingFolder, null);
                } else {
                    openFolderModal(currentRootIndex, currentViewingFolder, currentChildFolder);
                }
            }
            return true;
        }
        return false;
    };

    // ... (keeping other functions) ...

    els.saveEdit.onclick = () => {
        const name = els.shortcutName.value.trim();
        let url = els.shortcutUrl.value.trim();

        if (!name || !url) return alert('请填写完整信息');
        if (!url.startsWith('http')) url = 'https://' + url;

        // 主动缓存多个候选图标源，避免单个 favicon 服务失效
        fetchIconCandidates(getIconCandidateUrls(url));

        if (editingIndex >= 0) {
            if (editingSubIndex >= 0 && editingTargetParent) {
                editingTargetParent.items[editingSubIndex] = { name, url };
            } else {
                state.shortcuts[editingIndex] = { name, url };
            }
        } else {
            let emptyIndex = state.shortcuts.indexOf(null);
            if (emptyIndex === -1) state.shortcuts.push({ name, url });
            else state.shortcuts[emptyIndex] = { name, url };
        }

        saveShortcuts(); renderShortcuts();
        els.editModal.classList.add('hidden');

        if (editingTargetParent) {
            openFolderModal(currentRootIndex, currentViewingFolder, currentChildFolder);
        }
    };
}

// Run
init();
