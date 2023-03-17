import { Modal } from 'antd'
import { dispatch, select, selectByFn, type pageConfig } from '@/reducers/index'
import { useState } from 'react'
import ObjDisplay from '@/components/common/objview/index'
import { addDocument } from '@/request/index'
export default function ImportDoc({ open, onCancel }: { open: boolean; onCancel: () => void }) {
  const { activeDb, activeCol, dbAndCol, activeColPageId } = select(
    'activeDb',
    'activeCol',
    'dbAndCol',
    'activeColPageId'
  )
  const pageConfig = selectByFn<pageConfig>((state) => state.colPageList.find((item) => item.id === activeColPageId))

  const [obj, setObj] = useState({
    key: 'value'
  })
  function handleUpdate(obj: object) {
    activeDb &&
      activeCol &&
      dbAndCol &&
      addDocument(activeDb, activeCol, obj).then(({ insertedIds }) => {
        const col = dbAndCol[activeDb].collections.find((col) => col.name === activeCol)
        col && col.count++

        pageConfig.docList.push({
          _id: insertedIds[0],
          ...obj
        })

        dispatch('', {
          dbAndCol: JSON.parse(JSON.stringify(dbAndCol))
        })
      })
  }
  return (
    <Modal
      title={'Insert Document'}
      onCancel={() => {
        onCancel()
        setObj({
          key: 'value'
        })
      }}
      width={800}
      open={open}
      footer={null}
    >
      To Collection {activeDb}.{activeCol}
      <ObjDisplay
        isEditable={true}
        obj={obj}
        updateText={'INSERT'}
        updateDisable={false}
        onCancel={() => {
          onCancel()
          setObj({
            key: 'value'
          })
        }}
        onUpdate={handleUpdate}
      ></ObjDisplay>
    </Modal>
  )
}
