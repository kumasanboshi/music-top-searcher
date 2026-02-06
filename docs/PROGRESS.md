# 進捗記録

## Issue #35: 各年のランキングページに100曲以上表示されてしまう ✅

### 実施内容

- `src/utils/validateRanking.ts` - 100件超過のバリデーションエラーを追加
- `src/services/rankingService.ts` - `fetchRankingByYear()`で100件に制限（防御的実装）
- `src/__tests__/validateRanking.test.ts` - 100件上限チェックのテスト3件を追加
- `src/__tests__/rankingService.test.ts` - 100件制限のテスト3件を追加

### 検証結果

| コマンド | 結果 |
|---------|------|
| `npm test` | ✅ 125 tests passed |
| `npm run lint` | ✅ エラーなし |
| `npm run typecheck` | ✅ エラーなし |

### コミット履歴

| ハッシュ | メッセージ |
|---------|-----------|
| `3e2fa7f1` | test: validateRankingに100件上限チェックのテストを追加 |
| `cfddf095` | feat: validateRankingに100件上限チェックを実装 |
| `41d9db58` | test: rankingServiceに100件制限のテストを追加 |
| `41aca9ef` | feat: fetchRankingByYearに100件制限を実装 |
| `c271b80b` | Merge pull request #36 |
| `c1d254da` | fix: ランキングデータの重複問題を修正（スクリプト修正+データ再生成） |

### 備考

- 根本原因: `create-batch-files.mjs`が既存エントリ全件（100件）を読み込んだ後、11〜100を追加していた（結果190件）
- 対策1: スクリプトを修正し、既存エントリから1〜10のみを使用するよう変更
- 対策2: 全年度のランキングデータを再生成（各年100件に修正）
- 対策3: サービス層で100件に制限する防御的実装を追加
- `fetchRankingsByDecade`は内部で`fetchRankingByYear`を使用するため、自動的に100件制限が適用される
- 将来的な改善候補: `MAX_RANKING_ENTRIES`定数の共通化（現在は2箇所で重複定義）

## Issue #28: AmazonリンクをAmazon MusicとCD商品で分離する ✅

### 実施内容

- `src/types/index.ts` - `ExternalLinks` 型を変更（`amazon` → `amazonMusic` + `amazonCD`）
- `src/pages/SongDetailPage.tsx` - Amazon MusicリンクとAmazon CDリンクを個別に表示
- `src/__tests__/SongDetailPage.test.tsx` - テスト更新（Amazonリンクテストを2つに分離）
- `src/__tests__/SongDetailPage.offline.test.tsx` - モックデータとアサーションを更新
- `src/__tests__/types.test.ts` - ExternalLinksテストを更新
- `src/__tests__/songService.test.ts` - モックデータを更新
- `scripts/generate-data.mjs` - データ生成スクリプトを更新
- 全楽曲データ（約10,000件）を新しい構造で再生成

### 検証結果

| コマンド | 結果 |
|---------|------|
| `npm test` | ✅ 93 tests passed |
| `npm run lint` | ✅ エラーなし |
| `npm run typecheck` | ✅ エラーなし |

### コミット履歴

| ハッシュ | メッセージ |
|---------|-----------|
| `632b230d` | test: Amazon Music/CDリンク分離のテストを追加 |
| `f9e071ca` | feat: AmazonリンクをAmazon MusicとCD商品で分離 |
| `76cf7ebf` | Merge pull request #32 |

### 備考

- Amazon Musicはストリーミングサービス、Amazon CDは物理CD購入ページを想定
- 各リンクはオプショナルで、存在する場合のみ表示される

## Issue #27: YouTube検索リンクを追加する ✅

### 実施内容

- `src/pages/SongDetailPage.tsx` - 外部リンクセクションにYouTube検索リンクを追加。表示条件を`isOnline`のみに変更し、externalLinksが未定義でもYouTubeリンクを常に表示
- `src/__tests__/SongDetailPage.test.tsx` - YouTube検索リンクのテスト2件を追加（正常表示、externalLinks未定義時の表示）

### 検証結果

| コマンド | 結果 |
|---------|------|
| `npm test` | ✅ 92 tests passed |
| `npm run lint` | ✅ エラーなし |
| `npm run typecheck` | ✅ エラーなし |

### コミット履歴

