# HDL・合成・コンピュータアーキテクチャ概観

> 対応科目: Design of Digital Platforms: Concepts ／ Design Seminar ／ Hardware Security ｜ 層: 基礎(Layer 1)
> 親: [../index.md](../index.md)

## 一言で

HDL（ハードウェア記述言語）は回路を「コードとして記述する」手段で、合成ツールが
HDL → ゲートネットリスト → FPGA/ASIC へと変換する。コンピュータアーキテクチャの基本
（パイプライン・メモリ階層）はその上に積み上がる CPU の内部構造であり、HW/SW 協調設計と
性能トレードオフ分析の共通言語になる。3 ファイルは「HDL で作る部品 → 部品を並べたパイプライン
→ パイプラインが触るメモリと全体最適化」の順に一本道で繋がる。

---

## 概念ファイル（番号順に読む）

| # | ファイル | 内容 | 備考 |
|---|---|---|---|
| 01 | [01_hdl-basics.md](./01_hdl-basics.md) | HDL の役割・Verilog/VHDL コード例（Dフリップフロップ）・RTL→合成→FPGA/ASIC の設計フロー・FPGA vs ASIC 比較 | — |
| 02 | [02_pipelining-and-hazards.md](./02_pipelining-and-hazards.md) | ISA 概観・5 段パイプライン（IF/ID/EX/MEM/WB）・データ/制御ハザード・Spectre/Meltdown への接続 | — |
| 03 | [03_memory-hierarchy-and-codesign.md](./03_memory-hierarchy-and-codesign.md) | メモリ階層とレイテンシ・キャッシュタイミングサイドチャネル・HW/SW 協調設計フロー | — |

---

## なぜ重要か / コースでの位置づけ

### 設計実習との接続

- HDL を読み書きできること、合成フローを理解していることが Design Seminar の実習の前提
- FPGA 上のプロトタイピングは Design Seminar の 60h セミナー全体の実習軸
- パイプライン・メモリ階層は HW/SW 協調設計での性能トレードオフ分析の共通言語（`01_cmos-logic.md` の PPA モデルと直結）

### Hardware Security への接続

1. **暗号コアの HDL 実装**: AES / SHA などの暗号ハードウェアは HDL で記述され、
   その実装に電力マスキング・デュアルレール等のサイドチャネル対策を組み込む
2. **Root of Trust の設計**: セキュアブートチェーン・TPM など信頼の起点となるハードウェアは
   ASIC/FPGA 上の RTL 設計として実現される
3. **ハードウェアトロイの木馬**: 製造委託先が HDL レベルでバックドアを挿入するリスク。
   設計フローの各ステップにセキュリティ検証が必要
4. **投機実行攻撃（Spectre/Meltdown）**: CPU アーキテクチャのマイクロアーキテクチャ最適化
   （分岐予測・投機実行）がキャッシュタイミングサイドチャネルを生む（[02](./02_pipelining-and-hazards.md)・[03](./03_memory-hierarchy-and-codesign.md)）

---

## このフォルダで「本体」を置かないもの（DRY）

HDL・アーキテクチャの基礎はここに置くが、以下は本体を持たずリンクで誘導する。

- **サイドチャネル攻撃の詳細メカニズム（DPA・Flush+Reload・Spectre/Meltdown の再現手順など）** →
  [`../../../04_hardware-security/04_side-channels.md`](../../../04_hardware-security/04_side-channels.md) / [`02_hardware-attacks.md`](../../../04_hardware-security/02_hardware-attacks.md)
- **CMOS の電力・遅延モデルそのもの** → `../01_cmos-logic.md`
- **組合せ/順序回路・タイミング制約の基礎** → `../02_combinational-sequential.md`

---

## つまずき / 深掘り候補（Layer 2）

- [ ] Verilog/VHDL の文法詳細 → `deep/hdl-syntax/`
- [ ] 論理合成の最適化手法（テクノロジマッピング等） → `deep/logic-synthesis/`
- [ ] Spectre/Meltdown の詳細メカニズム → `../../../04_hardware-security/02_hardware-attacks.md` 参照後に `deep/spectre-meltdown/`
- [ ] RISC-V の命令セット詳細 → `deep/riscv-isa/`
- [ ] キャッシュサイドチャネル（Flush+Reload 等）の手順 → `deep/cache-side-channels/`

---

## 参考

- David Patterson & John Hennessy, *Computer Organization and Design RISC-V Edition* (2nd ed.), Morgan Kaufmann — パイプライン・メモリ階層の定番
- Frank Vahid & Tony Givargis, *Embedded System Design*, Wiley — HW/SW 協調設計入門
- M. D. Ciletti, *Advanced Digital Design with the Verilog HDL* (2nd ed.), Prentice Hall — Verilog 設計の実践
- Paul Kocher et al., "Spectre Attacks: Exploiting Speculative Execution," IEEE S&P 2019（投機実行攻撃の原著論文）
