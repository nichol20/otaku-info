import React, { useEffect, useState } from 'react'
import Link from 'next/link'

import styles from './style.module.scss'
import { useRouter } from 'next/router'

export const Header = () => {
  const router = useRouter()
  const [ scrollPos, setScrollPos ] = useState(0)
  const [ visible, setVisible ] = useState(true)

  const getLinkClass = (path: string): string => {
    return router.pathname === path ? styles.active : ''
  }

  const toggleMenu = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const buttonEl = event.currentTarget

    buttonEl.classList.toggle(styles.active)
  }

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.scrollY
      setVisible(scrollPos > currentScrollPos || currentScrollPos < 10)
      setScrollPos(currentScrollPos)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [scrollPos])

  return (
    <div className={`${styles.header} ${visible ? '' : styles.hidden}`}>
      <div className={styles.content}>
        <button className={styles.toggleMenu} onClick={toggleMenu}></button>
        <Link href='/' className={styles.logo}>Otaku Info</Link>
        <div className={styles.linkList}>
          <Link href="/animes" className={getLinkClass('/animes')}>Animes</Link>
          <Link href="/mangas" className={getLinkClass('/mangas')}>Mangas</Link>
        </div>
      </div>
    </div>
  )
}
