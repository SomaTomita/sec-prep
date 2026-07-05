# 04. 教科書 RSA の脆弱性とパディング

> 親: [README](./README.md) ｜ 前: [03 正しさ証明](./03_correctness-proof.md) ｜ 層: 基礎(Layer 1)

[03](./03_correctness-proof.md) で示したのは「`c = mᵉ mod n`, `m = cᵈ mod n` が数学的に正しく動く」ことだけ。
パディングなしの **教科書 RSA（textbook RSA）** はこの性質だけでは安全でない。
実運用は必ず **OAEP**（暗号化）・**PSS**（署名）というランダム化パディングとセットで使う。

---

## 弱点 1: 決定論的（同じ平文 → 同じ暗号文）

`c = mᵉ mod n` は乱数を一切使わない。同じ `m` を暗号化すれば常に同じ `c` になる。

- 平文の候補が少ない場合（例: "はい"/"いいえ"、給与額など）、
  攻撃者は候補全てを公開鍵で暗号化して `c` と比較するだけで平文を特定できる。
- これは暗号の基本要件「意味論的安全性（semantic security, IND-CPA）」を満たさない。

---

## 弱点 2: 展性（malleability）— 準同型性の悪用

RSA は乗法に関して準同型:

```
Enc(m₁) · Enc(m₂) = m₁ᵉ · m₂ᵉ = (m₁·m₂)ᵉ = Enc(m₁·m₂)   (mod n)
```

攻撃者は `c` の中身を知らなくても、`c' = c · sᵉ mod n` を作れば
**復号結果を `s` 倍にできる**（`m' = m·s`）。署名や暗号文を検証なしに転送するプロトコルでは
攻撃者が金額などを勝手に書き換えられてしまう。

### 小さな数値例（[01](./01_key-generation.md) の鍵を流用）

```
n=55, e=3, d=7,  m=2 → c=8（[02](./02_encryption-decryption.md) の例）

攻撃者が s=3 を選び c'=c·sᵉ mod n = 8·27 mod 55 = 216 mod 55 = 51 を送りつける
Bob が復号: 51⁷ mod 55 = 6 = 2·3 = m·s   ← 中身を知らないまま3倍にされた
```

---

## 弱点 3: Håstad のブロードキャスト攻撃（低い公開指数 e）

同一の平文 `m` を、**同じ小さい `e`**（典型的には `e=3`）・**異なる法** `n₁, n₂, n₃` を持つ
`k ≥ e` 人の受信者に、パディングなしでそれぞれ送ってしまうケース。

```
c₁ = mᵉ mod n₁,  c₂ = mᵉ mod n₂,  c₃ = mᵉ mod n₃   (e=3 の場合)
```

`n₁, n₂, n₃` は互いに素なので **CRT**
（[`01_modular-arithmetic/07_crt-intro.md`](../../../01_prerequisites/01_math-for-crypto/01_modular-arithmetic/07_crt-intro.md)）
で `mᵉ mod (n₁n₂n₃)` を合成できる。`m < min(nᵢ)` なら `mᵉ < n₁n₂n₃` となり、
合成した値はそのまま（mod を外した）`mᵉ` の**整数値**に一致する。
あとは実数の範囲で **e乗根を取るだけ**（`m = ᵉ√(mᵉ)`）で平文が復元される。

> RSA-CRT（[`03_number-theory/04_crt.md`](../../../01_prerequisites/01_math-for-crypto/03_number-theory/04_crt.md)）が
> 正規の復号を高速化する道具だったのに対し、ここでは**同じ CRT が攻撃者の道具**になっている
> — 「互いに素な法を合成できる」という数学的事実そのものは善悪を選ばない。

**対策**: ランダム化パディング（OAEP）を使えば、同じ `m` でも受信者ごとに異なる暗号文になり、
CRT で合成しても無意味な値にしかならない。

---

## 弱点 4: Bleichenbacher の攻撃（PKCS#1 v1.5 パディングオラクル）

1998年、Daniel Bleichenbacher は当時の標準パディング **PKCS#1 v1.5** に対する
**適応的選択暗号文攻撃**を発表した。通称 **"million message attack"**。

- サーバが「復号したパディングが正しい形式か」を暗号文ごとに応答してしまう
  （エラーメッセージや処理時間の違いとして漏れる）実装上の欠陥を突く。
- この「パディングが正しいか」という 1 ビットの情報を、暗号文を少しずつ変えながら
  数十万回問い合わせることで、秘密鍵なしに任意の暗号文を復号できてしまう。
