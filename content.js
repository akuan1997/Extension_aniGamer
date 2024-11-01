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

// function addBlackFilterToContainerImages() {
//     const containerImages = document.querySelectorAll(".container img");
//     const favoriteButtons = document.querySelectorAll(".btn-card-block.btn-favorite");
//
//     containerImages.forEach((img, index) => {
//         const imageId = img.getAttribute("data-src") || img.getAttribute("src"); // 使用 data-src 或 src 作為唯一標識符
//         const isDisliked = localStorage.getItem(`disliked-${imageId}`); // 檢查 localStorage 中是否已經被倒讚
//
//         // 檢查對應的愛心按鈕是否為打勾狀態
//         if (favoriteButtons[index] && !favoriteButtons[index].classList.contains("btn-is-active")) {
//             img.style.filter = "grayscale(100%)"; // 將圖片變為全黑
//             img.style.opacity = "0.15"; // 降低透明度，使其更不明顯
//         } else {
//             img.style.filter = "none"; // 如果愛心已打勾，則不改變圖片顏色
//             img.style.opacity = "1"; // 恢復透明度
//         }
//
//         // 確保圖片的父元素是正確的容器
//         const container = img.parentNode;
//
//         // 確保父容器有相對定位
//         container.style.position = "relative";
//
//         // 檢查是否已經添加按鈕
//         if (!container.querySelector(".custom-button")) {
//             // 創建按鈕元素
//             const button = document.createElement("button");
//             button.classList.add("custom-button"); // 添加類名以便查找
//             button.style.position = "absolute"; // 絕對定位
//             button.style.top = "40px"; // 距離上 ?px
//             button.style.right = "3px"; // 距離右 ?px
//             button.style.zIndex = "10"; // 確保按鈕在最上層
//             button.style.backgroundColor = "transparent"; // 透明背景
//             button.style.border = "none"; // 去掉邊框
//             button.style.cursor = "pointer"; // 指針樣式
//             button.style.pointerEvents = "auto"; // 啟用按鈕的點擊事件
//             img.style.pointerEvents = "none"; // 禁用圖片的點擊事件
//
//             // 添加倒讚圖標
//             const downvoteIcon = document.createElement("i");
//             downvoteIcon.className = "material-icons"; // 使用 Material Icons
//             downvoteIcon.style.color = "gray"; // 初始顏色
//             downvoteIcon.textContent = "thumb_down"; // 倒讚圖標
//
//             button.appendChild(downvoteIcon); // 將圖標添加到按鈕中
//
//             // 添加鼠標懸停事件以改變顏色
//             button.addEventListener("mouseover", () => {
//                 downvoteIcon.style.color = "#FF6F61"; // 懸停時顯示為紅色
//                 console.log("滑鼠停留倒讚按鈕！"); // 這裡可以執行其他動作
//             });
//
//             button.addEventListener("mouseout", () => {
//                 downvoteIcon.style.color = "gray"; // 恢復為黑色
//                 console.log("滑鼠離開倒讚按鈕！"); // 這裡可以執行其他動作
//             });
//
//             // 事件：點擊倒讚
//             button.addEventListener("click", (event) => {
//                 event.stopPropagation();
//                 event.preventDefault();
//
//                 // 更新 localStorage 狀態
//                 if (isDisliked) {
//                     localStorage.removeItem(`disliked-${imageId}`);
//                     img.style.filter = "none";
//                     img.style.opacity = "1";
//                     downvoteIcon.style.color = "gray";
//                     console.log("點擊")
//                 } else {
//                     localStorage.setItem(`disliked-${imageId}`, "true");
//                     img.style.filter = "grayscale(100%)";
//                     img.style.opacity = "0.15";
//                     downvoteIcon.style.color = "#FF6F61";
//                     console.log("取消")
//                 }
//             });
//
//             container.appendChild(button); // 將按鈕添加到 .theme-img-block 容器
//         }
//     });
// }

