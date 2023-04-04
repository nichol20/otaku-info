import React from 'react'

import styles from './style.module.scss'

interface CardProps {
  className?: string
  children: React.ReactNode
  onClick?: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
}

export const Card = ({ className, children, onClick }: CardProps) => {
  className = className ? className : ''

  return (
    <div className={`${styles.fixedBox} ${className}`} onClick={onClick}>
      <div className={styles.card}>
        <div className={styles.relativeBox}>
          {children}
        </div>
      </div>
    </div>
  )
}