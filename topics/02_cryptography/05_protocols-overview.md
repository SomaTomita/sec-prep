# 05. プロトコルの地図（TLS・IPsec・SSH・Signal・EMV・Blockchain）

> 対応科目: H0Q28A Cryptographic Protocols, H05E1B ｜ 前: [04 ハッシュ・MAC](./04_hash-and-mac.md) ｜ 次: [06 上級トピックの地図](./06_advanced-topics-map.md) ｜ 層: 基礎(Layer 1)

これまでのファイルで個別のプリミティブ（RSA・DH・ECC・AES・ハッシュ・MAC・署名）を見てきた。
実世界のプロトコルはこれらを**組み合わせて**特定の問題を解く。本ファイルは深掘りせず、
「どのプロトコルが何のためにどのプリミティブを使うか」の地図に徹する。各プロトコル自体は
H0Q28A で個別に深く扱われる。

---

## TLS 1.3（RFC 8446）— 安全なウェブ通信

```
目的: HTTPS 等のクライアント・サーバ間通信を保護
鍵交換: ECDHE のみ（静的RSA鍵輸送は廃止）→ 前方秘匿性が必須に
        1-RTTハンドシェイク、HKDF（RFC5869）による鍵スケジュール
認証:   サーバ証明書 + RSA-PSS/ECDSA 署名でサーバの身元を検証
本体:   AES-GCM または ChaCha20-Poly1305 でレコード層を暗号化
```

これは [`02_symmetric-crypto.md`](./02_symmetric-crypto.md) で説明した**ハイブリッド暗号**の
パターンそのものであり、[`03_public-key-crypto/02_dh.md`](./03_public-key-crypto/02_dh.md) が
「TLS1.3はRSA鍵輸送を廃止しDHE/ECDHEのみにした」と予告した内容が実際に標準化されたもの。

---

## IPsec（RFC 4301/4303/7296）— ネットワーク層の VPN

```
目的: IPパケット単位で機密性・完全性を提供（VPN）
ESP（RFC4303）: 暗号化+認証を提供（現在の主流）
AH: 認証のみ（暗号化なし、ほぼ使われない）
IKEv2（RFC7296）: DHベースの鍵交換で自動的に鍵を確立・更新
モード: トランスポート（ペイロードのみ保護）／トンネル（IPパケット全体を新しいIPヘッダで包む）
```

TLS がアプリケーション層（特定の通信）を守るのに対し、IPsec は**IP層すべて**を対象にする
点が設計思想の違い。

---

## SSH（RFC 4251〜4253）— 安全なリモートログイン

```
3層構造:
  トランス層（RFC4253）: DHベースの鍵交換 + サーバのホスト鍵で認証、暗号化・完全性を確立
  認証層（RFC4252）: パスワード・公開鍵などでクライアントを認証
  接続層: 複数チャネル（シェル・ポートフォワード等）を多重化
```

**信頼モデルの違いに注目**: TLS は認証局（CA）が発行する証明書チェーンで身元を検証するのに対し、
SSH は多くの場合 **TOFU（Trust On First Use）**——初回接続時のホスト鍵を記憶し、
以降の接続でそれと一致するかだけを確認する（中央集権的なCA基盤を前提にしない設計）。

---

## Signal Protocol — E2E暗号化メッセージング

WhatsApp・Signal で使われる。2つの仕組みを組み合わせる:

```
X3DH（Extended Triple Diffie-Hellman）:
  相手がオフラインでも、事前に公開しておいた鍵材料を使って初回の共有鍵を確立できる設計
  X25519（Curve25519、03_ecc.md 参照）ベース

Double Ratchet:
  メッセージを送るたびに新しい鍵を派生させ続ける「ラチェット」機構
  → 前方秘匿性（過去の鍵が漏れても過去のメッセージは守られる）に加え、
    事後侵害安全性（post-compromise security：一時的に鍵が漏れても、その後は自己修復する）
    まで達成する。DH単発の前方秘匿性（02_dh.md）をメッセージ単位に細分化した発展形。
```

---

## EMV（ICカード決済）— オフラインでの真正性検証

```
目的: ネットワーク接続なしでもカードの真正性・データ改ざんを検証する
SDA（Static Data Authentication）:  カードの静的データに発行会社がRSA署名 → クローン防止は弱い
DDA（Dynamic Data Authentication）: 端末の乱数に対しカード自身がRSA署名 → クローン耐性あり
CDA（Combined DDA）: DDAに取引データも結びつけて署名 → 最も強い
```

