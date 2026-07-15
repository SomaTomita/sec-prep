# ネットワークサービス（DNS・HTTP・TLS・PKI）

> 対応科目: Cryptography and Network Security, Cryptographic Protocols ｜ 前: [01 ネットワークスタック](./01_network-stack.md) ｜ 次: [03 確率・統計の基礎](./03_probability-statistics.md) ｜ 層: 基礎(Layer 1)

## 一言で

アプリケーション層のサービス（DNS・HTTP）と、その上に重なる暗号プロトコル（TLS）の関係を掴む。
PKI（公開鍵基盤）は「誰の鍵を信頼するか」を社会的に解決する仕組みであり、
実際の暗号プロトコルが現実ネットワーク上でどこに乗るかを理解する鍵になる。

**この1ページで分かること**

- DNS（ドメイン名→IP 変換）の階層的な名前解決と、平文・認証なしゆえの弱点（キャッシュポイズニング）
- TLS ハンドシェイク（通信開始時に鍵を共有する手順）が TLS 1.2 と 1.3 でどう違うか
- PKI が「この公開鍵は本当にこのドメインのものか」を CA の署名と信頼の連鎖でどう保証するか

---

## 押さえる概念

### DNS（ドメイン名システム）

- **役割**: ドメイン名（`example.com`）を IP アドレスに解決する分散型データベース。
- **仕組み**: クライアント → リゾルバ → ルートサーバ → TLD サーバ → 権威サーバ の階層的問い合わせ。
- **プロトコル**: UDP ポート 53（小さなクエリ）/ TCP ポート 53（大きな応答や AXFR）。
- **セキュリティ上の問題点**: 応答は元来平文・認証なし。
  - DNS キャッシュポイズニング: 偽の応答をキャッシュに注入し、ユーザーを偽サイトへ誘導。
  - DNS スプーフィング（Kaminsky 攻撃 2008 年が有名）。
  - 対策: **DNSSEC**（応答に電子署名を付与）、**DNS over HTTPS/TLS**（通信自体を暗号化）。

#### 名前解決の流れ（ASCII図）

```
① クライアント ──"example.com のIPは?"────────► リゾルバ
② リゾルバ     ──".com は?"───────────────────► ルートサーバ（.）
③ リゾルバ     ◄─"TLDサーバは a.gtld-servers.net"─ ルートサーバ（.）
④ リゾルバ     ──"example.com は?"─────────────► TLDサーバ（.com）
⑤ リゾルバ     ◄─"権威サーバは ns1.example.com"─── TLDサーバ（.com）
⑥ リゾルバ     ──"example.com の Aレコードは?"──► 権威サーバ（ns1.example.com）
⑦ リゾルバ     ◄─"93.184.216.34"───────────────── 権威サーバ（ns1.example.com）
⑧ クライアント ◄─"93.184.216.34"（TTL付きでキャッシュ）─ リゾルバ
```

②〜⑦はリゾルバが階層を1段ずつたどる**反復問い合わせ**。DNSSEC はこの応答④〜⑦それぞれに
電子署名を検証するチェーンを追加する（暗号化ではなく真正性の保証である点に注意）。

### HTTP / HTTPS

- **HTTP（HyperText Transfer Protocol）**: テキストベースのリクエスト/レスポンスプロトコル。
  - バージョン: HTTP/1.1 → HTTP/2 → HTTP/3（QUIC ベース）。
  - 状態なし（ステートレス）。Cookie・セッションで状態を補完。
- **HTTPS = HTTP over TLS**: TLS ハンドシェイクが完了した後、TCP ストリーム上で HTTP が流れる。
  - デフォルトポート: HTTP → 80、HTTPS → 443。
  - 提供する保護: 機密性（盗聴防止）・完全性（改ざん検知）・サーバ認証（証明書）。

### TLS（Transport Layer Security）

- **位置づけ**: TCP（L4）とアプリケーション（L7）の間で動作する暗号化レイヤー。
- **バージョン**: SSL（廃止）→ TLS 1.0/1.1（廃止）→ TLS 1.2（現役）→ **TLS 1.3**（現在の推奨）。

#### ハンドシェイクの大枠（簡略化・TLS 1.2 の実際のメッセージ順）

```
クライアント                                    サーバ
    │── ClientHello ─────────────────────────►│  対応暗号スイート・拡張を提示
    │◄─ ServerHello + Certificate + 鍵交換 ────│  暗号スイート確定＋証明書＋サーバ側鍵情報（例: ECDHE公開値）を同じフライトで返す
    │── 鍵交換（クライアント側公開値）+ Finished►│  双方が共有シークレットを導出し、完全性を確認
    │◄─ Finished ────────────────────────────────│
    │◄══════ 以降は暗号化された Application Data ══════►│
```

サーバは証明書と鍵交換情報をまとめて1回のフライトで返す（クライアントの鍵交換を待たない）。
この4フライトで往復2回（2-RTT）かかるのが TLS 1.2 の構造。
TLS 1.3 では鍵交換をより早い段階（ClientHello/ServerHello自体）に前倒しして 1-RTT に短縮している（下記の詳細を参照）。

- **ハンドシェイクの詳細（TLS 1.3）**:

```
クライアント                     サーバ
  ClientHello            →   （暗号スイート + key_share 拡張）
                         ←   ServerHello（key_share 応答）
                             {EncryptedExtensions}   ← ここから暗号化
                             {Certificate}
                             {CertificateVerify}
                             {Finished}
  （双方が鍵を独立に導出）
  {Finished}             →
  [Application Data]      ↔   [Application Data]
```

