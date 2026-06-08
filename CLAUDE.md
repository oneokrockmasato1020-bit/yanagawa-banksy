# YANAGAWA BANKSY 公式サイト ｜ Claude 引き継ぎメモ

福岡県柳川市三橋町の MIX BAR「YANAGAWA BANKSY（柳川バンクシー）」公式サイト。
銀座系 × バンクシー（ストリートアート）のコンセプト、2024年8月開店。
このファイルは Claude セッション間の引き継ぎ用。新しいセッションは**まずこれを読む**こと。

---

## 🌐 公開情報

| 項目 | 値 |
|---|---|
| 公開URL | https://banksy-s2.github.io/ |
| GitHub | https://github.com/banksy-s2/banksy-s2.github.io |
| 旧URL（404） | `https://oneokrockmasato1020-bit.github.io/yanagawa-banksy/` （2026-06-08 移行済） |
| 旧 GitHub username | `oneokrockmasato1020-bit` |
| Instagram | https://www.instagram.com/banksy.s2/ |
| TikTok | https://www.tiktok.com/@yanagawa.banksy |
| BASE ショップ | https://banksybanksy.base.shop/ |

---

## 📁 フォルダ構成（重要）

```
C:\Users\User\Desktop\
├── yanagawa-banksy\          ← ワークスペース（編集用、luxury版もここ）
└── yanagawa-banksy-publish\  ← Git管理（push対象）
```

**ルール**：
- 編集時は **必ず両フォルダ同期** すること（Copy-Item で `-publish` から workspace へ反映 or 逆）
- Git は `yanagawa-banksy-publish\` の方
- ワークスペース側には `luxury\` というサブフォルダ（別バージョンの試作、ライブには反映されない）

---

## 🛠️ 技術スタック

- **素のHTML/CSS/JavaScript**（フレームワーク無し）
- **GitHub Pages** で自動配信（`banksy-s2.github.io` リポジトリ ＝ `https://banksy-s2.github.io/` で公開）
- リポジトリ名 `banksy-s2.github.io` だから URL に追加パス不要（超短縮 URL）

### ページ構成（8ページ + サブ）

| ファイル | 内容 |
|---|---|
| `index.html` | TOP（日本語）|
| `index-en.html` | 英語版 |
| `index-zh.html` | 中国語（簡体）|
| `index-tw.html` | 中国語（繁体・台湾向け）|
| `index-ko.html` | 韓国語 |
| `guide.html` | 柳川夜遊びガイド |
| `champagne.html` | シャンパン・シャンパンタワー特集 |
| `ladies.html` | 女性向けガイド |
| `yufuin.html` | スタッフ旅行記｜湯布院編（2026-06-08 追加）|

### 主要アセット

| ファイル | 役割 |
|---|---|
| `styles.css` | 全ページ共通スタイル（~6000行）|
| `script.js` | モーダル / 訪問者カウンター 等 |
| `sitemap.xml` | Google向け（9ページ全部 + hreflang）|
| `robots.txt` | クロール設定 |
| `llms.txt` | AIO（ChatGPT/Perplexity向け Q&A）|
| `favicon.svg` | ファビコン |
| `og-image.jpg` | OG画像 |
| `images/` | キャスト写真等 |
| `images/trip/` | 旅行記用写真 |

---

## 📊 解析ツール（全部 GA4 と同じ Google アカウントで管理）

| ツール | ID / 確認 |
|---|---|
| **GA4** | 測定ID: `G-PSTJRFPBBK` |
| **Search Console** | 認証済（`googlece4125260df2cde1.html` ファイル方式）|
| **Microsoft Clarity** | プロジェクトID: `x25u7n0b42` |
| **訪問者カウンター** | API: `https://api.counterapi.dev/v1/banksy-s2/site-visits` |

### 設置場所
全 8 ページの `<head>` に **GA4 → Clarity** の順で挿入済み（同じスクリプトブロック）。
訪問者カウンターは `index.html` のフッター直前 `.visitor-section` + `script.js` の `initVisitorCounter()`。

---

## 👯 キャスト（5名）

| # | 名前 | 役割 |
|---|---|---|
| 01 | **ゆつき** | MANAGER |
| 02 | **しおん** | キャスト |
| 03 | **ももこ** | キャスト |
| 04 | **りんか** | キャスト |
| 05 | **かりん** | キャスト |

写真: `images/cast/{ゆつき,しおん,ももこ,りんか,かりん}.jpg`
※ ももこ・りんか・かりんの本人コメントは差し替え要望あり（未対応）
※ しおんの追加写真要望あり（未対応）

---

## 💰 営業・料金

| 項目 | 内容 |
|---|---|
| 営業時間 | PM 21:00 — LAST |
| 定休日 | **水曜日** |
| 住所 | 福岡県柳川市三橋町24-3 1階 |
| 立地 | **柳川駅 徒歩20秒** |
| 電話 | 近日公開予定（未提供）|
| 予約 | Instagram DM (@banksy.s2) |

### 料金体系
- 飲み放題セット 60分：**男性 ¥2,900 / 女性 ¥2,000**（税抜・別途 TAX 10%）
- 延長 30分：¥1,500
- カラオケ：1曲 ¥200（火曜は無料）
- 生ビール・ハイボール飲み放題：+¥1,000（月曜は無料）

### 曜日別特典
- **月曜**：生ビール・ハイボール飲み放題
- **火曜**：カラオケ無料
- **木曜**：23時まで ¥1,000 OFF
- **日曜**：1セット 80分（通常60分）

---

## ✍️ 編集ルール

