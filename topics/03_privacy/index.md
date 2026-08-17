# 03. プライバシー

> 層: 地図 (Layer 0)

「個人と関係性（誰が誰と何をしたか）」を守る領域。
[`../02_cryptography/`](../02_cryptography/index.md) の道具（MPC・FHE等）を応用しつつ、
匿名化の数理・匿名通信の設計・Web上の実際の攻防・法制度までを一気通貫で扱う。

## 読む順

| # | ページ | 内容（1行） |
|---|---|---|
| 01 | [プライバシー概念](01_privacy-concepts.md) | 匿名性・非連結性・非検知性・非観測性・仮名性(Pfitzmann-Hansen)・Solove の害の類型・PII |
| 02 | [匿名化と差分プライバシー](02_anonymization-and-dp.md) | k-匿名化・l-多様性・t-近接性・差分プライバシー(ε, ラプラスメカニズム) |
| 03 | [暗号的PET](03_ppt-cryptographic/README.md) | 概念フォルダ（全3ファイル）— PIR/OT・ゼロ知識証明・MPC と FHE の使い分け |
| 04 | [匿名通信](04_anonymous-comms.md) | メタデータを守る理由・Mixネットワーク(Chaum)・Tor・トラフィック相関攻撃・例外アクセスの反復 |
| 05 | [Webプライバシーとトラッキング](05_web-privacy-tracking.md) | Cookie・スーパークッキー・ブラウザフィンガープリンティング・DNTの失敗 |
| 06 | [法とDPIA](06_law-and-dpia.md) | GDPR概観(7原則・適法根拠・データ主体の権利)・DPIA |

<details>
<summary>進捗チェックリスト</summary>

- [x] `01_privacy-concepts.md` — 匿名性・非連結性・非検知性・非観測性・仮名性(Pfitzmann-Hansen)・Solove の害の類型・PII
- [x] `02_anonymization-and-dp.md` — k-匿名化・l-多様性・t-近接性・差分プライバシー(ε, ラプラスメカニズム)
- [x] `03_ppt-cryptographic/` — 暗号によるプライバシー技術（概念フォルダ、全3ファイル完成）
  - [ ] `01_pir-and-ot.md` — PIR（どの項目を見たか隠す）・OT（どれを選んだか隠す）
  - [ ] `02_zero-knowledge-proofs.md` — 3性質・knowledge soundness・Σプロトコル・Fiat–Shamir・R1CS
  - [ ] `03_mpc-and-fhe.md` — MPC と FHE の使い分け・PSI・出力からの漏れという別の層
- [x] `04_anonymous-comms.md` — メタデータを守る理由・Mixネットワーク(Chaum)・Tor・トラフィック相関攻撃・例外アクセスの反復
- [x] `05_web-privacy-tracking.md` — Cookie・スーパークッキー・ブラウザフィンガープリンティング・DNTの失敗
- [x] `06_law-and-dpia.md` — GDPR概観(7原則・適法根拠・データ主体の権利)・DPIA

</details>

<details>
<summary>科目対応・深掘りキュー・関連領域</summary>

### 科目対応マップ

| ファイル | 暗号/他領域との接続 |
|---|---|
| 01 概念 | — |
| 02 匿名化・DP | — |
| 03 暗号的PET | `02_cryptography/06`のMPC/FHEを応用・`02_cryptography/03_public-key-crypto/04`（Fiat–Shamir と署名）・`06_systems-security/07`（選択的開示） |
| 04 匿名通信 | `02_cryptography`のECDH・AES-CTRを利用 |
| 05 Webトラッキング | — |
| 06 GDPR・DPIA | [`../07_legal/`](../07_legal/index.md)・`05_software-security`(LINDDUN)へ接続 |

### このドメインで「本体」を置かないもの（DRY）

- **MPC・FHE・Yao/Shamirの仕組み自体** → [`../02_cryptography/06_advanced-topics-map.md`](../02_cryptography/06_advanced-topics-map.md)（本領域はプライバシー応用のみ）
- **STRIDE/LINDDUN脅威モデリングの方法論** → [`../05_software-security/02_threat-modeling.md`](../05_software-security/02_threat-modeling.md)
- **GDPR以外の法務詳細（NIS2・Cybersecurity Act・ePrivacy指令・国際データ移転・サイバー犯罪・知財等）** → [`../07_legal/`](../07_legal/index.md)

### 深掘りキュー（Layer 2 候補）

- [ ] 匿名性の定量化（エントロピーベースの匿名性尺度、Serjantov-Danezis） → `deep/anonymity-metrics/`
- [ ] 単一サーバPIRの構成（FHEを使った具体的なプロトコル） → `deep/single-server-pir/`
- [ ] Torの隠しサービス（rendezvous point）の仕組み → `deep/tor-hidden-services/`
- [ ] Solove の16類型と技術的4性質の詳細な対応づけ → `deep/privacy-taxonomy/`
- [ ] クライアントサイドスキャンの技術的批判（誤検知率とスコープ拡大の議論） → `deep/client-side-scanning/`
- [x] LINDDUN脅威モデリングの7カテゴリ詳細 → [`../05_software-security/02_threat-modeling.md`](../05_software-security/02_threat-modeling.md)

</details>

## 参考（領域全体）

- GDPR 全文: https://gdpr-info.eu/
