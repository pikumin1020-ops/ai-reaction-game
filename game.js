/* =========================================================
   AI反射神経バトル
   Supabase オンラインランキング対応版
========================================================= */


/* =========================================================
   SUPABASE設定
========================================================= */

const SUPABASE_URL =
    "https://umiqvvbntbimmccoeoby.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_tpvuzhC7HJDSaG2QPBRRVw_XBt5Zwyo";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


/* =========================================================
   HTML要素
========================================================= */

const scoreElement =
    document.getElementById("score");

const comboElement =
    document.getElementById("combo");

const timeElement =
    document.getElementById("time");

const targetColorElement =
    document.getElementById("targetColor");

const messageElement =
    document.getElementById("message");


const startButton =
    document.getElementById("startButton");

const rankingTab =
    document.getElementById("rankingTab");

const rankingButton =
    document.getElementById("rankingButton");

const backButton =
    document.getElementById("backButton");

const resetRankingButton =
    document.getElementById("resetRanking");


const playerNameInput =
    document.getElementById("playerName");


const resultArea =
    document.getElementById("resultArea");

const resultText =
    document.getElementById("resultText");


const gameScreen =
    document.getElementById("gameScreen");

const rankingScreen =
    document.getElementById("rankingScreen");

const rankingList =
    document.getElementById("rankingList");


const colorButtons =
    document.querySelectorAll(
        ".color-button"
    );


/* =========================================================
   色設定
========================================================= */

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


/* =========================================================
   ゲーム変数
========================================================= */

let score = 0;

let combo = 0;

let time = 10;

let targetColor = "";

let gameActive = false;

let timer = null;


/* =========================================================
   ローカルランキング
   ※オンラインランキングとは別
========================================================= */

let ranking =
    JSON.parse(
        localStorage.getItem(
            "aiGameRanking"
        )
    ) || [];


/* =========================================================
   初期ランキング表示
========================================================= */

updateRanking();


/* =========================================================
   ランキング画面を表示
========================================================= */

async function showRanking() {

    gameScreen.classList.add(
        "hidden"
    );

    rankingScreen.classList.remove(
        "hidden"
    );


    // Supabaseから最新ランキングを取得
    await loadOnlineRanking();

}


/* =========================================================
   ゲーム画面を表示
========================================================= */

function showGame() {

    rankingScreen.classList.add(
        "hidden"
    );

    gameScreen.classList.remove(
        "hidden"
    );

}


/* =========================================================
   ランキングタブ
========================================================= */

rankingTab.addEventListener(
    "click",
    function () {

        console.log(
            "ランキングタブが押されました"
        );

        showRanking();

    }
);


/* =========================================================
   結果画面のランキングボタン
========================================================= */

rankingButton.addEventListener(
    "click",
    function () {

        showRanking();

    }
);


/* =========================================================
   ゲームに戻る
========================================================= */

backButton.addEventListener(
    "click",
    function () {

        showGame();

    }
);


/* =========================================================
   ゲーム開始ボタン
========================================================= */

startButton.addEventListener(
    "click",
    startGame
);


/* =========================================================
   ゲーム開始
========================================================= */

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


    // 古いタイマーを停止
    if (timer !== null) {

        clearInterval(timer);

        timer = null;

    }


    // ゲーム変数を初期化
    score = 0;

    combo = 0;

    time = 10;

    targetColor = "";

    gameActive = false;


    // 画面を初期化
    scoreElement.textContent =
        score;

    comboElement.textContent =
        combo;

    timeElement.textContent =
        time;


    targetColorElement.textContent =
        "---";

    targetColorElement.style.color =
        "#333";


    resultArea.classList.add(
        "hidden"
    );


    // カウントダウン
    messageElement.textContent =
        "3";

    startButton.disabled =
        true;

    startButton.textContent =
        "カウントダウン中...";


    setTimeout(
        function () {

            messageElement.textContent =
                "2";

        },
        1000
    );


    setTimeout(
        function () {

            messageElement.textContent =
                "1";

        },
        2000
    );


    setTimeout(
        function () {

            beginGame();

        },
        3000
    );

}


/* =========================================================
   実際のゲーム開始
========================================================= */

function beginGame() {

    gameActive = true;


    messageElement.textContent =
        "START! 🔥";


    startButton.textContent =
        "ゲーム中...";


    newTarget();


    timer =
        setInterval(
            function () {

                time--;

                timeElement.textContent =
                    time;


                if (time <= 0) {

                    endGame();

                }

            },
            1000
        );

}


/* =========================================================
   次の色を決める
========================================================= */

function newTarget() {

    const randomIndex =
        Math.floor(
            Math.random() *
            colors.length
        );


    targetColor =
        colors[randomIndex];


    targetColorElement.textContent =
        colorNames[targetColor];


    targetColorElement.style.color =
        targetColor;


    targetColorElement.style.transform =
        "scale(1.15)";


    setTimeout(
        function () {

            targetColorElement.style.transform =
                "scale(1)";

        },
        100
    );

}


/* =========================================================
   色ボタン
========================================================= */

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


/* =========================================================
   色判定
========================================================= */

