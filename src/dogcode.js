console.log("狗代码开始加载...");
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
    console.log("加载链接列表：", list);
    return list.map(i => new LinkDiv(i.name, i.url, i.id, i.imgPath));
  } catch {
    console.log("加载链接列表失败，使用默认列表");
    return DefaultLinkList.map(i => new LinkDiv(i.name, i.url, i.id, i.imgPath));
  }
};
let linkList = loadLinkList();
function displayLinkList(linkList,container){
    container.innerHTML = linkList.map(i => i.printHTML()).join('');
    console.log("显示链接列表：", linkList);
}

function getNewLink(){
    const name = document.getElementById("newLinkName").value;
    console.log("获取新链接名称：", name);
    const url = document.getElementById("newLinkURL").value;
    console.log("获取新链接URL：", url);
    const imgPath = document.getElementById("newLinkImg").value || "../image/dog.webp";
    console.log("获取新链接图标路径：", imgPath);
    return new LinkDiv(name, url, linkList.length, imgPath);
}
function saveLinkList(){
    localStorage.setItem('linkList', JSON.stringify(linkList));
    addNotice("新链接已保存！");
    console.log("保存链接列表：", linkList);
}
function submitNewLink(){
    const newLink = getNewLink();
    linkList.push(newLink);
    saveLinkList();
    console.log("提交新链接：", newLink);
}
function addNotice(message){
    const notice = document.querySelector(".notice");
    notice.textContent = message;
    console.log("显示通知：", message);
    setTimeout(() => {
        notice.textContent = "";
        console.log("清除通知");
    }, 3000);
}
const addButton = document.getElementById('addButton');
console.log('添加按钮：'+addButton)
addButton.addEventListener('click',submitNewLink)
console.log("狗代码加载完成！");