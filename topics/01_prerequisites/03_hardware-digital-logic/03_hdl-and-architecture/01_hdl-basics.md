# 01. HDL の役割と設計フロー（Verilog/VHDL・FPGA/ASIC）

> 親: [README](./README.md) ｜ 次: [02 パイプラインとハザード](./02_pipelining-and-hazards.md) ｜ 層: 基礎(Layer 1)

`../02_combinational-sequential.md` で見た組合せ回路・D フリップフロップを、実際にどう
「コード」として書き、どうチップになるかがここでのテーマ。HDL（ハードウェア記述言語）は
回路をテキストで記述・シミュレート・合成するための言語で、Design Seminar（H0Q34A）の
FPGA 実習はこの記述と合成フローの理解が前提になる。

---

## HDL とは何か

| 観点 | 内容 |
|---|---|
| 目的 | 回路動作をテキスト（コード）で記述・シミュレート・合成する |
| 主要言語 | **Verilog** / **VHDL**（業界標準。どちらも知っておくと良い） |
| SystemVerilog | Verilog の上位互換。検証（テストベンチ）機能が豊富 |

KU Leuven の設計科目は Verilog/VHDL 両方を扱う可能性がある（シラバスに明記なし）。
どちらも「組合せ回路は assign・並行処理、順序回路は always/process・順次処理」という
構造理解が核心（`../02_combinational-sequential.md` の分類がそのままコードの書き分けに対応する）。

### Verilog の最小コード例（D フリップフロップ、同期リセット付き）

```verilog
module dff (
    input  clk, rst_n, d,
    output reg q
);
    always @(posedge clk) begin
        if (!rst_n) q <= 1'b0;
        else        q <= d;
    end
endmodule
```

- `always @(posedge clk)` → 同期設計の基本イディオム
- ノンブロッキング代入 `<=` は順序回路の記述に使う（ブロッキング `=` と混在させない）

### VHDL の特徴（比較）

```vhdl
-- VHDL は型に厳格で、大規模設計の検証に向く
entity dff is
    port (clk, rst_n, d : in  std_logic;
          q             : out std_logic);
end entity;
architecture rtl of dff is
begin
    process(clk)
    begin
        if rising_edge(clk) then
            if rst_n = '0' then q <= '0';
            else                q <= d;
            end if;
        end if;
    end process;
end architecture;
```

同じ D-FF でも、Verilog は `always` ブロック 1 つで書ける一方、VHDL は `entity`（インタフェース）
と `architecture`（中身）を分離する。この分離が大規模設計での型検証・再利用性に効いてくる。

---

## 設計フロー（RTL → 実装）

```
仕様 → RTL (HDL 記述) → 論理合成 → ゲートネットリスト
     → 配置配線 → タイミング解析 → ビットストリーム (FPGA) or マスクデータ (ASIC)
```

- **論理合成**: HDL を標準セルライブラリに割り当てる。Synopsys Design Compiler / Yosys（OSS）
- **タイミング解析（STA）**: スタティックタイミング解析でセットアップ/ホールド違反を検出
  （`../02_combinational-sequential.md` のタイミング制約がここで機械的に検証される）
- **FPGA**: 現場書き換え可能。プロトタイプ・教育用途に多用（H0Q34A のセミナーで使用）
- **ASIC**: 専用チップ。量産コスト低・性能最大化。設計変更不可

## FPGA vs ASIC

| 観点 | FPGA | ASIC |
|---|---|---|
| 柔軟性 | 高（再プログラム可） | 低（設計固定） |
| 性能 | 中（LUT のオーバーヘッド） | 高 |
| コスト（少量） | 低 | 非常に高（マスク代） |
| コスト（大量） | 高 | 低 |
| セキュリティ用途 | 迅速なプロトタイプ・研究 | 製品（HSM, セキュアエレメント） |

HDL 自体は同じでも、合成先を FPGA にするか ASIC にするかで最適化方針が変わる。
暗号コアを ASIC のセキュアエレメントとして焼き込む場合、電力マスキング等の対策も
この段階で回路構造に織り込む必要がある（詳細は
[`../../../04_hardware-security/04_side-channels.md`](../../../04_hardware-security/04_side-channels.md)）。

---

## 演習（解答つき）

1. D フリップフロップの記述で、ノンブロッキング代入 `<=` ではなくブロッキング代入 `=` を
   使うとなぜ問題になりうるか。
2. 設計フローの中で「セットアップ/ホールド違反」を検出するのはどのステップか。
3. 少量生産の研究用プロトタイプと、量産するセキュアエレメント製品、それぞれに向くのは
   FPGA と ASIC のどちらか。

<details><summary>解答</summary>

1. ブロッキング代入は文が順番に即座に評価されるため、複数の always ブロックや複数信号の
   同時更新を意図した順序回路では意図しない中間値の伝播やシミュレーション/合成結果の不一致を
   招きやすい。ノンブロッキング代入はすべての右辺値を評価してから一斉に代入するため、
   「クロックエッジで全レジスタが同時に更新される」という順序回路の意味論と一致する。
2. **タイミング解析（STA）**。配置配線後のネットリストに対して静的にパス遅延を計算し、
   クロック周期に対する違反を検出する。
3. 研究用プロトタイプは変更が多く量産しないため **FPGA** が向く。量産するセキュアエレメントは
   性能・電力・単価を最適化でき設計も固定してよいため **ASIC** が向く。

</details>

---

## 次への接続

HDL で書けるのは D-FF や加算器といった部品まで。これらを組み合わせて「命令を1つずつ
流れ作業で処理する」パイプラインを作ると CPU になる。
→ [02 パイプラインとハザード](./02_pipelining-and-hazards.md)
