# ディジタル論理・ハードウェア — 地図

> 層: 地図 (Layer 0)

CMOSトランジスタからコンピュータアーキテクチャまでの「ハードウェアの言葉」を習得する。
この知識は設計ツール・HW/SW協調設計へ橋渡しし、
サイドチャネル・root of trust・PUF といったセキュリティ概念の物理的土台になる。

## 読む順

| # | ページ | 内容（1行） |
|---|---|---|
| 01 | [CMOSと論理ゲート](01_cmos-logic.md) | CMOS・論理ゲート・消費電力・遅延（物理の言葉を掴む） |
| 02 | [組合せ回路と順序回路](02_combinational-sequential.md) | 組合せ/順序回路・FSM・フリップフロップ（設計の基本単位を掴む） |
| 03 | [HDLとアーキテクチャ](03_hdl-and-architecture/README.md) | HDL・合成・FPGA/ASIC・アーキテクチャ概観（概念別フォルダ: HDL基礎→パイプライン/ハザード→メモリ階層/協調設計。設計フローとシステム全体像を掴む） |

<details>
<summary>進捗チェックリスト</summary>

- [ ] `01_cmos-logic.md` — CMOS・論理ゲート・消費電力・遅延
- [ ] `02_combinational-sequential.md` — 組合せ/順序回路・FSM・フリップフロップ
- [ ] `03_hdl-and-architecture/` — HDL・合成・FPGA/ASIC・アーキテクチャ概観（概念別フォルダ: HDL基礎→パイプライン/ハザード→メモリ階層/協調設計）

</details>

<details>
<summary>科目対応・深掘りキュー・関連領域</summary>

対応科目: Design of Digital Platforms: Concepts ／ Design Seminar ／ Hardware Security

### 対応科目マッピング

| ファイル |
|---|
| `01_cmos-logic.md` |
| `02_combinational-sequential.md` |
| `03_hdl-and-architecture/` |

### 深掘りキュー (Layer 2 候補)

読み進めながら詰まった用語をここに追加し、`deep/<topic-slug>/` を新設する。

- [ ] （空欄 — 読みながら追記）

### 他領域とのリンク

- 電力サイドチャネル・タイミング攻撃の詳細 → `../../04_hardware-security/04_side-channels/README.md`
- HW/SW協調設計の応用 → `../../04_hardware-security/01_digital-platform-design.md`
- root of trust・PUF の詳細 → `../../04_hardware-security/03_security-building-blocks.md`

</details>
