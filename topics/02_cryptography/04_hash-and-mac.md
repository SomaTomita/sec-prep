# 04. ハッシュ関数と MAC

> 前: [03 公開鍵暗号](./03_public-key-crypto/README.md) ｜ 層: 基礎(Layer 1)

これまでの全ファイルが実は前提にしてきた道具がハッシュ関数。ECDSA の署名対象は
`H(m)`（[`03_public-key-crypto/04_digital-signatures.md`](./03_public-key-crypto/04_digital-signatures.md)）、
RSA-OAEP/PSS もハッシュとマスク生成関数（[`01_rsa/04`](./03_public-key-crypto/01_rsa/04_padding-and-attacks.md)）が核。
本ファイルでその「ハッシュ関数」自体の性質と、それを鍵付きにした **MAC** を扱う。

---

## ハッシュ関数の3つの安全性

```
任意長の入力 m を固定長の出力 H(m)（ダイジェスト）に写す関数。鍵は使わない。

原像計算困難性 (preimage resistance):
  h が与えられたとき、H(m)=h となる m を見つけるのが困難
第2原像計算困難性 (2nd-preimage resistance):
  m1 が与えられたとき、H(m1)=H(m2) となる別の m2 を見つけるのが困難
衝突困難性 (collision resistance):
  H(m1)=H(m2) となる任意の m1≠m2 の組を見つけるのが困難
```

**衝突困難性が最も強い性質**——衝突困難なら第2原像困難性も原像困難性も自動的に従う
（攻撃者が両方の入力を自由に選べる衝突探索の方が、片方が固定される原像探索より易しいため）。

### バースデー攻撃と出力長の関係

`n` bit の出力を持つハッシュ関数について:

```
原像を見つける総当たり: 2^n 回
衝突を見つける総当たり: 2^(n/2) 回だけで済む（バースデーパラドックスにより）
```

「64bit のダイジェストなら `2^32` 回程度の試行で衝突が見つかる」——これが
衝突困難性を狙うなら出力長は原像耐性の**2倍**必要という経験則の理由。
SHA-256（256bit）が実務標準なのは、衝突耐性で `2^128` という十分な安全マージンを
確保するため。

---

## 構成方式：Merkle–Damgård と スポンジ構造

```
Merkle–Damgård構成（MD5, SHA-1, SHA-2系＝SHA-256/SHA-512など）:
  メッセージをブロックに分割し、圧縮関数を順番に適用して内部状態を更新し続ける
  最終的な内部状態がそのままダイジェストになる

スポンジ構成（SHA-3/Keccak, NIST FIPS 202, 2015年8月5日承認）:
  「吸収(absorb)」フェーズでメッセージを内部状態に混ぜ込み、
  「絞り出し(squeeze)」フェーズで出力を取り出す。任意長出力（SHAKE128/256）にも対応
```

SHA-3 は SHA-2 の**後継**ではなく、構成方式が全く異なる**設計の多様化**
（NIST が「万一 Merkle–Damgård に構造的な弱点が見つかっても保険になる」という
方針でコンペティションを実施した結果）。

---

## 長さ拡張攻撃（Length Extension Attack）

Merkle–Damgård構成の弱点: **最終的な内部状態がそのままダイジェストとして公開される**ため、
`H(m)` と `m` の長さだけ知っていれば、`m` の中身を知らなくても
`H(m ‖ padding ‖ m2)` を`m2`だけから計算できてしまう（続きから計算を再開できるため）。

- 影響を受ける: MD5, SHA-1, SHA-256, SHA-512（すべて Merkle–Damgård構成）
- 影響を受けない: SHA-384, SHA-512/256（内部状態の一部を切り捨てて出力する変種）、SHA-3全般
  （スポンジ構成は内部状態の一部しか外に出さないため）

**典型的な誤用**: 「認証コード」のつもりで `MAC = H(secret ‖ message)` を自作すると、
攻撃者は `secret` を知らなくても `H(secret‖message‖padding‖extra)` を計算でき、
`message‖padding‖extra` に対する偽の「認証コード」を作れてしまう。
**この誤りを避けるために標準化されたのが HMAC。**

---

## HMAC（RFC 2104）

```
HMAC(k, m) = H( (k ⊕ opad) ‖ H( (k ⊕ ipad) ‖ m ) )
```

鍵をメッセージの前に単純結合するのではなく、**ハッシュを2回・入れ子に**適用する。
この構造により、たとえ内部で使うハッシュ関数が Merkle–Damgård構成（長さ拡張攻撃に弱い）
であっても、HMAC自体は長さ拡張攻撃を受けない。任意のハッシュ関数と組み合わせて使える
（`HMAC-SHA256` のように命名）。

