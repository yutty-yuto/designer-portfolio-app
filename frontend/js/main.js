import { fetchWorks, fetchFavorite } from "./api.js";
import { updateLocalFavorites } from "./favorite.js";
import { loadLanguage, setupLanguageToggle } from "./lang.js";
import { CONFIG } from "./env.js";

document.addEventListener('DOMContentLoaded', async () => {
  const works = await fetchWorks();
  if (works.error) {
    alert(works.error);
    return;
  }
  const container = document.getElementsByClassName('works-grid')[0];
  const favorites = JSON.parse(localStorage.getItem('my_favorites') || '[]');

  // ローカルストレージの言語から、その言語に適した値を取得
  const lang = localStorage.getItem('lang') || (navigator.language.startsWith('en') ? 'en' : 'ja');
  const texts = await loadLanguage(lang);

  // 現在、選択中の言語のスタイルを強調する
  document.querySelectorAll('.language-toggle a').forEach(link => {
    if (link.dataset.lang === lang) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  // 言語切り替えのクリックイベントをセット
  setupLanguageToggle();

  // リセット処理：旧要素を削除
  document.querySelector('.text').innerHTML = '';
  document.querySelectorAll('.info-card.personal').innerHTML = '';
  document.querySelectorAll('.info-title').innerHTML = '';
  document.querySelectorAll('.info-text.contact').innerHTML = '';

  const mailLink = document.querySelector('.mail-link');
  const icon = mailLink.querySelector('.contactIcon');
  mailLink.textContent = '';

  // 作品制作依頼のメールリンクを作成
  const email = CONFIG.EMAIL;
  const subject = encodeURIComponent('Portfolio Website');
  const body = encodeURIComponent(
    `Hello, my name is [Your Name].\n` +
    `I would like to make an inquiry regarding the following:\n\n` +
    `■ Project details (e.g. logo design, poster design, etc.):\n\n` +
    `■ Desired deadline:\n\n` +
    `■ Budget (optional):\n\n` +
    `■ Other requests or notes:`
  );
  const href = `mailto:${email}?subject=${subject}&body=${body}`;
  document.getElementById('contact-link').setAttribute('href', href);

  // ページ（HTML・DOM）が完全に読み込まれた後に、Googleログインの初期設定とスクリプトの読み込みを行う
    // Googleログインの初期設定
  const clientDiv = document.getElementById('g_id_onload');
  clientDiv.dataset.client_id = CONFIG.GOOGLE_CLIENT_ID;
  clientDiv.dataset.callback = 'handleCredentialResponse'; // Googleログイン成功後にIDトークンを受け取るコールバック関数を指定
  clientDiv.dataset.auto_prompt = 'false'; // ログインの自動ポップアップを無効にし、ユーザー操作でのみログインを表示

    // GSIスクリプトを動的に読み込み（dataset属性の設定後に読み込む）
  const script = document.createElement('script');
  script.src = 'https://accounts.google.com/gsi/client';
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);

  // 概要
  document.querySelector('.text').textContent = texts.introduction;

  // Emailボタン
  mailLink.textContent = texts.contact.button;
  mailLink.appendChild(icon);

  // プロフィール
  const profileDiv = document.querySelector('.profile-info');

  Object.entries(texts.profile).forEach(([key, obj]) => {
    const div = document.createElement('div');
    div.className = 'info-row';

    const spanLabel = document.createElement('span');
    spanLabel.className = 'info-label';
    spanLabel.textContent = obj.label;

    const spanValue = document.createElement('span');
    spanValue.className = 'info-value';
    spanValue.textContent = obj.value;

    div.appendChild(spanLabel);
    div.appendChild(spanValue);
    profileDiv.appendChild(div);
  });
  
  // ABOUT ME
  document.querySelector('.info-title.aboutme').textContent = texts.about.label
  document.querySelector('.info-text.aboutme').textContent = texts.about.value

  // PERSONAL SKILL
  const personalDiv = document.querySelector('.info-card.personal');
  const personalLabel = document.querySelector('.info-title.personal');
  personalLabel.textContent = texts.personalskill.label;

  texts.personalskill.values.forEach((value) => {
    const p = document.createElement('p');
    p.className = 'info-text';
    p.textContent = value;
    personalDiv.appendChild(p);
  });

  // EDUCATION
  document.querySelector('.info-title.education').textContent = texts.education.label;
  const educationUl = document.querySelector('.info-text.education');
  texts.education.values.forEach((value) => {
    const li = document.createElement('li');
    li.textContent = value;
    educationUl.appendChild(li);
  });

  // CREATIVE FIELD
  const creativeDiv = document.querySelector('.info-card.creative');
  const createLabel = document.querySelector('.info-title.creative');
  createLabel.textContent = texts.creativefield.label;

  texts.creativefield.values.forEach((value) => {
    const p = document.createElement('p');
    p.className = 'info-text';
    p.textContent = value;
    creativeDiv.appendChild(p);
  });

  // EXPERIENCE
  document.querySelector('.info-title.experience').textContent = texts.experience.label
  document.querySelector('.info-text.experience').textContent = texts.experience.value

  // CONTACT
  const contactDiv = document.querySelector('.info-card.contact');
  const contactLabel = document.querySelector('.info-title.contact');
  contactLabel.textContent = texts.contact.label;

  const contactP = document.querySelector('.info-text.contact');

  const instaIcon = document.createElement('i');
  instaIcon.className = 'fab fa-instagram';
  contactP.appendChild(instaIcon);
  contactP.append(' ' + texts.contact.value1);
  contactP.appendChild(document.createElement('br'));

  const mailIcon = document.createElement('i');
  mailIcon.className = 'fab fa-instagram';
  contactP.appendChild(mailIcon);
  contactP.append(' ' + texts.contact.value2);

  // SOFTWARE
  const softwareDiv = document.querySelector('.info-card.software');
  const softwareLabel = document.querySelector('.info-title.software');
  softwareLabel.textContent = texts.software.label;

  texts.software.values.forEach((value) => {
    const p = document.createElement('p');
    p.className = 'info-text';
    p.textContent = value;
    softwareDiv.appendChild(p);
  });

  // 作品データ関連
  works.forEach(work => {

    // aタグを作成
    const card = document.createElement('a');
    card.href = `detail.html?id=${work.id}`;
    card.className = 'work-card';

    // imgタグを作成
    const img = document.createElement('img');
    img.src = work.main_image?.image_file
    console.log(img.src);
    img.alt = work.title;
    img.className = 'work-pic';

    // いいねアイコンを作成
    const heart = document.createElement('img');
    heart.className = 'like-icon';
    heart.dataset.workId = work.id;
    heart.style.width = '1.5rem';
    heart.style.height = '1.5rem';
    heart.style.color = '#black';
    
    // いいね判別機能の呼び出し(ログイン機能導入時に削除予定)
    const isLiked = favorites.includes(work.id);
    heart.src = isLiked ? 'img/heart_liked.svg' : 'img/heart.svg';
    heart.dataset.liked = isLiked ? 'true' : 'false';

    heart.addEventListener('click', async (event) => {
      // 親aタグのクリックを止める(detail.htmlに飛ばないように)
      event.preventDefault();
      event.stopPropagation();
      
      const workId = Number(heart.dataset.workId);
      const liked = heart.dataset.liked === 'true';
      const method = liked ? 'DELETE' : 'POST';
      const newSrc = liked ? 'img/heart.svg' : 'img/heart_liked.svg';

      await fetchFavorite(workId, method);
      heart.src = newSrc;
      heart.dataset.liked = liked ? 'false' : 'true';
      
      // アニメーション
      heart.classList.remove('pop-animation');
      void heart.offsetWidth;
      heart.classList.add('pop-animation');

      // いいね保存機能の呼び出し(ログイン機能導入時に削除予定)
      updateLocalFavorites(workId, !liked);
    });

    // pタグを作成
    const title = document.createElement('p');
    title.textContent = work.title;
    title.className = 'work-title';
    console.log('中身：', title);

    card.appendChild(img);
    card.appendChild(heart);

    card.appendChild(title);
    
    container.appendChild(card);
  });
});