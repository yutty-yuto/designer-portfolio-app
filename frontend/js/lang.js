// デフォルト言語を localStorage or ブラウザ設定から取得
const lang = localStorage.getItem('lang') || (navigator.language.startsWith("en") ? "en" : "ja");

// 指定された言語ファイル(xx.json)を読み込み、各要素に適した言語の値を反映
export async function loadLanguage(lang) {
  const res = await fetch(`lang/${lang}.json`);
  return await res.json();
}

// 言語切り替えリンク
export async function setupLanguageToggle() {
  document.querySelectorAll('.language-toggle a').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const selectedLang = link.dataset.lang;
      if (selectedLang) {
        localStorage.setItem('lang', selectedLang);
        window.location.reload(); // ページ再読み込みで反映
      }
    });
  });
}

