import styles from './LoadingSpinner.module.css'

interface LoadingSpinnerProps {
  text?: string
  size?: 'sm' | 'md' | 'lg'
}

function LoadingSpinner({ text = '読み込み中...', size = 'md' }: LoadingSpinnerProps) {
  const sizeClass = {
    sm: styles.sizeSm,
    md: styles.sizeMd,
    lg: styles.sizeLg,
  }[size]

  return (
    <div className={`${styles.wrapper} ${sizeClass}`} role="status">
      <div className={styles.spinner} aria-hidden="true" />
      <span>{text}</span>
    </div>
  )
}

export default LoadingSpinner
