# 00. コース全体像

> 層: 地図 (Layer 0)

本リポジトリの出発点。プログラム構成・5本柱の関係・用語集・脅威の縮尺・AI の影響を押さえてから各領域へ進む。

## 読む順

| # | ページ | 内容（1行） |
|---|---|---|
| 01 | [プログラム構成](01_program-structure.md) | プログラム構成・単位配分・段階設計 |
| 02 | [5本柱の地図](02_five-pillars-map.md) | 5本柱の関係と全体像 |
| 03 | [用語集](03_glossary.md) | 共通用語集（読み進めながら追記する living doc） |
| 04 | [脅威ランドスケープ](04_threat-landscape.md) | 攻撃者の分類・複雑性と脆弱性・予防から検知へ・損害額の桁の検算 |
| 05 | [AI とセキュリティ](05_ai-and-security.md) | 攻撃自動化・AI 自体の脆弱性・経験的防御の限界・アクセス統制のジレンマ |

<details>
<summary>進捗チェックリスト</summary>

- [ ] [01_program-structure.md](01_program-structure.md) — プログラム構成・単位配分・段階設計
- [ ] [02_five-pillars-map.md](02_five-pillars-map.md) — 5本柱の関係と全体像
- [ ] [03_glossary.md](03_glossary.md) — 共通用語集（読み進めながら追記する living doc）
- [ ] [04_threat-landscape.md](04_threat-landscape.md) — 攻撃者の分類・複雑性と脆弱性・予防から検知へ・損害額の桁の検算
- [ ] [05_ai-and-security.md](05_ai-and-security.md) — 攻撃自動化・AI 自体の脆弱性・経験的防御の限界・アクセス統制のジレンマ

</details>

<details>
<summary>科目対応・深掘りキュー・関連領域</summary>

対応: プログラム全体。

### 5本柱（専門選択の領域）

| # | 領域 | フォルダ |
|---|---|---|
| 1 | 暗号 (Cryptography) | [../02_cryptography/index.md](../02_cryptography/index.md) |
| 2 | プライバシー (Privacy) | [../03_privacy/index.md](../03_privacy/index.md) |
| 3 | ハードウェアセキュリティ | [../04_hardware-security/index.md](../04_hardware-security/index.md) |
| 4 | セキュアソフトウェア | [../05_software-security/index.md](../05_software-security/index.md) |
| 5 | システムセキュリティ | [../06_systems-security/index.md](../06_systems-security/index.md) |

横断科目: [法務](../07_legal/index.md) ／ [マネジメント・ガバナンス](../08_management-governance/index.md)

### 前提知識

5本柱に入る前の学部レベルの土台 → [../01_prerequisites/](../01_prerequisites/index.md)

### 深掘りキュー（このフォルダ起点）

読みながら出た「あとで掘る」項目をここに溜める。

- [ ] MITRE ATT&CK の各フェーズと実事例の対応づけ → `deep/attack-phases/`
- [ ] 敵対的サンプルがなぜモデル間で転移するのか → `deep/adversarial-transferability/`
- [ ] AI の能力評価ベンチマークの設計（何を測っていないか） → `deep/ai-benchmark-design/`

</details>

## 参考

- 各領域の詳細は所属先の公式プログラム案内・シラバスを参照（本リポジトリでは出典を特定できるリンクは掲載しない）。
