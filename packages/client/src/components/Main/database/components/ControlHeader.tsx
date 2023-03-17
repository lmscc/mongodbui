import { Button, Segmented, Dropdown } from 'antd'
import './ControlHeader.styl'
import { itemModeType } from '@/global/enums'

// :FC<{
//   onClick:()=>void,
//   onSortModeChange:(mode)=>void,
//   onItemModeChange:(mode:itemModeType)=>void,
//   onReverseChange:()=>void,
//   sortMode:sortModeType,
//   isReverse:boolean,
//   arr:string[]
// }>
const fc = <sortModeType extends number>({
  sortMode,
  isReverse,
  sortChoices,
  btnStr,
  onClick,
  onSortModeChange,
  onItemModeChange,
  onReverseChange
}: {
  sortMode: sortModeType
  isReverse: boolean
  sortChoices: string[]
  btnStr: string
  onClick: (name: string) => void
  onSortModeChange: (mode: sortModeType) => void
  onItemModeChange: (mode: itemModeType) => void
  onReverseChange: () => void
}) => {
  const items = sortChoices.map((item, index) => {
    return {
      key: index,
      label: (
        <div
          onClick={() => {
            onSortModeChange(index)
          }}
        >
          {item}
        </div>
      )
    }
  })

  return (
    <div className="control_header">
      <Button type="primary" onClick={onClick}>
        {btnStr}
      </Button>
      <div className="view">View</div>
      <Segmented
        options={[
          {
            label: (
              <div>
                <i className="iconfont icon-danlieliebiao"></i>
              </div>
            ),
            value: itemModeType.list
          },
          {
            label: (
              <div>
                <i className="iconfont icon-shuanglieliebiao"></i>
              </div>
            ),
            value: itemModeType.card
          }
        ]}
        onChange={onItemModeChange}
      ></Segmented>
      <div className="hold"></div>
      <div>Sort by</div>

      <div className="dropdown">
        <Dropdown
          arrow={true}
          menu={{
            items,
            selectable: true
          }}
        >
          <Button>{sortChoices[sortMode]}</Button>
        </Dropdown>
      </div>
      <Button onClick={onReverseChange}>
        <i className={'iconfont ' + (isReverse ? 'icon-daoxu' : 'icon-zhengxu')}></i>
      </Button>
    </div>
  )
}
export default fc
