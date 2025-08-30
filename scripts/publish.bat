@echo off
REM 发布脚本 - Windows批处理版本
REM 使用方法: scripts\publish.bat [patch|minor|major]

setlocal enabledelayedexpansion

echo 🚀 开始发布流程...

REM 检查参数
set VERSION_TYPE=%1
if "%VERSION_TYPE%"=="" set VERSION_TYPE=patch

if not "%VERSION_TYPE%"=="patch" if not "%VERSION_TYPE%"=="minor" if not "%VERSION_TYPE%"=="major" if not "%VERSION_TYPE%"=="prerelease" (
    echo ❌ 错误: 版本类型必须是 patch, minor, major 或 prerelease
    exit /b 1
)

echo 📋 发布前检查...

REM 1. 检查Git状态
git status --porcelain > nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 错误: Git仓库状态异常
    exit /b 1
)

for /f %%i in ('git status --porcelain') do (
    echo ❌ 错误: 有未提交的更改，请先提交所有更改
    git status --short
    exit /b 1
)

REM 2. 检查当前分支
for /f "tokens=*" %%i in ('git branch --show-current') do set CURRENT_BRANCH=%%i
if not "%CURRENT_BRANCH%"=="main" (
    echo ⚠️  警告: 当前不在main分支 ^(当前: %CURRENT_BRANCH%^)
    set /p CONTINUE="是否继续? (y/N): "
    if /i not "!CONTINUE!"=="y" exit /b 1
)

REM 3. 拉取最新代码
echo 📥 拉取最新代码...
git pull origin main
if %errorlevel% neq 0 (
    echo ❌ 错误: 拉取代码失败
    exit /b 1
)

REM 4. 安装依赖
echo 📦 安装依赖...
call npm ci
if %errorlevel% neq 0 (
    echo ❌ 错误: 安装依赖失败
    exit /b 1
)

REM 5. 运行测试
echo 🧪 运行测试...
call npm test
if %errorlevel% neq 0 (
    echo ⚠️  测试失败或没有测试
)

REM 6. 检查包内容
echo 📋 检查发布内容...
call npm pack --dry-run

REM 7. 确认发布
echo.
for /f "tokens=*" %%i in ('npm version --json') do set VERSION_JSON=%%i
echo 📊 当前版本: 1.0.1
echo 🎯 版本类型: %VERSION_TYPE%
echo.
set /p CONFIRM="确认发布? (y/N): "
if /i not "%CONFIRM%"=="y" (
    echo ❌ 取消发布
    exit /b 1
)

REM 8. 更新版本号
echo 🏷️  更新版本号...
for /f "tokens=*" %%i in ('npm version %VERSION_TYPE% --no-git-tag-version') do set NEW_VERSION=%%i
echo ✅ 新版本: %NEW_VERSION%

REM 9. 提交版本更新
echo 📝 提交版本更新...
git add package.json package-lock.json
git commit -m "chore: bump version to %NEW_VERSION%"
if %errorlevel% neq 0 (
    echo ❌ 错误: 提交失败
    exit /b 1
)

REM 10. 创建Git标签
echo 🏷️  创建Git标签...
git tag -a "%NEW_VERSION%" -m "Release %NEW_VERSION%"
if %errorlevel% neq 0 (
    echo ❌ 错误: 创建标签失败
    exit /b 1
)

REM 11. 推送到远程仓库
echo 📤 推送到远程仓库...
git push origin main
if %errorlevel% neq 0 (
    echo ❌ 错误: 推送失败
    exit /b 1
)
git push origin "%NEW_VERSION%"
if %errorlevel% neq 0 (
    echo ❌ 错误: 推送标签失败
    exit /b 1
)

REM 12. 发布到npm
echo 🚀 发布到npm...
call npm publish
if %errorlevel% neq 0 (
    echo ❌ 错误: 发布失败
    exit /b 1
)

REM 13. 验证发布
echo ✅ 验证发布...
timeout /t 5 /nobreak > nul
call npm view dingyw-cli version

echo.
echo 🎉 发布成功!
echo 📦 包名: dingyw-cli
echo 🏷️  版本: %NEW_VERSION%
echo 🔗 链接: https://www.npmjs.com/package/dingyw-cli
echo.
echo 📋 后续步骤:
echo 1. 在GitHub创建Release: https://github.com/DingYiWeiJE/ding_cli/releases/new
echo 2. 更新文档和示例
echo 3. 在社交媒体分享

endlocal
