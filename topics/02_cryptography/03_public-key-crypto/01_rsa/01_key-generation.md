# 01. RSA 鍵生成

> 親: [README](./README.md) ｜ 次: [02 暗号化・復号](./02_encryption-decryption.md) ｜ 層: 基礎(Layer 1)

**この1ページで分かること**

- RSA の鍵ペアを作る5ステップと、各パラメータ（n, λ(n), e, d）のどれが公開・どれが秘密か
- `e = 65537` が慣習になっている理由と、`d` を拡張ユークリッドで計算すること
- 素数 `p, q` の選び方の落とし穴（`p ≈ q`・smooth な `p−1`）

受信者（Bob）が1回だけ行う処理。秘密鍵は自分で生成して手元に置き、**公開鍵だけを相手に渡す**。
鍵共有が不要なことが RSA の出発点。

---

## 手順

```
Step 1. 大きな素数 p, q を選ぶ          （秘密。廃棄または厳重保管）
Step 2. n = p · q                        （公開）
Step 3. λ(n) = lcm(p−1, q−1) を計算     （秘密。中間値）
Step 4. gcd(e, λ(n)) = 1 を満たす e を選ぶ  （公開）
Step 5. d ≡ e⁻¹ (mod λ(n)) を計算       （秘密）

公開鍵: (n, e)
秘密鍵: (n, d)  ←または (p, q, d) をまとめて保持
```

---

## 各パラメータの意味

### n（モジュラス）

- `p · q`。公開するが、素因数分解が困難なため `p, q` は漏れない
  （困難性の根拠: [`03_number-theory/05_hard-problems.md`](../../../01_prerequisites/01_math-for-crypto/03_number-theory/05_hard-problems.md)）。
- 実用サイズ: **2048 bit 以上**（NIST SP 800-57）。2048 bit の `n` を作るには
  それぞれ約 1024 bit の素数 `p, q` を用意する。

### λ(n)（カーマイケル関数）

- `lcm(p−1, q−1)`。`d` を計算する際の法。gcd と lcm の関係は
  [`01_modular-arithmetic/04_gcd-euclidean.md`](../../../01_prerequisites/01_math-for-crypto/01_modular-arithmetic/04_gcd-euclidean.md)。
- 古い教科書では `φ(n) = (p−1)(q−1)` を使う（オイラーの関数、
  [`03_number-theory/03_euler-phi-theorem.md`](../../../01_prerequisites/01_math-for-crypto/03_number-theory/03_euler-phi-theorem.md)）。
  `λ(n) | φ(n)` なので `λ(n) ≤ φ(n)` で、より小さい `d` が得られる。
  どちらを使っても正しさ（[03](./03_correctness-proof.md)）は成り立つ。
- FIPS 186-5（2023）は `λ(n)` を推奨。

### e（公開指数）

- `gcd(e, λ(n)) = 1`（`e` と `λ(n)` が互いに素）が条件。→ `d` が存在するために必要。
- 慣習的によく使われる値: **65537**（`= 2¹⁶ + 1`）。
  - バイナリ表現で 1 が少なく（`10000000000000001`）、べき乗計算（[02](./02_encryption-decryption.md)）が速い。
  - 素数なので `p−1` または `q−1` が 65537 の倍数でなければ確実に互いに素。
- `e = 3` のような極端に小さい指数は、パディングを誤ると Coppersmith 攻撃等で破られる
  → [04 パディングと攻撃](./04_padding-and-attacks.md)。

### d（秘密指数）

- `e · d ≡ 1 (mod λ(n))` を満たす正の整数。
- 拡張ユークリッド（[`01_modular-arithmetic/05_extended-euclidean.md`](../../../01_prerequisites/01_math-for-crypto/01_modular-arithmetic/05_extended-euclidean.md)）で計算。
- `d` が漏れると暗号は完全に破れる。

---

## 小さな数の例（概念確認用）

```
p = 5, q = 11
n = 55
λ(n) = lcm(4, 10) = 20
e = 3       （gcd(3, 20) = 1 ✓）
d = 3⁻¹ mod 20 = 7    （3·7 = 21 ≡ 1 (mod 20) ✓）

公開鍵: (55, 3)
秘密鍵: (55, 7)
```

> 実際の RSA は `n` が 2048 bit 以上で、手計算は不可能。この例は仕組みを確認するためだけのもの。

---

## 素数 p, q の選び方（実装上の注意）

- 暗号論的乱数生成器（CSPRNG）で生成し、確率的素数判定（Miller-Rabin、
  [`03_number-theory/02_fermat-little-theorem.md`](../../../01_prerequisites/01_math-for-crypto/03_number-theory/02_fermat-little-theorem.md) 参照）で確認。
- **`p ≈ q` はダメ**: `n = p·q` で `p ≈ q` のとき `p ≈ √n` となり、`√n` 周辺を探索すれば
  因数分解できる（Fermat's factorization）。
- **`p−1`, `q−1` に大きな素因数が必要**（smooth number＝小さな素因数だけからなる数。
  `p−1` が smooth だと専用の因数分解法で破られるため、その対策）。
- `p, q` を鍵生成後に廃棄するか、RSA–CRT（高速化。
  [`03_number-theory/04_crt.md`](../../../01_prerequisites/01_math-for-crypto/03_number-theory/04_crt.md)）のため厳重保管するかは実装方針による。

---

## 演習（解答つき）

1. `p=7, q=13` として `n` と `λ(n)` を求めよ。
2. 上の `n, λ(n)` に対し `e=5` は使えるか（`gcd(e, λ(n))=1` を確認せよ）。
3. `p ≈ q` にしてはいけない理由を一言で述べよ。

<details><summary>解答</summary>

1. `n = 7×13 = 91`。`λ(n) = lcm(6, 12) = 12`。
2. `gcd(5, 12) = 1` なので使える。
3. `n = p·q` で `p ≈ q` だと `p ≈ √n` となり、`√n` 付近だけを探索すれば
   `p, q` が見つかってしまう（Fermatの因数分解法）ため、素因数分解の困難性という
   RSAの安全性の前提が崩れる。

</details>

---

## 次への接続

鍵が揃ったら暗号化と復号を見る。
→ [02 暗号化・復号](./02_encryption-decryption.md)
