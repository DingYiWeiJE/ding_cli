const inquirer = require('inquirer');
const chalk = require('chalk');
const ora = require('ora');
const fs = require('fs-extra');
const path = require('path');
const download = require('download-git-repo');
const platform = require('./platform');
const { isValidProjectName, logError, logWarning } = require('./utils');

// 模板配置
const templates = {
  react: {
    name: 'React项目',
    repo: 'DingYiWeiJE/EvayWeb',
    description: '基于Create React App的React项目模板'
  },
  vue: {
    name: 'Vue项目',
    repo: 'DingYiWeiJE/EvayVue',
    description: '基于Vue CLI的Vue项目模板'
  }
};

/**
 * 创建项目
 * @param {string} projectName 项目名称
 * @param {object} options 选项
 */
async function createProject(projectName, options) {
  try {
    // 显示平台信息（调试模式）
    if (process.env.DEBUG) {
      platform.showPlatformInfo();
    }

    // 验证项目名称
    if (projectName !== '.') {
      const validation = isValidProjectName(projectName);
      if (!validation.valid) {
        logError(`项目名称无效: ${validation.error}`);
        process.exit(1);
      }
    }

    // 如果没有指定模板，询问用户选择
    let template = options.template;
    if (!template || !templates[template]) {
      const answers = await inquirer.prompt([
        {
          type: 'list',
          name: 'template',
          message: '请选择项目模板:',
          choices: [
            {
              name: `${templates.react.name} - ${templates.react.description}`,
              value: 'react'
            },
            {
              name: `${templates.vue.name} - ${templates.vue.description}`,
              value: 'vue'
            }
          ]
        }
      ]);
      template = answers.template;
    }

    const templateConfig = templates[template];
    const targetDir = platform.resolvePath(process.cwd(), projectName);

    // 检查目录是否存在
    if (fs.existsSync(targetDir) && projectName !== '.') {
      const answers = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'overwrite',
          message: `目录 ${projectName} 已存在，是否覆盖？`,
          default: false
        }
      ]);

      if (!answers.overwrite) {
        console.log(chalk.yellow('已取消创建'));
        return;
      }

      // 删除现有目录
      await fs.remove(targetDir);
    }

    // 创建目录
    if (projectName !== '.') {
      await fs.ensureDir(targetDir);
    }

    // 下载模板
    const spinner = ora(`正在下载 ${templateConfig.name} 模板...`).start();
    
    await new Promise((resolve, reject) => {
      download(templateConfig.repo, targetDir, { clone: false }, (err) => {
        if (err) {
          spinner.fail('模板下载失败');
          reject(err);
        } else {
          spinner.succeed('模板下载成功');
          resolve();
        }
      });
    });

    // 更新package.json中的项目名称
    if (projectName !== '.') {
      await updatePackageJson(targetDir, projectName);
    }

    // 显示成功信息
    console.log();
    console.log(chalk.green('🎉 项目创建成功！'));
    console.log();
    console.log(chalk.yellow('接下来的步骤:'));
    if (projectName !== '.') {
      console.log(chalk.gray(`  cd ${projectName}`));
    }
    console.log(chalk.gray(`  ${platform.formatCommand('npm install')}`));
    console.log(chalk.gray(`  ${platform.formatCommand('npm start')}`));
    console.log();
    
    // 显示平台特定提示
    if (platform.isWindows()) {
      logWarning('Windows用户注意: 如果遇到权限问题，请以管理员身份运行命令行');
    }

  } catch (error) {
    console.error(chalk.red('创建项目时出错:'), error.message);
    process.exit(1);
  }
}

/**
 * 更新package.json中的项目名称
 * @param {string} targetDir 目标目录
 * @param {string} projectName 项目名称
 */
async function updatePackageJson(targetDir, projectName) {
  const packageJsonPath = platform.joinPath(targetDir, 'package.json');
  
  if (fs.existsSync(packageJsonPath)) {
    try {
      const packageJson = await fs.readJson(packageJsonPath);
      packageJson.name = projectName;
      await fs.writeJson(packageJsonPath, packageJson, { 
        spaces: 2,
        EOL: platform.getEOL() // 使用平台特定的换行符
      });
    } catch (error) {
      logError(`更新package.json失败: ${error.message}`);
      throw error;
    }
  }
}

module.exports = {
  createProject
};
