/* eslint-env node */

const IS_COVERAGE_ENABLED = process.env.IS_COVERAGE_ENABLED === 'true';

/**
 * This is used in webpack/app/server.js in order to have the server-side
 * VUE components use node's native async / await etc.
 */
function babelConfigWithEnvOverride(envOverride = {}) {
  const config = {
    presets: [
      [
        'behance',
        {
          env: {
            modules: false,
            corejs: 3,
            useBuiltIns: 'usage',
            // turn off if we want to take advantage of uglify-es/babel-minify
            forceAllTransforms: true,
            targets: {
              browsers: [
                'last 2 Chrome versions',
                'last 2 Edge versions',
                'last 2 Safari versions',
                'last 2 FF versions',
                'last 1 IE versions',
                'last 2 iOS versions',
              ],
            },
            ...envOverride,
          },
        },
      ],
    ],
  };

  if (IS_COVERAGE_ENABLED) {
    config.plugins = ['istanbul'];
  }

  return config;
}

function getConfig(api) {
  api.cache(true);
  return babelConfigWithEnvOverride();
}

module.exports = getConfig;
module.exports.babelConfigWithEnvOverride = babelConfigWithEnvOverride;
