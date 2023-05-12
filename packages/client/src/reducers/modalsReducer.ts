export interface modalsStateType {
  modalType: 'createDb' | 'deleteDb' | 'createCol' | 'deleteCol' | 'none'
  dbName: string
  colName: string
}
export type modalKeyType = '' | 'init'

const defState: modalsStateType = {
  modalType: 'none',
  dbName: '',
  colName: ''
}
export default function (state = defState, dispatchedObj) {
  const { typeObj = {}, payload } = dispatchedObj // 初始是单独的一个type
  const { reducerType, type } = typeObj
  if (reducerType === 'modals') {
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
