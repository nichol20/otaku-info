import styles from '@/styles/Home.module.scss'
import Link from 'next/link'

export default function Home() {

  return (
    <div className={styles.app}>
      <div className={styles.container}>
        <h1 className={styles.logo}>Animes and Mangas</h1>
        <span className={styles.description}>You want to find anime and manga information? This is the right place</span>
        <div className={styles.linkContainer}>
          <Link href="/animes" className={styles.mainLink}>Animes</Link>
          <span>Or</span>
          <Link href="/mangas" className={styles.mainLink}>Mangas</Link>
        </div>
      </div>
    </div>
  )
}