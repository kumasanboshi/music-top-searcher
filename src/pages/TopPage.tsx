import { Link } from 'react-router-dom'
import Card from '../components/Card/Card'
import styles from './TopPage.module.css'

function TopPage() {
  return (
    <div className={styles.container}>
      <div className={styles.hero}>
        <h1 className={styles.title}>Music Top Searcher</h1>
        <p className={styles.subtitle}>歴代ヒット曲ランキングを探索しよう</p>
      </div>

      <section className={styles.genreSection}>
        <h2 className={styles.sectionTitle}>ジャンルを選択</h2>
        <div className={styles.genreButtons}>
          <Link to="/rankings/jpop" className={styles.genreLink}>
            <Card variant="elevated" padding="lg" className={styles.genreCard}>
              <span className={styles.genreLabel}>邦楽</span>
              <span className={styles.genreDescription}>J-POP</span>
            </Card>
          </Link>
          <Link to="/rankings/western" className={styles.genreLink}>
            <Card variant="elevated" padding="lg" className={styles.genreCard}>
              <span className={styles.genreLabel}>洋楽</span>
              <span className={styles.genreDescription}>Western</span>
            </Card>
          </Link>
        </div>
      </section>

      <Link to="/search" className={styles.searchLink}>
        曲を検索
      </Link>
    </div>
  )
}

export default TopPage
