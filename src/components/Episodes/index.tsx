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

  const fetchEpisodes = async (url: string, fetchedEpisodes: Episode[]=[]) => {
    try {
      const response = await axios.get<ApiResponse<Episode[]>>(url)
  
      if(response.data.links && "next" in response.data.links) {
        await fetchEpisodes(
          `${response.data.links.next!}?page[limit]=20`, 
          [...fetchedEpisodes, ...response.data.data]
        )
        return
      }
      setEpisodes([...fetchedEpisodes, ...response.data.data])
    } catch (error) {
      return
    }
  }

  useEffect(() => {
    fetchEpisodes(`${dataUrl}?page[limit]=20`)
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
