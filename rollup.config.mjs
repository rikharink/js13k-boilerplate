import { join } from 'path';
import { defineConfig } from 'rollup';
import { terser } from 'rollup-plugin-terser';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import image from '@rollup/plugin-image';
import replace from '@rollup/plugin-replace';
import html2 from 'rollup-plugin-html2';
import livereload from 'rollup-plugin-livereload';
import serve from 'rollup-plugin-serve';
import { default as glslOptimize } from 'rollup-plugin-glsl-optimize';
import copy from 'rollup-plugin-copy';

const env = process.env.NODE_ENV || 'development';
const isDev = env === 'development';
const shouldMinify = process.env.MINIFY === 'true';

let externalDependencies = [];

if (isDev) {
  externalDependencies.push({
    tag: 'script',
    src: './lil-gui.min.js',
  });
  externalDependencies.push({
    tag: 'script',
    src: './stats.min.js',
  });
  externalDependencies.push({
    tag: 'script',
    src: './spector.bundle.js',
  });
}

const plugins = [
  html2({
    title: 'TopiConf 2022',
    template: join('src', 'index.html'),
    minify: false,
    externals: {
      before: externalDependencies,
    },
  }),
  glslOptimize(),
  image(),
  copy({
    targets: [
      { src: 'src/style.css', dest: 'dist' },
      { src: 'vendor/*', dest: 'dist' },
    ],
  }),
  json(),
  replace({
    preventAssignment: true,
    'process.env.NODE_ENV': JSON.stringify(env),
  }),
  typescript(),
];

if (shouldMinify) {
  plugins.push(
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
        booleans_as_integers: !isDev,
        drop_console: !isDev,
        drop_debugger: !isDev,
      },
      mangle: {
        properties: {
          regex: '^_.*',
        },
        module: true,
        toplevel: true,
      },
    }),
  );
}

if (isDev) {
  plugins.push(livereload({ watch: 'dist' }));
  plugins.push(serve({ open: true, contentBase: 'dist' }));
}

export default defineConfig({
  external: ['dat.gui'],
  input: join('src', 'index.ts'),
  output: {
    file: join('dist', 'bundle.js'),
    format: 'iife',
    sourcemap: isDev,
    strict: false,
  },
  plugins,
});
