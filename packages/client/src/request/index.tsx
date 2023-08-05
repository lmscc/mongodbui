import axios from 'axios'
import type { AxiosError, CancelTokenSource } from 'axios'
import globalStore from '@/global'
import type { dbMap } from '@/global/types'
// import type { doc } from '@r/global'
function errorHandler(err: AxiosError) {
  // 这里是返回状态码不为200时候的错误处理
  if (err && err.response != null) {
    switch (err.response.status) {
      case 400:
        err.message = '请求错误'
        break
      case 401:
        err.message = '请重新登录'
        return
      case 403:
        err.message = '拒绝访问'
        // err.message = "token不存在或已过时"
        break
      case 404:
        err.message = `请求地址出错: ${err.response.config.url ?? ''}`
        break
      case 408:
        err.message = '请求超时'
        break
      case 500:
        err.message = '服务器内部错误'
        break
      case 501:
        err.message = '服务未实现'
        break
      case 502:
        err.message = '网关错误'
        break
      case 503:
        err.message = '服务不可用'
        break
      case 504:
        err.message = '网关超时'
        break
      case 505:
        err.message = 'HTTP版本不受支持'
        break
      default:
    }
  }
  if (err.code !== 'ERR_CANCELED') {
    globalStore.messageApi.open({
      type: 'error',
      content: err.message
    })
  }

  return Promise.reject(err)
}

const cancelMap: Record<string, CancelTokenSource> = {}
axios.interceptors.request.use((config) => {
  // 处理竞态
  const { url = '' } = config
  if (cancelMap[url]) {
    cancelMap[url].cancel('取消竞态')
  }
  const source = axios.CancelToken.source()
  cancelMap[url] = source
  config.cancelToken = source.token
  // jwt
  // config.headers != null && (config.headers.token = localStorage.getItem('jwt'))

  return config
})
// 200的处理,错误状态码的处理
axios.interceptors.response.use((res) => {
  console.log('拦截器')
  const data: {
    err: string
    data: any
  } = res.data
  if (data.err) {
    // 错误处理
    globalStore.messageApi.open({
      type: 'error',
      content: data.err
    })
    return Promise.reject(data.err)
  } else {
    return data.data
  }
}, errorHandler)

axios.defaults.baseURL = import.meta.env.MODE === 'development' ? '/api' : '/mongodbui'
export function logout() {
  return axios.post('/logout')
}
export function login(uri: string) {
  return axios.post<
    any,
    {
      status: true
    }
  >(
    '/login',
    {
      uri
    },
    {
      timeout: 4000
    }
  )
}
// autoStart
export function getDbAndCollections() {
  return axios.get<
    any,
    [
      dbMap,
      {
        totalSize: number
        totalSizeMb: number
      }
    ]
  >('/getDbAndCollections', {})
}

export function createDatabase(dbName: string, colName: string) {
  return axios.post<any, undefined>('/createDatabase', {
    dbName,
    colName
  })
}

export function dropDatabase(dbName: string) {
  return axios.post<any, boolean>('/dropDatabase', {
    dbName
  })
}

export function createColletion(dbName: string, colName: string) {
  return axios.post<any, string>('/createColletion', {
    dbName,
    colName
  })
}

export function dropCollection(dbName: string, colName: string) {
  return axios.post<any, boolean>('/dropCollection', {
    dbName,
    colName
  })
}

export function addDocument(dbName: string, colName: string, msg: any) {
  return axios.post<
    any,
    {
      acknowledged: boolean
      insertedCount: number
      insertedIds: string[]
    }
  >('/addDocument', {
    dbName,
    colName,
    msg
  })
}

export function deleteDocument(dbName: string, colName: string, id: string) {
  return axios.post<
    any,
    {
      acknowledged: boolean
      deletedCount: number
    }
  >('/deleteDocument', {
    dbName,
    colName,
    id
  })
}

export function findDocumentById(dbName: string, colName: string, id: string) {
  return axios.post<any, doc>('/findDocumentById', {
    dbName,
    colName,
    id
  })
}

export function findDocumnet(dbName: string, colName: string, skip: number, limit: number, condition: object, sort: any) {
  return axios.post<
    any,
    {
      count: number
      arr: doc[]
    }
  >('/findDocumnet', {
    dbName,
    colName,
    skip,
    limit,
    condition,
    sort
  })
}

export function updateDocument(dbName: string, colName: string, id: string, update: any) {
  return axios.post<any, undefined>('/updateDocument', {
    dbName,
    colName,
    id,
    update
  })
}
// autoEnd
