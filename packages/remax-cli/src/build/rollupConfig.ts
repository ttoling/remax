import { RollupOptions, RollupWarning } from 'rollup';
import API from '../API';
import output from './utils/output';
import path from 'path';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import babel from './plugins/babel';
import url from '@remax/rollup-plugin-url';
import json from '@rollup/plugin-json';
import postcss from '@remax/rollup-plugin-postcss';
import postcssUrl from './plugins/postcssUrl';
import progress from 'rollup-plugin-progress';
import clean from 'rollup-plugin-delete';
import copy from 'rollup-plugin-copy';
import stub from './plugins/stub';
import pxToUnits from '@remax/postcss-px2units';
import getEntries from '../getEntries';
import getCssModuleConfig from '../getCssModuleConfig';
import page from './plugins/page';
import removeSrc from './plugins/removeSrc';
import rename from './plugins/rename';
import replace from '@rollup/plugin-replace';
import { RemaxOptions } from 'remax-types';
import app from './plugins/app';
import { Context } from '../types';
import namedExports from 'named-exports-db';
import fixRegeneratorRuntime from './plugins/fixRegeneratorRuntime';
import nativeComponentsBabelPlugin from './plugins/nativeComponents/babelPlugin';
import nativeComponents from './plugins/nativeComponents';
import components from './plugins/components';
import template from './plugins/template';
import alias from './plugins/alias';
import * as staticCompiler from './plugins/compiler/static';
import extensions from '../extensions';
import { without } from 'lodash';
import jsx from 'acorn-jsx';
import getEnvironment from './env';

