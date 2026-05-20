class LinkDiv{
    constructor(name,url,id,imgPath){
        this.name = name;
        this.url = url;
        this.id = id;
        this.imgPath = imgPath;
        console.log("新增的链接：", this.name, this.url, this.id, this.imgPath);
    }
    printHTML(){
        console.log("打印链接：", this.name, this.url, this.id, this.imgPath);
        return `<a href="${this.url}">
            <div>
                <img src="${this.imgPath}" alt=""><br> <span lang="en">*${this.name}</span> 
            </div>
        </a>`;
    }
}
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
const loadLinkList = () => {
  try {
    const list = JSON.parse(localStorage.getItem('linkList')) || DefaultLinkList;
    return list.map(i => new LinkDiv(i.name, i.url, i.id, i.imgPath));
  } catch {
    return DefaultLinkList.map(i => new LinkDiv(i.name, i.url, i.id, i.imgPath));
  }
};

function displayLinkList(linkList,container){
    container.innerHTML = linkList.map(i => i.printHTML()).join('');
}
let linkList = loadLinkList();
displayLinkList(linkList,document.querySelector(".ptr"));

const searchForm = document.getElementById("searchForm");
const searchEngine = document.getElementById("searchEngine");
const searchInput = document.getElementById("searchInput");
const bingSearchShell = document.getElementById("bingSearchShell");
const suggestionsList = document.getElementById("searchSuggestions");

const engineConfig = {
    bing: {
        action: "https://cn.bing.com/search",
        inputName: "q",
        placeholder: "在 Bing 中搜索...",
        suggestType: "fetch",
        suggestUrl: (query) =>
            `https://api.bing.com/osjson.aspx?query=${encodeURIComponent(query)}`,
        parseResponse: (data) => {
            if (Array.isArray(data) && data.length >= 2 && Array.isArray(data[1])) {
                return data[1];
            }
            return [];
        },
    },
    google: {
        action: "https://www.google.com/search",
        inputName: "q",
        placeholder: "在 Google 中搜索...",
        suggestType: "fetch",
        suggestUrl: (query) =>
            `https://suggestqueries.google.com/complete/search?client=chrome&q=${encodeURIComponent(query)}`,
        parseResponse: (data) => {
            if (Array.isArray(data) && data.length >= 2 && Array.isArray(data[1])) {
                return data[1];
            }
            return [];
        },
    },
    baidu: {
        action: "https://www.baidu.com/s",
        inputName: "wd",
        placeholder: "在 Baidu 中搜索...",
        suggestType: "fetch",
        suggestUrl: (query) =>
            `https://suggestion.baidu.com/su?wd=${encodeURIComponent(query)}&ie=utf-8`,
        parseResponse: (text) => {
            // 提取 window.baidu.sug({...}) 里的 {...}
            const match = text.match(/window.baidu.sug\((.*)\);?/);
            if (match && match[1]) {
                try {
                    const obj = JSON.parse(match[1]);
                    return obj && Array.isArray(obj.s) ? obj.s : [];
                } catch (e) {
                    return [];
                }
            }
            return [];
        },
    },
    github: {
        action: "https://github.com/search",
        inputName: "q",
        placeholder: "在 GitHub 中搜索...",
        suggestType: "fetch",
        suggestUrl: (query) =>
            `https://api.github.com/search/repositories?q=${encodeURIComponent(query)}+in:name&per_page=8&sort=stars&order=desc`,
        parseResponse: (data) => {
            if (data && Array.isArray(data.items)) {
                return data.items.map((item) => item.full_name);
            }
            return [];
        },
    },
};

function updateSearchEngine(engine) {
    const config = engineConfig[engine] || engineConfig.bing;
    searchForm.action = config.action;
    searchInput.name = config.inputName;
    searchInput.placeholder = config.placeholder;
}

searchEngine.addEventListener("change", (event) => {
    updateSearchEngine(event.target.value);
    hideSuggestions();
    if (fetchAbortController) fetchAbortController.abort();
    cleanupAllJsonp();
    const q = searchInput.value.trim();
    if (q.length > 0) {
        getSuggestions(q);
    }
});

updateSearchEngine(searchEngine.value);

/* ----- 搜索联想（参考关键词 API：防抖 / JSONP / fetch / 键盘导航） ----- */

let highlightedIndex = -1;
let suggestionItems = [];
let requestId = 0;
let jsonpScripts = [];
let fetchAbortController = null;

