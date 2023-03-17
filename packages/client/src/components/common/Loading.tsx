import './Loading.styl'
import { Spin } from 'antd'
export function Loading() {
  return (
    <div className="spinner2">
      <div className="rect1"></div>
      <div className="rect2"></div>
      <div className="rect3"></div>
      <div className="rect4"></div>
      <div className="rect5"></div>
    </div>
  )
}
export function GlobalLoading() {
  return (
    <div className="global_loading">
      <Spin tip="Loading" size="large"></Spin>
    </div>
  )
}
