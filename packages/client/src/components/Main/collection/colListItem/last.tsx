import { useRef, useState } from 'react'
import { Button, Popover } from 'antd'
import clipboard from 'clipboard'

import './ColListItem.styl'
import {
  type KeyValueArr,
  type KeyValueItem,
  arr2obj,
  obj2arr,
  initArr,
  setInit,
  addNewItems,
  deleteItems
} from '../../../common/objview/keyValue'
import { deleteDocument, findDocumentById, updateDocument } from '@/request/index'
import store from '@/global'
import Input from '@/components/common/Input'
import { select } from '@/reducers'
import { isObject } from '@/global/utils'
import type { doc } from '@/global/types'
function getTypeColor(key: string | number, value: any, isObject: boolean | undefined) {
  if (isObject) return '#747474'
  else if (key === '_id') return '#f32c00'
  else return '#2b8f60'
}
function displayValue(key: string | number, item: KeyValueArr | string, isArr: boolean) {
  if (isObject(item)) {
    if (isArr) {
      return `Array(${item.length})`
    } else {
      return `Object(${item.length})`
    }
  } else {
    if (key === '_id') {
      return `ObjectId('${item}')`
    } else {
      return item
    }
  }
}

interface grandType {
  onRefresh: () => void
  editable: boolean
}

function getPopoverContent(isObject: boolean, isArr: boolean, isArrayItem: boolean, key: string, addFn: (type: 'add' | 'after') => void) {
  const jsxArr = []
  if (!isArrayItem) {
    jsxArr.push(
      <div
        className="item"
        onClick={() => {
          addFn('after')
        }}
      >
        Add field after {key}
      </div>
    )
  } else {
    jsxArr.push(
      <div
        className="item"
        onClick={() => {
          addFn('after')
        }}
      >
        Add item after {key}
      </div>
    )
  }
  if (isObject) {
    if (isArr) {
      jsxArr.unshift(
        <div
          className="item"
          onClick={() => {
            addFn('add')
          }}
        >
          Add item to {key}
        </div>
      )
    } else {
      jsxArr.unshift(
        <div
          className="item"
          onClick={() => {
            addFn('add')
          }}
        >
          Add field to {key}
        </div>
      )
    }
  }

  return (
    <div
      className="popover_content"
      onClick={(e) => {
        e.stopPropagation()
      }}
    >
      {jsxArr}
    </div>
  )
}

function Item({
  count,
  depth,
  itemObj,
  isExpand = false,
  isObject,
  grandCom
}: {
  value: string
  count: number
  depth: number
  itemObj: KeyValueItem
  isExpand: boolean
  isObject?: boolean
  grandCom: grandType
}) {
  const lineHeight = 20

  let { key, value, initKey, initValue, isDeleted, isArr, isArrayItem } = itemObj
  value = displayValue(key, value, isArr)
  const isModified = itemObj.isModified

  return (
    <div
      className={'key_value ' + (isDeleted ? 'key_value_deleted' : '')}
      onClick={(e) => {
        itemObj.isExpanded = !itemObj.isExpanded
        grandCom.onRefresh()
      }}
    >
      <div className="key_wrap" style={{ height: lineHeight + 4 + 'px', lineHeight: lineHeight + 'px' }}>
        <div
          className={'delete ' + (grandCom.editable && key !== '_id' ? 'show' : '')}
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          {isModified || isDeleted ? (
            <i
              className={'iconfont icon-huifu '}
              onClick={(e) => {
                itemObj.key = initKey
                itemObj.value = initValue
                itemObj.isDeleted = false
                grandCom.onRefresh()
              }}
            ></i>
          ) : (
            <i
              className={'iconfont icon-lajitong '}
              onClick={(e) => {
                itemObj.isDeleted = true
                grandCom.onRefresh()
              }}
            ></i>
          )}
        </div>
        <div className="count" style={{ width: 20 * depth + 20 + 'px' }} onClick={(e) => {}}>
          <div className={'num ' + (grandCom.editable && key !== '_id' ? 'none' : '')}>{count}</div>
          <Popover
            content={getPopoverContent(isObject, isArr, isArrayItem, key, (type) => {
              addNewItems(itemObj, type)
              grandCom.onRefresh()
            })}
            trigger="hover"
          >
            <i className={'iconfont icon-zengjia add ' + (grandCom.editable && key !== '_id' ? 'show' : '')}></i>
          </Popover>
        </div>
        {<div className={'fold_btn ' + (isExpand ? 'fold ' : ' ') + (isObject ? '' : 'hidden')}>&gt;</div>}
        <div className="key">
          <Input
            lineHeight={lineHeight}
            value={key}
            editable={!isArrayItem && key !== '_id' && grandCom.editable}
            fitWidth
            oneLine
            onInput={(value) => {
              itemObj.key = value
              grandCom.onRefresh()
            }}
          ></Input>
        </div>
        <div className="colon">:</div>
      </div>
      <div className="value">
        <Input
          lineHeight={lineHeight}
          value={value}
          editable={!isObject && key !== '_id' && grandCom.editable}
          fitHeight
          color={getTypeColor(key, value, isObject)}
          onInput={(value) => {
            itemObj.value = value
            grandCom.onRefresh()
          }}
        ></Input>
      </div>
    </div>
  )
}

