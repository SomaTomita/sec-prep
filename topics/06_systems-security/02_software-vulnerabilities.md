# 02. ソフトウェア脆弱性

> 前: [01 基本概念](./01_security-fundamentals.md) ｜ 次: [03 認証・認可・アクセス制御](./03_authn-authz-access-control.md) ｜ 層: 基礎(Layer 1)

[01](./01_security-fundamentals.md) の「脆弱性」を具体的に見る。ソフトウェアの脆弱性は大きく
2系統に分かれる: Webアプリケーションの**論理的な脆弱性**（OWASP Top 10）と、
C言語の**メモリ安全性の欠如**に起因する低レベル脆弱性（バッファオーバーフロー等）。
後者は
[`../01_prerequisites/02_low-level-c-os/01_c-and-memory.md`](../01_prerequisites/02_low-level-c-os/01_c-and-memory.md)
が「攻撃・防御手法は本領域で扱う」と予告していた内容の本体。

---

## Webアプリケーションの脅威：OWASP Top 10 (2021)

OWASP（Open Web Application Security Project）が実際の脆弱性データを基に選定する
Webアプリ脅威ランキング。最新の正式版は2021年版（次版は策定中）。

| # | カテゴリ | 一言で |
|---|---|---|
| A01 | Broken Access Control | 認可チェックの欠落・不備（[03](./03_authn-authz-access-control.md)で詳述） |
| A02 | Cryptographic Failures | 暗号の誤用・平文保存（[`../02_cryptography/`](../02_cryptography/index.md)で詳述） |
| A03 | Injection | 信頼できない入力をコード/クエリの一部として実行してしまう |
| A04 | Insecure Design | 実装以前の設計段階の欠陥 |
| A05 | Security Misconfiguration | デフォルト設定放置・不要機能の有効化 |
| A06 | Vulnerable and Outdated Components | 既知脆弱性を持つライブラリの放置 |
| A07 | Identification and Authentication Failures | 認証の不備（[03](./03_authn-authz-access-control.md)で詳述） |
| A08 | Software and Data Integrity Failures | 署名検証なしの自動更新・デシリアライズ等 |
| A09 | Security Logging and Monitoring Failures | 侵害の検知・追跡ができない |
| A10 | Server-Side Request Forgery (SSRF) | サーバに任意の宛先へリクエストさせる |

### 具体例：Injection（A03）— Equifax事件（2017年、CVE-2017-5638）

Apache Strutsが `Content-Type` ヘッダの不正な値をエラーメッセージに組み込む際、
その値をOGNL（Object-Graph Navigation Language）式として**評価してしまう**欠陥があった。

```
攻撃者が送るヘッダ:  Content-Type: ${(#cmd='id').(...)}  ← OGNL式として解釈される
本来の想定:          Content-Type はただの文字列であるはず
結果:                サーバ上で任意コマンドが実行される（リモートコード実行）
```

パッチは2017年3月に公開されていたが、Equifax社が適用したのは同年7月末。
その間に攻撃者が悪用し、1億4500万人以上の米国民の個人情報が流出した。
「脆弱性が公表されてから対応するまでの時間」自体がリスクを左右する典型例
（[01](./01_security-fundamentals.md)のリスク＝可能性×影響の枠組みそのもの）。

Injection全般への対策: 入力を実行可能なコードとして解釈させない（パラメータ化クエリ、
テンプレートエンジンのオートエスケープ、許可リストによる入力検証）。

---

## C系低レベル脆弱性：スタックバッファオーバーフロー

[`01_c-and-memory.md`](../01_prerequisites/02_low-level-c-os/01_c-and-memory.md)
で見たスタックフレームの図を思い出す。境界チェックのない配列書き込みが、
隣接する**リターンアドレス**まで到達すると、関数リターン時に攻撃者が指定した
アドレスへジャンプさせられる。

### 最小構成の脆弱なコード

```c
void vulnerable(char *input) {
    char buf[16];
    strcpy(buf, input);   // input の長さを一切チェックしない
}
```

### 攻撃前後のスタック（模式図）

```
攻撃前（正常なリターンアドレス）:
┌───────────────────┐
│ リターンアドレス: 0x4005a3（呼び出し元の続き） │
├───────────────────┤
│ buf[16]（16バイト）  │
└───────────────────┘

攻撃後（32バイト超の input で上書き）:
┌───────────────────┐
│ リターンアドレス: 0x7fffffffe120（攻撃者が仕込んだシェルコードの先頭）│ ← 上書き成功
├───────────────────┤
│ buf[16]: シェルコード本体 + パディング │
└───────────────────┘
```

