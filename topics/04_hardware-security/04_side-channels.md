# 04. サイドチャネル攻撃と対策

> 前: [03 セキュリティ部品](./03_security-building-blocks.md) ｜ 層: 基礎(Layer 1)

[`../02_cryptography/06_advanced-topics-map.md`](../02_cryptography/06_advanced-topics-map.md)
でタイミング攻撃（Kocher, 1996年）・DPA（Kocher, Jaffe, Jun, 1999年）を「暗号側の入口」
として概観した。ここが約束していた**本体**——物理現象の中身と、実際の対策を見る。

---

## 電力解析：SPAからCPAへ

[`../01_prerequisites/03_hardware-digital-logic/01_cmos-logic.md`](../01_prerequisites/03_hardware-digital-logic/01_cmos-logic.md)
の `P_dynamic ≈ α · C_L · V_DD² · f` を思い出す——`α`（ビット遷移の活性化率）が
**処理しているデータに依存**するため、消費電力の波形そのものが情報チャネルになる。

```
SPA（単純電力解析）: 電力波形を目視して、命令の違いを直接読み取る
  例: RSAの2乗繰り返し法（../02_cryptography/03_public-key-crypto/01_rsa/02_encryption-decryption.md）で
      「2乗のみ」と「2乗+乗算」の波形パターンが違って見えれば、指数（秘密鍵）のビット列が
      波形から直接読める

DPA（差分電力解析）: 波形1本では読み取れない微小な差を、大量の波形と統計処理で暴く
  1. 鍵の一部（例: 1バイト）について全候補を仮定する
  2. 各仮定のもとで「ある中間値のビットが0か1か」で波形群を2グループに分ける
  3. 2グループの平均波形の差を計算する
  4. 正しい鍵の仮定のときだけ、その中間値を計算する瞬間にはっきりした差（スパイク）が現れる

CPA（相関電力解析、Brier, Clavier, Olivier, 2004年）: DPAの単純な差の代わりに、
  「消費電力はハミング重み／ハミング距離（ビット遷移数）に比例する」という
  漏洩モデルを仮定し、予測される消費電力と実測波形の**相関係数**を計算する
  → DPAより統計的に効率がよく、より少ない波形数で鍵を復元できる
```

**ハミング重み/距離モデル**が `α`（ビット遷移の割合）を近似したもの、という点で
上の物理式と直結している。

---

## キャッシュサイドチャネル

[`../01_prerequisites/03_hardware-digital-logic/03_hdl-and-architecture/03_memory-hierarchy-and-codesign.md`](../01_prerequisites/03_hardware-digital-logic/03_hdl-and-architecture/03_memory-hierarchy-and-codesign.md)
で見た「L1ヒット(~1ns) と DRAMミス(~100ns) の2桁差」を悪用する非侵襲的攻撃。

```
Prime+Probe（Osvik, Shamir, Tromer, 2006年）:
  1. 攻撃者が自分のデータでキャッシュセットを埋め尽くす（Prime）
  2. 被害者の処理を待つ
  3. 自分のデータに再アクセスし、時間を測る（Probe）
  → 遅ければ、被害者が同じセットにアクセスして自分のデータを追い出したと分かる

Flush+Reload（Yarom, Falkner, 2014年）:
  1. 対象アドレス（共有メモリ上）をキャッシュから明示的に追い出す（Flush）
  2. 被害者の処理を待つ
  3. 同じアドレスに再アクセスし、時間を測る（Reload）
  → 速ければ、被害者がその間にそのアドレスに触れてキャッシュに載せた証拠
```

[02](./02_hardware-attacks.md) の Meltdown/Spectre は、投機実行で読んだ**値そのもの**を
直接は得られない代わりに、その値に依存したアドレスへの参照を作り、Flush+Reload で
「そのアドレスがキャッシュに載ったか」を観測することで、間接的に値を1ビットずつ復元する。

---

## 対策1：定数時間実装

```
原則: 秘密データの値によって「実行時間・アクセスするメモリアドレス」が変わってはいけない
```

- **秘密依存の分岐を避ける**: `if (secret_bit) { ... } else { ... }` のような分岐は、
  分岐予測・実行時間の違いとして漏れうる。分岐なしの算術演算で書き換える。
- **秘密依存のテーブル参照を避ける**: `table[secret_byte]` はキャッシュサイドチャネル
  （どのキャッシュラインが読まれたか）で `secret_byte` の一部を漏らす。

