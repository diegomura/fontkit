import babel from 'rollup-plugin-babel';
import json from 'rollup-plugin-json';
import localResolve from 'rollup-plugin-local-resolve';
import bundleSize from 'rollup-plugin-bundle-size';
import uglify from 'rollup-plugin-uglify';
import replace from 'rollup-plugin-replace'
import ignore from 'rollup-plugin-ignore'
import pkg from './package.json';

const cjs = {
  exports: 'named',
  format: 'cjs'
}

const es = {
  format: 'es'
}

const getCJS = override => Object.assign({}, cjs, override)
const getESM = override => Object.assign({}, es, override)

const configBase = {
  input: 'src/index.js',
  plugins: [
    localResolve(),
    json(),
    babel({
      babelrc: false,
      presets: [['es2015', { modules: false, loose: true }]],
      plugins: ['transform-decorators-legacy', 'transform-class-properties', 'external-helpers'],
      runtimeHelpers: true
    }),
    bundleSize()
  ],
  external: ['restructure/src/utils'].concat(
    Object.keys(pkg.dependencies)
  )
}

const serverConfig = Object.assign({}, configBase, {
  output: [
    getESM({ file: 'dist/fontkit.es.js' }),
    getCJS({ file: 'dist/fontkit.cjs.js' }),
  ],
  plugins: configBase.plugins.concat(
    replace({
      BROWSER: JSON.stringify(false),
    })
  ),
  external: configBase.external.concat(['fs', 'brotli/decompress'])
})

const serverProdConfig = Object.assign({}, serverConfig, {
  output: [
    getESM({ file: 'dist/fontkit.es.min.js' }),
    getCJS({ file: 'dist/fontkit.cjs.min.js' }),
  ],
  plugins: serverConfig.plugins.concat(
    uglify()
  ),
})

const browserConfig = Object.assign({}, configBase, {
  output: [
    getESM({ file: 'dist/fontkit.browser.es.js' }),
    getCJS({ file: 'dist/fontkit.browser.cjs.js' }),
  ],
  plugins: configBase.plugins.concat(
    replace({
      BROWSER: JSON.stringify(true),
    }),
    ignore(['fs', 'brotli', 'brotli/decompress', './WOFF2Font'])
  )
})

const browserProdConfig = Object.assign({}, browserConfig, {
  output: [
    getESM({ file: 'dist/fontkit.browser.es.min.js' }),
    getCJS({ file: 'dist/fontkit.browser.cjs.min.js' }),
  ],
  plugins: browserConfig.plugins.concat(
    uglify()
  ),
})

export default [
  serverConfig,
  serverProdConfig,
  browserConfig,
  browserProdConfig
]
