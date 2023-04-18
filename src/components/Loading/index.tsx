import { animatedSpinnerIcon } from '@/assets'
import Image from 'next/image'

import styles from './style.module.scss'

interface LoadingProps {
 isLoading?: boolean
}

export const Loading = ({ isLoading=true }: LoadingProps) => {
  if(!isLoading) return null
  return (
    <div className={styles.loading}>
      <Image src={animatedSpinnerIcon} alt="spinner" className={styles.spinner} />
    </div>
  )
}
