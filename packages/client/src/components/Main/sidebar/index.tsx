import { Input } from 'antd'
import logoUrl from '@/assets/logo.png'
import { dispatch, select } from '@/reducers'
import { useNav } from '@/router/navigate'
import classNames from 'classnames'
import { useEffect, useState } from 'react'
import Tree from './Tree'
import { createDB } from '@/components/modals/index'
import { logout } from '@/request/index'
import type { sidebarTreeItemType } from '@/global/types'
import styles from './index.module.styl'

export function HeadContent() {
  const { goLogin } = useNav()
  const { uriConfig } = select('uriConfig')
  function logOut() {
    // localStorage.removeItem('jwt')
    logout()
      .then((res) => {
        dispatch('init', {
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
  const { dbAndCol, activeDb, activeCol } = select('dbAndCol', 'activeDb', 'activeCol')
  const { goDb, goCol, goDatabases } = useNav()

  function goToDataBases() {
    goDatabases()
  }
  const [treeData, settreeData] = useState<sidebarTreeItemType[]>([])
  useEffect(() => {
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
  function handleSelect(arr: [string, string | null]) {
    if (arr[1]) {
      // 更新表名
      goCol(arr[0], arr[1])
    } else {
      goDb(arr[0])
    }
  }
  return (
    <div style={{ padding: '10px' }}>
      <div className={classNames(styles.dbs, activeDb == null && activeCol == null ? styles.selected : '')}>
        <i className={classNames('iconfont', 'icon-shujuku', styles.normalIcon)}></i>
        <div className={styles.name} onClick={goToDataBases}>
          databases
        </div>
        <i className={classNames('icon-jia', 'iconfont')} onClick={createDB}></i>
      </div>
      <Input placeholder="Search" />
      <Tree treeData={treeData} onSelect={handleSelect} />
    </div>
  )
}
