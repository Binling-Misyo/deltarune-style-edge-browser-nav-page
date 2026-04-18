console.log("狗代码开始加载...");

// ==================== 数据结构 ====================
class LinkDiv {
    constructor(name, url, id, imgPath) {
        this.name = name;
        this.url = url;
        this.id = id;
        this.imgPath = imgPath || "../image/dog.webp";
        console.log("新增的链接：", this.name, this.url, this.id, this.imgPath);
    }

    printHTML() {
        return `<a href="${this.url}">
            <div>
                <img src="${this.imgPath}" alt=""><br> <span lang="en">*${this.name}</span> 
            </div>
        </a>`;
    }

    editViewHTML() {
        return `<div id="edit-${this.id}" class="edit-item" data-id="${this.id}>
            <span class="edit-id">&nbsp; * ${this.id + 1}</span>
            <span class="edit-name">${this.name}</span>
            <span class="edit-url" title="${this.url}">${this.url}</span>
            <span class="edit-img" title="${this.imgPath}">${this.imgPath}</span>
            <div class="edit-actions" style="display: inline-block;text-align: right;">
                <button class="move-up-btn buttonText" data-id="${this.id}" ${this.id === 0 ? 'disabled' : ''}>↑</button>
                <button class="move-down-btn buttonText" data-id="${this.id}">↓</button>
                <button class="edit-btn buttonText " data-id="${this.id}">编辑</button>
                <button class="delete-btn buttonText " data-id="${this.id}">删除</button>
            </div>
        </div>`;
    }

    set(name, url, imgPath) {
        this.name = name;
        this.url = url;
        this.imgPath = imgPath || "../image/dog.webp";
        console.log("更新链接：", this.name, this.url, this.id, this.imgPath);
    }
}

// ==================== 全局变量 ====================
const DefaultLinkList = [
    new LinkDiv("超星学习通", "https://i.chaoxing.com/base?t=1749358614086", 0, "../image/xxt.jpg"),
    new LinkDiv("哔哩哔哩", "https://www.bilibili.com/", 1, "../image/bilibili.png"),
    new LinkDiv("深度求索", "https://chat.deepseek.com/sign_in", 2, "../image/ds.png"),
    new LinkDiv("周师图书馆", "http://tsg.zknu.edu.cn:8080/reader/login.php", 3, "../image/zknuli.png"),
    new LinkDiv("洛谷", "https://www.luogu.com.cn/", 4, "../image/luogu.png"),
    new LinkDiv("Github", "https://github.com/", 5, "../image/git.png"),
    new LinkDiv("MikuTools", "https://tools.miku.ac/", 6, "../image/绘制网站 Logo.png"),
    new LinkDiv("ChatGPT", "https://chatgpt.com/", 7, "../image/chatgpt.png"),
    new LinkDiv("抖音", "https://www.douyin.com/", 8, "../image/douyin.png"),
    new LinkDiv("Dog-鸽了", "javascript:void(0)", 9, "../image/dog.webp")
];

let linkList = [];
let currentEditId = null;           // 正在编辑的链接ID
let currentPage = 1;
const itemsPerPage = 7;

// DOM 元素
const addButton = document.getElementById('addButton');
const pgupButton = document.getElementById('pgupButton');
const pgdownButton = document.getElementById('pgdownButton');
const linkListContainer = document.getElementById('linkListContainer');
const nameInput = document.getElementById('newLinkName');
const urlInput = document.getElementById('newLinkURL');
const imgInput = document.getElementById('newLinkImg');

// ==================== 辅助函数 ====================
function addNotice(message, isGood = true) {
    const notice = document.querySelector(".notice");
    notice.textContent = message;
    notice.style.color = isGood ? '#4caf50' : '#f44336';
    console.log("显示通知：", message);
    setTimeout(() => {
        notice.textContent = "";
    }, 3000);
}

// 重新索引所有链接 (保证id与数组索引一致)
function reindexLinkList() {
    linkList.forEach((item, index) => { item.id = index; });
}

// 保存到 localStorage
function saveLinkList() {
    localStorage.setItem('linkList', JSON.stringify(linkList));
    console.log("保存链接列表：", linkList);
}

// 加载数据
function loadLinkList() {
    try {
        const stored = localStorage.getItem('linkList');
        if (stored) {
            const plainList = JSON.parse(stored);
            linkList = plainList.map(item => new LinkDiv(item.name, item.url, item.id, item.imgPath));
        } else {
            linkList = DefaultLinkList.map(item => new LinkDiv(item.name, item.url, item.id, item.imgPath));
        }
        reindexLinkList();
    } catch (e) {
        console.warn("加载失败，使用默认列表", e);
        linkList = DefaultLinkList.map(item => new LinkDiv(item.name, item.url, item.id, item.imgPath));
        reindexLinkList();
    }
    console.log("加载链接列表完成，当前数量:", linkList.length);
}

// ==================== 渲染编辑列表 (分页) ====================
function renderEditList() {
    const totalPages = Math.ceil(linkList.length / itemsPerPage) || 1;
    if (currentPage > totalPages) currentPage = totalPages;
    if (currentPage < 1) currentPage = 1;

    const start = (currentPage - 1) * itemsPerPage;
    const end = Math.min(start + itemsPerPage, linkList.length);
    const pageItems = linkList.slice(start, end);

    // 生成HTML
    let html = '';
    pageItems.forEach(item => { html += item.editViewHTML(); });

    // 添加页码指示
    html += `<div class="page-indicator">第 ${currentPage} / ${totalPages} 页 (共 ${linkList.length} 项)</div>`;
    linkListContainer.innerHTML = html;

    // 更新按钮状态
    pgupButton.style.opacity = currentPage <= 1 ? '0.5' : '1';
    pgupButton.style.pointerEvents = currentPage <= 1 ? 'none' : 'auto';
    pgdownButton.style.opacity = currentPage >= totalPages ? '0.5' : '1';
    pgdownButton.style.pointerEvents = currentPage >= totalPages ? 'none' : 'auto';

    // 重新绑定移动按钮的禁用状态 (通过事件委托即可，但这里为了视觉反馈)
    document.querySelectorAll('.move-up-btn').forEach(btn => {
        const id = parseInt(btn.dataset.id);
        btn.disabled = (id === 0);
    });
    document.querySelectorAll('.move-down-btn').forEach(btn => {
        const id = parseInt(btn.dataset.id);
        btn.disabled = (id === linkList.length - 1);
    });
}

