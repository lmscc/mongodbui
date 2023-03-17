//@ts-nocheck
import { useEffect, useState } from 'react'
import { Button, Popover, Dropdown } from 'antd'
import { dataType } from './enum'
import './index.styl'
import Input from '@/components/common/Input'
import {
  type KeyValueArr,
  type KeyValueItem,
  arr2obj,
  obj2arr,
  initArr,
  setInit,
  addNewItems,
  deleteItems
} from './keyValue'
import { isObject } from '@/global/utils'
function getTypeColor(isObjectId: boolean, isObject: boolean | undefined, type: dataType) {
  if (isObject || type === dataType.null) return '#747474'
  else if (isObjectId) return '#f32c00'
  else if (type === dataType.number) return '#3c90ee'
  else return '#2b8f60'
}
function displayValue(item: KeyValueArr | string | number, isArr: boolean, isObjectId: boolean) {
  if (isObject(item)) {
    if (isArr) {
      return `Array(${item.length})`
    } else {
      return `Object(${item.length})`
    }
  } else {
    if (isObjectId) {
      return `ObjectId('${item}')`
    } else {
      return item
    }
  }
}

function getPopoverContent(
  isObject: boolean,
  isArr: boolean,
  isArrayItem: boolean,
  key: string,
  addFn: (type: 'add' | 'after') => void
) {
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

  isEditable,
  onRefresh
}: {
  value: string
  count: number
  depth: number
  itemObj: KeyValueItem
  isExpand: boolean
  isObject?: boolean
  isEditable: boolean
  onRefresh: () => void
}) {
  const lineHeight = 18

  let { key, value, type, isDeleted, isArr, isArrayItem } = itemObj
  const isObjectId = depth === 0 && key === '_id'
  value = displayValue(value, isArr, isObjectId)
  const isModified = itemObj.isModified
  const items = []
  for (const key in dataType) {
    items.push({
      key,
      label: (
        <div
          onClick={() => {
            if (type !== key) {
              itemObj.typeTransform(key)
            }
            onRefresh()
          }}
          style={{ fontWeight: type === key ? '' : '' }}
        >
          {key}
        </div>
      )
    })
  }

  return (
    <div
      className={'key_value ' + (isDeleted ? 'key_value_deleted' : '')}
      onClick={(e) => {
        itemObj.isExpanded = !itemObj.isExpanded
        onRefresh()
      }}
    >
      <div className="key_wrap" style={{ height: lineHeight + 4 + 'px', lineHeight: lineHeight + 'px' }}>
        <div
          className={'delete ' + (isEditable && !isObjectId ? 'show' : '')}
          onClick={(e) => {
            e.stopPropagation()
          }}
        >
          {isModified || isDeleted ? (
            <i
              className={'iconfont icon-huifu '}
              onClick={(e) => {
                itemObj.recover()
                onRefresh()
              }}
            ></i>
          ) : (
            <i
              className={'iconfont icon-lajitong '}
              onClick={(e) => {
                itemObj.isDeleted = true
                onRefresh()
              }}
            ></i>
          )}
        </div>
        <div className="count" style={{ width: 20 * depth + 20 + 'px' }} onClick={(e) => {}}>
          <div className={'num ' + (isEditable && !isObjectId ? 'none' : '')}>{count}</div>
          <Popover
            content={getPopoverContent(isObject, isArr, isArrayItem, key, (addType) => {
              addNewItems(itemObj, addType)
              onRefresh()
            })}
            trigger="hover"
          >
            <i className={'iconfont icon-zengjia add ' + (isEditable && !isObjectId ? 'show' : '')}></i>
          </Popover>
        </div>
        {<div className={'fold_btn ' + (isExpand ? 'fold ' : ' ') + (isObject ? '' : 'hidden')}>&gt;</div>}
        <div className="key">
          <Input
            lineHeight={lineHeight}
            fontSize={13}
            value={key}
            editable={!isArrayItem && !isObjectId && isEditable}
            fitWidth
            oneLine
            onInput={(value) => {
              if (depth === 0 && value === '_id') {
                return
              }
              itemObj.key = value
              onRefresh()
            }}
          ></Input>
        </div>
        <div className="colon">:</div>
      </div>
      <div className="value">
        <Input
          lineHeight={lineHeight}
          fontSize={13}
          value={value}
          editable={!isObject && !isObjectId && isEditable && type !== dataType.null}
          fitHeight
          color={getTypeColor(isObjectId, isObject, type)}
          onInput={(value) => {
            if (type === dataType.number) {
              if (/[^0-9.]/.test(value)) {
                return null
              } else {
                itemObj.value = value
                onRefresh()
              }
            } else if (type === dataType.boolean) {
              if (value === 'true' || value === 'false') {
                itemObj.value = value
                onRefresh()
              } else {
                return null
              }
            } else {
              itemObj.value = value
              onRefresh()
            }
          }}
          tips={
            type === dataType.boolean
              ? [
                  { label: 'true', value: true },
                  { label: 'false', value: false }
                ]
              : undefined
          }
          onSelectTip={(label, value) => {
            itemObj.value = value
            onRefresh()
          }}
        ></Input>
      </div>
      {!isObjectId && (
        <div className="data_type">
          <Dropdown
            disabled={!isEditable}
            menu={{
              items
            }}
          >
            <div style={{ lineHeight: lineHeight + 'px' }}>{type}</div>
          </Dropdown>
        </div>
      )}
    </div>
  )
}
function isArrModified(arr: KeyValueArr): boolean {
  for (let i = 0; i < arr.length; i++) {
    const { value } = arr[i]
    if (arr[i].isNewAdded) return true
    if (arr[i].isModified) return true
    if (Array.isArray(value)) {
      if (isArrModified(value)) return true
    }
  }
  return false
}

