import { join } from "path";
import { defineConfig } from "rollup";
import { terser } from "rollup-plugin-terser";
import typescript from "@rollup/plugin-typescript";
import json from "@rollup/plugin-json";
import image from "@rollup/plugin-image";
import replace from "@rollup/plugin-replace";
import html2 from "rollup-plugin-html2";

const env = process.env.NODE_ENV || "development";
const isDev = env === "development";

const plugins = [
  replace({
    "process.env.NODE_ENV": JSON.stringify(env),
    preventAssignment: true,
  }),
  html2({
    title: "JS13K 2022",
    template: join("src", "index.html"),
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
      pure_funcs: ["assert", "debug"],
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
  })
];

export default defineConfig({
  input: join("src", "index.ts"),
  output: {
    file: join("dist", "bundle.js"),
    format: "iife",
    sourcemap: isDev,
    strict: false,
  },
  plugins: plugins,
});
