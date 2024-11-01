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

        // 確保圖片的父元素是正確的容器
        const container = img.parentNode;

        // 確保父容器有相對定位
        container.style.position = "relative";

        // 檢查是否已經添加按鈕
        if (!container.querySelector(".custom-button")) {
            // 創建按鈕元素
            const button = document.createElement("button");
            button.classList.add("custom-button"); // 添加類名以便查找
            button.style.position = "absolute"; // 絕對定位
            button.style.top = "40px"; // 距離上 ?px
            button.style.right = "3px"; // 距離右 ?px
            button.style.zIndex = "10"; // 確保按鈕在最上層
            button.style.backgroundColor = "transparent"; // 透明背景
            button.style.border = "none"; // 去掉邊框
            button.style.cursor = "pointer"; // 指針樣式
            button.style.pointerEvents = "auto"; // 啟用按鈕的點擊事件
            img.style.pointerEvents = "none"; // 禁用圖片的點擊事件

            // 添加倒讚圖標
            const downvoteIcon = document.createElement("i");
            downvoteIcon.className = "material-icons"; // 使用 Material Icons
            downvoteIcon.style.color = "gray"; // 初始顏色
            downvoteIcon.textContent = "thumb_down"; // 倒讚圖標

            button.appendChild(downvoteIcon); // 將圖標添加到按鈕中

            // 添加鼠標懸停事件以改變顏色
            button.addEventListener("mouseover", () => {
                downvoteIcon.style.color = "red"; // 懸停時顯示為紅色
                console.log("滑鼠停留倒讚按鈕！"); // 這裡可以執行其他動作
            });

            button.addEventListener("mouseout", () => {
                downvoteIcon.style.color = "gray"; // 恢復為黑色
                console.log("滑鼠離開倒讚按鈕！"); // 這裡可以執行其他動作
            });

            // 添加點擊事件以執行某些操作
            button.addEventListener("click", (event) => {
                event.stopPropagation(); // 防止事件冒泡
                event.preventDefault(); // 阻止圖片的默認點擊行為
                console.log("倒讚按鈕被點擊！"); // 這裡可以執行其他動作

                // 暫停三秒後執行的操作
                setTimeout(() => {
                    console.log("三秒已過，執行後續操作");
                    // 在這裡添加您的後續代碼
                }, 3000); // 三秒 = 3000毫秒
            });

            // 將按鈕添加到圖片的父容器中
            container.appendChild(button);
        }
    });
}

// 啟動 URL 觀察器並立即檢查
addLocationObserver(observerCallback);
observerCallback();
