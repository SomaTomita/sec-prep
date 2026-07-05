# 群・環・体（Groups, Rings, Fields）

> 対応科目: H05E1B / H03G5A Advanced Methods in Cryptography / H0E74A Computer Algebra for Cryptography ｜ 層: 基礎(Layer 1)
> 親: [../00_index.md](../00_index.md)

## 一言で

整数や多項式などを「演算の性質で分類」する代数構造の三段階（群→環→体）。
暗号の安全性は「この群の演算を逆に解くのが計算困難」という形で記述され、
アルゴリズムも「この体の上で動く」という形で設計される。

このフォルダは群・環・体を **概念ごとに1ファイル** で積み上げる。
番号順に読めば「群の公理 → 位数とラグランジュ → 巡回群と生成元 → 環と零因子 →
体とGF(p) → GF(2^n)とAES」と一本道で繋がる。

---

## 概念ファイル（番号順に読む）

| # | ファイル | 内容 | 備考 |
|---|---|---|---|
| 01 | [01_binary-ops-and-groups.md](./01_binary-ops-and-groups.md) | 二項演算・群の4公理（閉包/結合律/単位元/逆元）・可換群 | (Z_5,+) の演算表で公理を確認 |
| 02 | [02_order-and-lagrange.md](./02_order-and-lagrange.md) | 群の位数・元の位数・ラグランジュの定理 | Z_7^* の全元の位数を列挙 |
| 03 | [03_cyclic-groups-generators.md](./03_cyclic-groups-generators.md) | 巡回群・生成元(generator)・原始根 | g=3 in Z_7^* の生成トレース |
| 04 | [04_rings-and-zero-divisors.md](./04_rings-and-zero-divisors.md) | 環の定義・零因子・Z_nが合成数で体にならない理由 | mod 6 の乗算表 |
| 05 | [05_fields-and-gfp.md](./05_fields-and-gfp.md) | 体の定義・有限体GF(p) | 逆元の詳細は `../01_modular-arithmetic/06` へ |
| 06 | [06_gf2n-and-aes.md](./06_gf2n-and-aes.md) | 有限体GF(2^n)・GF(2^8)とAES | GF(2^8)乗算1例をステップトレース |

---

## なぜ重要か / コースでの位置づけ

### H05E1B（暗号とネットワークセキュリティ）
- RSA: Z_n^* という群の上の演算
- DH: 巡回群 Z_p^* の生成元 g と位数の概念が必須

### H03G5A（上級暗号手法）
- 格子ベース暗号（NTRU, Ring-LWE）は多項式環と整数の剰余環を組み合わせた構造
- ECC（楕円曲線）は体上の点の集合が群をなすことを利用

### H0E74A（計算機代数）
- GF(2^n) の構成と演算が Magma 実習で直接登場
- Gröbner 基底は多項式環とイデアルの理論が基盤

---

## このフォルダで「本体」を置かないもの（DRY）

- **逆元の存在条件・計算方法（拡張ユークリッド）** → [`../01_modular-arithmetic/06_modular-inverse.md`](../01_modular-arithmetic/06_modular-inverse.md)
- **剰余環 GF(q)[x]/(f(x)) による拡大体構成の一般論** → [`../04_polynomials-ideals/03_quotient-rings-gf2n.md`](../04_polynomials-ideals/03_quotient-rings-gf2n.md)（本フォルダは AES での「使い方」だけ扱う）
- **フェルマーの小定理・オイラーの定理・離散対数問題の困難性** → [`../03_number-theory/`](../03_number-theory/README.md)
- **RSA・DH・ECC などプロトコルそのもの** → `../../../02_cryptography/`（本フォルダはその土台となる代数）

---

## つまずき / 深掘り候補（Layer 2）

- [ ] GF(2^8) の乗算を手で計算するステップ → `deep/gf28-arithmetic/`
- [ ] 楕円曲線の点が群をなす証明（群演算の定義） → `deep/elliptic-curve-group/`
- [ ] 原始根（primitive root）の存在証明 → `deep/primitive-root/`
- [ ] ラグランジュの定理の証明 → `deep/lagrange-theorem/`

---

## 参考

- Boneh & Shoup, *A Graduate Course in Applied Cryptography*, Ch. 2 (https://toc.cryptobook.us/)
- Paar & Pelzl, *Understanding Cryptography*, Ch. 4（有限体とAES）
- KU Leuven H0E74A シラバス: https://onderwijsaanbod.kuleuven.be/syllabi/e/H0E74AE.htm
