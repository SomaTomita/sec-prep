# 03. NIST のパスワード推奨

> 親: [README](./README.md) ｜ 前: [パスワード空間と総当たり](./02_password-space-and-brute-force.md) ｜ 次: [04 多要素認証](./04_multi-factor-authentication.md) ｜ 出典: 講義1 (00:25:13–00:38:23)

**この1ページで分かること**

- 最低 8 文字、実装側は 64 文字・空白・Unicode を受け付ける
- 漏洩リスト・辞書語・連続文字・サービス名由来は拒否、ヒントと秘密の質問は禁止
- 定期変更は強制せず、代わりにレート制限で攻撃者の時間を奪う

前ファイルの掛け算を、米国 **NIST（国立標準技術研究所）** のデジタル認証ガイドラインに翻訳する。利用者の行動指針にも、実装者の設計指針にもなる。

| 用語 | 意味 |
|---|---|
| memorized secret（記憶秘密） | パスワード。人間が記憶して提示する認証要素 |
| verifier（検証者） | 入力を検証する側 = サービス・アプリ・サーバ |

推奨の多くは「**verifier はこうせよ**」の形で書かれている。責任を人間の意志力ではなく実装側に置いている。

---

## 長さ — 下限 8 文字、上限は 64 文字以上

> memorized secrets shall be at least eight characters in length

8 文字は、前ファイルの `94^8 ≈ 6,096 兆` が「時間切れを期待できる」水準に届く境界。

> Verifiers should permit … at least 64 characters … All printing ASCII characters as well as the space characters should be acceptable … Unicode characters should be accepted as well.

| 実装側への要求 | 狙い |
|---|---|
| 64 文字まで受け付ける | 「覚えやすいが長い」文・引用・フレーズを使わせる |
| 空白を許す | 空白なしでは文をパスワードにできない |
| Unicode を許す | 英語以外の言語・絵文字も使える |

小文字だけの 12 文字（`26^12 ≈ 9.5 × 10^16`）は記号混じり 8 文字（`6.1 × 10^15`）より 15 倍強い。長い文を許すことは、利便性と強度を同時に上げる数少ない手である。ただし `0000000000...` のような自明な選び方では意味がない。

現実には「大文字 1 つ以上、記号 1 つ以上、使える記号はこれだけ」という逆行した実装が多い。摩擦が大きいわりに強度への寄与が小さく、利用者に付箋を書かせる。

---

## 禁止すべきパスワード — 4 つのカテゴリ

> Verifiers shall compare the prospective secrets against a list that contains values known to be commonly used, expected, or compromised.

| # | カテゴリ | 理由 |
|---|---|---|
| 1 | 過去の漏洩コーパス（漏洩したパスワードの集合）に含まれる値 | 攻撃者は総当たり前に必ず試す。事実上の「第二の辞書」 |
| 2 | 辞書に載っている単語 | 辞書攻撃で最初に尽きる |
| 3 | 反復・連続（`aaaa`、`1234`、`abcd`、`0000`） | 人間が手を抜く型は攻撃者にも読める |
| 4 | サービス名・ユーザ名とその派生 | Gmail に `gmailpassword`、Amazon に `amazonpassword` |

> 自分が「うまい」と思いつく規則は、同じくらい賢い攻撃者も思いつく。攻撃者は総当たりの前にその規則を試す。

---

## ヒントと「秘密の質問」の禁止

> … shall not permit the subscriber to store a hint that is inaccessible to an unauthenticated claimant. … shall not prompt subscribers to use specific types of information (for instance, what was the name of your first pet) …

2 つとも、いまだに広く違反されている。

| 機能 | なぜ危険か |
|---|---|
| ヒント欄 | 未認証の相手にも見える。「最初のペットの名前」と書けば世界への説明になる |
| 秘密の質問 | SNS・職歴サイトから調査可能。**変更できない**、複数サービスで**同じ答え**、平文で保存されがち |

秘密の質問は「弱く、使い回され、変更不能なパスワード」を追加で作らせているのと同じ。フィッシングでこの情報が狙われる例は [05](./05_credential-stuffing-and-social-engineering.md) で扱う。

