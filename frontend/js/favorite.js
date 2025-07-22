// ローカルストレージからいいねを取得(ログイン機能導入時に削除予定)
export function getFavorites() {
  return JSON.parse(localStorage.getItem('my_favorites') || '[]');
}

// 指定した作品が「いいね済み」かどうか判定(ログイン機能導入時に削除予定)
export function isLikedLocally(workId) {
  const favorites = getFavorites();
  return favorites.includes(workId);
}

// ローカルストレージを更新(ログイン機能導入時に削除予定)
export function updateLocalFavorites(workId, isLiked) {
  let favorites = getFavorites();

  // いいねがされた、かつ いいねリストに今回いいねした作品IDが存在しない場合、いいねを追加
  if (isLiked && !favorites.includes(workId)) {
    favorites.push(workId);
  
  // いいねを取り消した場合、いいねリストから取り消した作品IDを削除(取り消した作品ID以外のいいねリストに更新)
  } else if (!isLiked) {
    favorites = favorites.filter(id => id !== workId);
  }

  localStorage.setItem('my_favorites', JSON.stringify(favorites));
}