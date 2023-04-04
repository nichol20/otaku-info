import React, { forwardRef, useImperativeHandle, useState } from 'react'

import { Card } from '../Card'
import { availableGenres } from '@/data/availableGenres'
import { debounce } from '@/utils/debounce'

import styles from './style.module.scss'

interface FiltersProps {
  onChange: (filter: Filters) => void
}

export interface FiltersRef {
  show: () => void
  close: () => void
}

interface Filters {
  genres: string[]
}

export const FiltersCard = forwardRef<FiltersRef, FiltersProps>(
  ({ onChange }, ref) => {
  const [ showFilters, setShowFilters ] = useState(true)
  const [ filters, setFilters ] = useState<Filters>({ genres: [] })

  const handleClick = (category: keyof Filters, value: string) => {
    setFilters(prev => {
      const newState = {...prev}

      if(!newState[category].includes(value)) {
        newState[category] = [...newState[category], value] 
      } else {
        newState[category] = newState[category].filter(v => v !== value)
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

  const getClass = (category: keyof Filters, value: string): string => {
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
    setFilters({ genres: [] })
    onChange({ genres: [] })
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
      </div>

      <div className={styles.actions}>
        <button className={styles.cleanBtn} onClick={cleanFilters}>clean</button>
        <button className={styles.closeBtn} onClick={close}>close</button>
      </div>
    </Card>
  )
})
