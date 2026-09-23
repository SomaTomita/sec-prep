# 04. ハードウェアセキュリティ

> 層: 地図 (Layer 0)

数学的に安全な暗号（[`../02_cryptography/`](../02_cryptography/index.md)）が**実際のチップの上でどう崩れ、どう守るか**を扱う。
物理・設計の基礎は [`../01_prerequisites/03_hardware-digital-logic/`](../01_prerequisites/03_hardware-digital-logic/index.md) が前提。

## 読む順

| # | ページ | 内容（1行） |
|---|---|---|
| 01 | [デジタルプラットフォーム設計](01_digital-platform-design.md) | 設計抽象レベル・PPAからPPAS(Security)へ・HW/SW協調設計とTCB・FHE高速化の事例 |
| 02 | [ハードウェア攻撃](02_hardware-attacks.md) | 攻撃者能力の分類(非侵襲/半侵襲/侵襲)・攻撃者の作業手順・部品の真正性・フォールト注入(RSA-CRT)・Spectre/Meltdown |
| 03 | [セキュリティ部品](03_security-building-blocks.md) | Root of Trust・TPM(PCR)・RNG（エントロピー評価と健全性テスト）・PUF |
| 04 | [サイドチャネル](04_side-channels/README.md) | 概念フォルダ（全4ファイル）— タイミング攻撃・電力解析(SPA/DPA/CPA)・キャッシュ攻撃・マスキングと耐量子実装 |
| 05 | [マイクロアーキと TEE](05_microarchitecture-and-tee.md) | ISA が規定しないもの・分離の2軸・メモリ安全性を破らない攻撃・TEE と機密計算 |

<details>
<summary>進捗チェックリスト</summary>

- [x] `01_digital-platform-design.md` — 設計抽象レベル・PPAからPPAS(Security)へ・HW/SW協調設計とTCB
- [x] `02_hardware-attacks.md` — 攻撃者能力の分類(非侵襲/半侵襲/侵襲)・攻撃者の作業手順・部品の真正性・フォールト注入(RSA-CRT)・Spectre/Meltdown
- [x] `03_security-building-blocks.md` — Root of Trust・TPM(PCR)・RNG（エントロピー評価と健全性テスト）・PUF
- [x] `04_side-channels/` — サイドチャネル（概念フォルダ、全4ファイル完成）
  - [ ] `01_timing-attacks.md` — 実行時間からの漏洩・PIN 検証を手で破る・定数時間実装
  - [ ] `02_power-analysis.md` — SPA→DPA→CPA・RSA への SPA・テンプレート/内部衝突
  - [ ] `03_cache-side-channels.md` — Prime+Probe / Flush+Reload・共有メモリという前提
  - [ ] `04_countermeasures.md` — マスキングと probing model・耐量子実装の難しさ
- [ ] `05_microarchitecture-and-tee.md` — ISA が規定しないもの・分離の2軸・TEE（SGX/TDX/SEV/CCA）と機密計算

</details>

<details>
<summary>科目対応・深掘りキュー・関連領域</summary>

対応科目: Design of Digital Platforms: Concepts, Design Seminar, Hardware Security

### 「ハードウェア」がどの層を指すかは相対的

この領域で最初につまずくのは、**話者によって「ハードウェア」の指す層が違う**こと。

| 話者 | その人にとってのハードウェア |
|---|---|
| OS・コンパイラ設計者 | プロセッサの命令セットとマイクロアーキテクチャ |
| 計算機アーキテクト | 論理ゲートとレジスタ転送レベル |
| 回路設計者 | トランジスタと配線の物理特性 |

実務的には「**自分が今いる層の1つ下**」を指していることが多い。本領域のファイルは
`01`（プラットフォーム設計）から `04`（サイドチャネル）へ進むにつれて層が下がる。
議論が噛み合わないと感じたら、まず相手がどの層の話をしているかを確認する。

### trusted は「信頼できる」ではない

**trusted component = それが壊れるとセキュリティポリシーが破れる構成要素**。
つまり trusted とは「信頼**せざるを得ない**」という意味であって、
「信頼に**値する**（trustworthy）」という保証ではない。
両者を混同すると「TPM は trusted だから安全」のような誤った推論をしてしまう。
TCB を小さく保つ動機はここにある（→ [`../00_overview/03_glossary.md`](../00_overview/03_glossary.md)、
[`01_digital-platform-design.md`](01_digital-platform-design.md)）。

### 科目対応マップ

| ファイル | 暗号/他領域との接続 |
|---|---|
| 01 設計 | `01_prerequisites/03_hardware-digital-logic`のPPA/CMOS |
| 02 攻撃 | `02_cryptography/03_public-key-crypto/01_rsa`（RSA-CRT） |
| 03 部品 | `02_cryptography/04_hash-and-mac`（PCR拡張）・`04_digital-signatures`（RNG不備事例） |
| 04 サイドチャネル | `02_cryptography/06_advanced-topics-map`（動機付け）・`03_privacy/03_ppt-cryptographic`（秘密分散）・`02_cryptography/06`（耐量子実装） |
| 05 マイクロアーキと TEE | `01_prerequisites/03_hardware-digital-logic/03_hdl-and-architecture`（投機実行の原理）・`06_systems-security/05`（マルチテナント分離） |

### このドメインで「本体」を置かないもの（DRY）

- **CMOS・組合せ/順序回路・パイプライン・メモリ階層の基礎** → [`../01_prerequisites/03_hardware-digital-logic/`](../01_prerequisites/03_hardware-digital-logic/index.md)（本領域はその上のセキュリティ応用）
- **MPC・秘密分散の一般論** → [`../02_cryptography/06_advanced-topics-map.md`](../02_cryptography/06_advanced-topics-map.md)（マスキングとの関係のみ本領域で言及）
- **Spectre/Meltdownへのソフトウェア側の緩和策** → [`../05_software-security/03_security-patterns.md`](../05_software-security/03_security-patterns.md)

### 深掘りキュー（Layer 2 候補）

- [ ] safegcd等の定数時間アルゴリズムの実装詳細 → `deep/constant-time-algorithms/`
- [ ] マスキングの次数（1次/高次マスキング）と各次数を破る攻撃 → `deep/higher-order-masking/`
- [ ] PUFの評価指標（uniqueness, reliability）の定量化 → `deep/puf-metrics/`（`01_prerequisites`側のキューと統合）
- [ ] Rowhammerのようなメモリ物理攻撃 → `deep/rowhammer/`
- [ ] リングオシレータのジッタからエントロピー率を実際に見積もる → `deep/trng-entropy-estimation/`
- [ ] デバッグインタフェース（JTAG/SWD）の無効化手法と、その回避 → `deep/debug-interface-lockdown/`

</details>

## 参考（領域全体）

- Mangard, S., Oswald, E., Popp, T. *Power Analysis Attacks: Revealing the Secrets of Smart Cards*.
