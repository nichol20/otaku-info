import { Anime } from '@/types/animes'
import { ApiResponse } from '@/types/api'
import { Episode } from '@/types/episodes'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

import styles from './style.module.scss'
import { useInfiniteScrolling } from '@/hooks/useIniniteScrolling'

interface EpisodesProps {
  dataUrl: string
}

const episodeLimit = 20

export const Episodes = ({ dataUrl }: EpisodesProps) => {
  const [ episodes, setEpisodes ] = useState<Episode[]>([])
  const [ page, setPage ] = useState(0)

  const fetchEpisodes = async (url: string) => {
    try {
      const response = await axios.get<ApiResponse<Episode[]>>(url)

      setEpisodes(prev => [...prev, ...response.data.data])
      setPage(prev => prev + 1)
    } catch (error) {
      console.error(error)
      return
    }
  }

  useInfiniteScrolling(() => {
    fetchEpisodes(`${dataUrl}?page[limit]=${episodeLimit}&page[offset]=${episodeLimit * page}`)
  }, [ page ])

  return (
    <div className={styles.container}>
      {episodes.map((ep, index) => (
        <div className={styles.episode} key={index}>
            {ep.attributes.thumbnail?.original && <div className={styles.thumbnailBox}>
              <img src={ep.attributes.thumbnail.original} alt="thumbnail" />
              {ep.attributes.length && <span className={styles.time}>{ep.attributes.length}min</span>}
            </div>}
            <div className={styles.info}>
              <h5 className={styles.title}>
                Episode {ep.attributes.number} 
                {ep.attributes.titles?.en_jp && ` - ${ep.attributes.titles.en_jp}`}
              </h5>
              <div className={styles.synopsis}>{ep.attributes.synopsis}</div>
            </div>
        </div>
      ))}
    </div>
  )
}
