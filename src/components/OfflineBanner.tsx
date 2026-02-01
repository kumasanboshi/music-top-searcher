import { useOnlineStatus } from '../hooks/useOnlineStatus'
import styles from './OfflineBanner.module.css'

function OfflineBanner() {
  const isOnline = useOnlineStatus()

  if (isOnline) {
    return null
  }

  return (
    <div className={styles.banner} role="alert">
      オフラインモード - 広告・外部リンクが利用できません
    </div>
  )
}

export default OfflineBanner
