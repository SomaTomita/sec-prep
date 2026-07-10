# 02. 運用管理・IAM・BCP/DR・サードパーティリスク

> 前: [01 リスク管理フレームワーク](./01_risk-management.md) ｜ 次: [03 認証制度とセキュリティ経済学](./03_certification-economics.md) ｜ 層: 基礎(Layer 1)

[01](./01_risk-management.md) で識別・評価したリスクを実際に**低減・移転**するための
日常運用の柱を3つ見る: 「誰が何にアクセスできるか」を管理するIAM、「止まった後どう
戻すか」を計画するBCP/DR、「自組織の外」に依存するリスクを管理するサードパーティ
リスク管理。

---

## IAM（Identity and Access Management）

「本人確認」と「権限付与」を分離して考えるのがIAMの出発点。3つの要素（AAA）で
整理される:

```
Authentication（認証）: あなたは誰か？（パスワード・生体認証・MFA等で確認）
Authorization（認可）:  あなたは何をしてよいか？（権限の割り当て）
Accounting（記録）:     あなたは何をしたか？（監査ログ）
```

認証と認可を混同しないこと——「ログインできる（認証済み）」ことと
「その操作が許可されている（認可済み）」ことは別の判断。

### アクセス制御の設計原則

```
最小権限の原則 (Least Privilege): 業務に必要な最小限の権限のみ付与する
Need-to-know:                    業務上知る必要がある情報にのみアクセスを許す
職務分離 (Separation of Duties):  重要な操作を単独の人物が完結できないよう分割する
```

権限モデルとしては **RBAC（Role-Based Access Control）**——役割（ロール）単位で
権限をまとめる——が最も一般的。より柔軟に「属性」（部署・時刻・場所等）で判定する
**ABAC（Attribute-Based Access Control）**も大規模組織で使われる。

米国ではNIST SP 800-63「Digital Identity Guidelines」が実装の詳細仕様を与える
（IAL/AAL/FALという3種の保証レベルで身元確認・認証器・フェデレーションの強度を
分離して規定）。2025年8月に**Rev. 4**が発行され、フィッシング耐性MFA・パスキー
対応など現行の脅威に合わせた改訂が行われている。

---

## BCP（事業継続計画）とDR（災害復旧）

しばしば混同されるが、スコープが異なる:

```
BCP（Business Continuity Planning）:
  組織全体の「重要な事業機能」を、災害発生中も継続させるための計画
  （代替オフィス・代替要員・代替業務プロセスまで含む、広い概念）

DR（Disaster Recovery）:
  ITシステム・データを復旧させるための計画
  （BCPの一部——「事業を止めない」ためのIT面の技術的手段に限定）
```

DRはBCPの部分集合、という位置づけを押さえる。BCP/DRの成熟度は
**ISO 22301:2019**（事業継続マネジメントシステムの国際標準）や、米国連邦情報システム
向けの**NIST SP 800-34 Rev. 1**（Contingency Planning Guide）で規定される。

### RTO と RPO：復旧目標を測る2つの軸

```
RTO（Recovery Time Objective）: 障害発生から復旧までに許容できる最大時間
RPO（Recovery Point Objective）: 復旧時点で許容できる最大データ損失量（時間換算）

例: RTO=4時間, RPO=15分
  → 障害から4時間以内に復旧し、直近15分以内のデータ以上は失わない設計が必要
```

RTOが短いほど、RPOが短いほど、一般に対策コスト（冗長化・バックアップ頻度）は
増大する——ここでも[01](./01_risk-management.md)のリスク×コストのトレードオフが
そのまま現れる。

---

## サードパーティリスク管理（アウトソーシング）

クラウド・SaaS・委託開発が一般化した結果、自組織が直接統制できない外部ベンダーの
セキュリティ水準が自組織のリスクに直結する。これを体系的に扱うのが
**NIST SP 800-161 Rev. 1**「Cybersecurity Supply Chain Risk Management (C-SCRM)
Practices for Systems and Organizations」（2022年5月改訂）。

```
サプライチェーンリスクの典型例:
  委託先経由のマルウェア混入（ソフトウェアサプライチェーン攻撃）
  委託先のセキュリティ事故による委託元データの漏洩
  委託先の事業停止による自組織サービスの停止
```

対策の骨格は「契約前のデューデリジェンス（監査・認証確認）」＋「契約後の継続モニタリング」
の2段階。GDPR文脈では処理者（processor）との契約に関する法的要件（第28条）が
別途課されるが、その詳細は[`../03_privacy/06_law-and-dpia.md`](../03_privacy/06_law-and-dpia.md)
で扱い済み——本ファイルは技術・運用面のフレームワーク（NIST SP 800-161）に限定する。

---

## 演習（解答つき）

1. 「認証」と「認可」の違いを一言で説明せよ。
2. BCPとDRの関係を、集合の言葉（部分集合等）で説明せよ。
3. RTO=1時間・RPO=1時間のシステムと、RTO=24時間・RPO=24時間のシステムでは、
   一般にどちらの運用コストが高いか、理由とともに述べよ。

<details><summary>解答</summary>

1. 認証は「あなたが誰であるかを確認すること」、認可は「確認された相手に何を許可するか
   を判断すること」——認証は本人確認、認可は権限判定という別の処理。
2. DRはBCPの**部分集合**。BCPは事業機能全体の継続（人員・拠点・プロセスを含む）を扱い、
   DRはそのうちITシステム・データの技術的復旧に限定される。
3. RTO=1時間・RPO=1時間の方が運用コストが高い。復旧目標時間・許容データ損失量が
   短いほど、常時稼働の冗長系・高頻度バックアップ・自動フェイルオーバー等の
   投資が必要になり、コストは目標値の厳しさに比例して増大するため。

</details>

---

## 次への接続

運用レベルの対策（IAM・BCP/DR・サードパーティ管理）が「自組織が正しくやっているか」を
どう**第三者に証明するか**という問いが次に来る。[03](./03_certification-economics.md)
では、その証明手段としての認証制度（Common Criteria・FIPS 140-3）と、なぜ市場が
セキュリティ品質を自然には評価できないのか（セキュリティ経済学）を見る。

---

## 参考

- NIST SP 800-63-4, "Digital Identity Guidelines" (2025年8月): https://csrc.nist.gov/pubs/sp/800/63/4/final
- ISO 22301:2019, Business continuity management systems: https://www.iso.org/standard/75106.html
- NIST SP 800-34 Rev. 1, "Contingency Planning Guide for Federal Information Systems": https://csrc.nist.gov/pubs/sp/800/34/r1/final
- NIST SP 800-161 Rev. 1, "Cybersecurity Supply Chain Risk Management Practices" (2022年5月): https://csrc.nist.gov/pubs/sp/800/161/r1/final
