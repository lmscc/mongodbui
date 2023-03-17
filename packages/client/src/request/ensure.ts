import { dispatch } from '@/reducers'
import { getDbAndCollections } from '.'
// 同一时刻只有一个请求再跑
export const ensureDbAndCol = (() => {
  let promise: any = null
  return () => {
    if (promise === null) {
      promise = getDbAndCollections()
        .then((result) => {
          dispatch('', {
            dbAndCol: result[0]
          })
          promise = null
        })
        .catch((err) => {
          promise = null
          return Promise.reject(err)
        })
      return promise
    } else {
      return promise
    }
  }
})()
