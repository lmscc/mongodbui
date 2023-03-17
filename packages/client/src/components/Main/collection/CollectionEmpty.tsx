import { Button } from 'antd'
import './CollectionEmpty.styl'
import url from '@/assets/empty.png'
export default function CollectionEmpty() {
  return (
    <div className="empty">
      <div className="wrap">
        <img src={url} className="photo" />
        <div className="title">This collection has no data</div>
        <div>It only takes a few seconds to import data from a JSON or CSV file.</div>
        <Button type="primary">Import Data</Button>
      </div>
    </div>
  )
}
