import axios, { CancelTokenSource } from "axios"
import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"

import { Anime } from "@/types/animes"
import { singleAnimeUrl } from "@/utils/api"

import styles from '@/styles/AnimePage.module.scss'
import Image from "next/image"
import { playIcon, starIcon } from "@/assets"
import { Genre } from "@/types/genres"
import { Episodes, StreamingReferences, YouTubePlayer } from "@/components"
import { YouTubePlayerRef } from "@/components/YouTubePlayer"
import { ApiResponse } from "@/types/api"
import { getFromCache, setToCache } from "@/utils/sessionStorage"

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

      setAnime(data.data)
      setToCache(cacheKey, data.data)
      return data.data
      
    } catch (error) {
      if(axios.isCancel(error)) {
        console.log('anime request cancelled!')
      }
    }
  }

  const fetchGenres = async (anime: Anime | undefined, cancelToken: CancelTokenSource) => {
    const animeId = typeof router.query.animeId === 'string' ? router.query.animeId : ''
    const cacheKey = `anime:${animeId}:genres`
    const cachedGenres = getFromCache<Genre[]>(cacheKey)

    if(cachedGenres) {
      setGenres(cachedGenres)
      return
    }

    if(!anime) return

    try {
      const { data } = await axios.get<ApiResponse<Genre[]>>(anime.relationships.genres.links.related, {
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
    const anime = await fetchAnime(cancelToken)
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

  if(!anime) return null

  return(
    <div className={styles.animePage}>
      <div className={styles.bannerContainer}>
        {anime?.attributes.coverImage?.original && <div className={styles.bgImgBox}>
          <img src={anime?.attributes.coverImage?.original} alt="background" />
        </div>}
        <div className={styles.grid}>
          <h1 className={styles.title}>{anime?.attributes.titles.en_jp}</h1>
          <div className={styles.posterImgBox}>
            <img src={anime?.attributes.posterImage.original} alt="" />
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
              <span className={styles.name}>show type: </span>
              <span className={styles.value}>{anime.attributes.showType}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.name}>episodes: </span>
              <span className={styles.value}>{anime.attributes.episodeCount}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.name}>runtime: </span>
              <span className={styles.value}>{anime.attributes.episodeLength}min</span>
            </div>
            <div className={styles.item}>
              <span className={styles.name}>total runtime: </span>
              <span className={styles.value}>{anime.attributes.totalLength}min</span>
            </div>
            <div className={styles.item}>
              <span className={styles.name}>status: </span>
              <span className={styles.value}>{anime.attributes.status}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.name}>nsfw: </span>
              <span className={styles.value}>{anime.attributes.nsfw ? 'yes' : 'no'}</span>
            </div>
            <div className={styles.item}>
              <span className={styles.name}>age guide: </span>
              <span className={styles.value}>{anime.attributes.ageRatingGuide}</span>
            </div>
            <div className={styles.ratingBox}>
              <Image src={starIcon} alt="star" />
              {anime.attributes.averageRating}/100
            </div>
          </div>

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
