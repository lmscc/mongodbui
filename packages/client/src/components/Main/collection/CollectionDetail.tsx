import { Button, Segmented } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import { findDocumnet } from '@/request/index'
import ColListItem from './colListItem/Item'
import CollectionEmpty from './CollectionEmpty'
import { type dbMap } from '@/global/types'
import { Loading } from '@/components/common/Loading'
import ImportPopover from './handleio/ImportPopover'
import { select, dispatch, selectByFn, type pageConfig } from '@/reducers/index'
import './CollectionDetail.styl'
import Search from './search/Search'
import { useNav } from '@/router/navigate'
const ONE_PAGE = 10
const defaultConfig = {
  skip: 0,
  limit: Infinity,
  sort: null,
  condition: {}
}
function CollectionDetail({
  DbName,
  colName,
  id
}: // activeColPageId
{
  DbName: string
  colName: string
  id: number
  // activeColPageId: number
}) {
  const { dbAndCol } = select('dbAndCol')
  const curPage: pageConfig = selectByFn((state) => {
    return state.colPageList.find((item) => item.id === id)
  })
  const [refreshDoc, setRefreshDoc] = useState(1)

  let docList = curPage && curPage.docList

  const col: collection =
    selectByFn((state) => {
      return (
        state.dbAndCol != null &&
        DbName != null &&
        state.dbAndCol[DbName].collections.find((item) => item.name === colName)
      )
    }) || {}

  const [max, setMax] = useState(col.count)
  const [searchConfig, setSearchConfig] = useState(defaultConfig)
  const { goDb } = useNav()

  const [page, setPage] = useState(0)

  const [loading, setLoading] = useState(false)
  if (!docList) {
    docList = []
  }
  function jumpPage(page) {
    setLoading(true)
    findDocumnet(
      DbName,
      colName,
      searchConfig.skip + ONE_PAGE * page,
      Math.min(searchConfig.limit - ONE_PAGE * page, ONE_PAGE),
      searchConfig.condition,
      searchConfig.sort
    ).then(({ arr, count }) => {
      setLoading(false)
      setMax(Math.min(searchConfig.limit, count - searchConfig.skip))
      curPage && (curPage.docList = arr)
      dispatch('', {})
    })
    setPage(page)
  }
  function handleSearch(condition, sort, skip, limit) {
    setPage(0)
    setLoading(true)
    findDocumnet(DbName, colName, skip, Math.min(ONE_PAGE, limit), condition, sort).then(({ arr, count }) => {
      setSearchConfig({
        condition,
        sort,
        skip,
        limit
      })
      setLoading(false)
      setMax(Math.min(limit, count - skip))
      curPage && (curPage.docList = arr)
      dispatch('', {})
    })
  }

  useEffect(() => {
    setSearchConfig(defaultConfig)
    setPage(0)
    if (col.count > 0) {
      setLoading(true)
      jumpPage(0)
    } else {
      setRefreshDoc((pre) => (pre ^= 1))
      curPage && (curPage.docList = [])
      dispatch('', {})
    }
  }, [DbName, colName])

  function getPrevPage() {
    const newPage = page - 1
    jumpPage(newPage)
  }
  function getNextPage() {
    const newPage = page + 1
    jumpPage(newPage)
  }
  function handleChange() {}
  const handleDelete = useCallback(
    (id: string) => {
      if (dbAndCol == null) return

      const newDbAndCol: dbMap = JSON.parse(JSON.stringify(dbAndCol))

      newDbAndCol[DbName].collections[dbAndCol[DbName].collections.findIndex((item) => item.name === colName)].count =
        col.count - 1
      curPage.docList = curPage.docList.filter((item) => item._id !== id)
      setMax((pre) => pre - 1)

      dispatch('', {
        dbAndCol: newDbAndCol
      })
    },
    [dbAndCol, DbName, curPage]
  )
  // function handleDelete(id: string)

  return (
    <div className="colection">
      <div className="title">
        <h3 className="dbName" onClick={() => goDb(DbName)}>
          {DbName}
        </h3>
        .<span className="colName">{colName}</span>
        <div className="hold"></div>
        <div className="msg">
          <div className="flexbox">
            <div className="value">{col.count}</div>
            <div className="key">Documents</div>
          </div>
          <div className="flexbox">
            <div className="value">{col.count}</div>
            <div className="key">Indexes</div>
          </div>
        </div>
      </div>
      <Search onSearch={handleSearch} dbCol={`${DbName}.${colName}`} />
      <div className="operation">
        <ImportPopover></ImportPopover>
        <Button>EXPORT COLLECTION</Button>
        <div className="hold"></div>
        <div>{`${col.count === 0 ? 0 : page * ONE_PAGE + 1} - ${Math.min((page + 1) * ONE_PAGE, max)} of ${max}`}</div>
        <Button size="small" disabled={page === 0} onClick={getPrevPage}>
          {'<'}
        </Button>
        <Button size="small" disabled={(page + 1) * ONE_PAGE >= max} onClick={getNextPage}>
          {'>'}
        </Button>
        <Segmented
          options={[
            {
              label: (
                <div>
                  <i className="iconfont icon-danlieliebiao"></i>
                </div>
              ),
              value: 'list'
            },
            {
              label: (
                <div>
                  <i className="iconfont icon-shuanglieliebiao"></i>
                </div>
              ),
              value: 'table'
            }
          ]}
          onChange={handleChange}
        ></Segmented>
      </div>
      <div className="col_main">
        {loading ? (
          <Loading></Loading>
        ) : docList.length === 0 ? (
          <CollectionEmpty></CollectionEmpty>
        ) : (
          <div className="colList">
            {docList.map((item, index) => (
              <ColListItem
                dbName={DbName}
                colName={colName}
                key={item._id}
                obj={item}
                onDelete={(id) => {
                  handleDelete(id)
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
export default React.memo(CollectionDetail, (pre, next) => {
  console.log('----', pre, next, '---')
  if (JSON.stringify(pre) === JSON.stringify(next)) {
    return true
  }
})
