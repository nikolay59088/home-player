'use client'

import styles from './index.module.scss'
import React, { useState } from 'react'
import SvgSearch from '@/public/images/search.svg'
import SvgClose from '@/public/images/close.svg'


type searchAndFilter = {
  changeFilter: (filter: string) => void
}
const SearchAndFilter = ({  changeFilter }: searchAndFilter) => {

  const [filter, setFilter] = useState({
    text: ''
  })

  // useEffect(() => {
  //
  //   let deBouncer = setTimeout(async() => {
  //     if (filter.text.length){
  //       const result = await yandex.api.searchTracks(filter.text)
  //       console.log('yandex answer: ')
  //       console.log({ result })
  //     }
  //
  //   }, 2000)
  //   return () => clearTimeout(deBouncer)
  //
  // }, [filter.text])

  const changeFilterText = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement
    setFilter({
      ...filter,
      text: target.value
    })
  }

  const clearFilterText = () => {
    setFilter({
      ...filter,
      text: ''
    })
    changeFilter('')
  }

  const searchFilterText = () => {
    changeFilter(filter.text)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.key === 'Enter'){
      searchFilterText()
    }
  }

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    searchFilterText()
  }


  return (
    <section className={styles.searchFilterContainer}>
      <form className={styles.searchFilter} onSubmit={onSubmit}>
        <input type='text' value={filter.text} onChange={changeFilterText} onKeyUp={handleKeyPress}/>
        {
          filter.text.length
            ?
            <SvgClose title='Очистить поиск' onClick={clearFilterText} />
            :
            <SvgSearch title='Поиск' />
        }
      </form>
    </section>
  )
}

export default SearchAndFilter
