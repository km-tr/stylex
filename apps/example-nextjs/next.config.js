/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 *
 */

const path = require('path');

/** @type {import('next').NextConfig} */

module.exports = {
  transpilePackages: ['@stylexjs/open-props'],
  eslint: { ignoreDuringBuilds: true },
  webpack: (config, { dev, isServer }) => {
    // StyleXのコンパイルが必要なファイルのみをbabel-loaderで処理する
    config.module.rules.push({
      test: /\.(tsx|stylex\.ts|jsx|stylex\.js)$/,
      exclude: /node_modules(?!\/@stylexjs\/open-props)/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            parserOpts: {
              plugins: ['typescript', 'jsx'],
            },
            plugins: [
              [
                '@stylexjs/babel-plugin',
                {
                  dev: dev,
                  runtimeInjection: false,
                  genConditionalClasses: true,
                  treeshakeCompensation: true,
                  aliases: {
                    '@/*': [path.join(__dirname, '*')],
                  },
                  unstable_moduleResolution: {
                    type: 'commonJS',
                  },
                },
              ],
            ],
          },
        },
      ],
    });

    // Configure to prioritize local node_modules for resolution
    config.resolve.modules = [
      path.join(__dirname, 'node_modules'),
      'node_modules',
    ];

    return config;
  },
};
