# CMOS 論理・消費電力・遅延

> 対応科目: H0E85A Hardware Security ／ H09J6B Design of Digital Platforms: Concepts ｜ 次: [02 組合せ回路と順序回路](./02_combinational-sequential.md) ｜ 層: 基礎(Layer 1)

## 一言で

CMOS（Complementary MOS）はデジタル IC の標準技術。
pMOS と nMOS を相補的に組み合わせることで低静的電力を実現し、
論理ゲート・フリップフロップ・メモリセルすべての土台になる。
消費電力と動作速度の物理的挙動が、ハードウェアセキュリティの攻撃面と直結する。

## 押さえる概念

### トランジスタの基本

| 種類 | ゲート電圧 High 時 | ゲート電圧 Low 時 |
|---|---|---|
| nMOS | ON（VDD→GND 導通） | OFF |
| pMOS | OFF | ON（VDD 側導通） |

- CMOS インバータ = pMOS（プルアップ）＋ nMOS（プルダウン）の直列スタック
- 定常状態では pMOS か nMOS のどちらかが必ず OFF → 理想的には静的電流ゼロ
  - ただし微細化が進む現代プロセス（≤90nm）ではサブスレッショルドリーク等が無視できず、P_static が全消費電力の 30〜50% を占めることもある（下記 P_static 参照）

#### CMOS インバータの回路構造（ASCII図）

```
                VDD
                 │
             ┌───┴───┐
        A ──►│  pMOS │  プルアップ網（A=0 で ON）
             └───┬───┘
                 ├──────────► Y = NOT A
             ┌───┴───┐
        A ──►│  nMOS │  プルダウン網（A=1 で ON）
             └───┬───┘
                 │
                GND
```

入力 `A` が pMOS・nMOS 両方のゲートに共通で入る。`A=0` なら pMOS が ON・nMOS が OFF で出力 `Y` は VDD（=1）に、
`A=1` ならその逆で `Y` は GND（=0）になる。両方同時に ON になる瞬間（遷移中）だけ貫通電流が流れる（P_short-circuit の正体）。

### 基本論理ゲート（CMOS 実装概略）

| ゲート | 構成 | 真理値表のポイント |
|---|---|---|
| NOT（インバータ） | pMOS 1個 ＋ nMOS 1個 | A=0→Y=1, A=1→Y=0 |
| NAND | pMOS 並列 ＋ nMOS 直列 | 入力が全 1 のときのみ Y=0 |
| NOR | pMOS 直列 ＋ nMOS 並列 | 入力が全 0 のときのみ Y=1 |
| AND / OR | NAND/NOR ＋ INV の組み合わせ | — |

CMOS では NAND の方が NOR より遅延特性が良い（nMOS 直列のプルダウンは pMOS 直列より高速）ため、基本セルとして多用される。

### 消費電力の3成分

```
P_total = P_dynamic + P_short-circuit + P_static

P_dynamic   ≈ α · C_L · V_DD² · f   （スイッチング電力：最支配的）
P_short-circuit  ― スイッチング過渡時に pMOS/nMOS が同時 ON → 貫通電流
P_static    ― サブスレッショルドリーク、ゲート絶縁膜リーク（微細化で増大）
```

- **α**: アクティビティファクタ（1 クロックあたり出力が 0→1 遷移する確率、0〜1）
- **C_L**: 負荷容量（配線容量＋次段入力容量）
- **f**: クロック周波数

暗号実装では α がデータ依存 → 電力波形がデータを漏らす（電力サイドチャネルの根本原因）。

#### 計算例: P_dynamic を具体的な値で求める

```
α    = 0.1        （1クロックで10%の確率で 0→1 遷移）
C_L  = 1 pF  = 1×10⁻¹² F
V_DD = 1 V
f    = 1 GHz = 1×10⁹ Hz

P_dynamic ≈ α · C_L · V_DD² · f
          = 0.1 × (1×10⁻¹² F) × (1 V)² × (1×10⁹ Hz)
          = 0.1 × 1×10⁻³ W
          = 1×10⁻⁴ W = 100 µW
```

ゲート1個あたり 100 µW。チップには数百万〜数十億ゲートが集積されるため、
全体では W〜数十 W オーダーの消費電力になる（動作率 α の低いゲートも多いため単純合計にはならない）。

### 伝搬遅延

- **t_pHL / t_pLH**: 出力が高→低 / 低→高 に変化するまでの遅延
- 主要因: トランジスタのオン抵抗 × 負荷容量（RC 遅延モデル）
- クリティカルパス: 組合せ回路の最長遅延パス → クロック周期の下限を決定

