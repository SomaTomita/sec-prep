# 03. セキュリティ設計パターンとアーキテクチャ

> 対応科目: Advanced Methods for Security and Privacy by Design ｜ 前: [02 脅威モデリング](./02_threat-modeling.md) ｜ 次: [04 セキュリティテスト](./04_security-testing.md) ｜ 層: 基礎(Layer 1)

[02](./02_threat-modeling.md)で洗い出した脅威に対して、毎回ゼロから対策を設計するのは
非効率で漏れも出やすい。デザインパターンがソフトウェア設計の再利用可能な定石であるように、
**セキュリティ設計パターン**は「よくある脅威への実証済みの構造的解決策」を型として蓄積する。
個々の原則（最小権限・フェイルセーフ等）は[05](./05_secure-by-design.md)で詳述するため、
本ファイルは「原則を組み合わせた構造」と、実例としてSpectre/Meltdownへの
ソフトウェア側多層防御を見る。

---

## 押さえる概念

### 代表的なアーキテクチャパターン

Schumacher et al. (2006) *Security Patterns* が体系化した、エンタープライズ〜実装レベルの
パターン群から、頻出するものを抜粋。

| パターン | 何を解決するか | 対応するSTRIDE脅威 |
|---|---|---|
| Single Access Point / Authentication Enforcer | 認証の入口を1箇所に集約し、迂回経路を作らない | Spoofing |
| Check Point（完全な仲介） | すべてのアクセスを1つの参照モニタで検査する（[`../06_systems-security/03_authn-authz-access-control.md`](../06_systems-security/03_authn-authz-access-control.md)のアクセス制御と接続） | Elevation of Privilege |
| Fail Securely（フェイルセキュア） | エラー時に「開いて」しまうのではなく「閉じて」安全側に倒す | Elevation of Privilege, Information Disclosure |
| Defense in Depth（多層防御） | 単一の防御層が破られても他の層が残るよう、独立した複数の対策を重ねる | 全般 |
| Secure by Default（安全なデフォルト設定） | 設定を変えなければ最も安全な状態で動く | 全般（設定ミスに起因する漏洩の予防） |

これらは互いに排他的ではなく、実際のシステムは複数を組み合わせて使う。次節の
Spectre/Meltdown対策は、まさに「単一の対策では防げないため多層防御で挑む」実例。

### ケーススタディ：Spectre/Meltdownへのソフトウェア側多層防御

[`../04_hardware-security/02_hardware-attacks.md`](../04_hardware-security/02_hardware-attacks.md)
で見た通り、Spectre/Meltdown（2018年1月公開）は投機実行がキャッシュに残す痕跡を悪用する
攻撃。ハードウェア側の対策（マイクロコード更新等）だけでは全変種を防げないため、
**コンパイラ・OS・ハードウェアの異なる層**でそれぞれ独立した緩和策を重ねている——
まさにDefense in Depthの実例。

| 緩和策 | 対応する変種 | 実装される層 | 仕組み |
|---|---|---|---|
| Retpoline（Google, Turner, 2018年1月） | Spectre v2（分岐標的注入） | コンパイラ（間接分岐の書き換え） | 間接分岐を「リターン命令のトランポリン」に置き換え、投機実行が予測不能な先に飛ぶこと自体を防ぐ。ソースコード変更なしで性能劣化がほぼ無い |
| Speculative Load Hardening（Carruth et al., LLVM, 2018年） | Spectre v1（境界チェックバイパス） | コンパイラ（分岐なしのマスキング） | 誤った投機パスに入ったことを示す「汚染フラグ」をデータ経由で追跡し、危険なロードの結果をマスクする。手動対策が困難な大規模・非保守コード向け |
| KPTI／KAISER（Gruss et al., 2017年発表→2018年Linuxマージ） | Meltdown | OS（カーネル） | ユーザ空間実行中はカーネルのページテーブルを見せない（ユーザ用・カーネル用で別々のページテーブルを使う）ことで、投機実行してもマップされていないカーネルメモリには触れられなくする |
| LFENCE挿入 | Speculative Store Bypass（CVE-2018-3639, 2018年5月） | コンパイラ／手動 | ストアとロードの間に投機実行の順序保証命令を挿入し、ストアより先にロードが投機実行されるのを止める |

