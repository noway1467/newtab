// Bookmarks Import Module
// This is a new independent module for importing browser bookmarks
// It won't conflict with existing shortcut functionality

const BookmarksImporter = {
    selectedBookmarks: new Set(), // Store selected bookmark IDs
    bookmarksData: null, // Store loaded bookmarks tree
    autoSyncEnabled: false, // Auto sync toggle state
    syncListeners: [], // Store bookmark listeners for cleanup
    folderColors: ['#ffffff'],

    isBookmarksApiAvailable() {
        return typeof chrome !== 'undefined' && chrome.bookmarks;
    },

    getRandomFolderStyle() {
        if (typeof normalizeFolderStyle === 'function') {
            return normalizeFolderStyle({
                bgColor: '#ffffff',
                opacity: 24,
                radius: 18
            });
        }
        return {
            bgColor: '#ffffff',
            opacity: 24,
            radius: 18
        };
    },

    createFolderShortcut(name, items = [], sourceNode = null) {
        return {
            type: 'folder',
            name: name || '未命名文件夹',
            items,
            style: this.getRandomFolderStyle(),
            source: sourceNode ? {
                type: 'browser-bookmarks',
                id: sourceNode.id,
                parentId: sourceNode.parentId || null
            } : undefined
        };
    },

    normalizeFolderShortcut(folder) {
        if (!folder || folder.type !== 'folder') return folder;
        if (!Array.isArray(folder.items)) folder.items = [];
        if (typeof ensureFolderVisualStyle === 'function') return ensureFolderVisualStyle(folder);
        if (!folder.style) {
            folder.style = this.getRandomFolderStyle();
        }
        delete folder.bgColor;
        delete folder.opacity;
        delete folder.radius;
        return folder;
    },

    collectExistingUrls(items = state.shortcuts, urls = new Set()) {
        (items || []).forEach(item => {
            if (!item) return;
            if (item.url) {
                urls.add(item.url.toLowerCase());
            }
            if (item.type === 'folder') {
                this.collectExistingUrls(item.items, urls);
            }
        });
        return urls;
    },

    findFolderByBrowserIdOrName(items, node) {
        const name = node.title || node.name || '未命名文件夹';
        return (items || []).find(item => {
            if (!item || item.type !== 'folder') return false;
            const sourceId = item.source?.type === 'browser-bookmarks' ? item.source.id : null;
            return sourceId === node.id || item.name === name;
        }) || null;
    },

    ensureFolderInList(items, node) {
        let folder = this.findFolderByBrowserIdOrName(items, node);
        if (!folder) {
            folder = this.createFolderShortcut(node.title || node.name, [], node);
            items.push(folder);
        }
        return this.normalizeFolderShortcut(folder);
    },

    ensureFolderPath(pathNodes) {
        let targetList = state.shortcuts;
        let folder = null;

        pathNodes.forEach(node => {
            folder = this.ensureFolderInList(targetList, node);
            targetList = folder.items;
        });

        return folder;
    },

    isSystemRootFolder(node) {
        return ['0', '1', '2', '3'].includes(String(node.id)) ||
            ['Bookmarks Bar', 'Other Bookmarks', 'Mobile Bookmarks', '书签栏', '其他书签', '移动设备书签'].includes(node.title);
    },

    async getFolderPath(folderId) {
        const path = [];
        let currentId = folderId;

        while (currentId && this.isBookmarksApiAvailable()) {
            try {
                const nodes = await chrome.bookmarks.get(currentId);
                const node = nodes && nodes[0];
                if (!node || node.id === '0') break;
                path.unshift(node);
                currentId = node.parentId;
            } catch (error) {
                console.warn('获取书签文件夹路径失败:', error);
                break;
            }
        }

        // 新增收藏在多级文件夹内时，不把“书签栏/其他书签”当成首页文件夹。
        if (path.length > 1 && this.isSystemRootFolder(path[0])) {
            return path.slice(1);
        }
        return path;
    },

    addBookmarkToList(targetList, bookmarkNode, existingUrls, skipDuplicates) {
        if (!bookmarkNode?.url) return 0;
        const urlLower = bookmarkNode.url.toLowerCase();
        if (skipDuplicates && existingUrls.has(urlLower)) return 0;

        targetList.push({
            name: bookmarkNode.title || '未命名',
            url: bookmarkNode.url
        });
        existingUrls.add(urlLower);
        return 1;
    },

    mergeFolderContents(folderNode, targetFolder, includeSubfolders, existingUrls, skipDuplicates) {
        let importedCount = 0;
        this.normalizeFolderShortcut(targetFolder);

        for (const child of folderNode.children || []) {
            if (child.url) {
                importedCount += this.addBookmarkToList(targetFolder.items, child, existingUrls, skipDuplicates);
            } else if (child.children && includeSubfolders) {
                const childFolder = this.ensureFolderInList(targetFolder.items, child);
                importedCount += this.mergeFolderContents(child, childFolder, includeSubfolders, existingUrls, skipDuplicates);
            }
        }

        return importedCount;
    },

    extractBookmarksFlat(folderNode, includeSubfolders, existingUrls, skipDuplicates) {
        const items = [];
        for (const child of folderNode.children || []) {
            if (child.url) {
                const urlLower = child.url.toLowerCase();
                if (!skipDuplicates || !existingUrls.has(urlLower)) {
                    items.push({
                        name: child.title || '未命名',
                        url: child.url
                    });
                    existingUrls.add(urlLower);
                }
            } else if (child.children && includeSubfolders) {
                items.push(...this.extractBookmarksFlat(child, includeSubfolders, existingUrls, skipDuplicates));
            }
        }
        return items;
    },

    // Initialize the bookmarks importer
    init() {
        const loadBtn = document.getElementById('loadBookmarksBtn');
        const importBtn = document.getElementById('importSelectedBookmarksBtn');
        const autoImportBtn = document.getElementById('autoImportAllBtn');
        const autoSyncToggle = document.getElementById('autoSyncEnabled');

        if (loadBtn) {
            loadBtn.onclick = () => this.loadBookmarks();
        }

        if (importBtn) {
            importBtn.onclick = () => this.importSelected();
        }

        if (autoImportBtn) {
            autoImportBtn.onclick = () => this.autoImportAll();
        }

        if (autoSyncToggle) {
            // Load saved state
            const savedState = localStorage.getItem('bookmarksAutoSyncEnabled');
            this.autoSyncEnabled = savedState === 'true';
            autoSyncToggle.checked = this.autoSyncEnabled;

            // Toggle handler
            autoSyncToggle.onchange = () => {
                this.autoSyncEnabled = autoSyncToggle.checked;
                localStorage.setItem('bookmarksAutoSyncEnabled', this.autoSyncEnabled);
                
                if (this.autoSyncEnabled) {
                    this.startAutoSync();
                } else {
                    this.stopAutoSync();
                }
            };

            // Start auto sync if enabled
            if (this.autoSyncEnabled) {
                this.startAutoSync();
            }
        }
    },

    // Start auto sync - listen to bookmark changes
    startAutoSync() {
        if (!this.isBookmarksApiAvailable()) {
            console.error('书签API不可用');
            return;
        }

        if (this.syncListeners.length > 0) {
            this.stopAutoSync();
        }

        const statusEl = document.getElementById('autoSyncStatus');
        if (statusEl) {
            statusEl.textContent = '✅ 自动同步已启用';
            statusEl.style.color = '#4caf50';
        }

        console.log('[书签自动同步] 已启用');

        // Listen to bookmark created event
        const onCreatedListener = (id, bookmark) => {
            console.log('[书签自动同步] 检测到新书签:', bookmark);
            this.handleBookmarkCreated(bookmark);
        };

        // Listen to bookmark moved event (when moving to a folder)
        const onMovedListener = (id, moveInfo) => {
            console.log('[书签自动同步] 书签移动:', moveInfo);
            // Re-fetch and sync when bookmark is moved
            this.syncNewBookmarksOnly();
        };

        // Register listeners
        chrome.bookmarks.onCreated.addListener(onCreatedListener);
        chrome.bookmarks.onMoved.addListener(onMovedListener);

        // Store listeners for cleanup
        this.syncListeners = [
            { event: 'onCreated', listener: onCreatedListener },
            { event: 'onMoved', listener: onMovedListener }
        ];
    },

    // Stop auto sync - remove listeners
    stopAutoSync() {
        const statusEl = document.getElementById('autoSyncStatus');
        if (statusEl) {
            statusEl.textContent = '⏸️ 自动同步已暂停';
            statusEl.style.color = '#666';
        }

        console.log('[书签自动同步] 已停用');

        // Remove all listeners
        this.syncListeners.forEach(({ event, listener }) => {
            if (!this.isBookmarksApiAvailable()) return;
            if (event === 'onCreated') {
                chrome.bookmarks.onCreated.removeListener(listener);
            } else if (event === 'onMoved') {
                chrome.bookmarks.onMoved.removeListener(listener);
            }
        });

        this.syncListeners = [];
    },

    // Handle bookmark created event
    async handleBookmarkCreated(bookmark) {
        // Skip folders (only sync bookmarks with URL)
        if (!bookmark.url) {
            console.log('[书签自动同步] 跳过文件夹:', bookmark.title);
            return;
        }

        const skipDuplicates = document.getElementById('skipDuplicates')?.checked ?? true;

        // Check for duplicates
        const existingUrls = this.collectExistingUrls();

        const urlLower = bookmark.url.toLowerCase();
        if (skipDuplicates && existingUrls.has(urlLower)) {
            console.log('[书签自动同步] 跳过重复书签:', bookmark.title);
            return;
        }

        const importAsFolder = document.getElementById('importAsFolder')?.checked ?? true;

        if (importAsFolder) {
            const pathNodes = await this.getFolderPath(bookmark.parentId);
            const fallbackNode = { id: bookmark.parentId || `auto_${Date.now()}`, title: '新书签', parentId: null };
            const targetFolder = this.ensureFolderPath(pathNodes.length > 0 ? pathNodes : [fallbackNode]);
            this.addBookmarkToList(targetFolder.items, bookmark, existingUrls, skipDuplicates);
            console.log(`[书签自动同步] 添加到文件夹 "${targetFolder.name}":`, bookmark.title);
        } else {
            // Add directly as shortcut
            this.addBookmarkToList(state.shortcuts, bookmark, existingUrls, skipDuplicates);
            console.log('[书签自动同步] 直接添加书签:', bookmark.title);
        }

        // Save and render
        saveShortcuts();
        renderShortcuts();

        // Show notification
        this.showSyncNotification(`✅ 已自动添加: ${bookmark.title || '新书签'}`);
    },

    // Sync only new bookmarks (for moved bookmarks)
    async syncNewBookmarksOnly() {
        // This is a lightweight sync for moved bookmarks
        // Just re-check if there are any new bookmarks
        console.log('[书签自动同步] 检查新书签...');
    },

    // Show sync notification
    showSyncNotification(message) {
        const statusEl = document.getElementById('autoSyncStatus');
        if (statusEl) {
            const originalText = statusEl.textContent;
            statusEl.textContent = message;
            statusEl.style.color = '#4caf50';

            setTimeout(() => {
                if (this.autoSyncEnabled) {
                    statusEl.textContent = '✅ 自动同步已启用';
                } else {
                    statusEl.textContent = originalText;
                }
            }, 3000);
        }
    },

    // Load bookmarks from browser
    async loadBookmarks() {
        const statusEl = document.getElementById('bookmarksStatus');
        const treeContainer = document.getElementById('bookmarksTreeContainer');
        const treeEl = document.getElementById('bookmarksTree');

        try {
            statusEl.textContent = '正在加载书签...';
            statusEl.style.color = '#4a90e2';

            // Check if bookmarks API is available
            if (!this.isBookmarksApiAvailable()) {
                throw new Error('书签API不可用，请确保扩展有bookmarks权限');
            }

            // Get entire bookmarks tree
            const bookmarksTree = await chrome.bookmarks.getTree();
            this.bookmarksData = bookmarksTree;

            // Count total bookmarks
            const count = this.countBookmarks(bookmarksTree);
            statusEl.textContent = `已加载 ${count} 个书签`;
            statusEl.style.color = '#4caf50';

            // Render bookmarks tree
            treeEl.innerHTML = '';
            this.renderBookmarksTree(bookmarksTree[0].children, treeEl);
            treeContainer.style.display = 'block';

        } catch (error) {
            console.error('加载书签失败:', error);
            statusEl.textContent = `加载失败: ${error.message}`;
            statusEl.style.color = '#dc3545';
        }
    },

    // Count total bookmarks in tree
    countBookmarks(nodes) {
        let count = 0;
        for (const node of nodes) {
            if (node.url) {
                count++;
            }
            if (node.children) {
                count += this.countBookmarks(node.children);
            }
        }
        return count;
    },

    // Render bookmarks tree as HTML
    renderBookmarksTree(nodes, parentElement, level = 0) {
        for (const node of nodes) {
            // Skip root folders with no meaningful content
            if (level === 0 && (!node.children || node.children.length === 0)) {
                continue;
            }

            const itemDiv = document.createElement('div');

            if (node.children) {
                // This is a folder
                const folderItem = document.createElement('div');
                folderItem.className = 'bookmarks-tree-item folder';
                folderItem.dataset.id = node.id;
                folderItem.dataset.type = 'folder';

                const icon = document.createElement('span');
                icon.className = 'icon';
                icon.textContent = '📁';
                folderItem.appendChild(icon);

                const name = document.createElement('span');
                name.className = 'name';
                name.textContent = node.title || '未命名文件夹';
                folderItem.appendChild(name);

                const count = document.createElement('span');
                count.className = 'count';
                const bookmarkCount = this.countBookmarks([node]);
                count.textContent = `${bookmarkCount} 项`;
                folderItem.appendChild(count);

                folderItem.onclick = (e) => {
                    e.stopPropagation();
                    this.toggleSelection(node.id, 'folder');
                };

                itemDiv.appendChild(folderItem);

                // Render children
                const childrenDiv = document.createElement('div');
                childrenDiv.className = 'bookmarks-tree-children';
                this.renderBookmarksTree(node.children, childrenDiv, level + 1);
                itemDiv.appendChild(childrenDiv);

            } else if (node.url) {
                // This is a bookmark
                const bookmarkItem = document.createElement('div');
                bookmarkItem.className = 'bookmarks-tree-item bookmark';
                bookmarkItem.dataset.id = node.id;
                bookmarkItem.dataset.type = 'bookmark';

                const icon = document.createElement('span');
                icon.className = 'icon';
                icon.textContent = '🔖';
                bookmarkItem.appendChild(icon);

                const name = document.createElement('span');
                name.className = 'name';
                name.textContent = node.title || node.url;
                bookmarkItem.appendChild(name);

                bookmarkItem.onclick = (e) => {
                    e.stopPropagation();
                    this.toggleSelection(node.id, 'bookmark');
                };

                itemDiv.appendChild(bookmarkItem);
            }

            parentElement.appendChild(itemDiv);
        }
    },

    // Toggle bookmark selection
    toggleSelection(id, type) {
        const itemEl = document.querySelector(`.bookmarks-tree-item[data-id="${id}"]`);
        
        if (this.selectedBookmarks.has(id)) {
            this.selectedBookmarks.delete(id);
            itemEl.classList.remove('selected');
        } else {
            this.selectedBookmarks.add(id);
            itemEl.classList.add('selected');
        }

        // Enable/disable import button
        const importBtn = document.getElementById('importSelectedBookmarksBtn');
        importBtn.disabled = this.selectedBookmarks.size === 0;
    },

    // Find bookmark node by ID
    findNodeById(nodes, id) {
        for (const node of nodes) {
            if (node.id === id) return node;
            if (node.children) {
                const found = this.findNodeById(node.children, id);
                if (found) return found;
            }
        }
        return null;
    },

    // Import selected bookmarks
    async importSelected() {
        const progressEl = document.getElementById('importProgress');
        const importAsFolder = document.getElementById('importAsFolder').checked;
        const importSubfolders = document.getElementById('importSubfolders').checked;
        const skipDuplicates = document.getElementById('skipDuplicates').checked;

        try {
            progressEl.textContent = '正在导入...';
            progressEl.style.color = '#4a90e2';

            let importedCount = 0;
            const existingUrls = this.collectExistingUrls();

            for (const bookmarkId of this.selectedBookmarks) {
                const node = this.findNodeById(this.bookmarksData, bookmarkId);
                if (!node) continue;

                if (node.children) {
                    // Import folder
                    if (importAsFolder) {
                        const targetFolder = this.ensureFolderInList(state.shortcuts, node);
                        importedCount += this.mergeFolderContents(node, targetFolder, importSubfolders, existingUrls, skipDuplicates);
                    } else {
                        const flatItems = this.extractBookmarksFlat(node, importSubfolders, existingUrls, skipDuplicates);
                        state.shortcuts.push(...flatItems);
                        importedCount += flatItems.length;
                    }
                } else if (node.url) {
                    // Import single bookmark
                    importedCount += this.addBookmarkToList(state.shortcuts, node, existingUrls, skipDuplicates);
                }
            }

            // Save and render
            saveShortcuts();
            renderShortcuts();

            progressEl.textContent = `成功导入 ${importedCount} 个书签！`;
            progressEl.style.color = '#4caf50';

            // Clear selection
            this.selectedBookmarks.clear();
            document.querySelectorAll('.bookmarks-tree-item.selected').forEach(el => {
                el.classList.remove('selected');
            });
            document.getElementById('importSelectedBookmarksBtn').disabled = true;

            // Auto close after 2 seconds
            setTimeout(() => {
                progressEl.textContent = '';
            }, 3000);

        } catch (error) {
            console.error('导入失败:', error);
            progressEl.textContent = `导入失败: ${error.message}`;
            progressEl.style.color = '#dc3545';
        }
    },

    // Extract folder data recursively
    extractFolderData(folderNode, includeSubfolders, existingUrls, skipDuplicates) {
        const items = [];
        
        for (const child of folderNode.children || []) {
            if (child.url) {
                // It's a bookmark
                const urlLower = child.url.toLowerCase();
                if (!skipDuplicates || !existingUrls.has(urlLower)) {
                    items.push({
                        name: child.title || '未命名',
                        url: child.url
                    });
                    existingUrls.add(urlLower);
                }
            } else if (child.children && includeSubfolders) {
                // It's a subfolder
                const subFolderData = this.extractFolderData(child, includeSubfolders, existingUrls, skipDuplicates);
                if (subFolderData.items.length > 0) {
                    items.push({
                        type: 'folder',
                        name: subFolderData.name,
                        items: subFolderData.items,
                        style: this.getRandomFolderStyle(),
                        source: {
                            type: 'browser-bookmarks',
                            id: child.id,
                            parentId: child.parentId || null
                        }
                    });
                }
            }
        }

        return {
            name: folderNode.title || '未命名文件夹',
            items: items
        };
    },

    // Auto import all bookmarks (NEW FEATURE)
    async autoImportAll() {
        const statusEl = document.getElementById('autoImportStatus');
        const importAsFolder = document.getElementById('importAsFolder').checked;
        const importSubfolders = document.getElementById('importSubfolders').checked;
        const skipDuplicates = document.getElementById('skipDuplicates').checked;
        const autoImportScope = document.getElementById('autoImportScope').value;

        try {
            statusEl.textContent = '🔄 正在读取书签...';
            statusEl.style.color = '#4a90e2';

            // Check if bookmarks API is available
            if (!this.isBookmarksApiAvailable()) {
                throw new Error('书签API不可用，请确保扩展有bookmarks权限');
            }

            // Get entire bookmarks tree
            const bookmarksTree = await chrome.bookmarks.getTree();
            
            // Find the target folder based on scope
            let targetFolders = [];
            const root = bookmarksTree[0];

            if (root.children) {
                for (const child of root.children) {
                    // Chrome bookmarks structure:
                    // - "1" = Bookmarks Bar (书签栏)
                    // - "2" = Other Bookmarks (其他书签)
                    // - "3" = Mobile Bookmarks (移动设备书签)
                    
                    if (autoImportScope === 'bookmarks_bar') {
                        // Only bookmarks bar
                        if (child.id === '1' || child.title === 'Bookmarks Bar' || child.title === '书签栏') {
                            targetFolders.push(child);
                        }
                    } else if (autoImportScope === 'other') {
                        // Only other bookmarks
                        if (child.id === '2' || child.title === 'Other Bookmarks' || child.title === '其他书签') {
                            targetFolders.push(child);
                        }
                    } else {
                        // All bookmarks
                        if (child.children && child.children.length > 0) {
                            targetFolders.push(child);
                        }
                    }
                }
            }

            if (targetFolders.length === 0) {
                statusEl.textContent = '⚠️ 没有找到可导入的书签';
                statusEl.style.color = '#ff9800';
                return;
            }

            statusEl.textContent = '📥 正在导入书签...';

            let totalImported = 0;
            const existingUrls = this.collectExistingUrls();

            // Process each target folder
            for (const folder of targetFolders) {
                if (!folder.children || folder.children.length === 0) continue;

                // Process each top-level item in the folder
                for (const item of folder.children) {
                    if (item.url) {
                        // It's a direct bookmark
                        totalImported += this.addBookmarkToList(state.shortcuts, item, existingUrls, skipDuplicates);
                    } else if (item.children) {
                        // It's a folder
                        if (importAsFolder) {
                            const targetFolder = this.ensureFolderInList(state.shortcuts, item);
                            totalImported += this.mergeFolderContents(item, targetFolder, importSubfolders, existingUrls, skipDuplicates);
                        } else {
                            const flatItems = this.extractBookmarksFlat(item, importSubfolders, existingUrls, skipDuplicates);
                            state.shortcuts.push(...flatItems);
                            totalImported += flatItems.length;
                        }
                    }
                }
            }

            // Save and render
            if (totalImported > 0) {
                saveShortcuts();
                renderShortcuts();

                statusEl.textContent = `✅ 成功导入 ${totalImported} 个书签！`;
                statusEl.style.color = '#4caf50';

                // Show success message for 5 seconds
                setTimeout(() => {
                    statusEl.textContent = '';
                }, 5000);
            } else {
                statusEl.textContent = '💡 所有书签已存在，未导入新内容';
                statusEl.style.color = '#ff9800';
                
                setTimeout(() => {
                    statusEl.textContent = '';
                }, 5000);
            }

        } catch (error) {
            console.error('自动导入失败:', error);
            statusEl.textContent = `❌ 导入失败: ${error.message}`;
            statusEl.style.color = '#dc3545';
            
            setTimeout(() => {
                statusEl.textContent = '';
            }, 5000);
        }
    }
};

// Initialize when document is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => BookmarksImporter.init());
} else {
    BookmarksImporter.init();
}
