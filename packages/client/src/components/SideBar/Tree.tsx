import './Tree.styl'
import Icon from '@/components/common/Icon'
import React, { useEffect, useState } from 'react'
import { select } from '@/reducers'
import type { sidebarTreeItemType } from '@/global/types'
import { createCol, deleteCol, deleteDB } from '../modals'

function TreeItem({
  dbName,
  cols,
  onSelect,
  onDeleteDb,
  onCreateCol,
  onDeleteCol
}: {
  dbName: string
  cols: sidebarTreeItemType['cols']
  onSelect: (arr: [string, string | null]) => void
  onDeleteDb: (dbName: string) => void
  onCreateCol: (colName: string) => void
  onDeleteCol: (dbName: string, colName: string) => void
}) {
  const [fold, setFold] = useState(true)
  const { activeDb, activeCol } = select('main')('activeDb', 'activeCol')
  useEffect(() => {
    if (dbName === activeDb && activeCol !== null) {
      setFold(false)
    }
  }, [activeDb, activeCol])
  function isDbSelected(dbName: string) {
    return (fold && activeDb === dbName) || (activeDb === dbName && !activeCol)
    // return !selectKeyArr[1] && selectKeyArr[0] === dbName
  }
  function isColSelected(dbName: string, colName: string) {
    return activeDb === dbName && activeCol === colName
    // return selectKeyArr[0] === dbName && selectKeyArr[1] === colName
  }
  return (
    <>
      <div
        className={'title ' + (isDbSelected(dbName) ? 'selected' : '')}
        onClick={() => {
          onSelect([dbName, null])
        }}
      >
        <div
          className={'triangle ' + (fold ? '' : 'tri-down')}
          onClick={(e) => {
            e.stopPropagation()
            setFold((pre) => !pre)
          }}
        ></div>
        <i className="iconfont icon-shujuku normal-icon"></i>
        <div className="name">{dbName}</div>
        <Icon
          iconName="icon-jia"
          onClick={(e) => {
            e.stopPropagation()
            onCreateCol(dbName)
          }}
        />
        <Icon
          iconName="icon-lajitong"
          onClick={(e) => {
            e.stopPropagation()
            onDeleteDb(dbName)
          }}
        />
      </div>
      {fold ? (
        <></>
      ) : (
        <div className="content">
          {cols.map((item) => {
            return (
              <div
                className={'item ' + (isColSelected(dbName, item.colName) ? 'selected' : '')}
                key={JSON.stringify(item.key)}
                onClick={() => {
                  onSelect([dbName, item.colName])
                }}
              >
                <i className="iconfont icon-wenjianjia normal-icon"></i>
                <div className="name">{item.colName}</div>
                <Icon iconName="icon-jia" />
                <Icon
                  iconName="icon-lajitong"
                  onClick={() => {
                    onDeleteCol(dbName, item.colName)
                  }}
                />
              </div>
            )
          })}
        </div>
      )}
    </>
  )
}

export default function Tree({
  onSelect,
  treeData
}: {
  onSelect: (arr: [string, string | null]) => void
  treeData: sidebarTreeItemType[]
}) {
  // setScrollTop =    useVitualScroll(height,itemHeight,scrollTop)
  function handleSelect(arr: [string, string | null]) {
    onSelect(arr)
  }
  return (
    <>
      <div className="tree">
        {treeData.map((item) => (
          <TreeItem
            key={JSON.stringify(item.key)}
            dbName={item.dbName}
            cols={item.cols}
            onSelect={handleSelect}
            onDeleteDb={deleteDB}
            onCreateCol={createCol}
            onDeleteCol={deleteCol}
          />
        ))}
      </div>
    </>
  )
}
