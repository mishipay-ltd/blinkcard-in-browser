/**
 * Copyright (c) Microblink Ltd. All rights reserved.
 */
import { Config } from '@stencil/core';
import { postcss } from '@stencil/postcss';
import { sass } from '@stencil/sass';

import autoprefixer from 'autoprefixer';

export const config: Config = {
  namespace: 'blinkcard-in-browser',
  taskQueue: 'async',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader'
    },
     {
      type: "dist-custom-elements",
    },
    {
      type: 'docs-readme',
      dir: 'docs',
      strict: true
    }
  ],
  plugins: [
    sass({
      // Add path to global SCSS files which should be included in every stylesheet
      injectGlobalPaths: []
    }),
    postcss({
      plugins: [autoprefixer()]
    })
  ]
};
