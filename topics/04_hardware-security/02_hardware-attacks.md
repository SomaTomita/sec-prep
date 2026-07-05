# 02. ハードウェア攻撃と攻撃者能力

> 対応科目: H0E85A Hardware Security ｜ 前: [01 プラットフォーム設計](./01_digital-platform-design.md) ｜ 次: [03 セキュリティ部品](./03_security-building-blocks.md) ｜ 層: 基礎(Layer 1)

暗号アルゴリズムが数学的に安全でも、それを動かす**物理的なチップ**に触れられれば
話が変わる。攻撃者が「どこまで物理的にアクセスできるか」で防御の考え方が大きく変わるため、
まず攻撃者能力を分類し、その上で代表的な攻撃例（フォールト注入、Spectre/Meltdown）を見る。

---

## 攻撃者能力の分類（Skorobogatov & Anderson）

```
非侵襲的 (non-invasive):  チップを分解せず、外部から観測・操作するだけ
  例: 電力波形の測定、タイミング測定（04で詳述）、電圧・クロックの外部からの操作

半侵襲的 (semi-invasive): チップのパッケージを開けて表面を露出させるが、
  内部配線に電気的接触はしない
  例: レーザーやEMパルスを表面から照射してフォールトを注入する

侵襲的 (invasive):       内部配線に直接電気的接触し、信号を読み書きする
  例: マイクロプロービング、集束イオンビーム(FIB)による配線の切断・再配線
  → 高価な機材と高度な技能・長い時間が必要だが、原理上どんな対策も突破しうる
```

コストと難易度は非侵襲的→半侵襲的→侵襲的の順に上がる。多くの実用的な攻撃は
**安価で再現しやすい非侵襲的・半侵襲的**な手法に集中する。

---

## フォールト注入攻撃（Fault Injection）

```
アイデア: 電圧グリッチ・クロックグリッチ・レーザー照射・電磁パルス等で、
  計算の途中に意図的に「計算ミス」を起こさせ、その誤った出力から秘密鍵を逆算する
```

### 実例：RSA-CRT へのフォールト攻撃（Boneh, DeMillo, Lipton, 1997年）

RSA-CRT（[`../02_cryptography/03_public-key-crypto/01_rsa/`](../02_cryptography/03_public-key-crypto/01_rsa/README.md)
で見た高速化手法）は `mod p` と `mod q` を別々に計算してから CRT で合成する。
**片方だけ**にフォールトを注入すると、秘密鍵の素因数がその場で求まってしまう。

```
正しい署名: s ≡ m^d (mod n)
mod p 側にだけフォールトを注入した誤った署名: s'（mod q 側は正しいまま）

このとき s ≡ s' (mod q) だが s ≢ s' (mod p) となるため
gcd(s - s', n) = q が成り立つ！
```

### 数値で確認（[01_rsa](../02_cryptography/03_public-key-crypto/01_rsa/01_key-generation.md) のトイ鍵を流用）

```
n=55, p=5, q=11, e=3, d=7, m=2
正しい署名: s = 18   （検算: 18³ mod 55 = 2 ✓）
mod p 側にフォールトを注入した誤った署名: s' = 29

gcd(s - s', n) = gcd(18-29, 55) = gcd(11, 55) = 11 = q   ← qがそのまま求まった！
```

**正しい署名1つと、フォールトを注入した署名1つ**だけで `n` の素因数分解が完了し、
秘密鍵が完全に漏れる。RSA自体の数学（[`03_correctness-proof.md`](../02_cryptography/03_public-key-crypto/01_rsa/03_correctness-proof.md)）
は正しいままなのに、**実行環境への物理的な妨害**だけで破られる典型例。

**対策**: 署名後に `s^e mod n =? m` を検算してから出力する（不一致なら破棄）、
冗長計算で結果を照合する、等。

---

## Spectre / Meltdown（2018年1月公開）

