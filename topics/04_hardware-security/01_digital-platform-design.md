# 01. ディジタルプラットフォーム設計とセキュリティ

> 対応科目: Design of Digital Platforms: Concepts, Design Seminar ｜ 次: [02 ハードウェア攻撃](./02_hardware-attacks.md) ｜ 層: 基礎(Layer 1)

[`../01_prerequisites/03_hardware-digital-logic/`](../01_prerequisites/03_hardware-digital-logic/00_index.md)
で CMOS・組合せ/順序回路・HDL・パイプライン・メモリ階層という「部品」を見た。
ここではそれらをシステムとして設計する際、**セキュリティが性能・電力・面積と並ぶ
設計上の制約条件**になることを見る。

---

## 設計抽象レベル

```
システムレベル（何を作るか・要件）
  ↓
RTL/振る舞いレベル（HDLで記述、01_prerequisites/03_hdl-and-architecture/01_hdl-basics.md）
  ↓
ゲートレベル（論理合成後、AND/OR/FF等の回路）
  ↓
トランジスタ/物理レベル（CMOSレイアウト、01_prerequisites/01_cmos-logic.md）
```

下位に行くほど詳細だが変更コストが高い。**セキュリティ上の弱点は上位で作り込まれ、
下位（物理レベル）で悪用される**ことが多い——例えば「鍵をどこに置くか」という
システムレベルの決定が、後述のサイドチャネル（[04](./04_side-channels.md)）への
耐性を大きく左右する。

---

## PPA から PPAS へ：セキュリティという第4の軸

古典的な設計指標は **PPA（Power・Performance・Area）** の3つ。
[`../01_prerequisites/03_hardware-digital-logic/01_cmos-logic.md`](../01_prerequisites/03_hardware-digital-logic/01_cmos-logic.md)
で見た `P_dynamic ≈ α · C_L · V_DD² · f` がまさに Power 軸の物理的な根拠だった
（`α` がデータ依存であることが電力サイドチャネルの根本原因、という指摘も既出）。

現代のセキュアなハードウェア設計では、ここに **Security** を第4の軸として明示的に加える:

```
性能を上げる（並列化・投機実行）→ Spectre/Meltdown のような新しい攻撃面を生む（02）
電力を下げる（電圧を絞る）    → フォールト注入への耐性が変わる（02）
面積を減らす（回路を削る）    → マスキング等の対策回路を削らざるを得なくなる（04）
```

**トレードオフの具体例**: [04](./04_side-channels.md) で見るマスキング対策は、
秘密値を複数のランダムな断片に分割して計算する（回路面積・電力・遅延が増える）。
「その追加コストを払ってでもサイドチャネル耐性を確保するか」は、PPAだけでなく
**Security を含めた4軸**で判断する設計上の意思決定になる。

---

## HW/SW 協調設計にセキュリティを組み込む

[`../01_prerequisites/03_hardware-digital-logic/03_hdl-and-architecture/03_memory-hierarchy-and-codesign.md`](../01_prerequisites/03_hardware-digital-logic/03_hdl-and-architecture/03_memory-hierarchy-and-codesign.md)
で見た協調設計フロー（プロファイリング→ハードウェア化判断→FPGA検証→PPA計測）に、
「どこに秘密を置き、何を信頼するか」という判断を組み込む。

```
暗号処理を専用ハードウェアブロックにする場合:
  + ソフトウェアからは見えない専用回路 → キャッシュサイドチャネル（04）から隔離できる
  − 物理的にチップにアクセスされればフォールト注入（02）の標的になりうる
  − 一度チップに焼き込むと脆弱性が見つかっても後から直せない（SWならパッチ可能）

ソフトウェアで実装する場合:
  + バグが見つかれば更新できる
  − CPUの共有キャッシュ・分岐予測器を経由するサイドチャネルに晒される
```

どちらが正しいというより、**何を信頼の基盤（Trusted Computing Base, TCB）に含めるか**を
明示的に選ぶことが設計の核心。TCBは小さいほど検証しやすく、攻撃対象領域が狭まる。
この「何を信頼するか」を物理的に固定する仕組みが root of trust
（[03 セキュリティ部品](./03_security-building-blocks.md)）。

---

## 演習（解答つき）

1. PPAにSecurityを加えた4軸で考えるとき、マスキング対策の追加が悪化させる軸を全て挙げよ。
2. 暗号処理をソフトウェアではなく専用ハードウェアブロックにする利点を一言で述べよ。
3. TCB（信頼の基盤）を小さくすることがセキュリティ上望ましい理由を述べよ。

<details><summary>解答</summary>

1. 回路面積（断片を複数保持・演算するため）、電力（演算回数が増える）、性能（遅延が増える）
   の3つ。Securityは向上する代わりにPower・Performance・Areaが悪化するトレードオフ。
2. ソフトウェアが実行される汎用CPUのキャッシュ・分岐予測器を経由するサイドチャネル
   （[04](./04_side-channels.md)）から、専用回路として隔離できる点。
3. TCBが小さいほど「検証すべきコード・回路の量」が減り、形式検証や監査が現実的になる。
   また攻撃者が付け入る隙（攻撃対象領域）も、信頼している部分が少ないほど狭くなる。

</details>

---

## 次への接続

「何を信頼するか」を設計する前に、まず**攻撃者が実際に何をできるか**を知る必要がある。
物理アクセスのレベル別に攻撃を分類する。
→ [02 ハードウェア攻撃](./02_hardware-attacks.md)

---

## 参考

- Rushby, J. (1981). *Design and Verification of Secure Systems*（TCBの概念の古典）。
