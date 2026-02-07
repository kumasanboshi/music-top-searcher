import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchSongDetail } from '../services/songService'
import { useOnlineStatus } from '../hooks/useOnlineStatus'
import type { SongDetail } from '../types'
import Card from '../components/Card/Card'
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner'
import Breadcrumb from '../components/Breadcrumb/Breadcrumb'
import AffiliateLink from '../components/AffiliateLink'
import { useBreadcrumb } from '../hooks/useBreadcrumb'
import styles from './SongDetailPage.module.css'

function SongDetailPage() {
  const { genre, songId } = useParams<{ genre: string; songId: string }>()
  const isOnline = useOnlineStatus()
  const [detail, setDetail] = useState<SongDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const breadcrumbs = useBreadcrumb({ songTitle: detail?.song.title })

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
        <Breadcrumb items={breadcrumbs} />
        <div className={styles.loadingWrapper}>
          <LoadingSpinner text="曲情報を読み込み中..." />
        </div>
      </div>
    )
  }

  if (error || !detail) {
    return (
      <div className={styles.container}>
        <Breadcrumb items={breadcrumbs} />
        <Card variant="outlined" className={styles.errorCard}>
          <p className={styles.error}>曲の詳細データが見つかりませんでした</p>
        </Card>
      </div>
    )
  }

  const { song, rankingYear, rank, cdInfo, externalLinks, artistSongs } = detail

  return (
    <div className={styles.container} data-genre={genre}>
      <Breadcrumb items={breadcrumbs} />
      <div className={styles.hero}>
        <h1 className={styles.songTitle}>{song.title}</h1>
        <p className={styles.artistName}>{song.artist.name}</p>
        <div className={styles.rankingBadge}>
          <span className={styles.rankingYear}>{rankingYear}年</span>
          <span className={styles.rankingRank}>{rank}位</span>
        </div>
      </div>

      {cdInfo && cdInfo.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>CD情報</h2>
          <div className={styles.cdList}>
            {cdInfo.map((cd, i) => (
              <Card key={i} variant="outlined" className={styles.cdCard}>
                <span className={styles.cdTitle}>{cd.title}</span>
                <div className={styles.cdMeta}>
                  <span className={styles.cdType}>
                    {cd.type === 'album' ? 'アルバム' : 'シングル'}
                  </span>
                  {cd.releaseDate && (
                    <span className={styles.cdDate}>{cd.releaseDate}</span>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </section>
      )}

      {isOnline && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>外部リンク</h2>
          <div className={styles.linkGrid}>
            <AffiliateLink
              service="amazon-music"
              url={externalLinks?.amazonMusic || ''}
              songTitle={song.title}
              artistName={song.artist.name}
              className={styles.externalLink}
            >
              Amazon Music
            </AffiliateLink>
            <AffiliateLink
              service="amazon-cd"
              url={externalLinks?.amazonCD || ''}
              songTitle={song.title}
              artistName={song.artist.name}
              className={styles.externalLink}
            >
              Amazon CD
            </AffiliateLink>
            <AffiliateLink
              service="apple-music"
              url={externalLinks?.appleMusic || ''}
              songTitle={song.title}
              artistName={song.artist.name}
              className={styles.externalLink}
            >
              Apple Music
            </AffiliateLink>
            <a
              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(song.artist.name + ' ' + song.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.externalLink}
            >
              YouTube
            </a>
          </div>
        </section>
      )}

      {artistSongs && artistSongs.length > 0 && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>同アーティストの他のランクイン曲</h2>
          <div className={styles.artistSongList}>
            {artistSongs.map((entry) => (
              <Link
                key={entry.song.id}
                to={`/songs/${entry.song.genre}/${entry.song.id}`}
                className={styles.artistSongLink}
              >
                <Card variant="outlined" className={styles.artistSongCard}>
                  <span className={styles.artistSongTitle}>{entry.song.title}</span>
                  <div className={styles.artistSongMeta}>
                    {entry.year && <span>{entry.year}年</span>}
                    <span>{entry.rank}位</span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default SongDetailPage
