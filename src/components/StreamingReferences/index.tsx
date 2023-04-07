import React, { useEffect, useState } from 'react'
import axios from 'axios'

import { StreamingLinks } from '@/types/streamingLinks'
import { ApiResponse } from '@/types/api'

import styles from './style.module.scss'
import { streamingLogos } from '@/data/streamingLogos'
import { globeIcon } from '@/assets'
import Image from 'next/image'
import Link from 'next/link'

interface StreamingLinksProps {
  dataUrl: string
}

export const StreamingReferences = ({ dataUrl }: StreamingLinksProps) => {
  const [ streamingLinks, setStreamingLinks ] = useState<StreamingLinks[]>([])

  const fetchStreamingLinks = async () => {
    try {
      const { data } = await axios.get<ApiResponse<StreamingLinks[]>>(dataUrl)
      setStreamingLinks(data.data)
    } catch (error) {
      return
    }
  }

  const getIcon = (link: string) => {
    const icon = streamingLogos.filter(logo => link.includes(logo.streamer))[0]
    return !!icon ? icon.icon : globeIcon
  }

  useEffect(() => {
    fetchStreamingLinks()
  }, [])

  return (
    <div className={styles.container}>
      {streamingLinks.length === 0 
      ? <span className={styles.noSiteMessage}>No site available...</span>
      : streamingLinks.map((streaming, index) => (
        <Link
         key={index} 
         href={streaming.attributes.url} 
         target="_blank" 
         className={styles.linkBox}
        >
          <Image src={getIcon(streaming.attributes.url)} alt="logo"/>
        </Link>
      ))}
      
    </div>
  )
}
