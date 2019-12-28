import typescript from 'rollup-plugin-typescript2';
import pkg from './package.json';
import commonjs from '@rollup/plugin-commonjs';

export default {
  input: 'src/index.ts',
  output: [
    { file: pkg.main, format: 'cjs', sourceMap: true },
    { file: pkg.module, format: 'es', sourceMap: true },
  ],
  external: [...Object.keys(pkg.dependencies || {})],
  plugins: [
    typescript({ typescript: require('typescript') }),
    commonjs(),
  ]
}
