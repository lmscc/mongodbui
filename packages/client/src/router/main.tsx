import './main.styl'
import DataBases from '@/components/Main/database/DataBases'
import DbDetail from '@/components/Main/database/DbDetail'
import { Outlet } from 'react-router-dom'
import Modals from '@/components/modals/index'
import SideBar from '@/components/SideBar/SideBar'
import type { RouteObject } from 'react-router-dom'
import store, { dispatch } from '@/reducers'
import { getDbAndCollections, login } from '@/request'
import CollectionPage from '@/components/Main/collection/CollectionPage'
import { KeepAlive } from 'react-activation'
const ensureDbAndCol = (() => {
  let promise: any = null
  return () => {
    if (!store.getState().main.dbAndCol) {
      if (promise === null) {
        promise = getDbAndCollections().then((result) => [
          dispatch('', {
            dbAndCol: result[0]
          })
        ])
        return promise
      } else {
        return promise
      }
    }
  }
})()

const mainRoutes: RouteObject = {
  path: '/main',
  loader: async () => {
    console.log('main-loader')

    const isLogin = store.getState().main.isLogin
    if (!isLogin) {
      const { status } = await login('')
      if (status === 'err') {
        location.hash = '#/login'
        return
      } else {
        dispatch('', {
          isLogin: true
        })
      }
    }
    await ensureDbAndCol()
    return true
  },
  element: (
    <div className="main_wrap">
      <SideBar />
      <div className="main">
        <Outlet></Outlet>
      </div>
      <Modals />
    </div>
  ),
  children: [
    {
      index: true,
      element: <DataBases />
    },
    {
      path: 'database',
      // loader: async ({ params }) => {
      //   console.log('db-loader')
      //   // const {url} = request
      //   // url.match(/#(.*?)\?/)
      //   // const dbName = location.hash.split('/')[2]
      //   const { dbName } = params
      //   await ensureDbAndCol()
      //   if (store.getState().main.dbAndCol[dbName]) {
      //     dispatch('', {
      //       activeDb: dbName,
      //       activeCol: null
      //     })
      //   } else {
      //     // 不存在该db的话跳到databases页面
      //     location.hash = '#/main'
      //     dispatch('', {
      //       activeDb: null
      //     })
      //   }

      //   return null
      // },
      element: <DbDetail />
    },
    {
      path: 'collection',

      loader: async ({ params }) => {
        console.log('col-loader')
        const { activeCol, activeDb } = store.getState().main
        if (!activeDb || !activeCol) {
          location.hash = `#/main`
        }
        await ensureDbAndCol()
        // if (store.getState().main.dbAndCol[dbName].collections.find((item) => item.name === colName)) {
        //   dispatch('', {
        //     activeDb: dbName,
        //     activeCol: colName
        //   })
        // } else {
        //   // 不存在该集合的话跳到对应的数据库页面
        //   console.log(`没有${colName}路由`)

        //   location.hash = `#/main/${dbName}`
        //   dispatch('', {
        //     activeDb: dbName,
        //     activeCol: null
        //   })
        // }

        return null
      },
      element: (
        <KeepAlive cacheKey="CollectionPage">
          <CollectionPage />
        </KeepAlive>
      )
    }
  ]
}
export default mainRoutes
