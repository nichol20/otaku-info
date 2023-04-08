import { Anime } from '@/types/animes'
import { ApiResponse } from '@/types/api'
import { Episode } from '@/types/episodes'
import axios, { CancelTokenSource } from 'axios'
import React, { useEffect, useState } from 'react'

import styles from './style.module.scss'
import { useInfiniteScrolling } from '@/hooks/useIniniteScrolling'
import { useRouter } from 'next/router'
import { getFromCache, setToCache } from '@/utils/sessionStorage'

interface EpisodesProps {
  dataUrl: string
}

const episodeLimit = 20

export const Episodes = ({ dataUrl }: EpisodesProps) => {
  const router = useRouter()
  const [ episodes, setEpisodes ] = useState<Episode[]>([])
  const [ page, setPage ] = useState(0)

  const fetchEpisodes = async (url: string, cancelToken?: CancelTokenSource) => {
    const animeId = typeof router.query.animeId === 'string' ? router.query.animeId : ''
    const episodeCacheKey = `anime:${animeId}:episodes`
    const pageCacheKey = `page:episodes`
    const cachedEpisode = getFromCache<Episode[]>(episodeCacheKey)
    const cachedPage = getFromCache<number>(pageCacheKey)

    if(cachedEpisode && cachedPage && cachedPage > page) {
      setEpisodes(cachedEpisode)
      setPage(cachedPage)
      return
    }

    try {
      const response = await axios.get<ApiResponse<Episode[]>>(url, { cancelToken: cancelToken?.token })

      if(response.data.data.length === 0) return

      setEpisodes(prev => {
        const newState = [...prev, ...response.data.data]
        setToCache(episodeCacheKey, newState)
        return newState
      })
      setPage(prev => {
        const newState = prev + 1
        setToCache(pageCacheKey, newState)
        return newState
      })
    } catch (error) {
      if(axios.isCancel(error)) {
        console.log('episodes request cancelled!')
      }
      console.error(error)
      return
    }
  }

  useInfiniteScrolling(() => {
    const cancelToken = axios.CancelToken.source()

    fetchEpisodes(`${dataUrl}?page[limit]=${episodeLimit}&page[offset]=${episodeLimit * page}`, cancelToken)

    return () => {
      cancelToken.cancel()
    }
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
