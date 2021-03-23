/* eslint-disable global-require,import/no-extraneous-dependencies */

const path = require('path');

const absoluteRuntimePath = path.dirname(require.resolve('@babel/runtime/package.json'));

module.exports = function(api) {
  api.cache(!api.env('production'));

  return {
    presets: [
      [
        '@babel/preset-env',
        {
          // The starting point where the config search for browserslist will start,
          // and ascend to the system root until found.
          configPath: __dirname,

          // By default, @babel/preset-env (and Babel plugins in general) grouped ECMAScript syntax
          // features into collections of closely related smaller features. These groups can be
          // large and include a lot of edge cases, for example "function arguments" includes
          // destructured, default and rest parameters. From this grouping information,
          // Babel enables or disables each group based on the browser support target you specify
          // to @babel/preset-env’s targets option.
          //
          // When this option is enabled, @babel/preset-env tries to compile the broken syntax to
          // the closest non-broken modern syntax supported by your target browsers.
          // Depending on your targets and on how many modern syntax you are using,
          // this can lead to a significant size reduction in the compiled app.
          // This option merges the features of @babel/preset-modules without having
          // to use another preset.
          bugfixes: true,

          // Setting this to false will preserve ES modules. Use this only if you intend to ship
          // native ES Modules to browsers. If you are using a bundler with Babel,
          // the default modules: "auto" is always preferred.
          modules: 'auto',

          // This option configures how @babel/preset-env handles polyfills.
          // When either the `usage` or `entry` options are used, @babel/preset-env will add direct
          // references to core-js modules as bare imports (or requires). This means core-js will
          // be resolved relative to the file itself and needs to be accessible.
          //
          // Since @babel/polyfill was deprecated in 7.4.0, we recommend directly adding core-js
          // and setting the version via the corejs option.
          useBuiltIns: 'entry',

          // This option only has an effect when used alongside `useBuiltIns: usage` or
          // `useBuiltIns: entry`, and ensures @babel/preset-env injects the polyfills
          // supported by your core-js version.
          // By default, only polyfills for stable ECMAScript features are injected:
          // if you want to polyfill proposals, you can directly import a proposal polyfill
          // inside /src/polyfills.js: import "core-js/proposals/string-replace-all".
          corejs: { version: "3.9" },

          // An array of plugins to always exclude/remove.
          // This option is useful for "blacklisting" a transform like
          // @babel/plugin-transform-regenerator if you don't use generators and don't want to
          // include regeneratorRuntime (when using useBuiltIns) or for using another plugin like
          // fast-async instead of Babel's async-to-gen.
          exclude: [
            // Exclude transforms that make all code slower
            'transform-typeof-symbol',

            // // we don't use generators or async/await by default
            // 'transform-regenerator',
            //
            // // we don't use typed arrays by default
            // 'es6.typed.*',
            //
            // // we don't use reflect by default
            // 'es6.reflect.*',
            //
            // // we don't use symbols by default
            // 'es6.symbol',
            //
            // // we don't use advanced regexps by default
            // 'es6.regexp.*',
            //
            // // we don't use advanced math by default
            // 'es6.math.acosh',
            // 'es6.math.asinh',
            // 'es6.math.atanh',
            // 'es6.math.cbrt',
            // 'es6.math.clz32',
            // 'es6.math.cosh',
            // 'es6.math.expm1',
            // 'es6.math.fround',
            // 'es6.math.hypot',
            // 'es6.math.imul',
            // 'es6.math.log1p',
            // 'es6.math.log10',
            // 'es6.math.log2',
            // 'es6.math.sign',
            // 'es6.math.sinh',
            // 'es6.math.tanh',
            // 'es6.math.trunc',
            //
            // // we don't use maps and sets by default
            // 'es6.map',
            // 'es6.set',
            // 'es6.weak-map',
            // 'es6.weak-set',
            //
            // // Funky unused HTML string methods
            // 'es6.string.anchor',
            // 'es6.string.big',
            // 'es6.string.blink',
            // 'es6.string.bold',
            // 'es6.string.code-point-at',
            // 'es6.string.fixed',
            // 'es6.string.fontcolor',
            // 'es6.string.fontsize',
            // 'es6.string.from-code-point',
            // 'es6.string.italics',
            // 'es6.string.iterator',
            // 'es6.string.link',
          ],
        },
      ],
      [require('@babel/preset-typescript').default],
    ],
    plugins: [
      // class { handleClick = () => { } }
      // Enable loose mode to use assignment instead of defineProperty
      // See discussion in https://github.com/facebook/create-react-app/issues/4263
      [
        require('@babel/plugin-proposal-class-properties').default,
        {
          loose: true,
        },
      ],

      // Adds Numeric Separators
      require('@babel/plugin-proposal-numeric-separator').default,

      // Polyfills the runtime needed for async/await, generators, and friends
      // https://babeljs.io/docs/en/babel-plugin-transform-runtime
      [
        require('@babel/plugin-transform-runtime').default,
        {
          corejs: false,
          helpers: true,
          // By default, babel assumes babel/runtime version 7.0.0-beta.0,
          // explicitly resolving to match the provided helper functions.
          // https://github.com/babel/babel/issues/10261
          version: require('@babel/runtime/package.json').version,
          regenerator: true,
          // https://babeljs.io/docs/en/babel-plugin-transform-runtime#useesmodules
          // We should turn this on once the lowest version of Node LTS
          // supports ES Modules.
          useESModules: true, // TODO disable for testing?
          // Undocumented option that lets us encapsulate our runtime, ensuring
          // the correct version is used
          // https://github.com/babel/babel/blob/090c364a90fe73d36a30707fc612ce037bdbbb24/packages/babel-plugin-transform-runtime/src/index.js#L35-L42
          absoluteRuntime: absoluteRuntimePath,
        },
      ],
      'lodash',
      '@babel/plugin-syntax-dynamic-import',
      '@babel/plugin-syntax-import-meta',
      '@babel/plugin-proposal-json-strings',
      ['@babel/plugin-proposal-decorators', { legacy: true }],
      '@babel/plugin-proposal-function-sent',
      '@babel/plugin-proposal-export-namespace-from',
      '@babel/plugin-proposal-throw-expressions',

      // needed to register muban-components
      '@babel/plugin-transform-react-display-name',
    ],
  };
};
