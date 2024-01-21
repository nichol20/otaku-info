import { debounce } from "@/utils/debounce";
import React from "react";

import styles from './style.module.scss'
import Image from "next/image";
import { searchIcon } from "@/assets";

interface SearchInputProps {
  onSearch: (value: string) => void
  defaultValue: string
  delay: number
}

export const SearchInput = ({ onSearch, defaultValue = "", delay = 0 }: SearchInputProps) => {

  const handleSearch = debounce((value: string) => {
    onSearch(value)
  }, delay)

  return (
    <div className={styles.container}>
      <Image src={searchIcon} alt="search" className={styles.searchIcon} />
      <input
        type="text"
        onChange={e => handleSearch(e.target.value)}
        defaultValue={defaultValue}
        placeholder="Search..."
        className={styles.searchInput}
      />
    </div>
  )
}