---

## 定期変更を強制しない

> Verifiers shall not require memorized secrets to be changed arbitrarily, for instance periodically.

かつての best practice で、今も多くの職場が違反している。強制すると 2 つ起きる。

```
今月     password1
3か月後  password2      ← 過去の 1 つが漏れれば次が読める
6か月後  password3         定期変更は「規則性」という情報を漏らす
```

もう 1 つは記憶負荷。3 か月ごとに更新すれば先月分と混同し、ロックアウト・リセット多用・付箋につながる。

例外は漏洩の証拠がある場合で、そのときは即時変更が必要。禁じられているのは**根拠のない定期変更**である。

---

## レート制限 — 攻撃者の時間を奪う

> Verifiers shall implement a rate limiting mechanism that effectively limits the number of failed authentication attempts …

**レート制限**（一定回数失敗したら試行を遅らせる仕組み）。10 回連続失敗なら本人より第三者の確率が高い、という賭けに基づく。

| 4 桁パスコード（10,000 通り） | 全探索にかかる時間 |
|---|---|
| 制限なし | 一瞬 → 突破 |
| 10 回ごとに 1 分停止 | 1,000 サイクル × 1 分 ≈ 17 時間 |
| 停止時間が逓増（1 → 2 → 5 → 10 分…） | 数か月〜現実的に不可能 |
| 一定回数で端末を消去 | 総当たり自体が成立しない |

同じ 4 桁でも、試行速度に上限を置くだけで結論が変わる。端末を持ち去った相手を数十分足止めできれば、捕まる risk が跳ね上がり標的として割に合わなくなる。

代償は、寝ぼけて・画面が濡れて自分がロックアウトされること。可用性とのトレードオフからは逃げられないが、10 回連続失敗の事後確率は攻撃者側に大きく傾いているので、この賭けは概ね正しい。

---

## 問題

**Q1.** NIST の推奨の多くが「利用者は〜せよ」でなく「verifier は〜せよ」と書かれているのはなぜか。

<details><summary>解答</summary>

安全性を人間の意志力や知識に依存させないため。利用者は最小の労力で要求を満たそうとするので、弱い選択を「できなくする」責任を実装側に置くほうが確実。禁止リスト照合やレート制限は利用者側では実行できない防御でもある。

</details>

**Q2.** 「64 文字までのパスワードを受け付けよ」という推奨が、可用性と安全性の両方に効く理由を述べよ。

<details><summary>解答</summary>

長さは場合の数の指数に効くため、単純な文字の長いフレーズでも短い複雑文字列より強い。同時に、文やフレーズはランダム文字列より覚えやすい。安全性を上げながら記憶負荷を下げられる数少ない手段。

</details>

**Q3.** 「秘密の質問」がパスワード以上に危険になりうる理由を 3 つ挙げよ。

<details><summary>解答</summary>

(1) 答えが SNS や公開情報から推測・調査できる、(2) 事実に基づくため変更できない、(3) 複数サービスで同じ答えを使い回すことになる。加えて平文で保存されがちで、漏洩時の影響が横に広がる。

</details>

**Q4.** 定期的なパスワード変更を強制すると、かえって安全性が下がる。その機序を 2 つ説明せよ。

<details><summary>解答</summary>

(1) `password1 → password2` のような最小変更で対応するため、過去の 1 つが漏れると次が推測可能になり、規則性という情報が漏れる。(2) 記憶負荷が増えて忘却・ロックアウト・書き留めが増え、実運用上の弱点を作る。

</details>

## 関連リンク

- [02 パスワード空間と総当たり](./02_password-space-and-brute-force.md) — この推奨の根拠になっている場合の数
- [06 パスワードマネージャとパスキー](./06_password-managers-and-passkeys.md) — 「長く一意なパスワード」を人間の記憶に頼らず実現する道具
- [認証・認可・アクセス制御](../../../topics/06_systems-security/03_authn-authz-access-control.md) — 認証方式の選択とポリシー設計の体系的な整理
