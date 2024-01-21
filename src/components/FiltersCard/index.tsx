import React, { forwardRef, useImperativeHandle, useState } from 'react'

import { Card } from '../Card'

import styles from './style.module.scss'
import { AgeRating, Filters, Season, Streamer } from '@/types/filters'
import { seasons, streamers, genres, ageRatings } from '@/data/filters'

interface FiltersProps {
  onChange: (filter: Filters) => void
  type?: 'manga' | 'anime'
}

export interface FiltersRef {
  show: () => void
  close: () => void
  getSelectedFilters: () => FiltersCardFilters
  setCurrentFilters: (filters: Filters) => void
}

interface FiltersCardFilters {
  genres: string[]
  season: Season | ""
  streamers: Streamer[]
  ageRating: AgeRating | ""
  [key: string]: string | string[]
}

const INITIAL_FILTERS: FiltersCardFilters = {
  genres: [],
  season: '',
  streamers: [],
  ageRating: ''
}

export const FiltersCard = forwardRef<FiltersRef, FiltersProps>(
  ({ onChange, type = "anime" }, ref) => {
    const [showFilters, setShowFilters] = useState(false)
    const [filters, setFilters] = useState<FiltersCardFilters>(INITIAL_FILTERS)

    const handleClick = (category: keyof FiltersCardFilters, value: string) => {
      setFilters(prev => {
        const newState = { ...prev }
        let newCategory = newState[category]

        if (Array.isArray(newCategory)) {
          newCategory = newCategory.includes(value)
            ? newCategory.filter(v => v !== value)
            : [...newCategory, value]

        } else {
          newCategory = newCategory === value ? '' : value
        }

        newState[category] = newCategory


        onChange(newState)
        return newState
      })
    }

    const handleCardClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (event.currentTarget === event.target) {
        close()
      }
    }

    const getClass = (category: keyof FiltersCardFilters, value: string): string => {
      if (Array.isArray(filters[category])) {
        return filters[category].includes(value) ? styles.selected : ''
      }

      return filters[category] === value ? styles.selected : ''
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

    const getSelectedFilters = () => {
      return filters
    }

    const setCurrentFilters = (filters: Filters) => {
      const { text, ...rest } = filters

      setFilters(prev => ({ ...prev, ...rest }))
    }

    useImperativeHandle(ref, () => ({
      show,
      close,
      getSelectedFilters,
      setCurrentFilters
    }))

    if (!showFilters) return null

    return (
      <Card onClick={handleCardClick}>
        <div className={styles.filters}>
          <div className={styles.category}>
            <span className={styles.title}>Genres</span>
            <div className={styles.values}>
              {genres.map((genre, index) => (
                <button
                  className={`${styles.value} ${getClass('genres', genre)}`}
                  key={index}
                  onClick={() => handleClick('genres', genre)}
                >{genre}</button>
              ))}
            </div>
          </div>
          {type === 'anime' && <div className={styles.category}>
            <span className={styles.title}>Season</span>
            <div className={styles.values}>
              {seasons.map((season, index) => (
                <button
                  className={`${styles.value} ${getClass('season', season)}`}
                  key={index}
                  onClick={() => handleClick('season', season)}
                >{season}</button>
              ))}
            </div>
          </div>}
          {type === 'anime' && <div className={styles.category}>
            <span className={styles.title}>Streamer</span>
            <div className={styles.values}>
              {streamers.map((streamer, index) => (
                <button
                  className={`${styles.value} ${getClass('streamers', streamer)}`}
                  key={index}
                  onClick={() => handleClick('streamers', streamer)}
                >{streamer}</button>
              ))}
            </div>
          </div>}

          {type === 'anime' && <div className={styles.category}>
            <span className={styles.title}>Age rating</span>
            <div className={styles.values}>
              {ageRatings.map((ageRating, index) => (
                <button
                  className={`${styles.value} ${getClass('ageRating', ageRating)}`}
                  key={index}
                  onClick={() => handleClick('ageRating', ageRating)}
                >{ageRating}</button>
              ))}
            </div>
          </div>}

        </div>

        <div className={styles.actions}>
          <button className={styles.cleanBtn} onClick={cleanFilters}>clean</button>
          <button className={styles.closeBtn} onClick={close}>close</button>
        </div>
      </Card>
    )
  })