function debounce(fn, delay) {
    let timer = null;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}

function getCurrentEngineKey() {
    return searchEngine.value;
}

function renderSuggestions(items, query) {
    suggestionItems = items;
    highlightedIndex = -1;
    suggestionsList.innerHTML = "";

    if (items.length === 0) {
        suggestionsList.innerHTML =
            '<li class="search-suggestion-status">— 暂无联想词 —</li>';
        suggestionsList.removeAttribute("hidden");
        suggestionsList.setAttribute("aria-hidden", "false");
        bingSearchShell.classList.add("bing-search-shell--open");
        return;
    }

    const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escapedQuery})`, "gi");

    items.forEach((item, index) => {
        const li = document.createElement("li");
        li.className = "search-suggestion-item";
        li.setAttribute("role", "option");
        li.setAttribute("data-index", String(index));

        const highlightedText = item.replace(
            regex,
            '<span class="highlight-match">$1</span>'
        );
        li.innerHTML = `<span class="sug-icon" aria-hidden="true">*</span><span class="sug-text">${highlightedText}</span>`;

        li.addEventListener("click", () => {
            searchInput.value = item;
            hideSuggestions();
            submitSearch();
        });

        li.addEventListener("mouseenter", () => {
            highlightedIndex = index;
            updateHighlight();
        });

        suggestionsList.appendChild(li);
    });

    suggestionsList.removeAttribute("hidden");
    suggestionsList.setAttribute("aria-hidden", "false");
    bingSearchShell.classList.add("bing-search-shell--open");
}

function updateHighlight() {
    const nodes = suggestionsList.querySelectorAll(".search-suggestion-item");
    nodes.forEach((node, i) => {
        if (i === highlightedIndex) {
            node.classList.add("highlighted");
            node.scrollIntoView({ block: "nearest" });
        } else {
            node.classList.remove("highlighted");
        }
    });
}

function showLoading() {
    suggestionItems = [];
    highlightedIndex = -1;
    suggestionsList.innerHTML =
        '<li class="search-suggestion-status">正在获取联想词...</li>';
    suggestionsList.removeAttribute("hidden");
    suggestionsList.setAttribute("aria-hidden", "false");
    bingSearchShell.classList.add("bing-search-shell--open");
}

function showError(message) {
    suggestionItems = [];
    highlightedIndex = -1;
    suggestionsList.innerHTML = `<li class="search-suggestion-status error">${message}</li>`;
    suggestionsList.removeAttribute("hidden");
    suggestionsList.setAttribute("aria-hidden", "false");
    bingSearchShell.classList.add("bing-search-shell--open");
    setTimeout(() => {
        if (suggestionsList.querySelector(".search-suggestion-status.error")) {
            hideSuggestions();
        }
    }, 3000);
}

function hideSuggestions() {
    bingSearchShell.classList.remove("bing-search-shell--open");
    suggestionsList.innerHTML = "";
    suggestionsList.setAttribute("hidden", "");
    suggestionsList.setAttribute("aria-hidden", "true");
    suggestionItems = [];
    highlightedIndex = -1;
}

// 移除 JSONP 相关函数
function cleanupAllJsonp() {
    // 兼容旧调用，现无实际作用
    jsonpScripts = [];
    requestId++;
}

async function fetchSuggestionsFetch(url, parseFn, query) {
    if (fetchAbortController) {
        fetchAbortController.abort();
    }
    const currentRequestId = ++requestId;
    const controller = new AbortController();
    fetchAbortController = controller;

    try {
        const response = await fetch(url, {
            signal: controller.signal,
            // Accept 头部根据 API 类型调整
        });

        if (currentRequestId !== requestId) return;

        if (!response.ok) {
            if (response.status === 429) {
                showError("请求过于频繁，请稍后再试");
            } else if (response.status === 403) {
                showError("无法访问该 API");
            } else {
                showError(`请求失败 (${response.status})`);
            }
            return;
        }

        // 百度返回文本，谷歌/GitHub等返回 JSON
        let data;
        if (url.includes('baidu.com/su')) {
            data = await response.text();
        } else {
            data = await response.json();
        }
        if (currentRequestId !== requestId) return;

        const items = parseFn(data);
        renderSuggestions(items, query);
    } catch (err) {
        if (err.name === "AbortError") return;
        if (currentRequestId !== requestId) return;
        console.error("联想词 fetch 失败:", err);
        showError("网络请求失败");
    }
}

const getSuggestions = debounce(function (query) {
    const trimmed = query.trim();
    if (trimmed.length === 0) {
        hideSuggestions();
        return;
    }

    const engine = getCurrentEngineKey();
    const config = engineConfig[engine] || engineConfig.bing;
    showLoading();

    if (config.suggestType === "fetch") {
        fetchSuggestionsFetch(
            config.suggestUrl(trimmed),
            config.parseResponse,
            trimmed
        );
    }
}, 350);

function submitSearch() {
    if (!searchInput.value.trim()) return;
    hideSuggestions();
    searchForm.requestSubmit();
}

searchInput.addEventListener("input", function () {
    const query = this.value;
    if (query.trim().length > 0) {
        getSuggestions(query);
    } else {
        hideSuggestions();
        requestId++;
        if (fetchAbortController) fetchAbortController.abort();
    }
});

searchInput.addEventListener("keydown", function (e) {
    const listOpen =
        !suggestionsList.hasAttribute("hidden") &&
        suggestionsList.innerHTML.length > 0;
    const itemCount = suggestionItems.length;

    switch (e.key) {
        case "ArrowDown":
            e.preventDefault();
            if (listOpen && itemCount > 0) {
                highlightedIndex = Math.min(highlightedIndex + 1, itemCount - 1);
                updateHighlight();
                if (highlightedIndex >= 0 && suggestionItems[highlightedIndex]) {
                    searchInput.value = suggestionItems[highlightedIndex];
                }
            } else if (this.value.trim().length > 0) {
                getSuggestions(this.value);
            }
            break;

        case "ArrowUp":
            e.preventDefault();
            if (listOpen && itemCount > 0 && highlightedIndex > 0) {
                highlightedIndex--;
                updateHighlight();
                if (suggestionItems[highlightedIndex]) {
                    searchInput.value = suggestionItems[highlightedIndex];
                }
            } else if (highlightedIndex === 0) {
                highlightedIndex = -1;
                updateHighlight();
            }
            break;

        case "Escape":
            hideSuggestions();
            break;

        case "Enter":
            if (
                listOpen &&
                highlightedIndex >= 0 &&
                suggestionItems[highlightedIndex]
            ) {
                e.preventDefault();
                searchInput.value = suggestionItems[highlightedIndex];
                hideSuggestions();
                submitSearch();
            }
            break;

        default:
            break;
    }
});

searchForm.addEventListener("submit", () => {
    hideSuggestions();
});

function isSuggestionsOpen() {
    return (
        !suggestionsList.hasAttribute("hidden") &&
        suggestionsList.innerHTML.length > 0
    );
}

bingSearchShell.addEventListener(
    "wheel",
    function (e) {
        if (!isSuggestionsOpen()) return;

        const panel = suggestionsList;
        if (panel.scrollHeight <= panel.clientHeight) return;

        let dy = e.deltaY;
        if (e.deltaMode === 1) dy *= 16;
        else if (e.deltaMode === 2) dy *= panel.clientHeight;

        const maxScroll = panel.scrollHeight - panel.clientHeight;
        const nextTop = Math.min(
            maxScroll,
            Math.max(0, panel.scrollTop + dy)
        );

        const atTop = panel.scrollTop <= 0;
        const atBottom = panel.scrollTop >= maxScroll - 1;
        const scrollingUp = dy < 0;
        const scrollingDown = dy > 0;

        if (scrollingUp && atTop) return;
        if (scrollingDown && atBottom) return;

        e.preventDefault();
        panel.scrollTop = nextTop;
    },
    { passive: false }
);

document.addEventListener("click", function (e) {
    if (bingSearchShell && !bingSearchShell.contains(e.target)) {
        hideSuggestions();
    }
});

const searchTimeEl = document.getElementById("searchTime");

function formatClockTime(date) {
    const h = String(date.getHours()).padStart(2, "0");
    const m = String(date.getMinutes()).padStart(2, "0");
    return `${h}:${m}`;
}

function updateSearchTime() {
    if (!searchTimeEl) return;
    const now = new Date();
    const text = formatClockTime(now);
    searchTimeEl.textContent = text;
    searchTimeEl.dateTime = now.toISOString();
}

if (searchTimeEl) {
    updateSearchTime();
    const msToNextMinute =
        (60 - new Date().getSeconds()) * 1000 - new Date().getMilliseconds();
    setTimeout(() => {
        updateSearchTime();
        setInterval(updateSearchTime, 60_000);
    }, msToNextMinute);
}
