import { CONFIG } from "./env.js";
const API_BASE = CONFIG.API_BASE;
const ADMIN_URL = CONFIG.ADMIN_URL;

// URLから ?code=xxx を抽出
const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get("code");

if (code) {
  fetch(`${API_BASE}/auth/exchange-code/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify({ code })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        window.location.href = ADMIN_URL;
      }
    })
    .catch(err => {
      console.error("❌ Token exchange error:", err);
    });
}
