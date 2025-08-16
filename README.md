## 使用技術一覧
<p>
  <!-- バックエンド -->
  <img src="https://img.shields.io/badge/Django-092E20?logo=django&logoColor=white&style=for-the-badge">
  <img src="https://img.shields.io/badge/Django%20REST%20Framework-092E20?logo=django&logoColor=white&style=for-the-badge">
  <img src="https://img.shields.io/badge/Python-3776AB?logo=python&logoColor=white&style=for-the-badge">

  <!-- フロントエンド -->
  <img src="https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black&style=for-the-badge">
  <img src="https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white&style=for-the-badge">
  <img src="https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white&style=for-the-badge">

  <!-- DB -->
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql&logoColor=white&style=for-the-badge">

  <!-- インフラ -->
  <img src="https://img.shields.io/badge/Amazon%20AWS-232F3E?logo=amazonaws&logoColor=white&style=for-the-badge">
</p>


## 目次
1. [プロジェクトについて](#プロジェクトについて)
2. [本番環境URL](本番環境URL)
3. [スクリーンショット](#スクリーンショット)
4. [環境](#環境)
5. [工夫したポイント](#工夫したポイント)

## プロジェクト名
デザイナー用ポートフォリオWebアプリ

## プロジェクトについて
- デザイナーの作品を展示できるポートフォリオサイト
- 将来的な販売機能を見据えた構成
- PC・スマホ対応、ミニマルデザイン
- 英語・日本語の多言語対応

## 本番環境URL
[![ポートフォリオサイトを開く](https://img.shields.io/badge/Live_Site-ana--flaherty.com-2ea44f?style=for-the-badge)](https://ana-flaherty.com)

## スクリーンショット
<p align="center">
  <img src="docs/screenshots/pc.png" width="900" alt="ホーム画面(PC)">
</p>
<p align="center">
  <img src="docs/screenshots/iphone.png" width="360" alt="ホーム画面(スマホ)">
</p>

## ショートデモ
[デモを観る](https://ana-flaherty.com/media/portfolio-demo.v1.mp4)

## 環境
| 言語・フレームワーク  | バージョン |
| ---------------------- | ---------- |
| Python                 | 3.10.9     |
| Django                 | 5.0.14     |
| Django REST Framework  | 3.16.0     |
| JavaScript (Vanilla)   | ES6+       |
| HTML                   | 5          |
| CSS                    | 3          |
| PostgreSQL             | 14.18      |
| AWS                    | Elastic Beanstalk<br>RDS (PostgreSQL)<br>S3<br>CloudFront<br>Route 53<br>ACM |

## 工夫したポイント
- AWSのElastic Beanstalk + RDS + S3 + CloudFrontを活用し、スケーラブルな構成を実現
- Django REST FrameworkでAPIを構築し、Vanilla JSから非同期通信で操作
- URLパス・HTTPヘッダ両対応の多言語切替機能
