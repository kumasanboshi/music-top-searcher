import { Link, useParams } from 'react-router-dom'
import styles from './YearSelectPage.module.css'

const GENRE_LABELS: Record<string, string> = {
  jpop: '邦楽',
  western: '洋楽',
}

const DECADES = [
  { label: '70年代後半', value: 'late1970s' },
  { label: '80年代', value: '1980s' },
  { label: '90年代', value: '1990s' },
  { label: '00年代', value: '2000s' },
  { label: '10年代', value: '2010s' },
  { label: '20年代', value: '2020s' },
]

const START_YEAR = 1975
const END_YEAR = 2025

function YearSelectPage() {
  const { genre } = useParams<{ genre: string }>()
  const genreLabel = GENRE_LABELS[genre ?? ''] ?? genre

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{genreLabel} - 年を選択</h1>

      <section>
        <h2 className={styles.sectionTitle}>年代別</h2>
        <div className={styles.buttons}>
          {DECADES.map((decade) => (
            <Link
              key={decade.value}
              to={`/rankings/${genre}/decade/${decade.value}`}
              className={styles.button}
            >
              {decade.label}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className={styles.sectionTitle}>年別</h2>
        <div className={styles.buttons}>
          {Array.from({ length: END_YEAR - START_YEAR + 1 }, (_, i) => {
            const year = START_YEAR + i
            return (
              <Link
                key={year}
                to={`/rankings/${genre}/${year}`}
                className={styles.button}
              >
                {year}
              </Link>
            )
          })}
        </div>
      </section>
    </div>
  )
}

export default YearSelectPage
