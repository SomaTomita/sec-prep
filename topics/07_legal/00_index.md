# 法務 — 領域地図

> 対応科目: H0Q25A ｜ 層: 地図 (Layer 0)

サイバーセキュリティを取り巻く**EUの法的枠組み**を扱う領域。他の5本柱と違い、
KU Leuvenのカリキュラム上も「軽め」（H0Q25A 1科目のみ）と位置づけられており、
本領域も広く浅い概観に留める（条文の逐条解説や訴訟実務には立ち入らない）。

GDPRの詳細（7原則・適法根拠・データ主体の権利・DPIA）はすでに
[`../03_privacy/06_law-and-dpia.md`](../03_privacy/06_law-and-dpia.md) で扱った。
本領域はその続きとして、**GDPR以外の法令**と、GDPR自身が扱わなかった
**国際データ移転**、そして**サイバー犯罪・知財**という法務レイヤーを埋める。

---

## 進捗チェックリスト

- [x] `01_legal-landscape.md` — NIS2・Cybersecurity Act・GDPR・ePrivacy指令の全体地図、国際データ移転
- [x] `02_cybercrime-and-ip.md` — サイバー犯罪条約・法執行の越境捜査・ソフトウェアの知的財産

---

## 科目対応マップ

| ファイル | 主要対応科目 | 他領域との接続 |
|---|---|---|
| 01 法務の全体地図 | H0Q25A | `../03_privacy/06_law-and-dpia.md`（GDPR詳細） |
| 02 サイバー犯罪と知財 | H0Q25A | [`../06_systems-security/`](../06_systems-security/00_index.md)（インシデント対応・法執行連携） |

---

## このドメインで「本体」を置かないもの（DRY）

- **GDPRの7原則・適法根拠・データ主体の権利・DPIA** → [`../03_privacy/06_law-and-dpia.md`](../03_privacy/06_law-and-dpia.md)（本領域はGDPRを全体地図の中に位置づけるのみ）
- **LINDDUN等の技術的脅威モデリング** → [`../05_software-security/02_threat-modeling.md`](../05_software-security/02_threat-modeling.md)

---

## 深掘りキュー（Layer 2 候補）

- [ ] NIS2の具体的リスク管理措置・インシデント報告の時間軸（24時間早期警告等） → `deep/nis2-obligations/`
- [ ] Schrems II判決の詳細（Privacy Shield無効化の論理） → `deep/schrems-ii/`
- [ ] e-evidence規則の実務（European Production Order の発行手続き） → `deep/e-evidence-procedure/`

---

## 参考

- KU Leuven H0Q25A シラバス（KU Leuven公式シラバスページで検索）
- EUR-Lex（EU法令データベース）: https://eur-lex.europa.eu/
- European Commission — Shaping Europe's digital future（政策解説）: https://digital-strategy.ec.europa.eu/en/policies
