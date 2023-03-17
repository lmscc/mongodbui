import { login } from '@/request'
import { Button, Input } from 'antd'
import { type ChangeEvent, useState } from 'react'
import store from '@/global/index'

import './Login.styl'
import { dispatch } from '@/reducers'
import { useNavigate } from 'react-router-dom'
export default function Login() {
  const [psd, setPsd] = useState('')
  const [passwordVisible, setpasswordVisible] = useState(false)
  const navigate = useNavigate()
  function log() {
    // if (!/.{10,20}$/.test(psd)) {
    //   store.messageApi.open({
    //     type: 'error',
    //     content: '长度需在10-20内'
    //   })
    //   return
    // }
    dispatch('', {
      showLoading: true
    })
    login(psd)
      .then((res) => {
        if (res.status === 'ok' || res.status === 'isLogin') {
          navigate('/main')
          dispatch('', {
            isLogin: true
          })
          if (res.status === 'ok') {
            localStorage.setItem('jwt', res.jwt)
          }
        } else {
          store.messageApi.open({
            type: 'error',
            content: '密码错误'
          })
        }
      })
      .finally(() => {
        dispatch('', {
          showLoading: false
        })
      })
  }
  return (
    <div className="login_page">
      <div className="block">
        <h1 className="name">mongodbUI</h1>
        <div className="psd">
          <Input.Password
            placeholder="Password"
            value={psd}
            onInput={(e: ChangeEvent<HTMLInputElement>) => {
              setPsd(e.target.value.trim())
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                log()
              }
            }}
            maxLength={20}
            visibilityToggle={{
              visible: passwordVisible,
              onVisibleChange: setpasswordVisible
            }}
          ></Input.Password>
        </div>
        <Button className="btn" type="primary" onClick={log}>
          Login
        </Button>
      </div>
    </div>
  )
}