[`../01_prerequisites/03_hardware-digital-logic/03_hdl-and-architecture/02_pipelining-and-hazards.md`](../01_prerequisites/03_hardware-digital-logic/03_hdl-and-architecture/02_pipelining-and-hazards.md)
で見た投機実行の性質を悪用する、ソフトウェアだけで実行できる非侵襲的攻撃。

```
Meltdown（CVE-2017-5754）: アウト・オブ・オーダー実行を悪用し、
  権限チェックが完了する前の一瞬に禁止領域のメモリを投機的に読み出す
  → 主にIntel CPUに影響。OS/ユーザー間の境界が崩れる

Spectre（CVE-2017-5753, CVE-2017-5715）: 分岐予測器を「毒する」ことで、
  被害者プロセス自身に本来アクセスできないはずの領域を投機的に読ませる
  → ほぼ全ての現代的CPU（Intel/AMD/ARM）に影響。プロセス間の分離が崩れる
```

どちらも「投機実行された命令の結果はレジスタ・メモリには残らない（アーキテクチャ上は
なかったことになる）が、**触れたキャッシュの状態だけは残る**」という性質
（[`../01_prerequisites/03_hardware-digital-logic/03_hdl-and-architecture/03_memory-hierarchy-and-codesign.md`](../01_prerequisites/03_hardware-digital-logic/03_hdl-and-architecture/03_memory-hierarchy-and-codesign.md)
の Flush+Reload）を悪用して、投機的に読んだ値をキャッシュタイミング経由で復元する。
攻撃の最終段の「キャッシュタイミングでの読み出し」は次の[04](./04_side-channels.md)で扱う。

---

## この2種類の攻撃の対比

| | フォールト注入 | Spectre/Meltdown |
|---|---|---|
| 攻撃者の行為 | 計算を**能動的に**妨害する | 実行を**受動的に**観測する |
| 必要な物理アクセス | 半侵襲的（電圧/レーザー等） | 非侵襲的（ソフトウェアのみ） |
| 崩れる保証 | 正しい計算結果 | プロセス/権限の分離 |

---

## 演習（解答つき）

1. RSA-CRTフォールト攻撃で、なぜ `mod q` 側ではなく `mod p` 側だけにフォールトを
   注入すると `q` が求まるのか一言で述べよ。
2. Meltdown と Spectre の主な違いを一言で述べよ。
3. 半侵襲的攻撃が「安価で再現しやすい」とされる理由を非侵襲的・侵襲的と対比して述べよ。

<details><summary>解答</summary>

1. フォールトが `mod p` 側の計算だけを乱すため、`s` と `s'` は `mod q` では一致するが
   `mod p` では一致しない。差 `s-s'` は `q` の倍数だが `p` の倍数ではなくなるため、
   `gcd(s-s', n)` を取ると `p` は約分されず `q` だけが残る。
2. Meltdown はアウト・オブ・オーダー実行を悪用してOS/ユーザー間の権限境界を崩す
   （主にIntel）。Spectre は分岐予測器を毒してプロセス間の分離を崩す
   （Intel/AMD/ARMほぼ全て）。
3. 非侵襲的攻撃よりチップ内部の状態に近づけるため精度が高く効果的だが、
   侵襲的攻撃のような内部配線への直接接触は必要ないため、機材コストと専門性の要求が
   侵襲的攻撃よりずっと低く、再現・量産がしやすい。

</details>

---

## 次への接続

こうした攻撃から秘密鍵をどう守るか。物理的に信頼できる基盤を作る部品
（TPM・root of trust・PUF・RNG）を見る。
→ [03 セキュリティ部品](./03_security-building-blocks.md)

---

## 参考

- Skorobogatov, S. (2005). *Semi-invasive Attacks – A New Approach to Hardware Security Analysis*. PhD Thesis, University of Cambridge.
- Boneh, D., DeMillo, R., Lipton, R. (1997). *On the Importance of Checking Cryptographic Protocols for Faults*. EUROCRYPT.
- Kocher, P. et al. (2018). *Spectre Attacks: Exploiting Speculative Execution*.
- Lipp, M. et al. (2018). *Meltdown: Reading Kernel Memory from User Space*. USENIX Security.
