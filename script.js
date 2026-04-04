let allData = {};
let currentLang = 'zh';
let currentPage = 0;
let totalPages = 1;

// 震動間隔序列
const shakeIntervals = [14, 9, 12];
let shakeIndex = 0;

async function init() {
    try {
        const response = await fetch('languages.json');
        allData = await response.json();
        renderPage();
        startCountdown();
        startErraticShaking();
    } catch (e) {
        console.error("莉莉絲攔截了請求", e);
    }
}

function renderPage() {
    const data = allData[currentLang];
    const container = document.querySelector('.container');
    const content = document.getElementById('story-content');
    
    // 更新語系 Class
    container.className = `container lang-${currentLang}`;
    document.querySelector('.title').innerHTML = data.title;
    content.innerText = data.content;
    
    // 更新按鈕狀態
    document.querySelectorAll('.lang-btn').forEach(btn => {
        const btnLang = btn.getAttribute('onclick').match(/'([^']+)'/)[1];
        btn.classList.toggle('active', btnLang === currentLang);
    });

    setTimeout(layoutStory, 100);
}

function layoutStory() {
    const wrapper = document.querySelector('.story-wrapper');
    const content = document.getElementById('story-content');
    const viewWidth = wrapper.getBoundingClientRect().width;
    
    content.style.columnWidth = `${viewWidth}px`;
    content.style.columnGap = `50px`;
    
    // 計算總頁數 (寬度 / 頁寬+間距)
    totalPages = Math.ceil(content.scrollWidth / (viewWidth + 50));
    updateNavigation();
}

function updateNavigation() {
    const wrapper = document.querySelector('.story-wrapper');
    const content = document.getElementById('story-content');
    const viewWidth = wrapper.getBoundingClientRect().width;
    
    const offset = currentPage * (viewWidth + 50);
    content.style.transform = `translateX(-${offset}px)`;
    
    const data = allData[currentLang];
    document.getElementById('page-info').innerText = `${data.page_prefix}${currentPage + 1} / ${totalPages}`;
}

// 遞迴不規則震動
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
        document.getElementById("countdown").innerText = `${allData[currentLang].countdown_prefix}${d}d ${h}h ${m}m ${s}s`;
    }, 1000);
}

// 分頁控制
function nextPage() { if(currentPage < totalPages - 1) { currentPage++; updateNavigation(); } }
function prevPage() { if(currentPage > 0) { currentPage--; updateNavigation(); } }

window.onload = init;
window.onresize = layoutStory;
