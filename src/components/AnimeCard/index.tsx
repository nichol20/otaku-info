import Link from 'next/link'
import React from 'react'

import styles from './style.module.scss'

interface AnimeCardProps {
  anime: any
}

export const AnimeCard = ({ anime }: AnimeCardProps) => {
  return (
    <div className={styles.animeCard}>
      <h1>{anime.title}</h1>
      <Link href="#">
      
      </Link>
    </div>
  )
}
