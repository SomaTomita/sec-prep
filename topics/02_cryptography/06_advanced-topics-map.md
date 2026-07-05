# 06. 上級トピックの地図（耐量子・FHE・MPC・サイドチャネル）

> 対応科目: H03G5A Applied Cryptography and Cryptanalysis, H0E74A ｜ 前: [05 プロトコルの地図](./05_protocols-overview.md) ｜ 層: 基礎(Layer 1)

RSA・DH・ECC・AES・署名・プロトコルという基礎が一通り揃った。最後に、コースで
本格的に深掘りされる4つのフロンティア領域を地図として押さえる。それぞれ独立した
研究分野で本来は1ファイルでは到底収まらないため、ここでは
「何が動機で・何が代表方式で・どこに繋がるか」だけを示す。

---

## 耐量子暗号（Post-Quantum Cryptography, PQC）

```
動機: Shor のアルゴリズムが量子コンピュータ上で素因数分解・DLP・ECDLPを多項式時間で解く
      （RSA・DH・ECC が実用規模の量子コンピュータで全滅する。詳細は既出↓）
根拠: ../01_prerequisites/01_math-for-crypto/03_number-theory/05_hard-problems.md
```

NIST が8年がかりの公募を経て **2024年8月**に最初の3標準を確定:

| 標準 | 旧名 | 種別 | 困難性の根拠 |
|---|---|---|---|
| FIPS 203 ML-KEM | CRYSTALS-Kyber | 鍵カプセル化（鍵共有の代替） | 格子（Module-LWE） |
| FIPS 204 ML-DSA | CRYSTALS-Dilithium | デジタル署名（主力） | 格子（Module-LWE） |
| FIPS 205 SLH-DSA | SPHINCS+ | デジタル署名（予備） | ハッシュ関数の安全性のみに依存 |

SLH-DSA は ML-DSA が万一破られた場合の**保険**として選ばれた——格子暗号は歴史が浅く
未知の弱点のリスクがあるのに対し、ハッシュベース署名はハッシュ関数の安全性
（[`04_hash-and-mac.md`](./04_hash-and-mac.md)）だけに依存し理論的に手堅い。

格子暗号の核心は **LWE（Learning With Errors）問題**——ノイズを乗せた連立一次方程式を
解くのが計算量的に困難という仮定。数学的な詳細は数論・格子理論の深掘りとして今後扱う
（`../01_prerequisites/01_math-for-crypto/` の深掘りキュー行き）。

---

## 完全準同型暗号（Fully Homomorphic Encryption, FHE）

```
目的: 暗号化したデータに対して、復号せずに任意の計算（加算・乗算の組み合わせ）を行える
      → 平文を一切見せずにクラウド側で計算を委託できる
```

2009年、Craig Gentry が**初めて実現可能な構成**を示した（イデアル格子ベース）:

```
1. Somewhat Homomorphic: 加算・乗算はできるが、演算を重ねるたびに「ノイズ」が蓄積し、
   一定回数を超えると復号不能になる（制限つき）
2. Bootstrappable: この方式が「自分自身の復号回路」を評価できるよう調整する
3. 再帰的自己適用: 復号→ノイズ除去を繰り返すことで、ノイズが蓄積し続けない
   「完全」準同型暗号に変換する
```

医療データ・金融データなど機密データをクラウドで処理する用途で研究が進む。
プライバシー保護計算という性質上、**プライバシー領域との交差点**
（[`../00_overview/02_five-pillars-map.md`](../00_overview/02_five-pillars-map.md) の
「MPC/FHE: 暗号の高度構成 × プライバシー保護計算」）でもあり、本体は `03_privacy/` 側の
関連ファイルとも接続する。

---

## 秘密計算（Secure Multi-Party Computation, MPC）

```
目的: 複数の参加者が、互いの入力を明かさずに、入力全体に対する関数の出力だけを得る
      （例: 給与を明かさず「誰が一番高いか」だけ知りたい — Yaoの「百万長者問題」）
```

2つの主要アプローチ:

- **ガーブルド回路（Yao, 1982年）**: 計算したい関数を論理回路に変換し、一方が「難読化」した
  回路を渡し、もう一方が自分の入力に対応する部分だけを復号しながら評価する。
- **秘密分散ベース（Shamir, 1979年）**: 秘密を `n` 個の分け前に分割し、`k` 個以上集めないと
  復元できない（`k-1` 個以下では情報が一切漏れない）**閾値法**。分け前同士を演算することで、
  元の秘密を復元せずに計算結果の分け前を得られる。

FHE が「1人が暗号化データを計算」なのに対し、MPC は「**複数人が協調して**計算」する点が違う。
医療機関同士が患者データを共有せず統計を取る、といった用途で実用化が進む。

