import axios from 'axios'
import Image from 'next/image'
import { GetServerSideProps } from 'next'
import { useRef, useState } from 'react'

import { Anime } from '@/types/animes'
import { animesUrl, trendingAnimeUrl } from '@/utils/api'
import { AnimeCard, SearchInput } from '@/components'
import { ApiResponse } from '@/types/api'
import { useInfiniteScrolling } from '@/hooks/useIniniteScrolling'
import { FiltersCard } from '@/components' 
import { Filters } from '@/types/filters'
import { FiltersRef } from '@/components/FiltersCard'

import styles from '@/styles/Home.module.scss'
import { filterIcon } from '@/assets'

interface HomeProps {
  initialAnimes: Anime[]
}

const pageLimit = 12 

export default function Home({ initialAnimes }: HomeProps) {
  const [ page, setPage ] = useState(0)
  const [ animes, setAnimes ] = useState<Anime[]>(initialAnimes)
  const [ searchValue, setSearchValue ] = useState('')

  const filtersCardRef = useRef<FiltersRef>(null)

  const fetchAnimes = async (url: string) => {
    try {
      const { data } = await axios.get<ApiResponse<Anime[]>>(url)
      setAnimes(prev => [...prev, ...data.data])
      setPage(prev => prev + 1)
    } catch (error) {
      console.error('Failed to fetch new animes')
      return
    }
  }

  const handleSearch = async (value: string) => {
    setPage(0)
    setAnimes([])
    setSearchValue(value)
    await fetchAnimes(animesUrl(pageLimit, 0, { text: value }))
  }

  const handleFiltersChange = async (filters: Filters) => {
    setPage(0)
    setAnimes([])
    await fetchAnimes(animesUrl(pageLimit, 0, filters))
  }

  const handleFiltersBtnClick = () => {
    filtersCardRef.current?.show()
  }

  useInfiniteScrolling(() => {
    fetchAnimes(animesUrl(pageLimit, page * pageLimit, { text: searchValue }))
  }, [ page ])

  return (
    <div className={styles.app}>
      <div className={styles.actions}>
        <div className={styles.spacer}></div>
        <SearchInput onSearch={handleSearch} delay={500} />
        <button className={styles.filtersBtn} onClick={handleFiltersBtnClick}>
          <Image src={filterIcon} alt="filter" />
          Filters
        </button>
      </div>

      <div className={styles.animes}>
        {animes.map((anime, index) => (
          <AnimeCard key={index} anime={anime} />
        ))}
      </div>
      <FiltersCard ref={filtersCardRef} onChange={handleFiltersChange}/>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const { data } = await axios.get<ApiResponse<Anime[]>>(trendingAnimeUrl())

  return {
    props: {
      initialAnimes: data.data
    }
  }
}