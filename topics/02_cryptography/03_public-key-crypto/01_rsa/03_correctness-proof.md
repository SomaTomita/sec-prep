# 03. RSA 正しさの証明

> 親: [README](./README.md) ｜ 前: [02 暗号化・復号](./02_encryption-decryption.md) ｜ 次: [04 パディングと攻撃](./04_padding-and-attacks.md) ｜ 層: 基礎(Layer 1)

RSA が「暗号化して復号すれば元に戻る」ことを数学的に示す。
使う道具: **ベズーの等式・フェルマーの小定理・中国剰余定理（CRT）**。
`gcd(m,n)=1` の場合だけならオイラーの定理一発で済む
（[`03_number-theory/03_euler-phi-theorem.md`](../../../01_prerequisites/01_math-for-crypto/03_number-theory/03_euler-phi-theorem.md) 参照）が、
ここでは `m` が `p` や `q` の倍数になる場合も含めた **完全な証明** を CRT で行う。

---

## 何を証明するか

鍵生成（[01](./01_key-generation.md)）の設定で:

```
n = p·q（p, q は素数）
e·d ≡ 1 (mod λ(n))      λ(n) = lcm(p−1, q−1)
```

**主張**: 任意の `0 ≤ m < n` に対して `mᵉᵈ ≡ m (mod n)` が成り立つ。

これが成り立てば `Dec(sk, Enc(pk, m)) = (mᵉ)ᵈ mod n = m` が保証される。

---

## Step 1: d は存在するか

`e·d ≡ 1 (mod λ(n))` を満たす正の整数 `d` が存在することを示す。

**gcd(e, λ(n)) = 1 の確認**:

鍵生成では `gcd(e, (p−1)(q−1)) = 1` を満たす `e` を選ぶ。
`λ(n) = lcm(p−1, q−1)` は `(p−1)(q−1)` の約数なので `λ(n) | (p−1)(q−1)`。

仮に `gcd(e, λ(n)) > 1` とすると、共通素因数 `r` が存在し `r | e` かつ `r | λ(n)`。
`λ(n) | (p−1)(q−1)` なので `r | (p−1)(q−1)`。しかし `r | e` かつ `r | (p−1)(q−1)` は
`gcd(e, (p−1)(q−1)) ≥ r > 1` を意味し、前提と矛盾。よって **gcd(e, λ(n)) = 1**。

ベズーの等式（拡張ユークリッド、
[`01_modular-arithmetic/05_extended-euclidean.md`](../../../01_prerequisites/01_math-for-crypto/01_modular-arithmetic/05_extended-euclidean.md)）より
`e·x + λ(n)·y = 1` を満たす整数 `x, y` が存在する。

この `x` がそのまま正の整数でない場合も、`x` に `λ(n)` を足し続けることで
`e·(x + λ(n)·k) + λ(n)·(y − e·k) = 1` が成り立ち続けるため、
`x + λ(n)·k > 0` となる `k` を取れば**正の整数 d が必ず得られる**。∎

---

## Step 2: mᵉᵈ ≡ m (mod n) の証明

`e·d ≡ 1 (mod λ(n))` より `e·d = 1 + y·λ(n)` とおける（`y` は整数）。

### CRT による分離

`n = p·q`（`p, q` は異なる素数）なので、CRT
（[`01_modular-arithmetic/07_crt-intro.md`](../../../01_prerequisites/01_math-for-crypto/01_modular-arithmetic/07_crt-intro.md)、
証明は [`03_number-theory/04_crt.md`](../../../01_prerequisites/01_math-for-crypto/03_number-theory/04_crt.md)）より:

```
mᵉᵈ ≡ m (mod n)   ⟺   mᵉᵈ ≡ m (mod p) かつ mᵉᵈ ≡ m (mod q)
```

以下 `mod p` についてのみ証明する（`mod q` も同様）。

### mod p の証明: 場合分け

**Case 1: p ∤ m（m が p の倍数でない）**

フェルマーの小定理
（[`03_number-theory/02_fermat-little-theorem.md`](../../../01_prerequisites/01_math-for-crypto/03_number-theory/02_fermat-little-theorem.md)）より
`m^(p−1) ≡ 1 (mod p)`。

