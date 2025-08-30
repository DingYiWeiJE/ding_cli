# 脚手架跨平台兼容性实现笔记

## 跨平台兼容性的重要性

脚手架工具需要在不同操作系统（Windows、macOS、Linux）上正常运行，主要面临以下挑战：

### 1. 路径分隔符差异
- **Windows**: 使用反斜杠 `\` 作为路径分隔符
- **Unix/Linux/macOS**: 使用正斜杠 `/` 作为路径分隔符
- **解决方案**: 使用 Node.js 的 `path` 模块进行路径处理

### 2. 换行符差异
- **Windows**: 使用 `\r\n` (CRLF)
- **Unix/Linux/macOS**: 使用 `\n` (LF)
- **解决方案**: 使用 `os.EOL` 或让Git自动处理

### 3. 可执行文件权限
- **Windows**: 不需要设置执行权限
- **Unix/Linux/macOS**: 需要设置执行权限 (`chmod +x`)
- **解决方案**: 在package.json中正确配置bin字段

### 4. 环境变量和命令差异
- **Windows**: 使用不同的环境变量语法和命令
- **Unix/Linux/macOS**: 标准的shell命令
- **解决方案**: 使用跨平台的npm包或条件判断

## 当前项目存在的跨平台问题

### 问题1: 路径处理不够规范
在 `lib/create.js` 中：
```javascript
const targetDir = path.resolve(process.cwd(), projectName);
```
这里使用了 `path.resolve()` 是正确的，但在其他地方可能存在硬编码路径。

### 问题2: 文件名验证不够完善
在 `lib/utils.js` 中的文件名验证：
```javascript
const invalidChars = /[<>:"/\\|?*]/;
```
这个正则表达式包含了Windows的非法字符，但没有考虑不同系统的具体限制。

### 问题3: 发布脚本只支持Unix系统
`scripts/publish.sh` 是bash脚本，在Windows上无法直接运行。

## 跨平台兼容性改进方案

### 1. 路径处理标准化
- 统一使用 `path` 模块的方法
- 避免硬编码路径分隔符
- 使用 `path.join()` 和 `path.resolve()` 构建路径

### 2. 操作系统检测
- 使用 `os.platform()` 检测操作系统
- 根据不同系统提供不同的处理逻辑

### 3. 文件名验证增强
- 针对不同操作系统使用不同的验证规则
- 提供更友好的错误提示

### 4. 命令行兼容性
- 使用跨平台的npm包替代系统命令
- 提供Windows批处理脚本作为bash脚本的替代

### 5. 环境变量处理
- 使用 `process.env` 安全地访问环境变量
- 提供默认值和错误处理

## 实现细节

### 路径处理工具函数
```javascript
const path = require('path');
const os = require('os');

// 标准化路径
function normalizePath(filePath) {
  return path.normalize(filePath);
}

// 安全地连接路径
function joinPath(...paths) {
  return path.join(...paths);
}

// 获取用户主目录
function getHomeDir() {
  return os.homedir();
}
```

### 操作系统检测
```javascript
const os = require('os');

function isWindows() {
  return os.platform() === 'win32';
}

function isMacOS() {
  return os.platform() === 'darwin';
}

function isLinux() {
  return os.platform() === 'linux';
}
```

### 文件名验证增强
```javascript
function isValidFileName(name) {
  if (!name || !name.trim()) return false;
  
  // Windows系统的额外限制
  if (isWindows()) {
    const windowsReserved = /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i;
    if (windowsReserved.test(name)) return false;
    
    // Windows不允许的字符
    const windowsInvalid = /[<>:"/\\|?*]/;
    if (windowsInvalid.test(name)) return false;
  }
  
  // 通用限制
  if (name.length > 255) return false;
  if (name.startsWith('.')) return false;
  
  return true;
}
```

## 测试跨平台兼容性

### 1. 本地测试
- 在不同操作系统上测试CLI工具
- 验证路径处理是否正确
- 检查文件创建和权限设置

### 2. CI/CD测试
- 在GitHub Actions中配置多操作系统测试
- 包括Windows、macOS、Linux环境
- 自动化测试所有核心功能

### 3. 用户反馈
- 收集不同平台用户的使用反馈
- 及时修复平台特定的问题

## 最佳实践总结

1. **始终使用path模块**: 避免硬编码路径分隔符
2. **操作系统检测**: 根据平台提供不同的处理逻辑
3. **文件名验证**: 考虑不同系统的文件名限制
4. **错误处理**: 提供平台特定的错误信息
5. **测试覆盖**: 在多个平台上测试功能
6. **文档说明**: 在文档中说明平台兼容性
7. **渐进增强**: 优先支持主流平台，逐步扩展

通过这些改进，脚手架工具可以在不同操作系统上提供一致的用户体验。

## 具体实现

### 1. 创建跨平台工具模块 (lib/platform.js)

我们创建了一个专门的跨平台兼容性模块，包含以下功能：

#### 系统检测函数
```javascript
function isWindows() {
  return os.platform() === 'win32';
}

function isMacOS() {
  return os.platform() === 'darwin';
}

function isLinux() {
  return os.platform() === 'linux';
}
```

#### 路径处理函数
```javascript
function normalizePath(filePath) {
  return path.normalize(filePath);
}

function joinPath(...paths) {
  return path.join(...paths);
}

function resolvePath(...paths) {
  return path.resolve(...paths);
}
```

#### 跨平台文件名验证
```javascript
function validateFileName(name) {
  // Windows系统特殊检查
  if (isWindows()) {
    // 检查Windows保留名称
    const windowsReserved = /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])$/i;
    if (windowsReserved.test(name)) {
      return { valid: false, error: '是Windows系统保留名称' };
    }
    
    // 检查Windows不允许的字符
    const windowsInvalid = /[<>:"/\\|?*]/;
    if (windowsInvalid.test(name)) {
      return { valid: false, error: 'Windows系统不允许的字符' };
    }
  }
  
  return { valid: true, error: null };
}
```

### 2. 更新现有代码使用跨平台模块

#### 在create.js中的改进
- 使用 `platform.resolvePath()` 替代 `path.resolve()`
- 使用 `platform.joinPath()` 替代 `path.join()`
- 添加项目名称验证
- 使用平台特定的换行符 `platform.getEOL()`
- 添加Windows特定的提示信息

#### 在utils.js中的改进
- 使用跨平台的文件名验证函数
- 返回详细的错误信息而不是简单的布尔值

### 3. 跨平台发布脚本

#### Unix/Linux/macOS: scripts/publish.sh
- 使用bash脚本
- 支持颜色输出和交互式确认
- 完整的错误处理

#### Windows: scripts/publish.bat
- 使用批处理脚本
- 等效的功能实现
- Windows特定的命令语法

### 4. 平台特定优化

#### Windows优化
```javascript
// 命令格式化
function formatCommand(command) {
  if (isWindows()) {
    return command.replace(/^npm/, 'npm.cmd');
  }
  return command;
}

// 特殊提示
if (platform.isWindows()) {
  logWarning('Windows用户注意: 如果遇到权限问题，请以管理员身份运行命令行');
}
```

#### 文件系统处理
```javascript
// 使用平台特定的换行符
await fs.writeJson(packageJsonPath, packageJson, { 
  spaces: 2,
  EOL: platform.getEOL()
});
```

### 5. 调试和诊断功能

添加了调试模式，可以显示系统信息：
```javascript
// 设置环境变量启用调试
// DEBUG=1 dingyw-cli create my-project

if (process.env.DEBUG) {
  platform.showPlatformInfo();
}
```

显示内容包括：
- 操作系统名称和版本
- 系统架构
- Node.js版本
- 路径分隔符
- 主目录路径

### 6. 错误处理改进

#### 详细的错误信息
```javascript
// 之前: 简单的布尔值
function isValidProjectName(name) {
  return true/false;
}

// 现在: 详细的错误信息
function isValidProjectName(name) {
  return {
    valid: boolean,
    error: string  // 具体的错误描述
  };
}
```

#### 平台特定的错误提示
- Windows: 提示管理员权限问题
- 所有平台: 提供具体的文件名限制说明

### 7. 测试跨平台兼容性

#### 本地测试方法
```bash
# 测试不同的项目名称
dingyw-cli create "test-project"     # 正常名称
dingyw-cli create "CON"              # Windows保留名称
dingyw-cli create "test/project"     # 包含路径分隔符
dingyw-cli create "test<>project"    # Windows非法字符

# 启用调试模式
DEBUG=1 dingyw-cli create test-project
```

#### CI/CD测试配置
可以在GitHub Actions中配置多平台测试：
```yaml
strategy:
  matrix:
    os: [ubuntu-latest, windows-latest, macos-latest]
    node-version: [14, 16, 18]
```

### 8. 性能优化

#### 懒加载平台检测
```javascript
// 只在需要时检测平台
let _isWindows = null;
function isWindows() {
  if (_isWindows === null) {
    _isWindows = os.platform() === 'win32';
  }
  return _isWindows;
}
```

#### 缓存系统信息
避免重复调用系统API获取相同信息。

## 跨平台兼容性验证清单

- [x] 路径处理使用Node.js path模块
- [x] 文件名验证考虑不同系统限制
- [x] 提供Windows和Unix两套发布脚本
- [x] 命令行输出使用平台特定格式
- [x] 错误信息包含平台相关提示
- [x] 支持调试模式显示系统信息
- [x] 使用平台特定的换行符
- [x] 处理Windows权限问题提示

## 后续改进方向

1. **CI/CD集成**: 在多个平台上自动测试
2. **更多平台支持**: 考虑FreeBSD等其他Unix系统
3. **性能监控**: 收集不同平台的性能数据
4. **用户反馈**: 建立平台特定问题的反馈机制
5. **文档完善**: 为每个平台提供详细的使用说明
