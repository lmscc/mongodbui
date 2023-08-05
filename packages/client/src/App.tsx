import { message, ConfigProvider } from 'antd'
import { Provider } from 'react-redux'
import { AliveScope } from 'react-activation'
import { RouterProvider } from 'react-router-dom'
import router from './router'
import Modals from './components/modals'
import store, { select } from '@/reducers/index.ts'
import globalStore from '@/global/index'
import { GlobalLoading } from '@/components/common/Loading'
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
