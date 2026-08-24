# 02. 対称鍵暗号（ブロック暗号・ストリーム暗号・モード）

> 対応科目: Applied Cryptography and Cryptanalysis ｜ 前: [01 目標とプリミティブ](./01_goals-and-primitives.md) ｜ 次: [03 公開鍵暗号](./03_public-key-crypto/README.md) ｜ 層: 基礎(Layer 1)

**この1ページで分かること**

- AES（SPN構造）と ChaCha20 が現在の対称鍵暗号の主役である理由と、DES/3DES の廃止経緯
- ブロック暗号を任意長のデータに使う「モード」の比較と、ECB 禁止・GCM 推奨の根拠
- CTR/GCM での nonce 使い回しがなぜ破局的か（OTP の鍵再利用と同型）

対称鍵暗号は**暗号化と復号に同じ鍵**を使う方式。公開鍵暗号（RSA。
[`03_public-key-crypto/01_rsa/`](./03_public-key-crypto/01_rsa/README.md)）よりも
桁違いに高速なため、実際に大量データを暗号化するのは常に対称鍵の役目。
TLS などのプロトコルでは「鍵共有だけ公開鍵、本体は対称鍵」という**ハイブリッド暗号**が定石。

---

## ブロック暗号とストリーム暗号

```
ストリーム暗号: 平文を1ビット/バイトずつ、鍵から生成した擬似乱数列（キーストリーム）と XOR する
ブロック暗号:   平文を固定長のブロック（例: 128bit）単位で変換する
```

理想のストリーム暗号は完全秘匿を達成する **ワンタイムパッド（OTP）**
（[`../01_prerequisites/01_math-for-crypto/05_info-theory/03_perfect-secrecy-otp.md`](../01_prerequisites/01_math-for-crypto/05_info-theory/03_perfect-secrecy-otp.md)）
だが、鍵を平文と同じ長さだけ使い捨てるのは非現実的。実際のストリーム暗号は
**鍵から擬似乱数列を生成するアルゴリズム**で OTP を近似する。

- 代表例: **ChaCha20**（D. J. Bernstein 設計、Salsa20 の改良版、256bit 鍵）。
  MAC の Poly1305 と組み合わせた **ChaCha20-Poly1305** が RFC 8439（2018年、RFC 7539 を置換）
  で標準化され、AES 用ハードウェア支援がない環境（モバイル等）で TLS の既定候補になる。

ブロック暗号は「固定長ブロックしか暗号化できない」ため、任意長のメッセージを扱うには
後述の **モード（暗号利用モード）** が必要。

> 深掘り: Vernam/OTP から PRG・FSM までを1ビットずつ動かして追える教材を
> [`deep/stream-ciphers/`](./deep/stream-ciphers/README.md) に置いた。

---

## AES（Advanced Encryption Standard）

### 経緯とパラメータ

NIST が公募したコンペティションで選ばれた **Rijndael**（Joan Daemen, Vincent Rijmen 設計）が
**FIPS 197**（2001年11月26日）として標準化されたもの。

| 項目 | 値 |
|---|---|
| ブロック長 | 128 bit（固定） |
| 鍵長 | 128 / 192 / 256 bit |
| ラウンド数 | 10 / 12 / 14（鍵長に応じて増える） |

### 構造：SPN（Substitution-Permutation Network）

AES は各ラウンドで `SubBytes → ShiftRows → MixColumns → AddRoundKey` を繰り返す
**SPN 構造**。これは旧世代の **DES がラウンド関数を左右交互に適用する Feistel 構造**を
採る点と対照的（Feistel は暗号化・復号の回路を共有できる利点があるが、
SPN の方が1ラウンドあたりの拡散が速く、並列化もしやすい）。

