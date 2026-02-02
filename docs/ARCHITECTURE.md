# ARCHITECTURE.md - 技術設計・データモデル

## 技術スタック

| カテゴリ | 技術 | バージョン |
|----------|------|-----------|
| フレームワーク | React | 19 |
| 言語 | TypeScript | - |
| ビルドツール | Vite | 7 |
| テスト | Vitest + React Testing Library | - |
| ルーティング | React Router | v7 |
| PWA | vite-plugin-pwa | - |
| リンター | ESLint + Prettier | - |

## ルーティング

| パス | ページ | 説明 |
|------|--------|------|
| `/` | TopPage | トップページ（ジャンル選択） |
| `/rankings/:genre` | YearSelectPage | 年・年代選択 |
| `/rankings/:genre/:year` | RankingListPage | 年別ランキング |
| `/rankings/:genre/decade/:decade` | RankingListPage | 年代別ランキング |
| `/songs/:genre/:songId` | SongDetailPage | 曲詳細 |
| `/search` | SearchPage | 検索 |

## データモデル

### 型定義（`src/types/index.ts`）

```typescript
type Genre = 'jpop' | 'western'

interface Artist {
  id: string
  name: string
  nameEn?: string
}

interface Song {
  id: string
  title: string
  artist: Artist
  genre: Genre
  cdInfo?: CdInfo
  externalLinks?: ExternalLinks
}

interface RankingEntry {
  rank: number
  song: Song
  year?: number
}

interface Ranking {
  year: number
  genre: Genre
  entries: RankingEntry[]
}

interface SongDetail {
  song: Song
  rankingYear: number
  rank: number
  cdInfo?: CdInfo
  externalLinks?: ExternalLinks
  artistSongs?: RankingEntry[]
}

interface CdInfo {
  title: string
  type: 'single' | 'album'
  releaseDate?: string
}

interface ExternalLinks {
  amazon?: string
  appleMusic?: string
}
```

## データ構造（静的JSON）

```
public/data/
├── index.json                      # 全ランキングファイルのインデックス
├── rankings/
│   ├── 2024-jpop.json             # {year, genre, entries[100]}
│   ├── 2024-western.json
│   └── ...                        # 計102ファイル
└── songs/
    ├── jpop-2024-01.json          # {song, rankingYear, rank, cdInfo?, externalLinks?, artistSongs?}
    ├── jpop-2024-02.json
    └── ...                        # 計約10,000ファイル
```

- ランキングファイル: `{year}-{genre}.json`
- 楽曲詳細ファイル: `{genre}-{year}-{NN}.json`（NNは2桁の順位）

## アーキテクチャ

### ページ → サービス → データ

```
Pages (UI)
  ├── TopPage          → 静的表示のみ
  ├── YearSelectPage   → 静的表示のみ（定数から生成）
  ├── RankingListPage  → rankingService.fetchRankingByYear / fetchRankingsByDecade
  ├── SongDetailPage   → songService.fetchSongDetail
  └── SearchPage       → searchService.fetchAllSongs / searchSongs
```

### サービス層（`src/services/`）

| サービス | 関数 | 説明 |
|----------|------|------|
| rankingService | `fetchRankingByYear(year, genre)` | 年別ランキング取得 |
| rankingService | `fetchRankingsByDecade(decade, genre)` | 年代別ランキング取得（複数年結合） |
| songService | `fetchSongDetail(songId)` | 楽曲詳細取得 |
| searchService | `fetchAllSongs()` | 全楽曲読み込み |
| searchService | `searchSongs(songs, query)` | クライアントサイド検索（純粋関数） |

### フック（`src/hooks/`）

| フック | 用途 |
|--------|------|
| `useOnlineStatus` | オンライン/オフライン状態検知 |

### コンポーネント（`src/components/`）

| コンポーネント | 用途 |
|---------------|------|
| `OfflineBanner` | オフライン時の警告バナー |

### ユーティリティ（`src/utils/`）

| ユーティリティ | 用途 |
|---------------|------|
| `validateRanking` | ランキングデータのバリデーション（必須フィールド、ジャンル、順位の一意性・連続性） |

## 定数

定数は各ファイル内で定義:

| 定数 | 定義場所 | 内容 |
|------|----------|------|
| `GENRE_LABELS` | YearSelectPage | `{jpop: '邦楽', western: '洋楽'}` |
| `DECADES` | YearSelectPage | 6年代の定義（label, value） |
| `START_YEAR` / `END_YEAR` | YearSelectPage | 1975 / 2025 |
| `DECADE_YEARS` | rankingService | 年代→年配列のマッピング |

## PWA設定

| 項目 | 値 |
|------|-----|
| 登録方式 | autoUpdate |
| キャッシュ対象 | `/data/**/*.json` |
| キャッシュ戦略 | CacheFirst |
| 最大エントリ数 | 1000 |
| 有効期限 | 30日 |

## スタイリング

- CSS Modules（`*.module.css`）によるコンポーネントスコープのスタイル
- グローバルCSSなし
