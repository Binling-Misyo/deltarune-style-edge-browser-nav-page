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
