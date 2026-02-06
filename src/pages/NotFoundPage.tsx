import { Link } from 'react-router-dom'
import styles from './NotFoundPage.module.css'

function NotFoundPage() {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.errorCode}>404</h1>
        <h2 className={styles.title}>ページが見つかりません</h2>
        <p className={styles.description}>
          お探しのページは存在しないか、移動または削除された可能性があります。
        </p>

        <div className={styles.navigation}>
          <Link to="/" className={styles.primaryLink}>
            トップページに戻る
          </Link>
          <Link to="/search" className={styles.secondaryLink}>
            曲を検索する
          </Link>
        </div>
      </div>
    </div>
  )
}

export default NotFoundPage
