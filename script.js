let currentPage = 0;
let totalPages = 1;
let storyData = {};

// 震動間隔序列：14秒 -> 9秒 -> 12秒
const shakeIntervals = [14, 9, 12];
let shakeIndex = 0;

async function init() {
    // 根據 body 的 data-lang 決定讀取哪個 JSON
    const lang = document.body.getAttribute('data-lang') || 'zh';
    
    try {
        const response = await fetch(`${lang}.json`);
        if (!response.ok) throw new Error('無法讀取預言檔案');
        storyData = await response.json();
        
        // 注入標題與文本
        document.querySelector('.title').innerHTML = storyData.title;
        document.getElementById('story-content').innerText = storyData.content;
        
        // 關鍵：等待字體載入完成
        await document.fonts.ready;
        
        // 初次排版
        setTimeout(() => {
            layoutStory();
            startCountdown();
            startErraticShaking();
        }, 200);
        
    } catch (e) {
        document.querySelector('.title').innerText = "森林的連結已斷開";
        console.error(e);
    }
}

function layoutStory() {
    const wrapper = document.querySelector('.story-wrapper');
    const content = document.getElementById('story-content');
    if (!wrapper || !content) return;

    // 先重置 transform，避免舊的偏移干擾寬度計算
    content.style.transform = 'translateX(0)';
    
    // 取得容器實際寬度（不含 padding/margin）
    const viewWidth = wrapper.clientWidth;
    
    // 強制設定多欄位寬度與間距
    const gap = 50; 
    content.style.columnWidth = `${viewWidth}px`;
    content.style.columnGap = `${gap}px`;
    
    // 核心修正：使用 scrollWidth 計算總頁數
    // scrollWidth 包含了所有欄位的總寬度
    const totalWidth = content.scrollWidth;
    
    // 計算邏輯：總寬度 / (一頁寬 + 一個間距)
    totalPages = Math.ceil(totalWidth / viewWidth);

    // 防呆：如果內容真的太少，至少顯示 1 頁
    if (totalPages < 1) totalPages = 1;
    
    // 如果切換導致當前頁數超過總頁數，回到最後一頁
    if (currentPage >= totalPages) currentPage = totalPages - 1;

    updateNavigation();
}

function updateNavigation() {
    const wrapper = document.querySelector('.story-wrapper');
    const content = document.getElementById('story-content');
    const viewWidth = wrapper.clientWidth;
    const gap = 50;

    // 偏移量計算：每一頁移動 (寬度 + 間距)
    const offset = currentPage * (viewWidth + gap);
    content.style.transform = `translateX(-${offset}px)`;
    
    // 更新頁碼文字
    const pageInfo = document.getElementById('page-info');
    if (storyData.page_prefix) {
        pageInfo.innerText = `${storyData.page_prefix}${currentPage + 1} / ${totalPages}`;
    }
}

// 循環震動
function startErraticShaking() {
    const currentDelay = shakeIntervals[shakeIndex] * 1000;
    setTimeout(() => {
        document.body.classList.add('soul-shake');
        setTimeout(() => {
            document.body.classList.remove('soul-shake');
        }, 500);
        shakeIndex = (shakeIndex + 1) % shakeIntervals.length;
        startErraticShaking();
    }, currentDelay);
}

// 倒計時
function startCountdown() {
    const target = new Date("April 1, 2027 00:00:00").getTime();
    setInterval(() => {
        const now = new Date().getTime();
        const dist = target - now;
        if (dist < 0) {
            document.getElementById("countdown").innerText = "儀式已完成";
            return;
        }
        const d = Math.floor(dist / 86400000);
        const h = Math.floor((dist % 86400000) / 3600000);
        const m = Math.floor((dist % 3600000) / 60000);
        const s = Math.floor((dist % 60000) / 1000);
        document.getElementById("countdown").innerText = 
            `${storyData.countdown_prefix}${d}d ${h}h ${m}m ${s}s`;
    }, 1000);
}

// 換頁按鈕函數
function nextPage() {
    if (currentPage < totalPages - 1) {
        currentPage++;
        updateNavigation();
    }
}

function prevPage() {
    if (currentPage > 0) {
        currentPage--;
        updateNavigation();
    }
}

window.onresize = layoutStory;
window.onload = init;
