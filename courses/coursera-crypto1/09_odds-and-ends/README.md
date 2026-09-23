# 09. 対称暗号の補遺

対称暗号を実務に落とすときに必ず出てくるが、これまでの枠組みからは漏れていた話題を集める。

1 本の source key から多数のセッション鍵をどう導くか(KDF)。乱数を置く場所がないとき — 暗号化データベースの索引や、ディスクのセクタ、クレジットカード番号 — にどう暗号化するか(決定的暗号・tweakable 暗号・書式保存暗号)。いずれも「CPA 安全性は乱数化を前提にしている」という前提が崩れる場面であり、定義そのものを作り直すところから始まる。

## 読む順

| No | ファイル | 内容 |
|----|---------|------|
| 01 | [鍵導出関数](./01_key-derivation.md) | source key からセッション鍵へ・context による分離・extract-then-expand・HKDF・パスワードからの導出と PBKDF |
| 02 | [決定的暗号](./02_deterministic-encryption.md) | 暗号化索引という動機・決定的暗号が CPA 安全になれない理由・決定的 CPA 安全性の定義・固定 IV の CBC/CTR が破れること |
| 03 | [決定的暗号の構成](./03_deterministic-constructions.md) | SIV(メッセージから乱数を導く)・PRP を直接使う構成・EME による広ブロック PRP・決定的認証付き暗号 |
| 04 | [Tweakable 暗号](./04_tweakable-encryption.md) | ディスク暗号化という制約・セクタごとに独立な PRP・tweakable ブロック暗号の定義・XTS |
| 05 | [書式保存暗号](./05_format-preserving-encryption.md) | クレジットカード番号の暗号化・任意サイズ集合上の PRP・Luby–Rackoff による縮小・繰り返し適用による値域の切り詰め |

---

前: [08. 認証付き暗号](../08_authenticated-encryption/README.md) ｜ 次: [10. 鍵交換の基礎](../10_basic-key-exchange/README.md)
