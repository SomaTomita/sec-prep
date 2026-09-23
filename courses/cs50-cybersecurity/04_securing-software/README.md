# 04. ソフトウェアを守る

使う側でも書く側でも、ソフトウェアそのものが攻撃面になる。この講義は**「入力を信用するな」**の一点に収束する — HTML・SQL・シェル・スタック上のバッファ、文脈は違っても攻撃者の入力が「データ」でなく「命令」として解釈された瞬間に破綻する。防御も同型: **文脈に応じたエスケープ**と**サーバ側の検証**。

## 読む順

| No | ファイル | 内容 |
|----|---------|------|
| 01 | [HTML リンクとフィッシング](./01_html-links-and-phishing.md) | タグと属性・表示テキストと href の乖離・偽ドメイン |
| 02 | [クロスサイトスクリプティング](./02_cross-site-scripting.md) | 入力の出力への混入・反射型攻撃・URL エンコード |
| 03 | [蓄積型 XSS とエスケープ](./03_stored-xss-and-escaping.md) | 保存された入力の実行・文字エスケープ 5 種・CSP |
| 04 | [SQL インジェクション](./04_sql-injection.md) | 文字列結合・DELETE の注入・`or '1'='1'`・プリペアドステートメント |
| 05 | [コマンドインジェクション](./05_command-injection.md) | `system` と `eval`・シェルへの入力・エスケープ機構 |
| 06 | [クライアント側検証の限界](./06_client-side-validation.md) | 開発者ツール・`disabled`/`required` の除去・サーバ側検証 |
| 07 | [CSRF](./07_csrf.md) | GET は状態を変えない・img タグ・JS 自動送信・CSRF トークン |
| 08 | [バッファオーバーフロー](./08_buffer-overflow.md) | スタック・戻りアドレスの上書き・任意コード実行 |
| 09 | [供給網と脆弱性カタログ](./09_supply-chain-and-vulnerability-catalogs.md) | OSS とクローズド・アプリストアと署名・バグバウンティ・CVE/CVSS |

---

前: [03. システムを守る](../03_securing-systems/README.md) ｜ 次: [05. プライバシーを保つ](../05_preserving-privacy/README.md)
