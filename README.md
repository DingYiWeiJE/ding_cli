# 个人实现脚手架的笔记

## 项目简介

`@dingyiwei/ding-cli` 是一个用于快速创建React和Vue项目的前端脚手架工具。通过简单的命令行操作，可以快速生成基于现有模板的项目结构。

**注意**: 由于 `ding-cli` 包名已被占用，我们使用作用域包名 `@dingyiwei/ding-cli`。

## 脚手架实现原理和学习笔记

### 1. 脚手架的基本概念
脚手架（Scaffold）是一种快速生成项目基础代码的工具，它可以帮助开发者：
- 快速搭建项目结构
- 统一团队开发规范
- 减少重复性工作
- 提高开发效率

### 2. 技术栈选择
- **Commander.js**: 用于构建命令行界面，处理命令和参数
- **Inquirer.js**: 提供交互式命令行用户界面
- **Chalk**: 为终端输出添加颜色和样式
- **Ora**: 提供加载动画效果
- **fs-extra**: 增强的文件系统操作
- **download-git-repo**: 从Git仓库下载模板

### 3. 项目结构设计
```
ding-cli/
├── bin/           # 可执行文件
│   └── index.js   # CLI入口文件 (#!/usr/bin/env node)
├── lib/           # 核心逻辑
│   ├── create.js  # 项目创建逻辑
│   └── utils.js   # 工具函数
├── package.json   # 项目配置和依赖
├── .gitignore     # Git忽略文件
├── README.md      # 详细文档和学习笔记
└── USAGE.md       # 快速使用指南
```

**实际创建的文件结构:**
- `bin/index.js` - CLI命令行入口，处理命令解析
- `lib/create.js` - 核心创建逻辑，包含模板下载和项目初始化
- `lib/utils.js` - 工具函数库，包含验证和日志功能
- `package.json` - 项目配置，定义了bin字段指向CLI入口
- `.gitignore` - 标准Node.js项目忽略文件
- `USAGE.md` - 快速上手指南

### 4. 核心功能实现

#### 4.1 命令行解析
使用Commander.js定义命令：
- `create <project-name>`: 创建新项目
- `init`: 在当前目录初始化项目
- 支持 `-t, --template` 参数指定模板类型

#### 4.2 交互式选择
使用Inquirer.js实现：
- 模板选择（React/Vue）
- 覆盖确认
- 项目配置选项

#### 4.3 模板下载
使用download-git-repo从GitHub下载模板：
- React模板: `DingYiWeiJE/EvayWeb`
- Vue模板: `DingYiWeiJE/EvayVue`

#### 4.4 文件处理
- 检查目录是否存在
- 创建项目目录
- 更新package.json中的项目名称
- 提供后续操作指引

### 5. 开发过程中的关键点

#### 5.1 可执行文件配置
在package.json中配置bin字段：
```json
{
  "bin": {
    "ding-cli": "./bin/index.js"
  }
}
```

在入口文件添加shebang：
```javascript
#!/usr/bin/env node
```

#### 5.2 错误处理
- 网络错误处理
- 文件操作错误处理
- 用户输入验证
- 优雅的错误提示

#### 5.3 用户体验优化
- 彩色输出提示
- 加载动画
- 清晰的操作指引
- 友好的错误信息

## 安装和使用

### 本地开发测试
```bash
# 安装依赖
npm install

# 本地链接（用于测试）
npm link

# 测试命令
ding-cli create my-project
ding-cli create my-vue-project -t vue
```

### 发布到npm的完整流程

#### 5.1 准备发布前的检查
```bash
# 1. 确保代码已提交到Git
git add .
git commit -m "feat: 完成脚手架基础功能"
git push origin main

# 2. 检查package.json配置
# - name: 确保包名唯一（可在npmjs.com搜索确认）
# - version: 遵循语义化版本规范
# - description: 清晰描述包的功能
# - keywords: 添加相关关键词便于搜索
# - author: 作者信息
# - license: 开源协议
# - repository: Git仓库地址
# - bugs: 问题反馈地址
# - homepage: 项目主页

# 3. 测试包的完整性
npm pack --dry-run
```

#### 5.2 npm账户准备
```bash
# 1. 注册npm账户（如果没有）
# 访问 https://www.npmjs.com/signup

# 2. 验证邮箱
# 检查邮箱并点击验证链接

# 3. 本地登录npm
npm login
# 输入用户名、密码、邮箱
# 可能需要输入OTP（如果开启了两步验证）

# 4. 验证登录状态
npm whoami
```

#### 5.3 发布流程
```bash
# 1. 最终测试
npm test  # 如果有测试脚本
npm run build  # 如果有构建脚本

# 2. 检查要发布的文件
npm pack --dry-run
# 查看哪些文件会被包含在发布包中

# 3. 发布到npm
# 作用域包默认是私有的，需要添加--access public参数
npm publish --access public

# 4. 验证发布成功
npm view @dingyiwei/ding-cli
# 或访问 https://www.npmjs.com/package/@dingyiwei/ding-cli
```

