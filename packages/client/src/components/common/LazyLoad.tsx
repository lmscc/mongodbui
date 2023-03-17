import React, { useEffect, useState } from 'react'
import { useInView } from 'react-intersection-observer'

function getLazyComponent(Component) {
  return function Lazy(props) {
    const [loaded, setLoaded] = useState(false)
    const { ref, inView } = useInView({
      threshold: 0,
      triggerOnce: true
    })
    useEffect(() => {
      if (inView) {
        console.log('加载')
        // 当元素进入视口时，加载子元素
        setLoaded(true)
      }
    }, [inView])

    return (
      <div ref={ref} style={{ height: '200px' }}>
        {loaded && <Component {...props} />}
      </div>
    )
  }
}
export function LazyComponet({callBack,triggerOnce}) {
  const [loaded, setLoaded] = useState(false)
  const { ref, inView } = useInView({
    threshold: 0,
    triggerOnce
  })
  useEffect(() => {
    if (inView) {
      console.log('加载更多')
      // 当元素进入视口时，加载子元素
      callBack()
    }
  }, [inView])

  return <div ref={ref} style={{ height: '0px' }}></div>
}
export default getLazyComponent
