# 02. 脅威モデリング：STRIDE・attack tree・LINDDUN

> 前: [01 Secure SDLC](./01_secure-sdlc.md) ｜ 次: [03 セキュリティパターン](./03_security-patterns.md) ｜ 層: 基礎(Layer 1)

「どこにどんな脅威がありうるか」を場当たり的な思いつきではなく、**データフロー図(DFD)**
を土台に体系的に洗い出す方法論群。セキュリティ側の代表がSTRIDE、そこから派生した
プライバシー側の代表がLINDDUN——後者は[`../03_privacy/`](../03_privacy/00_index.md)が
「作成後にリンクする」と予告していた本体をここで提供する。

---

## 土台：データフロー図（DFD）で系を分解する

```
記法: プロセス(丸) ／ データストア(2本線) ／ 外部エンティティ(四角) ／ データフロー(矢印)
     信頼境界(trust boundary, 点線)を跨ぐ矢印ほど攻撃者の到達可能性が高い
```

### サンプル系：ログイン付きオンライン注文システム

```
[ブラウザ] --(1)ID/パスワード--> ‖信頼境界‖ --> (Webサーバ) --(2)SQLクエリ--> [ユーザDB]
                                                    |
                                              (3)セッション発行
                                                    v
                                              [ブラウザ]（Cookie保持）
```

以降のSTRIDE・attack treeは、このサンプル系（3本のデータフロー・1つの信頼境界）に対して行う。

---

## STRIDE（Kohnfelder & Garg, Microsoft, 1999年）

1999年4月1日、Microsoft社内誌 "Interface" に発表された "The Threats to our Products" が
初出。「脅威をどう見つけるか」を初めて体系立てた点が画期的とされ、2002年までに
Microsoft SDLの標準プロセスとして採用された。DFDの各要素（プロセス・データストア・
データフロー・外部エンティティ）を6分類の脅威で総当たりする。

| 頭文字 | 脅威 | サンプル系での具体例 | 対策 |
|---|---|---|---|
| S | Spoofing（なりすまし） | セッションCookieを盗み、他人になりすましてログインする | 強固なセッション管理・多要素認証 |
| T | Tampering（改ざん） | (2)のSQLクエリのパラメータを操作し価格を書き換える | サーバ側入力検証・パラメータ化クエリ |
| R | Repudiation（否認） | 注文したユーザが「注文していない」と主張する | 監査ログ・デジタル署名付き取引記録 |
| I | Information Disclosure（情報漏洩） | [ユーザDB]の平文パスワードが流出する | ハッシュ化（bcrypt等）・保存時暗号化 |
| D | Denial of Service（サービス拒否） | ログインエンドポイントに大量リクエストを送る | レート制限・WAF |
| E | Elevation of Privilege（権限昇格） | 一般ユーザが管理者用エンドポイントに直接アクセスする | 認可チェックの徹底（[`../06_systems-security/03_authn-authz-access-control.md`](../06_systems-security/03_authn-authz-access-control.md)で詳述） |

STRIDEは「6分類のどれに当てはまるか」を機械的に問うことで、レビュアーの経験に
依存しがちな脅威発見を再現可能なプロセスに変える点が価値。

---

## Attack Tree（Schneier, 1999年）

Bruce Schneierが *Dr. Dobb's Journal*（1999年12月号）で発表。STRIDEが「DFDの各要素に
何が起きうるか」を横断的に問うのに対し、attack treeは**1つの攻撃者ゴール**を起点に
「どうやって達成するか」を縦に分解する。根がゴール、子が下位目標、AND/ORノードで
組み合わせを表す（同じ形式は1991年のWeissの提案が先行するが、Schneierの論文が普及させた）。

```
ゴール: [ユーザDB]の内容を盗む
  OR
  ├─ SQLインジェクションで(2)のクエリを乗っ取る
  │    AND: 入力検証の欠如を見つける + ペイロードを注入する
  ├─ セッションを乗っ取り管理者としてエクスポート機能を呼ぶ（Eの発展形）
  │    AND: セッションCookieを盗む + 管理者権限のエクスポートAPIを見つける
  └─ DB管理者の認証情報をフィッシングで盗む
       AND: フィッシングメールを送る + 管理者が認証情報を入力する
```

STRIDEで見つけた個々の脅威（S, T, E等）が、attack treeでは**1つのゴールに至る複数経路**
として再構成される——STRIDEが「網羅性」、attack treeが「経路の深掘りと優先順位付け」を担う、
補完関係にある。

---

## LINDDUN（Deng, Wuyts, Scandariato, Preneel, Joosen; 2011年）

*Requirements Engineering* 誌に発表された、STRIDEをプライバシー版に翻案した方法論。
確立されたプライバシー工学の研究に基づく、実務でも広く使われる方法論。
STRIDEと同じくDFD上で各要素を7分類の脅威で総当たりするが、対象が「セキュリティ特性の破れ」
ではなく「プライバシー特性の破れ」になる。

### 7カテゴリと`../03_privacy/01_privacy-concepts.md`との対応

