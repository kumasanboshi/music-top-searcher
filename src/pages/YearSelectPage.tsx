import { Link, useParams } from 'react-router-dom'
import Card from '../components/Card/Card'
import Breadcrumb from '../components/Breadcrumb/Breadcrumb'
import { useBreadcrumb } from '../hooks/useBreadcrumb'
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
  const breadcrumbs = useBreadcrumb()

  return (
    <div className={styles.container} data-genre={genre}>
      <Breadcrumb items={breadcrumbs} />
      <div className={styles.header}>
        <h1 className={styles.title}>{genreLabel}</h1>
        <p className={styles.subtitle}>年代または年を選択してください</p>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>年代別</h2>
        <div className={styles.decadeGrid}>
          {DECADES.map((decade) => (
            <Link
              key={decade.value}
              to={`/rankings/${genre}/decade/${decade.value}`}
              className={styles.cardLink}
            >
              <Card variant="elevated" className={styles.decadeCard}>
                <span className={styles.decadeLabel}>{decade.label}</span>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>年別</h2>
        <div className={styles.yearGrid}>
          {Array.from({ length: END_YEAR - START_YEAR + 1 }, (_, i) => {
            const year = START_YEAR + i
            return (
              <Link
                key={year}
                to={`/rankings/${genre}/${year}`}
                className={styles.yearLink}
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
