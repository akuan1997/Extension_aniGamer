// 用於檢測 URL 變動並初始化腳本
function addLocationObserver(callback) {
    const config = { childList: true, subtree: true };
    const observer = new MutationObserver(callback);
    observer.observe(document.body, config);
}

// 主觀察回調，檢查 URL 並初始化頁面更新
function observerCallback() {
    if (window.location.href.startsWith('https://ani.gamer.com.tw/animeList.php')) {
        initContentScript();
    }
}

// 初始化內容腳本功能
function initContentScript() {
    addBlackFilterToContainerImages();
    // addTriangleBelowFavorites();

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
    const containerImages = document.querySelectorAll(".theme-img-block img");

    containerImages.forEach((img) => {
        const imageId = img.getAttribute("data-src") || img.getAttribute("src");
        let isDisliked = localStorage.getItem(`disliked-${imageId}`);

        // 根據 localStorage 的紀錄設置灰階效果
        img.style.filter = isDisliked ? "grayscale(100%)" : "none";
        img.style.opacity = isDisliked ? "0.15" : "1";

        const container = img.closest(".theme-img-block");

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
            downvoteIcon.style.fontSize = "24px"; // 調整字體大小
            downvoteIcon.textContent = "X"; // 使用 "X" 代替 thumb_down 圖標

            button.appendChild(downvoteIcon);

            button.addEventListener("mouseover", () => {
                downvoteIcon.style.color = "#FF6F61"; // 懸停時顯示為紅色
            });
            button.addEventListener("mouseout", () => {
                downvoteIcon.style.color = isDisliked ? "#FF6F61" : "gray"; // 恢復顏色
            });

            button.addEventListener("click", (event) => {
                event.stopPropagation();
                event.preventDefault();

                // 切換倒讚狀態
                isDisliked = !isDisliked;

                if (isDisliked) {
                    // 設定倒讚狀態
                    localStorage.setItem(`disliked-${imageId}`, "true");
                    downvoteIcon.style.color = "#FF6F61"; // 改為紅色
                    console.log("倒讚");
                } else {
                    // 取消倒讚狀態
                    localStorage.removeItem(`disliked-${imageId}`);
                    downvoteIcon.style.color = "gray"; // 恢復灰色
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
    img.style.opacity = isDisliked ? "0.15" : "1";
}

// 啟動 URL 觀察器並立即檢查
addLocationObserver(observerCallback);
observerCallback();
