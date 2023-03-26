import { GetServerSideProps } from "next"
import { useRouter } from "next/router"
import { useEffect } from "react"

interface AnimePageProps {
  animeId: string
}

export default function AnimePage({ animeId }: AnimePageProps) {
  const router = useRouter()

  return(
    <div>
      <h1>{router.query.animeId}</h1>
    </div>
  )
}