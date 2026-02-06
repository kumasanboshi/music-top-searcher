import { Link } from 'react-router-dom'
import Breadcrumb from '../components/Breadcrumb/Breadcrumb'
import { useBreadcrumb } from '../hooks/useBreadcrumb'
import styles from './PrivacyPolicyPage.module.css'

function PrivacyPolicyPage() {
  const breadcrumbs = useBreadcrumb()

  return (
    <div className={styles.container}>
      <Breadcrumb items={breadcrumbs} />
      <h1 className={styles.title}>プライバシーポリシー</h1>

      <p className={styles.intro}>
        Music Top Searcher（以下「本サイト」）は、ユーザーのプライバシーを尊重し、個人情報の保護に努めています。
        本プライバシーポリシーでは、本サイトにおける情報の取り扱いについて説明します。
      </p>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>収集する情報</h2>
        <p className={styles.text}>本サイトでは、以下の情報を収集する場合があります。</p>
        <ul className={styles.list}>
          <li>
            <strong>Cookie情報：</strong>
            本サイトでは、ユーザー体験の向上やアクセス解析のためにCookieを使用しています。
          </li>
          <li>
            <strong>アクセスログ：</strong>
            アクセス日時、IPアドレス、ブラウザ情報、参照元URLなどのアクセスログ情報を収集しています。
          </li>
          <li>
            <strong>利用状況データ：</strong>
            ページの閲覧履歴やサイト内での行動データを匿名で収集しています。
          </li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>情報の利用目的</h2>
        <p className={styles.text}>収集した情報は、以下の目的で利用します。</p>
        <ul className={styles.list}>
          <li>本サイトのサービス改善およびユーザー体験の向上</li>
          <li>アクセス解析によるコンテンツの最適化</li>
          <li>広告の配信および効果測定</li>
          <li>不正アクセスの防止およびセキュリティの確保</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>第三者への提供</h2>
        <p className={styles.text}>
          本サイトでは、広告配信事業者（Google AdSense等）を利用する場合があります。
          これらの事業者は、ユーザーの興味に基づいた広告を表示するために、本サイトや他のサイトへのアクセス情報を使用することがあります。
        </p>
        <p className={styles.text}>
          詳細については、各広告配信事業者のプライバシーポリシーをご確認ください。
          ユーザーは、広告設定でパーソナライズ広告を無効にすることができます。
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Cookieの管理</h2>
        <p className={styles.text}>
          ユーザーはブラウザの設定によりCookieを無効にすることができます。
          ただし、Cookieを無効にした場合、本サイトの一部機能が正常に動作しない可能性があります。
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>プライバシーポリシーの変更</h2>
        <p className={styles.text}>
          本プライバシーポリシーは、法令の改正や本サイトの運営方針の変更に伴い、予告なく変更される場合があります。
          変更後のプライバシーポリシーは、本ページに掲載した時点で効力を生じます。
        </p>
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>お問い合わせ</h2>
        <p className={styles.text}>
          本プライバシーポリシーに関するお問い合わせは、本サイトのお問い合わせフォームよりご連絡ください。
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

export default PrivacyPolicyPage
