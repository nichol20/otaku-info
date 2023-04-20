import axios, { CancelTokenSource } from "axios"
import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"
import Image from "next/image"

import { Anime } from "@/types/animes"
import { singleAnimeUrl } from "@/utils/api"
import { getFromCache, setToCache } from "@/utils/sessionStorage"
import { Genre } from "@/types/genres"
import { Episodes, Header, Info, InfoItem, Loading, StreamingReferences, YouTubePlayer } from "@/components"
import { YouTubePlayerRef } from "@/components/YouTubePlayer"
import { ApiResponse } from "@/types/api"

import { playIcon } from "@/assets"
import styles from '@/styles/AnimePage.module.scss'

export default function AnimePage() {
  const router = useRouter()
  const [ anime, setAnime ] = useState<Anime>()
  const [ genres, setGenres ] = useState<Genre[]>([])
  const releaseYear = anime ? new Date(anime.attributes.startDate).getFullYear() : ''
  const youtubeRef = useRef<YouTubePlayerRef>(null) 

  const fetchAnime = async (cancelToken: CancelTokenSource) => {
    const animeId = typeof router.query.animeId === 'string' ? router.query.animeId : ''
    const cacheKey = `anime:${animeId}`
    const cachedAnime = getFromCache<Anime>(cacheKey)

    if(cachedAnime) {
      setAnime(cachedAnime)
      return cachedAnime
    }
    
    try {
      const { data } = await axios.get<ApiResponse<Anime>>(singleAnimeUrl(animeId), { 
        cancelToken: cancelToken.token
      })

      if(!data.data) {
        router.push('/404')
        return
      }

      setAnime(data.data)
      setToCache(cacheKey, data.data)
      return data.data
      
    } catch (error) {
      if(axios.isCancel(error)) {
      }
    }
  }

  const fetchGenres = async (anime: Anime, cancelToken: CancelTokenSource) => {
    const animeId = typeof router.query.animeId === 'string' ? router.query.animeId : ''
    const cacheKey = `anime:${animeId}:genres`
    const cachedGenres = getFromCache<Genre[]>(cacheKey)

    if(cachedGenres) {
      setGenres(cachedGenres)
      return
    }

    try {
      const { data } = await axios.get<ApiResponse<Genre[]>>(anime.relationships.genres.links.related, {
        cancelToken: cancelToken.token
      })
  
      setToCache(cacheKey, data.data)
      setGenres(data.data)
    } catch (error) {
      if(axios.isCancel(error)) {
      }
    }
  }

  const init = async (cancelToken: CancelTokenSource) => {
    const anime = await fetchAnime(cancelToken)

    if(!anime) return
    fetchGenres(anime, cancelToken)
  }

  const showTrailer = () => {
    youtubeRef.current?.show()
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

  if(!anime) return <Loading />

  return(
    <div className={styles.animePage}>
      <Header />
      <div className={styles.bannerContainer}>
        {anime?.attributes.coverImage?.original && <div className={styles.bgImgBox}>
          <img src={anime?.attributes.coverImage?.original} alt="cover" />
        </div>}
        <div className={styles.grid}>
          <h1 className={styles.title}>{anime?.attributes.titles.en_jp}</h1>
          <div className={styles.posterImgBox}>
            <img src={anime?.attributes.posterImage.original} alt="poster" />
          </div>
      
          <Info
           releaseYear={releaseYear}
           genres={genres}
           averageRating={anime.attributes.averageRating}
           popularityRank={anime.attributes.popularityRank}
          >
              <InfoItem name="show type" value={anime.attributes.showType} />
              <InfoItem name="episodes" value={anime.attributes.episodeCount} />
              <InfoItem name="runtime" value={
                anime.attributes.episodeLength ? `${anime.attributes.episodeLength}min` : null} />
              <InfoItem name="total runtime" value={
                anime.attributes.totalLength ? `${anime.attributes.totalLength}min`: null} />
              <InfoItem name="status" value={anime.attributes.status} />
              <InfoItem name="nsfw" value={anime.attributes.nsfw ? 'yes' : 'no'} />
              <InfoItem name="age guide" value={anime.attributes.ageRatingGuide} />
          </Info>

          <div className={styles.trailerBtnContainer}>
            <button
              className={styles.trailerBtn} 
              onClick={showTrailer} 
              disabled={!anime.attributes.youtubeVideoId}
            >
              Watch trailer
              <Image src={playIcon} alt="play" className={styles.playIcon} />
            </button>
          </div>
        </div>
      </div>

      <YouTubePlayer videoId={anime.attributes.youtubeVideoId} ref={youtubeRef}/>

      <div className={styles.detailsContainer}>
        <div className={styles.detail}>
          <h3 className={styles.detailTitle}>Where to watch</h3>
          <StreamingReferences dataUrl={anime.relationships.streamingLinks.links.related} />
        </div>
        <div className={styles.detail}>
          <h3 className={styles.detailTitle}>Synopsis</h3>
          <div className={styles.synopsis}>
            {anime.attributes.synopsis}
          </div>
        </div>
      </div>

      <Episodes dataUrl={anime.relationships.episodes.links.related} />
    </div>
  )
}
