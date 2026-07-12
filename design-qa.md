# 季節の便り：デザインQA

- source visual truth: `/Users/uedatetsuhisa/.codex/generated_images/019f53ac-3fe7-7251-9f31-12eebcb262ca/exec-dddddc37-9216-48a9-a49b-aa4fb83cc7e5.png`
- implementation screenshot: `assets/screenshots/season-mobile-390.png`
- viewport: 390 × 844
- state: スマホ表示、オープニング完了後、`#season` 表示、モーダル閉鎖
- primary interactions: 季節写真のタップで詳細モーダルを開閉、予約リンク、固定予約CTAの季節セクション内非表示
- console: error / warning なし

## 比較結果

選択案の主題である「写真を限定メニューの証拠として先に見せる」「藍と琥珀の静かなコントラスト」「限定数と予約導線を明快にする」を、既存サイトの実写・ロゴ・書体トークンで実装した。

### フォントとタイポグラフィ

- Noto Serif JPの見出しとZen Kaku Gothic Newの本文を維持。
- 見出し、限定数、補助ラベルの強弱が390px幅で判読可能。

### 余白とレイアウト

- 写真をスマホ幅いっぱいに配置し、写真→見出し→説明→提供期間・限定数→予約の順に整理。
- 横スクロールは発生しない（390pxで`scrollWidth`と`clientWidth`が一致）。

### 色とトークン

- 既存の藍、琥珀、生成りをそのまま使い、写真の暗部と本文の可読性を維持。

### 画像品質

- 既存の`menu-season-1200.webp`を幅390pxに対して1200pxの実寸で使用。
- 写真タップ時は既存の詳細モーダルに遷移し、画像と説明を確認できる。

### コピーと導線

- 「十二杯限定」を独立して強調。
- 季節セクションを表示中は画面固定の予約ボタンを隠し、限定数との重なりを回避。セクション内の予約導線を主導線にした。

## Findings

- actionable P0 / P1 / P2: なし
- P3: 深いリンクで`#season`を直接開いた直後は、ブラウザの画像読み込み状況によって写真の開始位置がわずかに変わることがある。通常スクロールとメニュー操作には影響なし。

## Implementation Checklist

- [x] スマホの全幅写真配置
- [x] 限定数の視認性向上
- [x] 写真詳細モーダルの導線
- [x] 固定CTAとの重なり回避
- [x] 390px幅の横溢れ・コンソール確認

final result: passed
