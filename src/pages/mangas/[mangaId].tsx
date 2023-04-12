
import { starIcon } from '@/assets'
import styles from '@/styles/MangaPage.module.scss'
import { ApiResponse } from '@/types/api'
import { Genre } from '@/types/genres'
import { Manga } from '@/types/mangas'
import { singleMangaUrl } from '@/utils/api'
import { getFromCache, setToCache } from '@/utils/sessionStorage'
import axios, { CancelTokenSource } from 'axios'
import Image from 'next/image'
import { useRouter } from 'next/router'
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

      setManga(data.data)
      setToCache(cacheKey, data.data)
      return data.data
      
    } catch (error) {
      if(axios.isCancel(error)) {
        console.log('manga request cancelled!')
      }
    }
  }

  const fetchGenres = async (manga: Manga | undefined, cancelToken: CancelTokenSource) => {
    const mangaId = typeof router.query.mangaId === 'string' ? router.query.mangaId : ''
    const cacheKey = `manga:${mangaId}:genres`
    const cachedGenres = getFromCache<Genre[]>(cacheKey)

    if(cachedGenres) {
      setGenres(cachedGenres)
      return
    }

    if(!manga) return

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
    fetchGenres(manga, cancelToken)
  }

  useEffect(() => {
    const cancelToken = axios.CancelToken.source()
    console.log(manga?.attributes.titles)

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
      <div className={styles.bannerContainer}>
        {manga?.attributes.coverImage?.original && <div className={styles.bgImgBox}>
          <img src={manga?.attributes.coverImage?.original} alt="background" />
        </div>}
        <div className={styles.grid}>
          <h1 className={styles.title}>{manga?.attributes.titles.en_jp}</h1>
          <div className={styles.posterImgBox}>
            <img src={manga?.attributes.posterImage.original} alt="" />
          </div>
      
          <div className={styles.info}>
            <div className={styles.meta}>
              <span className={styles.release}>{releaseYear}</span>
              {genres.length > 0 && <span>•</span>}
              {genres.map((genre, index) => (
                <span className={styles.genres} key={index}>
                  {genre.attributes.name}
                  {index !== genres.length - 1 ? ', ' : ''}
                </span>
                ))}
            </div>
            
            <div className={styles.item}>
              <span className={styles.name}>status: </span>
              <span className={styles.value}>{manga?.attributes.status}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.name}>volumes: </span>
              <span className={styles.value}>{manga?.attributes.volumeCount}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.name}>age guide: </span>
              <span className={styles.value}>{manga?.attributes.ageRatingGuide}</span>
            </div>
            <div className={styles.ratingBox}>
              <Image src={starIcon} alt="star" />
              {manga?.attributes.averageRating}/100
            </div>
          </div>

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