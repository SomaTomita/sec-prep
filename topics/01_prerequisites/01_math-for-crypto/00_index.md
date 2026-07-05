# 暗号数学 — サブ領域地図

> 対応科目: H05E1B / H0Q28A / H03G5A / H0E74A ｜ 層: 地図 (Layer 0)

このサブ領域は「暗号で使う数学の土台」を扱う。
KU Leuven の暗号系 4 科目すべてが前提として仮定する代数・整数論・情報理論を、
Layer 1（概念理解レベル）で押さえる。

---

## 進捗チェックリスト

- [ ] `01_modular-arithmetic/` — 合同算術（概念別フォルダ: 余り→合同式→演算→gcd→拡張ユークリッド→逆元→CRT入口）
- [ ] `02_groups-rings-fields/` — 群・環・体・有限体 GF(p), GF(2^n)・位数（概念別フォルダ: 二項演算→位数→巡回群→環→体→GF(2^n)）
- [ ] `03_number-theory/` — 素数・フェルマー小定理・オイラー・CRT・離散対数・素因数分解（概念別フォルダ）
- [ ] `04_polynomials-ideals/` — 多項式環・既約多項式・イデアル・Gröbner 基底概観（概念別フォルダ）
- [ ] `05_info-theory/` — エントロピー・条件付きエントロピー・相互情報量・完全秘匿（概念別フォルダ）

---

## 科目対応マップ

| ファイル | 主要対応科目 | 暗号での出口 |
|---|---|---|
| 01 合同算術 | H05E1B, H0Q28A | RSA 鍵生成、DH |
| 02 群・環・体 | H05E1B, H03G5A, H0E74A | DH/ECC の群、AES の GF(2^8) |
| 03 整数論 | H05E1B, H0Q28A, H03G5A | RSA・DH の安全性根拠 |
| 04 多項式・イデアル | H0E74A, H03G5A | GF(2^n) 構成、格子暗号・多変数暗号への入口 |
| 05 情報理論 | H05E1B, H0Q28A | 完全秘匿（OTP）、鍵長と安全性 |

---

## 深掘りキュー（Layer 2 候補）

詰まった用語や「もっと掘りたい」項目をここに溜める。
`deep/<topic-slug>/` を新設して枝を伸ばす。

- [ ] （読み進めながら追記）

---

## 参考（サブ領域全体）

- H0E74A シラバス: https://onderwijsaanbod.kuleuven.be/syllabi/e/H0E74AE.htm
- H03G5A シラバス: https://onderwijsaanbod.kuleuven.be/syllabi/e/H03G5AE.htm
- H05E1B シラバス: https://onderwijsaanbod.kuleuven.be/syllabi/e/H05E1BE.htm
- H0Q28A シラバス: https://onderwijsaanbod.kuleuven.be/syllabi/e/H0Q28AE.htm
