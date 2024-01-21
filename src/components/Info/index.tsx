import { Genre } from '@/types/genres'
import React from 'react'

import styles from './style.module.scss'
import Image from 'next/image'
import { heartIcon, starIcon } from '@/assets'

interface InfoProps {
  genres: Genre[]
  releaseYear: number | null | undefined | string
  children: React.ReactNode
  averageRating: string | null | undefined
  popularityRank: number | null | undefined
}

export const Info = ({ genres, releaseYear, children, averageRating, popularityRank }: InfoProps) => {
  return (
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
      <div className={styles.children}>
        {children}
      </div>
      <div className={styles.classification}>
        <div className={styles.ratingBox}>
          <Image src={starIcon} alt="star" />
          {averageRating}/100
        </div>
        {popularityRank &&
          <div className={styles.popularityBox}>
            <Image src={heartIcon} alt="heart" />
            #{popularityRank}
          </div>}
      </div>
    </div>
  )
}
