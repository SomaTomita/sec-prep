# 03. 認証・認可・アクセス制御

> 前: [02 ソフトウェア脆弱性](./02_software-vulnerabilities.md) ｜ 次: [04 インフラセキュリティ](./04_infrastructure-security.md) ｜ 層: 基礎(Layer 1)

「あなたは誰か」（認証）と「あなたは何をしてよいか」（認可）は別の問題。
[01](./01_security-fundamentals.md) の First American Financial の事例は、認証すら不要な
URLで機微文書が閲覧できてしまった——つまり**認可の設計が存在しなかった**ケースだった。
本ファイルはこの認可を体系的に扱う理論の起点、Lampson (1971) のアクセス制御マトリックスから始める。
これは
[`../01_prerequisites/02_low-level-c-os/02_process-and-os.md`](../01_prerequisites/02_low-level-c-os/02_process-and-os.md)
の深掘りキューが予告していた内容の本体。

---

## 認証：あなたは誰か

### 認証の3要素

| 要素 | 例 |
|---|---|
| Something you know（知識） | パスワード、PIN |
| Something you have（所持） | セキュリティキー、スマートフォンの認証アプリ |
| Something you are（生体） | 指紋、顔認証 |

**多要素認証 (MFA)** はこのうち異なる2種類以上を組み合わせる——[01](./01_security-fundamentals.md)
の「権限の分離」原則の直接的な応用。

### NIST SP 800-63B：認証保証レベル(AAL)

| レベル | 要件 |
|---|---|
| AAL1 | 単一要素で可（パスワードのみ等） |
| AAL2 | 異なる2要素の組み合わせ（MFA）が必須 |
| AAL3 | ハードウェアベースの認証器＋なりすまし耐性が必須 |

パスワード単体を使う場合は最低15文字を推奨（2025年更新のSP 800-63B-4）。
「複雑さ」より「長さ」を優先する方向へ2017年版以降シフトしている。

---

## 認可：あなたは何をしてよいか — Lampsonのアクセス制御マトリックス

Butler Lampson が1971年の論文 *"Protection"*（Proc. 5th Princeton Conf. on Information
Sciences and Systems）で提示した、保護状態を表す最も基本的な形式モデル。

```
概念:
  主体 (Subject)：  アクセスを要求する側（ユーザー、プロセス）
  客体 (Object)：   アクセスされる側（ファイル、デバイス、他プロセス）
  権利 (Right)：    許可される操作（read, write, execute, own ...）

マトリックス M：行=主体、列=オブジェクト、セル=その主体がそのオブジェクトに持つ権利の集合
```

### 具体例

| | file1.txt | file2.txt | printer1 |
|---|---|---|---|
| **alice** | own, read, write | read | — |
| **bob** | read | own, read, write | write |
| **printer-daemon** | — | — | own, read, write |

このマトリックスは「参照モニタ (Reference Monitor)」——あらゆるアクセス要求をこの表と
照合してから許可/拒否する仲介機構——という考え方に直結する（[01](./01_security-fundamentals.md)
の「完全な仲介」原則そのもの）。

### マトリックスの保存方法：ACL vs Capability

実際のシステムはマトリックス全体を疎行列として保存せず、**列ごと**か**行ごと**かのどちらかで持つ。

```
ACL（アクセス制御リスト）＝ 列ごとに保存
  file1.txt のACL: [(alice, own+read+write), (bob, read)]
  → 「このオブジェクトに誰がアクセスできるか」がすぐ分かる
  → 主体（alice）の権限を取り消したい時は、全オブジェクトのACLを走査する必要がある

Capability（ケーパビリティ）＝ 行ごとに保存
  alice の capability list: [(file1.txt, own+read+write), (file2.txt, read)]
  → 「この主体が何にアクセスできるか」がすぐ分かる。所有者が指定した権限を持つ
    トークン（capability）を渡すことで委譲もできる
  → 誰がそのオブジェクトにアクセスできるかを一覧するのが難しい
  → 「confused deputy problem」（正当な権限を持つ代理プログラムが、権限のない
    呼び出し元のために意図せず権限を行使してしまう）という既知の弱点がある
```

UNIXのパーミッションビットやWindows ACLは前者、Linuxの `capabilities`（`CAP_NET_ADMIN`等）や
分散システムのアクセストークン（OAuth 2.0のトークン等）は後者の発想に近い。

---

## アクセス制御モデル：DAC・MAC・RBAC・ABAC

| モデル | 誰が権限を決めるか | 代表例 |
|---|---|---|
| **DAC**（任意アクセス制御） | オブジェクトの所有者が自由に決め、他者に権限を委譲できる | UNIXファイルパーミッション |
| **MAC**（強制アクセス制御） | システムが定めた全体ポリシーに従う。所有者でも変更できない | Bell-LaPadula モデル、SELinux |
| **RBAC**（ロールベース） | ユーザーにロールを割り当て、ロールに権限を紐付ける | 企業の「経理担当」「管理者」ロール |
| **ABAC**（属性ベース） | 主体・オブジェクト・環境の属性を評価してその場で判定する | 「平日9-18時かつ社内ネットワークからのみ許可」 |

