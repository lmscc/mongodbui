import './Icon.styl'
import type { MouseEvent } from 'react'
import classnames from 'classnames'
export default function Icon({
  className,
  iconName,
  show,
  onClick
}: {
  className?: string
  iconName: string
  show?: boolean
  onClick?: (e: MouseEvent) => void
}) {
  return (
    <div
      className={classnames('round-icon', className, { show })}
      onClick={(e) => {
        e.stopPropagation()
        onClick != null && onClick(e)
      }}
    >
      <i className={'iconfont ' + iconName}></i>
    </div>
  )
}
