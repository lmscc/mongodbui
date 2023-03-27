import { Modal, Button, Input } from 'antd'
import { useState, type ChangeEvent } from 'react'
import { dropCollection, dropDatabase } from '@/request'
import './DeleteColModal.styl'
import { dispatch, select } from '@/reducers/index'
import { type dbMap } from '@/global/types'
export default function DropModal({
  dbName,
  colName,
  dropType,
  onCancel
}: {
  dbName: string
  colName: string
  dropType: 'Database' | 'Collection'
  onCancel: () => void
}) {
  const { dbAndCol, activeCol, activeDb } = select('dbAndCol', 'activeCol', 'activeDb')

  const [disable, setDisable] = useState(true)
  function handleInput(e: ChangeEvent<HTMLInputElement>) {
    const { value } = e.target
    if (dropType === 'Collection') {
      if (value === colName) {
        setDisable(false)
      } else {
        setDisable(true)
      }
    } else if (dropType === 'Database') {
      if (value === dbName) {
        setDisable(false)
      } else {
        setDisable(true)
      }
    }
  }

  function handleOk() {
    onCancel()
    if (dropType === 'Collection') {
      dbName &&
        dropCollection(dbName, colName).then((res) => {
          const dbAndColNew: dbMap = JSON.parse(JSON.stringify(dbAndCol))

          dbAndColNew[dbName].collections = dbAndColNew[dbName].collections.filter((item) => item.name !== colName)

          dispatch('drop', {
            dbAndCol: dbAndColNew
          })
          // if (dbName === activeDb && colName === activeCol) {
          //   location.hash = `#/main/${activeDb}`
          // }
        })
    } else {
      dropDatabase(dbName)
        .then((res) => {
          delete dbAndCol[dbName]
          dispatch('drop', {
            dbAndCol: JSON.parse(JSON.stringify(dbAndCol))
          })
        })
        .catch((err) => {
          console.log(err)
        })
    }
  }

  return (
    <Modal
      open={true}
      title={
        <div className="delete-col-title">
          {/* eslint-disable */}
          <svg
            t="warn-svg"
            className="icon"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="2415"
            width="200"
            height="200"
          >
            <path
              d="M559.652811 766.630305c-12.925381 12.961196-28.559453 19.407002-46.729278 19.407002-18.171871 0-34.18252-6.445806-47.176462-19.407002-13.440104-13.026688-19.885909-28.592198-19.885909-47.175439 0-18.171871 6.445806-34.250058 19.885909-47.176462 12.993942-13.473873 29.004591-19.953448 47.176462-19.953448 18.169825 0 33.770128 6.478552 46.729278 19.953448 13.473873 12.926404 19.919678 29.004591 19.919678 47.176462C579.57249 738.038106 573.126684 753.603617 559.652811 766.630305zM464.924333 321.648674c12.514012-13.406335 28.594245-20.331048 47.999201-20.331048 19.473517 0 35.518958 6.479575 48.067762 20.331048 12.135388 13.405311 18.581194 30.308283 18.581194 50.6731 0 17.279548-25.987884 145.847739-35.005258 239.34211l-62.774719 0c-7.371898-93.529163-35.930327-222.097354-35.930327-239.34211C445.862185 352.401072 452.342784 335.499124 464.924333 321.648674zM940.146709 758.813269 590.407256 148.543128c-42.822294-74.432223-112.557542-74.432223-155.344021 0L85.322759 758.813269c-42.787502 74.398454-7.817036 135.426389 77.895091 135.426389l699.44616 0C947.930999 894.239658 983.002772 833.212746 940.146709 758.813269z"
              p-id="2416"
              fill="#d81e06"
            ></path>
          </svg>
          <h1>Drop {dropType}</h1>
        </div>
      }
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button key="drop" disabled={disable} onClick={handleOk}>
          Drop {dropType}
        </Button>
      ]}
    >
      <p>
        To drop try type the {dropType.toLowerCase()} name `
        {dropType === 'Collection' ? colName : dbName}`
      </p>
      <Input onInput={handleInput} />
    </Modal>
  )
}
