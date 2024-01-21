import axios, { CancelTokenSource } from 'axios'
import Image from 'next/image'
import { useEffect, useRef, useState } from 'react'

import { Anime } from '@/types/animes'
import { animeUrl, mangaUrl, trendingAnimeUrl, trendingMangaUrl } from '@/utils/api'
import { Header, Loading, MediaDisplay, SearchInput, FiltersCard } from '@/components'
import { ApiResponse } from '@/types/api'
import { useInfiniteScrolling } from '@/hooks/useIniniteScrolling'
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

export const MediaPage = <Media extends Anime | Manga>({ type = 'anime' }: MediaPageProps) => {
  const mediaCacheKey = `${type}s-page:${type}s`
  const pageCacheKey = `${type}s-page:page`

  const [page, setPage] = useState(-1)
  const [medias, setMedias] = useState<Media[]>([])
  const [searchValue, setSearchValue] = useState('')
  const [isFetchingMedia, setIsFetchingMedia] = useState(false)
  const [isEndOfScroll, setIsEndOfScroll] = useState(false)
  const mediaUrl = type === 'anime' ? animeUrl : mangaUrl
  const trendingMediaUrl = type === 'anime' ? trendingAnimeUrl : trendingMangaUrl

  const filtersCardRef = useRef<FiltersRef>(null)

  const fetchMedias = async (url: string, cancelToken?: CancelTokenSource) => {
    const cachedMedia = getFromCache<Media[]>(mediaCacheKey)
    const cachedPage = getFromCache<number>(pageCacheKey)
    const filters = getFiltersFromCache()

    const hasFilters = filters && !Object.values(filters).every(v => v.length === 0)
    const isCachedPageGreaterThanPage = typeof cachedPage === 'number' && cachedPage > page

    if (cachedMedia && isCachedPageGreaterThanPage) {
      setMedias(cachedMedia)
      setPage(cachedPage)

      if (hasFilters) {
        filtersCardRef.current?.setCurrentFilters(filters)
        setSearchValue(filters.text || "")
      }
      return
    }

    setIsFetchingMedia(true)
    try {
      const { data } = await axios.get<ApiResponse<Media[]>>(url, { cancelToken: cancelToken?.token })
      if (data.links && !data.links.next) {
        setIsEndOfScroll(true)
      }

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
      if (axios.isCancel(error)) {
        console.log('Request cancelled')
      } else {
        console.error(error)
      }
    } finally {
      setIsFetchingMedia(false)
    }
  }

  const handleSearch = (value: string) => {
    const selectedFilters = filtersCardRef.current?.getSelectedFilters()
    const newFilters = { ...selectedFilters, text: value }
    const hasFilters = !Object.values(newFilters).every(v => v.length === 0)

    setSearchValue(value)

    setMedias([])
    setFiltersToCache(newFilters)
    setIsEndOfScroll(false)

    if (!hasFilters) {
      setPage(-1)
      fetchMedias(trendingMediaUrl())
      return
    }

    setPage(0)
    fetchMedias(mediaUrl(pageLimit, 0, newFilters))
  }

  const handleFiltersChange = debounce((filters: Filters) => {
    const newFilters = { ...filters, text: searchValue }
    const hasFilters = !Object.values(newFilters).every(v => v.length === 0)

    setMedias([])
    setFiltersToCache(newFilters)
    filtersCardRef.current?.setCurrentFilters(newFilters)
    setIsEndOfScroll(false)

    if (!hasFilters) {
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
    if (typeof window !== "undefined") {
      return getFromCache<Filters>(`${type}s-page:filters`)
    }
  }

  const setFiltersToCache = (filters: Filters) => {
    setToCache(`${type}s-page:filters`, filters)
  }

  useEffect(() => {
    const cancelToken = axios.CancelToken.source()

    if (medias.length === 0) {
      fetchMedias(trendingMediaUrl(), cancelToken)
    }

    return () => {
      cancelToken.cancel()
    }
  }, [])

  useInfiniteScrolling(() => {
    if (!isFetchingMedia && !isEndOfScroll) {
      const filters = {
        ...filtersCardRef.current?.getSelectedFilters(),
        text: searchValue
      }

      // for some reason, kitsu api repeats the data from the first page on the second when there are filters (i think)
      const hasFilters = !Object.values(filters).every(v => v.length === 0)
      const offset = hasFilters ? (page + 1) * pageLimit : page * pageLimit

      fetchMedias(mediaUrl(pageLimit, offset, filters))
    }
  }, [page, isFetchingMedia, isEndOfScroll])

  return (
    <div className={styles.mediaPage}>
      <Header />
      <div className={styles.actions}>
        <div className={styles.spacer}></div>
        <SearchInput onSearch={handleSearch} delay={800} defaultValue={getFiltersFromCache()?.text} />
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
      <Loading isLoading={isFetchingMedia} />
      <FiltersCard ref={filtersCardRef} onChange={handleFiltersChange} type={type} />
    </div>
  )
}
