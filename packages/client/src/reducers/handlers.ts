export function handleDrop(type, state, payload) {
  if (type === 'drop') {
    const { colPageList } = state
    const { dbAndCol } = payload
    const deleteMap = {}
    for (const page of colPageList) {
      let db: database
      if ((db = dbAndCol[page.dbName])) {
        if (!db.collections.find((item) => item.name === page.colName)) {
          deleteMap[page.id] = 1
        }
      } else {
        deleteMap[page.id] = 1
      }
    }
    const newColPageList = colPageList.filter((page) => !deleteMap[page.id])
    payload.colPageList = newColPageList
    if (newColPageList.length === 0) {
      payload.activeDb = null
      payload.activeCol = null
      location.hash = '#/main'
    } else {
      const newActivePage = newColPageList[newColPageList.length - 1]
      payload.activeColPageId = newActivePage.id
      payload.activeDb = newActivePage.dbName
      payload.activeCol = newActivePage.colName
    }
  }
}
export function handleChangeActive(type, state, payload) {
  if (type === 'changeActive') {
    // 当点击侧边栏使得db，col改变时，把状态同步到active的page上
    const { colPageList, activeColPageId } = state
    const { activeDb, activeCol } = payload
    const activePage = colPageList.find((item) => activeColPageId === item.id)
    if (activePage) {
      if (activeCol) {
        activePage.colName = activeCol
      }
      if (activeDb) {
        activePage.dbName = activeDb
      }
    }
    payload.colPageList = [...colPageList]
  }
}
