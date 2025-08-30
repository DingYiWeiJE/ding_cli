#!/usr/bin/env node

const { program } = require('commander');
const chalk = require('chalk');
const { createProject } = require('../lib/create');
const { version } = require('../package.json');

// 设置CLI版本
program.version(version, '-v, --version', '显示版本号');

// 创建项目命令
program
  .command('create <project-name>')
  .description('创建一个新的前端项目')
  .option('-t, --template <template>', '指定项目模板 (react/vue)', 'react')
  .action((projectName, options) => {
    console.log(chalk.blue(`🚀 开始创建项目: ${projectName}`));
    createProject(projectName, options);
  });

// 初始化命令
program
  .command('init')
  .description('在当前目录初始化项目')
  .option('-t, --template <template>', '指定项目模板 (react/vue)', 'react')
  .action((options) => {
    console.log(chalk.blue('🚀 开始初始化项目'));
    createProject('.', options);
  });

// 帮助信息
program.on('--help', () => {
  console.log();
  console.log(chalk.yellow('示例:'));
  console.log('  $ dingyw-cli create my-react-app');
  console.log('  $ dingyw-cli create my-vue-app -t vue');
  console.log('  $ dingyw-cli init -t react');
  console.log();
});

// 解析命令行参数
program.parse(process.argv);

// 如果没有提供参数，显示帮助信息
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
