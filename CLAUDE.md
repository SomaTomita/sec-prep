# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## リポジトリの性質

サイバーセキュリティ修士コース受講前の予習用**学習リポジトリ**。中身は Markdown のみで、ビルド・lint・テストは存在しない。git は未初期化（初期化はユーザー承認を得てから）。

- 入口: `README.md`
- 計画書（構造・ファイルマニフェスト・スケジュールの正）: `docs/plan/2026-06-27-cybersecurity-yoshu-plan.md`
- 学習本体: `topics/`（現状 `00_overview/` と `01_prerequisites/` のみ存在。`02_cryptography/`〜`08_management-governance/` は計画書のマニフェストに従い今後作成）

## アーキテクチャ: 3層モデル

すべての領域フォルダ（`topics/<domain>/`）は同じ3層構造を取る。

- **Layer 0 — 地図** (`index.md`): 領域の全体像。先頭に「読む順」テーブル、進捗チェックリスト（`- [ ]`）・科目対応・**深掘りキュー**（読書中に出た不明用語を1行ずつ溜める場所）は `<details>` に折りたたむ。
- **Layer 1 — 基礎** (`01_<topic>.md`, `02_…`): 1トピック1ファイル。学部基礎→実践レベルまでカバー（当初の「広く浅く」方針から拡張済み。README冒頭の深度ポリシー参照）。
- **Layer 2 — 深掘り** (`deep/<topic-slug>/`): 深掘りキューから on-demand で起こす。証明・導出・手を動かす内容はここ。基礎ファイルと双方向リンク。

### 概念別フォルダ昇格パターン

ユーザーが講義動画等で丁寧に復習するテーマは、フラットな `XX_topic.md` を**フォルダに昇格**させる:
`XX_topic/README.md`（地図化・概念ファイルへのリンク表）+ 概念ごとの `01_….md, 02_….md`。
各概念ファイルは「動機 → 定義 → なぜ → 例 → 演習（`<details>` で解答）→ 次への接続」の流れで、先頭に `> 親: [README](./README.md) ｜ 次: [...] ｜ 層: 基礎(Layer 1)` のナビ行を置く。
実例: `topics/01_prerequisites/01_math-for-crypto/01_modular-arithmetic/`。

## ファイル規約

詳細テンプレート（概念ファイル/フラットLayer 1/README地図/index地図の4種）と執筆規律は **[docs/format-standard.md](docs/format-standard.md) が正**。ここでは要点のみ:

- フォルダ・ファイル名は**英語 kebab-case**、本文は**日本語**。数値プレフィックス（`00_`, `01_`…）で並び順を固定。
- 1ファイル1トピック。目安 80〜150行、**ハード上限 200行**。超えそうなら分割（またはフォルダ昇格）。
- **DRY**: 領域横断トピック（サイドチャネル＝暗号⇄HW、GDPR＝プライバシー⇄法務など）は片方に本体を置き、もう片方からリンク。内容を二重に書かない。フォルダの README には「本体を置かないもの」節でリンク先を明示する。
- 各ファイルの「参考」節に一次資料へのリンクを残す。所属機関の公式シラバスなど、出典を特定できるリンク・科目コードは含めない。
- フォーマット準拠は `tools/check-format.sh <path>` で機械検証できる（200行制限・ナビ行・演習・リンク切れ）。

## 執筆・レビュー運用

- 事実は**無料の WebSearch / 一次資料**で検証する。`/web-research` は有料（x402）なので使わない。不確実な点は本文に明示。
- 領域を大量執筆するときの確立パターン: サブ領域ごとに general-purpose 執筆エージェントを並列起動 → その後 Security Engineer エージェントを並列でレビュー起動し一次資料で事実検証 → CRITICAL/HIGH/MINOR 指摘を main で修正。
- 進捗は各領域の `index.md` のチェックリスト（`<details>` 内）が正。作業前にそこを確認する。
