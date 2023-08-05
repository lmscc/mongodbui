// rollup.config.js
/**
 * @type { import('rollup').RollupOptions }
 */
import ts from 'rollup-plugin-typescript2'
import stylus from 'rollup-plugin-stylus-compiler'
import postcss from 'rollup-plugin-postcss';
import dts from 'rollup-plugin-dts'
const buildOptions = [
  {
    input: ["./src/components/common/objview/index.tsx"],
    // 将 output 改造成一个数组
    output: [
      {
        dir: "dist/es",
        format: "esm",
      }
    ],
    plugins: [
      ts({
        noEmitOnError: true,
        abortOnError: false,
        check: false
      }),
      stylus(),
      postcss({ include: '**/*.css' })
    ]
  }
  // , {
  //   input: ["./src/components/common/objview/index.tsx"],
  //   output: [{ filename: 'index.d.ts', dir: 'dist/es/type', format: 'esm' }],
  //   plugins: [dts(), stylus(),
  //   postcss({ include: '**/*.css' })]
  // }
]

export default buildOptions;