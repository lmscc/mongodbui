import CreateModal from './createModal'
import React, { useEffect, useState } from 'react'
import DropModal from './dropModal'
enum showModalType {
  createDB,
  deleteDB,
  createCol,
  deleteCol,
  none
}
const fnMap: Record<'createDB' | 'deleteDB' | 'createCol' | 'deleteCol', (...arr: any) => any> = {}
export default function Modals() {
  const [dbName, setdbName] = useState('')
  const [colName, setColName] = useState('')
  const [showModal, setshowModal] = useState(showModalType.none)
  useEffect(() => {
    fnMap.createDB = function (dbName: string, colName: string) {
      setshowModal(showModalType.createDB)
      setdbName(dbName)
      setColName(colName)
    }
    fnMap.deleteDB = function (dbName: string) {
      setshowModal(showModalType.deleteDB)
      setdbName(dbName)
    }
    fnMap.createCol = function (dbName: string) {
      setshowModal(showModalType.createCol)
      setdbName(dbName)
    }
    fnMap.deleteCol = function (dbName: string, colName: string) {
      setshowModal(showModalType.deleteCol)
      setdbName(dbName)
      setColName(colName)
    }
  }, [])
  function hide() {
    setshowModal(showModalType.none)
  }
  function getModal() {
    if (showModal === showModalType.createDB) {
      return <CreateModal onCancel={hide} dbName={dbName} createType="Database" />
    } else if (showModal === showModalType.deleteDB) {
      return <DropModal onCancel={hide} dbName={dbName} colName={colName} dropType="Database" />
    } else if (showModal === showModalType.createCol) {
      return <CreateModal onCancel={hide} dbName={dbName} createType="Collection" />
    } else if (showModal === showModalType.deleteCol) {
      return <DropModal onCancel={hide} dbName={dbName} colName={colName} dropType="Collection" />
    }
  }
  return <div>{getModal()}</div>
}
export function createDB() {
  fnMap.createDB()
}
export function deleteDB(dbName: string) {
  fnMap.deleteDB(dbName)
}
export function createCol(dbName: string) {
  fnMap.createCol(dbName)
}
export function deleteCol(dbName: string, colName: string) {
  fnMap.deleteCol(dbName, colName)
}
