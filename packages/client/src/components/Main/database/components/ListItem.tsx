import './ListItem.styl'
import Icon from '@/components/common/Icon'
export default function ListItem({
  mode,
  name,
  list,
  onClick,
  onDelete
}:
  | {
      mode: 'list' | 'card'
      name: string
      list: Array<[string, string | number]>
      onClick: (arr: [string | null, string]) => void
      onDelete?: (name: string) => void
    }
  | {
      mode: 'hold'
    }) {
  if (mode === 'hold') {
    return (
      <div className="item_hold">
        <div className="crad_wrap"></div>
      </div>
    )
  }
  return (
    <div
      className={mode + ' shadow relative'}
      onClick={() => {
        onClick && onClick()
      }}
    >
      <div className="wrap">
        <div className="title">{name}</div>
        <div className="content">
          {list?.map((item) => (
            <div className="item" key={item[0]}>
              <div className="key">{item[0]}</div>
              {mode === 'card' ? ':' : ''}
              <div className="value">{item[1]}</div>
            </div>
          ))}
        </div>
      </div>
      <Icon
        onClick={() => {
          onDelete != null && onDelete(name)
        }}
        iconName="icon-lajitong"
        className="icon-pos"
      />
    </div>
  )
}
