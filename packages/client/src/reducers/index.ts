import { combineReducers, createStore } from 'redux'
import { useSelector } from 'react-redux'
import type { dbMap } from '@/global/types'
export interface pageConfig {
  id: number
  dbName: string
  colName: string
  activeSub: string
  docList: any[]
}
interface stateType {
  isLogin: boolean

  dbAndCol: null | dbMap
  activeDb: null | string
  activeCol: null | string
  docList: null | any[]
  colPageList: pageConfig[]
  activeColPageId: number
  showLoading: boolean
}
const defState: stateType = {
  isLogin: false,

  dbAndCol: null,
  activeDb: null,
  activeCol: null,
  docList: null,
  colPageList: [],
  activeColPageId: 0,
  showLoading: false
}
let count = 0
const reducer = function (state = defState, { type, payload }: { type: string; payload: Partial<stateType> }) {
  if (type === 'init') {
    return defState
  }
  if (payload) {
    const newState = { ...state }
    Object.assign(newState, payload)
    console.log(count++, newState)
    return newState
  } else {
    return state
  }
}
const allReducers = combineReducers({
  main: reducer
})

const store = createStore(allReducers)

export interface fullState {
  main: typeof defState
}

// interface selectType {
// <T extends Array<keyof stateType>>(...keys: T): {
//   [key in T[number]]: stateType[key]
// }
//   <T>(fn: (state: fullState) => T): T
// }

export const select = <T extends Array<keyof stateType>>(
  ...keys: T
): {
  [key in T[number]]: stateType[key]
} => {
  const obj: Record<T[number], any> = {}
  for (const key of keys) {
    const v = useSelector<fullState>((state) => state.main[key]) as any
    obj[key] = v
  }
  return obj
}
export const selectByFn = <T>(fn: (state: stateType) => any) => {
  return useSelector<fullState, T>((state) => {
    return fn(state.main)
  })
}
// type dispatch = (type: any, payload: Partial<stateType>) => void
export const dispatch = (type: '' | 'changeList' | 'changeActive' | 'init', payload: Partial<stateType>) => {
  const { colPageList, activeDb, activeCol } = payload
  if (type === 'changeList') {
    // 当改变list的时候，比如新增，删除，重新复制active
    // const { activeColPageId } = store.getState().main
    // const activePage = colPageList.find((item) => activeColPageId === item.id)
    payload.activeDb = activeDb
    payload.activeCol = activeCol
  }
  if (type === 'changeActive') {
    // 当db，col改变的时候，把转态同步到active的page上
    const { colPageList, activeColPageId } = store.getState().main
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
  store.dispatch({
    type,
    payload
  })
}
window.store = store
export default store