export default function rollupConfig(
  options: RemaxOptions,
  argv: any,
  context?: Context
) {
  const stubModules: string[] = [];

  ['wechat', 'alipay', 'toutiao'].forEach(name => {
    if (API.adapter.name !== name) {
      stubModules.push(`${name}/esm/api`);
      stubModules.push(`${name}/esm/hostComponents`);
    }
  });

  if (options.compiler === 'static' && API.adapter.name !== 'alipay') {
    output.error('目前 static compiler 模式仅支持 alipay 开启');
  }

  const entries = getEntries(options, context);
  const cssModuleConfig = getCssModuleConfig(options.cssModules);

  // 获取 postcss 配置
  const postcssConfig = {
    options: {},
    plugins: [],
    ...options.postcss,
  };

  const env = getEnvironment(options, argv.target);

  let babels = [
    babel({
      include: entries.pages,
      extensions: without(extensions, '.json'),
      usePlugins: [nativeComponentsBabelPlugin(options), page],
      reactPreset: false,
    }),
    babel({
      include: entries.app,
      extensions: without(extensions, '.json'),
      usePlugins: [nativeComponentsBabelPlugin(options), app],
      reactPreset: false,
    }),
    babel({
      extensions: without(extensions, '.json'),
      usePlugins: [nativeComponentsBabelPlugin(options), components(options)],
      reactPreset: true,
    }),
  ];

  if (options.compiler === 'static') {
    babels = [
      babel({
        extensions: without(extensions, '.json'),
        usePlugins: [
          nativeComponentsBabelPlugin(options),
          staticCompiler.preprocess,
          staticCompiler.visit,
        ],
        reactPreset: false,
      }),
      babel({
        include: entries.pages,
        extensions: without(extensions, '.json'),
        usePlugins: [page],
        reactPreset: false,
      }),
      babel({
        include: entries.app,
        extensions: without(extensions, '.json'),
        usePlugins: [app],
        reactPreset: false,
      }),
      babel({
        extensions: without(extensions, '.json'),
        usePlugins: [components(options)],
        reactPreset: true,
      }),
    ];
  }

  const plugins = [
    copy({
      targets: [
        {
          src: [`${options.rootDir}/native/*`],
          dest: options.output,
        },
      ],
      copyOnce: true,
    }),
    replace({
      values: env.stringified,
    }),
    alias(options),
    url({
      limit: 0,
      fileName: '[dirname][name][extname]',
      publicPath: '/',
      sourceDir: path.resolve(options.cwd, options.rootDir),
      include: ['**/*.svg', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif'],
    }),
    json(),
    resolve({
      dedupe: [
        'react',
        'object-assign',
        'prop-types',
        'scheduler',
        'react-reconciler',
      ],
      extensions,
      customResolveOptions: {
        moduleDirectory: 'node_modules',
      },
      preferBuiltins: false,
    }),
    commonjs({
      include: /node_modules/,
      namedExports,
      extensions,
      ignoreGlobal: false,
    }),
    stub({
      modules: stubModules,
    }),
    ...babels,
    postcss({
      extract: path.join(
        options.cwd,
        options.output,
        'app' + API.getMeta({ remaxOptions: options }).style
      ),
      ...postcssConfig.options,
      modules: cssModuleConfig,
      plugins: [options.pxToRpx && pxToUnits(), postcssUrl(options)]
        .filter(Boolean)
        .concat(postcssConfig.plugins),
    }),
    rename({
      include: `${options.rootDir}/**`,
      map: input => {
        if (!input) {
          return input;
        }

        input = input
          // typescript
          .replace(/\.ts$/, '.js')
          .replace(/\.tsx$/, '.js')
          // image
          .replace(/\.png$/, '.png.js')
          .replace(/\.gif$/, '.gif.js')
          .replace(/\.svg$/, '.svg.js')
          .replace(/\.jpeg$/, '.jpeg.js')
          .replace(/\.jpg$/, '.jpg.js');

        // 不启用 css module 的 css 文件以及 app.css
        if (
          cssModuleConfig.globalModulePaths.some(reg => reg.test(input)) ||
          input.indexOf('app.css') !== -1
        ) {
          return input.replace(
            /\.css/,
            API.getMeta({ remaxOptions: options }).style
          );
        }

        return input.replace(/\.css/, '.css.js');
      },
    }),
    rename({
      matchAll: true,
      map: input => {
        return (
          input &&
          input
            // npm 包可能会有 jsx
            .replace(/\.jsx$/, '.js')
            // npm 包里可能会有 css
            .replace(/\.less$/, '.less.js')
            .replace(/\.sass$/, '.sass.js')
            .replace(/\.scss$/, '.scss.js')
            .replace(/\.styl$/, '.styl.js')
            .replace(/node_modules/g, 'npm')
            .replace(/_commonjs-proxy$/, '_commonjs-proxy.js')
            // 支付宝小程序不允许目录带 @
            .replace(/@/g, '_')
        );
      },
    }),
    removeSrc(options),
    fixRegeneratorRuntime(),
    nativeComponents(options, entries.pages),
    template(options, context),
  ];

  /* istanbul ignore next */
  if (options.progress) {
    plugins.push(progress());
  }

  if (process.env.NODE_ENV === 'production') {
    plugins.unshift(
      clean({
        targets: [path.join(options.output, '*'), '!.tea'],
      })
    );
  }

  let config: RollupOptions = {
    treeshake: process.env.NODE_ENV === 'production',
    input: [entries.app, ...entries.pages, ...entries.images],
    output: {
      dir: options.output,
      format: 'cjs',
      exports: 'named',
      sourcemap: false,
      extend: true,
    },
    preserveModules: true,
    preserveSymlinks: true,
    acornInjectPlugins: [jsx()],
    /* istanbul ignore next */
    onwarn(warning, warn) {
      if ((warning as RollupWarning).code === 'THIS_IS_UNDEFINED') return;
      if ((warning as RollupWarning).code === 'CIRCULAR_DEPENDENCY') {
        output.warn('检测到循环依赖，如果不影响项目运行，请忽略');
      }

      if (!warning.message) {
        output.warn(
          `${warning.code}:${warning.plugin || ''} ${(warning as any).text}`
        );
      } else {
        output.warn(warning.toString());
      }
    },
    plugins,
  };

  if (typeof options.rollupOptions === 'function') {
    config = options.rollupOptions(config);
  } else if (options.rollupOptions) {
    config = { ...config, ...options.rollupOptions };
  }

  config = API.extendsRollupConfig({ rollupConfig: config });

  return config;
}
