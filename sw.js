// sw.js

// Service Workerがインストールされたときに実行されるイベント
self.addEventListener('install', (event) => {
  console.log('Service Worker: インストールされました');
});

// Service Workerがアクティブになったときに実行されるイベント
self.addEventListener('activate', (event) => {
  console.log('Service Worker: アクティブ化されました');
});

// ページのリクエスト（通信）をインターセプトするイベント
self.addEventListener('fetch', (event) => {
  // ここにキャッシュの処理などを書きますが、まずはそのままスルー
  console.log('Fetchリクエスト:', event.request.url);
});