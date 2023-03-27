import { Input } from 'antd'
import classNames from 'classnames'
import { useRef, useState } from 'react'
import styles from './ConditionSearch.module.styl'
function isSatisfied(origin: string, search: string) {
  let si = 0
  const chars: Record<string, boolean> = {}
  for (let oi = 0; oi < origin.length; oi++) {
    if (origin[oi].toLocaleLowerCase() === search[si].toLocaleLowerCase()) {
      chars[oi] = true
      si++
    }
    if (si === search.length) {
      return chars
    }
  }
  return false
}
function handleOptions(options, search) {
  return options.filter((option) => {
    const result = isSatisfied(option.value, search)
    if (result) {
      option.highlight = result
      return true
    } else {
      return false
    }
  })
}

function findNewChar(oldStr: string, newStr: string): [string, number] {
  for (let i = 0; i < newStr.length; i++) {
    if (newStr[i] !== oldStr[i]) {
      return [newStr[i], i]
    }
  }
  return [newStr[newStr.length - 1], newStr.length - 1]
}
const operators = [
  'all',
  'and',
  'bitsAllClear',
  'bitsAllSet',
  'bitsAnyClear',
  'bitsAnySet',
  'comment',
  'elemMatch',
  'eq',
  'exists',
  'expr',
  'geoIntersects',
  'geoWithin',
  'gt',
  'gte',
  'in',
  'jsonSchema',
  'lt',
  'lte',
  'mod',
  'ne',
  'near',
  'nearSphere',
  'nin',
  'not',
  'or',
  'regex',
  'size',
  'slice',
  'text',
  'type',
  'where'
].map((str) => ({
  value: '$' + str
}))
export default function ConditionSearch({ onChange, error, value }) {
  const [open, setOpen] = useState(false)
  const [options, setOptions] = useState<Array<{ value: string }>>([])
  const [activeIndex, setActiveIndex] = useState(0)
  const lastIndex = useRef(0)
  const lenRef = useRef(0)
  const inputRef = useRef()
  const [hiddenStr, setHiddenStr] = useState('')
  function handleInput(e) {
    const { value: newValue } = e.target
    const [char, index] = findNewChar(value, newValue)
    let ops = []
    let searchStr = ''
    if (!open) {
      // 只支持添加
      if (value.length >= newValue.length) {
        setActiveIndex(0)
        onChange(newValue)
        return
      }
      console.log('setNew', char)
      lastIndex.current = index
      lenRef.current = 1
      searchStr = char
      setHiddenStr(value.slice(0, index))
    } else {
      // 支持添加删除
      if (lastIndex.current === index + 1) {
        setActiveIndex(0)
        setOpen(false)
        onChange(newValue)
        return
      }
      const str = newValue.slice(lastIndex.current, index + 1)
      console.log('find', str)
      lenRef.current = str.length
      searchStr = str
    }
    if (searchStr[0] === '$') {
      ops = handleOptions(operators, searchStr)
    }
    console.log(ops)

    if (ops.length) {
      setOptions(ops)
      setOpen(true)
    } else {
      setOpen(false)
    }
    onChange(newValue)
  }
  function handleSelect(str) {
    const { current: index } = lastIndex
    const { current: len } = lenRef
    const result = value.slice(0, index) + str + value.slice(index + len)
    onChange(result)
    setOpen(false)
    setActiveIndex(0)
    setTimeout(() => {
      const { input } = inputRef.current
      input.focus()
      input.selectionStart = index + str.length
      input.selectionEnd = index + str.length
    })
  }
  function handleKeyDown(e) {
    const { key } = e
    console.log(key)

    if (key === 'ArrowUp' && activeIndex > 0) {
      setActiveIndex((pre) => --pre)
    } else if (key === 'ArrowDown' && activeIndex < options.length - 1) {
      setActiveIndex((pre) => ++pre)
    } else if (key === 'Enter' || key === 'Tab') {
      handleSelect(options[activeIndex].value)
    }
  }
  return (
    <div className={styles.search}>
      <div className={styles.input}>
        <Input
          className={styles.input}
          placeholder="Type a query {field:'value'}"
          ref={inputRef}
          value={value}
          onInput={handleInput}
          status={error}
          onKeyDown={handleKeyDown}
        />
      </div>
      {open && (
        <div className={styles.tip}>
          <div className={styles.hiddenDiv}>{hiddenStr}</div>
          <div className={styles.tipContent}>
            {options.map(({ value, highlight }, index) => (
              <div
                className={classNames({
                  [styles.activeOption]: activeIndex === index,
                  [styles.option]: true
                })}
                onClick={() => handleSelect(value)}
              >
                {value.split('').map((char, index) => (
                  <span key={index} className={classNames({ [styles.hightlight]: highlight[index] === true })}>
                    {char}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
