# 03. セキュリティ部品（Root of Trust・TPM・RNG・PUF）

> 前: [02 ハードウェア攻撃](./02_hardware-attacks.md) ｜ 次: [04 サイドチャネル](./04_side-channels.md) ｜ 層: 基礎(Layer 1)

[02](./02_hardware-attacks.md) で見た攻撃に対抗するため、システムのどこかに
**「これだけは信頼できる」という物理的な起点**を作る必要がある
（[01](./01_digital-platform-design.md) の TCB の考え方）。その起点になる部品を見る。

---

## Root of Trust（信頼の起点）

```
RoT for Measurement:  システムの状態（起動したソフトウェアのハッシュ等）を測定する
RoT for Storage:      鍵や測定結果を安全に保持する
RoT for Reporting:    測定結果を外部に証明（証言）する
```

工場出荷時に焼き込まれたハードウェア／ファームウェアが起点になる——これより下の層は
検証しようがないため、**信頼するしかない土台**として設計する。

### Measured Boot（測定起動）とPCR

起動プロセスの各段階（ブートローダ→OSカーネル→…）のハッシュ値を、TPM内の
**PCR（Platform Configuration Register）**という特殊なレジスタに記録していく。

```
PCR の更新は「上書き」ではなく「拡張（extend）」:
  PCR_new = H(PCR_old ‖ 新しい測定値)
```

これは [`../02_cryptography/04_hash-and-mac.md`](../02_cryptography/04_hash-and-mac.md)
で見た**ハッシュチェーン**そのもの——一度記録した測定値は、途中の値を知らない限り
改ざんしても後から辻褄を合わせられない（ハッシュの原像計算困難性がそのまま
「起動ログの改ざん耐性」の根拠になっている）。

### TPM（Trusted Platform Module）

TCG（Trusted Computing Group）が標準化したチップ。鍵の安全な保管・暗号演算
（署名・ハッシュ等）・**証明（attestation）**——「このマシンは確かにこの状態
（PCRの値）で起動した」ことを外部に証明する機能——を提供する。

---

## RNG（乱数生成器）：全ての鍵の出発点

```
TRNG（True/Hardware RNG）: 熱雑音・リングオシレータのジッタ等、物理現象を
  エントロピー源として真の乱数を生成する
PRNG（擬似乱数生成器）: 決定論的アルゴリズムでシード値から乱数列を展開する
  （CSPRNGは暗号用途に十分な統計的性質・予測困難性を持つよう設計されたPRNG）
```

エントロピー源の品質は NIST SP 800-90B 等で健全性検証される。

**なぜ重要か**: [`../02_cryptography/03_public-key-crypto/04_digital-signatures.md`](../02_cryptography/03_public-key-crypto/04_digital-signatures.md)
で見た Android の Bitcoin ウォレット事件は、**この RNG が壊れていた**ことが根本原因
だった——ECDSA の nonce `k` を生成する乱数源の初期化不備で `k` が再利用され、
署名2つから秘密鍵が丸ごと復元された。アルゴリズムがどれだけ正しくても、
その入力である乱数の品質が全ての土台になる。

---

## PUF（Physically Unclonable Function）

```
アイデア: 製造時に生じる、チップごとに異なる**微小なばらつき**
  （配線遅延・しきい値電圧のばらつき等）を、複製不可能な「指紋」として利用する
```

- **Pappu（2001年、MITの博士論文/2002年 *Science* 誌）**: レーザーを物体に当てたときの
  散乱パターン（スペックルパターン）が、製造ばらつきにより個体ごとに一意になることを
  示した光学PUFが起源。
- **Gassend（2002年）**: シリコン上で同様の効果を実現する **Arbiter PUF** を提案、
  以降 SRAM PUF・リングオシレータPUF等、様々な方式に発展した。

### 使い道

```
デバイス認証: 「このチップは本物か」を、複製できない物理特性で確認する
鍵生成:       秘密鍵を不揮発性メモリに保存せず、PUFの応答から都度導出する
             → 鍵が保存されていないので、02の侵襲的攻撃で読み出す対象がそもそも存在しない
```

PUFは「鍵を守る」のではなく「**鍵を保存しない**」という発想の転換——
[02](./02_hardware-attacks.md) の侵襲的攻撃（メモリの直接読み出し）に対する
根本的な対策になりうる。

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

Root of Trust や PUF で鍵の保存自体は守れても、鍵を**使う瞬間**（計算中）に
漏れる情報が残る。それがサイドチャネル。
→ [04 サイドチャネル](./04_side-channels.md)

---

## 参考

- Trusted Computing Group (TCG) — TPM 2.0 Library Specification.
- Pappu, R. et al. (2002). *Physical One-Way Functions*. Science.
- Gassend, B. et al. (2002). *Silicon Physical Random Functions*. ACM CCS.
- NIST SP 800-90B — Recommendation for the Entropy Sources Used for Random Bit Generation.
