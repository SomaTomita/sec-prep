# 07. 法務

> 層: 地図 (Layer 0)

サイバーセキュリティを取り巻く**EUの法的枠組み**を扱う領域。他の5本柱と違い、
カリキュラム上も「軽め」（1科目のみ）と位置づけられており、
本領域も広く浅い概観に留める（条文の逐条解説や訴訟実務には立ち入らない）。

## 読む順

| # | ページ | 内容（1行） |
|---|---|---|
| 01 | [法務の全体地図](01_legal-landscape.md) | NIS2・Cybersecurity Act・GDPR・ePrivacy指令の全体地図、国際データ移転 |
| 02 | [サイバー犯罪と知財](02_cybercrime-and-ip.md) | サイバー犯罪条約・法執行の越境捜査・ソフトウェアの知的財産 |

<details>
<summary>進捗チェックリスト</summary>

- [x] `01_legal-landscape.md` — NIS2・Cybersecurity Act・GDPR・ePrivacy指令の全体地図、国際データ移転
- [x] `02_cybercrime-and-ip.md` — サイバー犯罪条約・法執行の越境捜査・ソフトウェアの知的財産

</details>

<details>
<summary>科目対応・深掘りキュー・関連領域</summary>

### 領域の位置づけ

GDPRの詳細（7原則・適法根拠・データ主体の権利・DPIA）はすでに
[`../03_privacy/06_law-and-dpia.md`](../03_privacy/06_law-and-dpia.md) で扱った。
本領域はその続きとして、**GDPR以外の法令**と、GDPR自身が扱わなかった
**国際データ移転**、そして**サイバー犯罪・知財**という法務レイヤーを埋める。

### 科目対応マップ

| ファイル | 他領域との接続 |
|---|---|
| 01 法務の全体地図 | `../03_privacy/06_law-and-dpia.md`（GDPR詳細） |
| 02 サイバー犯罪と知財 | [`../06_systems-security/`](../06_systems-security/index.md)（インシデント対応・法執行連携） |

### このドメインで「本体」を置かないもの（DRY）

- **GDPRの7原則・適法根拠・データ主体の権利・DPIA** → [`../03_privacy/06_law-and-dpia.md`](../03_privacy/06_law-and-dpia.md)（本領域はGDPRを全体地図の中に位置づけるのみ）
- **LINDDUN等の技術的脅威モデリング** → [`../05_software-security/02_threat-modeling.md`](../05_software-security/02_threat-modeling.md)

### 深掘りキュー（Layer 2 候補）

- [ ] NIS2の具体的リスク管理措置・インシデント報告の時間軸（24時間早期警告等） → `deep/nis2-obligations/`
- [ ] Schrems II判決の詳細（Privacy Shield無効化の論理） → `deep/schrems-ii/`
- [ ] e-evidence規則の実務（European Production Order の発行手続き） → `deep/e-evidence-procedure/`

</details>

## 参考

- EUR-Lex（EU法令データベース）: https://eur-lex.europa.eu/
- European Commission — Shaping Europe's digital future（政策解説）: https://digital-strategy.ec.europa.eu/en/policies
