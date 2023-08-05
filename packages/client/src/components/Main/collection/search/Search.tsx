import { Input, Button, InputNumber, Popover, Divider } from 'antd'
import classNames from 'classnames'
import React, { useState } from 'react'
import { type InputStatus } from 'antd/es/_util/statusUtils'
import styles from './Search.module.styl'
import ConditionSearch from './ConditionSearch'
import { useSyncEffect } from '@/hooks'
import store from '@/global'
import { select } from '@/reducers'
// 因为detail组件太重，我把search组件提出来
// 把数据抛上去，缺点是，父组件不能修改子组件的数据
const tips = [
  ['正则', '{ key : { $regex : "" } }'],
  ['数字比较gt(>), gte(≥), lt(<), lte(≤)', '{ key : { $gt : 20 } }'],
  ['查找至少有一个元素匹配的数组', '{ scores: { $elemMatch: { $gt: 80, $lt: 90 } } }']
]
const regExp = /[$\w]+(?= *:)/g
export default function Search({ onSearch, dbCol }: { onSearch: (condition, sort, skip, limit) => void; dbCol: string }) {
  const [skip, setSkip] = useState(undefined)
  const [limit, setLimit] = useState(undefined)
  const [sort, setSort] = useState('')
  const [sortError, setSortError] = useState(null)
  const [search, setSearch] = useState('')
  const [searchError, setSearchError] = useState<InputStatus>('')
  const { activeDb, activeCol } = select('main')('activeDb', 'activeCol')
  useSyncEffect(() => {
    setSkip(undefined)
    setLimit(undefined)
    setSearch('')
    setSort('')
  }, [dbCol])
  function handleFind() {
    let sortObj, searchObj
    try {
      const sort1 = sort.replaceAll(regExp, (str) => `"${String(str)}"`)
      console.log(sort1)
      sortObj = JSON.parse(sort1 || '{}')
      setSortError(false)
    } catch (err) {
      store.messageApi.open({
        type: 'error',
        content: err.message
      })
      setSortError('error')
      return
    }
    try {
      const search1 = search.replaceAll(regExp, (str) => `"${String(str)}"`)
      console.log(search1)
      searchObj = JSON.parse(search1 || '{}')
      setSearchError('')
    } catch (err) {
      store.messageApi.open({
        type: 'error',
        content: err.message
      })
      setSearchError('error')
      return
    }
    onSearch(searchObj, sortObj, skip || 0, limit || Infinity)
  }
  function handleReset() {
    setSearch('')
    setSkip(undefined)
    setLimit(undefined)
    setSort('')
    onSearch({}, {}, 0, Infinity)
  }
  return (
    <div className={styles.search}>
      <div className={classNames('flex', styles.condition)}>
        <Popover
          placement="bottom"
          content={
            <>
              {tips.map(([name, expression]) => (
                <div style={{ cursor: 'pointer' }} key={name} onClick={() => setSearch(expression)}>
                  <div>{name}</div>
                  <div>{expression}</div>
                  <Divider />
                </div>
              ))}
              <a href="https://www.mongodb.com/docs/compass/current/query/filter/" target="_blank" rel="noreferrer">
                查看更多
              </a>
            </>
          }
        >
          <Button>示例</Button>
        </Popover>
        <ConditionSearch value={search} onChange={setSearch} error={searchError} />
        {/* <Input placeholder={"Type a query: {field:'value'}"} /> */}
        <Button onClick={handleReset}>Reset</Button>
        <Button type="primary" onClick={handleFind}>
          Find
        </Button>
        <Button>{'</>'}</Button>
      </div>
      <div className={classNames('flex', styles.moreCondition)}>
        <div className={classNames('flex', styles.sort, styles.input)}>
          <div className={styles.tag}>Sort</div>
          <Input
            className={styles.input}
            placeholder="{field:1 || -1} or [[field1,1],[field2,-1]...]"
            status={sortError}
            value={sort}
            onInput={(e) => setSort(e.target.value)}
          ></Input>
        </div>
        <div className="flex">
          <div className={styles.tag}>Skip</div>
          <InputNumber value={skip} min={0} onChange={(value) => setSkip(value)}></InputNumber>
        </div>
        <div className="flex">
          <div className={styles.tag}>Limit</div>
          <InputNumber value={limit} min={0} onChange={(value) => setLimit(value)}></InputNumber>
        </div>
      </div>
    </div>
  )
}
