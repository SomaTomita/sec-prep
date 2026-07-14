# 暗号 — サブ領域地図

> 層: 地図 (Layer 0)

このサブ領域は暗号系の専門選択科目群の中核。
道具（数学）は `../01_prerequisites/01_math-for-crypto/` に、適用がここ。

---

## 進捗チェックリスト

- [x] `01_goals-and-primitives.md` — CIA・認証/否認防止・プリミティブ分類・Kerckhoffsの原理・攻撃者モデル
- [x] `02_symmetric-crypto.md` — 対称鍵（ブロック/ストリーム・AES・DES/3DES廃止・モード ECB/CBC/CTR/GCM）
- [x] `03_public-key-crypto/` — 公開鍵暗号（概念フォルダ、全4ファイル完成）
  - [x] `01_rsa/` — RSA（鍵生成・暗号化復号・正しさ証明・パディング/攻撃）
  - [x] `02_dh.md` — Diffie–Hellman 鍵共有・CDH/DDH・前方秘匿性・Logjam
  - [x] `03_ecc.md` — 楕円曲線暗号（群構造・ECDH・NIST P-256 vs Curve25519・Dual_EC_DRBG）
  - [x] `04_digital-signatures.md` — デジタル署名（RSA-PSS・ECDSA・nonce再利用事故・EdDSA）
- [x] `04_hash-and-mac.md` — ハッシュ性質・Merkle-Damgård/スポンジ・長さ拡張攻撃・HMAC・MD5/SHA-1廃止
- [x] `05_protocols-overview.md` — TLS1.3/IPsec/SSH/Signal/EMV/Blockchain の地図
- [x] `06_advanced-topics-map.md` — 耐量子(NIST 2024標準)・FHE(Gentry)・MPC(Yao/Shamir)・サイドチャネル（上級地図）

---

## 科目対応マップ

| トピック |
|---|
| 対称鍵・AES |
| RSA・DH・ECC |
| デジタル署名・プロトコル |
| 計算量・代数 |
| 耐量子（格子・コード） |

---

## 深掘りキュー（Layer 2 候補）

- [ ] （読み進めながら追記）

---

## 参考（サブ領域全体）