#### 5.4 版本管理和更新发布
```bash
# 1. 修复bug后发布补丁版本
npm version patch  # 1.0.0 -> 1.0.1
npm publish

# 2. 添加新功能后发布次版本
npm version minor  # 1.0.1 -> 1.1.0
npm publish

# 3. 重大更改后发布主版本
npm version major  # 1.1.0 -> 2.0.0
npm publish

# 4. 预发布版本
npm version prerelease --preid=beta  # 1.0.0 -> 1.0.1-beta.0
npm publish --tag beta
```

#### 5.5 发布后的维护
```bash
# 1. 查看包的下载统计
npm view @dingyiwei/ding-cli

# 2. 查看包的依赖关系
npm view @dingyiwei/ding-cli dependencies

# 3. 撤销发布（仅限发布后24小时内）
npm unpublish @dingyiwei/ding-cli@1.0.0

# 4. 废弃某个版本
npm deprecate @dingyiwei/ding-cli@1.0.0 "请使用最新版本"
```

#### 5.6 发布前检查清单
```bash
# 1. 检查包名是否可用
npm view @dingyiwei/ding-cli
# 如果返回404，说明包名可用

# 2. 测试本地安装
npm pack
npm install -g dingyiwei-ding-cli-1.0.0.tgz
ding-cli --version
ding-cli create test-project
npm uninstall -g @dingyiwei/ding-cli
rm dingyiwei-ding-cli-1.0.0.tgz

# 3. 检查发布文件
npm pack --dry-run
```

**发布检查清单:**
- [ ] **包名唯一性**: 确保包名在npm上未被占用（使用作用域包 @username/package-name 避免冲突）
- [ ] **语义化版本**: 遵循semver规范 (major.minor.patch)
- [ ] **文件过滤**: 使用.npmignore或package.json的files字段控制发布内容
- [ ] **安全性**: 不要在代码中包含敏感信息（API密钥、密码等）
- [ ] **文档完整**: 确保README.md包含安装和使用说明
- [ ] **许可证**: 明确开源许可证类型
- [ ] **仓库信息**: repository、bugs、homepage字段完整
- [ ] **关键词**: keywords数组包含相关搜索词
- [ ] **Node版本**: engines字段指定支持的Node.js版本
- [ ] **本地测试**: 完整测试CLI功能
- [ ] **Git提交**: 所有更改已提交并推送到远程仓库

#### 5.7 自动化发布脚本
为了简化发布流程，项目包含了自动化发布脚本：

```bash
# 使用发布脚本（推荐）
./scripts/publish.sh patch   # 发布补丁版本 (1.0.0 -> 1.0.1)
./scripts/publish.sh minor   # 发布次版本 (1.0.0 -> 1.1.0)  
./scripts/publish.sh major   # 发布主版本 (1.0.0 -> 2.0.0)

# 脚本会自动执行以下步骤:
# 1. 检查Git状态和分支
# 2. 拉取最新代码
# 3. 安装依赖和运行测试
# 4. 检查发布内容
# 5. 更新版本号
# 6. 提交并创建Git标签
# 7. 推送到远程仓库
# 8. 发布到npm
# 9. 验证发布结果
```

#### 5.8 发布后推广
```bash
# 1. 创建GitHub Release
# 在GitHub仓库页面创建新的Release，包含版本说明

# 2. 社交媒体分享
# 在技术社区分享你的脚手架工具

# 3. 收集反馈
# 关注GitHub Issues和npm下载统计

# 4. 持续改进
# 根据用户反馈持续优化功能
```

## 使用方法

### 创建新项目
```bash
# 创建React项目
ding-cli create my-react-app

# 创建Vue项目
ding-cli create my-vue-app -t vue

# 交互式选择模板
ding-cli create my-project
```

### 在当前目录初始化
```bash
# 在当前目录初始化React项目
ding-cli init

# 在当前目录初始化Vue项目
ding-cli init -t vue
```

### 查看帮助
```bash
ding-cli --help
ding-cli -v
```

## 模板仓库

- **React模板**: https://github.com/DingYiWeiJE/EvayWeb.git
- **Vue模板**: https://github.com/DingYiWeiJE/EvayVue.git

## 扩展功能思路

1. **多模板支持**: 添加更多框架模板（Angular、Svelte等）
2. **自定义模板**: 支持用户自定义模板仓库
3. **插件系统**: 支持插件扩展功能
4. **配置文件**: 支持配置文件自定义默认选项
5. **版本管理**: 支持模板版本选择
6. **本地缓存**: 缓存已下载的模板提高速度

## 学习收获

通过实现这个脚手架工具，学到了：
1. Node.js命令行工具开发
2. npm包的创建和发布流程
3. 用户交互设计的重要性
4. 错误处理和用户体验优化
5. 模块化代码组织
6. Git仓库作为模板源的使用方法