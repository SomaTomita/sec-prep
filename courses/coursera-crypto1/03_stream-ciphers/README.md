# 03. ストリーム暗号

OTP(ワンタイムパッド)を出発点に、擬似ランダム生成器(PRG)で実用化したストリーム暗号を扱う。完全秘匿の限界、OTP への実践的攻撃、実在するストリーム暗号、そして意味論的安全性の定義と証明まで。

## 読む順

| No | ファイル | 内容 |
|----|---------|------|
| 01 | [暗号の定義と OTP](./01_cipher-definition-and-otp.md) | 暗号の正式定義・OTP・Shannon の完全秘匿とその限界 |
| 02 | [PRG とストリーム暗号](./02_prg-and-stream-ciphers.md) | PRG・予測不可能性・危険な PRG・negligible の定義 |
| 03 | [OTP への攻撃](./03_attacks-on-otp.md) | two-time pad・VENONA/PPTP/WEP・可鍛性 |
| 04 | [実在するストリーム暗号](./04_real-world-stream-ciphers.md) | RC4・CSS(DVD)とその攻撃・eSTREAM/Salsa20 |
| 05 | [PRG の安全性の定義](./05_prg-security-definitions.md) | 統計的テスト・アドバンテージ・安全な PRG・Yao の定理 |
| 06 | [意味論的安全性](./06_semantic-security.md) | 意味論的安全性の定義・OTP の安全性・PRG⇒ストリーム暗号の証明 |

---

前: [02. 離散確率](../02_discrete-probability/README.md) ｜ 次: [04. ブロック暗号](../04_block-ciphers/README.md)
