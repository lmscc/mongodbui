// 可控制行高
// 编辑模式和非编辑模式切换,双击发出编辑事件
// 折叠模式和展开模式切换,单击展开

// contentEditable div
//   优点:内容自适应宽高
//   缺点:当内容重新熏染的时候,光标会回到开始,解决方案是将其变成非受控组件,
//        但是当需要更新值的时候,光标位置还是会回到开始
// input
//   优点:作为受控组件绑定,光标位置正常
//   缺点:不会自适应

// 用key可以使editableDiv正确复用但是会导致重新渲染而失焦
// 不用key会导致,editableDiv内容错误,因为我用非受控组件
import { useEffect, useRef, useState } from 'react'
import './Input.styl'
function changeValue(value: string) {
  if (typeof value === 'string') {
    value = value.replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    if (value[value.length - 1] === '\n') {
      value += '\n'
    }
    return value.replace(/\n/g, '<br/>')
  } else {
    return value
  }
}

export default function Input({
  lineHeight,
  value,
  editable,
  color,
  fontSize = 14,
  fontWeight,
  fitWidth,
  fitHeight,
  oneLine,
  tips,
  onInput,
  onSelectTip
}: {
  lineHeight: number
  value: string | number
  editable: boolean
  color?: string
  fontSize?: number
  fontWeight?: number
  fitWidth?: boolean // 宽度自适应内容
  fitHeight?: boolean // 高度自适应,如果为false,那么只有\n会使内容换行
  oneLine?: boolean // 只有一行
  tips?: Array<{ label: string; value: any }>
  onInput: (value: string) => void
  onSelectTip?: (label: string, value: any) => void
}) {
  const textRef = useRef<HTMLTextAreaElement>(null)
  const [line, setLine] = useState(1)
  const [isFold, setIsFold] = useState(true)
  const [isSlice, setIsSlice] = useState(true)
  value = String(value)
  value = isSlice && value.length > 100 ? value.slice(0, 100) : value
  function handleClick() {
    if (fitHeight) {
      if (isFold) {
        setIsFold(false)
      } else {
        setIsFold(true)
      }
    } else {
      if (isFold) {
        setLine(value.split('\n').length)
        setIsFold(false)
      } else {
        setLine(1)
        setIsFold(true)
      }
    }
  }
  function handleInput() {
    const dom = textRef.current
    if (dom != null && editable) {
      if (oneLine) {
        // key
        onInput(dom.value.replace(/\n/g, ''))
      } else {
        // value
        onInput(dom.value)
        setLine(dom.value.split('\n').length)
      }
    }
  }
  useEffect(() => {
    const dom = textRef.current
    dom != null && setLine(dom.value.split('\n').length)
  }, [editable])
  function getHeight() {
    if (isFold && fitHeight) {
      return lineHeight + 4 + 'px'
    }
    if (fitHeight) {
      return '100%'
    } else {
      return oneLine ? lineHeight + 4 + 'px' : lineHeight * line + 4 + 'px'
    }
  }
  if (fitWidth || fitHeight) {
    return (
      <>
        <div
          className="input_wrap"
          style={{
            position: 'relative',
            height: getHeight(),
            lineHeight: lineHeight + 'px',
            minHeight: lineHeight + 'px',
            width: fitWidth ? 'fit-content' : '',
            fontSize: fontSize + 'px',
            fontWeight
          }}
          onMouseEnter={() => {
            setIsSlice(false)
          }}
        >
          <textarea
            className={'area ' + (!editable ? 'input_normal' : 'input_editable')}
            style={{
              height: getHeight(),
              // lineHeight: lineHeight + 'px',继承
              color,
              fontWeight
              // fontSize: fontSize + 'px'继承
            }}
            ref={textRef}
            value={oneLine ? value.replace(/\n/g, '') : value}
            onInput={handleInput}
            onClick={(e) => {
              e.stopPropagation()
            }}
            onDoubleClick={handleClick}
          />
          <div
            className={'hiddenDiv'}
            style={{
              height: getHeight(),
              paddingRight: oneLine ? '10px' : ''
            }}
            dangerouslySetInnerHTML={{ __html: changeValue(value) }}
          ></div>
          {tips && editable && (
            <div className="tips" style={{ top: getHeight() }}>
              {tips.map((item) => (
                <div
                  onClick={() => {
                    onSelectTip && onSelectTip(item.label, item.value)
                  }}
                  key={item.value}
                  className={'tips_item'}
                >
                  {item.label}
                </div>
              ))}
            </div>
          )}
        </div>
        {/* <div
          className={"area " + (!editable ? "input_normal" : "input_editable")}
          style={{
            height: lineHeight + 4 + "px",
            lineHeight: lineHeight + "px",
          }}
          contenteditable={editable ? "true" : "false"}
          ref={divRef}
          onInput={handleDiv}
        >
        </div> */}
      </>
    )
  } else {
    return (
      <>
        <textarea
          className={'area ' + (!editable ? 'input_normal' : 'input_editable')}
          style={{
            height: line * lineHeight + 4 + 'px',
            lineHeight: lineHeight + 'px',
            color,
            fontSize: fontSize + 'px'
          }}
          ref={textRef}
          value={value}
          onInput={handleInput}
          onClick={(e) => {
            e.stopPropagation()
          }}
          onDoubleClick={handleClick}
        ></textarea>
        {/* <div
          className={"area " + (!editable ? "input_normal" : "input_editable")}
          style={{
            lineHeight: lineHeight + "px",
            color,
          }}
          contenteditable={editable ? "true" : "false"}
          ref={textRef}
          onInput={handleInput}
          // onDoubleClick={handleClick}
        >
          {value}
        </div> */}
      </>
    )
  }
}
