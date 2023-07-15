import styles from './index.module.scss'
import FillButton from '@/components/buttons/fillButton'
import { ChangeEvent } from 'react'

type PaginationType = {
  pagination: number,
  changePagination: (event: ChangeEvent<HTMLSelectElement>) => void,
  page: number,
  changePage: (page: number) => void,
  allSongs: number
}

const Pagination = ({ pagination, changePagination, page, changePage, allSongs }: PaginationType) => {

  const selectPagination = [15, 30, 45]

  const nextPage = () => {
    changePage(page + 1)
  }

  const prevPage = () => {
    changePage(page - 1)
  }

  const endPageCount = (page - 1) * pagination + pagination

  return (
    <div className={styles.paginationContainer}>
      <p>Количество элементов: </p>
      <select value={pagination} onChange={changePagination}>
        {
          selectPagination.map(pag => {
            return <option key={pag} value={pag}>{pag}</option>
          })
        }
      </select>

      <p className={styles.paginationCountSongs}>
        {((page - 1) * pagination + 1) + '-' + (endPageCount > allSongs ? allSongs : endPageCount) + ' из ' + allSongs}
      </p>
      {
        page > 1 ? <FillButton onClick={prevPage} text={'< Предыдущая'} />  : null
      }
      <p>Страница {page} из {Math.ceil(allSongs/pagination)}</p>
      {
        page !== Math.ceil(allSongs/pagination) ? <FillButton onClick={nextPage} text={'Следующая >'} /> : null
      }

    </div>
  )
}

export default Pagination
