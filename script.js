let storyData = { tabs: [], content: [] };
const shakeIntervals = [14, 9, 12];
let shakeIndex = 0;

async function init() {
    const lang = document.body.getAttribute('data-lang') || 'zh';
    try {
        const response = await fetch(`${lang}.json`);
        storyData = await response.json();
        
        document.querySelector('.title').innerHTML = storyData.title;
        
        // 生成頁籤按鈕
        const tabsContainer = document.getElementById('story-tabs');
        storyData.tabs.forEach((tabName, index) => {
            const div = document.createElement('div');
            div.className = `tab-item ${index === 0 ? 'active' : ''}`;
            div.innerText = tabName;
            div.onclick = () => switchTab(index);
            tabsContainer.appendChild(div);
        });

        switchTab(0); // 預設第一段
        startCountdown();
        startErraticShaking();
    } catch (e) {
        console.error("莉莉絲攔截了請求", e);
    }
}

function switchTab(index) {
    const content = document.getElementById('story-content');
    const tabs = document.querySelectorAll('.tab-item');

    // 切換 UI 狀態
    tabs.forEach((tab, i) => {
        tab.classList.toggle('active', i === index);
    });

    // 重新觸發動畫並換字
    content.style.animation = 'none';
    content.offsetHeight; // 觸發重繪
    content.style.animation = 'fadeIn 0.8s ease forwards';
    content.innerText = storyData.content[index] || "...";

    // 捲動回頂部
    document.querySelector('.story-wrapper').scrollTop = 0;
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

function startCountdown() {
    const target = new Date("April 1, 2027 00:00:00").getTime();
    setInterval(() => {
        const now = new Date().getTime();
        const dist = target - now;
        const d = Math.floor(dist / 86400000);
        const h = Math.floor((dist % 86400000) / 3600000);
        const m = Math.floor((dist % 3600000) / 60000);
        const s = Math.floor((dist % 60000) / 1000);
        const prefix = storyData.countdown_prefix || "終焉倒數：";
        document.getElementById("countdown").innerText = `${prefix}${d}d ${h}h ${m}m ${s}s`;
    }, 1000);
}

window.onload = init;
