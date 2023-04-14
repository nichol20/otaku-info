import axios, { CancelTokenSource } from 'axios'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

import { Anime } from '@/types/animes'
import { animeUrl, mangaUrl, trendingAnimeUrl, trendingMangaUrl } from '@/utils/api'
import { Header, MediaDisplay, SearchInput } from '@/components'
import { ApiResponse } from '@/types/api'
import { useInfiniteScrolling } from '@/hooks/useIniniteScrolling'
import { FiltersCard } from '@/components' 
import { Filters } from '@/types/filters'
import { FiltersRef } from '@/components/FiltersCard'
import { debounce } from '@/utils/debounce'
import { getFromCache, setToCache } from '@/utils/sessionStorage'
import { Manga } from '@/types/mangas'

import styles from './style.module.scss'
import { filterIcon } from '@/assets'

interface MediaPageProps {
  type?: 'anime' | 'manga'
}

const pageLimit = 12 

export const MediaPage = <Media extends Anime | Manga>({ type='anime' }: MediaPageProps) => {
  const [ page, setPage ] = useState(-1)
  const [ medias, setMedias ] = useState<Media[]>([])
  const [ searchValue, setSearchValue ] = useState('')
  const mediaUrl = type === 'anime' ? animeUrl : mangaUrl
  const trendingMediaUrl = type === 'anime' ? trendingAnimeUrl : trendingMangaUrl

  const filtersCardRef = useRef<FiltersRef>(null)

  const fetchMedias = async (url: string, cancelToken?: CancelTokenSource) => {
    const mediaCacheKey = `${type}s-page:${type}s`
    const pageCacheKey = `${type}s-page:page`
    const cachedMedia = getFromCache<Media[]>(mediaCacheKey)
    const cachedPage = getFromCache<number>(pageCacheKey)
    const filters = getFiltersFromCache()

    if(filters && !Object.values(filters).every(v => v.length === 0) && cachedPage && cachedPage > page) {
      url = mediaUrl(pageLimit, cachedPage, filters)
      filtersCardRef.current?.setCurrentFilters(filters)

    }

    if(cachedMedia && cachedPage && cachedPage > page) {
      setMedias(cachedMedia)
      setPage(cachedPage)
      return
    }
    
    try {
      const { data } = await axios.get<ApiResponse<Media[]>>(url, { cancelToken: cancelToken?.token })

      if(data.data.length === 0) return

      setMedias(prev => {
        const newState = [...prev, ...data.data]
        setToCache(mediaCacheKey, newState)
        return newState
      })
      setPage(prev => {
        const newState = prev + 1
        setToCache(pageCacheKey, newState)
        return newState
      })

    } catch (error) {
      if(axios.isCancel(error)) {
        console.log(`${type}s request cancelled!`)
        return
      }
      console.error(`Failed to fetch new ${type}s`)
    }
  }

  const handleSearch = (value: string) => {
    const selectedFilters = filtersCardRef.current?.getSelectedFilters()
    const newFilters = { ...selectedFilters, text: value }

    setSearchValue(value)
    setMedias([])
    setFiltersToCache(newFilters)

    if(Object.values(newFilters).every(v => v.length === 0)) {
      setPage(-1)
      fetchMedias(trendingMediaUrl())
      return
    }
    setPage(0)
    fetchMedias(mediaUrl(pageLimit, 0, newFilters))
  }

  const handleFiltersChange = debounce((filters: Filters) => {
    const newFilters = { ...filters, text: searchValue }
    
    setMedias([])
    setFiltersToCache(newFilters)

    if(Object.values(newFilters).every(v => v.length === 0)) {
      setPage(-1)
      fetchMedias(trendingMediaUrl())
      return
    }

    setPage(0)
    fetchMedias(mediaUrl(pageLimit, 0, newFilters))
  }, 1000)

  const handleFiltersBtnClick = () => {
    filtersCardRef.current?.show()
  }

  const getFiltersFromCache = () => {
    return getFromCache<Filters>(`${type}s-page:filters`)
  }

  const setFiltersToCache = (filters: Filters) => {
    setToCache(`${type}s-page:filters`, filters)
  }

  useEffect(() => {
    const cancelToken = axios.CancelToken.source()

    if(medias.length === 0) {
      fetchMedias(trendingMediaUrl(), cancelToken)
    }

    return () => {
      cancelToken.cancel()
    }
  }, [])

  useInfiniteScrolling(() => {
    const cancelToken = axios.CancelToken.source()

    fetchMedias(mediaUrl(pageLimit, page * pageLimit, { text: searchValue }), cancelToken)

    return () => {
      cancelToken.cancel()
    }
  }, [ page ])

  return (
    <div className={styles.mediaPage}>
      <Header />
      <div className={styles.actions}>
        <div className={styles.spacer}></div>
        <SearchInput onSearch={handleSearch} delay={500} />
        <button className={styles.filtersBtn} onClick={handleFiltersBtnClick}>
          <Image src={filterIcon} alt="filter" />
          Filters
        </button>
      </div>

      <div className={styles.medias}>
        {medias.map((media, index) => (
          <MediaDisplay key={index} media={media} type={type} />
        ))}
      </div>
      <FiltersCard ref={filtersCardRef} onChange={handleFiltersChange} type={type}/>
    </div>
  )
}
