# 06. PRG から PRF(GGM)

> 親: [README](./README.md) ｜ 前: [05. AES](./05_aes.md) ｜ 次: [05. ブロック暗号の利用モード](../05_block-cipher-modes/README.md) ｜ 出典: Crypto I ビデオ1 (5:30:47–5:42:20)

01 で「PRF → PRG」を見た。ここでは逆方向「PRG → PRF」を GGM 構成で示す。Luby–Rackoff と合わせれば、PRG だけからブロック暗号 (PRP) まで作れる。

**この1ページで分かること**

- 倍長 PRG の左右半分を入力ビットで選べば 1 bit 入力の PRF
- GGM: 入力ビットで二分木を辿る。`G` が安全な PRG なら `F` は安全な PRF
- 評価に `G` を `n` 回使うので実用外。「PRG があれば PRF がある」存在証明として重要

```mermaid
flowchart LR
  PRG["安全な PRG"] -->|"GGM（本ファイル）"| PRF["安全な PRF"] -->|"Luby–Rackoff 3 ラウンド Feistel（02）"| PRP["安全な PRP = ブロック暗号"]
```

---

## 倍長 PRG から 1 bit PRF

出力長を 2 倍にする PRG `G: K → K^2`、`G(k) = (G_0(k), G_1(k))`（左右の半分）。入力 1 bit で左右を選ぶ:

```
F(k, x) = G_x(k)      （x=0 なら左半分、x=1 なら右半分）
```

4 倍長 PRG なら 2 bit 入力の PRF…と拡張できる。安全性は**ハイブリッド論法**（各レベルの PRG 出力を順に真の乱数へ置き換えても識別不能、を積み上げる）。

---

## GGM 構成

Goldreich–Goldwasser–Micali は `n` bit 入力へ一般化する。鍵 `k` を根とし、入力 `x` の各ビットで **左の子 `G_0` / 右の子 `G_1`** を辿る。辿り着いた葉が出力。

```
x = 1 0 1  （各ビットで 0→左 / 1→右 の子へ）

              k                    ← 根
             / \
          G_0   G_1                G(k) = (G_0(k), G_1(k))
                 \                 x1 = 1 → 右へ
                k_1
               /   \
            G_0     G_1            G(k_1) = (…)
            /                      x2 = 0 → 左へ
         k_10
         /  \
      G_0    G_1                   G(k_10) = (…)
              \                    x3 = 1 → 右へ
             k_101 = F(k, 101)     ← 葉が出力
```

> **定理.** `G` が安全な PRG なら、GGM で定まる `F` は安全な PRF。

---

## 欠点：実用では使われない

| | GGM | AES |
|---|---|---|
| `F(k,x)` 1 回の評価 | `G` を `n` 回（根から葉まで） | ブロック暗号 1 回 |
| 用途 | 理論的な**存在証明** | 実用 |

---

## 仕上げ：PRG からブロック暗号へ

GGM で得た PRF を 02 の **Luby–Rackoff**（独立 3 鍵の 3 ラウンド Feistel）に入れると安全な PRP になる。「安全な PRG が存在する」という 1 つの仮定から、PRF もブロック暗号も原理的に構成できる。

---

## 問題

**Q1.** GGM で `x = 011` を評価する経路を、根から葉まで辿れ（左=0 / 右=1）。

<details><summary>解答</summary>

x1=0 → 左 `k_0`、x2=1 → 右 `k_01`、x3=1 → 右 `k_011`。出力は葉 `F(k,011) = k_011`。各ステップで親に `G` を適用し、ビットに応じて左半分/右半分を選ぶ。

</details>

**Q2.** GGM が実用で使われないのはなぜか。

<details><summary>解答</summary>

1 回の評価で PRG を `n` 回（根→葉の深さ分）適用する必要があり、AES 等より桁違いに遅いため。理論的な存在証明としての価値が主。

</details>

**Q3.** 「PRG から安全なブロック暗号を作る」手順を正しい順に並べよ。(a) Luby–Rackoff で PRP 化 (b) GGM で PRF 化 (c) 倍長 PRG を用意

<details><summary>解答</summary>

(c) → (b) → (a)。倍長 PRG を GGM に入れて PRF を作り、それを 3 ラウンド Feistel（Luby–Rackoff）に入れて PRP（ブロック暗号）にする。

</details>

**Q4.** 「1 bit PRF」と「倍長 PRG」はどう対応するか。

<details><summary>解答</summary>

倍長 PRG `G(k) = (G_0(k), G_1(k))` の左右の半分を入力ビットで選ぶ（`F(k,x)=G_x(k)`）と 1 bit 入力の PRF になる。両者は本質的に同じ対象の別の見方で、GGM はこれを `n` bit へ木状に積み上げたもの。

</details>

## 関連リンク

- [01. ブロック暗号と PRF/PRP](./01_block-cipher-and-prf-prp.md) — 逆方向（PRF から PRG）
- [02. DES](./02_des.md) — Luby–Rackoff と Feistel
- [05. ブロック暗号の利用モード](../05_block-cipher-modes/README.md) — 作ったブロック暗号をどう使うか
