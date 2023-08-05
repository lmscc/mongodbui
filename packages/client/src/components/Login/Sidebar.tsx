import { useLocalStorageState } from 'ahooks'
import styles from './Sidebar.module.styl'
import { dispatch } from '@/reducers'
import Icon from '@/components/common/Icon'
export default function Sidebar() {
  const [recentList, setRecentList] = useLocalStorageState('recent', {
    defaultValue: []
  })
  return (
    <div style={{ padding: '20px 0' }}>
      <h3 style={{ marginLeft: '20px' }}>
        <i className="iconfont icon-zuijinliulan" style={{ marginRight: '5px' }}></i>
        Recents
      </h3>
      {recentList.map(({ hostName, port, userName, psd, host, timestamp, time }) => (
        <div
          key={timestamp}
          className={styles.item}
          onClick={() =>
            dispatch('main')('', {
              uriConfig: {
                hostName,
                port,
                userName,
                psd
              }
            })
          }
        >
          <div style={{ flex: 1 }}>
            <div>{host}</div>
            <div className={styles.time}>{time}</div>
          </div>
          <Icon
            onClick={() => {
              const newList = recentList.filter((item) => item.timestamp !== timestamp)
              setRecentList(newList)
            }}
            iconName="icon-lajitong"
            className={styles.roundIcon}
          />
        </div>
      ))}
    </div>
  )
}
