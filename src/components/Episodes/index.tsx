import { Anime } from '@/types/animes'
import { ApiResponse } from '@/types/api'
import { Episode } from '@/types/episodes'
import axios from 'axios'
import React, { useEffect, useState } from 'react'

import styles from './style.module.scss'

interface EpisodesProps {
  dataUrl: string
}

export const Episodes = ({ dataUrl }: EpisodesProps) => {
  const [ episodes, setEpisodes ] = useState<Episode[]>([])

  const fetchEpisodes = async () => {
    try {
      const { data } = await axios.get<ApiResponse<Episode[]>>(dataUrl)

      setEpisodes(data.data)
    } catch (error) {
      return
    }
  }

  useEffect(() => {
    fetchEpisodes()
  }, [])

  return (
    <div className={styles.container}>
      {episodes.map((ep, index) => (
        <div className={styles.episode} key={index}>
            <div className={styles.thumbnailBox}>
              <img src={ep.attributes.thumbnail?.original} alt="thumbnail" />
              {ep.attributes.length && <span className={styles.time}>{ep.attributes.length}min</span>}
            </div>
            <div className={styles.info}>
              <h5 className={styles.title}>Episode {ep.attributes.number} - {ep.attributes.titles.en_jp}</h5>
              <div className={styles.synopsis}>{ep.attributes.synopsis}</div>
            </div>
        </div>
      ))}
    </div>
  )
}
