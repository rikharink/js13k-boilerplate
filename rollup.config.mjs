import { join } from 'path';
import { defineConfig } from 'rollup';
import { terser } from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import image from '@rollup/plugin-image';
import replace from '@rollup/plugin-replace';
import html2 from 'rollup-plugin-html2';
import { Packer } from 'roadroller';
import livereload from 'rollup-plugin-livereload';
import serve from 'rollup-plugin-serve';

const env = process.env.NODE_ENV || 'development';
const isDev = env === 'development';
const isProduction = env === 'production';

const roadroller = {
  renderChunk(data) {
    const inputs = [
      {
        data,
        type: 'js',
        action: 'eval',
      },
    ];

    const options = {
      maxMemoryMB: 150,
    };

    const packer = new Packer(inputs, options);
    packer.optimize(2);
    const { firstLine, secondLine } = packer.makeDecoder();
    return firstLine + secondLine;
  },
};

const plugins = [
  replace({
    preventAssignment: true,
    values: {
      'process.env.NODE_ENV': JSON.stringify(env),
      'process.env.DEBUG': JSON.stringify(isDev),
    },
  }),
  html2({
    title: 'JS13K 2022',
    template: join('src', 'index.html'),
    minify: {
      removeComments: !isDev,
      collapseWhitespace: !isDev,
      keepClosingSlash: isDev,
    },
  }),
  image(),
  json(),
  typescript(),
  terser({
    ecma: 11,
    module: true,
    toplevel: true,
    compress: {
      keep_fargs: false,
      passes: 10,
      pure_funcs: ['assert', 'debug'],
      pure_getters: true,
      unsafe: true,
      unsafe_arrows: true,
      unsafe_comps: true,
      unsafe_math: true,
      unsafe_methods: true,
      hoist_funs: true,
      booleans_as_integers: true,
      drop_console: !isDev,
      drop_debugger: !isDev,
    },
    mangle: {
      properties: {
        reserved: [],
      },
      module: true,
      toplevel: true,
    },
  }),
  isProduction && roadroller,
  isDev && livereload({ watch: 'dist' }),
  isDev &&
    serve({
      open: true,
      contentBase: 'dist',
    }),
];

export default defineConfig({
  input: join('src', 'index.ts'),
  output: {
    file: join('dist', 'bundle.js'),
    format: 'iife',
    sourcemap: isDev,
    strict: false,
  },
  plugins: plugins,
});
