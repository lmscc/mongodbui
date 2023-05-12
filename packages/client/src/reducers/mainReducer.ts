import { handleChangeActive, handleDrop } from './handlers'

export interface pageConfig {
  id: number
  dbName: string
  colName: string
  activeSub: string
  docList: any[]
}
interface uriConfig {
  hostName: string
  port: string
  userName: string
  psd: string
}
export interface mainStateType {
  uriConfig: null | uriConfig
  isLogin: boolean
  dbAndCol: null | dbMap
  activeDb: null | string
  activeCol: null | string
  docList: null | any[]
  colPageList: pageConfig[]
  activeColPageId: number
  showLoading: boolean
}
export type mainKeyType = '' | 'changeList' | 'changeActive' | 'init' | 'drop'
const arr = JSON.parse(localStorage.getItem('recent')) || []

const defState: mainStateType = {
  uriConfig:
    arr.length === 0
      ? {
          hostName: location.hostname,
          port: 27017,
          userName: 'admin',
          psd: 'password123'
        }
      : arr[0],
  isLogin: false,

  dbAndCol: null,
  activeDb: null,
  activeCol: null,
  docList: null,
  colPageList: [],
  activeColPageId: 0,
  showLoading: false
}
export default function (state = defState, dispatchedObj) {
  const { typeObj = {}, payload } = dispatchedObj
  const { reducerType, type } = typeObj
  if (reducerType === 'main') {
    handleDrop(type, state, payload)
    handleChangeActive(type, state, payload)
    if (type === 'init') {
      return defState
    }
    const newState = { ...state }
    Object.assign(newState, payload)
    return newState
  } else {
    return state
  }
}
