import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

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
    ;(document.querySelector(`.${styles.container}`) as HTMLDivElement).style.opacity = '0'

    setTimeout(() => {
      setShowPlayer(false)
    }, 500)
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

  useEffect(() => {
    if(showPlayer) {
      const container = document.querySelector(`.${styles.container}`) as HTMLDivElement
      container.style.opacity = '1'
    }
  }, [ showPlayer])

  if(!showPlayer || !videoId) return null

  return (
    <div className={styles.container} onClick={handleClick}>
      <iframe
       src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1`}
       allowFullScreen
       allow="autoplay"
      />
    </div>
  )
})
