import React from 'react'

import { Anime } from '@/types/animes'

import styles from './style.module.scss'

interface AnimeCardProps {
  anime: Anime
}

export const AnimeCard = ({ anime }: AnimeCardProps) => {
  return (
    <div className={styles.animeCard}>
      <div className={styles.content}>
        <div className={styles.posterImageBox}>
          <img src={anime.attributes.posterImage.medium} alt="poster image" className={styles.posterImage}/>
        </div>
        <div className={styles.details}>
          {anime.attributes.description}
        </div>
      </div>
    </div>
  )
}
