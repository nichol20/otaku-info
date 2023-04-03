import axios from 'axios'
import { GetServerSideProps } from 'next'
import { useEffect, useState } from 'react'

import { Anime } from '@/types/animes'
import { animesUrl, trendingAnimeUrl } from '@/utils/api'
import { AnimeCard, SearchInput } from '@/components'

import styles from '@/styles/Home.module.scss'
import { ApiResponse } from '@/types/api'
import { useInfiniteScrolling } from '@/hooks/useIniniteScrolling'
import { Filters } from '@/components/Filters'

interface HomeProps {
  initialAnimes: Anime[]
}

const pageLimit = 12 

export default function Home({ initialAnimes }: HomeProps) {
  const [ page, setPage ] = useState(0)
  const [ animes, setAnimes ] = useState<Anime[]>(initialAnimes)
  const [ searchValue, setSearchValue ] = useState('')

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

  const onSearch = async (value: string) => {
    setPage(0)
    setAnimes([])
    setSearchValue(value)
    console.log(value)
    await fetchAnimes(animesUrl(pageLimit, 0, value))
  }

  useInfiniteScrolling(() => {
    fetchAnimes(animesUrl(pageLimit, page * pageLimit, searchValue))
  }, [ page ])

  return (
    <div className={styles.app}>
      <SearchInput onSearch={onSearch} delay={500} />
      <div className={styles.animes}>
        {animes.map((anime, index) => (
          <AnimeCard key={index} anime={anime} />
        ))}
      </div>
      <Filters />
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