// ==================== 重置添加表单 ====================
function resetAddForm() {
    nameInput.value = '';
    urlInput.value = '';
    imgInput.value = '';
    addButton.innerHTML = '<span class="buttonText" style="font-size: 30px;">确认添加</span>';
    currentEditId = null;
}

// ==================== 填充表单用于编辑 ====================
function fillFormForEdit(id) {
    const item = linkList[id];
    if (!item) return;
    nameInput.value = item.name;
    urlInput.value = item.url;
    imgInput.value = item.imgPath;
    addButton.innerHTML = '<span class="buttonText" style="font-size: 30px;">确认修改</span>';
    currentEditId = id;
}

// ==================== 提交处理 (添加/修改) ====================
function handleSubmit() {
    const name = nameInput.value.trim();
    let url = urlInput.value.trim();
    const imgPath = imgInput.value.trim();

    if (!name) {
        addNotice("网站名称不能为空", false);
        return;
    }
    if (!url) {
        addNotice("网站链接不能为空", false);
        return;
    }
    // 简单补全协议
    if (!/^https?:\/\//i.test(url) && !url.startsWith('javascript:')) {
        url = 'https://' + url;
    }

    if (currentEditId !== null) {
        // 编辑模式
        const target = linkList[currentEditId];
        if (target) {
            target.set(name, url, imgPath);
            addNotice(`链接 “${name}” 已更新`);
        }
        resetAddForm();
    } else {
        // 添加模式
        const newId = linkList.length;
        const newLink = new LinkDiv(name, url, newId, imgPath);
        linkList.push(newLink);
        addNotice(`新链接 “${name}” 已添加`);
        resetAddForm();
        // 添加后跳转到最后一页，方便查看
        currentPage = Math.ceil(linkList.length / itemsPerPage);
    }

    reindexLinkList();
    saveLinkList();
    renderEditList();
}

// ==================== 删除处理 ====================
function handleDelete(id) {
    if (id < 0 || id >= linkList.length) return;
    const name = linkList[id].name;
    if (confirm(`确定要删除 “${name}” 吗？`)) {
        linkList.splice(id, 1);
        reindexLinkList();
        saveLinkList();
        addNotice(`已删除 “${name}”`);

        // 调整当前页码 (如果当前页变空)
        const totalPages = Math.ceil(linkList.length / itemsPerPage) || 1;
        if (currentPage > totalPages) currentPage = totalPages;

        renderEditList();
        // 如果之前正在编辑的是被删除的项，清空编辑状态
        if (currentEditId === id) resetAddForm();
        else if (currentEditId > id) currentEditId--; // 索引前移
    }
}

// ==================== 移动处理 (上移/下移) ====================
function moveItem(id, direction) {
    if (direction === 'up' && id > 0) {
        [linkList[id - 1], linkList[id]] = [linkList[id], linkList[id - 1]];
    } else if (direction === 'down' && id < linkList.length - 1) {
        [linkList[id], linkList[id + 1]] = [linkList[id + 1], linkList[id]];
    } else {
        return;
    }
    reindexLinkList();
    saveLinkList();
    renderEditList();
    addNotice(`已调整顺序`);
    // 如果正在编辑的项移动了，更新currentEditId
    if (currentEditId !== null) {
        if (direction === 'up' && currentEditId === id) currentEditId = id - 1;
        else if (direction === 'up' && currentEditId === id - 1) currentEditId = id;
        else if (direction === 'down' && currentEditId === id) currentEditId = id + 1;
        else if (direction === 'down' && currentEditId === id + 1) currentEditId = id;
    }
}

// ==================== 事件委托 (编辑列表操作) ====================
linkListContainer.addEventListener('click', (e) => {
    const target = e.target.closest('button');
    if (!target) return;

    const id = parseInt(target.dataset.id);
    if (isNaN(id)) return;

    if (target.classList.contains('edit-btn')) {
        fillFormForEdit(id);
    } else if (target.classList.contains('delete-btn')) {
        handleDelete(id);
    } else if (target.classList.contains('move-up-btn')) {
        moveItem(id, 'up');
    } else if (target.classList.contains('move-down-btn')) {
        moveItem(id, 'down');
    }
});

// ==================== 分页按钮 ====================
pgupButton.addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderEditList();
    }
});

pgdownButton.addEventListener('click', () => {
    const totalPages = Math.ceil(linkList.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderEditList();
    }
});

// ==================== 添加/修改按钮 ====================
addButton.addEventListener('click', handleSubmit);

// 可选：提供一个取消编辑的快捷方式（点击空白或按ESC，这里简化，用户可手动清空表单）
// 但为了体验，添加一个隐藏取消？不强制，用户再次添加时会自动覆盖。

// ==================== 初始化 ====================
function init() {
    loadLinkList();
    renderEditList();
    resetAddForm();
    console.log("狗代码加载完成！当前链接数:", linkList.length);
}

// 当DOM准备就绪
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}

// 导出一部分函数供调试 (可选)
window.debugLinkList = () => linkList;