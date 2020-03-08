import esm from 'esm';
import fs from 'fs';

function readTypescriptManifest(path: string, target: string) {
  require('@babel/register')({
    presets: [
      ['@babel/preset-env', { modules: 'commonjs' }],
      '@babel/preset-typescript',
    ],
    extensions: ['.ts'],
    cache: false,
  });
  // eslint-disable-next-line no-global-assign
  require = esm(module, {
    cjs: {
      dedefault: true,
    },
  });
  delete require.cache[require.resolve(path)];
  const config =
    require(path)[target] || require(path).default || require(path);

  return config;
}

function readJavascriptManifest(path: string, target: string) {
  // eslint-disable-next-line no-global-assign
  require = esm(module, {
    cjs: {
      dedefault: true,
    },
  });

  delete require.cache[require.resolve(path)];
  const config =
    require(path)[target] || require(path).default || require(path);

  return config;
}

export default function readManifest(path: string, target: string) {
  const tsPath = path + '.config.ts';
  if (fs.existsSync(tsPath)) {
    return readTypescriptManifest(tsPath, target);
  }

  const jsPath = path + '.config.js';
  if (fs.existsSync(jsPath)) {
    return readJavascriptManifest(jsPath, target);
  }

  return {};
}
