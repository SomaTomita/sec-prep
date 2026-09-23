# 共通用語集（living doc）

> 対応: プログラム全体 ｜ 層: 地図 (Layer 0)
> 読み進めながら追記する。各柱の固有用語は各領域フォルダ側に置く。

各表は「用語 / 一言で / どこで出るか」の 3 列。本文で初めて出た語はここへ戻って確認する。

## 「サイバー」という語

| 用語 | 一言で | どこで出るか |
|---|---|---|
| cybernetics | 通信と制御の学問（第二次大戦期〜）。語源はギリシャ語 *kybernetes*（船の舵取り） | 文献の年代を読むとき |
| cyberspace / cyber security | cyberspace は 1980 年代前半の造語。cyber security が一般語になったのは 2000 年代末以降で、それ以前は information security / IT security が普通 | 同上 |

> 「サイバー」自体は「舵取り」の意で、システムもセキュリティも含意しない。歴史的経緯で定着した語。

## 基本概念

| 用語 | 一言で | どこで出るか |
|---|---|---|
| CIA トライアド | 機密性 / 完全性 / 可用性。目標の基本 3 軸。1970 年代の枠組みで、認可・契約・推論を表しきれない批判がある | [システムの原則](../06_systems-security/01_security-fundamentals.md) |
| 認証 (Authentication) | 「誰/何であるか」の確認。入口の本人確認 | [運用管理](../08_management-governance/02_security-operations.md) |
| 認可 (Authorization) | 認証済みの相手に「何を許すか」の決定 | 同上 |
| 否認防止 (Non-repudiation) | 「やっていない」と後から否定できないようにする（例: デジタル署名） | [暗号](../02_cryptography/01_goals-and-primitives.md) |

## リスク用語

| 用語 | 一言で | どこで出るか |
|---|---|---|
| 資産 (Asset) | 守る価値のあるもの | [リスク管理](../08_management-governance/01_risk-management.md) |
| 脅威 (Threat) | 資産に害を与えうる事象・主体 | 同上 |
| 脆弱性 (Vulnerability) | 脅威に悪用されうる弱点 | 同上 |
| リスク (Risk) | 損害の見込み。「脅威 × 脆弱性 × 影響の大きさ」 | 同上 |
| 対策 (Countermeasure / Control) | リスクを下げる手段（技術的・組織的） | 同上 |
| 攻撃面 (Attack surface) | 攻撃者が触れられる入口の総体。狭いほどよい | [脆弱性](../06_systems-security/02_software-vulnerabilities.md) |
| 損害額推計 (loss estimate) | 公表されるサイバー犯罪の被害額。調査手法の偏りで桁が振れるので、IT 支出などと比べて検算する | [脅威ランドスケープ](04_threat-landscape.md) |
| time-to-exploit | 脆弱性の公表から実用的な悪用コードが出るまでの時間。パッチの優先度づけはこれを前提にしている | [AI とセキュリティ](05_ai-and-security.md) |
| 監視資本主義 (surveillance capitalism) | 個人の行動データの収集と予測を収益源にする経済モデル（Zuboff） | [Web 追跡](../03_privacy/05_web-privacy-tracking.md) |

## 攻撃者モデル

| 用語 | 一言で | どこで出るか |
|---|---|---|
| 脅威モデル (Threat model) | 「どんな攻撃者（能力・目的・アクセス範囲）を想定するか」の明文化。安全性は必ずこれに対して定義する | [暗号](../02_cryptography/01_goals-and-primitives.md)・[脅威モデリング](../05_software-security/02_threat-modeling.md) |
| TCB (Trusted Computing Base) | 「ここが正しく動く」と信頼せざるを得ない最小限の構成要素。壊れると全体が崩れる | [システムの原則](../06_systems-security/01_security-fundamentals.md) |
| Root of trust | 信頼チェーン（順に検証を積み上げる連鎖）の出発点。多くはハードウェア | [HW](../04_hardware-security/index.md) |
| trusted / trustworthy | trusted＝壊れるとポリシーが破れる「信頼**せざるを得ない**」要素。trustworthy＝「信頼に**値する**」。別概念。混同すると「TPM は trusted だから安全」と誤る | [HW](../04_hardware-security/index.md) |

## 暗号の超基本

| 用語 | 一言で | どこで出るか |
|---|---|---|
| 平文 / 暗号文 | 暗号化前 / 後のデータ | [対称暗号](../02_cryptography/02_symmetric-crypto/README.md) |
| 鍵、対称鍵 / 公開鍵 | 暗号化・復号に使う秘密情報。対称は双方同じ鍵、公開鍵は暗号化用と復号用が別 | [暗号の目標](../02_cryptography/01_goals-and-primitives.md) |
| Kerckhoffs の原理 | 鍵以外（アルゴリズム）が公開されても安全であるべき | 同上 |
| crypto agility | 使う暗号方式を後から差し替えられる性質。方式ごとに鍵長・出力長が違うので、設計時に想定していない差し替えは難しい | [発展トピック](../02_cryptography/06_advanced-topics-map.md) |

## プライバシーの超基本

| 用語 | 一言で | どこで出るか |
|---|---|---|
| unlinkability / anonymity / unobservability / undetectability | プライバシー特性の 4 類型（非連結性・匿名性・非観測性・非検知性） | [プライバシーの概念](../03_privacy/01_privacy-concepts.md) |
| PII | 個人を特定しうる情報 | 同上 |

## つまずき / 深掘り候補

- （読みながら未定義語をここに追加 → 必要なら各領域へ移す）

## 参考

- [02_five-pillars-map.md](02_five-pillars-map.md)
