import { useMount } from 'ahooks'
import { useMemo, useRef, useState } from 'react'
import { useSyncEffect } from '@/hooks'
function getItemTops(items, getHeight) {
  const topArr = []
  let total = 0
  for (const item of items) {
    topArr.push(total)
    total += getHeight(item)
  }
  return topArr
}
// 查找大于等于target的最小值
function searchMin(L, R, target, arr) {
  while (L < R) {
    // 要落在左边,左边可以加一,这样才不会陷入循环
    const mid = parseInt((L + R) / 2)
    if (target > arr[mid]) {
      L = mid + 1
    } else {
      R = mid
    }
  }
  return arr[L] >= target ? L : 'no find'
}
function searchMax(L, R, target, arr) {
  while (L < R) {
    const mid = Math.ceil((L + R) / 2)
    if (arr[mid] > target) {
      R = R - 1
    } else {
      L = mid
    }
  }
  return arr[L] <= target ? L : 'no find'
}
function findStartAndEnd(topArr, top, bottom, rest) {
  const start = searchMin(0, topArr.length - 1, top, topArr)
  const end = searchMax(start, topArr.length - 1, bottom, topArr)
  // for (let i = start; i < topArr.length - 1; i++) {
  //   if (topArr[i] >= bottom && end === undefined) {
  //     end = i
  //     return [start - rest >= 0 ? start - rest : 0, end + rest]
  //   }
  // }
  // 没有找到末尾
  return [start - rest >= 0 ? start - rest : 0, end + rest]
}
export default function virtuoScroll({
  items,
  containerHeight,
  maxContainerHeight,
  getItemHeight,
  renderItem
}: {
  items: JSX.Element[]
  containerHeight: number | 'fit'
  maxContainerHeight?: number
  getItemHeight: (o: object) => number
  renderItem: (o: object, index: number) => JSX.Element
}) {
  const [top, setTop] = useState(0)
  const [renderedItems, setRenderedItems] = useState([])
  const tops = useMemo(() => getItemTops(items, getItemHeight), [items])
  const totalHeight = useMemo(() => items.reduce((pre, item) => pre + getItemHeight(item), 0), [items])

  const containerDom = useRef<HTMLDivElement>()
  let actualContainerHeight
  if (typeof containerHeight === 'number') {
    actualContainerHeight = containerHeight
  } else if (containerHeight === 'fit') {
    if (totalHeight > maxContainerHeight) {
      actualContainerHeight = maxContainerHeight
    } else {
      actualContainerHeight = totalHeight
    }
  }
  useMount(() => {
    console.log('virtuo mounted')
  })

  useSyncEffect(() => {
    calc((containerDom.current && containerDom.current.scrollTop) ?? 0)
  }, [items])
  console.log('renderedItems', renderedItems)
  if (!tops.length) return
  function calc(t) {
    const [start, end] = findStartAndEnd(tops, t, t + actualContainerHeight, 10)
    console.log(start, end)

    setTop(tops[start])
    let s = start
    setRenderedItems(items.slice(start, end + 1).map((item) => [item, s++]))
  }
  function handleScroll(e) {
    calc(e.target.scrollTop)
  }

  return (
    <div ref={containerDom} style={{ height: `${String(actualContainerHeight)}px`, overflow: 'auto' }} onScroll={handleScroll}>
      <div
        style={{
          width: '100%',
          height: `${String(tops[tops.length - 1] + getItemHeight(items[items.length - 1]))}px`
        }}
      >
        <div style={{ transform: `translateY(${String(top)}px)`, width: '100%' }}>
          {renderedItems.map(([item, index]) => renderItem(item, index))}
        </div>
      </div>
    </div>
  )
}
