# 08. 認証付き暗号

これまでの CPA 安全性は「盗聴のみ」を想定していた。このモジュールが示すのは、**攻撃者が通信を改竄できるなら、完全性がないと秘匿性まで壊れる**という事実である。つまり秘匿性と完全性は選択肢ではなく、束にして提供しなければならない。

その束が**認証付き暗号 (authenticated encryption, AE)** で、CPA 安全性 + 暗号文完全性として定義される。AE は選択暗号文攻撃 (CCA) 耐性を含意する — これが AE を「正しい安全性の定義」たらしめている。後半は現実の実装がどう壊れたかを TLS・WEP・SSH の具体例で追う。

## 読む順

| No | ファイル | 内容 |
|----|---------|------|
| 01 | [能動的攻撃](./01_active-attacks.md) | IPsec の宛先ポート書き換え・TCP チェックサムのオラクル・CPA 安全性だけでは秘匿性も守れない |
| 02 | [認証付き暗号の定義](./02_ae-definition.md) | 暗号文完全性のゲーム・AE の定義・CBC(乱数 IV)が AE でない理由・リプレイ攻撃という限界 |
| 03 | [CCA 安全性](./03_cca-security.md) | 選択暗号文攻撃のゲーム・CBC への CCA 攻撃・AE ⇒ CCA の証明 |
| 04 | [AE の構成法](./04_ae-constructions.md) | encrypt-then-MAC / MAC-then-encrypt / encrypt-and-MAC・GCM/CCM/EAX・OCB・AEAD と関連データ |
| 05 | [TLS レコードプロトコル](./05_tls-record-protocol.md) | 一方向鍵とカウンタによるリプレイ防止・MAC-then-CBC の実装・TLS 1.0 の連鎖 IV・WEP の CRC が無意味な理由 |
| 06 | [パディングオラクル攻撃](./06_padding-oracle.md) | パディング誤りと MAC 誤りの区別が漏らすもの・タイミングによるオラクル・1 バイトずつの復号 |
| 07 | [SSH の長さフィールド攻撃](./07_ssh-length-attack.md) | 非アトミックな復号・認証前のフィールド使用・32 bit の復元 |

---

前: [07. 衝突耐性](../07_collision-resistance/README.md) ｜ 次: [09. 対称暗号の補遺](../09_odds-and-ends/README.md)
