# 情報理論基礎（Information Theory）

> 対応科目: Cryptography and Network Security / Cryptographic Protocols ｜ 層: 基礎(Layer 1)
> 親: [../index.md](../index.md)

## 一言で

「当てにくさ」をビットで数えるのがエントロピー。Shannon（1948〜49）のこの枠組みが「完全に安全な暗号とは何か」「鍵はどれだけ必要か」を定義する言語になる。

```mermaid
flowchart LR
  A["01 エントロピー H(X)"] --> B["02 条件付き H(X|Y)・相互情報量"] --> C["03 完全秘匿・OTP"] --> D["04 鍵長・min-entropy"] --> E["RNG / PUF（HW）"]
```

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

| 場面 | どう効くか |
|---|---|
| 前提知識 | 「情報理論の基礎」が前提。OTP を完全秘匿の基準点に置く構成が多い |
| 暗号プロトコル | 秘密分散の安全性を `H(Secret \| shares < k) = H(Secret)` で表す。情報理論的 vs 計算量的安全性の区別 |
| 上級 | 証明可能安全性の「実世界とシミュレーションが区別できない」が情報理論的な区別不可能性につながる |

---

## このフォルダで「本体」を置かないもの（DRY）

現時点でこのリポジトリ内に情報理論を扱う他フォルダはなく、本体はすべてここに置く。
唯一の境界:

- **「計算量的安全性」の詳細な暗号アルゴリズム分析**（AES/RSA が実際にどれだけ強いか等）は
  [`../../../02_cryptography/`](../../../02_cryptography/index.md)に置く。このフォルダが扱うのはあくまで
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
