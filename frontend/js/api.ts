import { CONFIG } from "./env.js";
import type { Lang, Method, Work, Favorite } from "./types";

const API_BASE = CONFIG.API_BASE;
const lang = (localStorage.getItem('lang') ?? 'en') as Lang;

// 共通のfetch(ジェネリクス)
export async function fetchJSON<T>(url: string, init?: RequestInit): Promise<T> {
  // 渡された関数(APIのURLとリクエスト情報)で、APIを叩く
  const res = await fetch(url, init);
  // ステータスが成功(200番)以外の場合は、例外発生で処理を中断する
  if (!res.ok) {
    throw new Error(`HTTP Error: ${res.status}`);
  }
  // ステータスが成功であれば、JSONデータを返す
  return res.json() as Promise<T>;
}

// 作品一覧を取得するAPIを叩く関数
export function fetchWorks(): Promise<Work[]> {
  // 共通fetchの呼び出し結果(Promise<Work[]>)を返す
  return fetchJSON<Work[]>(`${API_BASE}/works/`, {
    headers: { 'Accept-Language': lang }
  });
}

// 作品詳細を取得するAPIを叩く関数
export function fetchWorkById(id: number): Promise<Work> {

  return fetchJSON<Work>(`${API_BASE}/works/${id}/`, {
    headers: { 'Accept-Language': lang }
  })
}

// いいねをするAPIを叩く関数
export async function fetchFavorite(workId: number, method: Method) {
  return fetchJSON<Favorite>(`${API_BASE}/favorite/`, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ work: workId }),
  })
}
