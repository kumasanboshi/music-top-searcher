import { Link, useLocation } from 'react-router-dom'
import type { BreadcrumbItem } from '../../types'
import styles from './Breadcrumb.module.css'

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
  includeJsonLd?: boolean
}

function Breadcrumb({
  items,
  className = '',
  includeJsonLd = true,
}: BreadcrumbProps) {
  const location = useLocation()

  if (items.length === 0) {
    return null
  }

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => {
      const isLast = index === items.length - 1
      const itemUrl = item.path
        ? `${window.location.origin}${item.path}`
        : isLast
          ? `${window.location.origin}${location.pathname}`
          : undefined

      const element: {
        '@type': string
        position: number
        name: string
        item?: string
      } = {
        '@type': 'ListItem',
        position: index + 1,
        name: item.label,
      }
      if (itemUrl) {
        element.item = itemUrl
      }
      return element
    }),
  }

  return (
    <nav
      className={`${styles.breadcrumb} ${className}`.trim()}
      aria-label="パンくずリスト"
    >
      <ol className={styles.list}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <li key={item.label} className={styles.item}>
              {item.path && !isLast ? (
                <Link to={item.path} className={styles.link}>
                  {item.label}
                </Link>
              ) : (
                <span className={styles.current} aria-current={isLast ? 'page' : undefined}>
                  {item.label}
                </span>
              )}
              {!isLast && (
                <span className={styles.separator} aria-hidden="true">
                  &gt;
                </span>
              )}
            </li>
          )
        })}
      </ol>
      {includeJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
    </nav>
  )
}

export default Breadcrumb
