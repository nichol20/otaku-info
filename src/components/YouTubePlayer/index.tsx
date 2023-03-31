import { BASE_URL } from '@/data/app'
import { __ApiPreviewProps } from 'next/dist/server/api-utils'
import React, { forwardRef, useImperativeHandle, useState } from 'react'

import styles from './style.module.scss'

interface YouTubePlayerProps {
  videoId: string | null
}

export interface YouTubePlayerRef {
  show: () => void
  close: () => void
}

export const YouTubePlayer = forwardRef<YouTubePlayerRef,YouTubePlayerProps>(
  ({ videoId }, ref) => {

  const [ showPlayer, setShowPlayer ] = useState(false)

  const show = () => {
    setShowPlayer(true)
  }

  const close = () => {
    setShowPlayer(false)
  }

  const handleClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if(event.target === event.currentTarget) {
      close()
    }
  } 

  useImperativeHandle(ref, () => ({
    show,
    close
  }))

  if(!showPlayer || !videoId) return null

  return (
    <div className={styles.container} onClick={handleClick}>
      <iframe
       src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`}
       allowFullScreen
       allow="autoplay; encrypted-media"
      />
    </div>
  )
})
