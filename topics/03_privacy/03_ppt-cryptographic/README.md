# 暗号によるプライバシー技術（Cryptographic PETs）

> 対応科目: Privacy Enhancing Technologies ｜ 層: 基礎(Layer 1)
> 親: [../index.md](../index.md)

## 一言で

[`../02_anonymization-and-dp.md`](../02_anonymization-and-dp.md) は
「**公開するデータをどう加工するか**」だった。ここでは逆に、
**問い合わせ・計算・主張そのものを暗号的に隠す**道具を扱う。

データを渡さずに答えを得る、秘密を明かさずに知っていることを示す——
一見不可能に見えることが、暗号を使えば実現できる。

---

## 概念ファイル（番号順に読む）

| # | ファイル | 内容 | 備考 |
|---|---|---|---|
| 01 | [01_pir-and-ot.md](./01_pir-and-ot.md) | PIR（どの項目を見たか隠す）・Oblivious Transfer（どれを選んだか隠す） | OT が MPC の基礎部品になる |
| 02 | [02_zero-knowledge-proofs.md](./02_zero-knowledge-proofs.md) | ゼロ知識証明・Σプロトコル・Fiat–Shamir 変換・算術回路と R1CS | 署名方式との意外な繋がり |
| 03 | [03_mpc-and-fhe.md](./03_mpc-and-fhe.md) | MPC と FHE の使い分け・PSI の実例・入力を隠しても出力から漏れる問題 | 3つの層を分けて考える |

---

## 3つの層を分けて考える

このフォルダを読むときの見取り図。**プライバシー保護は1つの技術では完成しない。**

| 層 | 何をするか | 本フォルダでの担当 |
|---|---|---|
| ① 入力を隠す | 計算の過程で入力が見えないようにする | [01](./01_pir-and-ot.md)・[03](./03_mpc-and-fhe.md)（PIR・OT・MPC・FHE） |
| ② 出力からの漏れを抑える | 結果が入力について語りすぎないようにする | [`../02_anonymization-and-dp.md`](../02_anonymization-and-dp.md)（差分プライバシー） |
| ③ 正しさを保証する | 相手が正直に計算したことを検証する | [02](./02_zero-knowledge-proofs.md)（ゼロ知識証明） |

**①だけを実装して「プライバシーを守った」と考えるのが典型的な誤り**である。
詳細は [03](./03_mpc-and-fhe.md) の「入力を隠しても、出力からは漏れる」で扱う。

---

## なぜ重要か / コースでの位置づけ

- **法的義務と技術の接点**になる。GDPR のデータ最小化を「集めない」ではなく
  「集めても見えない」形で満たす手段を与える
  （[`../06_law-and-dpia.md`](../06_law-and-dpia.md)）
- **選択的開示**（年齢だけ証明する等）はデジタルID の設計に直結する
  （[`../../06_systems-security/07_pki-and-identity.md`](../../06_systems-security/07_pki-and-identity.md)）
- ゼロ知識証明は暗号通貨のスケーリングと機密取引の中核技術になっている

---

## このフォルダで「本体」を置かないもの（DRY）

- **MPC・FHE・Yao のガーブルド回路・Shamir 秘密分散の仕組み自体** →
  [`../../02_cryptography/06_advanced-topics-map.md`](../../02_cryptography/06_advanced-topics-map.md)
  （本フォルダはプライバシー用途の視点と使い分けのみ）
- **差分プライバシー** → [`../02_anonymization-and-dp.md`](../02_anonymization-and-dp.md)
- **署名方式の詳細（Schnorr 署名・EdDSA）** →
  [`../../02_cryptography/03_public-key-crypto/04_digital-signatures.md`](../../02_cryptography/03_public-key-crypto/04_digital-signatures.md)
- **FHE の性能問題（ノイズとブートストラップ）** →
  [`../../04_hardware-security/01_digital-platform-design.md`](../../04_hardware-security/01_digital-platform-design.md)

---

## つまずき / 深掘り候補（Layer 2）

- [ ] 単一サーバ PIR の構成（FHE を使った具体的なプロトコル） → `deep/single-server-pir/`
- [ ] ゼロ知識性のシミュレータによる形式的定義 → `deep/zk-simulator-definition/`
- [ ] 算術回路から R1CS への変換を小さな例で手で追う → `deep/r1cs-by-hand/`

---

## 参考

- Chor, B., Goldreich, O., Kushilevitz, E., Sudan, M. (1995). *Private Information Retrieval*. FOCS.
- Goldwasser, S., Micali, S., Rackoff, C. (1985). *The Knowledge Complexity of Interactive Proof Systems*. STOC.
- NIST — Privacy-Enhancing Cryptography: https://csrc.nist.gov/Projects/pec
- 本フォルダの構成は COSIC Course 2026 の2セッション（Emad Heydari Beni "Zero-knowledge Proofs and Applications" / Cyprien Delpech de Saint Guilhem "Computing on Encrypted data"、2026年6月）の整理に基づく。
