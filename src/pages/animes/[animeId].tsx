import axios from "axios"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

import { Anime } from "@/types/animes"
import { singleAnimeUrl } from "@/utils/api"

import styles from '@/styles/AnimePage.module.scss'
import Image from "next/image"
import { playIcon } from "@/assets"
import { Genre } from "@/types/genres"

export default function AnimePage() {
  const router = useRouter()
  const [ anime, setAnime ] = useState<Anime>()
  const [ genres, setGenres ] = useState<Genre[]>([])
  const releaseYear = anime ? new Date(anime.attributes.createdAt).getFullYear() : ''

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
              </div>
              <button className={styles.trailerBtn}>
                Watch trailer
                <Image src={playIcon} alt="play" className={styles.playIcon} />
              </button>
          </div>
        </div>
      </div>
    </div>
  )
}