import axios from "axios"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

import { Anime } from "@/types/animes"
import { singleAnimeUrl } from "@/utils/api"

import styles from '@/styles/AnimePage.module.scss'
import Image from "next/image"
import { playIcon } from "@/assets"
import { Genre } from "@/types/genres"
import { Episodes } from "@/components"

export default function AnimePage() {
  const router = useRouter()
  const [ anime, setAnime ] = useState<Anime>()
  const [ genres, setGenres ] = useState<Genre[]>([])
  const releaseYear = anime ? new Date(anime.attributes.startDate).getFullYear() : ''

  const fetchAnime = async () => {
    try {
      const animeId = typeof router.query.animeId === 'string' ? router.query.animeId : ''
      const { data } = await axios.get(singleAnimeUrl(animeId))

      setAnime(data.data)
      return data.data
    } catch (error) {
      console.error('Failed to fetch the anime')
      return
    }
  }

  const fetchGenres = async (anime: Anime) => {
    try {
      const { data } = await axios.get(anime.relationships.genres.links.related)

      setGenres(data.data)
    } catch (error) {
      return
    }
  }

  const init = async () => {
    const anime = await fetchAnime()
    fetchGenres(anime)
  }

  useEffect(() => {
    if(router.isReady) {
      init()
    }
  }, [ router.isReady ])

  if(!anime) return null

  return(
    <div className={styles.animePage}>
      <div className={styles.bannerContainer}>
        <div className={styles.bgImgBox}>
          <img src={anime?.attributes.coverImage?.original} alt="background" />
        </div>
        <div className={styles.content}>
          <div className={styles.posterImgBox}>
            <img src={anime?.attributes.posterImage.original} alt="" />
          </div>
      
          <div className={styles.infoContainer}>
              <div className={styles.info}>
                <h1 className={styles.title}>{anime?.attributes.titles.en_jp}</h1>
                <div className={styles.meta}>
                  <span className={styles.release}>{releaseYear}</span>
                  <span>•</span>
                  {genres.map((genre, index) => (
                    <span className={styles.genres} key={index}>
                      {genre.attributes.name}
                      {index !== genres.length - 1 ? ', ' : ''}
                    </span>
                    ))}
                </div>
                <div className={styles.otherInfo}>
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
                </div>
              </div>
              <button className={styles.trailerBtn}>
                Watch trailer
                <Image src={playIcon} alt="play" className={styles.playIcon} />
              </button>
          </div>
        </div>
      </div>

      <div className={styles.detailsContainer}>
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