import { Input } from 'antd'
import classNames from 'classnames'
import { useState } from 'react'
import logoUrl from '@/assets/logo.png'
import Tree from './Tree'
import styles from './index.module.styl'
import { dispatch, select } from '@/reducers'
import { useNav } from '@/router/navigate'
import { createDB } from '@/components/modals/index'
import { logout } from '@/request/index'
import { useSyncEffect } from '@/hooks'
import type { sidebarTreeItemType } from '@/global/types'
import { ensureDbAndCol } from '@/request/ensure'
export function HeadContent() {
  const { goLogin } = useNav()
  const { uriConfig } = select('main')('uriConfig')
  function logOut() {
    // localStorage.removeItem('jwt')
    logout()
      .then((res) => {
        ensureDbAndCol.removePromise()
        dispatch('main')('init', {
          isLogin: false
        })
        goLogin()
      })
      .catch((err) => {
        console.log(err)
      })
  }
  return (
    <>
      {' '}
      <img src={logoUrl} alt="logo" className={styles.logo} />
      <div className={styles.host}>
        {uriConfig.hostName}:{uriConfig.port}
      </div>
      <i className={classNames(styles.iTag, 'iconfont icon-dengchu')} onClick={logOut}></i>
    </>
  )
}
export function BodyContent() {
  const { dbAndCol, activeDb, activeCol } = select('main')('dbAndCol', 'activeDb', 'activeCol')
  const { goDb, goCol, goDatabases } = useNav()

  function goToDataBases() {
    goDatabases()
  }
  const [treeData, settreeData] = useState<sidebarTreeItemType[]>([])
  const [expandedItems, setExpandedItems] = useState([])
  useSyncEffect(() => {
    if (dbAndCol != null) {
      // console.log("handle dbAndCol", treeData);

      const tree: sidebarTreeItemType[] = []

      const dbs = Object.keys(dbAndCol)
      for (const db of dbs) {
        tree.push({
          dbName: db,
          key: [db],
          cols: dbAndCol[db].collections.map((item) => ({
            colName: item.name,
            key: [db, item.name]
          }))
        })
      }
      settreeData(tree)
    }
  }, [dbAndCol])
  useSyncEffect(() => {
    if (!activeCol) return
    let activeItem
    for (const item of treeData) {
      if (item.dbName === activeDb) {
        activeItem = item
        break
      }
    }
    if (!expandedItems.includes(activeItem)) {
      setExpandedItems([...expandedItems, activeItem])
    }
  }, [activeDb, activeCol])

  function handleSelect(arr: [string, string | null]) {
    if (arr[1]) {
      // 更新表名
      goCol(arr[0], arr[1])
    } else {
      goDb(arr[0])
    }
  }
  /*
  点击，调用onSelect，设置active
  []
  */
  const selectPath = [activeDb, activeCol] as const
  // tree treeData,active,onSelect
  return (
    <div style={{ padding: '10px', flex: '1', width: '100%', display: 'flex', flexDirection: 'column' }}>
      <div className={classNames(styles.dbs, activeDb == null && activeCol == null ? styles.selected : '')}>
        <i className={classNames('iconfont', 'icon-shujuku', styles.normalIcon)}></i>
        <div className={styles.name} onClick={goToDataBases}>
          databases
        </div>
        <i className={classNames('icon-jia', 'iconfont')} onClick={createDB}></i>
      </div>
      <Input placeholder="Search" />
      <Tree treeData={treeData} expandedItems={expandedItems} onExpand={setExpandedItems} selectPath={selectPath} onSelect={handleSelect} />
    </div>
  )
}