### コミットメッセージ
- 日本語OK
- フォーマット例：
  - `Add: ◯◯機能追加`
  - `Fix: ◯◯バグ修正`
  - `Refine: ◯◯リファイン`
  - `Update: ◯◯更新`
- **Co-Authored-By は不要**

### ファイル書き出し
- PowerShell で書き出す時は **BOM-less UTF-8**：
  ```powershell
  [System.IO.File]::WriteAllText($path, $content, [System.Text.UTF8Encoding]::new($false))
  ```
- 改行: LF 推奨だが、Git の autocrlf で CRLF に変換されても問題なし（warning は無視）

### 編集後の必須手順
1. `yanagawa-banksy-publish\` で編集
2. `yanagawa-banksy\` へ Copy-Item で同期
3. `git add` → `git commit` → `git push`
4. GitHub Pages デプロイは push 後 30秒〜2分

### push 時の注意
- PowerShell で `git push origin main 2>&1` すると、git の stderr が `NativeCommandError` として表示されるが**実際は成功してる**（PowerShell の仕様）
- 成功判定は `7e15249..432dfd3  main -> main` のような出力があるかで判断

---

## 🎨 ブランド / デザイン

| 要素 | 値 |
|---|---|
| メインカラー | ピンク（`#FF1F7A` 系）× ゴールド（`#C9A96A`）|
| 黒背景 | `#050505` / `#0a0608` |
| フォント（和文） | Shippori Mincho |
| フォント（英数） | Cormorant Garamond, Noto Sans JP |
| キーワード | 銀座系、バンクシー風グラフィティ、ピンクネオン、新感覚 MIX BAR、接客が面白い |

---

## 🔑 重要キーワード（SEO）

メインキーワード:
- 柳川 MIX BAR
- 柳川 バー / 柳川 バー 接客
- 柳川 接客 面白い（2026-06-08追加）
- 柳川 ガールズバー / キャバクラ / スナック
- 柳川 駅徒歩20秒
- 柳川 夜遊び / 夜
- 柳川 観光 夜
- 柳川 飲み放題

観光・地域:
- 川下り 後 バー
- うなぎ 後 飲み屋
- 三橋町 バー
- 大牟田 / 久留米 / 大川 / 八女 / みやま市

---

## 🚧 進行中・未完了タスク

| 優先度 | タスク |
|---|---|
| 🔴 | 電話番号未提供（用意できたら `index.html` の `"telephone"` JSON-LD と INFOセクションに反映）|
| 🔴 | X（旧 Twitter） / LINE URL 未提供 |
| 🟡 | ももこ・りんか・かりんの**本人コメント差し替え**（現状は仮）|
| 🟡 | しおん の追加写真 |
| 🟡 | 新規キャスト追加対応 |
| 🟡 | 2周年（2026年8月）特典の詳細公開 |
| 🟢 | GBP（Google ビジネスプロフィール）完成 |
| 🟢 | hreflang 相互参照 完全化（Codex指摘）|
| 🟢 | 3導線 CV ボタン（電話・Instagram・マップ）+ クリック計測 |

---

## 📝 直近の重要変更（2026-06-05〜06-08）

1. **URL 移行**: `oneokrockmasato1020-bit/yanagawa-banksy` → `banksy-s2/banksy-s2.github.io`
   - 285箇所のURL置換、新 GitHub username + repo rename で短縮URL化
   - **旧URLは404**（GitHub PagesはRedirect非対応）
2. **Codex レビュー対応**:
   - `.sr-extra`（隠しキーワード）削除 → SEOリスク回避
   - 訪問者カウンターの aria 構造修正（過剰読上げ防止）
   - counterapi.dev に AbortController timeout 追加
3. **「接客が面白い」キーワード自然挿入**（point-card 01, ABOUT lead, meta description）
4. **訪問者カウンター追加**（ゴールド装飾・フッター上）
5. **Search Console + Microsoft Clarity 導入完了**
6. **湯布院旅行記公開**（`yufuin.html` 写真9枚付き、NEWSセクションに告知）

---

## 🔁 よくある作業パターン

### 全ページに同じ変更を加える
```powershell
$files = @('index.html','index-en.html','index-zh.html','index-tw.html','index-ko.html','guide.html','champagne.html','ladies.html','yufuin.html')
$folders = @('C:\Users\User\Desktop\yanagawa-banksy-publish','C:\Users\User\Desktop\yanagawa-banksy')
foreach ($folder in $folders) {
  foreach ($name in $files) {
    $path = Join-Path $folder $name
    if (Test-Path $path) {
      $content = [System.IO.File]::ReadAllText($path)
      # ... ここで $content を加工 ...
      [System.IO.File]::WriteAllText($path, $content, [System.Text.UTF8Encoding]::new($false))
    }
  }
}
```

### Codex レビュー実行
```
mcp__codex__codex を呼ぶ。model="gpt-5.4" を必ず指定（他モデルは ChatGPT アカウントで使えない）。
cwd は C:\Users\User\Desktop\yanagawa-banksy-publish
```

### 画像追加（旅行記の写真等）
1. `images/trip/` に配置
2. `<figure class="trip-photo">` で囲み、`onerror="this.style.display='none'"` でフォールバック
3. `loading="lazy"` 必須

---

## 🎯 ユーザー（オーナー）について

- 日本語でやり取り
- カジュアルな絵文字混じり対応OK
- 細かい技術用語より「効果・売上に効くか」を重視
- 「ほかにあんだして」=「他に案出して」（「アンドゥ」と勘違いした前科あり、要注意）
- 詰まったら丁寧に説明・選択肢を3〜5個提示するのが好まれる

---

最終更新：2026-06-09
