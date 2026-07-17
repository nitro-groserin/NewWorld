// 1. オーディオ要素を作成し、ループ設定を有効にする
const audio = new Audio('BGM - 149 - Reincarnation @ フリーBGM DOVA-SYNDROME OFFICIAL YouTube CHANNEL.mp3');
audio.loop = true; // ループ再生をON
audio.preload = 'auto';

// 2. 画面を一度クリックしたら再生を開始（1回クリックされたらイベントは自動消滅）
window.addEventListener('click', () => {
    audio.play()
        .then(() => console.log("ループ再生を開始しました。"))
        .catch(err => console.error("再生に失敗しました:", err));
}, { once: true });












// ==========================================
// ★ ページ読み込み時の初期化処理
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // 1. ローカルストレージに保存されたカスタム投稿を初期描画
    renderSavedPosts();

    // 2. ブックマーク状態のUI復元（タイムライン & 動画）
    restoreBookmarks();

    // 3. 禁止ワードのリアルタイム入力監視
    initBannedWordMonitor();
});











// ==========================================
// ★ 禁止ワードの設定と監視ロジック（最適化版）
// ==========================================
const BANNED_WORDS = [
    'ださい', 
    'さい', 
    '的',
    'itest.5ch.io', 
    '2ch.sc',
    'Panasonic',
    'パナソニック',
    'コメダ珈琲',
    'sad',
    'https://2ch.sc/',
    'https://corp.rakuten.co.jp/',
    'https://www.rakuten.co.jp/sitemap/',
    'https://ichiba.faq.rakuten.net/',
    'https://www.rakuten-bank.co.jp/',
    'https://www.rakuten-card.co.jp/',
    'https://www.rakuten-sec.co.jp/',
    'https://pay.rakuten.co.jp/',
    'https://www.rakuten-insurance.co.jp/',
    'https://www.rakuten.co.jp/',
    'https://travel.rakuten.co.jp/',
    'https://books.rakuten.co.jp/',
    'https://fril.jp/',
    'https://network.mobile.rakuten.co.jp/',
    'https://hikari.rakuten.co.jp/',
    'https://tv.rakuten.co.jp/',
    'https://www.rakutenid.com/eagles/',
    'https://www.kohnan-eshop.com/shop/',
    'https://www.kohnan-eshop.com/',
    '電気',
    '電力',
    '解体業',
    'エアコン',
    '冷凍庫',
    'クーラー',
    'アライフーズ',
    '株式会社アライフーズ',
    'ラーメン福',
    'https://www.ra-menfuku.com/company/',
    'カメラ',
    'コン',
    '室外機',
        'Panasonic',
        'パナソニック',
        'PANASONIC',
        '光',
        'ヒカリ',
        'ひかり',
        '波',
        '電波',
        '周波数',
        'Sunwave',



    // 数字 (0-9)小文字
'0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
'０', '１', '２', '３', '４', '５', '６', '７', '８', '９',




// 大文字 (A-Z)
'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z',
// 小文字 (a-z)
'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'
];

