import { dispatch } from '@/reducers'
import { useNavigate } from 'react-router-dom'

export function useNav() {
  const navigate = useNavigate()
  return {
    goDb(dbName: string) {
      dispatch('main')('changeActive', {
        activeDb: dbName,
        activeCol: null
      })
      navigate(`/main/database`)
    },
    goCol(dbName: string, colName: string) {
      dispatch('main')('changeActive', {
        activeDb: dbName,
        activeCol: colName
      })
      navigate(`/main/collection`)
    },
    goLogin() {
      navigate('/login')
    },
    goDatabases() {
      dispatch('main')('', {
        activeDb: null,
        activeCol: null
      })
      navigate('/main')
    }
  }
}
