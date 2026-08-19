const scoreElement = document.getElementById("score");
const comboElement = document.getElementById("combo");
const timeElement = document.getElementById("time");
const targetColorElement = document.getElementById("targetColor");
const messageElement = document.getElementById("message");

const startButton = document.getElementById("startButton");
const rankingTab = document.getElementById("rankingTab");

const rankingButton = document.getElementById("rankingButton");
const backButton = document.getElementById("backButton");
const resetRankingButton = document.getElementById("resetRanking");

const playerNameInput = document.getElementById("playerName");

const resultArea = document.getElementById("resultArea");
const resultText = document.getElementById("resultText");

const gameScreen = document.getElementById("gameScreen");
const rankingScreen = document.getElementById("rankingScreen");
const rankingList = document.getElementById("rankingList");

const colorButtons =
    document.querySelectorAll(".color-button");


/* =========================
   色
========================= */

const colors = [
    "red",
    "blue",
    "green",
    "yellow"
];

const colorNames = {
    red: "赤",
    blue: "青",
    green: "緑",
    yellow: "黄"
};


/* =========================
   ゲーム変数
========================= */

let score = 0;
let combo = 0;
let time = 10;
let targetColor = "";

let gameActive = false;
let timer = null;


/* =========================
   ランキング
========================= */

let ranking = JSON.parse(
    localStorage.getItem("aiGameRanking")
) || [];

updateRanking();


/* =========================
   ランキング画面を表示
========================= */

function showRanking() {

    gameScreen.classList.add("hidden");

    rankingScreen.classList.remove("hidden");

    updateRanking();

}


/* =========================
   ゲーム画面を表示
========================= */

function showGame() {

    rankingScreen.classList.add("hidden");

    gameScreen.classList.remove("hidden");

}


/* =========================
   ランキングタブ
========================= */

rankingTab.addEventListener(
    "click",
    function () {

        console.log("ランキングタブが押されました");

        showRanking();

    }
);


/* =========================
   ゲーム終了後の
   ランキングボタン
========================= */

rankingButton.addEventListener(
    "click",
    function () {

        showRanking();

    }
);


/* =========================
   ゲームに戻る
========================= */

backButton.addEventListener(
    "click",
    function () {

        showGame();

    }
);


/* =========================
   ゲーム開始
========================= */

startButton.addEventListener(
    "click",
    startGame
);


function startGame() {

    const playerName =
        playerNameInput.value.trim();


    if (playerName === "") {

        alert(
            "プレイヤー名を入力してください！"
        );

        playerNameInput.focus();

        return;

    }


    if (timer !== null) {

        clearInterval(timer);

        timer = null;

    }


    score = 0;
    combo = 0;
    time = 10;
    targetColor = "";

    gameActive = false;


    scoreElement.textContent = score;
    comboElement.textContent = combo;
    timeElement.textContent = time;


    targetColorElement.textContent = "---";
    targetColorElement.style.color = "#333";


    resultArea.classList.add("hidden");


    messageElement.textContent = "3";

    startButton.disabled = true;

    startButton.textContent =
        "カウントダウン中...";


    setTimeout(function () {

        messageElement.textContent = "2";

    }, 1000);


    setTimeout(function () {

        messageElement.textContent = "1";

    }, 2000);


    setTimeout(function () {

        beginGame();

    }, 3000);

}


/* =========================
   ゲーム開始
========================= */

function beginGame() {

    gameActive = true;

    messageElement.textContent =
        "START! 🔥";

    startButton.textContent =
        "ゲーム中...";


    newTarget();


    timer = setInterval(function () {

        time--;

        timeElement.textContent = time;


        if (time <= 0) {

            endGame();

        }

    }, 1000);

}


/* =========================
   色を決める
========================= */

function newTarget() {

    const randomIndex =
        Math.floor(
            Math.random() * colors.length
        );


    targetColor =
        colors[randomIndex];


    targetColorElement.textContent =
        colorNames[targetColor];


    targetColorElement.style.color =
        targetColor;


    targetColorElement.style.transform =
        "scale(1.15)";


    setTimeout(function () {

        targetColorElement.style.transform =
            "scale(1)";

    }, 100);

}


