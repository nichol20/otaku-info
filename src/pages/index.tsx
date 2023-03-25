import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.scss'
import { AnimeCard } from '@/components'

const inter = Inter({ subsets: ['latin'] })

const animes = [ {title: 'Animes'}]

export default function Home() {
  return (
    <div className={styles.app}>
      <div className={styles.animes}>
        {animes.map((anime, index) => (
          <AnimeCard key={index} anime={anime} />
        ))}
      </div>
    </div>
  )
}
