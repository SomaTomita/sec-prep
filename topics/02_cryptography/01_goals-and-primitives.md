# 01. セキュリティ目標とプリミティブの分類

> 対応科目: H05E1B Cryptography and Network Security, H0Q28A Cryptographic Protocols ｜ 次: [02 対称鍵暗号](./02_symmetric-crypto.md) ｜ 層: 基礎(Layer 1)

暗号を学ぶ前に「何を達成したいのか（目標）」と「何を組み合わせて達成するのか（プリミティブ）」を
先に地図として持っておく。CIA トライアド（用語は
[`../00_overview/03_glossary.md`](../00_overview/03_glossary.md)）はセキュリティ全般の枠組みだが、
**暗号だけで達成できる目標とできない目標がある**ことがまず重要な区別。

---

## CIA トライアドと暗号の守備範囲

| 目標 | 暗号で達成できるか | 使うプリミティブ |
|---|---|---|
| 機密性 (Confidentiality) | ○ | 対称鍵暗号（[02](./02_symmetric-crypto.md)）・公開鍵暗号（[03](./03_public-key-crypto/README.md)） |
| 完全性 (Integrity) | ○ | ハッシュ関数・MAC（[`04_hash-and-mac.md`](./04_hash-and-mac.md)） |
| 可用性 (Availability) | **✕ 暗号の範囲外** | 冗長化・DoS対策など（システムセキュリティの領域） |

**可用性は暗号プリミティブでは守れない**という点が見落とされやすい。
どれだけ強い暗号を使っても、サーバを停止させる DoS 攻撃は防げない。
可用性はネットワーク・システム設計の問題であり、暗号の役割は機密性・完全性・認証に限られる。

---

## CIA を超える目標：認証と否認防止

CIA だけでは実務上の要求を言い切れない。特に次の2つは暗号設計で頻出する:

```
認証 (Authentication):
  データ発信元認証 (data origin authentication) — このメッセージは本当に A が送った物か
  実体認証 (entity authentication)              — 今通信している相手は本当に A か（なりすまし対策）

否認防止 (Non-repudiation):
  A が「送った」という事実を、A自身が後から否定できないこと
```

### 重要な区別：MAC は否認防止を提供できない

**MAC（メッセージ認証コード）は認証はできるが否認防止はできない。**
理由は単純：MAC は送信者と受信者が**同じ秘密鍵を共有**するため、受信者もそのメッセージの
正しい MAC を自分で作れてしまう。第三者から見て「送信者が作ったのか、受信者が後から
自作自演で作ったのか」を区別する手段がない。

否認防止を実現するには **公開鍵署名**が必要（秘密鍵は署名者しか持たないため、
検証者は「署名できるのは本人だけ」と第三者にも証明できる）。
デジタル署名は [`03_public-key-crypto/04_digital-signatures.md`](./03_public-key-crypto/04_digital-signatures.md) で扱う。

---

## 目標 → プリミティブの対応表

| 目標 | 対称鍵の道具 | 公開鍵の道具 |
|---|---|---|
| 機密性 | AES 等のブロック/ストリーム暗号 | RSA 暗号化（[`03_public-key-crypto/01_rsa/`](./03_public-key-crypto/01_rsa/README.md)） |
| 完全性 | MAC（HMAC 等） | （署名に内包） |
| データ発信元認証 | MAC | デジタル署名 |
| 実体認証 | チャレンジ・レスポンス（共有鍵ベース） | 証明書・署名ベースの認証プロトコル |
| 否認防止 | ✕ 不可能 | デジタル署名（RSA-PSS・ECDSA） |
| 鍵確立 | 事前共有鍵（PSK） | Diffie–Hellman（`03_public-key-crypto/02_dh.md`）・RSA鍵輸送 |

---

## プリミティブの分類（暗号の道具箱の見取り図）

```
無鍵プリミティブ (unkeyed):
  ハッシュ関数（SHA-256 等）、暗号論的乱数生成器
  → 鍵を使わないが、暗号システムの部品として不可欠

対称鍵プリミティブ (symmetric-key):
  ブロック暗号（AES）、ストリーム暗号（ChaCha20）、MAC（HMAC）
  → 送受信者が同じ鍵を共有。高速。[02](./02_symmetric-crypto.md) で詳述

公開鍵プリミティブ (public-key / asymmetric):
  暗号化（RSA）、署名（RSA-PSS・ECDSA）、鍵合意（DH・ECDH）
  → 鍵ペア（公開鍵・秘密鍵）を使う。低速だが鍵共有問題を解決。[03](./03_public-key-crypto/README.md) で詳述
```

