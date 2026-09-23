# 13. ElGamal 暗号

公開鍵暗号のもう一つの系統。RSA が落とし戸付き関数から来たのに対し、こちらは Diffie–Hellman から来る。

Diffie–Hellman の 2 つのメッセージを時間的に分離し、Alice の寄与を公開鍵、Bob の寄与を暗号文のヘッダとみなす — それだけで鍵交換が公開鍵暗号になる。後半では、この構成の安全性がどの仮定に依存するかを CDH・HDH・IDH と段階的に整理し、最後に RSA と ElGamal の両方を貫く原理(特別な性質を持つ一方向関数)でコース全体を締める。

## 読む順

| No | ファイル | 内容 |
|----|---------|------|
| 01 | [ElGamal の構成](./01_elgamal-construction.md) | 非対話な応用(暗号化ファイルシステム・鍵預託)・DH からの導出・鍵生成/暗号化/復号・事前計算による高速化 |
| 02 | [ElGamal の安全性](./02_elgamal-security.md) | CDH 仮定・ハッシュ DH 仮定と意味論的安全性の証明・対話型 DH 仮定と CCA 安全性 |
| 03 | [ElGamal の変種](./03_elgamal-variants.md) | 双線形群・twin ElGamal による CDH からの CCA 安全性・ランダムオラクルを外す方向(DDH と Cramer–Shoup) |
| 04 | [一方向関数という統一原理](./04_one-way-functions.md) | 一方向関数の定義・PRG から作る例・離散対数の加法性・RSA の乗法性と落とし戸・コース全体のまとめ |

---

前: [12. 公開鍵暗号(RSA)](../12_public-key-encryption/README.md)
