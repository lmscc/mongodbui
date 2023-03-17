const rollup = require('rollup');
const util = require('util');

// rollup.config.js
/**
 * @type { import('rollup').RollupOptions }
 */
const ts = require('rollup-plugin-typescript2')
const stylus = require('rollup-plugin-stylus-compiler')
const postcss = require('rollup-plugin-postcss')
const dts = require('rollup-plugin-dts')
const buildOptions = [
  {
    input: ["./src/components/common/objview/index.tsx", "D:/桌面/web-project2/最22-mongodbUI-monrepo/packages/client/src/components/common/Input.tsx"],
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
 ]


async function build() {
  buildOptions.forEach(async item => {
    const bundle = await rollup.rollup(item);
    console.log(util.inspect(bundle));
  })
}
build();