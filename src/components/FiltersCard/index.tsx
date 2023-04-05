import React, { forwardRef, useImperativeHandle, useState } from 'react'

import { Card } from '../Card'
import { availableGenres } from '@/data/availableGenres'
import { debounce } from '@/utils/debounce'

import styles from './style.module.scss'
import { Filters } from '@/types/filters'
import { seasons } from '@/data/seasons'
import { ArrayElementType } from '@/types/array'

interface FiltersProps {
  onChange: (filter: Filters) => void
}

export interface FiltersRef {
  show: () => void
  close: () => void
}

interface FiltersCardFilters {
  genres: string[]
  season: NonNullable<Filters['season']>
}

export const FiltersCard = forwardRef<FiltersRef, FiltersProps>(
  ({ onChange }, ref) => {
  const [ showFilters, setShowFilters ] = useState(true)
  const [ filters, setFilters ] = useState<FiltersCardFilters>({ genres: [], season: ''})

  const handleClick = <K extends keyof FiltersCardFilters>(
    category: K, 
    value: string
  ) => {
    setFilters(prev => {
      const newState = {...prev}

      if(Array.isArray(newState[category])) {
        if(!newState[category].includes(value)) {
          (newState[category] as string[]) = [...(newState[category] as string[]), value] 
        } else {
          (newState[category] as string[]) = (newState[category] as string[]).filter(v => v !== value)
        }
      } else {
        (newState[category] as string) = value 
      }

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
    setFilters({ genres: [], season: '' })
    onChange({ genres: [], season: '' })
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
              >{season
              }</div>
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
