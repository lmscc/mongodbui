import { Input, Button, Segmented } from 'antd'
import React, { useCallback, useEffect, useState } from 'react'
import { findDocumnet } from '@/request/index'
import ColListItem from './colListItem/Item'
import CollectionEmpty from './CollectionEmpty'
import { type dbMap } from '@/global/types'
import { Loading } from '@/components/common/Loading'
import ImportPopover from './ImportPopover'
import { select, dispatch, selectByFn, type pageConfig } from '@/reducers/index'
import './CollectionDetail.styl'
import { useNav } from '@/router/navigate'
const ONE_PAGE = 10

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
  console.log(DbName, colName, id, curPage)
  // const isActive = activeColPageId === id
  // as {
  //   dbAndCol: dbMap
  //   // docList: any[]
  // }
  let docList = curPage && curPage.docList

  const col: collection =
    selectByFn((state) => {
      return (
        state.dbAndCol != null &&
        DbName != null &&
        state.dbAndCol[DbName].collections.find((item) => item.name === colName)
      )
    }) || {}

  const { goDb } = useNav()

  const [page, setPage] = useState(0)

  const [loading, setLoading] = useState(false)
  if (!docList) {
    docList = []
  }
  useEffect(() => {
    if (col.count > 0) {
      setLoading(true)
      setPage(0)
      findDocumnet(DbName, colName, 0, ONE_PAGE, {}).then((data) => {
        setLoading(false)
        curPage && (curPage.docList = data.arr)
        dispatch('', {
          // colPageList: [...colPageList]
          // docList: data.arr
        })
      })
    } else {
      setPage(0)
      setRefreshDoc((pre) => (pre ^= 1))
      curPage && (curPage.docList = [])
      dispatch('', {
        // colPageList: [...colPageList]
      })
    }
  }, [DbName, colName])

  function handleFind() {
    // setPage
  }
  function getPrevPage() {
    const newPage = page - 1
    setLoading(true)
    findDocumnet(DbName, colName, newPage * ONE_PAGE, ONE_PAGE, {}).then((data) => {
      setLoading(false)
      curPage && (curPage.docList = data.arr)
      dispatch('', {
        // colPageList: [...colPageList]
        // docList: data.arr
      })
    })
    setPage(newPage)
  }
  function getNextPage() {
    const newPage = page + 1
    setLoading(true)
    findDocumnet(DbName, colName, newPage * ONE_PAGE, ONE_PAGE, {}).then((data) => {
      setLoading(false)
      curPage && (curPage.docList = data.arr)
      dispatch('', {
        // colPageList: [...colPageList]
        // docList: data.arr
      })
    })
    setPage(newPage)
  }
  function handleChange() {}
  const handleDelete = useCallback(
    (id: string) => {
      if (dbAndCol == null) return

      const newDbAndCol: dbMap = JSON.parse(JSON.stringify(dbAndCol))

      newDbAndCol[DbName].collections[dbAndCol[DbName].collections.findIndex((item) => item.name === colName)].count =
        col.count - 1
      curPage.docList = curPage.docList.filter((item) => item._id !== id)
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
      <div className="search">
        <Input placeholder={"Type a query: {field:'value'}"} />
        <Button>Reset</Button>
        <Button type="primary" onClick={handleFind}>
          Find
        </Button>
        <Button>{'</>'}</Button>
      </div>
      <div className="operation">
        <ImportPopover></ImportPopover>
        <Button>EXPORT COLLECTION</Button>
        <div className="hold"></div>
        <div>{`${col.count === 0 ? 0 : page * ONE_PAGE + 1} - ${Math.min((page + 1) * ONE_PAGE, col.count)} of ${
          col.count
        }`}</div>
        <Button size="small" disabled={page === 0} onClick={getPrevPage}>
          {'<'}
        </Button>
        <Button size="small" disabled={(page + 1) * ONE_PAGE > col.count} onClick={getNextPage}>
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