対称鍵と公開鍵はどちらか一方で完結するのではなく、実務では**組み合わせて使う**
（ハイブリッド暗号。詳細は [`02_symmetric-crypto.md`](./02_symmetric-crypto.md) の「暗号での出口」節）。

---

## Kerckhoffs の原理：安全性はアルゴリズムでなく鍵の秘密性に置く

暗号システム設計の大原則。1883年、Auguste Kerckhoffs が論文
*La cryptographie militaire* で提示した設計原則の一つで、要約すると:

```
暗号システムは、鍵以外の全て（アルゴリズムの詳細・実装）が敵に知られても安全であるべき。
```

Claude Shannon はこれを **"the enemy knows the system"**（敵はシステムを知っている）
と言い換えた。これは「アルゴリズムを秘密にすることで安全性を確保する」
**セキュリティ・バイ・オブスキュリティ（security through obscurity）とは正反対の考え方**。

- AES・RSA のアルゴリズムはすべて公開されている。それでも安全なのは、
  鍵さえ守れば安全という設計だから。
- 「独自の秘密アルゴリズム」を使う暗号は、Kerckhoffs の原理に反しており、
  公開レビューを受けていない分だけ危険（未発見の脆弱性を抱えている可能性が高い）。

---

## 攻撃者モデル：何を「知っている・できる」敵を想定するか

暗号方式の安全性は「攻撃者が何をできるか」を定義しないと議論できない。代表的な分類:

```
受動的攻撃者 (passive):  通信を盗聴するだけ（機密性への脅威）
能動的攻撃者 (active):   通信の改ざん・なりすまし・再送も行う（完全性・認証への脅威）

選択平文攻撃 (CPA, Chosen-Plaintext Attack):
  攻撃者は好きな平文を暗号化させて暗号文を得られる
選択暗号文攻撃 (CCA, Chosen-Ciphertext Attack):
  攻撃者は好きな暗号文を復号させて平文を得られる（Bleichenbacher 攻撃はこの一種。
  詳細は 03_public-key-crypto/01_rsa/04_padding-and-attacks.md）
```

「教科書 RSA は決定論的だから危険」（[`03_public-key-crypto/01_rsa/04_padding-and-attacks.md`](./03_public-key-crypto/01_rsa/04_padding-and-attacks.md)）
という指摘は、実は「CPA下での安全性（IND-CPA）を満たさない」という話を平易に言い換えたもの。
形式的な安全性定義（IND-CPA・IND-CCA）は H0Q28A で本格的に扱う。

---

## 演習（解答つき）

1. 「AES で暗号化すれば DoS 攻撃からサーバを守れる」という主張のどこが誤りか。
2. A が B に送金指示メッセージを MAC 付きで送った。後で A が「送っていない」と主張した場合、
   B は第三者（裁判所等）に対して A が送信したことを証明できるか。理由も述べよ。
3. 独自開発の非公開暗号アルゴリズムを使うことが Kerckhoffs の原理の観点から危険な理由を述べよ。

<details><summary>解答</summary>

1. 可用性（Availability）は暗号プリミティブの守備範囲外。AES は機密性を守るだけで、
   サーバのリソースを枯渇させる DoS 攻撃を防ぐ仕組みを持たない。
2. **証明できない**。MAC は A と B が同じ鍵を共有しているため、そのメッセージの MAC は
   B自身でも作成可能。第三者から見て「本当に A が作ったのか、B が自作自演したのか」を
   区別する手段がなく、否認防止を提供できない。
3. 公開レビューを受けていないアルゴリズムは、専門家による暗号解析（差分解析・線形解析等）に
   晒されておらず、未発見の脆弱性を抱えている可能性が高い。Kerckhoffs の原理は
   「アルゴリズムは公開して構わない、鍵さえ守れば安全」という設計を求めており、
   独自秘密アルゴリズムはこの前提に反し、検証されていない分だけ信頼性が低い。

</details>

---

## 次への接続

目標とプリミティブの見取り図ができた。まず高速でよく使う**対称鍵暗号**から見ていく。
→ [02 対称鍵暗号](./02_symmetric-crypto.md)

---

## 参考

- Stallings, *Cryptography and Network Security* (7th ed.), Chapter 1 — Overview
- Menezes, van Oorschot, Vanstone, *Handbook of Applied Cryptography*, Chapter 1（プリミティブの分類）
- Kerckhoffs, A. (1883). *La cryptographie militaire*. Journal des sciences militaires.
- KU Leuven H05E1B シラバス: https://onderwijsaanbod.kuleuven.be/syllabi/e/H05E1BE.htm
