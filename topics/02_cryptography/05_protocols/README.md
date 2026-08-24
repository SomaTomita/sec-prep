# プロトコル（Cryptographic Protocols）

> 対応科目: Cryptographic Protocols ｜ 層: 基礎(Layer 1)
> 親: [../index.md](../index.md)

## 一言で

`01`〜`04` で個別のプリミティブ（RSA・DH・ECC・AES・ハッシュ・MAC・署名）を見た。
実世界のプロトコルはこれらを**組み合わせて**特定の問題を解く。

ただし「組み合わせれば安全になる」わけではない。**プリミティブが正しくてもプロトコルは破れる**——
その失敗のパターンを知ることが、このフォルダの主眼である。

---

## 概念ファイル（番号順に読む）

| # | ファイル | 内容 | 備考 |
|---|---|---|---|
| 01 | [01_entity-authentication.md](./01_entity-authentication.md) | 相手が「今そこにいる」ことの確認・パスワード保存・トークン・生体・リレー攻撃 | データ認証との違いが出発点 |
| 02 | [02_key-management.md](./02_key-management.md) | 鍵配送の3方式・KDC と鍵階層・Kerberos・TOFU・前方秘匿性が標準になった経緯 | 鍵の一生を追う |
| 03 | [03_tls-ipsec-ssh.md](./03_tls-ipsec-ssh.md) | TLS 1.3・IPsec・SSH——層と信頼モデルの違い | 同じ道具、違う設計判断 |
| 04 | [04_signal-emv-blockchain.md](./04_signal-emv-blockchain.md) | Signal・EMV・Blockchain——制約が設計を規定する例 | オフライン制約・分散合意 |

---

## プロトコルの安全性は「仮定」とセットでしか語れない

このフォルダを通して繰り返し現れる構造。

```
プリミティブの安全性: 「この関数を破るのは計算量的に困難」
プロトコルの安全性:   「これらの前提が満たされる限り、目的を達成する」
```

**前提が現実と食い違えば破れる。** 具体例はすべて本フォルダとその周辺に登場する。

| 破れ方 | どこで扱うか |
|---|---|
| 「証明者と検証者が近い」という暗黙の仮定 | [01](./01_entity-authentication.md)（リレー攻撃） |
| 「再送は起きない」という仮定 | [`../../06_systems-security/06_wireless-security.md`](../../06_systems-security/06_wireless-security.md)（KRACK） |
| 「端末は正直である」という仮定 | [01](./01_entity-authentication.md)（PIN バイパス） |
| 「鍵は1回しか使わない」という仮定 | [`../02_symmetric-crypto.md`](../02_symmetric-crypto.md)（nonce 再利用） |

---

## まとめ表：プロトコル → 目的 → 使うプリミティブ

| プロトコル | 目的 | 鍵交換/認証 | 本体の保護 |
|---|---|---|---|
| TLS 1.3 | Web通信 | ECDHE + RSA-PSS/ECDSA証明書 | AES-GCM / ChaCha20-Poly1305 |
| IPsec | VPN（IP層） | IKEv2（DHベース） | ESP（AES等） |
| SSH | リモートログイン | DH + ホスト鍵（TOFU） | 対称鍵暗号 |
| Signal | E2Eメッセージング | X3DH（X25519） | Double Ratchet派生鍵 |
| EMV | 決済カード | RSA階層署名（SDA/DDA/CDA） | （オフライン真正性検証が主眼） |
| Blockchain | 分散台帳 | ECDSA（secp256k1） | ハッシュチェーン + PoW |

---

## なぜ重要か / コースでの位置づけ

- **プリミティブとシステムの間**を埋める層である。暗号の授業で学ぶ道具が、
  実際のシステムでどう組まれるかがここで分かる
- **失敗の型を知ることが目的**。新しいプロトコルを設計する機会は少ないが、
  既存のものを正しく使う・評価する場面は多い
- 認証と鍵管理（[01](./01_entity-authentication.md)・[02](./02_key-management.md)）は
  他のあらゆる領域の前提になる

---

## このフォルダで「本体」を置かないもの（DRY）

- **各プリミティブの仕組み**（RSA・DH・ECC・AES・ハッシュ・MAC・署名） →
  [`../01_goals-and-primitives.md`](../01_goals-and-primitives.md) 〜 [`../04_hash-and-mac.md`](../04_hash-and-mac.md)
- **アクセス制御モデル**（DAC/MAC/RBAC/ABAC）と組織での IAM 運用 →
  [`../../06_systems-security/03_authn-authz-access-control.md`](../../06_systems-security/03_authn-authz-access-control.md)・
  [`../../08_management-governance/02_security-operations.md`](../../08_management-governance/02_security-operations.md)
- **PKI のエコシステム**（CA の階層・失効・証明書透明性） →
  [`../../06_systems-security/07_pki-and-identity.md`](../../06_systems-security/07_pki-and-identity.md)
- **無線特有の攻撃**（RF フィンガープリンティング・KRACK） →
  [`../../06_systems-security/06_wireless-security.md`](../../06_systems-security/06_wireless-security.md)
- **合意アルゴリズム**（PoW/PoS・トリレンマ） →
  [`../../06_systems-security/05_distributed-systems-security.md`](../../06_systems-security/05_distributed-systems-security.md)
- **耐量子への移行** → [`../06_advanced-topics-map.md`](../06_advanced-topics-map.md)

---

## つまずき / 深掘り候補（Layer 2）

- [ ] TLS 1.3 の 0-RTT モードとリプレイ耐性のトレードオフ → `deep/tls13-0rtt/`
- [ ] Needham–Schroeder プロトコルの既知の欠陥と修正 → `deep/needham-schroeder/`
- [ ] 形式手法によるプロトコル検証（記号モデルと計算モデル） → `deep/protocol-verification/`

---

## 参考

- RFC 8446 — The Transport Layer Security (TLS) Protocol Version 1.3
- RFC 4301, 4303, 7296 — IPsec Architecture, ESP, IKEv2
- RFC 4251–4253 — SSH Protocol Architecture / Authentication / Transport Layer
- Signal — *The X3DH Key Agreement Protocol* / *The Double Ratchet Algorithm*: https://signal.org/docs/
- 本フォルダの構成は COSIC Course 2026 の認証・鍵管理セッション（Bart Preneel, 2026年6月）の整理に基づく。
