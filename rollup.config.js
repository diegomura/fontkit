import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';
import replace from 'rollup-plugin-replace'
import ignore from 'rollup-plugin-ignore'
import pkg from './package.json';

const cjs = {
  exports: 'named',
  format: 'cjs'
}

const esm = {
  format: 'es'
}

const getCJS = override => Object.assign({}, cjs, override)
const getESM = override => Object.assign({}, esm, override)

const configBase = {
  input: 'src/index.js',
  plugins: [
    localResolve(),
    json(),
    babel({
      babelrc: false,
      presets: [['es2015', { modules: false, loose: true }]],
      plugins: ['transform-decorators-legacy', 'transform-class-properties', 'transform-runtime'],
      runtimeHelpers: true
    })
  ],
  external: ['restructure/src/utils', 'brotli/decompress'].concat(
    Object.keys(pkg.dependencies)
  )
}

const serverConfig = Object.assign({}, configBase, {
  output: [
    getESM({ file: 'dist/fontkit.esm.js' }),
    getCJS({ file: 'dist/fontkit.cjs.js' }),
  ],
  plugins: configBase.plugins.concat(
    replace({
      BROWSER: JSON.stringify(false),
    })
  ),
  external: configBase.external.concat(['fs'])
})

const browserConfig = Object.assign({}, configBase, {
  output: [
    getESM({ file: 'dist/fontkit.browser.esm.js' }),
    getCJS({ file: 'dist/fontkit.browser.cjs.js' }),
  ],
  plugins: configBase.plugins.concat(
    replace({
      BROWSER: JSON.stringify(true),
    }),
    ignore(['fs'])
  ),
})

export default [
  serverConfig,
  browserConfig
]
