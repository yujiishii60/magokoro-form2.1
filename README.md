# まごころアンケート 2.0

これは GAS と GitHub Pages を使って実装される「まごころアンケート」の新版プロジェクトです。

## 🌟 プロジェクト概要

- 忙しい現場でも、すきま時間にすこしずつ評価できる「まごころ」あるアンケート転送フォーム
- Google Apps Script と Google スプレッドシートを使った本格的バックエンド
- GitHub Pages から公開可能
- token による「途中保存」と「再開」に対応
- 問題点・要望は、仲伴でドンドン追加可能

---

## 📁 ディレクトリ構成

```
magokoro_survey_v2/
├── index.html                ← メインフォーム
├── js/
│   └── app.js                ← JavaScriptに分離する場合
├── css/
│   └── style.css             ← カスタムスタイル
├── gas/
│   ├── code.gs               ← Google Apps Script (doPost / doGet)
│   └── README.md             ← GAS デプロイ手順
├── sheets/
│   └── schema.xlsx           ← 列構成サマリー
├── docs/
│   └── guide.pdf             ← ユーザー向けマニュアル
└── README.md                ← 本プロジェクト概要
```

---

## 🔧 実装步階

### ▶ステップ 1: GAS デプロイ

1. `gas/code.gs` を Google Apps Script に貼り付け
2. WebApp として公開 (WebApp URL = YOUR_SCRIPT_ID)
3. 最初のデータ記録時に token (UUID) を保存

### ▶ステップ 2: GitHub Pages へデプロイ

1. `index.html` を GitHub の `docs/` または root に置く
2. GitHub Pages を Enable
3. GAS の WebApp URL を `index.html` 内の `YOUR_SCRIPT_ID` に置換

### ▶ステップ 3: フォーム送信テスト

- `https://your-page.github.io/magokoro_survey_v2/?token=abc123` 
- 送信後、"送信しました" 表示
- token 付き URL をブックマーク

---

## 🔍 発展案

- LINE Notify 連携
- 自動集計(問題分類 / 時間別)
- CSV ダウンロード / PDF 印刷テンプレート
- Google Chat / Slack Webhook 連携

---

## 👋 コントリビュート

- デザイン & HTML / CSS 設計: 企画者
- GAS 実装: ChatGPT + You

---

他の人も使いたくなるような、すてきなまごころフォームを一緒に作りましょう✨