`{ }` はハンドシェイクトラフィック鍵で暗号化されたメッセージ。TLS 1.2 と違い、
ServerHello 直後の **EncryptedExtensions** から暗号化が始まり、サーバ証明書も暗号化される。
1往復（1-RTT）で鍵確立が完了するのが TLS 1.3 の要点。

- **提供する保護**:
  - 鍵交換（ECDHE など）: 前方秘匿性（PFS）を提供。
  - サーバ認証: 証明書 → PKI で検証。
  - 暗号化: AES-GCM, ChaCha20-Poly1305 など認証付き暗号（AEAD）。

### PKI（公開鍵基盤）と証明書

- **問題**: Alice の公開鍵が本当に Alice のものかどうかを誰が保証するか？
- **解決**: **認証局（CA）** が「この公開鍵はこのドメインに属する」と署名した **X.509 証明書** を発行。
- **信頼の連鎖（Chain of Trust）**:

```
ルート CA（OSやブラウザに事前インストール）
  └─ 中間 CA
       └─ サーバ証明書（ドメイン名 + 公開鍵 + CA の署名）
```

- **証明書に含まれる主な情報**: Subject（ドメイン名）、公開鍵、発行者（CA）、有効期限、署名アルゴリズム。
- **失効**: CRL（証明書失効リスト）または **OCSP**（オンライン証明書状態プロトコル）で確認。
- **弱点と攻撃面**:
  - 不正 CA または CA の侵害 → 偽証明書を発行できる（DigiNotar 事件 2011 年）。
  - 対策: **Certificate Transparency（CT）**: 発行された証明書を公開ログに記録・監査。

### ポートとソケット

- **ポート番号**: 16ビット（0–65535）。1024未満はウェルノウンポート（要権限）。
  - SSH: 22, SMTP: 25, DNS: 53, HTTP: 80, HTTPS: 443
- **ソケット = IP アドレス + ポート + プロトコル**。TCP 接続は（src IP, src port, dst IP, dst port）の4組で一意に識別。
- セキュリティ的意味: 開いているポートは攻撃面。不要なサービスを閉じることが最小権限原則の実践。

---

## なぜ重要か / コースでの位置づけ

**Cryptography and Network Security**
- SSL/TLS, IPSec が応用例として扱われる。TLS の層モデル上の位置と、ハンドシェイクでどの暗号プリミティブが使われるかを理解することが必須。

**Cryptographic Protocols**
- TLS, IPSec, SSH, Signal, 4G が直接の講義内容。これらが「鍵共有プロトコル + 認証プロトコル + 対称鍵通信」の組み合わせで成立することを PKI の知識と合わせて読む。

**攻撃シナリオとの接続**
- TLS に対する攻撃（BEAST, POODLE, Heartbleed, CRIME/BREACH）はプロトコルの詳細な理解を要求する。プロトコルの弱点分析が試験に出ることも多い。
- DNS スプーフィング → フィッシング → PKI で防ぐ、という防御の連鎖はインフラセキュリティの文脈でも扱われる。

---

## 演習（解答つき）

1. DNSSEC は DNS の問い合わせ・応答を「盗聴されない」ようにするか？ 保証すること／しないことをそれぞれ答えよ。
2. TLS ハンドシェイクで、クライアントはサーバの証明書をどうやって信頼するか（Chain of Trust の観点で）説明せよ。
3. `https://example.com:443` への接続を識別するソケットの4組（4-tuple）を一般形で書け。

<details><summary>解答</summary>

1. DNSSEC が保証するのは応答の**真正性・完全性**（電子署名により改ざん・なりすましを検知できる）のみ。
   **機密性（盗聴防止）は保証しない**——応答は依然として平文で流れる。盗聴を防ぐには DNS over HTTPS/TLS が別途必要。
2. サーバ証明書に付いた CA の署名を検証し、中間 CA → ルート CA へと**信頼の連鎖**をたどる。
   最終的に OS/ブラウザに事前インストールされたルート CA の公開鍵で検証できれば信頼する。
   加えて証明書の Subject（ドメイン名）が接続先ホスト名と一致するかも確認する。
3. `(送信元 IP, 送信元ポート, 宛先 IP, 宛先ポート)` = `(クライアントIP, エフェメラルポート, example.comのIP, 443)`。
   この4組が変われば別のTCP接続として扱われる。

</details>

---

## 次への接続

TLS の安全性は「鍵長がどれだけの探索コストに耐えるか」「ハッシュの衝突確率がどれだけ小さいか」という
確率論的な議論に帰着する（例: SHA-1 の誕生日攻撃、鍵空間の全数探索コスト）。
次ファイルで確率・統計の基礎を固め、この直感を数式で裏付ける。
→ [03 確率・統計の基礎](./03_probability-statistics.md)

---

## つまずき / 深掘り候補

- [ ] TLS 1.3 ハンドシェイクの全フロー → `deep/tls-handshake/`
- [ ] X.509 証明書フォーマットの詳細 → `deep/x509-cert/`
- [ ] DNSSEC の署名チェーン → `deep/dnssec/`
- [ ] OCSP stapling と Certificate Transparency → `deep/cert-transparency/`
- [ ] IPSec のトンネルモードとトランスポートモード → `deep/ipsec-modes/`

---

## 参考

- RFC 8446: The Transport Layer Security (TLS) Protocol Version 1.3 — IETF 一次資料
- RFC 5280: Internet X.509 Public Key Infrastructure Certificate — IETF 一次資料
- Rescorla, E., *SSL and TLS: Designing and Building Secure Systems* (Addison-Wesley, 2001)
- Let's Encrypt による CA/PKI の平易な解説: https://letsencrypt.org/how-it-works/
