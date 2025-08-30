# ding-cli 使用指南

## 快速开始

### 1. 安装脚手架工具
```bash
# 克隆项目
git clone <your-repo-url>
cd ding_cli

# 安装依赖
npm install

# 全局链接（用于本地开发测试）
npm link
```

### 2. 创建新项目

#### 创建React项目
```bash
# 基本用法
ding-cli create my-react-app

# 指定React模板
ding-cli create my-react-app -t react
```

#### 创建Vue项目
```bash
ding-cli create my-vue-app -t vue
```

#### 交互式创建
```bash
# 不指定模板，会提示选择
ding-cli create my-project
```

### 3. 在当前目录初始化项目

```bash
# 在当前目录初始化React项目
ding-cli init

# 在当前目录初始化Vue项目
ding-cli init -t vue
```

### 4. 查看帮助信息

```bash
# 查看所有命令
ding-cli --help

# 查看版本
ding-cli --version

# 查看特定命令帮助
ding-cli create --help
```

## 项目创建后的步骤

创建项目后，按照提示执行以下命令：

```bash
# 进入项目目录
cd your-project-name

# 安装依赖
npm install

# 启动开发服务器
npm start
```

## 模板说明

### React模板 (EvayWeb)
- 基于Create React App
- 包含TypeScript支持
- 预配置的开发环境
- 仓库地址: https://github.com/DingYiWeiJE/EvayWeb.git

### Vue模板 (EvayVue)
- 基于Vue CLI
- 现代Vue.js开发环境
- 仓库地址: https://github.com/DingYiWeiJE/EvayVue.git

## 常见问题

### Q: 如何添加自定义模板？
A: 修改 `lib/create.js` 中的 `templates` 对象，添加新的模板配置。

### Q: 如何发布到npm？
A: 
1. 登录npm: `npm login`
2. 发布: `npm publish`

### Q: 创建项目时网络错误怎么办？
A: 检查网络连接，确保可以访问GitHub。也可以尝试使用VPN或更换网络环境。

### Q: 如何卸载全局链接？
A: 运行 `npm unlink -g ding-cli`
