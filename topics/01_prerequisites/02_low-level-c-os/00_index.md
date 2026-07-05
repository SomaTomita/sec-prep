# 低レベル・C・OS — サブ領域地図

> 対応科目: H04K5A Development of Secure Software / H0Q31A Security Through the Software Lifecycle ｜ 層: 地図 (Layer 0)

## このサブ領域の位置づけ

H04K5A の前提要件に「システムソフトウェア・C言語の基礎」が明示されている。  
C言語のメモリ操作、OS の保護機構、実行形式の構造を知らないと、バッファオーバーフロー・
フォーマット文字列攻撃・ROP チェーンなどの「C系低レベル脆弱性」（§6.7）の仕組みが  
理解できない。この3ファイルは、そのための最低限の土台を整える。

---

## Layer 1 進捗チェックリスト

- [ ] `01_c-and-memory.md` — C言語・ポインタ・配列・スタック/ヒープ・未定義動作
- [ ] `02_process-and-os.md` — プロセス/仮想メモリ/権限・ASLR/NX/カナリア概観
- [ ] `03_systems-software.md` — コンパイル/リンク/ELF・呼び出し規約・デバッガの位置づけ

---

## 対応科目まとめ

| ファイル | 主な対応科目 | 関連する脆弱性・攻撃手法 |
|---|---|---|
| 01_c-and-memory | H04K5A, H0Q31A | バッファオーバーフロー、ヒープ破壊、UAF |
| 02_process-and-os | H04K5A | 特権昇格、ASLR バイパス、NX 回避 |
| 03_systems-software | H04K5A, H05M8B | ROP チェーン、逆アセンブル解析、デバッガ利用 |

---

## 深掘りキュー（読んで詰まった用語をここに追記）

- [ ] （未記入 — 学習しながら追記する）

---

## 参考

- H04K5A シラバス: https://onderwijsaanbod.kuleuven.be/syllabi/e/H04K5AE.htm
- H0Q31A シラバス: https://onderwijsaanbod.kuleuven.be/syllabi/e/H0Q31AE.htm
