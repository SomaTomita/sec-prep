# 05. セキュアソフトウェア

> 層: 地図 (Layer 0)

「ソフトウェアを作る**プロセス**そのものにセキュリティをどう組み込むか」を扱う領域。
「作る過程（要件→設計→実装→検証→運用）でどう欠陥を作り込まないか」
という時間軸に沿った視点が核心。

## 読む順

| # | ページ | 内容（1行） |
|---|---|---|
| 01 | [Secure SDLC](01_secure-sdlc.md) | Secure SDLC・NIST SSDF・DevSecOps・Equifax事例 |
| 02 | [脅威モデリング](02_threat-modeling.md) | STRIDE・attack tree・データフロー脅威分析・LINDDUN全7カテゴリ |
| 03 | [セキュリティパターン](03_security-patterns.md) | セキュリティ設計パターン・Spectre/Meltdownのソフトウェア側緩和策 |
| 04 | [セキュリティテスト](04_security-testing.md) | SAST/DAST・ファジング・ペネトレーションテスト |
| 05 | [Secure by Design](05_secure-by-design.md) | Security by Design（Saltzer & Schroeder）・Privacy by Design（Cavoukian） |

<details>
<summary>進捗チェックリスト</summary>

- [x] `01_secure-sdlc.md` — Secure SDLC・NIST SSDF・DevSecOps・Equifax事例
- [x] `02_threat-modeling.md` — STRIDE・attack tree・データフロー脅威分析・LINDDUN全7カテゴリ
- [x] `03_security-patterns.md` — セキュリティ設計パターン・Spectre/Meltdownのソフトウェア側緩和策
- [x] `04_security-testing.md` — SAST/DAST・ファジング・ペネトレーションテスト
- [x] `05_secure-by-design.md` — Security by Design（Saltzer & Schroeder）・Privacy by Design（Cavoukian）

</details>

<details>
<summary>科目対応・深掘りキュー・関連領域</summary>

対応科目: Security Through the Software Lifecycle, Advanced Methods for Security and Privacy by Design

### 領域の位置づけ

[`../04_hardware-security/`](../04_hardware-security/index.md) が「チップの上でどう守るか」、
[`../06_systems-security/`](../06_systems-security/index.md) が「動いているシステムをどう守るか」
だとすれば、本領域は「作る過程でどう欠陥を作り込まないか」。STRIDE/LINDDUN による脅威モデリングは
[`../03_privacy/`](../03_privacy/index.md) から続く「方法論の本体」をここで引き受ける。

### 科目対応マップ

| ファイル | 他領域との接続 |
|---|---|
| 01 Secure SDLC | [`../08_management-governance/01_risk-management.md`](../08_management-governance/01_risk-management.md)のリスク管理と接続 |
| 02 脅威モデリング | `../03_privacy/01_privacy-concepts.md`（LINDDUNの用語的基盤） |
| 03 セキュリティパターン | `../04_hardware-security/02_hardware-attacks.md`・`04_side-channels.md`（Spectre/Meltdown） |
| 04 セキュリティテスト | [`../06_systems-security/02_software-vulnerabilities.md`](../06_systems-security/02_software-vulnerabilities.md)の脆弱性クラスと接続 |
| 05 Secure/Privacy by Design | `../03_privacy/06_law-and-dpia.md`（GDPR詳細） |

### このドメインで「本体」を置かないもの（DRY）

- **GDPRの条文詳細（7原則・適法根拠・データ主体の権利・DPIA）** → [`../03_privacy/06_law-and-dpia.md`](../03_privacy/06_law-and-dpia.md)（本領域はPrivacy by Designの設計方法論のみ）
- **MPC・秘密分散・サイドチャネルの物理的機構** → [`../02_cryptography/06_advanced-topics-map.md`](../02_cryptography/06_advanced-topics-map.md)・[`../04_hardware-security/04_side-channels.md`](../04_hardware-security/04_side-channels.md)（本領域はSpectre/Meltdownの**ソフトウェア側**緩和策のみ）
- **Pfitzmann-Hansenのプライバシー用語（匿名性・非連結性等）の定義そのもの** → [`../03_privacy/01_privacy-concepts.md`](../03_privacy/01_privacy-concepts.md)（本領域はLINDDUNへの応用のみ）
- **アクセス制御・認証の実装詳細** → [`../06_systems-security/03_authn-authz-access-control.md`](../06_systems-security/03_authn-authz-access-control.md)

### 深掘りキュー（Layer 2 候補）

- [ ] LINDDUN GO / PRO / MAESTRO の運用差分（カードデッキ vs 網羅的DFD分析） → `deep/linddun-variants/`
- [ ] SBOM（Software Bill of Materials）の標準フォーマット（SPDX/CycloneDX）と実運用 → `deep/sbom-formats/`
- [ ] libFuzzer/AFL++のカバレッジガイド付きファジングの内部アルゴリズム → `deep/coverage-guided-fuzzing/`
- [ ] Zero Trust Architecture（NIST SP 800-207）の詳細設計 → `deep/zero-trust/`

</details>

## 参考

- NIST SP 800-218, *Secure Software Development Framework (SSDF) Version 1.1*, 2022.
