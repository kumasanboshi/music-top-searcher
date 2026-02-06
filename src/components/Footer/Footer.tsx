import { Link } from 'react-router-dom'
import styles from './Footer.module.css'

interface FooterProps {
  className?: string
}

function Footer({ className = '' }: FooterProps) {
  return (
    <footer className={`${styles.footer} ${className}`}>
      <div className={styles.container}>
        <nav className={styles.nav} aria-label="フッターナビゲーション">
          <ul className={styles.links}>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/privacy">プライバシーポリシー</Link>
            </li>
            <li>
              <Link to="/terms">利用規約</Link>
            </li>
            <li>
              <Link to="/contact">お問い合わせ</Link>
            </li>
          </ul>
        </nav>

        <div className={styles.copyright}>
          <small>© 2025 Music Top Searcher</small>
        </div>
      </div>
    </footer>
  )
}

export default Footer
