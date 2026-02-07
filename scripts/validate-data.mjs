#!/usr/bin/env node
/**
 * 楽曲ランキングデータの検証スクリプト
 * Issue #55: 楽曲ランキングデータの正確性検証
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DATA_DIR = path.join(__dirname, '..', 'public', 'data')
const RANKINGS_DIR = path.join(DATA_DIR, 'rankings')
const SONGS_DIR = path.join(DATA_DIR, 'songs')

const START_YEAR = 1975
const END_YEAR = 2025
const GENRES = ['jpop', 'western']
const EXPECTED_ENTRIES = 100

// 検証結果を格納
const report = {
  errors: [],
  warnings: [],
  summary: {
    totalRankingFiles: 0,
    totalSongFiles: 0,
    totalEntries: 0,
    errorCount: 0,
    warningCount: 0,
  },
}

function addError(category, message, details = {}) {
  report.errors.push({ category, message, ...details })
  report.summary.errorCount++
}

function addWarning(category, message, details = {}) {
  report.warnings.push({ category, message, ...details })
  report.summary.warningCount++
}

/**
 * 1. データ構造の整合性チェック
 */
function validateDataStructure() {
  console.log('\n📋 データ構造の検証...')

  for (const genre of GENRES) {
    for (let year = START_YEAR; year <= END_YEAR; year++) {
      const filename = `${year}-${genre}.json`
      const filepath = path.join(RANKINGS_DIR, filename)

      if (!fs.existsSync(filepath)) {
        addError('MISSING_FILE', `ランキングファイルが見つかりません: ${filename}`)
        continue
      }

      report.summary.totalRankingFiles++

      const data = JSON.parse(fs.readFileSync(filepath, 'utf-8'))

      // 必須フィールドのチェック
      if (data.year !== year) {
        addError('YEAR_MISMATCH', `yearフィールドが不一致: ${filename}`, {
          expected: year,
          actual: data.year,
        })
      }

      if (data.genre !== genre) {
        addError('GENRE_MISMATCH', `genreフィールドが不一致: ${filename}`, {
          expected: genre,
          actual: data.genre,
        })
      }

      if (!Array.isArray(data.entries)) {
        addError('INVALID_ENTRIES', `entriesが配列ではありません: ${filename}`)
        continue
      }

      // エントリ数チェック
      if (data.entries.length !== EXPECTED_ENTRIES) {
        addError('ENTRY_COUNT', `エントリ数が${EXPECTED_ENTRIES}件ではありません: ${filename}`, {
          expected: EXPECTED_ENTRIES,
          actual: data.entries.length,
        })
      }

      report.summary.totalEntries += data.entries.length

      // 連番チェック
      const ranks = data.entries.map((e) => e.rank).sort((a, b) => a - b)
      for (let i = 0; i < ranks.length; i++) {
        if (ranks[i] !== i + 1) {
          addError('RANK_SEQUENCE', `rankが連番ではありません: ${filename}`, {
            expected: i + 1,
            actual: ranks[i],
            position: i,
          })
          break
        }
      }

      // 各エントリの必須フィールドチェック
      for (const entry of data.entries) {
        if (!entry.song) {
          addError('MISSING_SONG', `songフィールドがありません: ${filename} rank=${entry.rank}`)
          continue
        }

        const requiredSongFields = ['id', 'title', 'artist', 'genre']
        for (const field of requiredSongFields) {
          if (!entry.song[field]) {
            addError(
              'MISSING_FIELD',
              `song.${field}がありません: ${filename} rank=${entry.rank}`
            )
          }
        }

        if (entry.song.artist && !entry.song.artist.id) {
          addError(
            'MISSING_ARTIST_ID',
            `artist.idがありません: ${filename} rank=${entry.rank}`
          )
        }

        if (entry.song.artist && !entry.song.artist.name) {
          addError(
            'MISSING_ARTIST_NAME',
            `artist.nameがありません: ${filename} rank=${entry.rank}`
          )
        }
      }
    }
  }
}

/**
 * 2. 重複データのチェック
 */
