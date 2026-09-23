# 07. 衝突耐性

衝突耐性ハッシュの定義と応用、汎用攻撃である誕生日攻撃、そして構成法を扱う。
構成は 2 段: Merkle–Damgård で圧縮関数から任意長ハッシュを作り、ブロック暗号から圧縮関数を作る。最後にハッシュを MAC に転用する HMAC と、実装の落とし穴（タイミング攻撃）。

## 読む順

| No | ファイル | 内容 |
|----|---------|------|
| 01 | [衝突耐性の導入](./01_collision-resistance-intro.md) | 衝突耐性の定義・MAC への応用・鍵なしファイル完全性 |
| 02 | [誕生日攻撃](./02_birthday-attack.md) | 汎用衝突攻撃・誕生日パラドックスの証明・出力長への含意 |
| 03 | [標準ハッシュ関数と SHA-1](./03_hash-standards.md) | SHA-2/SHA-3・Whirlpool・出力長と速度・SHA-1 非推奨の理由 |
| 04 | [Merkle–Damgård](./04_merkle-damgard.md) | 圧縮関数から任意長ハッシュへ・長さの符号化・衝突耐性の証明 |
| 05 | [圧縮関数の構成](./05_compression-functions.md) | Davies–Meyer・Miyaguchi–Preneel・危険な変種・離散対数ベース |
| 06 | [HMAC](./06_hmac.md) | 長さ拡張攻撃・HMAC の構成・NMAC との対応・SHA-1 を使える理由 |
| 07 | [タイミング攻撃](./07_timing-attacks.md) | 逐次比較が漏らすもの・定数時間比較・最適化コンパイラの罠 |

---

前: [06. メッセージ完全性](../06_message-integrity/README.md) ｜ 次: [08. 認証付き暗号](../08_authenticated-encryption/README.md)
