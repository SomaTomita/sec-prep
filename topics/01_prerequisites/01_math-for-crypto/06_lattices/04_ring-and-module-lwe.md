# 04. Ring-LWE と Module-LWE

> 親: [README](./README.md) ｜ 前: [03 LWE と SIS](./03_lwe-and-sis.md) ｜ 層: 基礎(Layer 1)

素の LWE（[03](./03_lwe-and-sis.md)）は行列 `A` が `n×n` サイズで、鍵サイズも
計算量も `n²` のオーダーになる。**多項式環という構造を持ち込んで軽くする**のが、
実際に標準化された方式のほぼすべてに共通する工夫である。

---

## Ring-LWE：行列を多項式1つに圧縮する

```
多項式環 R_q := Z_q[x] / (x^n + 1)   （n は2の冪。円分多項式の一種）
```

`n×n` 行列の代わりに、この環の元（多項式1つ）を使って LWE と同じ形の問題を作る——

```
Ring-LWE:  a·s + e = b （R_q 上の演算。a,s,e,b はすべて多項式）
```

`a` は `n×n` 行列と等価な情報を1つの多項式（`n` 個の係数）だけで表せる——
**鍵サイズが `n` 分の1になる**。多項式環そのもの（加減乗算・既約性）は
[`../04_polynomials-ideals/01_polynomial-rings.md`](../04_polynomials-ideals/01_polynomial-rings.md) が本体で、
本ファイルはその環の上に LWE を作るところだけを扱う。

Lyubashevsky, Peikert, Regev（EUROCRYPT 2010）が Ring-LWE を定式化し、
格子問題への帰着も（構造化された格子である**イデアル格子**上で）示した。
NTRU も同じ多項式環の上に構成される、Ring-LWE 以前からある方式である。

### 構造を入れる代償

多項式環という追加の代数構造は、攻撃者にとっても使える構造である——
**効率と、安全性の根拠となる仮定の強さは、ここでトレードオフになる。**
素の LWE ほど汎用的な困難性の裏付けはまだ確立していないが、
実用上必要な効率化として広く受け入れられている。

---

## Module-LWE：Ring-LWE の一般化

```
Ring-LWE: 1つの環元（多項式1個）が秘密・ノイズ・出力を担う
Module-LWE: 環元を成分とする「長さ k のベクトル」を使う
```

**Ring-LWE が「1リング」なら、Module-LWE は「リングの行列・ベクトル」**——
`k×k` サイズの、成分が `R_q` の元である行列・ベクトルを扱う。`k` を調整するだけで
安全性水準を細かく変えられるのが実装上の利点であり、Ring-LWE 単体より
柔軟なパラメータ設計ができる。

---

## ML-KEM（FIPS 203）

NIST 標準の **ML-KEM**（旧称 CRYSTALS-Kyber）は Module-LWE を安全性の基盤とする。

```
パラメータ: q = 3329, n = 256
```

**多項式環の代数構造が、効率的な実装（NTT による高速な多項式乗算）と
安全性証明の両方を同時に成り立たせる鍵になっている。** NTT（数論変換）自体の
仕組みは実装コストの中心であり、深掘りキュー行き。標準の全体地図（ML-KEM/ML-DSA/SLH-DSA の
対応表）は [`../../../02_cryptography/06_advanced-topics-map.md`](../../../02_cryptography/06_advanced-topics-map.md) が本体。

---

## どの標準がどの困難性の上に立つか

| 格子のどの問題 | どの標準 | 本体 |
|---|---|---|
| Module-LWE | ML-KEM（FIPS 203、鍵共有） | [`06_advanced-topics-map.md`](../../../02_cryptography/06_advanced-topics-map.md) |
| SIS（[03](./03_lwe-and-sis.md)の双対） | ML-DSA（FIPS 204、署名の基盤の一部） | 同上 |
| LWE のノイズ | FHE の性能問題の正体 | [`04_hardware-security/01_digital-platform-design.md`](../../../04_hardware-security/01_digital-platform-design.md) |
| PQC 実装のマスキング | 格子演算特有の変換コスト | [`04_hardware-security/04_side-channels/04_countermeasures.md`](../../../04_hardware-security/04_side-channels/04_countermeasures.md) |

---

## 演習（解答つき）

1. Ring-LWE が素の LWE より鍵サイズを削減できる理由を一言で述べよ。
2. Module-LWE が Ring-LWE より柔軟なパラメータ設計を可能にする理由を述べよ。
3. 多項式環という構造を持ち込むことの「代償」とは何か。

<details><summary>解答</summary>

1. 素の LWE は `n×n` 行列（`n²` 個の値）で表す情報を、Ring-LWE では多項式環の元1つ
   （`n` 個の係数）で表せるため、鍵サイズが `n` 分の1になる。
2. Module-LWE は環元を成分とするベクトル・行列の「長さ `k`」を調整パラメータとして
   持つため、`k` を変えるだけで Ring-LWE（`k=1` 相当）と素の LWE の中間で
   安全性水準を細かく選べる。
3. 多項式環の代数的な構造は攻撃者にとっても利用可能な情報になりうるため、
   素の LWE ほど汎用的に確立された困難性の裏付けをまだ持たない。
   効率と引き換えに、安全性の根拠となる仮定がより特化した（強い）ものになる。

</details>

---

## 暗号での出口：格子暗号の全体像

`01`〜`04` で「格子とは何か」「なぜ難しいか」「どう暗号にするか」が揃った。
どの標準（ML-KEM/ML-DSA/SLH-DSA）がどの困難性の上に立つかという全体地図、
および PQC 移行の実務上の課題は
[`../../../02_cryptography/06_advanced-topics-map.md`](../../../02_cryptography/06_advanced-topics-map.md) へ。

---

## 参考

- Lyubashevsky, V., Peikert, C., Regev, O. (2010). *On Ideal Lattices and Learning with Errors over Rings*. EUROCRYPT.
- FIPS 203 — Module-Lattice-Based Key-Encapsulation Mechanism Standard (ML-KEM), NIST (2024): https://csrc.nist.gov/pubs/fips/203/final
- Bos, J. et al. (2018). *CRYSTALS – Kyber: A CCA-Secure Module-Lattice-Based KEM*. EuroS&P.
