# 多項式環・イデアル（Polynomials and Ideals）

> 対応科目: Computer Algebra for Cryptography / Advanced Methods in Cryptography ｜ 層: 基礎(Layer 1)
> 親: [../00_index.md](../00_index.md)

## 一言で

「多項式を整数のように扱う」代数構造が多項式環とイデアル。
GF(2)[x] の筆算から既約多項式の分類、剰余環による有限体の一般構成、
イデアル・Gröbner 基底、そして格子暗号への入口まで一本道で積み上げる。
Magma 実習で最初に手を動かす対象そのものであり、
格子暗号（Ring-LWE/NTRU/Kyber）の前提知識にもなる。

---

## 概念ファイル（番号順に読む）

| # | ファイル | 内容 | 備考 |
|---|---|---|---|
| 01 | [01_polynomial-rings.md](./01_polynomial-rings.md) | 多項式環 F[x] の定義・加減乗、GF(2)[x] の XOR 演算、除算アルゴリズム | GF(2)[x] での筆算トレースあり |
| 02 | [02_irreducible-polynomials.md](./02_irreducible-polynomials.md) | 既約多項式の定義（素数の多項式版）、次数2・3の全分類 | GF(2) 上の全8+4パターンを表で分類 |
| 03 | [03_quotient-rings-gf2n.md](./03_quotient-rings-gf2n.md) | 剰余環 GF(q)[x]/(f(x)) による拡大体構成の一般論 | GF(4) の加算・乗算表を完全構築 |
| 04 | [04_ideals-groebner-intro.md](./04_ideals-groebner-intro.md) | イデアル・PID・Gröbner 基底入口・格子暗号への橋渡し | (2,x) が単項でない例、Ring-LWE/Kyber |

---

## なぜ重要か / コースでの位置づけ

### 計算機代数で直接使う
- Magma の実習は GF(2^n)・多項式環・Gröbner 基底・因数分解が中心
- プロジェクト課題で多項式演算アルゴリズムを実装・効率分析する（除算・既約性判定が最初のステップ）

### 上級暗号での格子暗号
- Ring-LWE・NTRU の安全性議論に多項式環の知識が前提として必要
- 格子簡約（LLL, BKZ）も計算機代数で扱い、上級暗号で安全性の文脈で再登場
- Kyber（ML-KEM）の Module-LWE 構造は、このフォルダの剰余環の考え方の延長線上にある

---

## このフォルダで「本体」を置かないもの（DRY）

- **AES の SubBytes/MixColumns での GF(2^8) の使い方**（既約多項式 x^8+x^4+x^3+x+1 での具体的な演算例）
  → 本体は [`../02_groups-rings-fields/06_gf2n-and-aes.md`](../02_groups-rings-fields/06_gf2n-and-aes.md)。
  **このフォルダが持つのは「剰余環で拡大体を作る」一般論**（[03](./03_quotient-rings-gf2n.md)）であり、
  AES 固有の応用はそちらに委ねる。
- **Ring-LWE/NTRU/Kyber の安全性仮定そのものの詳細**（格子暗号の本体）
  → [`../../../02_cryptography/06_advanced-topics-map.md`](../../../02_cryptography/06_advanced-topics-map.md)（PQC標準の地図）は書けているが、
  数学的詳細は両フォルダ共通の深掘りキュー行き（Layer 2 未着手）。ここでは入口のみ（[04](./04_ideals-groebner-intro.md)）。

---

## つまずき / 深掘り候補（Layer 2）

- [ ] AES の GF(2^8) 演算を手で計算 → `deep/aes-field-arithmetic/`
- [ ] Buchberger アルゴリズムの動作例 → `deep/groebner-buchberger/`
- [ ] Ring-LWE の定義と安全性仮定 → `deep/ring-lwe-intro/`
- [ ] 多項式の既約性判定アルゴリズム → `deep/irreducibility-test/`

---

## 参考

- Paar & Pelzl, *Understanding Cryptography*, Ch. 4（GF(2^8) と AES）
- NIST PQC Kyber 仕様（Ring-LWE 構造の参考）: https://pq-crystals.org/kyber/
