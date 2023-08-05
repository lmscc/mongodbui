import classNames from 'classnames'
import CollectionDetail from './CollectionDetail'
import styles from './CollectionPage.module.styl'
import { dispatch, select } from '@/reducers/index'
import Icon from '@/components/common/Icon'
export default function CollectionPage() {
  const { colPageList, activeColPageId, activeDb, activeCol } = select('main')('colPageList', 'activeColPageId', 'activeDb', 'activeCol')
  const activePage = colPageList.find((item) => item.id === activeColPageId)
  if (!colPageList.length) {
    const id = Math.random()
    dispatch('main')('changeList', {
      colPageList: [
        {
          id,
          dbName: activeDb,
          colName: activeCol,
          activeSub: 'Documents'
        }
      ],
      activeDb,
      activeCol,
      activeColPageId: id
    })
  }

  function switchPage(id) {
    console.log('switchPage', id)
    const page = colPageList.find((item) => item.id === id)
    dispatch('main')('', {
      activeColPageId: id,
      activeDb: page?.dbName,
      activeCol: page?.colName
    })
  }
  function addPage() {
    const id = Math.random()
    dispatch('main')('changeList', {
      colPageList: [
        ...colPageList,
        {
          id,
          dbName: activeDb,
          colName: activeCol,
          activeSub: 'Documents',
          docList: Array.from(activePage?.docList)
        }
      ],
      activeDb,
      activeCol,
      activeColPageId: id
    })
  }
  function removePage(id: number) {
    if (activeColPageId === id) {
      if (colPageList.length !== 1) {
        const index = colPageList.findIndex((item) => item.id === id)
        let newId
        if (index === 0) {
          newId = 1
        } else {
          newId = index - 1
        }
        dispatch('main')('changeList', {
          colPageList: colPageList.filter((item) => item.id !== id),
          activeColPageId: colPageList[newId].id,
          activeDb: colPageList[newId].dbName,
          activeCol: colPageList[newId].colName
        })
      }
    } else {
      dispatch('main')('changeList', {
        colPageList: colPageList.filter((item) => item.id !== id)
      })
    }
  }
  return (
    <div className={styles.collectionPage}>
      <div className={styles.tabs}>
        {colPageList.map((colPage) => (
          <div
            className={classNames({
              [styles.tabItem]: true,
              [styles.activeTab]: colPage.id === activeColPageId
            })}
            onClick={() => switchPage(colPage.id)}
            key={colPage.id}
          >
            <div className={styles.main}>
              <div className={styles.activeSub}>{colPage.activeSub}</div>
              <div className={styles.desciption}>{colPage.dbName + '.' + colPage.colName}</div>
            </div>
            <div className="delete_btn">
              <Icon iconName="icon-cuowu" className={styles.roundIcon} onClick={() => removePage(colPage.id)}></Icon>
            </div>
          </div>
        ))}
        <div>
          <Icon iconName="icon-jia" show onClick={addPage}></Icon>
        </div>
      </div>
      {colPageList.map(({ dbName, colName, id }) => (
        <div className={styles.detail} key={id} style={{ display: id === activeColPageId ? '' : 'none' }}>
          <CollectionDetail DbName={dbName} colName={colName} id={id}></CollectionDetail>
        </div>
      ))}
    </div>
  )
}
