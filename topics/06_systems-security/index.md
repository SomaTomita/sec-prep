# 06. システムセキュリティ

> 層: 地図 (Layer 0)

「脅威・対策・リスクの定義 → Web/C系ソフトウェアの脅威 → 認証・アクセス制御 →
インフラ系セキュリティ技術」という科目の流れをそのままなぞる領域。
最後の `05` だけは分散システム演習科目（クラウド・ブロックチェーン・車載を題材にした）に対応する。

## 読む順

| # | ページ | 内容（1行） |
|---|---|---|
| 01 | [セキュリティの基本概念](01_security-fundamentals.md) | 資産・脅威・脆弱性・リスク・対策の語彙、CIAトライアド、Saltzer & Schroeder の設計原則 |
| 02 | [ソフトウェア脆弱性](02_software-vulnerabilities.md) | OWASP Top 10（Web）とスタック/ヒープバッファオーバーフロー（C系）の攻撃・防御 |
| 03 | [認証・認可・アクセス制御](03_authn-authz-access-control.md) | 認証（NIST 800-63B）、Lampsonのアクセス制御マトリックス、DAC/MAC/RBAC/ABAC |
| 04 | [インフラセキュリティ](04_infrastructure-security.md) | ファイアウォール、IDS/IPS、ネットワークセグメンテーション、ゼロトラスト |
| 05 | [分散システムセキュリティ](05_distributed-systems-security.md) | クラウド責任共有モデル、ビザンチン耐性合意、二重支払いと PoW/PoS、車載CANバスセキュリティ |
| 06 | [無線セキュリティ](06_wireless-security.md) | RF フィンガープリンティング、リレー攻撃と distance bounding、WPA2/WPA3 の鍵階層、KRACK |
| 07 | [PKI とデジタルID](07_pki-and-identity.md) | 信頼の移動、鍵バックアップの非対称性、失効の未解決問題と短命証明書、証明書透明性、EUDI Wallet |

<details>
<summary>進捗チェックリスト</summary>

- [x] `01_security-fundamentals.md` — 資産・脅威・脆弱性・リスク・対策の語彙、CIAトライアド、Saltzer & Schroeder の設計原則
- [x] `02_software-vulnerabilities.md` — OWASP Top 10（Web）とスタック/ヒープバッファオーバーフロー（C系）の攻撃・防御
- [x] `03_authn-authz-access-control.md` — 認証（NIST 800-63B）、Lampsonのアクセス制御マトリックス、DAC/MAC/RBAC/ABAC
- [x] `04_infrastructure-security.md` — ファイアウォール、IDS/IPS、ネットワークセグメンテーション、ゼロトラスト
- [x] `05_distributed-systems-security.md` — クラウド責任共有モデル、ビザンチン耐性合意、二重支払いと PoW/PoS、車載CANバスセキュリティ
- [ ] `06_wireless-security.md` — RF フィンガープリンティング、リレー攻撃と distance bounding、WPA2/WPA3 の鍵階層、KRACK
- [ ] `07_pki-and-identity.md` — 信頼の移動、鍵バックアップの非対称性、失効の未解決問題と短命証明書、証明書透明性、EUDI Wallet

</details>

<details>
<summary>科目対応・深掘りキュー・関連領域</summary>

対応科目: Development of Secure Software, Security and Privacy in Contemporary Distributed Software Systems

### 領域の位置づけ

[`../01_prerequisites/02_low-level-c-os/`](../01_prerequisites/02_low-level-c-os/index.md)
がC言語のメモリレイアウトを、[`../04_hardware-security/`](../04_hardware-security/index.md)
がサイドチャネルを既に扱っている。本領域はそれらの上に「攻撃者はどう突破口を作るか」
「システムはどう認証・認可・防御を組むか」を積み上げる。ソフトウェアを設計段階から
安全に作る話（Secure SDLC・脅威モデリング）は [`../05_software-security/`](../05_software-security/index.md) に譲る。

### 科目対応マップ

| ファイル | 他領域との接続 |
|---|---|
| 01 基本概念 | `../04_hardware-security/`（物理・サイドチャネルは別領域） |
| 02 ソフトウェア脆弱性 | `../01_prerequisites/02_low-level-c-os/01_c-and-memory.md`（メモリレイアウトの前提） |
| 03 認証・認可・アクセス制御 | `../01_prerequisites/02_low-level-c-os/02_process-and-os.md`（Lampsonマトリックスの予告） |
| 04 インフラセキュリティ | `../01_prerequisites/04_networks-probability/`（TCP/IPの基礎） |
| 05 分散システムセキュリティ | `../02_cryptography/05_protocols/README.md`（Bitcoinの暗号プリミティブ） |
| 06 無線セキュリティ | `../04_hardware-security/03_security-building-blocks.md`（PUF と同原理を攻撃側から使う）・`../02_cryptography/02_symmetric-crypto.md`（nonce 再利用） |
| 07 PKI とデジタルID | `../02_cryptography/03_public-key-crypto/04_digital-signatures.md`（署名の仕組み）・`../07_legal/03_regulatory-tsunami.md`（eIDAS） |

### 深掘りキュー（Layer 2 候補）

- [ ] ROPチェーンの実装詳細（`../01_prerequisites/02_low-level-c-os/index.md` の深掘りキューと統合）→ `deep/rop-chains/`
- [ ] PBFTの3フェーズプロトコル（Pre-prepare/Prepare/Commit）の詳細トレース → `deep/pbft-protocol/`
- [ ] PoS の具体的な安全性議論（スラッシング条件と finality）→ `deep/proof-of-stake/`
- [ ] 軽量クライアントの検証手法（SPV と sync committee）→ `deep/light-clients/`
- [ ] 車載セキュリティ標準（AUTOSAR SecOC, CAN-FD の認証拡張）→ `deep/can-security/`
- [ ] Lampsonマトリックスの実装例（Linux capabilities, POSIX ACL）→ `deep/lampson-matrix-impl/`

</details>

## 参考
