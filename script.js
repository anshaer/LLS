let currentPage = 0;
let storyData = [];

// 模擬從 JSON 載入數據
const mockStory = [
    "第一章：失蹤的觀測者。Anshaer 消失在 2024 年的秋末，留下的最後一條訊息是：『她說森林在呼喚我。』",
    "第二章：莉莉絲。她是這片地下森林的主人，一位能將月光編織成鎖鏈的病嬌魔術師。她的愛是窒息的根鬚。",
    "第三章：蠱惑。最初是甜美的幻象，莉莉絲承諾給予 Anshaer 永恆的知識，只要他交出清醒的意志。",
    "第四章：地下森林。這不是植物的領地，而是靈魂的囚籠。每一棵樹，都曾是一位誤入歧途的旅人。",
    "第五章：腐蝕的鐘擺。時間在這裡變形。莉莉絲用紅色的絲綢遮住 Anshaer 的眼，輕聲說：『看，外面的世界正在崩解。』",
    "第六章：預言。牆上刻著文字：2027年4月1日。那是森林更換主人的儀式，也是 Anshaer 靈魂乾枯的日子。",
    "第七章：幻覺。他開始看見莉莉絲就在鏡子裡，儘管背後空無一人。她的手冰冷如霜，撫過他的頸項。",
    "第八章：儀式的代價。魔術師不需要助手，魔術師需要的是受害者。Anshaer 的存在感正在逐漸稀薄。",
    "第九章：逃離的嘗試。他曾試圖奔向那道微弱的光，但森林的出口永遠在下一公里的幻影中。",
    "第十章：最後的清醒。他在樹皮上記錄這一切。如果你讀到這，說明你正踩在他的骨灰之上。",
    "第十一章：倒數。每一秒，他的記憶就被抽走一分。他甚至快忘記『Anshaer』這個名字的意義。",
    "第十二章：莉莉絲的笑容。她並不憤怒他的反抗，反而覺得有趣。病態的憐愛讓森林變得更加血紅。",
    "第十三章：更替。若 2027 年的鐘聲敲響，這裡將不再是莉莉絲的森林。它將被命名為——『Anshaer 的地下森林』。",
    "第十四章：終焉。救贖是不存在的。這只是一個保留網域的理由，或者，是你親眼見證他沉淪的邀請函。"
];

function updateStory() {
    const content = document.getElementById('story-content');
    content.style.animation = 'none';
    content.offsetHeight; // 觸發重繪
    content.style.animation = 'fadeIn 1s ease';
    
    content.innerText = mockStory[currentPage];
    document.getElementById('page-indicator').innerText = `${currentPage + 1} / 14`;
}

// 倒計時邏輯
function startCountdown() {
    const targetDate = new Date("April 1, 2027 00:00:00").getTime();

    setInterval(() => {
        const now = new Date().getTime();
        const distance = targetDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("countdown").innerHTML = 
            `距離主權交替還有: ${days}天 ${hours}時 ${minutes}分 ${seconds}秒`;

        if (distance < 0) {
            document.getElementById("countdown").innerHTML = "Anshaer 的地下森林 已經降臨";
        }
    }, 1000);
}

// 綁定按鈕
document.getElementById('prev-btn').addEventListener('click', () => {
    if (currentPage > 0) {
        currentPage--;
        updateStory();
    }
});

document.getElementById('next-btn').addEventListener('click', () => {
    if (currentPage < mockStory.length - 1) {
        currentPage++;
        updateStory();
    }
});

// 初始化
updateStory();
startCountdown();