---

## MAC のもう一つの作り方：普遍ハッシュ族ベース

HMAC（ハッシュ関数ベース）以外に、**普遍ハッシュ族**を使う高速な MAC もある。
[`02_symmetric-crypto.md`](./02_symmetric-crypto.md) で既出の

- **GMAC**（GCM モードの認証部分）
- **Poly1305**（ChaCha20-Poly1305 の認証部分）

はどちらもこの系統で、ブロック暗号やストリーム暗号と組み合わせた AEAD の中で使われる
（詳細・使い方は [`02_symmetric-crypto.md`](./02_symmetric-crypto.md) 参照。ここでは重複させない）。

---

## MD5・SHA-1 はなぜ廃止されたか

```
MD5（1992年設計、128bit出力）:
  2004年8月、Wang・Feng・Lai・Yuが実用的な衝突攻撃を発表
  （IBM p690クラスタで約1時間、計算量は約2^39回のMD5圧縮関数呼び出し相当）
  → 完全性検証・証明書署名等での使用は禁止

SHA-1（1995年設計、160bit出力）:
  理論的な弱点は2005年頃から指摘され、NISTは2011年に非推奨化
  2017年2月23日、GoogleとCWIが「SHAttered」攻撃で初の実用的衝突を実証
  （内容の異なる2つのPDFファイルが同一のSHA-1値を持つことを実際に構築）
  計算量は2^63.1回のSHA-1圧縮関数相当（当時のクラウド費用で約10万ドル）
  → 主要ブラウザ・認証局・Gitなどが同年中にSHA-1の使用を停止
```

**教訓**: 「衝突が理論的に可能」と「実際に計算資源で作れる」の間には長い時間差があるが、
一度実証されると業界は急速に移行する。現在の新規実装は SHA-256（またはSHA-3）を使う。

---

## 目標 → 道具の対応（まとめ）

| 目標 | 道具 | 鍵 |
|---|---|---|
| データの完全性（改ざん検知、送信者は問わない） | ハッシュ関数単体（例: ダウンロードファイルの検証） | 不要 |
| 完全性 + 認証（共有鍵を持つ2者間） | MAC（HMAC・GMAC・Poly1305） | 対称鍵 |
| 完全性 + 認証 + 否認防止 | デジタル署名（内部でハッシュを使用） | 公開鍵ペア |

---

## 演習（解答つき）

1. 128bit 出力のハッシュ関数について、衝突を総当たりで見つけるにはおよそ何回の計算が必要か。
2. `MAC = H(secret‖message)` という自作MACのどこが危険か、一言で述べよ。
3. HMAC が「鍵とメッセージを単純結合するだけ」の方式より安全な理由を一言で述べよ。

<details><summary>解答</summary>

1. バースデーパラドックスにより衝突は `2^(128/2) = 2^64` 回程度の試行で見つかる
   （原像を見つける `2^128` 回よりずっと少ない）。
2. Merkle–Damgård構成のハッシュ関数（MD5, SHA-1, SHA-256等）は長さ拡張攻撃に弱く、
   `secret` を知らなくても `H(secret‖message‖padding‖extra)` を計算できてしまうため、
   `message‖padding‖extra` に対する偽の認証コードを作られてしまう。
3. HMAC は鍵を2回・入れ子構造でハッシュに混ぜ込むため、内部で使うハッシュ関数が
   長さ拡張攻撃に弱い Merkle–Damgård構成であっても、HMAC自体はその弱点を継承しない。

</details>

---

## 次への接続

道具（対称鍵・公開鍵・ハッシュ/MAC）が揃った。次はこれらを組み合わせた実際の
プロトコル（TLS・SSH・Signal等）を地図として見る。
→ [05 プロトコルの地図](./05_protocols-overview.md)

---

## 参考

- FIPS 180-4 — Secure Hash Standard (SHA-2 family)
- FIPS 202 — SHA-3 Standard: Permutation-Based Hash and Extendable-Output Functions (2015): https://csrc.nist.gov/pubs/fips/202/final
- RFC 2104 — HMAC: Keyed-Hashing for Message Authentication
- Wang, X. et al. (2004). *Collisions for Hash Functions MD4, MD5, HAVAL-128 and RIPEMD*.
- Stevens, M. et al. (2017). *The First Collision for Full SHA-1*（SHAttered）: https://shattered.io/