function validateDuplicates() {
  console.log('\n🔍 重複データの検証...')

  for (const genre of GENRES) {
    for (let year = START_YEAR; year <= END_YEAR; year++) {
      const filename = `${year}-${genre}.json`
      const filepath = path.join(RANKINGS_DIR, filename)

      if (!fs.existsSync(filepath)) continue

      const data = JSON.parse(fs.readFileSync(filepath, 'utf-8'))

      // 同一年内の曲ID重複チェック
      const songIds = new Set()
      const songTitles = new Map() // title -> [ranks]

      for (const entry of data.entries) {
        if (!entry.song) continue

        if (songIds.has(entry.song.id)) {
          addError('DUPLICATE_ID', `曲IDが重複しています: ${filename}`, {
            songId: entry.song.id,
            rank: entry.rank,
          })
        }
        songIds.add(entry.song.id)

        // タイトルの重複チェック（同じアーティストの場合のみ）
        const key = `${entry.song.title}|${entry.song.artist?.id}`
        if (songTitles.has(key)) {
          addWarning('POSSIBLE_DUPLICATE', `同じアーティストの同名曲: ${filename}`, {
            title: entry.song.title,
            artist: entry.song.artist?.name,
            ranks: [...songTitles.get(key), entry.rank],
          })
        } else {
          songTitles.set(key, [entry.rank])
        }
      }
    }
  }
}

/**
 * 3. アーティスト情報の整合性チェック
 */
function validateArtists() {
  console.log('\n👤 アーティスト情報の検証...')

  const artistMap = new Map() // artistId -> Set of names

  for (const genre of GENRES) {
    for (let year = START_YEAR; year <= END_YEAR; year++) {
      const filename = `${year}-${genre}.json`
      const filepath = path.join(RANKINGS_DIR, filename)

      if (!fs.existsSync(filepath)) continue

      const data = JSON.parse(fs.readFileSync(filepath, 'utf-8'))

      for (const entry of data.entries) {
        if (!entry.song?.artist) continue

        const { id, name } = entry.song.artist
        if (!id || !name) continue

        if (!artistMap.has(id)) {
          artistMap.set(id, new Set())
        }
        artistMap.get(id).add(name)
      }
    }
  }

  // 同じIDで複数の名前がある場合を検出
  for (const [artistId, names] of artistMap) {
    if (names.size > 1) {
      addWarning('ARTIST_NAME_VARIATION', `同一IDで表記揺れあり`, {
        artistId,
        names: Array.from(names),
      })
    }
  }
}

/**
 * 4. 曲ファイルの検証
 */
function validateSongFiles() {
  console.log('\n🎵 曲ファイルの検証...')

  const songFiles = fs.readdirSync(SONGS_DIR).filter((f) => f.endsWith('.json'))

  for (const filename of songFiles) {
    report.summary.totalSongFiles++
    const filepath = path.join(SONGS_DIR, filename)
    const data = JSON.parse(fs.readFileSync(filepath, 'utf-8'))

    // 必須フィールドチェック
    if (!data.song) {
      addError('MISSING_SONG_DATA', `songフィールドがありません: ${filename}`)
      continue
    }

    if (!data.rankingYear) {
      addError('MISSING_RANKING_YEAR', `rankingYearがありません: ${filename}`)
    }

    if (!data.rank) {
      addError('MISSING_RANK', `rankがありません: ${filename}`)
    }

    // ファイル名とIDの整合性
    const expectedId = filename.replace('.json', '')
    if (data.song.id !== expectedId) {
      addWarning('ID_FILENAME_MISMATCH', `ファイル名とIDが不一致: ${filename}`, {
        filenameDerived: expectedId,
        actualId: data.song.id,
      })
    }

    // リリース日の妥当性チェック
    if (data.cdInfo && Array.isArray(data.cdInfo)) {
      for (const cd of data.cdInfo) {
        if (cd.releaseDate) {
          const releaseYear = parseInt(cd.releaseDate.split('-')[0], 10)
          if (releaseYear > data.rankingYear) {
            addError('FUTURE_RELEASE', `リリース日がランキング年より後: ${filename}`, {
              releaseDate: cd.releaseDate,
              rankingYear: data.rankingYear,
            })
          } else if (releaseYear < data.rankingYear - 1) {
            addWarning('OLD_RELEASE', `リリース日がランキング年より2年以上前: ${filename}`, {
              releaseDate: cd.releaseDate,
              rankingYear: data.rankingYear,
            })
          }
        }
      }
    }
  }
}

