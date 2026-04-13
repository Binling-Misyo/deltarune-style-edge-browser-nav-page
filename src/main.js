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

function updateLinkList(linkList,container){
    container.innerHTML = linkList.map(i => i.printHTML()).join('');
}
let linkList = loadLinkList();
updateLinkList(linkList,document.querySelector(".ptr"));

const searchForm = document.getElementById("searchForm");
const searchEngine = document.getElementById("searchEngine");
const searchInput = document.getElementById("searchInput");

const engineConfig = {
    bing: {
        action: "https://cn.bing.com/search",
        inputName: "q",
        placeholder: "在 Bing 中搜索..."
    },
    google: {
        action: "https://www.google.com/search",
        inputName: "q",
        placeholder: "在 Google 中搜索..."
    },
    baidu: {
        action: "https://www.baidu.com/s",
        inputName: "wd",
        placeholder: "在 Baidu 中搜索..."
    },
    github: {
        action: "https://github.com/search",
        inputName: "q",
        placeholder: "在 GitHub 中搜索..."
    }
};

function updateSearchEngine(engine) {
    const config = engineConfig[engine] || engineConfig.bing;
    searchForm.action = config.action;
    searchInput.name = config.inputName;
    searchInput.placeholder = config.placeholder;
}

searchEngine.addEventListener("change", (event) => {
    updateSearchEngine(event.target.value);
});

updateSearchEngine(searchEngine.value);
