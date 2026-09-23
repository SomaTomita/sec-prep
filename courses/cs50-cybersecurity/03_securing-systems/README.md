# 03. システムを守る

前講義の暗号部品を実際のネットワークへ適用する。無線 LAN から始め、平文 HTTP で何が漏れるかを見て、HTTPS/TLS と証明書の信頼構造へ進み、VPN・SSH・ファイアウォール・マルウェアまで。主要な敵は一貫して**機械中間者** — あなたと相手の間には必ず他人の機械が並んでいる。

## 読む順

| No | ファイル | 内容 |
|----|---------|------|
| 01 | [Wi-Fi と平文 HTTP](./01_wifi-and-plaintext-http.md) | WPA の暗号化範囲・HTTP は平文・HTML 注入 |
| 02 | [パケット盗聴](./02_packet-sniffing.md) | パケット=封筒・GET/POST の中身・検索語やカード番号の露出 |
| 03 | [クッキーとセッションハイジャック](./03_cookies-and-session-hijacking.md) | ステートレスな HTTP・セッションクッキー・乗っ取り |
| 04 | [HTTPS/TLS と証明書](./04_https-tls-and-certificates.md) | TLS と SSL・サーバ証明書・認証局と信頼の推移 |
| 05 | [SSL stripping と HSTS](./05_ssl-stripping-and-hsts.md) | 最初の一回が HTTP になる隙・紛らわしいドメイン・HSTS |
| 06 | [VPN と SSH](./06_vpn-and-ssh.md) | 暗号トンネル・IP の見え方・SSH による遠隔実行 |
| 07 | [ポート・ファイアウォール・プロキシ](./07_ports-firewalls-and-proxies.md) | ポートスキャン・侵入テスト・FW・DPI・業務端末の証明書 |
| 08 | [マルウェアとボットネット](./08_malware-and-botnets.md) | ウイルスとワーム・ボットネット・DDoS・自動更新・ゼロデイ |

---

前: [02. データを守る](../02_securing-data/README.md) ｜ 次: [04. ソフトウェアを守る](../04_securing-software/README.md)
