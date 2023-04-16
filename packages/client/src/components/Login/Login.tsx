import { dispatch } from '@/reducers'
import { login } from '@/request'
import { useNav } from '@/router/navigate'
import { Input, Form, Button } from 'antd'
import { type ChangeEvent } from 'react'
import styles from './Login.module.styl'
import { useLocalStorageState } from 'ahooks'
import { select } from '@/reducers/index'
import { ensureDbAndCol } from '@/request/ensure'
function headZero(num) {
  const str = String(num)
  if (str.length === 1) {
    return '0' + str
  } else {
    return str
  }
}
export default function Login() {
  const [recentList, setRecentList] = useLocalStorageState('recent', {
    defaultValue: []
  })
  const { uriConfig } = select('uriConfig')
  const { hostName, port, userName, psd } = uriConfig
  const { goDatabases } = useNav()
  async function handleLogin() {
    try {
      dispatch('', {
        showLoading: true
      })
      let uri
      if (!userName || !psd) {
        uri = `mongodb://${hostName}:${port}`
      } else {
        uri = `mongodb://${userName}:${psd}@${hostName}:${port}`
      }
      await login(uri)
      await ensureDbAndCol()
      const date = new Date()

      setRecentList([
        {
          hostName,
          port,
          userName,
          psd,
          host: `${hostName}:${port}`,
          timestamp: Date.now(),
          time: `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日 ${headZero(
            date.getHours()
          )}:${headZero(date.getMinutes())}`
        },
        ...recentList
      ])
      goDatabases()
    } finally {
      setTimeout(() => {
        dispatch('', {
          showLoading: false
        })
      }, 500)
    }
  }
  return (
    <div className={styles.loginPage}>
      <div className={styles.block}>
        <div className={styles.uri}>
          <span className={styles.protocol}>{'mongodb://'}</span>
          {userName && psd && <span>{userName + ':' + psd}</span>}
          {userName && psd && <span>@</span>}
          <span>{hostName + ':' + port}</span>
        </div>
        <Form.Item label={'hostName'}>
          <Input
            value={hostName}
            onInput={(e: ChangeEvent<HTMLInputElement>) => {
              uriConfig.hostName = e.target.value
              dispatch('', {
                uriConfig: { ...uriConfig }
              })
            }}
          ></Input>
        </Form.Item>
        <Form.Item label={'port'}>
          <Input
            value={port}
            onInput={(e: ChangeEvent<HTMLInputElement>) => {
              uriConfig.port = e.target.value
              dispatch('', {
                uriConfig: { ...uriConfig }
              })
            }}
          ></Input>
        </Form.Item>
        <Form.Item label={'username'}>
          <Input
            value={userName}
            onInput={(e: ChangeEvent<HTMLInputElement>) => {
              uriConfig.userName = e.target.value
              dispatch('', {
                uriConfig: { ...uriConfig }
              })
            }}
          ></Input>
        </Form.Item>
        <Form.Item label={'password'}>
          <Input
            value={psd}
            onInput={(e: ChangeEvent<HTMLInputElement>) => {
              uriConfig.psd = e.target.value
              dispatch('', {
                uriConfig: { ...uriConfig }
              })
            }}
          ></Input>
        </Form.Item>
        <Button onClick={handleLogin} type="primary">
          Connect
        </Button>
      </div>
    </div>
  )
}
