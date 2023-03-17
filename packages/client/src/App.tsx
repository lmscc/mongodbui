import { message, ConfigProvider } from 'antd'
import store from '@/global'
import { select } from '@/reducers/index'
import { RouterProvider } from 'react-router-dom'
import { GlobalLoading } from '@/components/common/Loading'
import { AliveScope } from 'react-activation'
import router from './router'
function App() {
  const { showLoading } = select('showLoading')

  const [messageApi, contextHolder] = message.useMessage()
  store.messageApi = messageApi

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#00684a'
        }
      }}
    >
      <AliveScope>
        <div className="App">
          {contextHolder}
          {showLoading ? <GlobalLoading /> : null}
          <RouterProvider router={router} />
        </div>
      </AliveScope>
    </ConfigProvider>
  )
}

export default App
