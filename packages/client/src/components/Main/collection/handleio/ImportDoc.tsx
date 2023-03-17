import { Modal } from 'antd'
import { dispatch, select, selectByFn, type pageConfig } from '@/reducers/index'
import { useState } from 'react'
import ObjDisplay from '@/components/common/objview/index'
import { addDocument } from '@/request/index'
import store from '@/global'
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
  const [isInsertDisable, setIsInsertDisable] = useState(false)
  function handleUpdate(obj: object) {
    setIsInsertDisable(true)
    activeDb &&
      activeCol &&
      dbAndCol &&
      addDocument(activeDb, activeCol, obj)
        .then(({ insertedIds }) => {
          const col = dbAndCol[activeDb].collections.find((col) => col.name === activeCol)
          col && col.count++

          pageConfig.docList.push({
            _id: insertedIds[0],
            ...obj
          })
          store.messageApi.success('插入成功')

          dispatch('', {
            dbAndCol: JSON.parse(JSON.stringify(dbAndCol))
          })
        })
        .catch(() => {
          store.messageApi.error('插入失败')
        })
        .finally(() => {
          setIsInsertDisable(false)
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
        updateDisable={isInsertDisable}
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
