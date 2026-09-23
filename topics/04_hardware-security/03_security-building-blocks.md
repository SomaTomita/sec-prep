# 03. セキュリティ部品（Root of Trust・TPM・RNG・PUF）

> 前: [02 ハードウェア攻撃](./02_hardware-attacks.md) ｜ 次: [04 サイドチャネル](./04_side-channels/README.md) ｜ 層: 基礎(Layer 1)

**この1ページで分かること**

- Root of Trust（信頼の起点）と、起動ソフトウェアを段階ごとに測定・記録する Measured Boot / TPM
- 全ての鍵の土台になる乱数生成器（TRNG＝物理現象から真の乱数を作る回路 / CSPRNG）
- PUF（製造ばらつきをチップの「指紋」にする回路）による「鍵を保存しない」発想

土台がぐらつく家は上をどう補強しても倒れる。[02](./02_hardware-attacks.md) の攻撃に抗するには「これだけは信頼できる」物理的な起点（[01](./01_digital-platform-design.md) の TCB）が要る。

---

## 最小の例: 起動を 2 段だけ記録する

```
PCR₀ = 0
PCR₁ = H(PCR₀ ‖ ブートローダのハッシュ)          ← 1 段目を記録
PCR₂ = H(PCR₁ ‖ OS カーネルのハッシュ)           ← 2 段目を記録
```

どこか 1 段が改ざんされると、その後の PCR がすべて変わる。上書きではなく**足していく**のが要点。以下、この仕組みを支える部品を順に見る。

---

## Root of Trust（信頼の起点）

| RoT の種類 | 役割 |
|---|---|
| RoT for Measurement | システムの状態（起動したソフトウェアのハッシュ等）を測定する |
| RoT for Storage | 鍵や測定結果を安全に保持する |
| RoT for Reporting | 測定結果を外部に証明（証言）する |

工場出荷時に焼き込まれた HW/FW が起点——これより下は検証できないので、**信頼するしかない土台**として設計する。

### Measured Boot（測定起動）とPCR

起動の各段階（ブートローダ→OS カーネル→…）のハッシュを、TPM 内の **PCR（Platform Configuration Register）** に記録していく。

```mermaid
flowchart LR
    ROT["起点 HW/FW（出荷時に固定）"] -->|測定して extend| BL["ブートローダ"]
    BL -->|測定して extend| OS["OS カーネル"]
    OS -->|測定して extend| NEXT["以降のソフトウェア"]
```

更新は上書きでなく**拡張**: `PCR_new = H(PCR_old ‖ 測定値)`。これは[ハッシュチェーン](../02_cryptography/04_hash-and-mac.md)そのもので、途中の値を知らずに辻褄を合わせることはできない（原像計算困難性が改ざん耐性の根拠）。

### TPM（Trusted Platform Module）

TCG が標準化したチップ。鍵の保管・暗号演算・**証明（attestation＝「この PCR 値で起動した」と外部に示す機能）**を提供する。

---

## RNG（乱数生成器）：全ての鍵の出発点

```
TRNG（True/Hardware RNG）: 熱雑音・リングオシレータのジッタ（発振周期の微小な揺らぎ）等、
  物理現象をエントロピー源（予測不能さの供給源）として真の乱数を生成する
PRNG（擬似乱数生成器）: 決定論的アルゴリズムでシード値から乱数列を展開する
  （CSPRNGは暗号用途に十分な統計的性質・予測困難性を持つよう設計されたPRNG）
```

**なぜ重要か**: [Android Bitcoin ウォレット事件](../02_cryptography/03_public-key-crypto/04_digital-signatures.md)は**RNG の壊れ**が根本原因——ECDSA の nonce `k`（署名ごとの使い捨て乱数）が再利用され、署名 2 つから秘密鍵が復元された。アルゴリズムが正しくても乱数の品質が土台。

### 「ランダムに見える」では不十分

**統計テストに通ることは、十分なエントロピーの証明にならない。** 決定論的な PRNG も統計テストは通る——シードを知れば完全に予測できる系列でも、統計的には真の乱数と区別がつかない。

```
統計テスト通過   = 出力に明らかな偏りや周期が無い（必要条件にすぎない）
十分なエントロピー = 攻撃者が次の出力を予測できない（本当に必要なもの）
```

よって評価は出力の検定だけでなく、**エントロピーの出所を物理で説明する**ことを要求する。

### エントロピー源をどう評価するか

| 枠組み | 考え方 |
|---|---|
| **NIST SP 800-90B** | 源に仮定を置かず**出力の統計から min-entropy を推定**。IID（独立同分布）か検定してから推定器を選ぶ |
| **BSI AIS 31** | 源の**確率モデルの提出を要求**。物理（リングオシレータのジッタ等）から理論的に導く |

