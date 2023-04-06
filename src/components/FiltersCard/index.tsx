import React, { forwardRef, useImperativeHandle, useState } from 'react'

import { Card } from '../Card'
import { availableGenres } from '@/data/availableGenres'

import styles from './style.module.scss'
import { Filters, Season, Streamer } from '@/types/filters'
import { seasons } from '@/data/seasons'
import { streamers } from '@/data/streamers'

interface FiltersProps {
  onChange: (filter: Filters) => void
}

export interface FiltersRef {
  show: () => void
  close: () => void
}

interface FiltersCardFilters {
  genres: string[]
  season: Season | ""
  streamers: Streamer[]
  [key: string]: string | string[]
}

const INITIAL_FILTERS: FiltersCardFilters = {
  genres: [],
  season: '',
  streamers: []
} 

export const FiltersCard = forwardRef<FiltersRef, FiltersProps>(
  ({ onChange }, ref) => {
  const [ showFilters, setShowFilters ] = useState(true)
  const [ filters, setFilters ] = useState<FiltersCardFilters>(INITIAL_FILTERS)

  const handleClick = (category:  keyof FiltersCardFilters, value: string) => {
    setFilters(prev => {
      const newState = {...prev}
      let newCategory = newState[category] 

      if(Array.isArray(newCategory)) {
        newCategory = newCategory.includes(value) 
          ? newCategory.filter(v => v !== value) // remove
          : [...newCategory, value] // push

      } else {
        newCategory = newCategory === value ? '' : value
      }

      newState[category] = newCategory


      onChange(newState)
      return newState
    })
  }

  const handleCardClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if(event.currentTarget === event.target) {
      close()
    }
  }

  const getClass = (category: keyof FiltersCardFilters, value: string): string => {
    if(filters[category].includes(value)) return styles.selected
    else return ''
  }

  const show = () => {
    setShowFilters(true)
  }

  const close = () => {
    setShowFilters(false)
  }

  const cleanFilters = () => {
    setFilters(INITIAL_FILTERS)
    onChange(INITIAL_FILTERS)
  }

  useImperativeHandle(ref, () => ({
    show,
    close
  }))

  if(!showFilters) return null

  return (
    <Card onClick={handleCardClick}>
      <div className={styles.filters}>
        <div className={styles.category}>
          <span className={styles.title}>Genres</span>
          <div className={styles.values}>
            {availableGenres.map((genre, index) => (
              <div
               className={`${styles.value} ${getClass('genres', genre.name)}`} 
               key={index}
               onClick={() => handleClick('genres', genre.name)}
              >{genre.name}</div>
            ))}
          </div>
        </div>
        <div className={styles.category}>
          <span className={styles.title}>Season</span>
          <div className={styles.values}>
            {seasons.map((season, index) => (
              <div
               className={`${styles.value} ${getClass('season', season)}`} 
               key={index}
               onClick={() => handleClick('season', season)}
              >{season}</div>
            ))}
          </div>
        </div>
        <div className={styles.category}>
          <span className={styles.title}>Streamer</span>
          <div className={styles.values}>
            {streamers.map((streamer, index) => (
              <div
               className={`${styles.value} ${getClass('streamers', streamer)}`} 
               key={index}
               onClick={() => handleClick('streamers', streamer)}
              >{streamer}</div>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.cleanBtn} onClick={cleanFilters}>clean</button>
        <button className={styles.closeBtn} onClick={close}>close</button>
      </div>
    </Card>
  )
})
