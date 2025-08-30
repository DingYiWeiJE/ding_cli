const os = require('os');
const path = require('path');
const chalk = require('chalk');

/**
 * 跨平台兼容性工具模块
 * 处理不同操作系统之间的差异
 */

/**
 * 检测当前操作系统
 */
function isWindows() {
  return os.platform() === 'win32';
}

function isMacOS() {
  return os.platform() === 'darwin';
}

function isLinux() {
  return os.platform() === 'linux';
}

function getOSName() {
  const platform = os.platform();
  switch (platform) {
    case 'win32':
      return 'Windows';
    case 'darwin':
      return 'macOS';
    case 'linux':
      return 'Linux';
    default:
      return platform;
  }
}

/**
 * 跨平台路径处理
 */
function normalizePath(filePath) {
  return path.normalize(filePath);
}

function joinPath(...paths) {
  return path.join(...paths);
}

function resolvePath(...paths) {
  return path.resolve(...paths);
}

function getHomeDir() {
  return os.homedir();
}

function getTempDir() {
  return os.tmpdir();
}

/**
 * 跨平台文件名验证
 * @param {string} name 文件名
 * @returns {object} 验证结果 {valid: boolean, error: string}
 */
function validateFileName(name) {
  if (!name || !name.trim()) {
    return {
      valid: false,
      error: '文件名不能为空'
    };
  }

  const trimmedName = name.trim();

  // 长度检查
  if (trimmedName.length > 255) {
    return {
      valid: false,
      error: '文件名长度不能超过255个字符'
    };
  }

  // 检查是否以点开头（隐藏文件）
  if (trimmedName.startsWith('.')) {
    return {
      valid: false,
      error: '项目名不能以点开头'
    };
  }

  // Windows系统特殊检查
  if (isWindows()) {
    // Windows保留名称
    const windowsReserved = /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i;
    if (windowsReserved.test(trimmedName)) {
      return {
        valid: false,
        error: `"${trimmedName}" 是Windows系统保留名称，请使用其他名称`
      };
    }

    // Windows不允许的字符
    const windowsInvalid = /[<>:"/\\|?*]/;
    if (windowsInvalid.test(trimmedName)) {
      return {
        valid: false,
        error: 'Windows系统不允许文件名包含以下字符: < > : " / \\ | ? *'
      };
    }

    // Windows不允许以空格或点结尾
    if (trimmedName.endsWith(' ') || trimmedName.endsWith('.')) {
      return {
        valid: false,
        error: 'Windows系统不允许文件名以空格或点结尾'
      };
    }
  } else {
    // Unix/Linux/macOS系统检查
    const unixInvalid = /[/\0]/;
    if (unixInvalid.test(trimmedName)) {
      return {
        valid: false,
        error: '文件名不能包含 / 或空字符'
      };
    }
  }

  // 通用检查 - 控制字符
  const controlChars = /[\x00-\x1f\x7f]/;
  if (controlChars.test(trimmedName)) {
    return {
      valid: false,
      error: '文件名不能包含控制字符'
    };
  }

  return {
    valid: true,
    error: null
  };
}

/**
 * 跨平台项目名称格式化
 * @param {string} name 原始名称
 * @returns {string} 格式化后的名称
 */
function formatProjectName(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')  // 替换非法字符为连字符
    .replace(/-+/g, '-')          // 合并多个连字符
    .replace(/^-|-$/g, '');       // 移除首尾连字符
}

/**
 * 获取系统信息
 */
function getSystemInfo() {
  return {
    platform: os.platform(),
    arch: os.arch(),
    osName: getOSName(),
    nodeVersion: process.version,
    homeDir: getHomeDir(),
    tempDir: getTempDir(),
    pathSeparator: path.sep,
    pathDelimiter: path.delimiter
  };
}

/**
 * 跨平台命令执行提示
 * @param {string} command 命令
 * @returns {string} 格式化的命令提示
 */
function formatCommand(command) {
  if (isWindows()) {
    // Windows可能需要不同的命令格式
    return command.replace(/^npm/, 'npm.cmd');
  }
  return command;
}

/**
 * 获取换行符
 */
function getEOL() {
  return os.EOL;
}

/**
 * 跨平台环境变量处理
 * @param {string} name 环境变量名
 * @param {string} defaultValue 默认值
 * @returns {string} 环境变量值
 */
function getEnvVar(name, defaultValue = '') {
  return process.env[name] || defaultValue;
}

/**
 * 显示平台信息（调试用）
 */
function showPlatformInfo() {
  const info = getSystemInfo();
  console.log(chalk.blue('🖥️  系统信息:'));
  console.log(chalk.gray(`  操作系统: ${info.osName} (${info.platform})`));
  console.log(chalk.gray(`  架构: ${info.arch}`));
  console.log(chalk.gray(`  Node.js版本: ${info.nodeVersion}`));
  console.log(chalk.gray(`  路径分隔符: "${info.pathSeparator}"`));
  console.log(chalk.gray(`  主目录: ${info.homeDir}`));
  console.log();
}

module.exports = {
  // 系统检测
  isWindows,
  isMacOS,
  isLinux,
  getOSName,
  
  // 路径处理
  normalizePath,
  joinPath,
  resolvePath,
  getHomeDir,
  getTempDir,
  
  // 文件名处理
  validateFileName,
  formatProjectName,
  
  // 系统信息
  getSystemInfo,
  showPlatformInfo,
  
  // 工具函数
  formatCommand,
  getEOL,
  getEnvVar
};
