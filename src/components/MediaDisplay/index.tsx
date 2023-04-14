import React, { useEffect, useState } from 'react'
import Router from 'next/router'
import axios from 'axios'

import { Anime } from '@/types/animes'
import { ApiResponse } from '@/types/api'
import { Genre } from '@/types/genres'

import styles from './style.module.scss'
import { API_BASE_URL } from '@/data/api'
import { Manga } from '@/types/mangas'

interface MediaDisplayProps {
  media: Anime | Manga
  type?: 'manga' | 'anime'
}

const maxGenresNum = 3

export const MediaDisplay = ({ media, type='anime' }: MediaDisplayProps) => {
  const { attributes: { startDate } } = media
  const releaseYear = startDate ? new Date(startDate).getFullYear() : null
  const [ genres, setGenres ] = useState<Genre[]>([])

  const handleMediaDisplayClick = () => {
    Router.push(`/${type}s/${media.id}`)
  }

  const fetchGenres = async () => {
    try {
      const { data } = await axios.get<ApiResponse<Genre[]>>(media.relationships.genres.links.related, {
        baseURL: API_BASE_URL
      })
      setGenres(data.data)
    } catch (error) {
      return
    }
  }

  useEffect(() => {
    if(genres.length === 0) {
      fetchGenres()
    }
  }, [])

  return (
    <div className={styles.mediaDisplay} onClick={handleMediaDisplayClick}>
      <div className={styles.content}>
        <div className={styles.posterImageBox}>
          {media.attributes.posterImage?.medium &&
            <img src={media.attributes.posterImage.medium} alt="poster image" className={styles.posterImage}/>}
        </div>
        <div className={styles.details}>
          <div className={styles.title}>
            {media.attributes.titles.en_jp}
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
            {media.attributes.synopsis}
          </div>
        </div>
      </div>
    </div>
  )
}
