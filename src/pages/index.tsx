import axios from 'axios'
import { GetServerSideProps } from 'next'
import { useEffect, useState } from 'react'

import { Anime } from '@/types/animes'
import { animesUrl } from '@/utils/api'
import { AnimeCard, SearchInput } from '@/components'

import styles from '@/styles/Home.module.scss'
import { ApiResponse } from '@/types/api'

interface HomeProps {
  initialAnimes: Anime[]
}

const pageLimit = 12 

export default function Home({ initialAnimes }: HomeProps) {
  const [ page, setPage ] = useState(1)
  const [ animes, setAnimes ] = useState<Anime[]>(initialAnimes)
  const [ searchValue, setSearchValue ] = useState('')

  const handleScroll = () => {
    // The scrollTop property sets or returns the number of pixels an element's content is scrolled vertically
    const scrollTop = document.documentElement.scrollTop 
    // interior height of the window in pixels
    const windowHeight = window.innerHeight
    // The scrollHeight returns the height of an element
    const scrollHeight = document.documentElement.scrollHeight
  
    if (scrollTop + windowHeight >= scrollHeight) {
      fetchAnimes(animesUrl(pageLimit, page * pageLimit, searchValue))
    }
  }

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

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [ page ])

  return (
    <div className={styles.app}>
      <SearchInput onSearch={onSearch} delay={500} />
      <div className={styles.animes}>
        {animes.map((anime, index) => (
          <AnimeCard key={index} anime={anime} />
        ))}
      </div>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async () => {
  const { data } = await axios.get<ApiResponse<Anime[]>>(animesUrl(pageLimit, 0))

  return {
    props: {
      initialAnimes: data.data
    }
  }
}