/* =========================
   色ボタン
========================= */

colorButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const color =
                    button.dataset.color;

                checkColor(color);

            }
        );

    }
);


/* =========================
   正解判定
========================= */

function checkColor(color) {

    if (!gameActive) {

        return;

    }


    if (color === targetColor) {

        combo++;

        score += 10 + combo * 2;


        scoreElement.textContent =
            score;

        comboElement.textContent =
            combo;


        if (combo >= 10) {

            messageElement.textContent =
                "🔥 " + combo + " COMBO!!";

        }
        else if (combo >= 5) {

            messageElement.textContent =
                "⚡ " + combo + " COMBO!";

        }
        else {

            messageElement.textContent =
                "正解！ 👍";

        }


        newTarget();

    }
    else {

        combo = 0;

        comboElement.textContent =
            combo;


        messageElement.textContent =
            "ミス！ 😱";


        document.body.classList.add(
            "shake"
        );


        setTimeout(function () {

            document.body.classList.remove(
                "shake"
            );

        }, 300);


        time--;

        timeElement.textContent =
            time;


        if (time <= 0) {

            endGame();

        }

    }

}


/* =========================
   ゲーム終了
========================= */

function endGame() {

    if (!gameActive) {

        return;

    }


    gameActive = false;


    if (timer !== null) {

        clearInterval(timer);

        timer = null;

    }


    targetColorElement.textContent =
        "GAME OVER";

    targetColorElement.style.color =
        "#333";


    const playerName =
        playerNameInput.value.trim();


    ranking.push({

        name: playerName,

        score: score

    });


    ranking.sort(
        function (a, b) {

            return b.score - a.score;

        }
    );


    ranking = ranking.slice(0, 5);


    localStorage.setItem(
        "aiGameRanking",
        JSON.stringify(ranking)
    );


    messageElement.textContent =
        "ゲーム終了！";


    resultText.textContent =
        playerName +
        "さん、" +
        score +
        "点！";


    resultArea.classList.remove(
        "hidden"
    );


    startButton.disabled = false;

    startButton.textContent =
        "もう一度プレイ";


    updateRanking();

}


/* =========================
   ランキング表示
========================= */

function updateRanking() {

    rankingList.innerHTML = "";


    if (ranking.length === 0) {

        rankingList.innerHTML =
            "<p>まだランキングがありません。</p>";

        return;

    }


    ranking.forEach(
        function (player, index) {

            const item =
                document.createElement("div");


            item.className =
                "rank-item";


            if (index === 0) {

                item.classList.add("rank-1");

            }
            else if (index === 1) {

                item.classList.add("rank-2");

            }
            else if (index === 2) {

                item.classList.add("rank-3");

            }


            let medal;


            if (index === 0) {

                medal = "🥇";

            }
            else if (index === 1) {

                medal = "🥈";

            }
            else if (index === 2) {

                medal = "🥉";

            }
            else {

                medal =
                    (index + 1) + "位";

            }


            item.innerHTML =

                '<span class="rank-number">' +
                medal +
                '</span>' +

                '<span class="rank-name">' +
                escapeHtml(player.name) +
                '</span>' +

                '<span class="rank-score">' +
                player.score +
                '点</span>';


            rankingList.appendChild(item);

        }
    );

}


/* =========================
   HTML文字対策
========================= */

function escapeHtml(text) {

    const div =
        document.createElement("div");

    div.textContent = text;

    return div.innerHTML;

}


/* =========================
   ランキングリセット
========================= */

resetRankingButton.addEventListener(
    "click",
    function () {

        const answer =
            confirm(
                "ランキングを全部消しますか？"
            );


        if (!answer) {

            return;

        }


        ranking = [];


        localStorage.removeItem(
            "aiGameRanking"
        );


        updateRanking();

    }
);