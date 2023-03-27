import React, { useEffect, useState } from 'react'

import { Anime } from '@/types/animes'

import styles from './style.module.scss'
import { Genre } from '@/types/genres'
import axios from 'axios'

interface AnimeCardProps {
  anime: Anime
}

const maxGenresNum = 3

export const AnimeCard = ({ anime }: AnimeCardProps) => {
  const createdAt = new Date(anime.attributes.createdAt).getFullYear()
  const [ genres, setGenres ] = useState<Genre[]>([])


  const fetchGenres = async () => {
    try {
      const { data } = await axios.get(anime.relationships.genres.links.related)

      setGenres(data.data)
    } catch (error) {
      return
    }
  }

  useEffect(() => {
    fetchGenres()
  }, [])


  return (
    <div className={styles.animeCard}>
      <div className={styles.content}>
        <div className={styles.posterImageBox}>
          <img src={anime.attributes.posterImage.medium} alt="poster image" className={styles.posterImage}/>
        </div>
        <div className={styles.details}>
          <div className={styles.title}>
            {anime.attributes.titles.en_jp}
          </div>
          <div className={styles.info}>
            <span className={styles.release}>{createdAt}</span>
            <span>•</span>
            {genres.slice(0, maxGenresNum).map((genre, index) => (
              <span className={styles.genres} key={index}>
                {genre.attributes.name}
                {index !== maxGenresNum - 1 ? ', ' : ''}
              </span>
              ))}
          </div>
          <div className={styles.synopsis}>
            {anime.attributes.synopsis}
          </div>
        </div>
      </div>
    </div>
  )
}