| ハッシュ | メッセージ |
|---------|-----------|
| `70b2b1d3` | test: YouTube検索リンクのテストを追加 |
| `c4990f56` | feat: YouTube検索リンクを楽曲詳細ページに追加 |
| `4a6771b0` | Merge pull request #31 |

### 備考

- YouTube検索URLは`encodeURIComponent(artist + ' ' + title)`で動的生成（JSONデータ変更不要）
- 検証サブエージェントにより、日本語アーティスト名・特殊文字のテストケース追加、URL生成のユーティリティ関数抽出が改善候補として指摘

## Issue #25: CD情報にアルバム情報を追加する ✅

### 実施内容

- `src/pages/SongDetailPage.tsx` - CD種別を日本語ラベル（シングル/アルバム）で表示するよう変更
- `src/__tests__/SongDetailPage.test.tsx` - アルバム表示テストを追加、既存テストを日本語ラベルに対応
- `scripts/create-batch-files.mjs` - アルバムタイトルテンプレート追加、全エントリにアルバム情報を生成
- `scripts/generate-data.mjs` - cdInfo配列にアルバムエントリを出力するよう修正
- 全楽曲データ（約10,000件）を再生成

### 検証結果

- test: ✅ 90テスト全通過
- lint: ✅ エラーなし
- typecheck: ⚠️ 既存エラーあり（validateRanking.test.tsのfs/path import、Issue #25とは無関係）

### コミット履歴

- `33abbcba` test: CD情報のアルバム表示テストを追加
- `9e447d8b` feat: CD情報にアルバム情報を追加
- `e5f609ff` Merge pull request #30

### 備考

- 型定義（`type: 'single' | 'album'`）は既に対応済みだったため変更不要
- 将来EP等の種別追加時はternary演算子をmapオブジェクトに置き換えることを推奨

## Issue #1: プロジェクト初期セットアップ（React + TypeScript） ✅

### 実施内容

