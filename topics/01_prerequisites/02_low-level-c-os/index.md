# 低レベル・C・OS — 地図

> 層: 地図 (Layer 0)

前提要件に「システムソフトウェア・C言語の基礎」が明示されている。
C言語のメモリ操作、OS の保護機構、実行形式の構造を知らないと、バッファオーバーフロー・
フォーマット文字列攻撃・ROP チェーンなどの「C系低レベル脆弱性」（§6.7）の仕組みが
理解できない。この3ファイルは、そのための最低限の土台を整える。

## 読む順

| # | ページ | 内容（1行） |
|---|---|---|
| 01 | [C言語とメモリ](01_c-and-memory.md) | C言語・ポインタ・配列・スタック/ヒープ・未定義動作 |
| 02 | [プロセスとOS](02_process-and-os.md) | プロセス/仮想メモリ/権限・ASLR/NX/カナリア概観 |
| 03 | [システムソフトウェア](03_systems-software.md) | コンパイル/リンク/ELF・呼び出し規約・デバッガの位置づけ |

<details>
<summary>進捗チェックリスト</summary>

- [ ] `01_c-and-memory.md` — C言語・ポインタ・配列・スタック/ヒープ・未定義動作
- [ ] `02_process-and-os.md` — プロセス/仮想メモリ/権限・ASLR/NX/カナリア概観
- [ ] `03_systems-software.md` — コンパイル/リンク/ELF・呼び出し規約・デバッガの位置づけ

</details>

<details>
<summary>科目対応・深掘りキュー・関連領域</summary>

対応科目: Development of Secure Software / Security Through the Software Lifecycle

### 対応科目まとめ

| ファイル | 関連する脆弱性・攻撃手法 |
|---|---|
| 01_c-and-memory | バッファオーバーフロー、ヒープ破壊、UAF |
| 02_process-and-os | 特権昇格、ASLR バイパス、NX 回避 |
| 03_systems-software | ROP チェーン、逆アセンブル解析、デバッガ利用 |

### 深掘りキュー（読んで詰まった用語をここに追記）

- [ ] （未記入 — 学習しながら追記する）

</details>

## 参考
