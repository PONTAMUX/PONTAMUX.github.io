# PONTAMUX Apps

自作の軽いツールを置く静的サイト。ビルド不要、素の HTML/CSS/JS。

## 公開手順
1. GitHub で公開リポジトリ `PONTAMUX.github.io` を作成
2. このフォルダを push（main ブランチ）
3. Settings → Pages で Source を `main` / `(root)` にする
4. https://pontamux.github.io/ で公開される

## アプリの追加
`apps.json` に 1 件足すだけ。項目は `id` / `name` / `summary` / `description` / `platform` / `repo`（null 可）/ `web`（null 可）/ `tags`。

## 配布物
配布物は各アプリのリポジトリの Releases に置く。サイトは GitHub API で最新版を取得して表示する（10 分キャッシュ。失敗時は Releases ページへのリンクに切り替わる）。

## ローカル確認
`python -m http.server` → http://localhost:8000/
