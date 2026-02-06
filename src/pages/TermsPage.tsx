import { Link } from 'react-router-dom'
import Breadcrumb from '../components/Breadcrumb/Breadcrumb'
import { useBreadcrumb } from '../hooks/useBreadcrumb'
import styles from './TermsPage.module.css'

function TermsPage() {
  const breadcrumbs = useBreadcrumb()

  return (
    <div className={styles.container}>
      <Breadcrumb items={breadcrumbs} />
      <h1 className={styles.title}>利用規約</h1>

      <p className={styles.intro}>
        この利用規約（以下「本規約」）は、Music Top
        Searcher（以下「本サイト」）の利用条件を定めるものです。
        本サイトをご利用いただく際は、本規約に同意したものとみなします。
      </p>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>サービスの利用</h2>
        <ul className={styles.list}>
          <li>本サイトは、歴代ヒット曲のランキング情報を提供する無料のWebサービスです。</li>
          <li>本サイトの利用に際して、特別な登録は必要ありません。</li>
          <li>
            本サイトは、予告なくサービス内容の変更、一時停止、終了を行う場合があります。
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>禁止事項</h2>
        <p className={styles.text}>本サイトの利用にあたり、以下の行為を禁止します。</p>
        <ul className={styles.list}>
          <li>法令または公序良俗に違反する行為</li>
          <li>本サイトの運営を妨害する行為</li>
          <li>他のユーザーまたは第三者に不利益や損害を与える行為</li>
          <li>本サイトのコンテンツを無断で複製、転載、配布する行為</li>
          <li>自動化ツールやスクレイピングによる大量アクセス</li>
          <li>その他、運営者が不適切と判断する行為</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>免責事項</h2>
        <ul className={styles.list}>
          <li>
            本サイトで提供する情報の正確性、完全性、有用性について、いかなる保証も行いません。
          </li>
          <li>
            本サイトの利用により生じたいかなる損害についても、運営者は一切の責任を負いません。
          </li>
          <li>
            本サイトからリンクされた外部サイトの内容について、運営者は責任を負いません。
          </li>
          <li>本サイトのサービス中断や停止により生じた損害について、運営者は責任を負いません。</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>著作権</h2>
        <ul className={styles.list}>
          <li>本サイトに掲載されている楽曲情報の著作権は、各権利者に帰属します。</li>
          <li>
            本サイトのデザイン、ロゴ、その他のコンテンツの著作権は、運営者に帰属します。
          </li>
          <li>
            本サイトのコンテンツは、個人的かつ非商業的な目的でのみ利用することができます。
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>規約の変更</h2>
        <p className={styles.text}>
          運営者は、必要に応じて本規約を変更することができます。
          変更後の規約は、本ページに掲載した時点で効力を生じます。
          重要な変更がある場合は、サイト上でお知らせします。
        </p>
      </section>

      <p className={styles.lastUpdated}>最終更新日：2025年1月</p>

      <div className={styles.navigation}>
        <Link to="/" className={styles.link}>
          トップページに戻る
        </Link>
      </div>
    </div>
  )
}

export default TermsPage