// 入力テキストに禁止ワードが含まれているか判定する関数
function checkBannedWord(text) {
    // 1. そもそも禁止ワードが1つも含まれていなければセーフ
    const hasBannedWord = BANNED_WORDS.some(word => text.includes(word));
    if (!hasBannedWord) return false;

    // 2. 禁止ワードが含まれている場合、それが「URL形式」を含んでいるかチェック
    const urlRegex = /https?:\/\/[\w!?/+\-_~=;.,*&@#%]+/g;
    if (urlRegex.test(text)) {
        // URLが含まれていても、それが「5ch」などの禁止ドメインであればアウト
        const containsForbiddenUrl = BANNED_WORDS.some(word => 
            (word.includes('.') || word.includes('/')) && text.includes(word)
        );
        
        if (containsForbiddenUrl) {
            return true; // 禁止URLなのでアウト
        }
        
        return false; // 安全なURL（例: google.com など）が含まれているのでセーフ
    }
    
    return true; // URLではなく、純粋に禁止ワード（「ださい」など）が含まれているのでアウト
}

// リアルタイムで入力欄の文字色を赤くするイベントリスナー
function initBannedWordMonitor() {
    const postInput = document.getElementById('postInput');
    if (!postInput) return;

    postInput.addEventListener('input', () => {
        if (checkBannedWord(postInput.value)) {
            postInput.style.color = '#ff4d4f'; // 禁止ワードがある場合は文字を赤く
            postInput.style.borderColor = '#ff4d4f'; // 外枠も連動して赤く
        } else {
            postInput.style.color = ''; // 通常時は元のスタイルに戻す
            postInput.style.borderColor = ''; 
        }
    });
}











// ==========================================
// ★ タイムライン 共通HTMLテンプレート生成
// ==========================================
function createTweetHTML(post) {
    return `
        <div class="tweet-main">
            <div class="avatar"></div>
            <div class="tweet-content">
                <div class="tweet-user-info" style="position: relative;">
                    <span class="screen-name">${post.name || 'デザインサンプル'}</span>
                    <span class="user-id">${post.user || '@design_test'}</span>
                    <span class="tweet-time">· ${post.time}</span>
                    <button class="tweet-delete-btn" onclick="deleteTweet(this)" style="position: absolute; right: 0; top: 0; background: none; border: none; color: #536471; cursor: pointer; font-size: 14px;">
                        <i class="fa-regular fa-trash-can"></i>
                    </button>
                </div>
                <p class="tweet-text">${escapeHTML(post.text)}</p>
                <div class="tweet-actions">
                    <span class="action-item" onclick="toggleReplies(this)"><i class="fa-regular fa-comment"></i> <span class="count">0</span></span>
                    <span class="action-item" onclick="repostTweet(this)"><i class="fa-solid fa-retweet"></i> <span class="count">0</span></span>
                    <span class="action-item" onclick="toggleTweetBookmark(this)"><i class="fa-regular fa-bookmark"></i> <span class="count">0</span></span>
                </div>
            </div>
        </div>
        <div class="replies-container" style="display:none;">
            <div class="reply-list"></div>
            <div class="reply-form">
                <input type="text" class="reply-input" placeholder="返信をポスト…">
                <button class="reply-submit-btn" onclick="submitReply(this)">返信</button>
            </div>
        </div>
    `;
}

// ==========================================
// ★ 投稿の描画・作成・削除ロジック
// ==========================================

// 保存されたすべての投稿をタイムラインに描画する
function renderSavedPosts() {
    const timelineList = document.getElementById('timelineList');
    if (!timelineList) return;

    const savedPosts = JSON.parse(localStorage.getItem('newWorldPosts')) || [];

    // 配列の最後（古いデータ）から順にループして、常に「一番上」に挿入していく
    savedPosts.slice().reverse().forEach(post => {
        if (document.querySelector(`[data-tweet-id="${post.id}"]`)) return;

        const tweetDiv = document.createElement('div');
        tweetDiv.className = 'tweet';
        tweetDiv.setAttribute('data-tweet-id', post.id);
        tweetDiv.innerHTML = createTweetHTML(post);

        timelineList.insertBefore(tweetDiv, timelineList.firstChild);
    });
}

// 2つ目のページで直接新規ポストを追加する
function createNewPost() {
    const postInput = document.getElementById('postInput');
    const timelineList = document.getElementById('timelineList');
    if (!postInput || !timelineList) return;

    const text = postInput.value.trim();
    if (!text) return;

    // 裏側の処理：禁止ワードが含まれている場合は処理を中断（ポストさせない）
    if (checkBannedWord(text)) {
        return; 
    }

    const uniqueId = 'tweet-' + Date.now(); 

    const postData = {
        id: uniqueId,
        text: text,
        time: "今",
        name: "デザインサンプル",
        user: "@design_test"
    };

    // 共通のキー「newWorldPosts」の先頭に保存
    let savedPosts = JSON.parse(localStorage.getItem('newWorldPosts')) || [];
    savedPosts.unshift(postData);
    localStorage.setItem('newWorldPosts', JSON.stringify(savedPosts));

    // UIへレンダリング
    const newTweet = document.createElement('div');
    newTweet.className = 'tweet';
    newTweet.setAttribute('data-tweet-id', uniqueId);
    newTweet.innerHTML = createTweetHTML(postData);

    timelineList.insertBefore(newTweet, timelineList.firstChild);
    
    // 投稿成功時は入力欄をクリアし、色を通常状態に戻す
    postInput.value = '';
    postInput.style.color = '';
    postInput.style.borderColor = '';
}

// タイムライン上のツイート（通常・リポスト問わず）を削除する
function deleteTweet(buttonElement) {
    const tweetElement = buttonElement.closest('.tweet');
    if (!tweetElement) return;

    const tweetId = tweetElement.getAttribute('data-tweet-id');
    const repostRef = tweetElement.getAttribute('data-repost-ref');
    const targetId = tweetId || repostRef;

    // フェードアウト効果
    tweetElement.style.opacity = '0';
    tweetElement.style.transition = 'opacity 0.2s ease';

    setTimeout(() => {
        tweetElement.remove();

        // 1. localStorageの「投稿リスト」から削除
        if (tweetId) {
            let savedPosts = JSON.parse(localStorage.getItem('newWorldPosts')) || [];
            savedPosts = savedPosts.filter(post => post.id !== tweetId);
            localStorage.setItem('newWorldPosts', JSON.stringify(savedPosts));
        }

        // 2. localStorageの「ブックマークリスト」からも同時に解除・削除
        let bookmarks = JSON.parse(localStorage.getItem('tl_bookmarks')) || [];
        bookmarks = bookmarks.filter(item => item.id !== targetId);
        localStorage.setItem('tl_bookmarks', JSON.stringify(bookmarks));

        // 3. もし削除したツイートを自分がリポストしていた場合、そのリポスト要素も消去
        if (tweetId) {
            const relatedRepost = document.querySelector(`.tweet[data-repost-ref="${tweetId}"]`);
            if (relatedRepost) relatedRepost.remove();
        }
    }, 200);
}

// ==========================================
// ★ タイムライン コメント（返信）処理
// ==========================================
function toggleReplies(element) {
    const tweetElement = element.closest('.tweet');
    const container = tweetElement.querySelector('.replies-container');
    
    if (container.style.display === 'none' || container.style.display === '') {
        container.style.display = 'block';
        element.classList.add('comment-active');
    } else {
        container.style.display = 'none';
        element.classList.remove('comment-active');
    }
}

function submitReply(buttonElement) {
    const formElement = buttonElement.closest('.reply-form');
    const inputElement = formElement.querySelector('.reply-input');
    const replyText = inputElement.value.trim();
    
    if (!replyText) return;

    const tweetElement = buttonElement.closest('.tweet');
    const replyList = tweetElement.querySelector('.reply-list');

    const replyItem = document.createElement('div');
    replyItem.className = 'reply-item';
    replyItem.innerHTML = `
        <div class="reply-avatar"></div>
        <div class="reply-body">
            <div class="reply-user"><span class="screen-name">デザインサンプル</span> <span class="user-id" style="font-size:11px;">@design_test</span></div>
            <div class="reply-text">${escapeHTML(replyText)}</div>
        </div>
    `;
    replyList.appendChild(replyItem);

    const countSpan = tweetElement.querySelector('.fa-comment').nextElementSibling;
    countSpan.textContent = parseInt(countSpan.textContent) + 1;

    inputElement.value = '';
}

// ==========================================
// ★ リポスト（再ポスト）処理ロジック
// ==========================================
function repostTweet(element) {
    const tweetElement = element.closest('.tweet');
    const tweetId = tweetElement.getAttribute('data-tweet-id') || tweetElement.getAttribute('data-repost-ref');
    const timelineList = document.getElementById('timelineList');
    const countSpan = element.querySelector('.count');
    let currentCount = parseInt(countSpan.textContent);

    if (element.classList.contains('reposted')) {
        element.classList.remove('reposted');
        countSpan.textContent = currentCount - 1;

        const generatedTweet = document.querySelector(`.tweet[data-repost-ref="${tweetId}"]`);
        if (generatedTweet) generatedTweet.remove();
        return;
    }

    const originalText = tweetElement.querySelector('.tweet-text').textContent;
    const originalUser = tweetElement.querySelector('.screen-name').textContent;
    const originalID = tweetElement.querySelector('.user-id').textContent;

    element.classList.add('reposted');
    countSpan.textContent = currentCount + 1;

    const newTweet = document.createElement('div');
    newTweet.className = 'tweet';
    newTweet.setAttribute('data-repost-ref', tweetId); 
    newTweet.innerHTML = `
        <div style="font-size: 12px; color: #00ba7c; margin-bottom: 5px; padding-left: 52px; font-weight: bold;">
            <i class="fa-solid fa-retweet"></i> あなたがリポストしました
        </div>
        <div class="tweet-main">
            <div class="avatar"></div>
            <div class="tweet-content">
                <div class="tweet-user-info" style="position: relative;">
                    <span class="screen-name">${originalUser}</span>
                    <span class="user-id">${originalID}</span>
                    <span class="tweet-time">· リポスト</span>
                    <button class="tweet-delete-btn" onclick="deleteTweet(this)" style="position: absolute; right: 0; top: 0; background: none; border: none; color: #536471; cursor: pointer; font-size: 14px;"><i class="fa-regular fa-trash-can"></i></button>
                </div>
                <p class="tweet-text">${escapeHTML(originalText)}</p>
                <div class="tweet-actions">
                    <span class="action-item" onclick="toggleReplies(this)"><i class="fa-regular fa-comment"></i> <span class="count">0</span></span>
                    <span class="action-item reposted" onclick="handleNewRepostCancel('${tweetId}', this)"><i class="fa-solid fa-retweet"></i> <span class="count">1</span></span>
                    <span class="action-item" onclick="toggleTweetBookmark(this)"><i class="fa-regular fa-bookmark"></i> <span class="count">0</span></span>
                </div>
            </div>
        </div>
        <div class="replies-container" style="display:none;">
            <div class="reply-list"></div>
            <div class="reply-form">
                <input type="text" class="reply-input" placeholder="返信をポスト…">
                <button class="reply-submit-btn" onclick="submitReply(this)">返信</button>
            </div>
        </div>
    `;

    timelineList.insertBefore(newTweet, timelineList.firstChild);
    scrollToTop();
}

function handleNewRepostCancel(originalTweetId, currentElement) {
    const originalTweet = document.querySelector(`.tweet[data-tweet-id="${originalTweetId}"]`);
    if (originalTweet) {
        const originalRepostBtn = originalTweet.querySelector('.fa-retweet').parentElement;
        const originalCountSpan = originalRepostBtn.querySelector('.count');
        
        originalRepostBtn.classList.remove('reposted');
        originalRepostBtn.querySelector('.count').textContent = parseInt(originalCountSpan.textContent) - 1;
    }
    currentElement.closest('.tweet').remove();
}

// ==========================================
// ★ 共通ブックマーク（保存）処理ロジック
// ==========================================

// 1. タイムライン用ブックマーク
function toggleTweetBookmark(element) {
    const tweetEl = element.closest('.tweet');
    const tweetId = tweetEl.getAttribute('data-tweet-id') || tweetEl.getAttribute('data-repost-ref');
    
    const screenName = tweetEl.querySelector('.screen-name').innerText;
    const userId = tweetEl.querySelector('.user-id').innerText;
    const tweetText = tweetEl.querySelector('.tweet-text').innerText;

    const icon = element.querySelector('i');
    const countSpan = element.querySelector('.count');
    let count = parseInt(countSpan.innerText) || 0;

    let bookmarks = JSON.parse(localStorage.getItem('tl_bookmarks')) || [];
    const existsIndex = bookmarks.findIndex(item => item.id === tweetId);

    if (existsIndex > -1) {
        bookmarks.splice(existsIndex, 1);
        element.classList.remove('bookmarked');
        icon.className = 'fa-regular fa-bookmark';
        count--;
    } else {
        count++;
        bookmarks.push({ id: tweetId, name: screenName, user: userId, text: tweetText, count: count });
        element.classList.add('bookmarked');
        icon.className = 'fa-solid fa-bookmark';
    }

    countSpan.innerText = count;
    localStorage.setItem('tl_bookmarks', JSON.stringify(bookmarks));

    // 画面上に存在する同一の投稿（オリジナルとリポストなど）のUIを同期
    document.querySelectorAll(`[data-tweet-id="${tweetId}"], [data-repost-ref="${tweetId}"]`).forEach(el => {
        const bkmkBtn = el.querySelector('.fa-bookmark')?.parentElement;
        if (bkmkBtn && bkmkBtn !== element) {
            const bkmkIcon = bkmkBtn.querySelector('i');
            const bkmkCount = bkmkBtn.querySelector('.count');
            if (existsIndex > -1) {
                bkmkBtn.classList.remove('bookmarked');
                if(bkmkIcon) bkmkIcon.className = 'fa-regular fa-bookmark';
            } else {
                bkmkBtn.classList.add('bookmarked');
                if(bkmkIcon) bkmkIcon.className = 'fa-solid fa-bookmark';
            }
            if (bkmkCount) bkmkCount.innerText = count;
        }
    });
}

// 2. 動画用ブックマーク
function toggleVideoBookmark(element) {
    const videoCard = element.closest('.video-card');
    const videoId = videoCard.getAttribute('data-video-id');
    const videoUser = videoCard.querySelector('.video-user').innerText;
    const videoDesc = videoCard.querySelector('.video-desc').innerText;
    
    const videoTitle = videoCard.querySelector('.video-placeholder span')?.innerText || '[ おすすめ動画 ]';
    const videoTime = videoCard.querySelector('.time-value')?.innerText || '00:00';
    const videoStyle = videoCard.querySelector('.video-placeholder')?.style.background || '';
    const colorMatch = videoStyle.match(/#([a-fA-F0-9]{6}|[a-fA-F0-9]{3})/);
    const videoColor = colorMatch ? colorMatch[0] : '#1c9bf0';

    const icon = element.querySelector('i');
    const countSpan = element.querySelector('span'); 
    let count = parseInt(countSpan.innerText) || 0;

    let videoBookmarks = JSON.parse(localStorage.getItem('video_bookmarks')) || [];
    const existsIndex = videoBookmarks.findIndex(item => item.id === videoId);

    if (existsIndex > -1) {
        videoBookmarks.splice(existsIndex, 1);
        element.classList.remove('bookmarked');
        icon.className = 'fa-regular fa-bookmark';
        count--;
    } else {
        count++;
        videoBookmarks.push({ 
            id: videoId, 
            user: videoUser, 
            desc: videoDesc, 
            title: videoTitle, 
            time: videoTime, 
            color: videoColor,
            count: count 
        });
        element.classList.add('bookmarked');
        icon.className = 'fa-solid fa-bookmark';
    }

    countSpan.innerText = count;
    localStorage.setItem('video_bookmarks', JSON.stringify(videoBookmarks));
}

// 3. LocalStorageの情報からブックマークUIの表示状態を復元する
function restoreBookmarks() {
    // タイムラインの復元
    const tlBookmarks = JSON.parse(localStorage.getItem('tl_bookmarks')) || [];
    tlBookmarks.forEach(item => {
        document.querySelectorAll(`[data-tweet-id="${item.id}"], [data-repost-ref="${item.id}"]`).forEach(tweetEl => {
            const bookmarkIcon = tweetEl.querySelector('.fa-bookmark');
            if (bookmarkIcon) {
                bookmarkIcon.className = 'fa-solid fa-bookmark';
                const actionItem = bookmarkIcon.closest('.action-item');
                actionItem.classList.add('bookmarked');
                
                const countSpan = actionItem.querySelector('.count');
                if (countSpan) countSpan.innerText = item.count;
            }
        });
    });

    // 動画の復元
    const videoBookmarks = JSON.parse(localStorage.getItem('video_bookmarks')) || [];
    videoBookmarks.forEach(item => {
        const videoEl = document.querySelector(`[data-video-id="${item.id}"]`);
        if (videoEl) {
            const bookmarkIcon = videoEl.querySelector('.fa-bookmark');
            if (bookmarkIcon) {
                bookmarkIcon.className = 'fa-solid fa-bookmark';
                const vActionItem = bookmarkIcon.closest('.v-action-item');
                vActionItem.classList.add('bookmarked');
                
                const countSpan = vActionItem.querySelector('span');
                if (countSpan) countSpan.innerText = item.count;
            }
        }
    });
}

// ==========================================
// ★ 動画用コメント（返信）処理ロジック
// ==========================================
function toggleVideoReplies(element) {
    const videoCard = element.closest('.video-card');
    const container = videoCard.querySelector('.v-replies-container');
    const commentDotsBtn = videoCard.querySelector('.fa-comment-dots').parentElement;
    
    if (container.style.display === 'none' || container.style.display === '') {
        container.style.display = 'flex';
        commentDotsBtn.classList.add('comment-active');
        
        const replyList = videoCard.querySelector('.v-reply-list');
        replyList.scrollTop = replyList.scrollHeight;
    } else {
        container.style.display = 'none';
        commentDotsBtn.classList.remove('comment-active');
    }
}

function submitVideoReply(buttonElement) {
    const formElement = buttonElement.closest('.v-reply-form');
    const inputElement = formElement.querySelector('.v-reply-input');
    const replyText = inputElement.value.trim();
    
    if (!replyText) return;

    const videoCard = buttonElement.closest('.video-card');
    const replyList = videoCard.querySelector('.v-reply-list');

    const replyItem = document.createElement('div');
    replyItem.className = 'v-reply-item';
    replyItem.innerHTML = `
        <div class="v-reply-avatar"></div>
        <div class="v-reply-body">
            <div class="v-reply-user"><span class="screen-name">デザインサンプル</span> <span class="user-id" style="font-size:11px;">@design_test</span></div>
            <div class="v-reply-text">${escapeHTML(replyText)}</div>
        </div>
        <button class="v-reply-delete-btn" onclick="deleteVideoReply(this)"><i class="fa-regular fa-trash-can"></i></button>
    `;
    replyList.appendChild(replyItem);

    const commentActionItem = videoCard.querySelector('.fa-comment-dots').parentElement;
    const countSpan = commentActionItem.querySelector('span');
    countSpan.textContent = parseInt(countSpan.textContent) + 1;

    inputElement.value = '';
    replyList.scrollTo({ top: replyList.scrollHeight, behavior: 'smooth' });
}

function deleteVideoReply(deleteButton) {
    const replyItem = deleteButton.closest('.v-reply-item');
    const videoCard = deleteButton.closest('.video-card');
    
    replyItem.style.opacity = '0';
    replyItem.style.transition = 'opacity 0.2s ease';
    
    setTimeout(() => {
        replyItem.remove();
        
        const commentActionItem = videoCard.querySelector('.fa-comment-dots').parentElement;
        const countSpan = commentActionItem.querySelector('span');
        let currentCount = parseInt(countSpan.textContent) || 0;
        if (currentCount > 0) {
            countSpan.textContent = currentCount - 1;
        }
    }, 200);
}

// ==========================================
// ★ UI・ナビゲーション・セキュリティ・その他
// ==========================================
function switchMainTab(type, element) {
    document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('.main-tab-item').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.bottom-nav-item').forEach(item => item.classList.remove('active'));

    if (type === 'timeline') {
        document.getElementById('timelineSection').classList.add('active');
        document.getElementById('btnHome').classList.add('active');
        if(element) element.classList.add('active'); 
        else document.querySelectorAll('.main-tab-item')[0].classList.add('active');
    } else if (type === 'video') {
        document.getElementById('videoSection').classList.add('active');
        document.getElementById('btnVideo').classList.add('active');
        if(element) element.classList.add('active');
        else document.querySelectorAll('.main-tab-item')[1].classList.add('active');
        document.getElementById('videoFeed').scrollTop = 0;
    }
    scrollToTop();
}

function scrollToTop() {
    const mainTimeline = document.getElementById('mainTimeline');
    if (window.innerWidth <= 700 && mainTimeline) {
        mainTimeline.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function toggleDrawer(open) {
    const drawerOverlay = document.getElementById('drawerOverlay');
    const drawerMenu = document.getElementById('drawerMenu');
    if(drawerOverlay && drawerMenu){
        if (open) {
            drawerOverlay.classList.add('open');
            drawerMenu.classList.add('open');
        } else {
            drawerOverlay.classList.remove('open');
            drawerMenu.classList.remove('open');
        }
    }
}

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag));
}