`SubBytes`（非線形置換）と `MixColumns`（拡散）の中身は有限体 `GF(2^8)` 上の演算で、
その計算過程は
[`../01_prerequisites/01_math-for-crypto/02_groups-rings-fields/06_gf2n-and-aes.md`](../01_prerequisites/01_math-for-crypto/02_groups-rings-fields/06_gf2n-and-aes.md)
で手計算まで追っているのでそちらを参照（本ファイルでは重複させない）。

### DES / 3DES はなぜ廃止されたか

- **DES**（1977年標準化、Feistel構造、56bit鍵、64bitブロック）は鍵空間が小さすぎ、
  1998年に EFF の専用ハードウェア「Deep Crack」がわずか **56時間**で鍵を割り出した。
- **3DES**（DES を3回掛ける延命策）は鍵長こそ増えるが**ブロック長は64bitのまま**。
  64bit ブロックは十分な量（birthday bound、約32GB）の暗号文が同一鍵で蓄積すると
  衝突が起き平文が漏れる —— これが **Sweet32 攻撃**（2016年発見）。
  NIST は3DESを新規用途で2023年末までに**使用禁止**とした（SP 800-67 Rev.2 は 2024年1月1日付で廃止）。

---

## 暗号利用モード（Modes of Operation）

ブロック暗号を長いメッセージに適用する方法。NIST SP 800-38 シリーズが標準化する。

```
ECB (Electronic Codebook):  各ブロックを独立に暗号化。IV 不要
CBC (Cipher Block Chaining): 前の暗号文ブロックと XOR してから暗号化。IV 必要（ブロック長と同じ）
CTR (Counter):               カウンタを暗号化した値と平文を XOR（ストリーム暗号化）。ユニークな nonce/カウンタが必要
GCM (Galois/Counter Mode):   CTR + 認証（GMAC）を組み合わせた AEAD。ユニークな nonce が必要
```

（IV＝初期化ベクトル：同じ平文でも暗号文が毎回変わるようにするための初期値。モードごとに使われ方が異なる。
nonce＝number used once：同じ鍵の下で決して再利用してはいけない使い捨ての値。）

### ECB は使ってはいけない

同じ平文ブロックは常に同じ暗号文ブロックになる（決定論的）ため、画像のような
繰り返しパターンを持つデータを暗号化すると元のパターンが暗号文に透けて見える
（有名な「ECBペンギン」の例）。教科書 RSA の弱点1（決定論性、
[`03_public-key-crypto/01_rsa/04_padding-and-attacks.md`](./03_public-key-crypto/01_rsa/04_padding-and-attacks.md)）
と全く同じ問題がブロック暗号のモードにも現れる。

### CBC とパディングオラクル攻撃

IV が必要で、ブロック同士が連鎖するため並列暗号化はできない（復号は並列化可能）。
パディングの検証結果が外部から観測できると **パディングオラクル攻撃**が成立する。
2014年の **POODLE**（SSLv3 の CBC モードを標的、CVE-2014-3566）はこの典型例で、
攻撃者は平均 256 リクエストで暗号文 1 バイトを復元できた。
「パディングが正しいかどうかの1ビットの漏洩から全体を復号する」という発想は
RSA の Bleichenbacher 攻撃（[`03_public-key-crypto/01_rsa/04_padding-and-attacks.md`](./03_public-key-crypto/01_rsa/04_padding-and-attacks.md)）
と同じ攻撃クラス（padding oracle）に属する——対象（RSA/PKCS#1 vs ブロック暗号/CBC）が違うだけ。

### CTR / GCM と nonce 再利用の危険性

CTR も GCM もブロック暗号を**ストリーム暗号のように**使う（カウンタや nonce を
暗号化した結果を鍵ストリームとして XOR する）。この方式は
**同じ鍵で同じ nonce を2回使うと、2つの平文の XOR が暗号文から直接求まる**——
これは OTP で鍵を使い回した場合と全く同じ破局的な失敗
（[`../01_prerequisites/01_math-for-crypto/05_info-theory/03_perfect-secrecy-otp.md`](../01_prerequisites/01_math-for-crypto/05_info-theory/03_perfect-secrecy-otp.md)
で見た「鍵は使い捨てでなければならない」という制約が、ここでは「nonce は使い捨てでなければ
ならない」という形で再登場している）。

