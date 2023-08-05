import './Tree.styl'
import React, { useEffect, useRef, useState } from 'react'
import { useUpdate } from 'ahooks'
import Icon from '@/components/common/Icon'
import type { sidebarTreeItemType } from '@/global/types'
import { createCol, deleteCol, deleteDB } from '@/components/modals/index'
import VirtuoScroll from '@/components/common/VirtuoScroll'
function getTreeItem<ExpandItems extends any[]>({
  dbName,
  item,
  selectPath,
  expandedItems,
  onExpand,
  onSelect,
  onDeleteDb,
  onCreateCol,
  onDeleteCol
}: {
  dbName: string
  item: sidebarTreeItemType
  selectPath: [string, string | null]
  expandedItems: ExpandItems
  onExpand: (arr: ExpandItems) => void
  forceUpdate: () => void
  onSelect: (arr: [string, string | null]) => void
  onDeleteDb: (dbName: string) => void
  onCreateCol: (colName: string) => void
  onDeleteCol: (dbName: string, colName: string) => void
}): any[] {
  const [activeDb, activeCol] = selectPath
  const cols = item.cols
  const isExpand = expandedItems.includes(item)
  function switchExpand() {
    const arr = [...expandedItems]
    const index = arr.indexOf(item)
    if (index >= 0) {
      arr.splice(index, 1)
    } else {
      arr.push(item)
    }
    onExpand(arr)
  }
  function isDbSelected(dbName: string) {
    return (!isExpand && activeDb === dbName) || (activeDb === dbName && !activeCol)
  }
  function isColSelected(dbName: string, colName: string) {
    return activeDb === dbName && activeCol === colName
  }
  const arr = []
  const title = (
    <div
      className={'title ' + (isDbSelected(dbName) ? 'selected' : '')}
      key={dbName}
      onClick={() => {
        onSelect([dbName, null])
      }}
    >
      <div
        className={'triangle ' + (!isExpand ? '' : 'tri-down')}
        onClick={(e) => {
          e.stopPropagation()
          switchExpand()
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
  )
  arr.push(title)
  if (isExpand) {
    arr.push(
      ...cols.map((item) => {
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
      })
    )
  }
  return arr
}

export default function Tree({
  treeData,
  expandedItems,
  onExpand,
  selectPath,
  onSelect
}: {
  treeData: sidebarTreeItemType[]
  expandedItems: object[]
  onExpand: () => any
  selectPath: [string, string | null]
  onSelect: (arr: [string, string | null]) => void
}) {
  function handleSelect(arr: [string, string | null]) {
    onSelect(arr)
  }
  const forceUpdate = useUpdate()

  const arr = []
  for (const item of treeData) {
    arr.push(
      ...getTreeItem({
        dbName: item.dbName,
        item,
        selectPath,
        expandedItems,
        onExpand,
        onSelect: handleSelect,
        onDeleteDb: deleteDB,
        onCreateCol: createCol,
        onDeleteCol: deleteCol,
        forceUpdate
      })
    )
  }
  const [containerHeight, setContainerHeight] = useState(0)
  const ref = useRef<HTMLDivElement>()
  useEffect(() => {
    setContainerHeight(ref.current.clientHeight)
  }, [])
  return (
    <div className="tree" ref={ref}>
      <VirtuoScroll
        getItemHeight={() => 40}
        renderItem={(item, index) => {
          return arr[index]
        }}
        containerHeight={containerHeight}
        items={arr}
      ></VirtuoScroll>
    </div>
  )
}
