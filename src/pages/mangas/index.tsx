import { filterIcon } from '@/assets'
import { FiltersCard, Header, SearchInput } from '@/components'
import Image from 'next/image'
import React, { useRef } from 'react'

import styles from '../../styles/Mangas.module.scss'
import { FiltersRef } from '@/components/FiltersCard'

export default function Mangas() {
  const filtersCardRef = useRef<FiltersRef>(null)

  const handleFiltersBtnClick = () => {

  }

  const handleFiltersChange = () => {
    
  }

  const handleSearch = () => {

  }

  return (
    <div className={styles.animesPage}>
      <Header />
      <div className={styles.actions}>
        <div className={styles.spacer}></div>
        <SearchInput onSearch={handleSearch} delay={500} />
        <button className={styles.filtersBtn} onClick={handleFiltersBtnClick}>
          <Image src={filterIcon} alt="filter" />
          Filters
        </button>
      </div>

      <div className={styles.animes}>
        
      </div>
      <FiltersCard ref={filtersCardRef} onChange={handleFiltersChange}/>
    </div>
  )
}