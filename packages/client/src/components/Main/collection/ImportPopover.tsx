import { Popover, Modal, Button } from 'antd'
import { useState } from 'react'
import ImportDoc from './modals/ImportDoc'
export default function ImportPopover() {
  const [showImportFileModal, setShowImportFileModal] = useState(false)
  const [showImportDocModal, setShowImportDocModal] = useState(false)
  const [open, setOpen] = useState(false)

  const hide = () => {
    setOpen(false)
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
  }
  return (
    <>
      {' '}
      <Popover
        open={open}
        content={
          <div className="popover_content">
            <div
              className="item"
              onClick={() => {
                setOpen(false)
                setShowImportFileModal(true)
              }}
            >
              Import file
            </div>
            <div
              className="item"
              onClick={() => {
                setOpen(false)
                setShowImportDocModal(true)
              }}
            >
              Import document
            </div>
            <Modal
              open={showImportFileModal}
              onCancel={() => {
                setShowImportDocModal(false)
              }}
            ></Modal>
            <ImportDoc
              open={showImportDocModal}
              onCancel={() => {
                setOpen(false)
                setShowImportDocModal(false)
              }}
            ></ImportDoc>
          </div>
        }
        placement="bottom"
        trigger="hover"
      >
        <Button
          type="primary"
          onClick={() => {
            setOpen(true)
          }}
        >
          ADD DATA
        </Button>
      </Popover>
    </>
  )
}
