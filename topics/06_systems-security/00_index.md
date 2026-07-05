# システムセキュリティ — 領域地図

> 対応科目: H04K5A Development of Secure Software, H0Q33A Security and Privacy in Contemporary Distributed Software Systems ｜ 層: 地図 (Layer 0)

H04K5A のシラバスは「脅威・対策・リスクの定義 → Web/C系ソフトウェアの脅威 → 認証・アクセス制御 →
インフラ系セキュリティ技術」という順で構成される。本領域はこの流れをそのままなぞる。
最後の `05` だけは H0Q33A（クラウド・ブロックチェーン・車載を題材にした分散システム演習科目）に対応する。

[`../01_prerequisites/02_low-level-c-os/`](../01_prerequisites/02_low-level-c-os/00_index.md)
がC言語のメモリレイアウトを、[`../04_hardware-security/`](../04_hardware-security/00_index.md)
がサイドチャネルを既に扱っている。本領域はそれらの上に「攻撃者はどう突破口を作るか」
「システムはどう認証・認可・防御を組むか」を積み上げる。ソフトウェアを設計段階から
安全に作る話（Secure SDLC・脅威モデリング）は [`../05_software-security/`](../05_software-security/00_index.md) に譲る。

---

## 進捗チェックリスト

- [x] `01_security-fundamentals.md` — 資産・脅威・脆弱性・リスク・対策の語彙、CIAトライアド、Saltzer & Schroeder の設計原則
- [x] `02_software-vulnerabilities.md` — OWASP Top 10（Web）とスタック/ヒープバッファオーバーフロー（C系）の攻撃・防御
- [x] `03_authn-authz-access-control.md` — 認証（NIST 800-63B）、Lampsonのアクセス制御マトリックス、DAC/MAC/RBAC/ABAC
- [x] `04_infrastructure-security.md` — ファイアウォール、IDS/IPS、ネットワークセグメンテーション、ゼロトラスト
- [x] `05_distributed-systems-security.md` — クラウド責任共有モデル、ビザンチン耐性合意、車載CANバスセキュリティ

---

## 科目対応マップ

| ファイル | 主要対応科目 | 他領域との接続 |
|---|---|---|
| 01 基本概念 | H04K5A | `../04_hardware-security/`（物理・サイドチャネルは別領域） |
| 02 ソフトウェア脆弱性 | H04K5A | `../01_prerequisites/02_low-level-c-os/01_c-and-memory.md`（メモリレイアウトの前提） |
| 03 認証・認可・アクセス制御 | H04K5A | `../01_prerequisites/02_low-level-c-os/02_process-and-os.md`（Lampsonマトリックスの予告） |
| 04 インフラセキュリティ | H04K5A | `../01_prerequisites/04_networks-probability/`（TCP/IPの基礎） |
| 05 分散システムセキュリティ | H0Q33A | `../02_cryptography/05_protocols-overview.md`（Bitcoinの暗号プリミティブ） |

---

## 深掘りキュー（Layer 2 候補）

- [ ] ROPチェーンの実装詳細（`../01_prerequisites/02_low-level-c-os/00_index.md` の深掘りキューと統合）→ `deep/rop-chains/`
- [ ] PBFTの3フェーズプロトコル（Pre-prepare/Prepare/Commit）の詳細トレース → `deep/pbft-protocol/`
- [ ] 車載セキュリティ標準（AUTOSAR SecOC, CAN-FD の認証拡張）→ `deep/can-security/`
- [ ] Lampsonマトリックスの実装例（Linux capabilities, POSIX ACL）→ `deep/lampson-matrix-impl/`

---

## 参考

- KU Leuven H04K5A シラバス: https://onderwijsaanbod.kuleuven.be/syllabi/e/H04K5A.htm
- KU Leuven H0Q33A シラバス: https://onderwijsaanbod.kuleuven.be/syllabi/e/H0Q33A.htm
