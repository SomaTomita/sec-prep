# RSA 暗号

> 対応科目: H05E1B / H0Q28A ｜ 層: 基礎(Layer 1)
> 親: [../README.md](../README.md)

1977年 Rivest–Shamir–Adleman が発表。**素因数分解の困難さ**を安全性の根拠とする
最初の実用的公開鍵暗号。TLS の鍵交換・デジタル署名として今も広く使われる。

---

## 概念ファイル（番号順に読む）

| # | ファイル | 内容 |
|---|---|---|
| 01 | [01_key-generation.md](./01_key-generation.md) | 鍵生成手順・パラメータの意味 |
| 02 | [02_encryption-decryption.md](./02_encryption-decryption.md) | 暗号化・復号・平文の数値表現 |
| 03 | [03_correctness-proof.md](./03_correctness-proof.md) | 正しさ証明（d の存在・復号定理） |
| 04 | [04_padding-and-attacks.md](./04_padding-and-attacks.md) | 教科書 RSA の脆弱性・OAEP/PSS パディング |

---

## 一言で

```
公開鍵 (n, e) で暗号化:  c = mᵉ mod n
秘密鍵 (n, d) で復号:   m = cᵈ mod n      （⟺ mᵉᵈ ≡ m (mod n)）
```

秘密の核心は **p, q（n の素因数）と d（e の逆元 mod λ(n)）**。
`n` だけ公開しても `p, q` に分解することが計算量的に困難なため、`d` は求まらない。

---

## 全体の流れ

```
受信者 Bob                         送信者 Alice
─────────────────────────────────────────────────
[01 鍵生成]
p, q を選ぶ（秘密）
n = p·q  ─── 公開 ──────────────────→  (n, e) を受け取る
e を選ぶ ─── 公開 ──────────────────→
d = e⁻¹ mod λ(n)（秘密）

                                    [02 暗号化]
                                    m を数値に変換 + パディング（[04]）
                                    c = mᵉ mod n
                               c ──────────────→

[02 復号]
m = cᵈ mod n

[03 正しさ]  mᵉᵈ ≡ m (mod n)  ← フェルマー小定理 + CRT で証明
[04 安全な運用] 教科書 RSA は決定論的・展性があり単体では危険 → OAEP/PSS が必須
```

---

## 安全性の根拠（概要）

- `n` の素因数分解ができれば `p, q` → `λ(n)` → `d` が求まる。詳細は
  [`../../../01_prerequisites/01_math-for-crypto/03_number-theory/05_hard-problems.md`](../../../01_prerequisites/01_math-for-crypto/03_number-theory/05_hard-problems.md)。
- 現時点で 2048 bit 以上の `n` の素因数分解は計算量的に実行不可能（NIST 推奨: 2048 bit 以上）。
- RSA の暗号化そのもの（教科書 RSA）は決定論的で脆弱。実用では **RSA-OAEP**（暗号化）や
  **RSA-PSS**（署名）のパディングスキームを用いる → [04](./04_padding-and-attacks.md)。
