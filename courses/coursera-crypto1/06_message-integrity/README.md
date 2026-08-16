# 06. メッセージ完全性

秘匿性ではなく完全性のみを提供する MAC(メッセージ認証符号)を扱う。MAC の定義と安全性、PRF ベース MAC、小さい MAC を大きい MAC に拡張する CBC-MAC / NMAC、パディングと CMAC / PMAC、そしてワンタイム MAC と Carter–Wegman 構成。

## 読む順

| No | ファイル | 内容 |
|----|---------|------|
| 01 | [MAC の定義](./01_mac-definitions.md) | 完全性の必要な場面・MAC の定義・選択メッセージ攻撃・存在的偽造 |
| 02 | [PRF ベース MAC](./02_prf-based-macs.md) | 安全な PRF⇒安全な MAC・出力切り詰め・AES を MAC に |
| 03 | [CBC-MAC と NMAC](./03_cbc-mac-and-nmac.md) | ECBC-MAC・NMAC・最終段の必要性・拡張攻撃・安全性境界 |
| 04 | [パディングと CMAC/PMAC](./04_padding-and-cmac-pmac.md) | 単射パディング・ISO 方式・CMAC・並列 MAC(PMAC)とインクリメンタル性 |
| 05 | [ワンタイム MAC と Carter–Wegman](./05_one-time-mac-carter-wegman.md) | 情報理論的ワンタイム MAC・多項式構成・Carter–Wegman MAC |

---

前: [05. ブロック暗号の利用モード](../05_block-cipher-modes/README.md) ｜ 次: [07. 衝突耐性](../07_collision-resistance/README.md)