/**
 * 5. ランキングファイルと曲ファイルの整合性チェック
 */
function validateCrossReference() {
  console.log('\n🔗 ランキングと曲ファイルの整合性検証...')

  const songFileIds = new Set(
    fs
      .readdirSync(SONGS_DIR)
      .filter((f) => f.endsWith('.json'))
      .map((f) => f.replace('.json', ''))
  )

  for (const genre of GENRES) {
    for (let year = START_YEAR; year <= END_YEAR; year++) {
      const filename = `${year}-${genre}.json`
      const filepath = path.join(RANKINGS_DIR, filename)

      if (!fs.existsSync(filepath)) continue

      const data = JSON.parse(fs.readFileSync(filepath, 'utf-8'))

      for (const entry of data.entries) {
        if (!entry.song?.id) continue

        // 曲ファイルが存在するかチェック
        if (!songFileIds.has(entry.song.id)) {
          addError('MISSING_SONG_FILE', `曲ファイルが存在しません`, {
            songId: entry.song.id,
            rankingFile: filename,
            rank: entry.rank,
          })
        }
      }
    }
  }
}

/**
 * レポートを出力
 */
function printReport() {
  console.log('\n' + '='.repeat(60))
  console.log('📊 検証レポート')
  console.log('='.repeat(60))

  console.log('\n【サマリー】')
  console.log(`  ランキングファイル数: ${report.summary.totalRankingFiles}`)
  console.log(`  曲ファイル数: ${report.summary.totalSongFiles}`)
  console.log(`  総エントリ数: ${report.summary.totalEntries}`)
  console.log(`  エラー数: ${report.summary.errorCount}`)
  console.log(`  警告数: ${report.summary.warningCount}`)

  if (report.errors.length > 0) {
    console.log('\n【エラー】')
    const errorsByCategory = {}
    for (const error of report.errors) {
      if (!errorsByCategory[error.category]) {
        errorsByCategory[error.category] = []
      }
      errorsByCategory[error.category].push(error)
    }

    for (const [category, errors] of Object.entries(errorsByCategory)) {
      console.log(`\n  [${category}] (${errors.length}件)`)
      for (const error of errors.slice(0, 10)) {
        console.log(`    - ${error.message}`)
        if (error.expected !== undefined) {
          console.log(`      期待値: ${error.expected}, 実際: ${error.actual}`)
        }
        if (error.songId) {
          console.log(`      曲ID: ${error.songId}`)
        }
      }
      if (errors.length > 10) {
        console.log(`    ... 他 ${errors.length - 10}件`)
      }
    }
  }

  if (report.warnings.length > 0) {
    console.log('\n【警告】')
    const warningsByCategory = {}
    for (const warning of report.warnings) {
      if (!warningsByCategory[warning.category]) {
        warningsByCategory[warning.category] = []
      }
      warningsByCategory[warning.category].push(warning)
    }

    for (const [category, warnings] of Object.entries(warningsByCategory)) {
      console.log(`\n  [${category}] (${warnings.length}件)`)
      for (const warning of warnings.slice(0, 10)) {
        console.log(`    - ${warning.message}`)
        if (warning.names) {
          console.log(`      名前: ${warning.names.join(', ')}`)
        }
        if (warning.artistId) {
          console.log(`      アーティストID: ${warning.artistId}`)
        }
      }
      if (warnings.length > 10) {
        console.log(`    ... 他 ${warnings.length - 10}件`)
      }
    }
  }

  console.log('\n' + '='.repeat(60))

  // 結果をJSONファイルに出力
  const reportPath = path.join(__dirname, '..', 'docs', 'validation-report.json')
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2), 'utf-8')
  console.log(`\n詳細レポートを出力しました: ${reportPath}`)

  return report.summary.errorCount === 0
}

// メイン処理
console.log('🔍 楽曲ランキングデータの検証を開始します...')

validateDataStructure()
validateDuplicates()
validateArtists()
validateSongFiles()
validateCrossReference()

const success = printReport()

process.exit(success ? 0 : 1)