`vulnerable()` がリターンする瞬間、CPUは書き換えられたアドレスへジャンプし、
`buf` に仕込まれたシェルコード（`execve("/bin/sh", ...)` 等）を実行する。
この手法を初めて系統的に解説したのが Aleph One の 1996年 Phrack 記事
"Smashing the Stack for Fun and Profit"。

### 歴史的実例

- **Morris Worm（1988年）**: UNIX の `fingerd` が `gets()` で512バイトのスタックバッファに
  書き込んでいた欠陥を突き、536バイトの入力でリターンアドレスを書き換えて
  `/bin/sh` を起動。当時のインターネット全体の約1割（推定6,000台）に感染した、
  スタックバッファオーバーフローが実戦投入された最初期の事例。
- **CVE-2021-3156「Baron Samedit」（2021年）**: `sudo` のコマンドライン引数解析における
  off-by-one誤りがヒープバッファオーバーフローを引き起こし、一般ユーザーが認証なしで
  root権限を取得できた。2011年に混入し約10年間気づかれなかった。
  スタックだけでなく**ヒープ**でも同種の被害が起きることを示す例。

---

## 防御機構：攻撃者から見た視点

`../01_prerequisites/02_low-level-c-os/02_process-and-os.md` の防御機構の表を、
攻撃者がどう回避しようとするかの視点で振り返る。

| 防御 | 攻撃者への影響 | 回避の糸口 |
|---|---|---|
| スタックカナリア | リターン直前に検証され上書きが露見する | カナリア値のリーク、カナリアを跨がない上書き |
| NX/DEP | `buf` 上のシェルコードが実行できない | ROP（既存コード片を連鎖させる。`03_systems-software.md`参照） |
| ASLR | ジャンプ先アドレスを予測できない | 情報リーク脆弱性と組み合わせて実アドレスを特定 |
| 安全な言語（Rust, Go等） | 配列境界を実行時に検査し、境界外アクセスで例外を出す | バグクラス自体を設計上排除（`unsafe`ブロックを除く） |

多層防御の考え方が[01](./01_security-fundamentals.md)の「機構の経済性」とは逆に見えるが、
1つの防御が破られても次の防御が残る「深層防御」もまた確立した設計原則。

---

## 演習（解答つき）

1. `char buf[16]` に `strcpy` で32バイトの入力をコピーすると何が起きるか、
   スタックの模式図を使って説明せよ。
2. Equifax事件でOGNL Injectionが成立した根本原因を一言で述べよ。
3. NXビットが有効な環境で、攻撃者が「シェルコードを直接実行する」代わりに
   使う手法の名前を挙げよ。

<details><summary>解答</summary>

1. `buf` の16バイトを超えた分がスタック上の隣接領域（保存されたベースポインタ、
   さらにリターンアドレス）を上書きする。攻撃者が32バイトの入力に狙ったアドレスを
   仕込めば、関数リターン時にそのアドレスへジャンプさせられる。
2. `Content-Type` ヘッダという**外部からの信頼できない入力**を、
   エラーメッセージ生成時にOGNL式として**評価（実行）してしまった**こと
   （入力とコードの分離ができていなかった）。
3. **ROP（Return-Oriented Programming）**。既存の実行可能コード片（ガジェット）を
   リターンアドレスの連鎖でつなぎ、新規コードを注入せずに任意の処理を組み立てる。

</details>

---

## 次への接続

Equifaxの例もBaron Samedit の例も、最終的には「誰が何にアクセスできるか」という
認可の話に帰着する（前者はRCE後の権限、後者はroot権限の奪取そのもの）。
次はこの認証・認可・アクセス制御の理論的な枠組み（Lampsonのアクセス制御マトリックス）を見る。
→ [03 認証・認可・アクセス制御](./03_authn-authz-access-control.md)

---

## 参考

- OWASP Top 10:2021: https://owasp.org/Top10/2021/
- Aleph One (1996). "Smashing The Stack For Fun And Profit". *Phrack*, Vol.7, Issue 49. https://phrack.org/issues/49/14.html
- CVE-2017-5638 (Apache Struts / Equifax): https://nvd.nist.gov/vuln/detail/CVE-2017-5638
- CVE-2021-3156 (sudo "Baron Samedit"): Qualys Security Advisory, 2021. https://www.qualys.com/2021/01/26/cve-2021-3156/baron-samedit-heap-based-overflow-sudo.txt
- Computer Archeology, *Morris Internet Worm* (fingerd exploit解説): https://computerarcheology.com/Virus/MorrisWorm/