**どの対策も単独では全変種をカバーできない**（Retpolineはv2向け、SLHはv1向け、KPTIは
Meltdown向け）——脅威モデリング（[02](./02_threat-modeling.md)）で「1つの脆弱性クラスに
複数の攻撃経路がある」と分かった時、パターンとしてのDefense in Depthが必要になる典型例。

---

## なぜ重要か / コースでの位置づけ

この科目はワークショップ形式で「設計レベルでセキュリティ・プライバシーをどう達成するか」
を扱う——本ファイルの「原則から構造への落とし込み」がその実践部分にあたる。
Spectre/Meltdownの事例は[`../04_hardware-security/`](../04_hardware-security/index.md)
（ハードウェア攻撃そのものの機構）と本領域（ソフトウェア側の応答）の橋渡しになる。

---

## 演習（解答つき）

1. Retpoline と KPTI はそれぞれ Spectre と Meltdown のどちらに対する対策か、
   実装される層（コンパイラ/OS）とあわせて述べよ。
2. 「フェイルセキュア」と「フェイルセーフ」が字面は似ているが要求が異なりうる理由を、
   認証システムの例で説明せよ。
3. Defense in Depth が「単一の完璧な対策」より優れているとされる理由を一言で述べよ。

<details><summary>解答</summary>

1. Retpolineはコンパイラレベルの対策でSpectre（v2、分岐標的注入）に対応する。
   KPTIはOS（カーネル）レベルの対策でMeltdownに対応する。両者は異なる脆弱性・異なる層を
   カバーするため、どちらか一方だけでは不十分。
2. フェイルセーフは「人の安全」を優先し、エラー時にドアを開ける（火災時に鍵を開放する等）。
   フェイルセキュアは「情報の機密性」を優先し、エラー時にドアを閉める（認証システムが
   故障したらデフォルトでアクセス拒否にする）。認証システムでは誤って「開いて」しまうと
   なりすましを許すため、通常フェイルセキュアが優先される。
3. 単一の対策は必ずどこかに想定外の抜け穴や新しい攻撃手法で破られうる。独立した複数の層を
   重ねておけば、1つの層が破られても他の層が被害を食い止められるため、システム全体としての
   耐性が個々の対策の総和より高くなる。

</details>

---

## 次への接続

設計段階でパターンを適用しても、実装に欠陥が紛れ込む可能性は残る。
実際にコードやバイナリを検証する手法（静的解析・ファジング・ペネトレーションテスト）を見る。
→ [04 セキュリティテスト](./04_security-testing.md)

---

## つまずき / 深掘り候補

- [ ] Zero Trust Architecture（NIST SP 800-207）とCheck Pointパターンの関係 → `deep/zero-trust/`
- [ ] Speculative Store Bypass以降のSpectre亜種（Spectre-NG群）の分類

---

## 参考

- Schumacher, M., Fernandez-Buglioni, E., Hybertson, D., Buschmann, F., Sommerlad, P. (2006). *Security Patterns: Integrating Security and Systems Engineering*. Wiley.
- Turner, P. (2018). *Retpoline: a software construct for preventing branch-target-injection*. Google Security Blog / LWN.net: https://lwn.net/Articles/742980/
- LLVM Project, *Speculative Load Hardening*: https://llvm.org/docs/SpeculativeLoadHardening.html
- Gruss, D. et al. (2017). *KASLR is Dead: Long Live KASLR*（KAISERの前身研究）; Linux kernel PTI documentation: https://www.kernel.org/doc/html/v5.11/x86/pti.html
- Intel, *Speculative Store Bypass / CVE-2018-3639*: https://www.intel.com/content/www/us/en/developer/articles/technical/software-security-guidance/advisory-guidance/speculative-store-bypass.html
