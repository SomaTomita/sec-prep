# 合同算術（Modular Arithmetic）

> 対応科目: Cryptography and Network Security / Cryptographic Protocols ｜ 層: 基礎(Layer 1)
> 親: [../index.md](../index.md)

## 一言で

時計の針のように「n で割った余り」だけで整数を分類する演算体系（`a ≡ b (mod n)`）。RSA・DH・AES など現代暗号のほぼ全てがこの上に成り立つ、暗号数学の最初の関門。
概念ごとに 1 ファイル。番号順に「余り → 合同式 → 演算 → gcd → 逆元 → CRT」と一本道。

---

## 概念ファイル（番号順に読む）

| # | ファイル | 内容 | 講義 |
|---|---|---|---|
| 01 | [01_division-with-remainder.md](./01_division-with-remainder.md) | 余り付き割り算・整数除法・負の数への拡張 | 第1回 |
| 02 | [02_congruence-definition.md](./02_congruence-definition.md) | 合同式 `≡` の定義・同値関係・「a−b が n の倍数」 | 第2回前半 |
| 03 | [03_congruence-arithmetic.md](./03_congruence-arithmetic.md) | 演算規則（加減乗・べき乗）・割り算がダメな理由・一の位/余りの応用 | 第2回後半 |
| 04 | [04_gcd-euclidean.md](./04_gcd-euclidean.md) | gcd・lcm・ユークリッドの互除法（除算/減算版）・互いに素 | — |
| 05 | [05_extended-euclidean.md](./05_extended-euclidean.md) | 拡張ユークリッド・ベズーの等式・一次不定方程式 | — |
| 06 | [06_modular-inverse.md](./06_modular-inverse.md) | 逆元 `a⁻¹`・存在条件・拡張ユークリッドでの計算 | — |
| 07 | [07_crt-intro.md](./07_crt-intro.md) | 中国剰余定理（入口）。詳細は番号論へリンク | — |

> 「講義」列は学習元の動画（連続講義『合同式と RSA 暗号』）の対応回。
> 04〜07 は動画では後続回・別シリーズで扱われる範囲を先取りして整理したもの。

---

## なぜ重要か / コースでの位置づけ

### RSA 鍵生成で直結
- 秘密鍵 d は `d·e ≡ 1 (mod φ(n))` を満たす逆元 → 拡張ユークリッドで計算（06）
- RSA 暗号化: M^e mod n, 復号: C^d mod n → べき乗の mod 演算（03）

### DH 鍵共有
- 共有秘密 g^{ab} mod p の計算にべき乗 mod が登場
- 安全性の根拠は離散対数問題（`../03_number-theory/05_hard-problems.md` で詳述）

### 計算機代数での再登場
- 高速乗算（Karatsuba, Schönhage–Strassen）や素因数分解アルゴリズムは
  多倍長整数の mod 演算を効率化するもの

---

## このフォルダで「本体」を置かないもの（DRY）

合同算術と地続きだが、本体は別ファイルに置く。ここからはリンクで誘導する。

- **フェルマーの小定理 / オイラーの定理** → `../03_number-theory/02_fermat-little-theorem.md`（および `../03_number-theory/03_euler-phi-theorem.md`）
- **CRT の証明・構成的解法（詳細）** → `../03_number-theory/04_crt.md`（入口だけ 07 に置く）
- **RSA 暗号そのもの** → `../../../02_cryptography/`（合同算術はその道具）

---

## つまずき / 深掘り候補（Layer 2）

- [ ] べき乗の高速計算（fast exponentiation / square-and-multiply） → `deep/fast-exponentiation/`
- [ ] 拡張ユークリッドの手計算ステップ（表計算法） → `deep/extended-euclidean/`
- [x] 定数時間 GCD / 二進 GCD（サイドチャネル対策・safegcd） → [`../../../04_hardware-security/04_side-channels/README.md`](../../../04_hardware-security/04_side-channels/README.md)
- [ ] CRT の証明と構成的解法 → `deep/crt-proof/`
- [ ] gcd と互いに素の意味 → `deep/coprime-basics/`

---

## 参考

- Stallings, *Cryptography and Network Security* (7th ed.), Chapter 4 — Basic Concepts in Number Theory
- Boneh & Shoup, *A Graduate Course in Applied Cryptography*, Chapter 1（ドラフト無料公開: https://toc.cryptobook.us/）
