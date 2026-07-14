# マネジメント・ガバナンス — 領域地図

> 層: 地図 (Layer 0)

セキュリティを「技術」ではなく「組織の意思決定・プロセス・経済合理性」として扱う横断領域。
計画書上は**軽め**（必須選択だが深掘りは薄く）と位置づけられており、他の5本柱ほど
1トピック200行までは掘らず、広く浅くフレームワーク名・標準番号・キー概念を押さえることを狙う。
法制度の詳細（GDPR・NIS2等）は [`../07_legal/`](../07_legal/index.md) に譲る。

---

## 進捗チェックリスト

- [x] `01_risk-management.md` — リスク管理フレームワーク・NIST CSF 2.0/SP 800-30・ISO 27000シリーズ
- [x] `02_security-operations.md` — 運用管理・IAM・BCP/DR・アウトソーシング/サードパーティリスク
- [x] `03_certification-economics.md` — Common Criteria・FIPS 140-3・セキュリティ経済学

---

## 科目対応マップ

| ファイル | 他領域との接続 |
|---|---|
| 01 リスク管理 | 法的リスク評価は [`../07_legal/01_legal-landscape.md`](../07_legal/01_legal-landscape.md) へ |
| 02 運用・IAM・BCP/DR | サードパーティ契約の法的要件は [`../03_privacy/06_law-and-dpia.md`](../03_privacy/06_law-and-dpia.md)（GDPR第28条） |
| 03 認証・経済学 | Common CriteriaのTPM評価例は [`../04_hardware-security/03_security-building-blocks.md`](../04_hardware-security/03_security-building-blocks.md) |

---

## このドメインで「本体」を置かないもの（DRY）

- **GDPR・DPIAの詳細** → [`../03_privacy/06_law-and-dpia.md`](../03_privacy/06_law-and-dpia.md)（本領域はNIST/ISOのフレームワーク面のみ）
- **NIS2・Cybersecurity Act等の法制度** → [`../07_legal/01_legal-landscape.md`](../07_legal/01_legal-landscape.md)
- **TPM・PUF・RNGなどハードウェア部品自体** → [`../04_hardware-security/03_security-building-blocks.md`](../04_hardware-security/03_security-building-blocks.md)
- **Kerckhoffsの原理・攻撃者モデル** → [`../02_cryptography/01_goals-and-primitives.md`](../02_cryptography/01_goals-and-primitives.md)

---

## 深掘りキュー（Layer 2 候補）

- （読み進めながら追記する。軽め領域のため優先度は低い）

---

## 参考

- NIST Cybersecurity Framework 2.0: https://www.nist.gov/cyberframework
- ISO/IEC 27001: https://www.iso.org/standard/27001