---

## サイドチャネル攻撃

```
テーマ: アルゴリズムが数学的に完璧に安全でも、実装が「余計な情報」を漏らせば鍵は盗まれる
```

コース全体を通じて何度も登場したテーマの集大成:

- **タイミング攻撃**（Paul Kocher, 1996年）: RSA・DH・DSS の実装で、演算にかかる時間が
  秘密鍵のビットパターンによってわずかに変わることを利用し、鍵を復元する。
- **差分電力解析（DPA）**（Kocher, Jaffe, Jun, 1998〜99年）: スマートカード等の消費電力を
  統計的に解析し、内部で使われている秘密鍵のビットを推定する。

本コースで既に触れた「数学的に正しくても実装が危険」という教訓の物理層版:

- 定数時間実装の必要性は [`../01_prerequisites/01_math-for-crypto/01_modular-arithmetic/04_gcd-euclidean.md`](../01_prerequisites/01_math-for-crypto/01_modular-arithmetic/04_gcd-euclidean.md)
  の深掘りキュー（定数時間GCD）で既に予告済み。
- ECDSA の nonce 漏洩（[`03_public-key-crypto/04_digital-signatures.md`](./03_public-key-crypto/04_digital-signatures.md)）は
  「アルゴリズムの誤用」だったが、サイドチャネルは「**正しく実装したつもりでも**物理的な
  観測から漏れる」という一段階違う脅威モデル。

サイドチャネルの本体（回路・ハードウェア側の対策）は
[`../04_hardware-security/04_side-channels.md`](../04_hardware-security/04_side-channels.md)
で扱う。ここでは「暗号側から見た入口」だけを示した。

---

## まとめ表

| 領域 | 解決したい問題 | 代表方式 | 標準化・実現状況 |
|---|---|---|---|
| PQC | 量子計算機によるRSA/DH/ECC崩壊 | ML-KEM, ML-DSA, SLH-DSA | NIST標準化済み（2024年） |
| FHE | 暗号化データのまま計算したい | Gentry方式（格子ベース） | 実用化研究段階（重い） |
| MPC | 入力を明かさず共同計算したい | ガーブルド回路・秘密分散 | 一部実用化（金融・医療） |
| サイドチャネル対策 | 実装からの物理的情報漏洩 | 定数時間実装・マスキング | HW設計・実装の必修事項 |

---

## 演習（解答つき）

1. NIST が ML-DSA（格子ベース）と SLH-DSA（ハッシュベース）の**両方**を標準化した理由を述べよ。
2. FHE と MPC の違いを「誰が計算するか」という観点で一言で説明せよ。
3. サイドチャネル攻撃が「アルゴリズムの数学的な正しさ」の議論と別次元の脅威である理由を述べよ。

<details><summary>解答</summary>

1. 格子暗号（ML-DSA）は歴史が浅く未知の弱点が見つかるリスクがあるため、
   ハッシュ関数の安全性だけに依存する SLH-DSA を**保険**として並行標準化することで、
   仮に格子暗号が破られても暗号スイート全体が崩壊しないようにするため。
2. FHE は**1人**（例: クラウド事業者）が暗号化されたデータをそのまま計算する。
   MPC は**複数人**が、互いの入力を明かさずに協調して計算する。
3. サイドチャネル攻撃は暗号アルゴリズムの数式そのものは全く攻撃しない。代わりに
   実行時間・消費電力・電磁波といった**実装が漏らす付随情報**を観測することで秘密鍵を
   推定するため、数学的な証明可能安全性とは独立した、実装レベルの脅威モデル。

</details>

---

## 暗号での出口

これで `02_cryptography/` の基礎パート（目標・対称鍵・公開鍵・ハッシュ/MAC・プロトコル・
上級トピック）が一通り揃った。FHE/MPC は `03_privacy/` の暗号応用パート、
サイドチャネルは `04_hardware-security/` の実装セキュリティパートへそれぞれ接続していく。

---

## 参考

- FIPS 203, 204, 205 — NIST Post-Quantum Cryptography Standards (2024): https://www.nist.gov/news-events/news/2024/08/nist-releases-first-3-finalized-post-quantum-encryption-standards
- Gentry, C. (2009). *Fully Homomorphic Encryption Using Ideal Lattices*. STOC 2009.
- Yao, A. (1982). *Protocols for Secure Computations*. FOCS 1982.
- Shamir, A. (1979). *How to Share a Secret*. Communications of the ACM.
- Kocher, P. (1996). *Timing Attacks on Implementations of Diffie-Hellman, RSA, DSS, and Other Systems*. CRYPTO '96.
- Kocher, P., Jaffe, J., Jun, B. (1999). *Differential Power Analysis*. CRYPTO '99.
