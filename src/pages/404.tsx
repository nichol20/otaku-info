import { notFoundImg } from "@/assets";
import Image from "next/image";

import styles from '@/styles/404.module.scss'
import { Header } from "@/components";

export default function NotFoundPage() {

  return (
    <div className={styles.error_page}>
      <Header />
      <div className={styles.content}>
        <Image src={notFoundImg} alt="computer" className={styles.notFoundImg}/>
        <h1 className={styles.title}>404</h1>
        <p className={styles.description}>Page not found</p>
      </div>
    </div>
  )
}