# 整数論（Number Theory）

> 層: 基礎(Layer 1)
> 親: [../00_index.md](../00_index.md)

## 一言で

素数・素因数分解・フェルマー/オイラーの定理・CRT・離散対数問題といった整数の性質が、
RSA・DH・ECC といった公開鍵暗号の「安全性の根拠」を形成する。
[`../01_modular-arithmetic/`](../01_modular-arithmetic/README.md) で身につけた演算（合同式・gcd・逆元）を土台に、
「なぜ正しく動くか」「なぜ安全と言えるか」を1つずつ積み上げる。

---

## 概念ファイル（番号順に読む）

| # | ファイル | 内容 | 備考 |
|---|---|---|---|
| 01 | [01_primes-factorization.md](./01_primes-factorization.md) | 素数・算術の基本定理・素因数分解の困難性 | RSA の `n=p·q` へ接続 |
| 02 | [02_fermat-little-theorem.md](./02_fermat-little-theorem.md) | フェルマーの小定理・証明スケッチ | 法が素数の場合限定。Miller-Rabin の布石 |
| 03 | [03_euler-phi-theorem.md](./03_euler-phi-theorem.md) | オイラーのトーシェント関数 φ(n)・オイラーの定理 | フェルマーの合成数への一般化。RSA鍵生成に直結 |
| 04 | [04_crt.md](./04_crt.md) | 中国剰余定理：証明（存在性・一意性）・構成的解法 | 入口は `../01_modular-arithmetic/07_crt-intro.md`。RSA-CRT高速化 |
| 05 | [05_hard-problems.md](./05_hard-problems.md) | 素因数分解問題・離散対数問題・ECDLP・量子への脆弱性 | RSA/DH/ECC の安全性根拠そのもの |

---

## なぜ重要か / コースでの位置づけ

### RSA の全体像
`n = p·q` の生成、φ(n) の計算、逆元 `d` の計算、暗号化・復号の正当性証明が
フェルマー/オイラーの定理で正当化される。

### 署名とプロトコル
DSA はモジュラー算術と離散対数問題に基づく。
TLS ハンドシェイクの DH/ECDH も DLP の困難性を前提とする。

### 暗号解読と安全性
差分解析・線形解析は対称鍵暗号が対象だが、公開鍵の安全性モデルは
DLP/IFP を「仮定」として形式化する。

耐量子暗号の登場背景: Shor のアルゴリズムが量子コンピュータ上で IFP（周期発見問題への
帰着で解く）と有限体 DLP を多項式時間で解いてしまう。Shor は有限アーベル群上の DLP に
一般化されるため、ECDLP も同様に多項式時間で破られる（古典では ECDLP の方が困難だが、
量子計算下ではこの優位が消える）。

### 計算量と実装
Miller-Rabin、Pollard Rho（素因数分解）、楕円曲線素因数分解法（ECM）を
Magma で実装・評価する。

---

## このフォルダで「本体」を置かないもの（DRY）

- **RSA・DH・ECDSA などプロトコルそのもの** → [`../../../02_cryptography/`](../../../02_cryptography/00_index.md)（本フォルダは安全性の数学的根拠までを扱う）
- **合同算術の基礎（余り・合同式・拡張ユークリッド・逆元・CRTの入口）** → [`../01_modular-arithmetic/`](../01_modular-arithmetic/README.md)（本フォルダはその続き）
- **群・環・体の一般論（`Z_n^*` が乗法群をなす理由など）** → `../02_groups-rings-fields.md`（昇格後は `../02_groups-rings-fields/`）
- **Miller-Rabin・Pollard の ρ法・ECM などアルゴリズムの実装** → Magma 実習（下記深掘り候補参照）

---

## つまずき / 深掘り候補（Layer 2）

- [x] RSA の正当性（フェルマー小定理+CRTを使った復号証明） → [`../../../02_cryptography/03_public-key-crypto/01_rsa/03_correctness-proof.md`](../../../02_cryptography/03_public-key-crypto/01_rsa/03_correctness-proof.md)
- [ ] Shor アルゴリズムの直感（量子 DFT で周期発見） → `deep/shor-intuition/`
- [ ] 一般数体篩法（GNFS）の計算量 → `deep/gnfs-overview/`
- [ ] ECDLP が DLP より困難な理由 → `deep/ecdlp-vs-dlp/`

---

## 参考

- Stallings, *Cryptography and Network Security* (7th ed.), Chapters 4–5
- Boneh & Shoup, *A Graduate Course in Applied Cryptography*, Ch. 10–12 (https://toc.cryptobook.us/)
