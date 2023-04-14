import React from 'react'

import styles from './style.module.scss'

interface InfoItemProps {
  name: string
  value: string | number | undefined | null
}

export const InfoItem = ({ name, value }: InfoItemProps) => {
  if(!value) return null

  return (
    <div className={styles.item}>
      <span className={styles.name}>{name}: </span>
      <span className={styles.value}>{value}</span>
    </div>
  )
}
