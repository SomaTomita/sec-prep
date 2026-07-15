# 01. Secure SDLC と SecDevOps

> 対応科目: Security Through the Software Lifecycle ｜ 次: [02 脅威モデリング](./02_threat-modeling.md) ｜ 層: 基礎(Layer 1)

**この1ページで分かること**

- セキュリティを開発ライフサイクル全体に埋め込む理由（shift-left）と、NIST SSDF の4つの実践グループ
- 運用フェーズの1ステップの不備が全体を崩した実例（Equifax, 2017年）
- CI/CD パイプラインに SAST・SCA・DAST を組み込む DevSecOps の形

## 一言で

セキュリティを「最後にペネトレーションテストで見つける」のではなく、要件定義から
運用・廃棄までの**ライフサイクル全体**に埋め込む考え方。「動くコードを書いてから
セキュリティを足す」のではコストが指数関数的に増える——設計段階の欠陥を実装後に
直すのは、設計段階で直すより何十倍も高くつく（いわゆる shift-left の動機）。

---

## 押さえる概念

### NIST SSDF（SP 800-218）の4つの実践グループ

Microsoft SDL（2002年に社内プロセスとして採用）を業界横断で一般化した米国政府標準。
「いつ・何をするか」ではなく「何を達成すべきか」を定義する。

| 実践グループ | 内容 | 具体例 |
|---|---|---|
| PO (Prepare the Organization) | 組織・人・ツールの準備 | セキュリティ教育、コーディング規約の整備 |
| PS (Protect the Software) | ソフトウェア自体の完全性を守る | ソースコード管理のアクセス制御、ビルドの署名 |
| PW (Produce Well-Secured Software) | 設計・実装・テストで欠陥を作り込まない | 脅威モデリング（[02](./02_threat-modeling.md)）、SAST/ファジング（[04](./04_security-testing.md)）、SBOM（ソフトウェア部品表＝構成するコンポーネント（依存ライブラリ含む）とバージョンの一覧）による依存関係の追跡 |
| RV (Respond to Vulnerabilities) | 出荷後に見つかった脆弱性への対応 | 脆弱性開示窓口、パッチ配布、根本原因分析 |

### なぜ「ライフサイクル全体」が要るのか——Equifaxの事例（2017年）

RVを怠るとPO/PS/PWがどれだけ良くても崩れる、という教訓を示す実例。

```
2017-03-07: Apache Struts の脆弱性 CVE-2017-5638 が公開され、パッチも同時公開
2017-03-09: Equifax社内でパッチ適用の指示が出るが、担当者が実施しなかった
2017-03-15: 脆弱性スキャンを実施するが、この脆弱性を検出できなかった
2017-05〜07: 攻撃者が同じ脆弱性を悪用してデータベースに侵入、情報を持ち出す
2017-07-29: 「不審な通信」を検知して初めてパッチを適用（攻撃開始から2ヶ月以上後）
結果: 米国消費者1億4300万人分の氏名・社会保障番号・生年月日等が流出
```

**設計・実装（PW）が正しくても、パッチ管理という運用フェーズ（RV）の1ステップが
機能しなければ、既知で・パッチ済みの脆弱性のまま2ヶ月以上放置される**。
Secure SDLC が「開発フェーズだけ」ではなく「廃棄まで」を範囲に含む理由がここにある。

### SecDevOps（DevSecOps）：CI/CDパイプラインへの組み込み

```mermaid
flowchart LR
    C["コミット"] --> B["ビルド"] --> S1["SAST<br>ソースコードを実行せず解析"] --> S2["SCA<br>依存ライブラリを既知脆弱性/SBOMと照合"]
    S2 --> T["テスト"] --> S3["DAST<br>動作中アプリへの疑似攻撃"] --> D["デプロイ"] --> M["ランタイム監視"]
```

各ステージにゲート（一定の重大度以上の脆弱性が見つかったらパイプラインを止める）を
置くことで、「セキュリティチームが最後にレビューする」直列プロセスから、
「開発者が書いた瞬間にフィードバックを得る」並列プロセスへ変える。これが
「Dev」「Sec」「Ops」を分けない DevSecOps の核心——セキュリティを専門チームの
ゲートではなく、開発フロー自体の一部にする。SAST/DAST/ファジングの中身は
[04 セキュリティテスト](./04_security-testing.md)で詳述する。

---

## なぜ重要か / コースでの位置づけ

"Security Through the Software Lifecycle" はこのファイルのテーマそのものが
科目名になっている。「設計時にどんな脅威があるか」を体系的に洗い出す方法論
（[02 脅威モデリング](./02_threat-modeling.md)）と、「作ったコードに欠陥がないか」を
検証する方法論（[04 セキュリティテスト](./04_security-testing.md)）は、いずれも
本ファイルの PW（Produce Well-Secured Software）を具体化したもの。

---

## 演習（解答つき）

1. Equifaxの事例で、崩れたのはSSDFのどの実践グループ（PO/PS/PW/RV）か、理由も述べよ。
2. 「セキュリティは最後にペネトレーションテストで確認すればよい」という考え方が
   shift-left の発想と対立する理由を一言で述べよ。
3. CI/CDパイプラインにSASTとSCAの両方を組み込む意味を、それぞれが検出する対象の違いから述べよ。

<details><summary>解答</summary>

1. **RV（Respond to Vulnerabilities）**。脆弱性自体は3月7日に公開・パッチ済みだったため
   PW（設計・実装段階の欠陥作り込み防止）の問題ではなく、パッチ適用というRVのプロセスが
   機能しなかったことが2ヶ月以上の侵入を許した直接原因。
2. shift-left は「欠陥は発見が遅いほど修正コストが指数関数的に増える」という前提に立ち、
   要件・設計段階から検証を始める。ペネトレーションテストは開発の最終盤に行うため、
   見つかった欠陥の修正コストが最も高い段階でしか検出できない。
3. SASTはソースコード自体の欠陥（バッファオーバーフローになりうる書き方等、自社で書いた
   コードの問題）を検出するのに対し、SCAは依存する外部ライブラリに**既知の**CVEが
   含まれていないかを検出する。Equifaxの事例はまさに後者（外部ライブラリの既知脆弱性）
   の管理が漏れたケースで、SCA/SBOMがあれば影響範囲の特定が迅速化できた。

</details>

---

## 次への接続

PW（Produce Well-Secured Software）の最初の一歩は「設計段階でどんな脅威がありうるか」を
体系的に洗い出すこと。STRIDE・attack tree・LINDDUNによる脅威モデリングを見る。
→ [02 脅威モデリング](./02_threat-modeling.md)

---

## つまずき / 深掘り候補

- [ ] SBOM（SPDX/CycloneDX）の標準フォーマットの違い → `deep/sbom-formats/`
- [ ] Microsoft SDLの詳細フェーズ（要件→設計→実装→検証→リリース→対応）と各フェーズの成果物

---

## 参考

- NIST SP 800-218, *Secure Software Development Framework (SSDF) Version 1.1*, 2022. https://csrc.nist.gov/pubs/sp/800/218/final
- Black Duck Blog, *Equifax, Apache Struts, and CVE-2017-5638 Vulnerability*: https://www.blackduck.com/blog/equifax-apache-struts-vulnerability-cve-2017-5638.html
- CSO Online, *Equifax data breach FAQ*: https://www.csoonline.com/article/567833/equifax-data-breach-faq-what-happened-who-was-affected-what-was-the-impact.html
