import React, { useEffect, useState } from 'react'
import Router from 'next/router'
import axios from 'axios'

import { Anime } from '@/types/animes'
import { ApiResponse } from '@/types/api'
import { Genre } from '@/types/genres'

import styles from './style.module.scss'
import { API_BASE_URL } from '@/data/api'

interface AnimeCardProps {
  anime: Anime
}

const maxGenresNum = 3

export const AnimeCard = ({ anime }: AnimeCardProps) => {
  const releaseYear = new Date(anime.attributes.startDate).getFullYear()
  const [ genres, setGenres ] = useState<Genre[]>([])

  const handleAnimeCardClick = () => {
    Router.push(`/animes/${anime.id}`)
  }

  const fetchGenres = async () => {
    try {
      const { data } = await axios.get<ApiResponse<Genre[]>>(anime.relationships.genres.links.related, {
        baseURL: API_BASE_URL
      })
      setGenres(data.data)
    } catch (error) {
      console.log(anime)
      return
    }
  }

  useEffect(() => {
    fetchGenres()
  }, [])


  return (
    <div className={styles.animeCard} onClick={handleAnimeCardClick}>
      <div className={styles.content}>
        <div className={styles.posterImageBox}>
          {anime.attributes.posterImage?.medium &&
            <img src={anime.attributes.posterImage.medium} alt="poster image" className={styles.posterImage}/>}
        </div>
        <div className={styles.details}>
          <div className={styles.title}>
            {anime.attributes.titles.en_jp}
          </div>
          <div className={styles.meta}>
            <span className={styles.release}>{releaseYear}</span>
            {genres.length > 0 && <span>•</span>}
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
