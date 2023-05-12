import { message, ConfigProvider } from 'antd'
import { Provider } from 'react-redux'

import store, { select } from '@/reducers/index'
import { RouterProvider } from 'react-router-dom'
import { GlobalLoading } from '@/components/common/Loading'
import globalStore from '@/global/index'
import { AliveScope } from 'react-activation'
import router from './router'
import Modals from './components/modals'
function App() {
  const { showLoading } = select('main')('showLoading')

  const [messageApi, contextHolder] = message.useMessage()
  globalStore.messageApi = messageApi

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#00684a'
        }
      }}
    >
      <Modals />
      <AliveScope>
        {contextHolder}
        {showLoading ? <GlobalLoading /> : null}
        <RouterProvider router={router} />
      </AliveScope>
    </ConfigProvider>
  )
}

export default function StoreWrap() {
  return (
    <Provider store={store}>
      <App />
    </Provider>
  )
}
