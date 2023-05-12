import './main.styl'
import DataBases from '@/components/Main/database/DataBases'
import DbDetail from '@/components/Main/database/DbDetail'
import type { RouteObject } from 'react-router-dom'
import store, { dispatch } from '@/reducers'
import { login } from '@/request'
import CollectionPage from '@/components/Main/collection/CollectionPage'
import { KeepAlive } from 'react-activation'
import Layout from '@/components/Layout/index'
import { HeadContent, BodyContent } from '@/components/Main/sidebar/index'
import { ensureDbAndCol } from '@/request/ensure'
const mainRoutes: RouteObject = {
  path: '/main',
  loader: async () => {
    console.log('main-loader')

    try {
      const isLogin = store.getState().main.isLogin
      if (!isLogin) {
        const res = await login('')
        if (res) {
          dispatch('main')('', {
            isLogin: true
          })
        } else {
          location.hash = '#/login'
        }
      }
      const result = await ensureDbAndCol.getData()
      return true
    } catch (err) {
      console.log(err)
      location.hash = '#/login'
    }
    return false
  },
  element: <Layout sideBarHead={<HeadContent />} sideBarBody={<BodyContent />} />,
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
      //     dispatch('main')('', {
      //       activeDb: dbName,
      //       activeCol: null
      //     })
      //   } else {
      //     // 不存在该db的话跳到databases页面
      //     location.hash = '#/main'
      //     dispatch('main')('', {
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
        await ensureDbAndCol.getData()
        // if (store.getState().main.dbAndCol[dbName].collections.find((item) => item.name === colName)) {
        //   dispatch('main')('', {
        //     activeDb: dbName,
        //     activeCol: colName
        //   })
        // } else {
        //   // 不存在该集合的话跳到对应的数据库页面
        //   console.log(`没有${colName}路由`)

        //   location.hash = `#/main/${dbName}`
        //   dispatch('main')('', {
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
