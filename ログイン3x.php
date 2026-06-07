<?php
session_start();
// すでにログインしている場合は、メインコンテンツ等のページへリダイレクト（例: dashboard.php）
// if (isset($_SESSION['user_id'])) { header('Location: dashboard.php'); exit; }

$error_message = '';
if (isset($_SESSION['login_error'])) {
    $error_message = $_SESSION['login_error'];
    unset($_SESSION['login_error']); // 1度表示したら消去
}
?>
<!DOCTYPE html>
<html lang="ja">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New World ログイン</title>
    <style>
        body {
            font-family: 'Helvetica Neue', Arial, sans-serif;
            background: linear-gradient(135deg, #1e1e2f, #2a2a40);
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            color: #fff;
            position: relative;
            overflow: hidden;
        }

        /* 左上配置の規約表示ボタン */
        .modal-trigger-btn {
            position: absolute;
            top: 15px;
            left: 20px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            color: #fff;
            padding: 8px 12px;
            border-radius: 10px;
            font-size: 13px;
            cursor: pointer;
            backdrop-filter: blur(5px);
            transition: all 0.3s ease;
            z-index: 10;
        }

        .modal-trigger-btn:hover {
            background: rgba(255, 255, 255, 0.2);
            border-color: #00adb5;
            box-shadow: 0 0 10px rgba(0, 173, 181, 0.3);
        }

        /* ログインコンテナ */
        .login-container {
            background: rgba(255, 255, 255, 0.05);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 40px;
            border-radius: 16px;
            box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
            width: 350px;
            text-align: center;
            z-index: 1;
        }

        h2 {
            margin-bottom: 10px;
            font-size: 24px;
            letter-spacing: 1px;
        }

        .notice-badge {
            background-color: #ff4757;
            color: white;
            padding: 6px 12px;
            border-radius: 20px;
            font-size: 12px;
            font-weight: bold;
            display: inline-block;
            margin-bottom: 25px;
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }

        /* PHPエラーメッセージ用スタイル */
        .error-badge {
            background-color: #ff6b6b;
            color: white;
            padding: 10px;
            border-radius: 8px;
            font-size: 13px;
            margin-bottom: 15px;
            text-align: left;
        }

        .input-group {
            margin-bottom: 20px;
            text-align: left;
        }

        label {
            display: block;
            font-size: 12px;
            color: #aaa;
            margin-bottom: 5px;
        }

        /* パスワード用の相対位置コンテナ */
        .password-wrapper {
            position: relative;
            display: flex;
            align-items: center;
            width: 100%;
        }

        input {
            width: 100%;
            padding: 12px;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 8px;
            color: white;
            font-size: 14px;
            box-sizing: border-box;
            transition: 0.3s;
        }

        /* ボタンと被らないようにパスワード入力欄の右側に余白を持たせる */
        .password-wrapper input {
            padding-right: 45px;
        }

        input:focus {
            outline: none;
            border-color: #00adb5;
            background: rgba(255, 255, 255, 0.15);
        }

        /* トグルボタンのスタイル */
        .toggle-password {
            position: absolute;
            right: 12px;
            background: none;
            border: none;
            color: #aaa;
            cursor: pointer;
            padding: 4px;
            font-size: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: color 0.2s;
            user-select: none;
        }

        .toggle-password:hover {
            color: #00adb5;
        }

        .fee-info {
            background: rgba(255, 71, 87, 0.1);
            border: 1px dashed #ff4757;
            padding: 12px;
            border-radius: 8px;
            font-size: 13px;
            color: #ff6b81;
            margin-bottom: 25px;
            line-height: 1.4;
            text-align: left;
        }

        .login-btn {
            width: 100%;
            padding: 14px;
            background: linear-gradient(90deg, #00adb5, #007880);
            border: none;
            border-radius: 8px;
            color: white;
            font-size: 16px;
            font-weight: bold;
            cursor: pointer;
            transition: 0.3s;
        }

        .login-btn:hover {
            filter: brightness(1.2);
            box-shadow: 0 0 15px rgba(0, 173, 181, 0.4);
        }

        .footer-text {
            margin-top: 20px;
            font-size: 11px;
            color: #666;
        }

        /* --- モーダルウィンドウのスタイル --- */
        .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            background: rgba(0, 0, 0, 0.6);
            backdrop-filter: blur(8px);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 100;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s ease;
        }

        .modal-overlay.is-active {
            opacity: 1;
            pointer-events: auto;
        }

        .modal-content {
            background: #222235;
            border: 1px solid rgba(255, 255, 255, 0.1);
            width: 90%;
            max-width: 750px;
            height: 80vh;
            border-radius: 16px;
            box-shadow: 0 20px 50px rgba(0,0,0,0.5);
            display: flex;
            flex-direction: column;
            position: relative;
            transform: translateY(-20px);
            transition: transform 0.3s ease;
            color: #e0e0e0;
        }

        .modal-overlay.is-active .modal-content {
            transform: translateY(0);
        }

        .modal-header {
            padding: 20px 30px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .modal-title {
            margin: 0;
            font-size: 20px;
            color: #00adb5;
            font-weight: bold;
        }

        .modal-close-btn {
            background: none;
            border: none;
            color: #aaa;
            font-size: 28px;
            cursor: pointer;
            line-height: 1;
            padding: 0;
            transition: color 0.2s;
        }

        .modal-close-btn:hover {
            color: #ff4757;
        }

        .modal-body {
            padding: 30px;
            overflow-y: auto;
            font-size: 14px;
            line-height: 1.7;
            text-align: left;
        }

        .modal-body h2 {
            font-size: 18px;
            color: #fff;
            border-left: 4px solid #00adb5;
            padding-left: 12px;
            margin-top: 30px;
            margin-bottom: 15px;
            text-align: left;
            letter-spacing: 0;
        }

        .modal-body h3 {
            font-size: 15px;
            color: #00adb5;
            margin-top: 20px;
            margin-bottom: 10px;
        }

        .intro-text {
            color: #bbb;
            font-size: 14px;
            margin-bottom: 25px;
        }

        .modal-body table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
            font-size: 13px;
            background: rgba(255, 255, 255, 0.02);
        }

        .modal-body th, .modal-body td {
            border: 1px solid rgba(255, 255, 255, 0.1);
            padding: 12px 15px;
        }

        .modal-body th {
            background-color: rgba(255, 255, 255, 0.05);
            color: #fff;
            width: 30%;
            font-weight: bold;
        }

        .modal-body td {
            color: #ccc;
        }

        .modal-body td a {
            color: #00adb5;
            text-decoration: none;
        }
        
        .modal-body td a:hover {
            text-decoration: underline;
        }

        .modal-body ol, .modal-body ul {
            margin: 0 0 20px 0;
            padding-left: 20px;
        }

        .modal-body li {
            margin-bottom: 8px;
        }

        .nested-list {
            list-style-type: disc;
            margin-top: 8px !important;
        }

        .terms-text {
            color: #ccc;
            margin-bottom: 15px;
        }

        .modal-footer {
            padding: 15px 30px;
            border-top: 1px solid rgba(255, 255, 255, 0.1);
            text-align: center;
            font-size: 12px;
            color: #666;
        }
    </style>
</head>
<body>

<button class="modal-trigger-btn" onclick="openModal()">利用規約<br>特定商取引法</button>

<div class="login-container">
    <h2>ログイン</h2>
    <div class="notice-badge">初回ログインには、ドレスコードが必要です。
        <br>※初回ログイン以降は必要ありません。
    </div>

    <?php if (!empty($error_message)): ?>
        <div class="error-badge">
            <?= htmlspecialchars($error_message, ENT_QUOTES, 'UTF-8') ?>
        </div>
    <?php endif; ?>

    <form action="login_process.php" method="POST">
        <div class="input-group">
            <label for="username">ユーザー名 / メールアドレス</label>
            <input type="text" name="username" id="username" placeholder="example@domain.com" required>
        </div>

        <div class="input-group">
            <label for="password">パスワード</label>
            <div class="password-wrapper">
                <input type="password" name="password" id="password" placeholder="••••••••" required>
                <button type="button" class="toggle-password" id="togglePassword" onclick="togglePasswordVisibility()">👁️</button>
            </div>
        </div>

        <div class="fee-info">
            <strong>【ご案内】</strong><br>
            本システムへの初回ログイン時のみ、<br>
            <strong>初期費用 500円（税込）</strong> の決済が必要です。
        </div>

        <button type="submit" class="login-btn">500円を支払ってログイン</button>
    </form>

    <div class="footer-text">
        ※2回目以降のログインに費用はかかりません。
    </div>
</div>

<div class="modal-overlay" id="termsModal" onclick="closeModalOutside(event)">
    <div class="modal-content">
        <div class="modal-header">
            <h3 class="modal-title">サービス情報</h3>
            <button class="modal-close-btn" onclick="closeModal()">&times;</button>
        </div>
        
        <div class="modal-body">
            <h2>特定商取引法に基づく表記</h2>
            <table>
                <tbody>
                    <tr>
                        <th>販売業社の名称</th>
                        <td>株式会社 暴風プロジェクト</td>
                    </tr>
                    <tr>
                        <th>所在地</th>
                        <td>請求があったら遅延なく開示します。</td>
                    </tr>
                    <tr>
                        <th>電話番号</th>
                        <td>請求があったら遅延なく開示します。</td>
                    </tr>
                    <tr>
                        <th>メールアドレス</th>
                        <td><a href="mailto:tantantarou99@gmail.com">tantantarou99@gmail.com</a></td>
                    </tr>
                    <tr>
                        <th>運営統括責任者</th>
                        <td>リンクリンカーくん</td>
                    </tr>
                    <tr>
                        <th>追加手数料等の追加料金</th>
                        <td>
                            <ul>
                                <li>手数料なし。</li>
                                <li>Episodeの進行状況に応じて、別途・追加課金制。</li>
                            </ul>
                        </td>
                    </tr>
                    <tr>
                        <th>交換および返品<br>（返金ポリシー）</th>
                        <td>
                            <strong>＜お客様都合の返品・交換の場合＞</strong><br>
                            発送処理前の商品：ウェブサイトのキャンセルボタンを押すことで注文のキャンセルが可能です。<br><br>
                            発送処理後の商品：注文後の商品は、返品・交換はお受けしておりません。<br><br>
                            <strong>＜商品に不備がある場合＞</strong><br>
                            当社の送料負担にて返金又は新しい商品と交換いたします。
                        </td>
                    </tr>
                    <tr>
                        <th>引渡時期</th>
                        <td>注文後すぐにご利用いただけます。</td>
                    </tr>
                    <tr>
                        <th>受け付け可能な決済手段</th>
                        <td>クレジットカード/コンビニ決済</td>
                    </tr>
                    <tr>
                        <th>決済期間</th>
                        <td>決済後ただちに処理されます。</td>
                    </tr>
                    <tr>
                        <th>販売価格</th>
                        <td>¥ 各商品ページに記載の金額（消費税込み）</td>
                    </tr>
                </tbody>
            </table>

            <h2>サービス利用規約</h2>
            <p class="terms-text">
                この利用規約（以下、「本規約」といいます。）は、株式会社 暴風プロジェクト（以下、「当社」といいます。）が提供するウェブサイトおよび関連サービス（以下、「本サービス」といいます。）の利用に関する条件を定めるものです。
            </p>
            <h3>第1条（適用）</h3>
            <ol>
                <li>本規約は、ユーザーと当社との間の本サービスの利用に関わる一切の関係に適用されるものとします。</li>
            </ol>
            <h3>第2条（利用料金および支払方法）</h3>
            <ol>
                <li>本サービスの有料部分の利用料金は、当社が別途定める料金表に基づき、ユーザーが支払うものとします。</li>
            </ol>
            <h3>第3条（禁止事項）</h3>
            <ol>
                <li>法令または公序良俗に違反する行為</li>
                <li>電波犯罪（不正電波利用、ジャミング、迷惑電波発信等）</li>
                <li>サイバー犯罪（不正アクセス、クラッキング、フィッシング等）</li>
            </ol>
        </div>

        <div class="modal-footer">
            &copy; 2024 <strong>リンクリンカーくん</strong> All Rights Reserved.
        </div>
    </div>
</div>

<script>
    // パスワードの表示/非表示切り替え処理
    function togglePasswordVisibility() {
        const passwordInput = document.getElementById('password');
        const toggleButton = document.getElementById('togglePassword');
        
        if (passwordInput.type === 'password') {
            passwordInput.type = 'text';
            toggleButton.textContent = '🙈';
        } else {
            passwordInput.type = 'password';
            toggleButton.textContent = '👁️';
        }
    }

    // モーダルを開く
    function openModal() {
        document.getElementById('termsModal').classList.add('is-active');
    }

    // モーダルを閉じる
    function closeModal() {
        document.getElementById('termsModal').classList.remove('is-active');
    }

    // モーダルの外側（背景）をクリックしたときも閉じる
    function closeModalOutside(event) {
        if (event.target.id === 'termsModal') {
            closeModal();
        }
    }
</script>
</body>
</html>



