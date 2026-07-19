# Tokyo-Life-ROI-mock

<!-- Vercel redeploy check: 2026-07-14 -->

Tokyo Life ROI のハッカソン応募用フロントエンドモックです。

## Setup

```bash
npm install
npm run dev
```

Vite のローカル開発サーバーで起動します。

## Version 11: ROI Quest Map

V11は、東京都内の実在スポットを2D地図上のクエストとして探索する操作可能なモックです。

- LeafletとOpenStreetMapタイルを使用
- Geolocation APIによる現在地取得と東京駅のデモ位置
- 実在スポット24件、価値観別クエスト、疑似チェックイン
- My ROI 58から61への上昇と、複合クエスト解放
- 東京図鑑、My ROI履歴、トロフィー、V11専用設定
- 進捗は`localStorage`に保存し、設定画面からリセット可能

直接開くURL:

```text
http://localhost:5173/?version=quest-map
```

`?version=11`でも表示できます。地図タイルの表示にはインターネット接続が必要です。位置情報を拒否した場合も東京駅のデモ位置で利用できます。
