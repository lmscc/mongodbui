import styles from './index.module.styl'
import { Outlet } from 'react-router-dom'
import classNames from 'classnames'
import './handle.styl'
function SideBar({ head, body }: { head: JSX.Element; body: JSX.Element }) {
  return (
    <div className={styles.sideBar}>
      <div className={styles.head}>{head}</div>
      <div className={styles.content}>{body}</div>
    </div>
  )
}
export default function Main({ sideBarHead, sideBarBody }: { sideBarHead: JSX.Element; sideBarBody: JSX.Element }) {
  return (
    <div className={styles.app}>
      <div className={styles.mainWrap}>
        <SideBar head={sideBarHead} body={sideBarBody} />
        <div className={classNames(styles.main, 'ka_main')}>
          <Outlet></Outlet>
        </div>
      </div>
    </div>
  )
}
