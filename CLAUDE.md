# CLAUDE.md

## Project
Music Top Searcher - 音楽トップサーチャー

## Tech Stack
- Frontend: React 19, TypeScript, Vite 7
- Testing: Vitest, React Testing Library
- Routing: React Router v7
- Linting/Formatting: ESLint, Prettier

## Key Commands
```bash
npm run dev        # 開発サーバー起動
npm run build      # ビルド
npm test           # テスト実行
npm run test:watch # テスト（watchモード）
npm run lint       # リンター実行
npm run typecheck  # 型チェック
npm run format     # フォーマット実行
npm run format:check # フォーマットチェック
```

## Project Structure
```
src/
├── components/    # 共通UIコンポーネント（OfflineBanner）
├── pages/         # ページコンポーネント（TopPage, YearSelectPage, RankingListPage, SongDetailPage, SearchPage）
├── services/      # データ取得サービス（rankingService, songService, searchService）
├── hooks/         # カスタムフック（useOnlineStatus）
├── types/         # 型定義（Genre, Song, Artist, Ranking, SongDetail等）
├── utils/         # ユーティリティ（validateRanking）
└── __tests__/     # テストファイル
```

## Important Files
- `docs/PROJECT.md` - プロジェクト詳細・要件
- `docs/ARCHITECTURE.md` - 技術設計・データモデル
- `docs/CONTRIBUTING.md` - コーディング規約・開発フロー

## Domain Terms
- **Genre（ジャンル）**: jpop（邦楽）または western（洋楽）
- **Decade（年代）**: late1970s, 1980s, 1990s, 2000s, 2010s, 2020s の6区分
- **RankingEntry**: ランキング内の1エントリ（順位・曲・年）
- **SongDetail**: 楽曲詳細（曲情報・CD情報・外部リンク・同アーティスト曲）
- **TOP100**: 各年・各ジャンルのヒット曲上位100曲

## Guidelines
- 不明点は確認してから実装
- 既存のコードスタイルを尊重
- **テスト駆動開発（TDD）を採用**

---

## Development Workflow（TDD）

各タスクは以下のステップで進める。

### STEP 1-2: 探索 + 計画（Planエージェント）

| 内容 | 詳細 |
|------|------|
| 関連ファイル調査 | 既存コード、型定義、テストの確認 |
| テスト設計 | テストケースの洗い出し（正常系・異常系・境界値） |
| 実装方針策定 | インターフェース設計、依存関係の整理 |

**計画に含めるべき内容:**
- テストファイルのパス
- テストケース一覧（describe/it構造）
- 実装ファイルのパス
- 関数シグネチャ（入出力の型）

### STEP 3: 実装（TDDサイクル）

```
┌─────────────────────────────────────────────────────┐
│  3-1. テストを書く                                    │
│       期待する動作を明確にする                         │
│       ↓                                              │
│  3-2. テストの失敗を確認                              │
│       npm test でテストが失敗することを確認            │
│       ↓                                              │
│  3-3. テストをコミット                                │
│       テストの内容を固定（実装前にコミット）            │
│       ↓                                              │
│  3-4. 実装を書く                                      │
│       テストが通るように実装を作成                     │
│       ⚠️ テストコードは変更しない                      │
│       ↓                                              │
│  3-5. 実装をコミット                                  │
│       完成したコードを保存                            │
└─────────────────────────────────────────────────────┘
```

### STEP 4: 実装検証（独立サブエージェント）

テストがすべて通ったら、**独立したサブエージェント**で以下を検証:

| 検証項目 | 内容 |
|----------|------|
| テスト依存性 | テストに過度に依存した実装になっていないか |
| エッジケース | テストでカバーされていないケースはないか |
| コード品質 | 可読性、保守性、パフォーマンスの観点 |
| 設計原則 | SOLID原則、DRY原則への準拠 |

### STEP 5: PR作成（Bashエージェント）

| 内容 | 詳細 |
|------|------|
| 型チェック | `npx tsc --noEmit` |
| 全テスト実行 | `npm test` |
| リント | `npm run lint` |
| featureブランチ作成 | `feature/issue-{番号}-{概要}` 形式 |
| push | featureブランチをリモートにpush |
| PR作成 | `gh pr create` でテストと実装の両方を含むPRを作成 |

### STEP 6: レビュー・マージ（Bashエージェント）

| 内容 | 詳細 |
|------|------|
| PRレビュー | 差分を確認し、問題がないことを検証 |
| マージ | `gh pr merge` でPRをマージ |
| ローカル同期 | mainブランチを最新に更新（`git checkout main && git pull`） |
| push | ローカルmainをリモートに同期 |

### STEP 7: 進捗記録の更新

Issue完了後、`docs/PROGRESS.md` に以下を追記する:

- Issue番号・タイトル・完了マーク（✅）
- 実施内容（作成・変更したファイルと概要）
- 検証結果（test / lint / typecheck の結果）
- コミット履歴（ハッシュとメッセージ）
- 備考（検証で得られた改善候補など）

---

## TDDのルール

1. **Red → Green → Refactor**
   - Red: 失敗するテストを書く
   - Green: テストが通る最小限の実装
   - Refactor: コードを改善（テストは変更しない）

2. **テストファースト**
   - 実装前に必ずテストを書く
   - テストが仕様書の役割を果たす

3. **テストコードの不変性**
   - 実装フェーズでテストコードを変更しない
   - テストが間違っていた場合は新しいサイクルで修正

4. **小さなステップ**
   - 一度に1つの機能をテスト→実装
   - 複雑な機能は分割して段階的に実装

---

## サブエージェント一覧

| エージェント | 用途 |
|-------------|------|
| **Plan** | コードベース探索 + 実装計画 + テスト設計 |
| **Explore** | コードベース探索（調査のみ） |
| **Bash** | git操作、コマンド実行 |
| **general-purpose** | 実装検証、複雑なマルチステップタスク |

---

## テストファイル命名規則

```
src/__tests__/
├── {機能名}.test.ts      # サービス・ユーティリティのテスト
├── {コンポーネント名}.test.tsx  # コンポーネントのテスト
└── integration/          # 統合テスト
```

## コミットメッセージ規則

```
test: {機能名}のテストを追加
feat: {機能名}を実装
fix: {バグ内容}を修正
refactor: {対象}をリファクタリング
```
