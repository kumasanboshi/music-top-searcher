import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchAllSongs, searchSongs } from '../services/searchService'
import type { RankingEntry } from '../types'
import styles from './SearchPage.module.css'

function SearchPage() {
  const [allSongs, setAllSongs] = useState<RankingEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<RankingEntry[]>([])
  const [searched, setSearched] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      const songs = await fetchAllSongs()
      if (!cancelled) {
        setAllSongs(songs)
        setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    if (!query.trim()) {
      setResults([])
      setSearched(false)
      return
    }

    timerRef.current = setTimeout(() => {
      setResults(searchSongs(allSongs, query))
      setSearched(true)
    }, 300)

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [query, allSongs])

  if (loading) {
    return (
      <div className={styles.container}>
        <p className={styles.loading}>読み込み中...</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>曲を検索</h1>
      <input
        className={styles.searchInput}
        type="text"
        placeholder="曲名・アーティスト名で検索"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {searched && results.length === 0 && (
        <p className={styles.noResults}>該当する曲が見つかりませんでした</p>
      )}
      {results.length > 0 && (
        <ul className={styles.resultList}>
          {results.map((entry) => (
            <li key={entry.song.id} className={styles.resultItem}>
              <span className={styles.rank}>{entry.rank}</span>
              <Link
                to={`/songs/${entry.song.genre}/${entry.song.id}`}
                className={styles.songLink}
              >
                <span className={styles.songTitle}>{entry.song.title}</span>
              </Link>
              <span className={styles.artistName}>
                {entry.song.artist.name}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SearchPage
