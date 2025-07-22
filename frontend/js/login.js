import { CONFIG } from "./env.js";
const API_BASE = CONFIG.API_BASE;
const ADMIN = CONFIG.ADMIN_URL;
console.log("API_BASE：", API_BASE);
console.log("ADMIN：", ADMIN);

function handleCredentialResponse(response) {
  fetch(API_BASE + "/auth/google/", {
    method: "POST",
    credentials: "include", // クラアントとサーバーでCookieの送受信をブラウザに許可
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_token: response.credential }), // JSON変換されたIDトークン(Googleログイン情報)をPOSTメソッドのbodyにのせる
  })
  .then(res => res.json()) // JSONデータをJSオブジェクトに変換
  .then(data => {
    if (data.success) {
      window.location.href = ADMIN;
    } else {
      alert("ログインできません");
    }
  })
  .catch(err => {
    console.error("ログイン中にエラーが発生しました: ", err);
    alert("通信中にエラーが発生しました。ネットワークを確認してください。");
  });
};

// グローバルスコープに登録
window.handleCredentialResponse = handleCredentialResponse;