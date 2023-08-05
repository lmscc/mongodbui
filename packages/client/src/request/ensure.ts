import { getDbAndCollections } from '.'
import { dispatch } from '@/reducers'
/*
一个请求库要做到什么？
- 错误重试，也可以显式地提示错误，让用户手动发请求
- 主动取消，
- 取消竞态
*/
/*
要保证该请求已发送，且只有一个发送
可能是主页面loginn进入，也可能是通过输入#/main进入
为了确保该请求已发送，用一个闭包的promise去存放状态
可不可以抽离出一个通用方法
*/
export const ensureDbAndCol = (() => {
  let promise: any = null
  return {
    getData() {
      if (promise === null) {
        promise = getDbAndCollections()
          .then((result) => {
            dispatch('main')('', {
              dbAndCol: result[0]
            })
          })
          .catch((err) => {
            promise = null
            return Promise.reject(err)
          })
        return promise
      } else {
        return promise
      }
    },
    removePromise() {
      promise = null
    }
  }
})()
