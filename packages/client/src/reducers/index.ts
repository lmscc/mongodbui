import { combineReducers, createStore } from 'redux'
import { useSelector } from 'react-redux'
import mainReducer, { type mainKeyType } from './mainReducer'
import modalsReducer, { type modalKeyType } from './modalsReducer'

const obj = {
  main: mainReducer,
  modals: modalsReducer
}
const allReducers = combineReducers(obj)

const store = createStore(allReducers, window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__())
type inferReturn<fn> = fn extends (...args) => infer R ? R : never
export type allState = {
  [key in keyof typeof obj]: inferReturn<(typeof obj)[key]>
}

interface allTypes {
  main: mainKeyType
  others: modalKeyType
}

export const select = <rKey extends keyof allState>(reducerKey: rKey) => {
  return <T extends Array<keyof allState[rKey]>>(
    ...keys: T
  ): {
    [key in T[number]]: allState[rKey][key]
  } => {
    const obj: Record<T[number], any> = {}
    for (const key of keys) {
      const v = useSelector((state) => state[reducerKey][key]) as any
      obj[key] = v
    }
    return obj
  }
}

export const selectByFn = <rKey extends keyof allState>(reducerKey: rKey) => {
  return (fn: (state: allState[rKey]) => any) => {
    return useSelector((state) => {
      return fn(state[reducerKey])
    })
  }
}

export const dispatch = <rKey extends keyof allState>(reducerType: rKey) => {
  return (type: allTypes[rKey], payload: Partial<allState[rKey]>) => {
    const typeObj = { reducerType, type }

    if (payload) {
      store.dispatch({
        type: `${reducerType}/${type}`,
        typeObj,
        payload
      })
    }
  }
}

// // type dispatch = (type: any, payload: Partial<stateType>) => void
// export const dispatch = (type: '' | 'changeList' | 'changeActive' | 'init' | 'drop', payload: Partial<stateType>) => {
//   store.dispatch('main')({
//     type,
//     payload
//   })
// }
window.store = store
export default store
