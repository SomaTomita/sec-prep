# 共通用語集（living doc）

> 対応: プログラム全体 ｜ 層: 地図 (Layer 0)
> 読み進めながら追記する。各柱の固有用語は各領域フォルダ側に置く。

## 「サイバー」という語

| 用語 | 一言定義 |
|---|---|
| cybernetics | 第二次大戦期に始まった通信と制御の学問。語源はギリシャ語 *kybernetes*（船の舵取り）。 |
| cyberspace / cyber security | cyberspace は1980年代前半の造語。長く information security / IT security の方が一般的で、cyber security が一般語化したのは2000年代末以降。 |

> 「サイバー」自体は「舵取り」の意で、システムやセキュリティを含意しない。
> 歴史的経緯で定着した語だと知っておくと、文献の年代を読む助けになる。

## 基本概念

| 用語 | 一言定義 |
|---|---|
| CIA トライアド | 機密性 (Confidentiality) / 完全性 (Integrity) / 可用性 (Availability)。セキュリティ目標の基本3軸。ただし1970年代の枠組みで、認可・契約締結・推論などを表しきれないという批判がある（→ [`../06_systems-security/01_security-fundamentals.md`](../06_systems-security/01_security-fundamentals.md)） |
| 認証 (Authentication) | 主体（ユーザーや機器）が「誰/何であるか」の確認。入口の本人確認。 |
| 認可 (Authorization) | 認証された主体に「何を許すか」の決定。認証の後に来る権限付与。 |
| 否認防止 (Non-repudiation) | 「やっていない」と後から否定できないようにすること（例: デジタル署名）。 |

## リスク用語

| 用語 | 一言定義 |
|---|---|
| 資産 (Asset) | 守る価値のあるもの。 |
| 脅威 (Threat) | 資産に害を与えうる事象・主体。 |
| 脆弱性 (Vulnerability) | 脅威に悪用されうる弱点。 |
| リスク (Risk) | 損害の見込み。「脅威 × 脆弱性 × 影響の大きさ」の掛け算として捉える。 |
| 対策 (Countermeasure / Control) | リスクを下げる手段（技術的・組織的どちらも含む）。 |
| 攻撃面 (Attack surface) | 攻撃者が触れられる入口の総体（公開API・ログイン画面・物理ポート等）。狭いほどよい。 |
| 損害額推計 (loss estimate) | 公表されるサイバー犯罪の被害額。調査手法の偏りで桁が大きく振れるため、独立したアンカー（IT支出・市場規模）と比べて検算する（→ [`04_threat-landscape.md`](04_threat-landscape.md)） |
| time-to-exploit | 脆弱性の公表から実用的な悪用コードが存在するまでの時間。パッチ適用の優先度づけはこの長さを暗黙の前提にしている（→ [`05_ai-and-security.md`](05_ai-and-security.md)） |
| 監視資本主義 (surveillance capitalism) | 個人の行動データの収集と予測を収益源にする経済モデルを指す語（Zuboff）。（→ [`../03_privacy/05_web-privacy-tracking.md`](../03_privacy/05_web-privacy-tracking.md)） |

## 攻撃者モデル

| 用語 | 一言定義 |
|---|---|
| 脅威モデル (Threat model) | 「どんな攻撃者（能力・目的・アクセス範囲）を想定するか」の明文化。安全性は必ずこれに対して定義する。 |
| TCB (Trusted Computing Base) | 「ここが正しく動くこと」を前提として信頼する最小限の構成要素の集合。ここが壊れると全体の安全が崩れる。 |
| Root of trust | 信頼チェーン（順に検証を積み上げる連鎖）の出発点。多くはハードウェアに置く。 |
| trusted / trustworthy | **trusted** は「壊れるとポリシーが破れる」＝信頼**せざるを得ない**構成要素。**trustworthy** は「信頼に**値する**」。別概念であり、混同すると「TPM は trusted だから安全」のような誤った推論をする（→ [`../04_hardware-security/index.md`](../04_hardware-security/index.md)） |

## 暗号の超基本（詳細は本体へリンク）

| 用語 | 一言定義 | 本体 |
|---|---|---|
| 平文 / 暗号文 (plaintext / ciphertext) | 暗号化前後のデータ | [`../02_cryptography/02_symmetric-crypto/README.md`](../02_cryptography/02_symmetric-crypto/README.md) |
| 鍵 (key)、対称鍵 / 公開鍵 (symmetric / public-key) | 暗号化・復号に使う秘密情報 | [`../02_cryptography/01_goals-and-primitives.md`](../02_cryptography/01_goals-and-primitives.md) |
| Kerckhoffsの原理 | 鍵以外（アルゴリズム）が公開されても安全であるべき | [`../02_cryptography/01_goals-and-primitives.md`](../02_cryptography/01_goals-and-primitives.md) |
| crypto agility（暗号アジリティ） | 使う暗号方式を後から差し替えられる性質。方式ごとに鍵長・出力長・前提が違うため、設計時に想定していない差し替えは実際には難しい | [`../02_cryptography/06_advanced-topics-map.md`](../02_cryptography/06_advanced-topics-map.md) |

## プライバシーの超基本（詳細は本体へリンク）

| 用語 | 一言定義 | 本体 |
|---|---|---|
| unlinkability / anonymity / unobservability / undetectability | プライバシー特性の4類型 | [`../03_privacy/01_privacy-concepts.md`](../03_privacy/01_privacy-concepts.md) |
| PII | 個人を特定しうる情報 | [`../03_privacy/01_privacy-concepts.md`](../03_privacy/01_privacy-concepts.md) |

## つまずき / 深掘り候補

- （読みながら未定義語をここに追加 → 必要なら各領域へ移す）

## 参考

- [02_five-pillars-map.md](02_five-pillars-map.md)