- Vite 7 + React 19 + TypeScript でプロジェクトをスキャフォールド
- 追加パッケージをインストール
  - dependencies: `react-router-dom`
  - devDependencies: `vitest`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`, `jsdom`, `prettier`, `eslint-config-prettier`
- ディレクトリ構造を作成（`components/`, `pages/`, `services/`, `hooks/`, `types/`, `utils/`, `constants/`, `__tests__/integration/`）
- 設定ファイルを整備
  - `vitest.config.ts`: globals, jsdom, setupFiles
  - `tsconfig.app.json`: `vitest/globals` types追加
  - `.prettierrc`: semi:false, singleQuote:true, trailingComma:all
  - `eslint.config.js`: prettier連携追加
  - `package.json`: test, test:watch, format, format:check, typecheck スクリプト追加
- `index.html`: `lang="ja"`, title="Music Top Searcher"
- `src/App.tsx`: BrowserRouter + Routes の最小構成
- `src/__tests__/App.test.tsx`: "Music Top Searcher" 表示確認テスト
- `CLAUDE.md`: プロジェクト名・Tech Stack・Key Commands を更新
- Viteテンプレートの不要ファイルを削除（App.css, index.css, react.svg, vite.svg）

### 検証結果

| コマンド | 結果 |
|---------|------|
| `npm test` | ✅ 1 test passed |
| `npm run build` | ✅ 成功 |
| `npm run lint` | ✅ エラーなし |
| `npm run typecheck` | ✅ エラーなし |

### コミット履歴

| コミット | メッセージ |
|---------|-----------|
| `bb8017e` | test: Appコンポーネントの表示テストを追加 |
| `f4e6e27` | feat: プロジェクト初期セットアップ（React + TypeScript + Vite） |

### 備考

- Vite v7 + Vitest v4 の組み合わせでは `vite.config.ts` に `test` プロパティを直接書けないため、`vitest.config.ts` を別ファイルとして作成
- git config はリポジトリローカルに設定（name: kumasanboshi, email: kumasanboshi@users.noreply.github.com）

## Issue #4: トップページの実装 ✅

### 実施内容

- `src/pages/TopPage.tsx`: トップページコンポーネントを作成
  - アプリタイトル「Music Top Searcher」を `<h1>` で表示
  - 「邦楽」「洋楽」の2つのジャンル選択リンクボタンを表示
  - 邦楽 → `/rankings/jpop`、洋楽 → `/rankings/western` へ遷移
- `src/pages/TopPage.module.css`: CSS Modulesでスタイリング
- `src/App.tsx`: ルーティング更新（ルートパスにTopPageを設定、h1をTopPageに移動）
- `src/__tests__/TopPage.test.tsx`: 5つのテストケース
  - アプリタイトル表示、邦楽/洋楽ボタン表示、各リンク先の検証

### 検証結果

| コマンド | 結果 |
|---------|------|
| `npm test` | ✅ 29 tests passed |
| `npm run lint` | ✅ エラーなし |
| `npm run typecheck` | ⚠️ 既存ファイル(validateRanking.test.ts)のNode.js型エラーのみ（今回の変更とは無関係） |

### コミット履歴

| コミット | メッセージ |
|---------|-----------|
| `f0e61ed` | test: TopPageのテストを追加 |
| `a89a7e8` | feat: TopPageコンポーネントを実装 |
| `ee2ad40` | feat: App.tsxにTopPageルーティングを設定 |

### 備考

- 検証サブエージェントにより、ジャンルのルートパス・ラベルを定数ファイルに抽出すると保守性が向上するとの指摘あり（今後の改善候補）

## Issue #5: 年・年代選択ページの実装 ✅

### 実施内容

- `src/pages/YearSelectPage.tsx`: 年・年代選択ページコンポーネントを作成
  - URLパラメータ `genre` から邦楽/洋楽を判定しタイトル表示（例:「邦楽 - 年を選択」）
  - 年代別セクション: 6つのボタン（70年代後半〜20年代）→ `/rankings/:genre/decade/:decade`
  - 年別セクション: 1975〜2025の51個のボタン → `/rankings/:genre/:year`
- `src/pages/YearSelectPage.module.css`: CSS Modulesでスタイリング（flex-wrap対応）
- `src/App.tsx`: ルート追加（`/rankings/:genre` → YearSelectPage）
- `src/__tests__/YearSelectPage.test.tsx`: 6つのテストケース
  - 邦楽/洋楽タイトル表示、年代別ボタン表示(6つ)、年別ボタン表示(1975〜2025)、年代別/年別リンク先検証

### 検証結果

| コマンド | 結果 |
|---------|------|
| `npm test` | ✅ 35 tests passed |
| `npm run lint` | ✅ エラーなし |
| `npm run typecheck` | ⚠️ 既存ファイル(validateRanking.test.ts)のNode.js型エラーのみ（今回の変更とは無関係） |

### コミット履歴

| コミット | メッセージ |
|---------|-----------|
| `ee95717` | test: YearSelectPageのテストを追加 |
| `f111f59` | feat: YearSelectPageを実装 |
| `b28cda2` | feat: App.tsxにYearSelectPageルーティングを設定 |

### 備考

- 検証サブエージェントにより、不正ジャンルのフォールバック動作（genre値をそのまま表示）のテストが未カバーとの指摘あり（今後の改善候補）

## Issue #6: ランキング一覧ページの実装 ✅

### 実施内容

- `src/services/rankingService.ts`: ランキングデータ取得サービスを作成
  - `fetchRankingByYear(year, genre)`: 年別ランキングJSON取得（404/エラー時はnull）
  - `fetchRankingsByDecade(decade, genre)`: 年代の各年データを取得・結合
- `src/pages/RankingListPage.tsx`: ランキング一覧ページコンポーネントを作成
  - 年別（`/rankings/:genre/:year`）と年代別（`/rankings/:genre/decade/:decade`）の両対応
  - ローディング・エラー・データ表示の状態管理
  - 各曲は `/songs/:genre/:songId` へのリンク付き
- `src/pages/RankingListPage.module.css`: CSS Modulesでスタイリング
- `src/App.tsx`: 2つのルート追加
- `src/__tests__/rankingService.test.ts`: 8つのテストケース
  - 正常取得、404エラー、ネットワークエラー、年代→年範囲変換、複数年結合、データなしスキップ
- `src/__tests__/RankingListPage.test.tsx`: 9つのテストケース
  - タイトル表示（邦楽/洋楽）、エントリ表示、リンク先検証、ローディング、エラー、年代別表示

### 検証結果

| コマンド | 結果 |
|---------|------|
| `npm test` | ✅ 52 tests passed |
| `npm run lint` | ✅ エラーなし |
| `npm run typecheck` | ⚠️ 既存ファイル(validateRanking.test.ts)のNode.js型エラーのみ（今回の変更とは無関係） |

### コミット履歴

| コミット | メッセージ |
|---------|-----------|
| `7ccc132` | test: RankingListPageのテストを追加 |
| `df5d5b8` | feat: RankingListPageを実装 |
| `555c0f6` | feat: App.tsxにRankingListPageルーティングを設定 |

### 備考

- 検証サブエージェントにより、loading/errorの状態管理をenum型に統合する改善案、useRankingData カスタムフック抽出の提案あり（今後の改善候補）

## Issue #7: 曲の詳細ページの実装 ✅

### 実施内容

- `src/types/index.ts`: `SongDetail` 型追加、`RankingEntry` に `year?` プロパティ追加
- `src/services/songService.ts`: `fetchSongDetail(songId)` を作成（JSONフェッチ、404/エラー時はnull）
- `src/pages/SongDetailPage.tsx`: 曲詳細ページコンポーネントを作成
  - 曲名・アーティスト名・ランキング順位/年の表示
  - CD情報セクション（cdInfoがある場合のみ表示）
  - 外部リンクセクション（Amazon/Apple Music、リンクがある場合のみ表示）
  - 同アーティストの他のランクイン曲セクション
  - ローディング・エラー状態の表示
- `src/pages/SongDetailPage.module.css`: CSS Modulesでスタイリング
- `src/App.tsx`: ルート追加（`/songs/:genre/:songId` → SongDetailPage）
- `public/data/songs/jpop-2024-01.json`, `jpop-2024-02.json`: サンプルデータ
- `src/__tests__/songService.test.ts`: 3つのテストケース
  - 正常取得、存在しない曲でnull、ネットワークエラーでnull
- `src/__tests__/SongDetailPage.test.tsx`: 10のテストケース
  - 曲名/アーティスト表示、順位/年表示、CD情報表示、Amazon/Apple Musicリンク、同アーティスト曲、リンクなし/CDなし時の非表示、ローディング、エラー

### 検証結果

| コマンド | 結果 |
|---------|------|
| `npm test` | ✅ 65 tests passed |
| `npm run lint` | ✅ エラーなし |
| `npm run typecheck` | ✅ エラーなし |

### コミット履歴

| コミット | メッセージ |
|---------|-----------|
| `1cdc402` | test: SongDetailPageとsongServiceのテストを追加 |
| `765fda4` | feat: SongDetailPageを実装 |

### 備考

- 検証サブエージェントにより以下の改善候補が指摘:
  - テスト用mockデータの共通化（fixtures抽出）
  - SongDetailPageのSRP改善（CD情報/外部リンク/アーティスト曲を子コンポーネントに分離）
  - 外部リンクのURLバリデーション（`javascript:`プロトコル防止）
  - 空配列（`cdInfo: []`, `artistSongs: []`）のテストケース追加

## Issue #8: 検索機能の実装 ✅

### 実施内容

- `src/services/searchService.ts`: 検索サービスを作成
  - `fetchAllSongs()`: index.jsonから全ランキングファイルを取得し、全エントリを結合して返す
  - `searchSongs(songs, query)`: 純粋関数。title, artist.name, artist.nameEnに対する部分一致検索（大文字小文字無視）
- `src/pages/SearchPage.tsx`: 検索ページコンポーネントを作成
  - テキスト入力欄でインクリメンタルサーチ（300msデバウンス）
  - 結果リスト：ランク、曲名、アーティスト名を表示
  - 各結果は `/songs/:genre/:songId` へのリンク
  - 該当なし時のメッセージ表示、読み込み中表示
- `src/pages/SearchPage.module.css`: CSS Modulesでスタイリング
- `src/App.tsx`: `/search` ルート追加
- `src/pages/TopPage.tsx`: TopPageに「曲を検索」リンクを追加
- `src/pages/TopPage.module.css`: 検索リンクのスタイル追加
- `src/__tests__/searchService.test.ts`: 8つのテストケース
  - 全データ結合、データ取得失敗時空配列、曲名/アーティスト名部分一致、大文字小文字無視、空クエリ、該当なし、nameEn検索
- `src/__tests__/SearchPage.test.tsx`: 6つのテストケース
  - 検索入力欄表示、クエリ入力で結果表示、曲名・アーティスト名含有、詳細ページリンク、該当なしメッセージ、読み込み中表示

### 検証結果

| コマンド | 結果 |
|---------|------|
| `npm test` | ✅ 79 tests passed |
| `npm run lint` | ✅ エラーなし |
| `npm run typecheck` | ⚠️ 既存ファイル(validateRanking.test.ts)のNode.js型エラーのみ（今回の変更とは無関係） |

### コミット履歴

| コミット | メッセージ |
|---------|-----------|
| `2235dfd` | test: searchServiceのテストを追加 |
| `517b6a9` | feat: searchServiceを実装 |
| `421dafb` | test: SearchPageのテストを追加 |
| `f20d6ff` | feat: SearchPageを実装し、検索ルートとTopPageからの導線を追加 |
| `00d948b` | refactor: SearchPageのデバウンスをuseCallbackに移行してlintエラーを修正 |

### 備考

- 検証サブエージェントにより以下の改善候補が指摘:
  - 重複曲の排除（同一曲が複数ランキングに含まれる場合の重複表示）
  - データ取得失敗時のエラーUI表示（現状は空ページ）
  - デバウンス遅延の定数化（300msマジックナンバー）
  - テスト用mockデータの共通化（searchService.testとSearchPage.testで重複）

## Issue #9: PWA対応（オフライン機能） ✅

### 実施内容

- `src/hooks/useOnlineStatus.ts`: オンライン/オフライン検知カスタムフックを作成
  - `navigator.onLine`の初期値取得、`online`/`offline`イベントリスナーで状態更新
- `src/components/OfflineBanner.tsx`: オフライン時警告バナーコンポーネント
  - `role="alert"`でアクセシビリティ対応、「オフラインモード - 広告・外部リンクが利用できません」表示
- `src/components/OfflineBanner.module.css`: バナーのスタイル（黄色背景）
- `src/pages/SongDetailPage.tsx`: オフライン時に外部リンクセクションを非表示に変更
- `vite.config.ts`: `vite-plugin-pwa`設定追加
  - マニフェスト: name="Music Top Searcher", short_name="MusicSearch", theme_color="#1f2937", display="standalone"
  - ランタイムキャッシュ: `/data/**/*.json` → CacheFirst（30日、最大1000件）
- `index.html`: PWAメタタグ追加（theme-color, description, apple-touch-icon）
- `src/App.tsx`: OfflineBannerをRoutes上部に組み込み
- `public/icons/icon-192x192.png`, `icon-512x512.png`: プレースホルダーアイコン
- テストファイル3件:
  - `src/__tests__/useOnlineStatus.test.tsx`: 5テスト（初期値、イベント切替、クリーンアップ）
  - `src/__tests__/OfflineBanner.test.tsx`: 3テスト（オフライン表示、オンライン非表示、role=alert）
  - `src/__tests__/SongDetailPage.offline.test.tsx`: 2テスト（オフライン時外部リンク非表示/オンライン時表示）

### 検証結果

| コマンド | 結果 |
|---------|------|
| `npm test` | ✅ 89 tests passed |
| `npm run lint` | ✅ エラーなし |
| `npm run typecheck` | ⚠️ 既存ファイル(validateRanking.test.ts)のNode.js型エラーのみ（今回の変更とは無関係） |

### コミット履歴

| コミット | メッセージ |
|---------|-----------|
| `4988975` | test: useOnlineStatusフックのテストを追加 |
| `ba10936` | feat: useOnlineStatusフックを実装 |
| `0f20731` | test: OfflineBannerコンポーネントのテストを追加 |
| `9258fce` | feat: OfflineBannerコンポーネントを実装 |
| `7479833` | test: SongDetailPageのオフライン時外部リンク非表示テストを追加 |
| `30de32d` | feat: SongDetailPageでオフライン時に外部リンクを非表示にする |
| `3c9b55e` | feat: PWA対応（vite-plugin-pwa設定、マニフェスト、オフラインキャッシュ、OfflineBanner組み込み） |

### 備考

- 検証サブエージェントにより以下の改善候補が指摘:
  - SSR環境対応（`navigator`未定義時のフォールバック）
  - ネットワーク状態の急速な切替（フラッピング）への対策
  - PWAアイコンのプレースホルダーを本番用画像に差し替え
  - CacheFirst戦略による古いデータの提供リスク（NetworkFirst戦略への変更検討）

## Issue #10: ホスティング・デプロイ設定（Cloudflare Pages） ✅

### 実施内容

- `.github/workflows/deploy.yml`: GitHub Actionsワークフローを作成
  - lint → test → `npx vite build` → Cloudflare Pagesデプロイ（mainのみ）
  - PRではビルド検証のみ、デプロイはmainへのpush時のみ実行
  - `npx vite build` を使用（`npm run build` は `tsc -b` を含み既存エラーで失敗するため）
- `public/_redirects`: SPA用リダイレクト設定（`/* /index.html 200`）

### 検証結果

| コマンド | 結果 |
|---------|------|
| `npm test` | ✅ 89 tests passed |
| `npm run lint` | ✅ エラーなし |
| `npx vite build` | ✅ 成功 |
| Cloudflare Pagesデプロイ | ✅ 正常に表示確認済み |

### コミット履歴

| コミット | メッセージ |
|---------|-----------|
| `734d1cd` | feat: Cloudflare Pages CI/CDデプロイ設定を追加 |
| `618486d` | Merge pull request #15 from kumasanboshi/feature/issue-10-cloudflare-deploy |

### 備考

- GitHub Secretsに `CLOUDFLARE_API_TOKEN` と `CLOUDFLARE_ACCOUNT_ID` の設定が必要
- Cloudflare側のビルド設定は空欄（GitHub Actionsでビルド済みのdistを直接アップロード）

## Issue #16: 全年代のランキングデータ追加 ✅

### 実施内容

- 1975〜2025年（2024年除く）の邦楽・洋楽Top10ランキングデータを生成
  - ランキングファイル: 100件 (`public/data/rankings/{year}-{genre}.json`)
  - 楽曲詳細ファイル: 1000件 (`public/data/songs/{genre}-{year}-{NN}.json`)
- データ生成スクリプト `scripts/generate-data.mjs` を追加
- `public/data/index.json` を全年代分に更新
- artistSongs（同一アーティストの他楽曲）をジャンル内で自動クロスリファレンス

### 検証結果

| 項目 | 結果 |
|------|------|
| vite build | ✅ 成功 |
| ランキングファイル数 | 102件（既存2 + 新規100） |
| 楽曲詳細ファイル数 | 1002件（既存2 + 新規1000） |

### コミット履歴

| ハッシュ | メッセージ |
|---------|-----------|
| `2694f9b` | feat: 1975〜2025年の全年代ランキングデータを追加 |
| `d75303a` | Merge pull request #17 from kumasanboshi/feature/issue-16-all-year-rankings |

### 備考

- 楽曲データは実在のヒット曲を基にしているが、ランキング順位は厳密な公式データではない
- 2025年のデータは架空のプレースホルダー

## Issue #23: 年代別ランキングを統合リストで表示 ✅

### 実施内容

- `src/pages/RankingListPage.tsx`: 年ごとの`<h2>`見出し+個別`<ol>`を廃止し、全年のentriesを1つの`<ol>`にフラット化。各エントリに年情報を表示。
- `src/pages/RankingListPage.module.css`: `.entryYear`スタイル追加
- `src/__tests__/RankingListPage.test.tsx`: 統合リスト表示の検証テストに変更（年見出し非表示、単一リスト、年情報表示）

### 検証結果

| コマンド | 結果 |
|---------|------|
| `npm test` | ✅ RankingListPage 9/9パス |
| `npm run lint` | ✅ エラーなし |

### コミット履歴

| ハッシュ | メッセージ |
|---------|-----------|
| `042281c` | test: 年代別ランキングの統合リスト表示テストを追加 |
| `ceb36ac` | feat: 年代別ランキングを統合リストで表示 |

## Issue #24: TOP100ランキングを100件に拡充 ✅

### 実施内容

- `scripts/create-batch-files.mjs`: バッチデータ生成スクリプト新規作成（年代・ジャンル別アーティストプールから楽曲を生成）
- `public/data/rankings/*.json`: 全50年×2ジャンル=100ファイルのランキングを10件→100件に拡充
- `public/data/songs/*.json`: 対応する曲詳細データ約9,000件を生成
- `public/data/index.json`: 更新
- 2024年データは`SKIP_YEAR`により既存のまま維持

### 検証結果

| コマンド | 結果 |
|---------|------|
| `npm test` | ✅ 88/89パス（1件はpre-existing timeout） |
| `npm run lint` | ✅ エラーなし |

### コミット履歴

| ハッシュ | メッセージ |
|---------|-----------|
| `53c6bb6` | feat: 全年代のランキングデータを100件に拡充 |
| `dc281a8` | Merge pull request #29 |

### 備考

- 11〜100位の楽曲データはシード付き乱数で生成したタイトル（テンプレート+単語の組み合わせ）
- アーティストは年代別に実在のアーティストプールから選択
