# 05. ブロック暗号の利用モード

同じ鍵で複数メッセージを暗号化する場面を扱う。ECB がなぜ危険か、選択平文攻撃(CPA)に対する安全性と nonce、そして CBC とカウンタモードの構成・安全性境界・実装上の落とし穴。

## 読む順

| No | ファイル | 内容 |
|----|---------|------|
| 01 | [ワンタイム鍵と ECB](./01_one-time-key-and-ecb.md) | PRF/PRP switching lemma・ECB の危険性・決定的カウンタモード |
| 02 | [CPA 安全性と nonce](./02_cpa-security-and-nonces.md) | 選択平文攻撃・決定的暗号の限界・乱択暗号化・nonce ベース暗号化 |
| 03 | [CBC モード](./03_cbc-mode.md) | ランダム IV CBC・安全性境界・予測可能 IV の危険・パディング |
| 04 | [カウンタモード](./04_counter-mode.md) | ランダム化/nonce ベース CTR・並列性・CBC との比較 |

---

前: [04. ブロック暗号](../04_block-ciphers/README.md) ｜ 次: [06. メッセージ完全性](../06_message-integrity/README.md)