これは
[`../01_prerequisites/01_math-for-crypto/01_modular-arithmetic/04_gcd-euclidean.md`](../01_prerequisites/01_math-for-crypto/01_modular-arithmetic/04_gcd-euclidean.md)
の深掘りキューに挙がっていた「定数時間GCD」がまさに解決しようとしていた問題——
通常のユークリッド互除法は入力によって反復回数や分岐が変わるため、秘密値
（RSAの鍵生成、ECDSAの逆元計算等）に使うとタイミングから情報が漏れる。
二進GCD（Stein のアルゴリズム）やBernstein–Yangのsafegcdのような、**入力に関わらず
常に同じ回数・同じ分岐パターンで動く**アルゴリズムに置き換えるのが対策。

---

## 対策2：マスキング

```
原則: 秘密値 x を、複数のランダムな断片（シェア）に分割してから計算する
  x = x1 ⊕ x2 ⊕ ... ⊕ x_{d+1}（Booleanマスキングの場合）
```

各シェア単独の値はランダムに見えるため、電力波形が**どのシェアとも相関しない**ように
できる（攻撃者が全シェアを同時に復元しない限り、DPA/CPAの相関が消える）。

**[`../03_privacy/03_ppt-cryptographic.md`](../03_privacy/03_ppt-cryptographic.md)
で見た Shamir の秘密分散と発想は同じ**——秘密を複数の断片に分けることで、
断片単体からは元の値が分からないようにする。MPCでは「複数の当事者が協調計算するため」に
使われたのに対し、マスキングでは**同じチップの中で「攻撃者に電力波形を見られても
安全にするため」**に使われる。目的は違っても数学的な道具は同じ。

---

## まとめ表

| 攻撃 | 観測対象 | 悪用する物理現象 | 対策 |
|---|---|---|---|
| SPA/DPA/CPA | 消費電力波形 | `P_dynamic`のデータ依存性 | マスキング、定数時間実装 |
| タイミング攻撃 | 実行時間 | 分岐・アルゴリズムの反復回数 | 定数時間実装 |
| Prime+Probe / Flush+Reload | キャッシュアクセス時間 | メモリ階層のレイテンシ差 | 定数時間メモリアクセス、キャッシュ分割 |

---

## 演習（解答つき）

1. CPAがDPAより効率的とされる理由を一言で述べよ。
2. Flush+Reload攻撃が成立するために必要な前提条件を一言で述べよ。
3. マスキングとMPC（秘密分散）が「同じ道具を違う目的で使っている」と言える理由を述べよ。

<details><summary>解答</summary>

1. DPAは単純な平均の差を見るだけだが、CPAは「消費電力はハミング重み/距離に比例する」
   という具体的な漏洩モデルと実測値の相関係数を計算するため、統計的な検出力が高く、
   より少ない波形数で鍵を特定できる。
2. 攻撃者と被害者が**同じ物理メモリ（共有メモリページ）にアクセスできる**こと
   （共有ライブラリ、クラウドの同居インスタンス等）。これがないとキャッシュラインを
   共有できず、Flush+Reloadが成立しない。
3. どちらも「秘密の値を複数のランダムな断片に分割し、単体では元の値が分からないようにする」
   という同じ数学的構造（秘密分散）を使っている。MPCは複数の当事者間で協調計算するために、
   マスキングは同一チップ内で物理的な観測（電力等）から秘密を守るために、それぞれ
   目的だけが異なる形で応用している。

</details>

---

## 暗号での出口

これで `04_hardware-security/` の基礎パート（設計・攻撃者能力・信頼の起点・
サイドチャネル）が一通り揃った。Spectre/Meltdownへの**ソフトウェア側**の緩和策
（Retpoline・Speculative Load Hardening・KPTI等）は
[`../05_software-security/03_security-patterns.md`](../05_software-security/03_security-patterns.md)
で扱う。

---

## 参考

- Kocher, P., Jaffe, J., Jun, B. (1999). *Differential Power Analysis*. CRYPTO.
- Brier, E., Clavier, C., Olivier, F. (2004). *Correlation Power Analysis with a Leakage Model*. CHES.
- Osvik, D., Shamir, A., Tromer, E. (2006). *Cache Attacks and Countermeasures: the Case of AES*.
- Yarom, Y., Falkner, K. (2014). *FLUSH+RELOAD: A High Resolution, Low Noise, L3 Cache Side-Channel Attack*. USENIX Security.
