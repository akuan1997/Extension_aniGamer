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
            // 如果愛心未打勾，表示該項目可能評分低或不受歡迎，讓圖片變為全黑
            img.style.filter = "grayscale(100%)"; // 將圖片變為全黑
            img.style.opacity = "0.15"; // 降低透明度，使其更不明顯，表示不好看或不受歡迎

            // 檢查是否已經存在警告文本
            let warningText = img.parentNode.querySelector(".warning-text");
            if (!warningText) {
                // 如果不存在，創建一個新的文本元素
                warningText = document.createElement("div");
                warningText.classList.add("warning-text"); // 設置類名以便於查找
                warningText.textContent = "這個項目不好看，評分低"; // 您可以自定義這裡的文字
                warningText.style.color = "red"; // 設置文字顏色
                warningText.style.fontSize = "50px"; // 設置文字大小
                warningText.style.textAlign = "center"; // 文字居中對齊

                // 將文本元素添加到圖片的父容器中
                img.parentNode.appendChild(warningText);
            }
        } else {
            img.style.filter = "none"; // 如果愛心已打勾，則不改變圖片顏色
            img.style.opacity = "1"; // 恢復透明度，表示受歡迎或好看

            // 如果之前添加了警告文字，則將其移除
            const existingWarning = img.parentNode.querySelector(".warning-text");
            if (existingWarning) {
                img.parentNode.removeChild(existingWarning);
            }
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
