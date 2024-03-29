import { Navigate, createHashRouter } from 'react-router-dom'
import LoginMain from '@/components/Login/Login'
import mainRoutes from '@/router/main'
import Layout from '@/components/Layout/index'
import SideBarBody from '@/components/Login/Sidebar'
export default createHashRouter([
  {
    path: '/login',
    element: <Layout sideBarHead={<>{'Compasss'}</>} sideBarBody={<SideBarBody />} />,
    children: [
      {
        index: true,
        element: <LoginMain />
      }
    ]
  },
  mainRoutes,
  {
    path: '*',

    element: <Navigate to={'login'} replace />
  }
])
