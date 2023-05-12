import CreateModal from './createModal'
import React from 'react'
import DropModal from './dropModal'
import { dispatch, select } from '@/reducers'
enum showModalType {
  createDB,
  deleteDB,
  createCol,
  deleteCol,
  none
}
export default function Modals() {
  const { modalType, dbName, colName } = select('modals')('modalType', 'dbName', 'colName')

  function hide() {
    dispatch('modals')('', {
      modalType: 'none'
    })
  }
  function getModal() {
    if (modalType === 'createDb') {
      return <CreateModal onCancel={hide} dbName={dbName} createType="Database" />
    } else if (modalType === 'deleteDb') {
      return <DropModal onCancel={hide} dbName={dbName} colName={colName} dropType="Database" />
    } else if (modalType === 'createCol') {
      return <CreateModal onCancel={hide} dbName={dbName} createType="Collection" />
    } else if (modalType === 'deleteCol') {
      return <DropModal onCancel={hide} dbName={dbName} colName={colName} dropType="Collection" />
    }
  }
  return <div>{getModal()}</div>
}
export function createDB() {
  dispatch('modals')('', {
    modalType: 'createDb'
  })
}
export function deleteDB(dbName: string) {
  dispatch('modals')('', {
    modalType: 'deleteDb',
    dbName
  })
}
export function createCol(dbName: string) {
  dispatch('modals')('', {
    modalType: 'createCol',
    dbName
  })
}
export function deleteCol(dbName: string, colName: string) {
  dispatch('modals')('', {
    modalType: 'deleteCol',
    dbName,
    colName
  })
}