// function addBlackFilterToContainerImages() {
//     const containerImages = document.querySelectorAll(".theme-img-block img");
//
//     containerImages.forEach((img) => {
//         const imageId = img.getAttribute("data-src") || img.getAttribute("src");
//         const isDisliked = localStorage.getItem(`disliked-${imageId}`);
//
//         // 根據 localStorage 的紀錄設置灰階效果
//         if (isDisliked) {
//             img.style.filter = "grayscale(100%)";
//             img.style.opacity = "0.15";
//         } else {
//             img.style.filter = "none";
//             img.style.opacity = "1";
//         }
//
//         const container = img.closest(".theme-img-block");
//
//         if (!container.querySelector(".custom-button")) {
//             const button = document.createElement("button");
//             button.classList.add("custom-button");
//             button.style.position = "absolute";
//             button.style.top = "40px";
//             button.style.right = "3px";
//             button.style.zIndex = "10";
//             button.style.backgroundColor = "transparent";
//             button.style.border = "none";
//             button.style.cursor = "pointer";
//             button.style.pointerEvents = "auto";
//             img.style.pointerEvents = "none";
//
//             const downvoteIcon = document.createElement("i");
//             downvoteIcon.className = "material-icons";
//             downvoteIcon.style.color = isDisliked ? "#FF6F61" : "gray";
//             downvoteIcon.textContent = "thumb_down";
//
//             button.appendChild(downvoteIcon);
//
//             button.addEventListener("mouseover", () => {
//                 downvoteIcon.style.color = "#FF6F61";
//             });
//             button.addEventListener("mouseout", () => {
//                 downvoteIcon.style.color = isDisliked ? "#FF6F61" : "gray";
//             });
//
//             button.addEventListener("click", (event) => {
//                 event.stopPropagation();
//                 event.preventDefault();
//
//                 if (isDisliked) {
//                     localStorage.removeItem(`disliked-${imageId}`);
//                     img.style.filter = "none";
//                     img.style.opacity = "1";
//                     downvoteIcon.style.color = "gray";
//                     console.log("取消倒讚");
//                 } else {
//                     localStorage.setItem(`disliked-${imageId}`, "true");
//                     img.style.filter = "grayscale(100%)";
//                     img.style.opacity = "0.15";
//                     downvoteIcon.style.color = "#FF6F61";
//                     console.log("倒讚");
//                 }
//             });
//
//             container.appendChild(button);
//         }
//     });
// }

function addBlackFilterToContainerImages() {
    const containerImages = document.querySelectorAll(".theme-img-block img");

    containerImages.forEach((img) => {
        const imageId = img.getAttribute("data-src") || img.getAttribute("src");
        const isDisliked = localStorage.getItem(`disliked-${imageId}`);

        // 根據 localStorage 的紀錄設置灰階效果
        if (isDisliked) {
            img.style.filter = "grayscale(100%)";
            img.style.opacity = "0.15";
        } else {
            img.style.filter = "none";
            img.style.opacity = "1";
        }

        const container = img.closest(".theme-img-block");

        if (!container.querySelector(".custom-button")) {
            const button = document.createElement("button");
            button.classList.add("custom-button");
            button.style.position = "absolute";
            button.style.top = "40px";
            button.style.right = "5px";
            button.style.zIndex = "10";
            button.style.backgroundColor = "transparent";
            button.style.border = "none";
            button.style.cursor = "pointer";
            button.style.pointerEvents = "auto";
            img.style.pointerEvents = "none";

            const downvoteIcon = document.createElement("i");
            downvoteIcon.style.color = isDisliked ? "#FF6F61" : "gray";
            downvoteIcon.style.fontSize = "24px"; // 調整字體大小，放大 "X"
            downvoteIcon.textContent = "X"; // 使用 "X" 代替 thumb_down 圖標

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

                if (isDisliked) {
                    localStorage.removeItem(`disliked-${imageId}`);
                    img.style.filter = "none";
                    img.style.opacity = "1";
                    downvoteIcon.style.color = "gray";
                    console.log("取消倒讚");
                } else {
                    localStorage.setItem(`disliked-${imageId}`, "true");
                    img.style.filter = "grayscale(100%)";
                    img.style.opacity = "0.15";
                    downvoteIcon.style.color = "#FF6F61";
                    console.log("倒讚");
                }
            });

            container.appendChild(button);
        }
    });
}


// 啟動 URL 觀察器並立即檢查
addLocationObserver(observerCallback);
observerCallback();
