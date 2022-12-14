'use strict';

require('./check-versions')();

process.env.NODE_ENV = 'production';

const ora = require('ora');
const rm = require('rimraf');
const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');

const config = require('../config');
const webpackConfig = require('./webpack.prod.conf');
const spinner = ora('生产包构建中...');

spinner.start();

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err;
  webpack(webpackConfig, (err, stats) => {
    spinner.stop();
    if (err) throw err;
    process.stdout.write(stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false
    }) + '\n\n');
    if (stats.hasErrors()) {
      console.log(chalk.red('  生产包构建失败,错误如下\n'));
      process.exit(1);
    }
    console.log(chalk.cyan('  生产包构建完成\n'));
    console.log(chalk.yellow('  前往部署\n'));
  })
})
