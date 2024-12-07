// 用於檢測 URL 變動並初始化腳本
function addLocationObserver(callback) {
    const config = { childList: true, subtree: true };
    const observer = new MutationObserver(callback);
    observer.observe(document.body, config);
}

// 主觀察回調，檢查 URL 並初始化頁面更新
function observerCallback() {
    if (window.location.href.startsWith('https://ani.gamer.com.tw/animeList.php') ||
        window.location.href.startsWith('https://ani.gamer.com.tw/search.php')) {
        initContentScript();
    }
}

// 初始化內容腳本功能
function initContentScript() {
    addBlackFilterToContainerImages();

    // 監測 DOM 變化並更新愛心
    const domObserver = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                addBlackFilterToContainerImages(); // 在新增節點時更新愛心
            }
        });
    });

    // 開始監測整個 body 的變化
    domObserver.observe(document.body, { childList: true, subtree: true });
}

function addBlackFilterToContainerImages() {
    // 提取每一個動畫物件
    const containerLinks = document.querySelectorAll(".theme-list-main");

    containerLinks.forEach((link) => {
        const href = link.getAttribute("href");
        const snMatch = href.match(/sn=(\d+)/); // 提取 sn 的數字部分
        if (!snMatch) return;
        const sn = snMatch[1];
        let isDisliked = localStorage.getItem(`disliked-${sn}`);

        // 根據 localStorage 的紀錄設置灰階效果
        const img = link.querySelector(".theme-img");
        img.style.filter = isDisliked ? "grayscale(100%)" : "none";
        img.style.opacity = isDisliked ? "0.1" : "1";

        const container = link.querySelector(".theme-img-block");

        if (!container.querySelector(".custom-button")) {
            const button = document.createElement("button");
            button.classList.add("custom-button");
            button.style.position = "absolute";
            button.style.top = "35px";
            button.style.right = "5px";
            button.style.zIndex = "10";
            button.style.backgroundColor = "transparent";
            button.style.border = "none";
            button.style.cursor = "pointer";
            button.style.pointerEvents = "auto";
            img.style.pointerEvents = "none";

            const downvoteIcon = document.createElement("i");
            downvoteIcon.style.color = "gray";
            downvoteIcon.style.fontSize = "24px";
            downvoteIcon.textContent = "X";

            button.appendChild(downvoteIcon);

            button.addEventListener("mouseover", () => {
                downvoteIcon.style.color = "#FF6F61";
            });
            button.addEventListener("mouseout", () => {
                downvoteIcon.style.color = isDisliked ? "#FF6F61" : "gray";
            });

            button.addEventListener("click", (event) => {
                event.stopPropagation();
                event.preventDefault();

                // 切換倒讚狀態
                isDisliked = !isDisliked;

                if (isDisliked) {
                    localStorage.setItem(`disliked-${sn}`, "true");
                    downvoteIcon.style.color = "#FF6F61";
                    console.log("倒讚");
                } else {
                    localStorage.removeItem(`disliked-${sn}`);
                    downvoteIcon.style.color = "gray";
                    console.log("取消倒讚");
                }

                // 更新圖片樣式
                updateImageStyle(img, isDisliked);
            });

            container.appendChild(button);
        }
    });
}
// 更新圖片的樣式
function updateImageStyle(img, isDisliked) {
    // 根據當前狀態更新圖片樣式
    img.style.filter = isDisliked ? "grayscale(100%)" : "none";
    img.style.opacity = isDisliked ? "0.1" : "1";
}

// 啟動 URL 觀察器並立即檢查
addLocationObserver(observerCallback);
observerCallback();
