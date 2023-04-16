1.把父组件传来的 props 保存在 useState 中可能导致组件不更新 2.不要把一个组件 B 写在另一个组件 A 内部,这样每次组件 B 渲染时都会重新定义 B,会导致 B 组件渲染出来的 dom 总是会卸载
不能实现 dom 的复用 
3.子组件 useState(prop)会将一个 prop 变为自身的状态,可以实现自己维护,但当父级修改了 prop,子组件会重新执行,获取到的却是 useState 保存的值
子级维护:自己维护,方便修改,但父级修改 prop 无效, 可以用一个effect来去修改state
父级维护:父级需要向下传递方法,子级调用这个方法

click event -> change activeDb,activeCol -> change side bar
            -> navigate(xx) -> change route view
                            -> change path
Route只能在Routes内使用

props
obj,传入一个对象，可以实现对象的展示，修改
editable，是否可编辑
onModified:({
  isOrigin,
  modifedPath:string[]
})=>,传入一个回调函数

onSave:(obj)=>()点击保存按钮
onCancel:取消修改
# 路由
## 要求
- 点击侧边栏，点击主页面的card，list能够正确跳转
- 修改url正确跳转，对于不存在的col，跳到对应的col，对于不存在的db，跳到databases

为了在初次渲染或修改url时把路径对应的状态同步到store上，在对应路由的loader中获取路径数据，dispatch给store。
但是，调用navigate导航时会先调用匹配路由的loader，再修改路径，会造成loader函数中获取到的路径是旧的
所以，我就不用navigate去导航，而是用location.hash 去修改url，进而触发router的导航
但是这有比较严重的卡顿问题，而且没法控制replace还是push
loader会在匹配到某个路由时触发