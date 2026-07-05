# 04. デジタル署名（RSA-PSS・ECDSA・EdDSA）

> 対応科目: H05E1B / H0Q28A ｜ 前: [03 楕円曲線暗号](./03_ecc.md) ｜ 層: 基礎(Layer 1)
> 親: [README](./README.md)

[`../01_goals-and-primitives.md`](../01_goals-and-primitives.md) で見た通り、**否認防止は MAC では
実現できず、公開鍵署名が必要**だった（受信者も同じ鍵を持つ MAC とは違い、秘密鍵は
署名者だけが持つため）。ここでは RSA・ECC の両方の道具を使って実際に署名を組み立てる。

---

## 署名スキームの構造と安全性目標

```
KeyGen()        → (公開鍵 pk, 秘密鍵 sk)
Sign(sk, m)     → 署名 σ
Verify(pk, m, σ) → true/false

安全性目標: 存在的偽造不可能性 (EUF-CMA)
  攻撃者が「署名者に選んだメッセージを好きなだけ署名させられる」状況でも、
  署名させていない新しいメッセージに対する有効な署名を1つも作れないこと。
```

---

## RSA 署名：なぜ「秘密鍵で復号するだけ」では危険か

**教科書 RSA 署名**は `σ = m^d mod n`、検証は `m =? σ^e mod n`——暗号化の逆演算をそのまま流用。
これは [`01_rsa/04_padding-and-attacks.md`](./01_rsa/04_padding-and-attacks.md) で見た
**乗法準同型性がそのまま偽造に使える**という同じ弱点を持つ。

```
σ(m1)·σ(m2) = m1^d · m2^d = (m1·m2)^d = σ(m1·m2)   (mod n)
```

攻撃者は署名者に `m1, m2` を署名させれば、署名させていない `m1·m2 mod n` の
**有効な署名を計算だけで作れてしまう**（既存署名を掛け合わせるだけ）。
これは暗号化の展性（弱点2）と全く同じ数式が、今度は偽造の武器になっているケース。

### RSA-PSS（Probabilistic Signature Scheme）

Bellare–Rogaway が1996年に提案、PKCS#1 v2.1（RFC 8017、[`01_rsa/04`](./01_rsa/04_padding-and-attacks.md)
で既出）で `RSASSA-PSS` として標準化。

```
署名の前に: メッセージのハッシュ + ランダムな salt を混ぜ込んでからRSA演算する
```

毎回異なる salt を使うため同じメッセージでも署名結果が変わり（決定論性の解消）、
`σ(m1)·σ(m2)=σ(m1·m2)` のような単純な代数関係が壊れる（乗法準同型性の悪用を防ぐ）。
安全性を「RSA問題の困難性」に直接帰着できる証明可能安全性を持つ設計になっている。
新規実装では `RSASSA-PKCS1-v1_5`（教科書寄りの古い方式）ではなく **PSS を使う**のが標準。

---

## ECDSA（Elliptic Curve Digital Signature Algorithm）

[03](./03_ecc.md) で使った玩具曲線 `y²=x³+2x+2 (mod 17)`、生成点 `G=(5,1)`（位数 `n=19`）を
引き続き使う。秘密鍵 `d=7`、公開鍵 `Q=dG=(0,6)`。

```
署名 Sign(d, h):                          検証 Verify(Q, h, r, s):
  乱数 k を選ぶ（毎回ユニークかつ秘密！）    w = s⁻¹ mod n
  R = kG,  r = R.x mod n                   u1 = h·w mod n,  u2 = r·w mod n
  s = k⁻¹(h + r·d) mod n                   X = u1·G + u2·Q
  署名は (r, s)                            r ≡ X.x (mod n) なら受理
```

（`h` はメッセージのハッシュ値を整数化したもの。）

### 数値で確認（[03](./03_ecc.md) の続き）

```
h1=10（メッセージ1のハッシュ）, k=4（ランダムな nonce）
R = 4G = (3,1) → r = 3
s = 4⁻¹·(10 + 3·7) mod 19 = 4⁻¹·31 mod19 = 4⁻¹·12 mod19
4⁻¹ mod19 = 5（4·5=20≡1）なので s = 5·12 = 60 ≡ 3 (mod19)
署名 (r,s) = (3,3)
```

検証すると `X = u1·G + u2·Q` の `x` 座標が `r=3` に一致し、**受理される**（実装で確認済み）。

---

## nonce 再利用は秘密鍵が漏れる（実例つき）

ECDSA の安全性は **`k` が毎回ユニークかつ推測不能**であることに完全に依存する。
同じ `k` で2つの異なるメッセージに署名すると、`r` が同じ値になるため**即座に露見**し、
署名2つだけから秘密鍵 `d` が計算で求まる。

### 導出

同じ `k`（したがって同じ `r`）で `h1, h2` に署名した `(r,s1), (r,s2)` があるとする:

```
s1 = k⁻¹(h1 + r·d)      s2 = k⁻¹(h2 + r·d)
s1 - s2 = k⁻¹(h1 - h2)   →   k = (h1-h2) / (s1-s2)  mod n   ← k が求まる
d = (s1·k - h1) / r      mod n                              ← d も求まる
```

