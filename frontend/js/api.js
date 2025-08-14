import { CONFIG } from "./env.js";
const API_BASE = CONFIG.API_BASE;

export async function fetchWorks() {
  const lang = localStorage.getItem('lang') || 'en';

  try {
    const res = await fetch(`${API_BASE}/works/?lang=${lang}`,{
      headers: { 'Accept-Language': lang }
    });

    if (!res.ok) {
      throw new Error(`HTTP Error: ${res.status}`);
    }
    return await res.json();
    
  } catch (err) {
    console.error("通信エラー: ", err);
    return { error: "通信に失敗しました。"};
  }

}

export async function fetchWorkById(id) {
  const lang = localStorage.getItem('lang') || 'en';

  try {
    const res = await fetch(`${API_BASE}/works/${id}/?lang=${lang}`, {
      headers: { 'Accept-Language': lang }
    });

    if (!res.ok) {
      throw new Error(`HTTP Error: ${res.status}`);
    }
    return await res.json();

  } catch (err) {
    console.error("通信エラー: ", err);
    return { error: "通信に失敗しました。"};
  }
}

export async function fetchFavorite(workId, method) {
  try {
    const res = await fetch(`${API_BASE}/favorite/`, {
      method: method,
      headers: { 
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ work: workId }),
    });
    
    if (!res.ok) {
      throw new Error(`HTTP Error: ${res.status}`);
    }

    return await res.json();

  } catch (err) {
    console.error("通信エラー: ", err);
    return { error: "通信に失敗しました。"};
  }
}