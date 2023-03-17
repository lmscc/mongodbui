import Login from '@/components/Login/Login'

import { Navigate, createHashRouter } from 'react-router-dom'
import mainRoutes from '@/router/main'
export default createHashRouter([
  {
    path: '/login',
    element: <Login />
  },
  mainRoutes,
  {
    path: '*',

    element: <Navigate to={'login'} replace />
  }
])
