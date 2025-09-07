## 使用技術一覧
<p>
  <!-- バックエンド -->
  <img src="https://img.shields.io/badge/Django-092E20?logo=django&logoColor=white&style=for-the-badge">
  <img src="https://img.shields.io/badge/Django%20REST%20Framework-092E20?logo=django&logoColor=white&style=for-the-badge">
  <img src="https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white&style=for-the-badge">

  <!-- フロントエンド -->
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black&style=for-the-badge">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white&style=for-the-badge">
  <img src="https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white&style=for-the-badge">
  <img src="https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white&style=for-the-badge">

  <!-- DB -->
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white&style=for-the-badge">

  <!-- インフラ -->
  <img alt="AWS" src="https://img.shields.io/static/v1?label=&message=AWS&logo=amazonaws&logoColor=FF9900&color=232F3E&style=for-the-badge&logoWidth=20">
</p>

## 本番環境URL
[![ポートフォリオサイトを開く](https://img.shields.io/static/v1?label=ポートフォリオサイトを開く&message=ana-flaherty.com&color=2ea44f&style=for-the-badge)](https://ana-flaherty.com)


## 目次
1. [プロジェクトについて](#プロジェクトについて)
2. [スクリーンショット](#スクリーンショット)
3. [環境](#環境)
4. [工夫したポイント](#工夫したポイント)

## プロジェクト名
デザイナー用ポートフォリオWebアプリ

## プロジェクトについて
- デザイナーの作品を展示できるポートフォリオサイト
- 将来的な販売機能を見据えた構成
- PC・スマホ対応、ミニマルデザイン
- 英語・日本語の多言語対応

## スクリーンショット
<p align="center">
  <img src="docs/screenshots/pc.png" width="900" alt="ホーム画面(PC)">
</p>
<p align="center">
  <img src="docs/screenshots/iphone.png" width="360" alt="ホーム画面(スマホ)">
</p>

## ショートデモ
[▶ デモをみる（約30秒）](https://ana-flaherty.com/media/portfolio-demo.v1.mp4)

## 環境
| 言語・フレームワーク  | バージョン |
| ---------------------- | ---------- |
| Python                 | 3.10.9     |
| Django                 | 5.0.14     |
| Django REST Framework  | 3.16.0     |
| JavaScript (Vanilla)   | ES6+       |
| TypeScript             | 5.3.3      |
| HTML                   | 5          |
| CSS                    | 3          |
| PostgreSQL             | 14.18      |
| AWS                    | Elastic Beanstalk<br>RDS (PostgreSQL)<br>S3<br>CloudFront<br>Route 53<br>ACM |

## 工夫したポイント
- Django REST FrameworkでAPIを構築し、Vanilla JSから非同期通信で操作
- AWS（Elastic Beanstalk, RDS, S3, CloudFront, Route 53, ACM）で**運用の容易さと安定性を重視**した構成で、将来的な拡張にも対応可能
- URLパス・HTTPヘッダ両対応の多言語切替機能
