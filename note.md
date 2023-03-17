global.ts 会被当做 global.d.ts,但是在添加了可执行代码后就会失去全局的的效果

1.  使用 global.d.ts,类型可以全局使用,不能实现类型校验
    使用 global.ts,类型不可全局使用,需要引入,可实现类型校验
2.  如果 include 包括了一个根目录外的文件,那么配置的 paths 会失效