いずれも [`03_public-key-crypto/01_rsa/`](./03_public-key-crypto/01_rsa/README.md) の
署名検証（RSA）をベースに、発行会社→カードという**階層的な公開鍵基盤**で構築されている。

---

## Blockchain（Bitcoin を例に）— 分散台帳

```
所有権の証明: ECDSA（secp256k1曲線、04_digital-signatures.md 参照）で取引に署名
改ざん検知:   各ブロックが前ブロックのハッシュを含む「ハッシュチェーン」（04_hash-and-mac.md）
             取引はMerkle木（Ralph Merkle, 1979年の学位論文が起源）にまとめられ、
             木のルートだけがブロックヘッダに入る
合意形成:     Proof of Work（Hashcashを応用）— 計算資源を消費した証明で改ざんコストを上げる
```

2008年 Satoshi Nakamoto の論文が起点。中央機関なしで「誰が何を所有しているか」を
暗号プリミティブの組み合わせだけで実現する点が新規性だった。

---

## まとめ表：プロトコル → 目的 → 使うプリミティブ

| プロトコル | 目的 | 鍵交換/認証 | 本体の保護 |
|---|---|---|---|
| TLS 1.3 | Web通信 | ECDHE + RSA-PSS/ECDSA証明書 | AES-GCM / ChaCha20-Poly1305 |
| IPsec | VPN（IP層） | IKEv2（DHベース） | ESP（AES等） |
| SSH | リモートログイン | DH + ホスト鍵（TOFU） | 対称鍵暗号 |
| Signal | E2Eメッセージング | X3DH（X25519） | Double Ratchet派生鍵 |
| EMV | 決済カード | RSA階層署名（SDA/DDA/CDA） | （オフライン真正性検証が主眼） |
| Blockchain | 分散台帳 | ECDSA（secp256k1） | ハッシュチェーン + PoW |

---

## 演習（解答つき）

1. TLS と SSH で「相手の身元をどう信頼するか」の仕組みがどう違うか、一言で述べよ。
2. Signal の Double Ratchet が単発の DH（[`02_dh.md`](./03_public-key-crypto/02_dh.md)）より
   優れている点を一言で述べよ。
3. EMV の SDA が「クローン防止には弱い」とされる理由を一言で述べよ。

<details><summary>解答</summary>

1. TLS は認証局（CA）が発行した証明書チェーンという**中央集権的な信頼の連鎖**で相手を検証する。
   SSH は多くの場合 **TOFU**（初回接続時の鍵を記憶し、以降はそれと一致するかだけを見る）で、
   CA のような第三者機関を前提にしない。
2. 単発の DH は1回の鍵確立にとどまるが、Double Ratchet は**メッセージごとに鍵を更新し続ける**
   ため、ある時点の鍵が漏れても過去のメッセージ（前方秘匿性）だけでなく、
   その後の会話も自己修復的に安全になる（事後侵害安全性）。
3. SDA はカードの**静的**データに対する署名を検証するだけで、カードとの対話（チャレンジ・
   レスポンス）を伴わない。そのため署名済みデータをそのままコピーした偽造カードでも
   検証を通過してしまう（DDA/CDAのような動的な証明がない）。

</details>

---

## 暗号での出口

ここまでのプロトコルはすべて RSA・DH・ECC の困難性（素因数分解・離散対数）を安全性の
根拠にしていた。しかし量子コンピュータはこれらを効率的に解いてしまう
（[`../01_prerequisites/01_math-for-crypto/03_number-theory/05_hard-problems.md`](../01_prerequisites/01_math-for-crypto/03_number-theory/05_hard-problems.md)）。
このプロトコル群を将来どう置き換えるかが次のテーマ。
→ [06 上級トピックの地図](./06_advanced-topics-map.md)

---

## 参考

- RFC 8446 — The Transport Layer Security (TLS) Protocol Version 1.3
- RFC 4301, 4303, 7296 — IPsec Architecture, ESP, IKEv2
- RFC 4251–4253 — SSH Protocol Architecture / Authentication / Transport Layer
- Signal — *The X3DH Key Agreement Protocol* / *The Double Ratchet Algorithm*: https://signal.org/docs/
- Nakamoto, S. (2008). *Bitcoin: A Peer-to-Peer Electronic Cash System*.