function ObjDisplay({
  // obj,
  KeyValueArr,
  obj,
  ...others
}: {
  // obj: object; //[string,any][],
  KeyValueArr: KeyValueArr
  obj: object
  others: grandType
}) {
  const jsxArr: JSX.Element[] = []
  let count = 1

  function handleObj(arr: KeyValueArr, depth: number) {
    for (let i = 0; i < arr.length; i++) {
      const { value, isExpanded, id } = arr[i]

      if (Array.isArray(value)) {
        jsxArr.push(
          <Item key={id} count={count} depth={depth} itemObj={arr[i]} isExpand={isExpanded} isObject grandCom={others}>
            {' '}
          </Item>
        )
        count++
        if (isExpanded) {
          handleObj(value, depth + 1)
        }
      } else {
        jsxArr.push(
          <Item key={id} count={count} depth={depth} itemObj={arr[i]} grandCom={others}>
            {' '}
          </Item>
        )
        count++
      }
    }
  }

  handleObj(KeyValueArr, 0)

  return <>{jsxArr} </>
}

let count = 1
// 刷新,获取obj传入
// 编辑,设置editable
// 复制,拷贝obj
// 删除,删除对应id
export default function ColListItem({ obj, onDelete }: { obj: doc; onDelete: (id: string) => void }) {
  const { activeDb, activeCol } = select('main')('activeDb', 'activeCol')

  const objRef = useRef(obj)
  const { current: refObj } = objRef

  // const [comObj, setcomObj] = useState(obj);

  const [KeyValueArr, setKeyValueArr] = useState(obj2arr(obj))

  if (obj._id === '6214d2cd0305dba17aa82e92') {
    console.log('colList rerender', count++)
    console.log(KeyValueArr)
  }
  // 2.拷贝
  function copy() {
    clipboard.copy(JSON.stringify(refObj))
    store.messageApi.open({
      type: 'success',
      content: '拷贝成功'
    })
  }
  // 4.删除
  function deleteDoc() {
    const id = obj._id
    activeDb &&
      activeCol &&
      deleteDocument(activeDb, activeCol, id).then((res) => {
        onDelete(id)
      })
  }
  // 1.编辑
  const [editable, setEditable] = useState(false)

  // 已编辑过还是未编辑过
  const [isModified, setisModified] = useState(false)

  // 刷新
  const [time, settime] = useState(Math.random())
  function refresh() {
    settime(Math.random())
    function dfs(arr: KeyValueArr): boolean {
      for (let i = 0; i < arr.length; i++) {
        const { value } = arr[i]
        if (arr[i].isNewAdded) return true
        if (arr[i].isModified) return true
        if (Array.isArray(value)) {
          if (dfs(value)) return true
        }
      }
      return false
    }
    // 处理展开
    const res = dfs(KeyValueArr)
    setisModified(res)
  }
  // 取消
  function cancel() {
    initArr(KeyValueArr)
    setisModified(false)
    setEditable(false)

    settime(Math.random())
  }
  // 更新
  function update() {
    deleteItems(KeyValueArr)
    setInit(KeyValueArr)
    refresh() // 处理modified

    const obj = arr2obj(KeyValueArr) as doc // 断言为doc
    objRef.current = obj
    console.log('update', obj)

    setEditable(false)
    activeDb &&
      activeCol &&
      updateDocument(activeDb, activeCol, obj._id, obj).then((res) => {
        console.log(res)
      })
  }

  function refreshDoc() {
    activeDb &&
      activeCol &&
      findDocumentById(activeDb, activeCol, obj._id).then((res) => {
        setKeyValueArr(obj2arr(res))
      })
  }
  return (
    <div className="col_list_item">
      <div className="wrap">
        <ObjDisplay
          KeyValueArr={KeyValueArr}
          // 传给孙组件
          editable={editable}
          onRefresh={refresh}
        ></ObjDisplay>
      </div>
      {editable && (
        <div className={'block ' + (!isModified ? 'normal' : 'modified')}>
          {isModified && 'Document modified'}
          <div className="hold"></div>
          <Button size="small" className="btn" onClick={cancel}>
            CANCEL
          </Button>
          <Button size="small" className="btn" onClick={update} disabled={!isModified}>
            UPDATE
          </Button>
        </div>
      )}
      {!editable && (
        <div className="btns">
          <Button onClick={refreshDoc}>
            <i className="iconfont icon-shuaxin"></i>
          </Button>
          <Button
            onClick={() => {
              setEditable(true)
            }}
          >
            <i className="iconfont icon-xiugai"></i>
          </Button>
          <Button onClick={copy}>
            <i className="iconfont icon-fuzhi"></i>
          </Button>
          <Button>
            <i className="iconfont icon-kelong"></i>
          </Button>
          <Button onClick={deleteDoc}>
            <i className="iconfont icon-lajitong1"></i>
          </Button>
        </div>
      )}
    </div>
  )
}