DAC/MACの区別は米国防総省のTCSEC（"Orange Book"、DoD 5200.28-STD、1985年）が公式に定義した。
**Bell-LaPadula モデル**（1973年、MITRE社）はMACの代表的な機密性モデルで、
「読み取りは同レベル以下のみ（no read up）、書き込みは同レベル以上のみ（no write down）」
という2規則で情報の上位区分から下位区分への漏洩を防ぐ。

**RBAC**は Sandhu, Coyne, Feinstein, Youman が1996年の論文でモデル体系（RBAC0〜RBAC3）を
整理した。**ABAC**はNIST SP 800-162（2014年）が定義を与えた比較的新しいモデルで、
ポリシー実施点(PEP)・決定点(PDP)・情報点(PIP)・管理点(PAP)の4機能で構成される。

First American Financial の事例に戻ると、あの欠陥は「認可モデルを何も実装していなかった」
ケース——DAC/MAC/RBAC/ABACのどれ以前の、Lampsonマトリックスの列（file単位のACL）
すら存在しなかった状態だったと整理できる。

---

## なぜ重要か / コースでの位置づけ

「認証とアクセス制御」の章がここに対応する。OWASP Top 10 の A01（Broken Access
Control）・A07（Identification and Authentication Failures、[02](./02_software-vulnerabilities.md)）
は、このセクションのモデルのどれかが欠落・誤実装された結果として発生する。
setuidバイナリの脆弱性（`../01_prerequisites/02_low-level-c-os/02_process-and-os.md`）も
DACの実行時委譲メカニズムの一種として理解できる。

---

## 演習（解答つき）

1. ACLとCapabilityのそれぞれで、「ある主体の権限を即座に全部取り消す」操作はどちらが得意か。
2. Bell-LaPadulaモデルの「no read up, no write down」がなぜMAC（強制アクセス制御）に
   分類されるか、DACとの違いから説明せよ。
3. First American Financial の事例をLampsonのアクセス制御マトリックスの言葉で説明せよ。

<details><summary>解答</summary>

1. **Capability**の方が得意。ある主体（行）に紐づくcapability listを丸ごと無効化すれば
   その主体の全権限を失効できる。ACLでは主体の権限を全て取り消すには、
   全オブジェクトのACLをそれぞれ走査して該当エントリを削除する必要がある。
2. DACはオブジェクトの**所有者**が権限を自由に決められるが、Bell-LaPadulaの規則は
   所有者の意思に関係なく**システム全体のポリシー**として強制される
   （所有者であっても上位区分への書き込みや下位区分からの読み取りの許可を変更できない）。
   この「所有者の裁量を超えて強制される」点がMACの定義そのもの。
3. 本来は「そのファイル（オブジェクト）に対して、認証済みの特定ユーザー（主体）だけが
   readの権利を持つ」という行が必要だったが、実際にはアクセス制御マトリックスの
   その列（オブジェクト）に対する行自体が定義されておらず、事実上「誰でもread可能」
   という設定になっていた。

</details>

---

## 次への接続

認証・認可の理論が揃ったところで、次はこれらを実際にネットワーク上でどう実施するか
——ファイアウォールやIDS/IPSといったインフラ層のセキュリティ技術——を見る。
→ [04 インフラセキュリティ](./04_infrastructure-security.md)

---

## 参考

- Lampson, B.W. (1971). *Protection*. Proc. 5th Princeton Conf. on Information Sciences and Systems, pp.437-443. (Reprinted in ACM Operating Systems Review 8(1), 1974, pp.18-24.) https://cseweb.ucsd.edu/classes/fa01/cse221/papers/lampson-protection-osr74.pdf
- Bell, D.E., LaPadula, L.J. (1973). *Secure Computer Systems: Mathematical Foundations*. MITRE Technical Report.
- Sandhu, R.S., Coyne, E.J., Feinstein, H.L., Youman, C.E. (1996). *Role-Based Access Control Models*. IEEE Computer, 29(2), 38-47.
- NIST SP 800-162, *Guide to Attribute Based Access Control (ABAC) Definition and Considerations*: https://csrc.nist.gov/pubs/sp/800/162/upd2/final
- NIST SP 800-63B-4, *Digital Identity Guidelines: Authentication and Authenticator Management*: https://csrc.nist.gov/pubs/sp/800/63/b/4/final
- DoD 5200.28-STD (1985), *Trusted Computer System Evaluation Criteria*（通称 "Orange Book"）