- 発表当時 SSL を含む実装が対象になった。同種の欠陥は形を変えて
  **ROBOT**（2018年）、**Marvin Attack**（2023年）として再発見され続けている——
  パディングオラクルは実装で塞ぎ切るのが難しい典型例。

**対策**: PKCS#1 v1.5 は新規実装では使わず、**OAEP** に置き換える。

---

## 解決策: ランダム化パディング

### 暗号化には OAEP（Optimal Asymmetric Encryption Padding）

- Bellare–Rogaway が 1994年に提案。RSA Laboratories が **PKCS#1 v2.0**（1998年10月）で
  `RSAES-OAEP` として標準化。2002年の v2.1 で SHA-2 系ハッシュに対応、
  現行の **v2.2 = RFC 8017**（2016年）でも新規実装は OAEP が要求され、
  v1.5 は後方互換のためにのみ残されている。
- 暗号化前に乱数とハッシュ関数でメッセージを撹拌する。同じ `m` でも毎回異なる `c` になり、
  弱点1〜3（決定論性・展性・ブロードキャスト攻撃）を同時に防ぐ。

### 署名には PSS（Probabilistic Signature Scheme）

- 暗号化とは目的が違う（署名は「本人しか作れない値」を作る）ため、OAEP をそのまま
  流用してはいけない。PKCS#1 v2.1 以降で標準化された `RSASSA-PSS` を使う。

---

## まとめ表

| 弱点 | 原因 | 対策 |
|---|---|---|
| 決定論的 | 乱数を使わない | OAEP（暗号化） |
| 展性 | 乗法準同型 `Enc(m₁)Enc(m₂)=Enc(m₁m₂)` | OAEP |
| ブロードキャスト攻撃 | 低い `e` + 同一平文 + パディングなし + CRT | OAEP |
| パディングオラクル（Bleichenbacher） | PKCS#1 v1.5 の検証結果が漏れる | OAEP・定数時間実装 |
| 署名偽造 | 暗号化用パディングの誤用 | PSS（署名専用） |

---

## 演習（解答つき）

1. `Enc(m₁)·Enc(m₂) ≡ Enc(m₁·m₂) (mod n)` となる理由を、べき乗の指数法則で一行で示せ。
2. Håstad のブロードキャスト攻撃で `k ≥ e` が条件になる理由を一言で述べよ。
3. OAEP がなぜ「決定論的」「展性」「ブロードキャスト攻撃」の3つ全てを同時に防げるのか。

<details><summary>解答</summary>

1. `m₁ᵉ · m₂ᵉ = (m₁·m₂)ᵉ (mod n)`（指数法則 `aᵉbᵉ=(ab)ᵉ` がそのまま mod n でも成立するため）。
2. CRT で `mᵉ mod (n₁⋯n_k)` を復元するには、`m < min(nᵢ)` のとき `mᵉ` が `n₁⋯n_k` を
   超えないことが必要。おおよそ `nᵢ` が同程度の大きさなら、`k` 個の積が `mᵉ` 以上になるには
   `k` が `e` 以上必要（`nᵢ ≈ m` 程度と仮定すると `n₁⋯n_k ≈ m^k ≥ m^e` に `k≥e` が要る）。
3. OAEP は暗号化前に**毎回新しい乱数**を混ぜてメッセージを撹拌するため、同じ `m` を暗号化しても
   出力 `c` が毎回変わる（決定論性を解消）。乱数とハッシュの非線形な混ぜ込みにより、
   `c` を操作しても復号結果 `m` を予測可能な形で変化させられなくなる（展性を解消）。
   受信者ごとに乱数が異なるため、CRT で複数の `c` を合成しても意味のある関係式が得られない
   （ブロードキャスト攻撃を無効化）。

</details>

---

## 次への接続

これで RSA（鍵生成・暗号化復号・正しさ証明・安全な運用）が一通り揃った。
次は全く異なる仕組みで鍵を共有する Diffie–Hellman を見る。
→ [`../02_dh.md`](../02_dh.md)

---

## 参考

- Bleichenbacher, D. (1998). *Chosen Ciphertext Attacks Against Protocols Based on the RSA Encryption Standard PKCS #1*. CRYPTO 1998.
- Bellare, M., Rogaway, P. (1994). *Optimal Asymmetric Encryption: How to Encrypt with RSA*. EUROCRYPT 1994.
- RFC 8017 — PKCS #1: RSA Cryptography Specifications Version 2.2 (2016): https://www.rfc-editor.org/rfc/rfc8017.html
- Håstad, J. (1988). *Solving Simultaneous Modular Equations of Low Degree*.
