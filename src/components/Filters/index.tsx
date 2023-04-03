import React, { forwardRef } from 'react'

import styles from './style.module.scss'
import { Card } from '../Card'
import { availableGenres } from '@/data/availableGenres'

interface FiltersProps {

}

export interface FiltersRef {

}

export const Filters = forwardRef<FiltersRef, FiltersProps>(
  () => {
  return (
    <Card>
      <div className={styles.filters}>
        <div className={styles.category}>
          <span className={styles.title}>Genres</span>
          <div className={styles.values}>
            {availableGenres.map((genre, index) => (
              <div className={styles.value} key={index}>{genre.name}</div>
            ))}
          </div>
        </div>
      </div>
    </Card>
  )
})
