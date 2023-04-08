import axios, { CancelTokenSource } from 'axios'
import Image from 'next/image'
import { GetServerSideProps } from 'next'
import { useEffect, useRef, useState } from 'react'

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
import { debounce } from '@/utils/debounce'
import { getFromCache, setToCache } from '@/utils/sessionStorage'

const pageLimit = 12 

export default function Home() {
  const [ page, setPage ] = useState(-1)
  const [ animes, setAnimes ] = useState<Anime[]>([])
  const [ searchValue, setSearchValue ] = useState('')

  const filtersCardRef = useRef<FiltersRef>(null)

  const fetchAnimes = async (url: string, cancelToken?: CancelTokenSource) => {
    const animesCacheKey = `animes:home`
    const pageCacheKey = `page:home`
    const cachedAnime = getFromCache<Anime[]>(animesCacheKey)
    const cachedPage = getFromCache<number>(pageCacheKey)

    if(cachedAnime && cachedPage && cachedPage > page) {
      setAnimes(cachedAnime)
      setPage(cachedPage)
      return
    }

    try {
      const { data } = await axios.get<ApiResponse<Anime[]>>(url, { cancelToken: cancelToken?.token })

      if(data.data.length === 0) return

      setAnimes(prev => {
        const newState = [...prev, ...data.data]
        setToCache(animesCacheKey, newState)
        return newState
      })
      setPage(prev => {
        const newState = prev + 1
        setToCache(pageCacheKey, newState)
        return newState
      })

    } catch (error) {
      if(axios.isCancel(error)) {
        console.log('animes request cancelled!')
        return
      }
      console.error('Failed to fetch new animes')
    }
  }

  const handleSearch = async (value: string) => {
    const selectedFilters = filtersCardRef.current?.getSelectedFilters()
    setPage(0)
    setAnimes([])
    setSearchValue(value)
    console.log({ ...selectedFilters, text: value })
    await fetchAnimes(animesUrl(pageLimit, 0, { ...selectedFilters, text: value }))
  }

  const handleFiltersChange = debounce(async (filters: Filters) => {
    setPage(0)
    setAnimes([])
    await fetchAnimes(animesUrl(pageLimit, 0, { ...filters, text: searchValue }))
  }, 1000)

  const handleFiltersBtnClick = () => {
    filtersCardRef.current?.show()
  }

  useEffect(() => {
    const cancelToken = axios.CancelToken.source()

    if(animes.length === 0) {
      fetchAnimes(trendingAnimeUrl(), cancelToken)
    }

    return () => {
      cancelToken.cancel()
    }
  }, [])

  useInfiniteScrolling(() => {
    const cancelToken = axios.CancelToken.source()

    fetchAnimes(animesUrl(pageLimit, page * pageLimit, { text: searchValue }), cancelToken)

    return () => {
      cancelToken.cancel()
    }
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