**GCM** は CTR に加えて **GMAC** による認証タグを付け、暗号化と改ざん検知を同時に行う
**AEAD（Authenticated Encryption with Associated Data、認証付き暗号）**。TLS 1.3 では
AES-GCM・ChaCha20-Poly1305 が標準の暗号スイートになっている。

---

## モード比較表

| モード | IV/nonce | 並列化 | 認証（改ざん検知） | 現在の推奨 |
|---|---|---|---|---|
| ECB | 不要 | 可 | なし | ❌ 使用禁止 |
| CBC | 必要 | 復号のみ可 | なし（別途MAC必要） | 非推奨（要 Encrypt-then-MAC） |
| CTR | 必要（使い捨て） | 可 | なし（別途MAC必要） | 条件付き可 |
| GCM | 必要（使い捨て） | 可 | あり（GMAC内蔵） | ✅ 推奨（AEAD） |

---

## 暗号での出口：ハイブリッド暗号（TLS の設計）

公開鍵暗号は数学的に重い演算（べき乗 mod n など）を伴い遅い。対称鍵暗号は
桁違いに高速だが鍵共有が課題。実際のプロトコルは両者を組み合わせる:

```
1. 鍵交換: RSA暗号化 or ECDHE で「共通鍵（セッション鍵）」を安全に共有
   （RSAでの鍵共有イメージは 03_public-key-crypto/01_rsa/02_encryption-decryption.md 参照）
2. 本体: 共有できた共通鍵で AES-GCM / ChaCha20-Poly1305 を使い、実データを高速に暗号化
```

TLS 1.3 のプロトコル全体像は [`05_protocols/README.md`](./05_protocols/README.md) で扱う。

---

## 演習（解答つき）

1. AES-256 のラウンド数はいくつか。AES-128 と比べて安全性以外にどんなコストが増えるか。
2. CBC モードと CTR モードで、暗号化処理自体を並列化できるのはどちらか。理由も述べよ。
3. GCM で同じ鍵・同じ nonce を2回使うと何が起きるか、OTP の鍵再利用と対比して説明せよ。

<details><summary>解答</summary>

1. AES-256 は **14ラウンド**（AES-128は10、AES-192は12）。ラウンド数が増えるほど
   暗号化・復号にかかる計算時間（レイテンシ）が増える。
2. **CTR**。各ブロックは「カウンタ値を暗号化してXOR」するだけで、前のブロックの結果に
   依存しない。CBC は各ブロックの暗号化に前の暗号文ブロックが必要なため暗号化は逐次的
   （復号は前の暗号文ブロックが分かっていればよいので並列化できる）。
3. 同じ鍵ストリーム（keystream）が2回使われることになり、2つの暗号文を XOR すると
   鍵ストリームが打ち消し合って2つの平文の XOR がそのまま得られてしまう。
   OTP で同じ鍵を2回使うと完全秘匿が崩れるのと本質的に同じ失敗モード。

</details>

---

## 参考

- FIPS 197 — Advanced Encryption Standard (AES), NIST (2001): https://nvlpubs.nist.gov/nistpubs/fips/nist.fips.197.pdf
- NIST SP 800-38A — Recommendation for Block Cipher Modes of Operation
- NIST SP 800-38D — Galois/Counter Mode (GCM) and GMAC
- RFC 8439 — ChaCha20 and Poly1305 for IETF Protocols (2018): https://www.rfc-editor.org/rfc/rfc8439.html
- Sweet32: Birthday attacks on 64-bit block ciphers in TLS and OpenVPN (2016): https://sweet32.info/
- CISA — SSL 3.0 Protocol Vulnerability and POODLE Attack (2014): https://www.cisa.gov/news-events/alerts/2014/10/17/ssl-30-protocol-vulnerability-and-poodle-attack
