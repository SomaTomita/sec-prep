# 深掘り: ストリーム暗号（Vernam → PRG → FSM）

> 親: [02 対称鍵暗号](../../02_symmetric-crypto/README.md) ｜ 層: 深掘り(Layer 2)

`02_symmetric-crypto/README.md` では「ストリーム暗号＝鍵から擬似乱数列を作って XOR」と1行で
片づけた部分を、**手を動かして目で見る**ために起こした深掘りフォルダ。

扱うのは次の1本の筋道だけ。

```
Vernam / OTP          長い完全ランダム鍵をそのまま XOR。安全だが運用が重い
      ↓  鍵が長すぎる
短い鍵 + 展開アルゴリズム   短い秘密鍵を PRG で伸ばしてキーストリームにする
      ↓  展開の中身を開けると
FSM（状態機械）        K と IV で状態を初期化し、状態を更新しながら Z を吐き続ける
```

各ページに**その場で動かせるウィジェット**を置いてある（ボタンでビットが1桁ずつ動く）。
JavaScript が無効な環境では説明文と図だけが残るので、読み物としても成立する。

## 読む順

| # | ページ | 動かすもの |
|---|---|---|
| 01 | [Vernam 暗号とワンタイムパッド](01_vernam-and-otp.md) | 平文と鍵を1ビットずつ XOR し、同じ鍵で元に戻るまで |
| 02 | [鍵長の問題](02_key-length-problem.md) | データ量を動かして「運ぶ鍵の量」を OTP と比較 |
| 03 | [PRG とキーストリーム](03_prg-and-keystream.md) | 8ビットのシードからキーストリームが伸びていく様子 |
| 04 | [FSM として見るストリーム暗号](04_fsm-view.md) | K・IV → 状態更新 → Z → XOR を暗号化/復号の2レーンで同時に |

## 記号の対応表

4ページを通して同じ記号を使う。

| 記号 | 意味 |
|---|---|
| `P` | Plaintext（平文） |
| `C` | Ciphertext（暗号文） |
| `K` | Key（秘密鍵） |
| `IV` | Initialization Vector（初期化ベクトル） |
| `Z` | Keystream（キーストリーム） |
| `⊕` | XOR（排他的論理和） |
| next state function | 現在の状態から次の状態を作る関数 |
| output function | 現在の状態から `Z` を1ビット（1バイト）取り出す関数 |

覚えるべき式は結局この2本しかない。

```
暗号化:  C = P ⊕ Z
復号:    P = C ⊕ Z
```

## ここに本体を置かないもの

- **完全秘匿の証明**（なぜ OTP が情報理論的に安全なのか）
  → [`../../../01_prerequisites/01_math-for-crypto/05_info-theory/03_perfect-secrecy-otp.md`](../../../01_prerequisites/01_math-for-crypto/05_info-theory/03_perfect-secrecy-otp.md)
- **AES・ブロック暗号・モード（CTR/GCM）** → [`../../02_symmetric-crypto/README.md`](../../02_symmetric-crypto/README.md)
- **講義に沿った理論的な定義（PRG の安全性・意味論的安全性）**
  → `courses/coursera-crypto1/03_stream-ciphers/`（リポジトリ内のみ）

## 参考

- RFC 8439 — ChaCha20 and Poly1305 for IETF Protocols (2018): https://www.rfc-editor.org/rfc/rfc8439.html
- C. E. Shannon, "Communication Theory of Secrecy Systems" (1949): https://ieeexplore.ieee.org/document/6769090
- NIST SP 800-90A Rev.1 — Recommendation for Random Number Generation Using Deterministic Random Bit Generators: https://nvlpubs.nist.gov/nistpubs/SpecialPublications/NIST.SP.800-90Ar1.pdf
