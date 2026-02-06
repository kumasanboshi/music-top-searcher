import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../Footer/Footer'
import styles from './Layout.module.css'

interface LayoutProps {
  children: ReactNode
}

function Layout({ children }: LayoutProps) {
  return (
    <div className={styles.layout}>
      <header className={styles.header} role="banner">
        <Link to="/" className={styles.logo}>
          Music Top Searcher
        </Link>
      </header>

      <div className={styles.body}>
        <aside className={styles.sidebar} role="complementary" aria-label="左サイドバー">
          <div className={styles.adPlaceholder}>広告枠</div>
        </aside>

        <main className={styles.main} role="main">
          {children}
        </main>

        <aside className={styles.sidebar} role="complementary" aria-label="右サイドバー">
          <div className={styles.adPlaceholder}>広告枠</div>
        </aside>
      </div>

      <Footer />
    </div>
  )
}

export default Layout