タイミング攻撃は演算時間の差（= パス遅延の差）を観測する。

### 設計指標のトレードオフ（PPA）

| 指標 | 英語表記 | 上げる手段 | 代償 |
|---|---|---|---|
| 性能 | Performance | V_DD 上昇・高 f | 消費電力増大 |
| 消費電力 | Power | V_DD 低下・f 低下 | 性能低下 |
| 面積 | Area | ゲート縮小 | リーク増大・製造コスト |

H09J6B の中心テーマ「遅延・スループット・面積・エネルギー・柔軟性のトレードオフ」はここが出発点。

## なぜ重要か / コースでの位置づけ

### H0E85A Hardware Security への直接接続

1. **電力サイドチャネル攻撃（SPA/DPA）**  
   AES の S-box 演算で α（スイッチングアクティビティ）がデータ依存 → 電力波形を測定して鍵ビットを推定できる。
   対策（マスキング・デュアルレール回路）も CMOS の電力モデルを知らないと理解できない。

2. **タイミングサイドチャネル攻撃**  
   クリティカルパス遅延がデータ依存する乗算器・比較器は、演算時間を計測されて秘密情報が漏れる。

3. **PUF（Physical Unclonable Function）**  
   製造ばらつき（トランジスタ特性の個体差）を意図的に利用した識別子。
   CMOS の遅延ばらつきが「指紋」になる（→ `deep/puf/` 候補）。

### H09J6B Design of Digital Platforms への接続

設計フロー全体の消費電力・遅延見積もりは CMOS の基礎モデルに基づく。
HW/SW 協調設計でも「どこをハードウェアにするか」の判断に電力・遅延の直感が必要。

## 演習（解答つき）

1. 上記の計算例で `V_DD` だけを 2 倍（1V→2V）にすると、`P_dynamic` は何倍になるか。理由も述べよ。
2. `α=0.2`、`C_L=2 pF`、`V_DD=0.8 V`、`f=2 GHz` のとき、`P_dynamic` を求めよ。
3. なぜ CMOS の静的電力は理想的にはゼロだが、現実の微細プロセスではゼロにならないのか。

<details><summary>解答</summary>

1. `P_dynamic ∝ V_DD²` なので、`V_DD` を2倍にすると **4倍**になる（他条件が同じ場合）。
   `f` や `C_L` の1乗比例と違い、`V_DD` は2乗で効くため低電圧化が省電力設計で最優先される。
2. `P_dynamic ≈ 0.2 × (2×10⁻¹² F) × (0.8 V)² × (2×10⁹ Hz)`
   `= 0.2 × 2×10⁻¹² × 0.64 × 2×10⁹`
   `= 5.12×10⁻⁴ W = 512 µW`
3. インバータの pMOS/nMOS は定常状態でどちらか一方が完全に OFF になる想定だが、
   微細化するとチャネル長が短くなり OFF 状態でもサブスレッショルドリーク電流が流れる。
   ゲート絶縁膜も薄くなりトンネル電流（ゲートリーク）も増える。これらが P_static の正体。

</details>

## 次への接続

CMOS の電力・遅延モデルは、この後の組合せ回路・順序回路のタイミング制約（セットアップ/ホールド時間）の物理的根拠になる。
→ [02 組合せ回路と順序回路](./02_combinational-sequential.md)

## つまずき / 深掘り候補

- [ ] スタティック CMOS vs ダイナミック CMOS → `deep/cmos-advanced/`
- [ ] パワーゲーティング・クロックゲーティングの実装 → `deep/low-power-design/`
- [ ] PUF の設計と評価指標（uniqueness, reliability） → `deep/puf/`
- [ ] DPA（差分電力解析）の具体的手順 → `../../04_hardware-security/04_side-channels.md` 参照後に `deep/dpa/`

## 参考

- Neil Weste & David Harris, *CMOS VLSI Design: A Circuits and Systems Perspective* (4th ed.), Addison-Wesley — CMOS 設計の標準教科書
- Jan M. Rabaey et al., *Digital Integrated Circuits: A Design Perspective* (2nd ed.), Prentice Hall
- KU Leuven H09J6B シラバス: https://onderwijsaanbod.kuleuven.be/syllabi/e/H09J6BE.htm
- KU Leuven H0E85A シラバス: https://onderwijsaanbod.kuleuven.be/syllabi/e/H0E85AE.htm
- Paul Kocher et al., "Differential Power Analysis," CRYPTO 1999（DPA 原著論文）
