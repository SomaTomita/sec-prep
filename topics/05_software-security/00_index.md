# セキュアソフトウェア — 領域地図

> 対応科目: H0Q31A Security Through the Software Lifecycle, H0Q32A Advanced Methods for Security and Privacy by Design, H05M8B ｜ 層: 地図 (Layer 0)

「ソフトウェアを作る**プロセス**そのものにセキュリティをどう組み込むか」を扱う領域。
[`../04_hardware-security/`](../04_hardware-security/00_index.md) が「チップの上でどう守るか」、
[`../06_systems-security/`](../06_systems-security/00_index.md)が「動いているシステムをどう守るか」
だとすれば、本領域は「作る過程（要件→設計→実装→検証→運用）でどう欠陥を作り込まないか」
という時間軸に沿った視点が核心。STRIDE/LINDDUN による脅威モデリングは
[`../03_privacy/`](../03_privacy/00_index.md) から続く「方法論の本体」をここで引き受ける。

---

## 進捗チェックリスト

- [x] `01_secure-sdlc.md` — Secure SDLC・NIST SSDF・DevSecOps・Equifax事例
- [x] `02_threat-modeling.md` — STRIDE・attack tree・データフロー脅威分析・LINDDUN全7カテゴリ
- [x] `03_security-patterns.md` — セキュリティ設計パターン・Spectre/Meltdownのソフトウェア側緩和策
- [x] `04_security-testing.md` — SAST/DAST・ファジング・ペネトレーションテスト
- [x] `05_secure-by-design.md` — Security by Design（Saltzer & Schroeder）・Privacy by Design（Cavoukian）

---

## 科目対応マップ

| ファイル | 主要対応科目 | 他領域との接続 |
|---|---|---|
| 01 Secure SDLC | H0Q31A | [`../08_management-governance/01_risk-management.md`](../08_management-governance/01_risk-management.md)のリスク管理と接続 |
| 02 脅威モデリング | H0Q31A, H0Q32A | `../03_privacy/01_privacy-concepts.md`（LINDDUNの用語的基盤） |
| 03 セキュリティパターン | H0Q32A | `../04_hardware-security/02_hardware-attacks.md`・`04_side-channels.md`（Spectre/Meltdown） |
| 04 セキュリティテスト | H0Q31A, H05M8B | [`../06_systems-security/02_software-vulnerabilities.md`](../06_systems-security/02_software-vulnerabilities.md)の脆弱性クラスと接続 |
| 05 Secure/Privacy by Design | H0Q32A | `../03_privacy/06_law-and-dpia.md`（GDPR詳細） |

---

## このドメインで「本体」を置かないもの（DRY）

- **GDPRの条文詳細（7原則・適法根拠・データ主体の権利・DPIA）** → [`../03_privacy/06_law-and-dpia.md`](../03_privacy/06_law-and-dpia.md)（本領域はPrivacy by Designの設計方法論のみ）
- **MPC・秘密分散・サイドチャネルの物理的機構** → [`../02_cryptography/06_advanced-topics-map.md`](../02_cryptography/06_advanced-topics-map.md)・[`../04_hardware-security/04_side-channels.md`](../04_hardware-security/04_side-channels.md)（本領域はSpectre/Meltdownの**ソフトウェア側**緩和策のみ）
- **Pfitzmann-Hansenのプライバシー用語（匿名性・非連結性等）の定義そのもの** → [`../03_privacy/01_privacy-concepts.md`](../03_privacy/01_privacy-concepts.md)（本領域はLINDDUNへの応用のみ）
- **アクセス制御・認証の実装詳細** → [`../06_systems-security/03_authn-authz-access-control.md`](../06_systems-security/03_authn-authz-access-control.md)

---

## 深掘りキュー（Layer 2 候補）

- [ ] LINDDUN GO / PRO / MAESTRO の運用差分（カードデッキ vs 網羅的DFD分析） → `deep/linddun-variants/`
- [ ] SBOM（Software Bill of Materials）の標準フォーマット（SPDX/CycloneDX）と実運用 → `deep/sbom-formats/`
- [ ] libFuzzer/AFL++のカバレッジガイド付きファジングの内部アルゴリズム → `deep/coverage-guided-fuzzing/`
- [ ] Zero Trust Architecture（NIST SP 800-207）の詳細設計 → `deep/zero-trust/`

---

## 参考

- KU Leuven H0Q31A シラバス: https://onderwijsaanbod.kuleuven.be/syllabi/e/H0Q31AE
- KU Leuven H0Q32A シラバス: https://onderwijsaanbod.kuleuven.be/syllabi/e/H0Q32A
- NIST SP 800-218, *Secure Software Development Framework (SSDF) Version 1.1*, 2022.
