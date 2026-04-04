let currentPage = 0;
let totalPages = 1;
let storyData = {};

// 震動間隔序列：14秒 -> 9秒 -> 12秒
const shakeIntervals = [14, 9, 12];
let shakeIndex = 0;

async function init() {
    // 根據 body 的 data-lang 決定讀取哪個檔案
    const lang = document.body.getAttribute('data-lang') || 'zh';
    
    try {
        const response = await fetch(`${lang}.json`);
        if (!response.ok) throw new Error('無法讀取預言檔案');
        storyData = await response.json();
        
        // 注入標題與文本
        document.querySelector('.title').innerHTML = storyData.title;
        document.getElementById('story-content').innerText = storyData.content;
        
        // 關鍵：等待字體載入完成後再進行分頁計算
        await document.fonts.ready;
        
        // 給予瀏覽器微小的渲染緩衝時間
        setTimeout(() => {
            layoutStory();
            startCountdown();
            startErraticShaking();
        }, 100);
        
    } catch (e) {
        document.querySelector('.title').innerText = "森林的連結已斷開";
        console.error(e);
    }
}

// 動態計算分頁（適配各種手機螢幕）
function layoutStory() {
    const wrapper = document.querySelector('.story-wrapper');
    const content = document.getElementById('story-content');
    if (!wrapper || !content) return;

    const viewWidth = wrapper.getBoundingClientRect().width;
    
    // 強制設定多欄位寬度
    content.style.columnWidth = `${viewWidth}px`;
    content.style.columnGap = `50px`;
    
    // 計算總頁數
    const scrollWidth = content.scrollWidth;
    totalPages = Math.ceil(scrollWidth / (viewWidth + 50));
    
    updateNavigation();
}

// 更新平移位置與頁碼文字
function updateNavigation() {
    const wrapper = document.querySelector('.story-wrapper');
    const content = document.getElementById('story-content');
    const viewWidth = wrapper.getBoundingClientRect().width;
    
    const offset = currentPage * (viewWidth + 50);
    content.style.transform = `translateX(-${offset}px)`;
    
    document.getElementById('page-info').innerText = 
        `${storyData.page_prefix}${currentPage + 1} / ${totalPages}`;
}

// 循環震動邏輯
function startErraticShaking() {
    const currentDelay = shakeIntervals[shakeIndex] * 1000;
    
    setTimeout(() => {
        document.body.classList.add('soul-shake');
        
        setTimeout(() => {
            document.body.classList.remove('soul-shake');
        }, 500);

        shakeIndex = (shakeIndex + 1) % shakeIntervals.length;
        startErraticShaking(); // 遞迴呼叫
    }, currentDelay);
}

// 2027/4/1 終焉倒計時
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

// 換頁功能
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

// 視窗縮放時重新計算（如旋轉手機螢幕）
window.onresize = layoutStory;

// 啟動儀式
window.onload = init;
