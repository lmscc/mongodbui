import { useState } from 'react'
import ListItem from './components/ListItem'
import ControlHeader from './components/ControlHeader'

import { itemModeType } from '@/global/enums'
import { deleteCol, createCol } from '@/components/modals/index'

import type { collection } from '@/global/types'
import { select } from '@/reducers'
import { useNavigate } from 'react-router-dom'
import styles from './DbDetail.module.styl'
import { useNav } from '@/router/navigate'
function transForm(obj: collection) {
  const arr: Array<[string, string | number]> = [
    ['Storage size', obj.storageSize],
    ['Documents', obj.count],
    ['avg doc size', obj.avgObjSize],
    ['Total index size', obj.totalIndexSize]
  ]
  return arr
}

enum sortModeType {
  char,
  count,
  avgObjSizeOrigin,
  storageSizeOrigin,
  totalIndexSize
}

export default function DbDetail() {
  const { activeDb, dbAndCol } = select('main')('activeDb', 'dbAndCol')

  const [isReverse, setisReverse] = useState(false)
  const [ItemMode, setItemMode] = useState(itemModeType.list)

  const [sortMode, setsortMode] = useState(sortModeType.char)
  function handleSortModeChange(mode: sortModeType) {
    setsortMode(mode)
  }
  const colList = dbAndCol != null && activeDb ? Array.from(dbAndCol[activeDb].collections) : []
  colList.sort((a, b) => {
    if (sortMode === sortModeType.char) {
      return a.name.charCodeAt(0) - b.name.charCodeAt(0)
    } else if (sortMode === sortModeType.count) {
      return a.count - b.count
    } else if (sortMode === sortModeType.avgObjSizeOrigin) {
      return a.avgObjSizeOrigin - b.avgObjSizeOrigin
    } else if (sortMode === sortModeType.storageSizeOrigin) {
      return a.storageSizeOrigin - b.storageSizeOrigin
    } else if (sortMode === sortModeType.totalIndexSize) {
      return a.totalIndexSize - b.totalIndexSize
    } else {
      return 1
    }
  })
  const sortChoices = ['Collection Name', 'Documents', 'Avg.document size', 'Storage size', 'Total index size']
  if (isReverse) {
    colList.reverse()
  }

  const navigate = useNavigate()
  const { goCol } = useNav()

  return (
    <div className={styles.dbDetail}>
      collections
      <ControlHeader<sortModeType>
        sortMode={sortMode}
        isReverse={isReverse}
        sortChoices={sortChoices}
        btnStr="Create collection"
        onClick={() => {
          createCol(activeDb)
        }}
        onItemModeChange={(mode) => {
          console.log(mode)
          setItemMode(mode)
        }}
        onSortModeChange={handleSortModeChange}
        onReverseChange={() => {
          setisReverse((isReverse) => !isReverse)
        }}
      />
      <div className={styles.databasesContent}>
        {colList.map((item) => (
          <ListItem
            name={item.name}
            list={transForm(item)}
            mode={ItemMode === itemModeType.list ? 'list' : 'card'}
            key={item.name}
            onClick={() => goCol(activeDb, item.name)}
            onDelete={() => {
              deleteCol(activeDb, item.name)
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
