import { useState } from 'react'
import ListItem from './components/ListItem'
import ControlHeader from './components/ControlHeader'
import style from './DataBases.module.styl'
import { itemModeType } from '@/global/enums'

import { createDB, deleteDB } from '@/components/modals/index'
import { select } from '@/reducers'
import type { database } from '@/global/types'
import { useNav } from '@/router/navigate'

enum sortModeType {
  char,
  originSize,
  collectionsLen
}
function transForm(obj: database) {
  const arr: Array<[string, number | string]> = [
    ['Storage size', obj.sizeOnDisk],
    ['Collections', obj.collections.length]
  ]
  return arr
}

export default function DataBases() {
  const { dbAndCol } = select('main')('dbAndCol')
  const [itemMode, setitemMode] = useState(itemModeType.list)
  // const itemMap = ['list','card','hold']
  const [isReverse, setisReverse] = useState(false)

  const [sortMode, setsortMode] = useState(sortModeType.char)

  const dbList = dbAndCol != null ? Object.entries(dbAndCol) : []
  dbList.sort((a, b) => {
    if (sortMode === sortModeType.char) {
      return a[0].toLowerCase().charCodeAt(0) - b[0].toLowerCase().charCodeAt(0)
    } else if (sortMode === sortModeType.originSize) {
      return a[1].originSize - b[1].originSize
    } else if (sortMode === sortModeType.collectionsLen) {
      return a[1].collections.length - b[1].collections.length
    } else {
      return 1
    }
  })

  const sortChoices = ['Database Name', 'Storage size', 'Collections', 'Indexes']
  if (isReverse) {
    dbList.reverse()
  }

  const { goDb } = useNav()

  return (
    <div className={style.databases}>
      collections
      <ControlHeader<sortModeType>
        sortMode={sortMode}
        isReverse={isReverse}
        sortChoices={sortChoices}
        btnStr="Create database"
        onClick={createDB}
        onItemModeChange={(mode) => {
          setitemMode(mode)
        }}
        onSortModeChange={(sortMode) => {
          setsortMode(sortMode)
        }}
        onReverseChange={() => {
          setisReverse((isReverse) => !isReverse)
        }}
      />
      <div className={style.content}>
        {dbList.map((item) => (
          <ListItem
            name={item[0]}
            list={transForm(item[1])}
            mode={itemMode === itemModeType.list ? 'list' : 'card'}
            key={item[0]}
            onClick={() => goDb(item[0])}
            onDelete={() => {
              deleteDB(item[0])
            }}
          />
        ))}
        <ListItem mode={'hold'} />
        <ListItem mode={'hold'} />
        <ListItem mode={'hold'} />
      </div>
    </div>
  )
}
