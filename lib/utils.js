const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');

/**
 * 检查项目名称是否有效
 * @param {string} name 项目名称
 * @returns {boolean} 是否有效
 */
function isValidProjectName(name) {
  // 检查是否为空或只包含空格
  if (!name || !name.trim()) {
    return false;
  }

  // 检查是否包含非法字符
  const invalidChars = /[<>:"/\\|?*]/;
  if (invalidChars.test(name)) {
    return false;
  }

  // 检查是否以点开头（隐藏文件）
  if (name.startsWith('.')) {
    return false;
  }

  return true;
}

/**
 * 格式化项目名称（转换为kebab-case）
 * @param {string} name 原始名称
 * @returns {string} 格式化后的名称
 */
function formatProjectName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

/**
 * 检查目录是否为空
 * @param {string} dir 目录路径
 * @returns {boolean} 是否为空
 */
function isDirEmpty(dir) {
  if (!fs.existsSync(dir)) {
    return true;
  }
  
  const files = fs.readdirSync(dir);
  return files.length === 0 || (files.length === 1 && files[0] === '.git');
}

/**
 * 打印成功消息
 * @param {string} message 消息内容
 */
function logSuccess(message) {
  console.log(chalk.green('✓'), message);
}

/**
 * 打印错误消息
 * @param {string} message 消息内容
 */
function logError(message) {
  console.log(chalk.red('✗'), message);
}

/**
 * 打印警告消息
 * @param {string} message 消息内容
 */
function logWarning(message) {
  console.log(chalk.yellow('⚠'), message);
}

/**
 * 打印信息消息
 * @param {string} message 消息内容
 */
function logInfo(message) {
  console.log(chalk.blue('ℹ'), message);
}

module.exports = {
  isValidProjectName,
  formatProjectName,
  isDirEmpty,
  logSuccess,
  logError,
  logWarning,
  logInfo
};
