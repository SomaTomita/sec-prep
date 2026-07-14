# プライバシー — 領域地図

> 層: 地図 (Layer 0)

「個人と関係性（誰が誰と何をしたか）」を守る領域。
[`../02_cryptography/`](../02_cryptography/index.md) の道具（MPC・FHE等）を応用しつつ、
匿名化の数理・匿名通信の設計・Web上の実際の攻防・法制度までを一気通貫で扱う。

---

## 進捗チェックリスト

- [x] `01_privacy-concepts.md` — 匿名性・非連結性・非検知性・非観測性・仮名性(Pfitzmann-Hansen)・PII
- [x] `02_anonymization-and-dp.md` — k-匿名化・l-多様性・t-近接性・差分プライバシー(ε, ラプラスメカニズム)
- [x] `03_ppt-cryptographic.md` — PIR・Oblivious Transfer・MPC/FHEのプライバシー応用(PSI等)
- [x] `04_anonymous-comms.md` — Mixネットワーク(Chaum)・オニオンルーティング・Tor・トラフィック相関攻撃
- [x] `05_web-privacy-tracking.md` — Cookie・スーパークッキー・ブラウザフィンガープリンティング・DNTの失敗
- [x] `06_law-and-dpia.md` — GDPR概観(7原則・適法根拠・データ主体の権利)・DPIA

---

## 科目対応マップ

| ファイル | 暗号/他領域との接続 |
|---|---|
| 01 概念 | — |
| 02 匿名化・DP | — |
| 03 暗号的PET | `02_cryptography/06`のMPC/FHEを応用 |
| 04 匿名通信 | `02_cryptography`のECDH・AES-CTRを利用 |
| 05 Webトラッキング | — |
| 06 GDPR・DPIA | [`../07_legal/`](../07_legal/index.md)・`05_software-security`(LINDDUN)へ接続 |

---

## このドメインで「本体」を置かないもの（DRY）

- **MPC・FHE・Yao/Shamirの仕組み自体** → [`../02_cryptography/06_advanced-topics-map.md`](../02_cryptography/06_advanced-topics-map.md)（本領域はプライバシー応用のみ）
- **STRIDE/LINDDUN脅威モデリングの方法論** → [`../05_software-security/02_threat-modeling.md`](../05_software-security/02_threat-modeling.md)
- **GDPR以外の法務詳細（NIS2・Cybersecurity Act・ePrivacy指令・国際データ移転・サイバー犯罪・知財等）** → [`../07_legal/`](../07_legal/index.md)

---

## 深掘りキュー（Layer 2 候補）

- [ ] 匿名性の定量化（エントロピーベースの匿名性尺度、Serjantov-Danezis） → `deep/anonymity-metrics/`
- [ ] 単一サーバPIRの構成（FHEを使った具体的なプロトコル） → `deep/single-server-pir/`
- [ ] Torの隠しサービス（rendezvous point）の仕組み → `deep/tor-hidden-services/`
- [x] LINDDUN脅威モデリングの7カテゴリ詳細 → [`../05_software-security/02_threat-modeling.md`](../05_software-security/02_threat-modeling.md)

---

## 参考（領域全体）

- GDPR 全文: https://gdpr-info.eu/
