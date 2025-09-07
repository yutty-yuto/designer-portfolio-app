import { fetchWorkById, fetchFavorite } from "/js-dist/api.js";
import { getFavorites, updateLocalFavorites } from "./favorite.js";
import { loadLanguage, setupLanguageToggle } from "./lang.js";
import { CONFIG } from "./env.js";

// CloudFrontへのアクセスのため、相対パス(/media/)に置換
const toMediaUrl = (u) => (u ? u.replace(/^https?:\/\/api\.ana-flaherty\.com/, '') : u);

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const workId = params.get('id');
  const favorites = getFavorites();

  if (!workId) {
    alert("作品のIDが見つかりません");
    return;
  }

  const work = await fetchWorkById(workId);

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
  
  // 中身リセット
  const contactSectionDiv = document.querySelector('.contact-section');
  contactSectionDiv.innerHTML = '';
  const contactLink = document.querySelector('.link-bottom');
  contactLink.innerHTML = '';

  const mailA = document.createElement('a');
  mailA.className = 'mail-link';
  const emailForButton = CONFIG.EMAIL;
  const subjectForButton = encodeURIComponent('Portfolio Website');
  const bodyForButton = encodeURIComponent(
    `Hello, my name is [Your Name].\n` +
    `I would like to make an inquiry regarding the following:\n\n` +
    `■ Project details (e.g. logo design, poster design, etc.):\n\n` +
    `■ Desired deadline:\n\n` +
    `■ Budget (optional):\n\n` +
    `■ Other requests or notes:`
  );
  mailA.href = `mailto:${emailForButton}?subject=${subjectForButton}&body=${bodyForButton}`;
  mailA.textContent = texts.social.emailButton;

  const mailIcon = document.createElement('img');
  mailIcon.src = 'img/email.svg';
  mailIcon.className = 'contactIcon';

  mailA.appendChild(mailIcon);

  // 挿入
  contactSectionDiv.appendChild(mailA);

  document.getElementById('work-title').textContent = work.title;
  document.getElementById('work-description').textContent = work.description;
  
  const mainImg = document.getElementById('main-image');
  // mainImg.src = work.main_image.image_file;
  mainImg.src = toMediaUrl(work.main_image.image_file) ?? 'img/placeholder.png';
  mainImg.alt = work.title;
  mainImg.className = 'main-image';

  contactLink.textContent = texts.contact.message;

  // 作品制作依頼のメールリンクを作成
  const emailForLink = CONFIG.EMAIL;
  const subjectForLink = encodeURIComponent('Portfolio Website');
  const bodyForLink = encodeURIComponent(
    `Hello, my name is [Your Name].\n` +
    `I would like to make an inquiry regarding the following:\n\n` +
    `■ Project details (e.g. logo design, poster design, etc.):\n\n` +
    `■ Desired deadline:\n\n` +
    `■ Budget (optional):\n\n` +
    `■ Other requests or notes:`
  );
  const href = `mailto:${emailForLink}?subject=${subjectForLink}&body=${bodyForLink}`;
  document.getElementById('contact-link').setAttribute('href', href);

  // いいねアイコン作成
  const contactDiv = document.querySelector('.contact-section');
  const mailLinkDiv = document.querySelector('.mail-link');
  const heart = document.createElement('img');
  
  heart.className = 'like-icon';
  heart.dataset.workId = work.id;

  // いいね判別機能の呼び出し(ログイン機能導入時に削除予定)
  const isLiked = favorites.includes(work.id);
  heart.src = isLiked ? 'img/heart_liked.svg' : 'img/heart_gray_outline.svg';
  heart.dataset.liked = isLiked ? 'true' : 'false';

  heart.addEventListener('click', async (event) => {
    const workId = Number(heart.dataset.workId);
    const liked = heart.dataset.liked === 'true';
    const method = liked ? 'DELETE' : 'POST';
    const newSrc = liked ? 'img/heart_gray_outline.svg' : 'img/heart_liked.svg';
    
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

  contactDiv.insertBefore(heart, mailLinkDiv);

  // 作品の画像数分、imgタグを作成
  const imgContainer = document.getElementById('gallery');
  work.images.forEach(img => {
    const imgElem = document.createElement('img');
    // imgElem.src = img.image_file;
    imgElem.src = toMediaUrl(img.image_file) ?? 'img/placeholder.png';
    imgElem.alt = img.purpose;
    imgElem.className = 'works-image';
    imgContainer.appendChild(imgElem);
  });

  // 作品画像ごとのアスペクト比を層的に取得
  document.querySelectorAll('.works-image').forEach(img => {
    img.onload = () => {
      img.style.aspectRatio = img.naturalWidth / img.naturalHeight;
    };
  });

  // 高値取引作品への購入依頼用リンク
  if (work.is_high_value) {
    const instagramLink = document.createElement('a');
    instagramLink.href = 'https://www.instagram.com/taichis.slunks/?igsh=OWdydWJuMHYwcDl2#';
    instagramLink.className = 'instagram-link';
    instagramLink.textContent = 'Purchase this product via Instagram';
    instagramLink.target = '_blank'
    instagramLink.textContent = texts.social.instagramButton;

    const instagramIcon = document.createElement('img');
    instagramIcon.src = 'img/instagram.svg';
    instagramIcon.className = 'contactIcon';

    instagramLink.appendChild(instagramIcon);
    contactDiv.insertBefore(instagramLink, mailLinkDiv)

    const br = document.createElement('br');
    contactDiv.insertBefore(br, mailLinkDiv);
  }
});