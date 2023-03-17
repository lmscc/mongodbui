import ObjDisplay from '@/components/common/objview/index'
import { useState } from 'react'
import { Button } from 'antd'
import clipboard from 'clipboard'
import './ColListItem.styl'
import { deleteDocument, findDocumentById, updateDocument } from '@/request/index'
import store from '@/global'
import getLazyComponent from '@/components/common/LazyLoad'
function ColListItem({
  obj,
  dbName,
  colName,
  onDelete
}: {
  obj: doc
  dbName: string
  colName: string
  onDelete: (id: string) => void
}) {
  // console.log('render')

  const [comObj, setcomObj] = useState(obj)
  // 2.拷贝
  function copy() {
    clipboard.copy(JSON.stringify(comObj))
    store.messageApi.open({
      type: 'success',
      content: '拷贝成功'
    })
  }
  // 4.删除
  function deleteDoc() {
    const id = comObj._id
    dbName &&
      colName &&
      deleteDocument(dbName, colName, id).then((res) => {
        onDelete(id)
      })
  }
  // 1.编辑
  const [editable, setEditable] = useState(false)
  function refreshDoc() {
    dbName &&
      colName &&
      findDocumentById(dbName, colName, obj._id).then((res) => {
        setcomObj(res)
      })
  }

  function handleUpdate(newObj: doc) {
    setcomObj(newObj)
    setEditable(false)
    dbName && colName && updateDocument(dbName, colName, newObj._id, newObj)
  }
  function handleCancel() {
    setEditable(false)
  }

  return (
    <div className="col_list_item">
      <ObjDisplay
        obj={comObj}
        isEditable={editable}
        updateText={'UPDATE'}
        updateDisable={false}
        onUpdate={handleUpdate}
        onCancel={handleCancel}
      ></ObjDisplay>
      {!editable && (
        <div className="btns">
          <Button onClick={refreshDoc}>
            <i className="iconfont icon-shuaxin"></i>
          </Button>
          <Button
            onClick={() => {
              setEditable(true)
            }}
          >
            <i className="iconfont icon-xiugai"></i>
          </Button>
          <Button onClick={copy}>
            <i className="iconfont icon-fuzhi"></i>
          </Button>
          {/* <Button>
            <i className="iconfont icon-kelong"></i>
          </Button> */}
          <Button onClick={deleteDoc}>
            <i className="iconfont icon-lajitong1"></i>
          </Button>
        </div>
      )}
    </div>
  )
}

export default ColListItem
