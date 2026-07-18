# 04. ブロック暗号

ブロック暗号を PRF/PRP という抽象で捉え、DES(Feistel 構造)と AES(SPN 構造)の内部、総当たり攻撃と 3DES、線形解読・サイドチャネル・量子などの攻撃、そして PRG から PRF を作る GGM 構成までを扱う。

## 読む順

| No | ファイル | 内容 |
|----|---------|------|
| 01 | [ブロック暗号と PRF/PRP](./01_block-cipher-and-prf-prp.md) | ブロック暗号の抽象・PRF/PRP の定義と安全性・PRF から PRG |
| 02 | [DES](./02_des.md) | Feistel ネットワーク・Luby–Rackoff 定理・DES の構造・S ボックスと線形性 |
| 03 | [総当たり攻撃と 3DES](./03_exhaustive-search-and-3des.md) | 鍵の一意性・DES Challenge・3DES・中間一致攻撃・DESX |
| 04 | [高度な攻撃](./04_advanced-attacks.md) | 実装攻撃(タイミング/電力/キャッシュ)・フォールト攻撃・線形解読・量子攻撃 |
| 05 | [AES](./05_aes.md) | SPN 構造・AES のラウンド・実装トレードオフ・AES-NI・安全性 |
| 06 | [PRG から PRF(GGM)](./06_prg-to-prf-ggm.md) | 倍長 PRG から PRF・GGM 構成・PRG から PRP |

---

前: [03. ストリーム暗号](../03_stream-ciphers/README.md) ｜ 次: [05. ブロック暗号の利用モード](../05_block-cipher-modes/README.md)
