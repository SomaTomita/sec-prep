# 共通用語集（living doc）

> 対応: プログラム全体 ｜ 層: 地図 (Layer 0)
> 読み進めながら追記する。各柱の固有用語は各領域フォルダ側に置く。

## 基本概念

| 用語 | 一言定義 |
|---|---|
| CIA トライアド | 機密性 (Confidentiality) / 完全性 (Integrity) / 可用性 (Availability)。セキュリティ目標の基本3軸。 |
| 認証 (Authentication) | 主体が「誰/何であるか」の確認。 |
| 認可 (Authorization) | 認証された主体に「何を許すか」の決定。 |
| 否認防止 (Non-repudiation) | 行為を後から否定できないこと（例: デジタル署名）。 |

## リスク用語

| 用語 | 一言定義 |
|---|---|
| 資産 (Asset) | 守る価値のあるもの。 |
| 脅威 (Threat) | 資産に害を与えうる事象・主体。 |
| 脆弱性 (Vulnerability) | 脅威に悪用されうる弱点。 |
| リスク (Risk) | 脅威×脆弱性×影響の積として捉える、損害の見込み。 |
| 対策 (Countermeasure / Control) | リスクを下げる手段。 |
| 攻撃面 (Attack surface) | 攻撃者が到達・操作できる入口の総体。 |

## 攻撃者モデル

| 用語 | 一言定義 |
|---|---|
| 脅威モデル (Threat model) | 想定する攻撃者の能力・目的・アクセス範囲の定義。 |
| TCB (Trusted Computing Base) | 正しく動くことを信頼に置く最小構成要素の集合。 |
| Root of trust | 信頼チェーンの起点（多くはハードウェア）。 |

## 暗号の超基本（詳細は本体へリンク）

| 用語 | 一言定義 | 本体 |
|---|---|---|
| 平文 / 暗号文 (plaintext / ciphertext) | 暗号化前後のデータ | [`../02_cryptography/02_symmetric-crypto.md`](../02_cryptography/02_symmetric-crypto.md) |
| 鍵 (key)、対称鍵 / 公開鍵 (symmetric / public-key) | 暗号化・復号に使う秘密情報 | [`../02_cryptography/01_goals-and-primitives.md`](../02_cryptography/01_goals-and-primitives.md) |
| Kerckhoffsの原理 | 鍵以外（アルゴリズム）が公開されても安全であるべき | [`../02_cryptography/01_goals-and-primitives.md`](../02_cryptography/01_goals-and-primitives.md) |

## プライバシーの超基本（詳細は本体へリンク）

| 用語 | 一言定義 | 本体 |
|---|---|---|
| unlinkability / anonymity / unobservability / undetectability | プライバシー特性の4類型 | [`../03_privacy/01_privacy-concepts.md`](../03_privacy/01_privacy-concepts.md) |
| PII | 個人を特定しうる情報 | [`../03_privacy/01_privacy-concepts.md`](../03_privacy/01_privacy-concepts.md) |

## つまずき / 深掘り候補

- （読みながら未定義語をここに追加 → 必要なら各領域へ移す）

## 参考

- [02_five-pillars-map.md](02_five-pillars-map.md)
