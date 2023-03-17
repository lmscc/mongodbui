import { isObject } from '@/global/utils'
import { dataType } from './enum'
export class KeyValueItem<keyType = string | number, valueType = string | number | KeyValueArr> {
  id = Math.random()

  key: keyType
  initKey: keyType
  value: valueType
  initValue: valueType
  type: dataType
  initType: dataType
  isArrayItem: boolean
  wrap: KeyValueArr
  isNewAdded: boolean
  isExpanded = false
  isDeleted = false
  constructor(
    key: keyType,
    value: valueType,
    type: dataType,
    isArrayItem: boolean,
    wrap: KeyValueArr,
    isNewAdded: boolean = false
  ) {
    this.initKey = this.key = key
    this.initValue = this.value = value
    this.initType = this.type = type
    this.isArrayItem = isArrayItem
    this.wrap = wrap
    this.isNewAdded = isNewAdded
  }

  get isModified() {
    return this.key !== this.initKey || this.value !== this.initValue || this.type !== this.initType || this.isDeleted
  }

  get isArr() {
    return this.type === dataType.array
  }

  recover() {
    this.key = this.initKey
    this.value = this.initValue
    this.type = this.initType
    this.isDeleted = false
  }

  typeTransform(newType) {
    this.type = newType
    if (newType === dataType.number) {
      this.value = Number(this.value)
    } else if (newType === dataType.boolean) {
      this.value = (!!this.value).toString()
    } else if (newType === dataType.string) {
      this.value = String(this.value)
    } else if (newType === dataType.null) {
      this.value = 'null'
    } else if (newType === dataType.array) {
      this.value = new KeyValueArr(true)
    } else if (newType === dataType.object) {
      this.value = new KeyValueArr(false)
    }
  }
}
export class KeyValueArr extends Array<KeyValueItem> {
  isArr?: boolean
  constructor(isArr: boolean) {
    super()
    this.isArr = isArr
  }
}
// type KeyValueArrType = KeyValueItem[]

export function obj2arr(obj: object | any[]) {
  if (Array.isArray(obj)) {
    const arr = new KeyValueArr(true)
    for (let i = 0; i < obj.length; i++) {
      const isArr = Array.isArray(obj[i])
      const transformedValue = isObject(obj[i]) ? obj2arr(obj[i]) : obj[i]
      const item = new KeyValueItem(
        i,
        transformedValue,
        isArr ? 'array' : obj[i] === null ? 'null' : typeof obj[i],
        true,
        arr
      )
      arr[i] = item
    }
    return arr
  } else {
    const arr = new KeyValueArr(false)
    for (const [key, value] of Object.entries(obj)) {
      const isArr = Array.isArray(value)
      const transformedValue = isObject(value) ? obj2arr(value) : value
      const item = new KeyValueItem(
        key,
        transformedValue,
        isArr ? 'array' : value === null ? 'null' : typeof value,
        false,
        arr
      )
      arr.push(item)
    }
    return arr
  }
}
export function arr2obj(arr: KeyValueArr, isArr: boolean = false): object | any[] {
  const obj = isArr ? [] : {}
  for (const item of arr) {
    const { key, value, isArr } = item
    if (Array.isArray(value)) {
      //
      obj[key] = arr2obj(value, isArr)
    } else {
      // string
      if (item.type === dataType.number) {
        obj[key] = Number(value)
      } else {
        obj[key] = value
      }
    }
  }
  return obj
}
export function refreshIndex(KeyValueArr: KeyValueArr) {
  let i = 0
  for (const item of KeyValueArr) {
    item.key = i++
  }
}

export function addNewItems(item: KeyValueItem, type: 'add' | 'after') {
  if (type === 'after') {
    const { wrap } = item
    const index = wrap.findIndex((i) => i === item)
    if (wrap.isArr) {
      wrap.splice(index + 1, 0, new KeyValueItem(index + 1, '', dataType.string, true, wrap, true))
      refreshIndex(wrap)
    } else {
      wrap.splice(index + 1, 0, new KeyValueItem('', '', dataType.string, false, wrap, true))
    }
  } else if (type === 'add') {
    item.isExpanded = true
    const { value: wrap } = item as { value: KeyValueArr }
    if (wrap.isArr) {
      wrap.push(new KeyValueItem(wrap.length, '', dataType.string, true, wrap, true))
    } else {
      wrap.push(new KeyValueItem('', '', dataType.string, false, wrap, true))
    }
  }
  console.log(item.wrap)
}
export function deleteItems(arr: KeyValueArr) {
  for (let i = 0; i < arr.length; i) {
    if (arr[i].isDeleted) {
      arr.splice(i, 1)
    } else {
      if (Array.isArray(arr[i].value)) {
        deleteItems(arr[i].value as KeyValueArr)
      }
      i++
    }
  }
  if (arr.isArr) {
    refreshIndex(arr)
  }
  return arr
}

// 初始化操作,把现在的值更新为初始值,删除新增,取消删除
export function initArr(arr: KeyValueArr) {
  for (let i = 0; i < arr.length; ) {
    // 删除新增
    if (arr[i].isNewAdded) {
      arr.splice(i, 1)
    } else {
      const { value } = arr[i]
      arr[i].key = arr[i].initKey
      if (Array.isArray(value)) {
        initArr(value)
      } else {
        arr[i].value = arr[i].initValue
        arr[i].isDeleted = false
      }
      i++
    }
  }
}
// 更新操作,把初始值设置为现在的值,delete已经删除了不需要的kv
export function setInit(arr: KeyValueArr) {
  for (let i = 0; i < arr.length; i++) {
    const { value } = arr[i]
    arr[i].initKey = arr[i].key
    if (Array.isArray(value)) {
      setInit(value)
    } else {
      arr[i].initValue = arr[i].value
      arr[i].isNewAdded = false
    }
  }
}
