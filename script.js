let allData = {};
let currentLang = 'zh';
let currentPage = 0;
let totalPages = 1;

async function init() {
    const response = await fetch('languages.json');
    allData = await response.json();
    
    // 每 14 秒觸發一次全螢幕抖動
    setInterval(() => {
        document.body.classList.add('soul-shake');
        setTimeout(() => document.body.classList.remove('soul-shake'), 500);
    }, 14000);

    renderPage();
}

function renderPage() {
    const data = allData[currentLang];
    const container = document.querySelector('.container');
    const content = document.getElementById('story-content');
    
    // 切換容器字型
    container.className = `container lang-${currentLang}`;
    
    document.querySelector('.title').innerHTML = data.title;
    content.innerText = data.content;
    
    // 更新語言按鈕狀態
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('onclick').includes(currentLang));
    });

    setTimeout(layoutStory, 100);
}

function layoutStory() {
    const wrapper = document.querySelector('.story-wrapper');
    const content = document.getElementById('story-content');
    const viewWidth = wrapper.offsetWidth;
    
    content.style.columnWidth = `${viewWidth}px`;
    content.style.columnGap = `40px`;
    
    totalPages = Math.ceil(content.scrollWidth / viewWidth);
    updateNavigation();
}

function updateNavigation() {
    const wrapper = document.querySelector('.story-wrapper');
    const content = document.getElementById('story-content');
    const viewWidth = wrapper.offsetWidth;
    content.style.transform = `translateX(-${currentPage * (viewWidth + 40)}px)`;
    document.getElementById('page-info').innerText = `${allData[currentLang].page_prefix}${currentPage + 1} / ${totalPages}`;
}

function changeLang(lang) {
    currentLang = lang;
    currentPage = 0;
    renderPage();
}

function nextPage() { if(currentPage < totalPages-1) { currentPage++; updateNavigation(); } }
function prevPage() { if(currentPage > 0) { currentPage--; updateNavigation(); } }

window.onload = init;
window.onresize = layoutStory;