export default function ObjDisplay({
  obj,
  isEditable,
  updateText,
  updateDisable,
  onUpdate,
  onCancel
}: // onModified
{
  obj: object
  isEditable: boolean
  updateText: string
  updateDisable: boolean
  onUpdate: (obj: doc) => void
  onCancel: () => void
  // onModified: (isOrigin: boolean, newObj: object) => void
}) {
  const jsxArr: JSX.Element[] = []
  const [time, settime] = useState(Math.random())
  const [isModified, setisModified] = useState(false)
  // 根据传入的obj，生成一个组件内部维护的状态 KeyValueArr
  const [KeyValueArr, setKeyValueArr] = useState(obj2arr(obj))
  useEffect(() => {
    setKeyValueArr(obj2arr(obj))
  }, [obj])
  function refresh() {
    settime(Math.random())
    // 处理展开
    const res = isArrModified(KeyValueArr)
    setisModified(res)
  }
  let count = 1
  function handleObj(arr: KeyValueArr, depth: number) {
    for (let i = 0; i < arr.length; i++) {
      const { value, isExpanded, id } = arr[i]

      if (Array.isArray(value)) {
        jsxArr.push(
          <Item
            key={id}
            count={count}
            depth={depth}
            itemObj={arr[i]}
            isExpand={isExpanded}
            isObject
            isEditable={isEditable}
            onRefresh={refresh}
          >
            {' '}
          </Item>
        )
        count++
        if (isExpanded) {
          handleObj(value, depth + 1)
        }
      } else {
        jsxArr.push(
          <Item key={id} count={count} depth={depth} itemObj={arr[i]} isEditable={isEditable} onRefresh={refresh}>
            {' '}
          </Item>
        )
        count++
      }
    }
  }

  handleObj(KeyValueArr, 0)
  function handleUpdate() {
    deleteItems(KeyValueArr)
    setInit(KeyValueArr)
    setisModified(false)
    onUpdate(arr2obj(KeyValueArr) as doc)
  }
  function handleCancel() {
    initArr(KeyValueArr)
    setisModified(false)
    onCancel()
  }
  return (
    <>
      <div className="wrap">{jsxArr}</div>
      {isEditable && (
        <div className={'block ' + (!isModified ? 'normal' : 'modified')}>
          {isModified && 'Document modified'}
          <div className="hold"></div>
          <Button size="small" className="btn" onClick={handleCancel}>
            CANCEL
          </Button>
          <Button size="small" className="btn" onClick={handleUpdate} disabled={updateDisable && !isModified}>
            {updateText}
          </Button>
        </div>
      )}
    </>
  )
}
