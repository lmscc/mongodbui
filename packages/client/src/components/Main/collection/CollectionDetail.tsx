import { Button, Segmented } from 'antd'
import React, { useCallback, useState } from 'react'
import { CanceledError } from 'axios'
import ColListItem from './colListItem/Item'
import CollectionEmpty from './CollectionEmpty'
import ImportPopover from './handleio/ImportPopover'
import Search from './search/Search'
import { findDocumnet } from '@/request/index'
import { type dbMap } from '@/global/types'
import { Loading } from '@/components/common/Loading'
import { select, dispatch, selectByFn } from '@/reducers/index'
import './CollectionDetail.styl'
import { useNav } from '@/router/navigate'
import { LazyComponet } from '@/components/common/LazyLoad'
import { type pageConfig } from '@/reducers/mainReducer'
import { useSyncEffect } from '@/hooks'

const ONE_PAGE = 20
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
  const { dbAndCol } = select('main')('dbAndCol')
  const curPage: pageConfig = selectByFn('main')((state) => {
    return state.colPageList.find((item) => item.id === id)
  })
  const [refreshDoc, setRefreshDoc] = useState(1)

  let docList = curPage && curPage.docList
  console.log('docList', docList)

  const col: collection =
    selectByFn('main')((state) => {
      return state.dbAndCol != null && DbName != null && state.dbAndCol[DbName].collections.find((item) => item.name === colName)
    }) || {}
  /*
  最大是多少条：
    1、不能超过limit
      比如limit为20，但查到了30条，就要限制max为20条 limit
    2、查到20条，但是跳过15条，只剩下5条  count - skip
    取小 Math.min(limit,count - skip)
  */
  const [searchConfig, setSearchConfig] = useState(defaultConfig)
  const [max, setMax] = useState(col.count)
  useSyncEffect(() => {
    // 当col改变，有可能count改变
    setMax(Math.min(searchConfig.limit, col.count - searchConfig.skip))
  }, [col])
  const { goDb } = useNav()

  const [page, setPage] = useState(0)

  const [loading, setLoading] = useState(false)
  if (!docList) {
    docList = []
  }
  function callWithErrorHandler(promise) {
    setLoading(true)
    promise
      .catch((err) => {
        if (!(err instanceof CanceledError)) {
          setMax(0)
          curPage && (curPage.docList = [])
        }
      })
      .finally(() => {
        setLoading(false)
      })
  }
  function jumpPage(page) {
    callWithErrorHandler(
      findDocumnet(
        DbName,
        colName,
        searchConfig.skip + ONE_PAGE * page,
        Math.min(searchConfig.limit - ONE_PAGE * page, ONE_PAGE),
        searchConfig.condition,
        searchConfig.sort
      ).then(({ arr, count }) => {
        // 不能超过最大限制条数，以及skip之后的条数
        setMax(Math.min(searchConfig.limit, count - searchConfig.skip))
        curPage && (curPage.docList = arr)
        dispatch('main')('', {})
      })
    )
    setPage(page)
  }
  function handleSearch(condition, sort, skip, limit) {
    setPage(0)
    callWithErrorHandler(
      findDocumnet(DbName, colName, skip, Math.min(ONE_PAGE, limit), condition, sort).then(({ arr, count }) => {
        setSearchConfig({
          condition,
          sort,
          skip,
          limit
        })
        setMax(Math.min(limit, count - skip))
        curPage && (curPage.docList = arr)
        const col = dbAndCol[DbName].collections.find((item) => item.name === colName)
        col.count = count
        // 更新这个col
        dbAndCol[DbName].collections[dbAndCol[DbName].collections.findIndex((item) => item.name === colName)] = JSON.parse(
          JSON.stringify(col)
        )
        dispatch('main')('', {})
      })
    )
  }

  useSyncEffect(() => {
    setSearchConfig(defaultConfig)
    setPage(0)
    if (col.count > 0) {
      jumpPage(0)
    } else {
      setMax(0)
      curPage && (curPage.docList = [])
      dispatch('main')('', {})
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

      newDbAndCol[DbName].collections[dbAndCol[DbName].collections.findIndex((item) => item.name === colName)].count = col.count - 1
      curPage.docList = curPage.docList.filter((item) => item._id !== id)
      setMax((pre) => pre - 1)

      dispatch('main')('', {
        dbAndCol: newDbAndCol
      })
    },
    [dbAndCol, DbName, curPage]
  )
  // 按需渲染
  const [renderedCount, setRenderedCount] = useState(10)
  const renderedList = docList.slice(0, renderedCount)
  function renderMore(...props) {
    setRenderedCount((pre) => {
      if (pre + 2 > docList.length) {
        return docList.length
      } else {
        return pre + 2
      }
    })
  }
  useSyncEffect(() => {
    setRenderedCount(1)
  }, [page])

  function mapDoc(...props) {
    return renderedList.slice(...props).map((item, index) => {
      return <ColListItem dbName={DbName} colName={colName} key={item._id} obj={item} onDelete={handleDelete} />
    })
  }
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
            <div className="value">{1}</div>
            <div className="key">Indexes</div>
          </div>
        </div>
      </div>
      <Search onSearch={handleSearch} dbCol={`${DbName}.${colName}`} />
      <div className="operation">
        <ImportPopover></ImportPopover>
        <Button>EXPORT COLLECTION</Button>
        <div className="hold"></div>
        <div>{`${max === 0 ? 0 : page * ONE_PAGE + 1} - ${Math.min((page + 1) * ONE_PAGE, max)} of ${max}`}</div>
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
          <div className="colList">{[...mapDoc(0, -1), <LazyComponet key={'lazyComponent'} callBack={renderMore} />, ...mapDoc(-1)]}</div>
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