### 数値例（上の署名 `(r,s1)=(3,3)` に加え、同じ `k=4` で `h2=15` にも署名した場合）

```
s2 = 4⁻¹·(15 + 3·7) mod19 = 5·36 mod19 = 5·17 = 85 ≡ 9 (mod19)
署名2: (r,s2) = (3,9)   ← r が (3,3) と同じ！ nonce再利用の動かぬ証拠

攻撃者の計算:
k = (h1-h2)/(s1-s2) = (10-15)/(3-9) mod19 = (-5)/(-6) mod19
  = 5·inv(6,19) = 5·16 = 80 ≡ 4 (mod19)         ← k=4 を正しく復元
d = (s1·k - h1)/r = (3·4-10)/3 mod19 = 2·inv(3,19) = 2·13 = 26 ≡ 7 (mod19)   ← d=7 を正しく復元
```

（`inv(6,19)=16` は `6·16=96≡1`、`inv(3,19)=13` は `3·13=39≡1` で確認できる。）

### 実際に起きた事故

- **Sony PlayStation 3（2010年）**: 全ての署名に**定数**の `k`（乱数ですらなく固定値）を
  使っていたため、fail0verflow が公開された2つの署名だけから Sony の署名用秘密鍵を復元。
  George Hotz（geohot）が鍵を公開し、PS3 のコード署名モデル全体が崩壊した。
- **Android の Bitcoin ウォレット（2013年）**: `SecureRandom` の実装不備で `k` が
  正しく初期化されず複数トランザクションで再利用され、送金署名の `r` が重複した
  ウォレットから残高が盗まれた（Bitcoin Wallet, blockchain.info, Mycelium 等が影響）。

### 対策：EdDSA（決定論的署名）

RFC 8032（2017年）で標準化された **Ed25519**（[03](./03_ecc.md) の Curve25519 と
双有理同値な Edwards 形の曲線を使用）は、`k` を**乱数ではなく秘密鍵とメッセージのハッシュから
決定論的に導出**する。同じメッセージには常に同じ `k`（したがって同じ署名）が生成されるため、
そもそも「弱い乱数生成器が nonce を漏らす／再利用する」という失敗クラス自体が構造的に消える。

---

## まとめ比較表

| 方式 | 基盤 | nonce/乱数への依存 | 標準化 | 代表用途 |
|---|---|---|---|---|
| RSASSA-PSS | RSA問題 | 乱数 salt（漏れても致命的ではない） | RFC 8017 (PKCS#1 v2.1+) | TLS証明書 |
| ECDSA | ECDLP | **秘密 nonce k が命綱**（再利用・偏りで即鍵漏洩） | FIPS 186-5 | TLS, Bitcoin |
| EdDSA (Ed25519) | ECDLP (Curve25519系) | 決定論的（乱数不要） | RFC 8032 | SSH, Signal, 新規TLS |

---

## 演習（解答つき）

1. RSA 署名で `σ(m1)·σ(m2)=σ(m1·m2)` が成り立つ理由を指数法則で一行で示せ（[`01_rsa/04`](./01_rsa/04_padding-and-attacks.md) 参照）。
2. ECDSA で `r1=r2` の署名を2つ見つけたら、まず何を疑うべきか。
3. EdDSA が「nonce 再利用」という攻撃クラスをそもそも構造的に防げる理由を一言で述べよ。

<details><summary>解答</summary>

1. `σ(m1)·σ(m2) = m1^d·m2^d = (m1·m2)^d = σ(m1·m2) (mod n)`（指数法則 `a^d b^d=(ab)^d`）。
2. **同じ nonce `k` が2回使われた（乱数生成器の不備や定数nonceの実装ミス）**ことを疑うべき。
   `r=kG` の `x` 座標なので、`r` が一致するのは（極めて低確率の偶然を除けば）ほぼ確実に
   同じ `k` が使われた証拠であり、2つの署名から秘密鍵が計算で復元できてしまう。
3. EdDSA は署名のたびに乱数を生成するのではなく、**秘密鍵とメッセージから nonce を
   決定論的に計算する**ため、乱数生成器が壊れていても・同じメッセージに何度署名しても
   nonce が意図せず再利用されたり推測可能な形で漏れたりする余地が構造的に存在しない。

</details>

---

## 次への接続

これで公開鍵暗号（RSA・DH・ECC・署名）が一通り揃った。次はこれらが署名対象・鍵導出に
使ってきたハッシュ関数とMACそのものを見る。
→ [`../04_hash-and-mac.md`](../04_hash-and-mac.md)

---

## 参考

- Bellare, M., Rogaway, P. (1996). *The Exact Security of Digital Signatures — How to Sign with RSA and Rabin*. EUROCRYPT '96（PSSの原論文）。
- FIPS 186-5 — Digital Signature Standard (DSS)（ECDSA仕様）
- RFC 8032 — Edwards-Curve Digital Signature Algorithm (EdDSA, 2017): https://www.rfc-editor.org/rfc/rfc8032.html
- fail0verflow (2010). *Console Hacking 2010: PS3 Epic Fail*（Sony ECDSA nonce再利用の発表）
- KU Leuven H0Q28A シラバス: https://onderwijsaanbod.kuleuven.be/syllabi/e/H0Q28AE.htm