function checkColor(color) {

    if (!gameActive) {

        return;

    }


    /* -------------------------
       正解
    ------------------------- */

    if (color === targetColor) {

        combo++;


        score +=
            10 +
            combo * 2;


        scoreElement.textContent =
            score;


        comboElement.textContent =
            combo;


        if (combo >= 10) {

            messageElement.textContent =
                "🔥 " +
                combo +
                " COMBO!!";

        }
        else if (combo >= 5) {

            messageElement.textContent =
                "⚡ " +
                combo +
                " COMBO!";

        }
        else {

            messageElement.textContent =
                "正解！ 👍";

        }


        newTarget();

    }


    /* -------------------------
       不正解
    ------------------------- */

    else {

        combo = 0;


        comboElement.textContent =
            combo;


        messageElement.textContent =
            "ミス！ 😱";


        document.body.classList.add(
            "shake"
        );


        setTimeout(
            function () {

                document.body.classList.remove(
                    "shake"
                );

            },
            300
        );


        time--;


        timeElement.textContent =
            time;


        if (time <= 0) {

            endGame();

        }

    }

}


/* =========================================================
   ゲーム終了
========================================================= */

async function endGame() {

    if (!gameActive) {

        return;

    }


    /* -------------------------
       ゲーム停止
    ------------------------- */

    gameActive = false;


    if (timer !== null) {

        clearInterval(timer);

        timer = null;

    }


    /* -------------------------
       GAME OVER
    ------------------------- */

    targetColorElement.textContent =
        "GAME OVER";


    targetColorElement.style.color =
        "#333";


    /* -------------------------
       プレイヤー名
    ------------------------- */

    const playerName =
        playerNameInput.value.trim();


    /* -------------------------
       Supabaseへ保存
    ------------------------- */

    const saved =
        await saveScore(
            playerName,
            score
        );


    /* -------------------------
       結果表示
    ------------------------- */

    if (saved) {

        messageElement.textContent =
            "ランキング登録完了！ 🎉";

    }
    else {

        messageElement.textContent =
            "ゲーム終了！";

    }


    resultText.textContent =
        playerName +
        "さん、" +
        score +
        "点！";


    resultArea.classList.remove(
        "hidden"
    );


    startButton.disabled =
        false;


    startButton.textContent =
        "もう一度プレイ";


    /* -------------------------
       ローカルランキングも更新
    ------------------------- */

    ranking.push({

        name: playerName,

        score: score

    });


    ranking.sort(
        function (a, b) {

            return b.score -
                   a.score;

        }
    );


    ranking =
        ranking.slice(0, 5);


    localStorage.setItem(
        "aiGameRanking",
        JSON.stringify(ranking)
    );


    updateRanking();

}


/* =========================================================
   Supabaseへスコアを保存
========================================================= */

async function saveScore(
    name,
    score
) {

    console.log(
        "Supabaseへスコアを送信します..."
    );


    try {

        const result =
            await supabaseClient
                .from("scores")
                .insert([
                    {
                        name: name,
                        score: score
                    }
                ]);


        const error =
            result.error;


        if (error) {

            console.error(
                "スコア保存エラー:",
                error
            );


            return false;

        }


        console.log(
            "Supabaseへの保存成功！"
        );


        return true;

    }
    catch (error) {

        console.error(
            "Supabase接続エラー:",
            error
        );


        return false;

    }

}


/* =========================================================
   オンラインランキング取得
========================================================= */

async function loadOnlineRanking() {

    rankingList.innerHTML =
        "<p>ランキングを読み込んでいます...</p>";


    try {

        const result =
            await supabaseClient
                .from("scores")
                .select(
                    "name, score, created_at"
                )
                .order(
                    "score",
                    {
                        ascending: false
                    }
                )
                .limit(10);


        const data =
            result.data;

        const error =
            result.error;


        if (error) {

            console.error(
                "ランキング取得エラー:",
                error
            );


            rankingList.innerHTML =
                "<p>ランキングを取得できませんでした。</p>";


            return;

        }


        displayOnlineRanking(data);

    }
    catch (error) {

        console.error(
            "ランキング接続エラー:",
            error
        );


        rankingList.innerHTML =
            "<p>ランキングを取得できませんでした。</p>";

    }

}


/* =========================================================
   オンラインランキングを画面に表示
========================================================= */

function displayOnlineRanking(
    data
) {

    rankingList.innerHTML = "";


    if (
        !data ||
        data.length === 0
    ) {

        rankingList.innerHTML =
            "<p>まだランキングがありません。</p>";

        return;

    }


    data.forEach(
        function (player, index) {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "rank-item";


            if (index === 0) {

                item.classList.add(
                    "rank-1"
                );

            }
            else if (index === 1) {

                item.classList.add(
                    "rank-2"
                );

            }
            else if (index === 2) {

                item.classList.add(
                    "rank-3"
                );

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
                    (index + 1) +
                    "位";

            }


            item.innerHTML =

                '<span class="rank-number">' +
                medal +
                '</span>' +

                '<span class="rank-name">' +
                escapeHtml(
                    player.name
                ) +
                '</span>' +

                '<span class="rank-score">' +
                player.score +
                '点</span>';


            rankingList.appendChild(
                item
            );

        }
    );

}


/* =========================================================
   ローカルランキング表示
========================================================= */

function updateRanking() {

    // オンラインランキングを使うため、
    // ここでは初期表示だけ行う


    rankingList.innerHTML =
        "<p>🏆 オンラインランキング</p>";

}


/* =========================================================
   HTML文字対策
========================================================= */

function escapeHtml(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        text;


    return div.innerHTML;

}


/* =========================================================
   ランキングリセット
========================================================= */

resetRankingButton.addEventListener(
    "click",
    async function () {

        alert(
            "オンラインランキングは管理者のみ削除できます。"
        );

    }
);