import { bannerImg } from '@/assets'
import styles from '@/styles/Home.module.scss'
import Image from 'next/image'
import Link from 'next/link'

export default function Home() {

  return (
    <div className={styles.app}>
      <div className={styles.bannerContainer}>
        <Image src={bannerImg} alt="anime banner" className={styles.bannerImg} />
      </div>
      <div className={styles.container}>
        <h1 className={styles.logo}>Otaku info</h1>
        <span className={styles.description}>Looking for anime or manga information? You're in the right place</span>
        <div className={styles.linkContainer}>
          <Link href="/animes" className={styles.mainLink}>Animes</Link>
          <span>Or</span>
          <Link href="/mangas" className={styles.mainLink}>Mangas</Link>
        </div>
      </div>
    </div>
  )
}