共通点は **min-entropy**（最も当たりやすい値の確率で決まる最悪ケース）で測ること——攻撃者はそこを狙う。定義は
[`../01_prerequisites/01_math-for-crypto/05_info-theory/01_entropy.md`](../01_prerequisites/01_math-for-crypto/05_info-theory/01_entropy.md) を参照。

### 稼働中の故障をどう検知するか：健全性テスト

エントロピー源はアナログ回路なので**劣化・温度・電圧・外部操作**で品質が落ちうる。出力はランダムに見えたままなので、SP 800-90B は 2 種のテストを**必須**にしている。

| テスト | いつ | 何を検出するか |
|---|---|---|
| 起動時テスト (startup test) | 出力を使う前に一度 | 初期状態の健全性 |
| 連続テスト (continuous test) | 稼働中つねに背景で | 稼働中に生じた劣化・故障 |

連続テストは Repetition Count（同じ値の貼り付き）と Adaptive Proportion（出現比率の偏り）の 2 つ。**TRNG は動作中に自分を監視し続ける部品**である点が他と違う。

---

## PUF（Physically Unclonable Function）

```
アイデア: 製造時に生じる、チップごとに異なる**微小なばらつき**
  （配線遅延・しきい値電圧のばらつき等）を、複製不可能な「指紋」として利用する
```

起源は Pappu（2002, *Science*）の光学 PUF（レーザー散乱パターンが個体ごとに一意）。Gassend（2002）がシリコン上で **Arbiter PUF** を提案し、SRAM PUF・リングオシレータ PUF 等に発展した。

### 使い道

```
デバイス認証: 「このチップは本物か」を、複製できない物理特性で確認する
鍵生成:       秘密鍵を不揮発性メモリに保存せず、PUFの応答から都度導出する
             → 鍵が保存されていないので、02の侵襲的攻撃で読み出す対象がそもそも存在しない
```

「鍵を守る」ではなく「**鍵を保存しない**」——[02](./02_hardware-attacks.md) の侵襲的攻撃（メモリ直読）への根本対策になりうる。

---

## まとめ表

| 部品 | 何を提供するか | 関連する攻撃/脅威 |
|---|---|---|
| Root of Trust / TPM | 起動状態の測定・証明・鍵の安全な保管 | ソフトウェア改ざん |
| RNG（TRNG/CSPRNG） | 予測不能な乱数（鍵・nonceの土台） | RNG不備によるnonce再利用（[04_digital-signatures](../02_cryptography/03_public-key-crypto/04_digital-signatures.md)） |
| PUF | 複製不可能な個体識別・鍵の非保存生成 | 侵襲的なメモリ読み出し（[02](./02_hardware-attacks.md)） |

---

## 演習（解答つき）

1. PCRの更新が「上書き」ではなく「拡張（ハッシュチェーン）」である理由を述べよ。
2. Android Bitcoinウォレット事件が示す教訓を、RNGの役割の観点から一言で述べよ。
3. PUFが「鍵を保存しない」という発想が、なぜ侵襲的攻撃への対策になるか述べよ。

<details><summary>解答</summary>

1. 上書き方式だと最後の測定値だけが残り、途中の改ざんが検出できない。拡張（ハッシュチェーン）
   方式なら、途中のどこか1つの測定値を変えるだけでそれ以降の全てのPCR値が変わってしまうため、
   起動ログ全体の改ざんが検出可能になる。
2. どんなに正しいアルゴリズム（ECDSA）を使っていても、その入力となる乱数生成器が壊れていれば
   秘密鍵は簡単に漏洩する——暗号の安全性は使用する乱数の品質に完全に依存する。
3. 秘密鍵をメモリに保存しないため、攻撃者がマイクロプロービング等でメモリの中身を
   直接読み出しても、そこには読み出すべき鍵そのものが存在しない。鍵はPUFの物理応答から
   その都度動的に導出されるため、「盗み出す対象」自体がなくなる。

</details>

---

## 次への接続

保存を守っても、鍵を**使う瞬間**（計算中）に漏れる情報が残る。それがサイドチャネル。
→ [04 サイドチャネル](./04_side-channels/README.md)

---

## 参考

- Trusted Computing Group (TCG) — TPM 2.0 Library Specification.
- Pappu, R. et al. (2002). *Physical One-Way Functions*. Science.
- Gassend, B. et al. (2002). *Silicon Physical Random Functions*. ACM CCS.
- NIST SP 800-90B — Recommendation for the Entropy Sources Used for Random Bit Generation: https://nvlpubs.nist.gov/nistpubs/SpecialPublications/nist.sp.800-90b.pdf
- BSI AIS 31 — Funktionalitätsklassen und Evaluationsmethodologie für physikalische Zufallszahlengeneratoren（確率モデルの提出を要求する枠組み）