[01_privacy-concepts](../03_privacy/01_privacy-concepts.md)で定義した**匿名性・非連結性・
非検知性・非観測性**の4性質のうち3つがLINDDUNの脅威名にそのまま現れる——脅威モデリングの
文脈で「その性質が破られるとはどういう具体的シナリオか」を与えるのがLINDDUNの役割。

| LINDDUN頭文字 | 脅威 | 定義（何が破られるか） | 対応するプライバシー特性 |
|---|---|---|---|
| L | Linkability | 複数のIOI（データ・行為）を結びつけて追加情報を得られる | **非連結性**（[01](../03_privacy/01_privacy-concepts.md)で定義済み）の破れ |
| I | Identifiability | 意図せず個人の身元が漏洩・推測される | **匿名性**の破れ |
| N | Non-repudiation | ある主張・行為を特定個人に帰属させる証拠が残る | 匿名性・非連結性の「否認可能性」を伴う破れ（証拠付きで断定できてしまう点がSTRIDEのRepudiationと極性が逆） |
| D | Detectability | データが「存在すること自体」を第三者が推測できる | **非検知性**の破れ |
| D | Disclosure of information | 個人データそのものが漏洩する | 機密性（[`../02_cryptography/01_goals-and-primitives.md`](../02_cryptography/01_goals-and-primitives.md)のConfidentiality）の破れ |
| U | Unawareness | データ主体が自分のデータの扱われ方を十分に知らされていない | GDPR透明性原則（[`../03_privacy/06_law-and-dpia.md`](../03_privacy/06_law-and-dpia.md)）の破れ |
| N | Non-compliance | システムがデータ保護原則・法規制に準拠していない | GDPR全体（同上）への違反 |

**Unobservability**（非検知性かつ関係者間の匿名性という最強の合成特性）はLINDDUN単体の
カテゴリとしては現れない——Detectability と Identifiability/Linkability を組み合わせて
分析すれば同じ状態を表現できるため。STRIDEのRepudiation（「やった」ことを否認**できる**、
攻撃者に有利）とLINDDUNのNon-repudiation（「やった」ことを否認**できなくなる**、
データ主体に不利）が同じ語幹で正反対の脅威を指す点は、両方法論を並べて学ぶ際に
最も混同しやすい落とし穴。

### サンプル系へのLINDDUN適用（一部）

```
(1) ID/パスワード送信フロー:
  I (Identifiability): パスワードリセット機能の応答時間差から、
    登録済みメールアドレスかどうかが外部から推測できる（ユーザ列挙）
(3) セッションCookie発行:
  L (Linkability): 同一Cookieが複数セッションで使い回されると、
    別ログインが同一ユーザによるものと結びつけられる
```

---

## 演習（解答つき）

1. STRIDEとattack treeは何を単位に脅威を整理する点が異なるか、一言で対比せよ。
2. LINDDUNの Non-repudiation が「データ主体にとって不利」とされる理由を、
   STRIDEの Repudiation と対比して述べよ。
3. サンプル系の(2) SQLクエリのフローに対してLINDDUNのDisclosure of informationを
   適用すると、どのような脅威シナリオが考えられるか1つ挙げよ。

<details><summary>解答</summary>

1. STRIDEはDFDの**各要素**（プロセス・データフロー等）を単位に6分類を総当たりする横断的な
   網羅性重視の手法。attack treeは**1つの攻撃者ゴール**を根に置き、そこに至る経路を
   AND/ORで縦に分解する深掘り重視の手法。
2. STRIDEのRepudiationは「攻撃者が自分の行為を否認できてしまう」ことが脅威（否認防止の
   欠如＝攻撃者に有利）。LINDDUNのNon-repudiationは逆に「データ主体の行為が証拠付きで
   特定人物に帰属してしまう」ことが脅威（否認**できなくなる**こと＝プライバシー上不利）。
   同じ語幹だが守りたい対象の立場が逆転している。
3. 例: SQLインジェクションでユーザDBの内容（氏名・住所等の個人データ）がそのまま
   外部に漏洩するシナリオ。STRIDEのInformation Disclosureと現象としては重なるが、
   LINDDUNの文脈では「漏洩した個人データがデータ主体にどんな不利益を与えるか」という
   プライバシー影響の観点で評価する。

</details>

---

## 次への接続

脅威を洗い出した後は、それに対する**設計レベルの防御**を体系化する。
セキュリティ設計パターンと、Spectre/Meltdownという実例に対するソフトウェア側の
多層防御を見る。→ [03 セキュリティパターン](./03_security-patterns.md)

---

## 参考

- Deng, M., Wuyts, K., Scandariato, R., Preneel, B., Joosen, W. (2011). *A privacy threat analysis framework: supporting the elicitation and fulfillment of privacy requirements*. Requirements Engineering, 16(1), 3-32.
- linddun.org, *Threat types*: https://linddun.org/threat-types/
- Kohnfelder, L., Garg, P. (1999). *The Threats to Our Products*. Microsoft Interface (社内誌).
- Schneier, B. (1999). *Attack Trees: Modeling Security Threats*. Dr. Dobb's Journal, 24(12), 21-29.
