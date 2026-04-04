let storySections = []; // 存儲四段故事
let currentTabIndex = 0;
const shakeIntervals = [14, 9, 12];
let shakeIndex = 0;

async function init() {
    const lang = document.body.getAttribute('data-lang') || 'zh';
    try {
        const response = await fetch(`${lang}.json`);
        const data = await response.json();
        
        // 預期 JSON 格式：content 是一個有 4 個字串的陣列
        storySections = data.content; 
        
        document.querySelector('.title').innerHTML = data.title;
        window.countdownPrefix = data.countdown_prefix;

        switchTab(0); // 預設顯示第一段
        startCountdown();
        startErraticShaking();
    } catch (e) {
        console.error("預言載入失敗", e);
    }
}

function switchTab(index) {
    currentTabIndex = index;
    const content = document.getElementById('story-content');
    const tabs = document.querySelectorAll('.tab-item');

    // 切換按鈕狀態
    tabs.forEach((tab, i) => {
        tab.classList.toggle('active', i === index);
    });

    // 切換文本內容
    content.innerHTML = storySections[index] || "這段記憶已被抹除...";
    
    // 滾動回頂部
    document.querySelector('.story-wrapper').scrollTop = 0;
}

// 倒計時與震動邏輯保持不變...
function startCountdown() {
    const target = new Date("April 1, 2027 00:00:00").getTime();
    setInterval(() => {
        const now = new Date().getTime();
        const dist = target - now;
        const d = Math.floor(dist / 86400000);
        const h = Math.floor((dist % 86400000) / 3600000);
        const m = Math.floor((dist % 3600000) / 60000);
        const s = Math.floor((dist % 60000) / 1000);
        document.getElementById("countdown").innerText = `${window.countdownPrefix}${d}d ${h}h ${m}m ${s}s`;
    }, 1000);
}

function startErraticShaking() {
    const currentDelay = shakeIntervals[shakeIndex] * 1000;
    setTimeout(() => {
        document.body.classList.add('soul-shake');
        setTimeout(() => document.body.classList.remove('soul-shake'), 500);
        shakeIndex = (shakeIndex + 1) % shakeIntervals.length;
        startErraticShaking();
    }, currentDelay);
}

window.onload = init;
