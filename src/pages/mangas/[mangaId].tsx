import { Header, Info, InfoItem } from '@/components'
import styles from '@/styles/MangaPage.module.scss'
import { ApiResponse } from '@/types/api'
import { Genre } from '@/types/genres'
import { Manga } from '@/types/mangas'
import { singleMangaUrl } from '@/utils/api'
import { getFromCache, setToCache } from '@/utils/sessionStorage'
import axios, { CancelTokenSource } from 'axios'
import { Router, useRouter } from 'next/router'
import { useEffect, useState } from 'react'

export default function MangaPage() {
  const router = useRouter()
  const [ manga, setManga ] = useState<Manga>()
  const [ genres, setGenres ] = useState<Genre[]>([])
  const releaseYear = manga?.attributes.startDate ? new Date(manga.attributes.startDate).getFullYear() : ''

  const fetchManga = async (cancelToken: CancelTokenSource) => {
    const mangaId = typeof router.query.mangaId === 'string' ? router.query.mangaId : ''
    const cacheKey = `manga:${mangaId}`
    const cachedManga = getFromCache<Manga>(cacheKey)

    if(cachedManga) {
      setManga(cachedManga)
      return cachedManga
    }
    
    try {
      const { data } = await axios.get<ApiResponse<Manga>>(singleMangaUrl(mangaId), { 
        cancelToken: cancelToken.token
      })

      if(!data.data) {
        router.push('/404')
        return
      }

      setManga(data.data)
      setToCache(cacheKey, data.data)
      return data.data
      
    } catch (error) {
      if(axios.isCancel(error)) {
        console.log('manga request cancelled!')
      }
    }
  }

  const fetchGenres = async (manga: Manga, cancelToken: CancelTokenSource) => {
    const mangaId = typeof router.query.mangaId === 'string' ? router.query.mangaId : ''
    const cacheKey = `manga:${mangaId}:genres`
    const cachedGenres = getFromCache<Genre[]>(cacheKey)

    if(cachedGenres) {
      setGenres(cachedGenres)
      return
    }

    try {
      const { data } = await axios.get<ApiResponse<Genre[]>>(manga.relationships.genres.links.related, {
        cancelToken: cancelToken.token
      })
  
      setToCache(cacheKey, data.data)
      setGenres(data.data)
    } catch (error) {
      if(axios.isCancel(error)) {
        console.log('genres request cancelled!')
      }
    }
  }

  const init = async (cancelToken: CancelTokenSource) => {
    const manga = await fetchManga(cancelToken)

    if(!manga) return
    fetchGenres(manga, cancelToken)
  }

  useEffect(() => {
    const cancelToken = axios.CancelToken.source()

    if(router.isReady) {
      init(cancelToken)
    }

    return () => {
      cancelToken.cancel()
    }
  }, [ router.isReady ])

  if(!manga) return null

  return (
    <div className={styles.mangaPage}>
      <Header />
      <div className={styles.bannerContainer}>
        {manga?.attributes.coverImage?.original && <div className={styles.bgImgBox}>
          <img src={manga?.attributes.coverImage?.original} alt="cover" />
        </div>}
        <div className={styles.grid}>
          <h1 className={styles.title}>{manga?.attributes.titles.en_jp}</h1>
          <div className={styles.posterImgBox}>
            <img src={manga?.attributes.posterImage.original} alt="poster" />
          </div>

          <Info
            releaseYear={releaseYear}
            genres={genres}
            averageRating={manga.attributes.averageRating}
            popularityRank={manga.attributes.popularityRank}
          >
            <InfoItem name="status" value={manga.attributes.status} />
            <InfoItem name="chapters" value={manga.attributes.chapterCount} />
            <InfoItem name="volumes" value={manga.attributes.volumeCount} />
            <InfoItem name="serialization" value={manga.attributes.serialization} />
            <InfoItem name="age guide" value={manga.attributes.ageRatingGuide} />
          </Info>

        </div>
      </div>

      <div className={styles.detailContainer}>
        <div className={styles.detail}>
          <h3 className={styles.detailTitle}>Synopsis</h3>
          <div className={styles.synopsis}>
            {manga?.attributes.synopsis}
          </div>
        </div>
      </div>
    </div>
  )
}