import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchSongDetail } from '../services/songService'
import { useOnlineStatus } from '../hooks/useOnlineStatus'
import type { SongDetail } from '../types'
import styles from './SongDetailPage.module.css'

function SongDetailPage() {
  const { songId } = useParams<{ genre: string; songId: string }>()
  const isOnline = useOnlineStatus()
  const [detail, setDetail] = useState<SongDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(false)

      const result = await fetchSongDetail(songId ?? '')
      if (!cancelled) {
        setDetail(result)
        setError(!result)
        setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [songId])

  if (loading) {
    return (
      <div className={styles.container}>
        <p className={styles.loading}>読み込み中...</p>
      </div>
    )
  }

  if (error || !detail) {
    return (
      <div className={styles.container}>
        <p className={styles.error}>曲の詳細データが見つかりませんでした</p>
      </div>
    )
  }

  const { song, rankingYear, rank, cdInfo, externalLinks, artistSongs } = detail

  return (
    <div className={styles.container}>
      <h1 className={styles.songTitle}>{song.title}</h1>
      <p className={styles.artistName}>{song.artist.name}</p>
      <p className={styles.rankingInfo}>{`${rankingYear}年 ${rank}位`}</p>

      {cdInfo && cdInfo.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>CD情報</h2>
          {cdInfo.map((cd, i) => (
            <div key={i} className={styles.cdItem}>
              <span>{cd.title}</span> /{' '}
              <span>{cd.type === 'album' ? 'アルバム' : 'シングル'}</span>
              {cd.releaseDate && <span> ({cd.releaseDate})</span>}
            </div>
          ))}
        </div>
      )}

      {isOnline && externalLinks && (externalLinks.amazon || externalLinks.appleMusic) && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>外部リンク</h2>
          <ul className={styles.linkList}>
            {externalLinks.amazon && (
              <li>
                <a
                  href={externalLinks.amazon}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Amazon
                </a>
              </li>
            )}
            {externalLinks.appleMusic && (
              <li>
                <a
                  href={externalLinks.appleMusic}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Apple Music
                </a>
              </li>
            )}
          </ul>
        </div>
      )}

      {artistSongs && artistSongs.length > 0 && (
        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>同アーティストの他のランクイン曲</h2>
          <ul className={styles.artistSongList}>
            {artistSongs.map((entry) => (
              <li key={entry.song.id} className={styles.artistSongItem}>
                <Link to={`/songs/${entry.song.genre}/${entry.song.id}`}>
                  {entry.song.title}
                </Link>
                {entry.year && <span>{entry.year}年</span>}
                <span>{entry.rank}位</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default SongDetailPage
