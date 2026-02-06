import { Link } from 'react-router-dom'
import styles from './AboutPage.module.css'

function AboutPage() {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>About</h1>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>サイト概要</h2>
        <p className={styles.text}>
          Music Top Searcherは、1975年から現在までの歴代ヒット曲ランキングを探索できるWebサイトです。
          邦楽（J-POP）と洋楽のヒット曲を年代別・年別に閲覧し、お気に入りの音楽を見つけることができます。
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>データについて</h2>
        <p className={styles.text}>
          本サイトで提供しているランキングデータは、各年のオリコン年間ランキング等の公開情報を元に作成しています。
          データの正確性には十分注意を払っていますが、すべての情報が最新・正確であることを保証するものではありません。
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>免責事項</h2>
        <ul className={styles.list}>
          <li>本サイトの情報は参考情報として提供しており、その正確性・完全性を保証するものではありません。</li>
          <li>本サイトの利用により生じたいかなる損害についても、運営者は責任を負いません。</li>
          <li>本サイトに掲載されている楽曲情報の著作権は、各権利者に帰属します。</li>
          <li>外部サービス（Amazon Music等）へのリンクは、利便性のために提供しています。リンク先の内容については各サービスの規約をご確認ください。</li>
        </ul>
      </section>

      <div className={styles.navigation}>
        <Link to="/" className={styles.link}>
          トップページに戻る
        </Link>
      </div>
    </div>
  )
}

export default AboutPage
