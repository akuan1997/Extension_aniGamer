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
    addHeartBelowFavorites();

    // 監測 DOM 變化並更新愛心
    const domObserver = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                addHeartBelowFavorites(); // 在新增節點時更新愛心
            }
        });
    });

    // 開始監測整個 body 的變化
    domObserver.observe(document.body, { childList: true, subtree: true });
}

// function addBlackFilterToContainerImages() {
//     const containerImages = document.querySelectorAll(".container img");
//     containerImages.forEach(img => {
//         img.style.filter = "grayscale(100%)"; // 將圖片變為全黑
//     });
// }

function addBlackFilterToContainerImages() {
    const containerImages = document.querySelectorAll(".container img");
    const favoriteButtons = document.querySelectorAll(".btn-card-block.btn-favorite");

    containerImages.forEach((img, index) => {
        // 檢查對應的愛心按鈕是否為打勾狀態
        if (favoriteButtons[index] && !favoriteButtons[index].classList.contains("btn-is-active")) {
            img.style.filter = "grayscale(100%)"; // 將圖片變為全黑
            img.style.opacity = "0.15"; // 降低透明度，使其更不明顯
        } else {
            img.style.filter = "none"; // 如果愛心已打勾，則不改變圖片顏色
            img.style.opacity = "1"; // 恢復透明度
        }
    });
}

// 在每個愛心按鈕下方新增一個愛心
function addHeartBelowFavorites() {
    const favoriteButtons = document.querySelectorAll(".btn-card-block.btn-favorite");

    favoriteButtons.forEach(button => {
        // 檢查是否已有愛心存在，避免重複添加
        const existingHeart = button.nextSibling;
        if (!existingHeart || !existingHeart.classList.contains("additional-heart")) {
            // 創建新的愛心元素
            const newHeart = document.createElement("div");
            newHeart.classList.add("additional-heart");
            newHeart.style.display = "flex";
            newHeart.style.justifyContent = "center";
            newHeart.style.marginTop = "5px";
            newHeart.innerHTML = "<i class='material-icons' style='color: red;'>favorite</i>"; // 使用 Material Icons 顯示愛心

            // 將新愛心插入到現有愛心按鈕的下一個兄弟節點下方
            button.parentNode.insertBefore(newHeart, existingHeart ? existingHeart.nextSibling : button.nextSibling);
        }
    });
    console.log("頁面內容已更新。");
}

// 啟動 URL 觀察器並立即檢查
addLocationObserver(observerCallback);
observerCallback();
