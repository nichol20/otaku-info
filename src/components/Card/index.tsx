import React from 'react'

import styles from './style.module.scss'

interface CardProps {
  className?: string
  children: React.ReactNode
}

export const Card = ({ className, children }: CardProps) => {
  className = className ? className : ''

  return (
    <div className={`${styles.fixedBox} ${className}`}>
      <div className={styles.card}>
        <div className={styles.relativeBox}>
          {children}
        </div>
      </div>
    </div>
  )
}