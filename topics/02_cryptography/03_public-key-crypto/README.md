# 公開鍵暗号（Public-Key Cryptography）

> 層: 基礎(Layer 1)
> 親: [../index.md](../index.md)

「送信者と受信者が**鍵を事前に共有しなくてよい**」暗号の総称。
対称鍵との最大の違いはここ。安全性は数学的困難問題（素因数分解・離散対数・楕円曲線）を根拠とする。

---

## 概念ファイル（番号順に読む）

| # | ファイル | 内容 |
|---|---|---|
| 01 | [01_rsa/](./01_rsa/README.md) | RSA — 鍵生成・暗号化・復号・正しさ証明・パディング |
| 02 | [02_dh.md](./02_dh.md) | Diffie–Hellman 鍵共有・CDH/DDH・前方秘匿性・Logjam |
| 03 | [03_ecc.md](./03_ecc.md) | 楕円曲線暗号（群構造・ECDH・NIST P-256 vs Curve25519・Dual_EC_DRBG） |
| 04 | [04_digital-signatures.md](./04_digital-signatures.md) | デジタル署名（RSA-PSS・ECDSA・nonce再利用事故・EdDSA） |
| 05 | [05_security-definitions-and-kem.md](./05_security-definitions-and-kem.md) | 安全性の定義（ゲームと優位性・IND-CPA/CCA1/CCA2・EUF-CMA）と KEM/DEM |

---

## 公開鍵暗号の共通構造

```
鍵生成:  (公開鍵 pk, 秘密鍵 sk) ← KeyGen()
暗号化:  暗号文 c ← Enc(pk, 平文 m)
復号:    平文 m ← Dec(sk, c)
正しさ:  Dec(sk, Enc(pk, m)) = m   が常に成り立つ
```

安全性の直感: `pk` を知っても `sk` を計算するのが計算量的に困難であること。
困難性の根拠は [`../../01_prerequisites/01_math-for-crypto/03_number-theory/05_hard-problems.md`](../../01_prerequisites/01_math-for-crypto/03_number-theory/05_hard-problems.md) を参照。

| 方式 | 困難問題 | 主な用途 |
|---|---|---|
| RSA | 大数の素因数分解（IFP） | 暗号化・署名 |
| DH | 離散対数問題（DLP） | 鍵共有 |
| ECC | 楕円曲線上の離散対数（ECDLP） | 鍵共有・署名（鍵長が短い） |

---

## 数学的前提（道具箱へのリンク）

RSA を理解するには次が必要:
- 合同算術・逆元 → [`../../01_prerequisites/01_math-for-crypto/01_modular-arithmetic/`](../../01_prerequisites/01_math-for-crypto/01_modular-arithmetic/README.md)
- 素数・フェルマー・オイラー・CRT → [`../../01_prerequisites/01_math-for-crypto/03_number-theory/`](../../01_prerequisites/01_math-for-crypto/03_number-theory/README.md)
