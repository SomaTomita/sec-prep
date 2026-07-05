# 情報理論基礎（Information Theory）

> 対応科目: H05E1B Cryptography and Network Security / H0Q28A Cryptographic Protocols ｜ 層: 基礎(Layer 1)
> 親: [../00_index.md](../00_index.md)

## 一言で

情報の「不確かさ」を定量化するのがエントロピー。
Shannon が 1948〜49 年に確立したこの枠組みは、
「完全に安全な暗号とは何か」「鍵はどれだけ必要か」を厳密に定義する言語になる。

このフォルダはエントロピー → 条件付きエントロピー・相互情報量 → 完全秘匿(OTP) → 鍵長と安全性
の順に、番号順で一本道に積み上げる。

---

## 概念ファイル（番号順に読む）

| # | ファイル | 内容 | 備考 |
|---|---|---|---|
| 01 | [01_entropy.md](./01_entropy.md) | シャノンエントロピー H(X)・予測しにくさの尺度 | 公平/偏りコイン・8面ダイスの計算トレース |
| 02 | [02_conditional-mutual-info.md](./02_conditional-mutual-info.md) | 条件付きエントロピー H(X\|Y)・相互情報量 I(X;Y) | 2x2同時分布表からの手計算 |
| 03 | [03_perfect-secrecy-otp.md](./03_perfect-secrecy-otp.md) | 完全秘匿(Shannon security)・OTP・シャノンの限界定理 | 2bit OTP の全パターン表 |
| 04 | [04_key-length-security.md](./04_key-length-security.md) | 鍵長と安全性・min-entropy・RNG/PUF への接続 | 総当たり計算量表（56/128/256bit） |

---

## なぜ重要か / コースでの位置づけ

### H05E1B の前提知識として明記
- シラバスに「情報理論の基礎」が前提として列挙されている
- OTP を「完全秘匿の基準点」として授業の最初に位置づける構成が多い

### H0Q28A（暗号プロトコル）
- 秘密分散（secret sharing）では、シェアから秘密の情報が得られないことを
  `H(Secret | shares < k) = H(Secret)` という条件で表す
- セキュリティモデル（information-theoretic vs computational）の区別が頻出

### H03G5A（上級）
- 証明可能安全性では「実世界とシミュレーションが区別できない」という定式化が
  情報理論的な区別不可能性（indistinguishability）につながる

---

## このフォルダで「本体」を置かないもの（DRY）

現時点でこのリポジトリ内に情報理論を扱う他フォルダはなく、本体はすべてここに置く。
唯一の境界:

- **「計算量的安全性」の詳細な暗号アルゴリズム分析**（AES/RSA が実際にどれだけ強いか等）は
  [`../../../02_cryptography/`](../../../02_cryptography/00_index.md)に置く。このフォルダが扱うのはあくまで
  情報理論的な土台（完全秘匿・エントロピー・鍵長の直感）まで。

---

## つまずき / 深掘り候補（Layer 2）

- [ ] OTP の完全秘匿の厳密証明 → `deep/otp-proof/`
- [ ] エントロピーの公理的導出（Khinchin の公理） → `deep/entropy-axioms/`
- [ ] 計算量的安全性 vs 情報理論的安全性の比較 → `deep/computational-vs-it-security/`
- [ ] Shannon の通信路容量定理との関係 → `deep/channel-capacity/`

---

## 参考

- Shannon, "A Mathematical Theory of Communication", *Bell System Technical Journal*, 1948
  (再版 https://people.math.harvard.edu/~ctm/home/text/others/shannon/entropy/entropy.pdf)
- Shannon, "Communication Theory of Secrecy Systems", *Bell System Technical Journal*, 1949
  (完全秘匿の原典)
- Paar & Pelzl, *Understanding Cryptography*, Ch. 1（導入部の情報理論）
- KU Leuven H05E1B シラバス: https://onderwijsaanbod.kuleuven.be/syllabi/e/H05E1BE.htm
