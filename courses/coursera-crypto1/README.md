# Coursera「Cryptography I」講義ノート(Dan Boneh / Stanford)

Coursera の [Cryptography I](https://www.coursera.org/learn/crypto)(Dan Boneh 教授, Stanford)を日本語でまとめた講義ノート。**ビデオ1(コース前半)**をカバーする — 対称暗号のストリーム暗号から始まり、ブロック暗号、暗号利用モード、メッセージ完全性(MAC)、そして衝突耐性の入口まで。

各概念ファイル末尾に**講義内クイズ風の設問+手を動かす計算問題**を置き、解答は `<details>` で折りたたんでいる。

> このノートは既存の [topics/02_cryptography](../../topics/02_cryptography/index.md) を置き換えるものではなく、講義に沿った**詳細な副読ノート**として独立に書いている。対応関係は下の「topics との対応」を参照。

---

## 読む順

| No | モジュール | 内容 |
|----|-----------|------|
| 01 | [はじめに](./01_introduction/README.md) | コースの目標・暗号の応用範囲・暗号の限界・歴史的暗号と頻度解析 |
| 02 | [離散確率](./02_discrete-probability/README.md) | 分布・事象・確率変数・独立性・XOR の性質・誕生日パラドックス |
| 03 | [ストリーム暗号](./03_stream-ciphers/README.md) | 暗号の定義・OTP と完全秘匿・PRG・OTP への攻撃・実在ストリーム暗号・意味論的安全性 |
| 04 | [ブロック暗号](./04_block-ciphers/README.md) | PRF/PRP・DES と Feistel・総当たりと 3DES・高度な攻撃・AES・PRG から PRF(GGM) |
| 05 | [ブロック暗号の利用モード](./05_block-cipher-modes/README.md) | ECB の危険性・CPA 安全性と nonce・CBC・カウンタモード |
| 06 | [メッセージ完全性](./06_message-integrity/README.md) | MAC の定義・PRF ベース MAC・CBC-MAC/NMAC・パディングと CMAC/PMAC・ワンタイム MAC |
| 07 | [衝突耐性](./07_collision-resistance/README.md) | 衝突耐性ハッシュの定義と応用・誕生日攻撃 |

---

## topics との対応

<details>
<summary>対応表と進捗チェックリスト</summary>

### topics/02_cryptography との対応

| このノート | 対応する topics |
|-----------|----------------|
| 01_introduction | [01_goals-and-primitives](../../topics/02_cryptography/01_goals-and-primitives.md) |
| 02_discrete-probability | [math-for-crypto](../../topics/01_prerequisites/01_math-for-crypto/index.md) |
| 03_stream-ciphers | [02_symmetric-crypto/01_stream-ciphers-and-lfsr](../../topics/02_cryptography/02_symmetric-crypto/01_stream-ciphers-and-lfsr.md) |
| 04_block-ciphers | [02_symmetric-crypto/02_block-cipher-architecture](../../topics/02_cryptography/02_symmetric-crypto/02_block-cipher-architecture.md)・[03_aes-internals](../../topics/02_cryptography/02_symmetric-crypto/03_aes-internals.md) |
| 05_block-cipher-modes | [02_symmetric-crypto/04_modes-and-aead](../../topics/02_cryptography/02_symmetric-crypto/04_modes-and-aead.md) |
| 06_message-integrity / 07_collision-resistance | [04_hash-and-mac](../../topics/02_cryptography/04_hash-and-mac.md)・[02_symmetric-crypto/05_hashing-from-block-ciphers](../../topics/02_cryptography/02_symmetric-crypto/05_hashing-from-block-ciphers.md) |

### 進捗チェックリスト(概念ファイル28本)

- [x] 01_introduction: 01_course-overview-and-applications / 02_what-crypto-can-do / 03_history-of-ciphers
- [x] 02_discrete-probability: 01_probability-basics / 02_xor-and-birthday-paradox
- [x] 03_stream-ciphers: 01_cipher-definition-and-otp / 02_prg-and-stream-ciphers / 03_attacks-on-otp / 04_real-world-stream-ciphers / 05_prg-security-definitions / 06_semantic-security
- [x] 04_block-ciphers: 01_block-cipher-and-prf-prp / 02_des / 03_exhaustive-search-and-3des / 04_advanced-attacks / 05_aes / 06_prg-to-prf-ggm
- [x] 05_block-cipher-modes: 01_one-time-key-and-ecb / 02_cpa-security-and-nonces / 03_cbc-mode / 04_counter-mode
- [x] 06_message-integrity: 01_mac-definitions / 02_prf-based-macs / 03_cbc-mac-and-nmac / 04_padding-and-cmac-pmac / 05_one-time-mac-carter-wegman
- [x] 07_collision-resistance: 01_collision-resistance-intro / 02_birthday-attack

</details>

---

## ビデオ2(後半)について

ビデオ2(コース後半)は未収録。衝突耐性の続き(Merkle–Damgård・HMAC)、認証付き暗号、鍵交換、公開鍵暗号(RSA・ElGamal)、デジタル署名などを扱う。入手後、`08_` 以降のモジュールとして追加予定(既存の番号は変更しない)。
