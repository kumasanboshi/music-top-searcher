import { Link } from 'react-router-dom'
import styles from './TopPage.module.css'

function TopPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Music Top Searcher</h1>
      <div className={styles.genreButtons}>
        <Link to="/rankings/jpop" className={styles.genreButton}>
          邦楽
        </Link>
        <Link to="/rankings/western" className={styles.genreButton}>
          洋楽
        </Link>
      </div>
    </div>
  )
}

export default TopPage
