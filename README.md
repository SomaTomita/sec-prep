# sec-prep — サイバーセキュリティ修士コース予習リポジトリ

📖 **公開サイト**: https://somatomita.github.io/sec-prep/

サイバーセキュリティ修士コース受講に向けた予習用の学習リポジトリ。
MDファイルで分野別に学び、詰まった所を深掘りで枝分かれさせていく。

## 何を目指すか（深度ポリシー）

各テーマを **学部基礎レベル → 実践で使うレベル** まで、テーマ別に段階的にカバーする。
一気に深くするのではなく、次の3層で**小さいファイルを積み上げる**。

- **Layer 0 — 地図** (`index.md`): 何があり、どの科目に対応するか。進捗チェックリスト＋深掘りキュー。
- **Layer 1 — 基礎**: 学部レベルの概念。1トピック1ファイル（80〜150行、上限200行）。
- **Layer 2 — 深掘り** (`deep/<topic>/`): 詰まった所・実践に踏み込む所だけ on-demand で枝分かれ。

> 構造（3層・小ファイル）は不変。

## 進め方（学習ループ）

1. 領域の `index.md`（地図＋チェックリスト）を開く。
2. Layer 1 ファイルを番号順に読む。
3. 分からない用語が出たら `index.md` の **深掘りキュー** に1行追加。
4. キューが溜まったら `deep/<topic>/` を起こして掘る。
5. ファイルは常に小さく。200行を超えそうなら分割。

## 構造

```
topics/
├── 00_overview/              # コース全体地図・5本柱の関係・用語集
├── 01_prerequisites/         # 前提知識（学部レベル）
│   ├── 01_math-for-crypto/       暗号数学
│   ├── 02_low-level-c-os/        低レベル・C・OS
│   ├── 03_hardware-digital-logic/ ディジタル論理・HW
│   └── 04_networks-probability/  ネットワーク・確率統計
├── 02_cryptography/          # 暗号
├── 03_privacy/               # プライバシー
├── 04_hardware-security/     # ハードウェアセキュリティ
├── 05_software-security/     # セキュアソフトウェア
├── 06_systems-security/      # システムセキュリティ
├── 07_legal/                 # 法務（必修）
└── 08_management-governance/ # マネジメント/ガバナンス
```

## 規約

- フォルダ・ファイル名は英語 kebab-case、本文は日本語。
- 数値プレフィックスで並び順を固定。
- 重複トピック（例: サイドチャネル＝暗号⇄HW、GDPR＝プライバシー⇄法務）は片方に本体を置き、もう片方からリンク（DRY）。

## 出典の扱い

各ファイルの「参考」節に、一次資料へのリンクを残す。
事実は無料の WebSearch / 一次資料で検証し、不確実な点は明示する。

## エントリポイント

- 全体像: [topics/00_overview/index.md](topics/00_overview/index.md)
- 前提知識: [topics/01_prerequisites/index.md](topics/01_prerequisites/index.md)

## サイト運用（md を追加したら）

- `topics/` 配下に md を追加/編集して push するだけで、GitHub Actions が自動ビルド・再公開する（ナビも自動反映）。
- 並び順は数値プレフィックス（`00_`, `01_` …）で決まる。
- 新フォルダの見出しを日本語にしたい時だけ、そのフォルダに `.pages`（`title: 〇〇`）を置く。
- push 前のローカル確認: `.venv/bin/mkdocs serve`
- リンク検査: `.venv/bin/mkdocs build --strict`（CI と同一。ここで落ちれば公開もされない）