`λ(n) = lcm(p−1, q−1)` は `p−1` の倍数なので `(p−1) | λ(n)`、ゆえに `m^λ(n) ≡ 1 (mod p)`。

```
mᵉᵈ = m^(1 + y·λ(n)) = m · (m^λ(n))^y ≡ m · 1^y = m   (mod p)   ✓
```

**Case 2: p | m（m が p の倍数）**

`m ≡ 0 (mod p)` なので `mᵉᵈ ≡ 0 ≡ m (mod p)`。∎

### 同様に mod q でも成立 → CRT で合成

```
mᵉᵈ ≡ m (mod p)   かつ   mᵉᵈ ≡ m (mod q)
gcd(p, q) = 1  （p, q は異なる素数）
```

CRT より `mᵉᵈ ≡ m (mod pq)`、すなわち **mᵉᵈ ≡ m (mod n)**。∎

---

## まとめ図

```
鍵生成
  gcd(e, (p−1)(q−1)) = 1
  ↓ λ(n) | (p−1)(q−1) なので
  gcd(e, λ(n)) = 1
  ↓ ベズー（拡張ユークリッド）
  e·d ≡ 1 (mod λ(n))    ← d は正の整数として存在する

正しさ証明
  e·d = 1 + y·λ(n)
  ↓ フェルマー小定理: m^(p−1) ≡ 1 (mod p)
  ↓ (p−1) | λ(n) なので m^λ(n) ≡ 1 (mod p)
  mᵉᵈ ≡ m (mod p)   （case 1: p∤m）
  mᵉᵈ ≡ 0 ≡ m (mod p)   （case 2: p|m）
  ↓ 同様に mod q
  ↓ CRT で合成
  mᵉᵈ ≡ m (mod n) ✓
```

---

## 演習（解答つき）

1. `n=55=5×11`, `e=3`, `d=7` の設定で `m=5`（`p=5` の倍数、Case 2 に該当）のとき、
   `m^ed mod 5` と `m^ed mod 11` をそれぞれ場合分けの議論で説明せよ。
2. なぜ `λ(n)` の代わりに `φ(n)=(p−1)(q−1)` を使っても証明が成り立つのか一言で述べよ。

<details><summary>解答</summary>

1. `m=5` は `p=5` の倍数なので mod 5 では Case 2: `5^ed ≡ 0 ≡ 5 (mod 5)`。
   一方 `gcd(5,11)=1` なので mod 11 では Case 1 が適用でき、フェルマー小定理より
   `5^10 ≡ 1 (mod 11)`、`λ(n)=lcm(4,10)=20` は 10 の倍数なので `5^ed ≡ 5 (mod 11)`。
   CRT で合成すると `5^ed ≡ 5 (mod 55)`。
2. `λ(n) | φ(n)` なので `(p−1) | φ(n)` も成り立つ（`φ(n)=(p−1)(q−1)` は `p−1` の倍数）。
   証明中で使う唯一の性質は「`(p−1)` が法を割り切ること」なので、`φ(n)` でも同じ議論が通る。

</details>

---

## 暗号の堅牢さとの関係

この証明は「正しく動く」ことを示すだけで、**安全性**とは別。
安全性は「`n` の素因数分解が計算量的に困難」という仮定に依存しており、
それは証明されていない（P≠NP 問題に関連。詳細は
[`03_number-theory/05_hard-problems.md`](../../../01_prerequisites/01_math-for-crypto/03_number-theory/05_hard-problems.md)）。
量子コンピュータの Shor アルゴリズムは素因数分解を多項式時間で解くため、
RSA は将来的に危殆化する → 耐量子暗号（[`../../06_advanced-topics-map.md`](../../06_advanced-topics-map.md)）。

さらに、この証明は「教科書 RSA」（パディングなしの `mᵉ mod n`）が**数学的に正しく動く**ことしか
示していない。実運用ではこのままでは決定論的・展性があり脆弱 → [04 パディングと攻撃](./04_padding-and-attacks.md)。

---

## 次への接続

数学的に正しく動くことは分かった。しかし「教科書 RSA」をそのまま使うと
複数の実用上の脆弱性がある。
→ [04 パディングと攻撃](./04_padding-and-attacks.md)
