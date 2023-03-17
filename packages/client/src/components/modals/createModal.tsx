import { Modal, Button, Input, Alert } from 'antd'
import { type ChangeEvent, useState } from 'react'
import { createColletion, createDatabase, getDbAndCollections } from '@/request/index'
import { dispatch, select } from '@/reducers'
import { type dbMap } from '@/global/types'
import store from '@/global/index'
export default function createModal({
  dbName,
  createType,
  onCancel
}: {
  dbName: string
  createType: 'Database' | 'Collection'
  onCancel: () => void
}) {
  const { dbAndCol } = select('dbAndCol') as { dbAndCol: dbMap }

  const [showAlert, setshowAlert] = useState(false)
  const [newDbName, setNewDbName] = useState('')

  function handleDbInput(e: ChangeEvent<HTMLInputElement>) {
    setNewDbName(e.target.value)
  }

  const [colName, setcolName] = useState('')
  const [alertColName, setalertColName] = useState('')
  function handleColInput(e: ChangeEvent<HTMLInputElement>) {
    setcolName(e.target.value)
  }
  function handleCreateCol(dbName: string, colName: string) {
    const collections = dbAndCol[dbName].collections
    if (collections.some((item) => item.name === colName)) {
      setshowAlert(true)
      setalertColName(colName)
      return Promise.reject(new Error('存在该表'))
    } else {
      setshowAlert(false)
      return createColletion(dbName, colName).then((res) => {
        const dbAndColNew = JSON.parse(JSON.stringify(dbAndCol))
        dbAndColNew[dbName].collections.push({
          name: colName,
          count: 0,
          totalIndexSize: '4.10KB',
          avgObjSize: '0B',
          storageSize: '4.10KB'
        })
        dispatch('', {
          dbAndCol: dbAndColNew
        })
      })
    }
  }
  function handleOk() {
    if (createType === 'Database') {
      if (dbAndCol[newDbName]) {
        store.messageApi.open({
          type: 'error',
          content: '已存在该数据库'
        })
      } else {
        createDatabase(newDbName, colName).then(() => {
          getDbAndCollections().then((res) => {
            dispatch('', {
              dbAndCol: res[0]
            })
          })
          onCancel()
        })
      }
    } else {
      handleCreateCol(dbName, colName)
    }
  }

  return (
    <Modal
      open={true}
      title={
        <div>
          <h1>Create {createType}</h1>
        </div>
      }
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>
          Cancel
        </Button>,
        <Button
          key="create"
          onClick={handleOk}
          type="primary"
          disabled={createType === 'Database' ? newDbName === '' || colName === '' : colName === ''}
        >
          Create {createType}
        </Button>
      ]}
    >
      {createType === 'Database' ? (
        <>
          <p>Database Name</p>
          <Input onInput={handleDbInput} />
        </>
      ) : undefined}
      <p>Collection Name</p>
      <Input onInput={handleColInput} />
      {showAlert ? (
        <Alert
          message={
            createType === 'Database'
              ? `a collection '${newDbName}.${alertColName}' already exists`
              : `a collection '${dbName}.${alertColName}' already exists`
          }
          type="error"
          closable
        />
      ) : (
        ''
      )}
    </Modal>
  )
}
