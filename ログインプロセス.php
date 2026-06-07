<?php
session_start();

// 1. XAMPPのデータベース接続設定
$host     = 'localhost';
$dbname   = 'new_world_db'; // 独自に作成するデータベース名
$username = 'root';         // XAMPPのデフォルトユーザー
$password = '';             // XAMPPのデフォルトはパスワード空

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    ]);
} catch (PDOException $e) {
    $_SESSION['login_error'] = "データベース接続エラーが発生しました。";
    header('Location: index.php');
    exit;
}

// 2. フォームデータの受け取り
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $user_input = trim($_POST['username'] ?? '');
    $pass_input = $_POST['password'] ?? '';

    if (empty($user_input) || empty($pass_input)) {
        $_SESSION['login_error'] = "すべての項目を入力してください。";
        header('Location: index.php');
        exit;
    }

    // 3. ユーザー名、またはメールアドレスでデータベースを検索
    $sql = "SELECT * FROM users WHERE username = :user_input OR email = :email_input LIMIT 1";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([
        ':user_input'  => $user_input,
        ':email_input' => $user_input
    ]);
    $user = $stmt->fetch();

    // 4. 認証処理
    // ※ データベースの password カラムには password_hash() で暗号化した文字列が入っている前提です
    if ($user && password_verify($pass_input, $user['password'])) {
        
        // ログイン成功：セッションに情報を保持
        $_SESSION['user_id']   = $user['id'];
        $_SESSION['username']  = $user['username'];
        $_SESSION['is_first_login'] = $user['is_first_login']; // 初回フラグ

        // 初回ログイン（決済が必要）かどうかの判定
        if ($user['is_first_login'] == 1) {
            // ダミーの決済画面、または決済処理スクリプトへ
            // 実装例として、ここではそのまま「決済承認アラート代わりの確認ページ」などに飛ばすか、完了画面へ
            header('Location: payment_mock.php'); 
        } else {
            // 2回目以降はメインダッシュボードへ
            header('Location: dashboard.php');
        }
        exit;
    } else {
        // ログイン失敗
        $_SESSION['login_error'] = "ユーザー名、またはパスワードが正しくありません。";
        header('Location: index.php');
        exit;
    }
} else {
    // 直接アクセスされた場合はログイン画面へ戻す
    header('Location: index.php');
    exit;
}



