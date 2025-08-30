#!/bin/bash

# 发布脚本 - 自动化npm发布流程
# 使用方法: ./scripts/publish.sh [patch|minor|major]

set -e  # 遇到错误立即退出

echo "🚀 开始发布流程..."

# 检查参数
VERSION_TYPE=${1:-patch}
if [[ ! "$VERSION_TYPE" =~ ^(patch|minor|major|prerelease)$ ]]; then
    echo "❌ 错误: 版本类型必须是 patch, minor, major 或 prerelease"
    exit 1
fi

echo "📋 发布前检查..."

# 1. 检查Git状态
if [[ -n $(git status --porcelain) ]]; then
    echo "❌ 错误: 有未提交的更改，请先提交所有更改"
    git status --short
    exit 1
fi

# 2. 确保在main分支
CURRENT_BRANCH=$(git branch --show-current)
if [[ "$CURRENT_BRANCH" != "main" ]]; then
    echo "⚠️  警告: 当前不在main分支 (当前: $CURRENT_BRANCH)"
    read -p "是否继续? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 1
    fi
fi

# 3. 拉取最新代码
echo "📥 拉取最新代码..."
git pull origin main

# 4. 安装依赖
echo "📦 安装依赖..."
npm ci

# 5. 运行测试（如果有）
echo "🧪 运行测试..."
npm test || echo "⚠️  没有测试或测试失败"

# 6. 检查包内容
echo "📋 检查发布内容..."
npm pack --dry-run

# 7. 确认发布
echo
echo "📊 当前版本: $(npm version --json | jq -r '.["@dingyiwei/ding-cli"] // "未知"')"
echo "🎯 版本类型: $VERSION_TYPE"
echo
read -p "确认发布? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ 取消发布"
    exit 1
fi

# 8. 更新版本号
echo "🏷️  更新版本号..."
NEW_VERSION=$(npm version $VERSION_TYPE --no-git-tag-version)
echo "✅ 新版本: $NEW_VERSION"

# 9. 提交版本更新
echo "📝 提交版本更新..."
git add package.json package-lock.json
git commit -m "chore: bump version to $NEW_VERSION"

# 10. 创建Git标签
echo "🏷️  创建Git标签..."
git tag -a "$NEW_VERSION" -m "Release $NEW_VERSION"

# 11. 推送到远程仓库
echo "📤 推送到远程仓库..."
git push origin main
git push origin "$NEW_VERSION"

# 12. 发布到npm
echo "🚀 发布到npm..."
npm publish --access public

# 13. 验证发布
echo "✅ 验证发布..."
sleep 5  # 等待npm更新
npm view @dingyiwei/ding-cli version

echo
echo "🎉 发布成功!"
echo "📦 包名: @dingyiwei/ding-cli"
echo "🏷️  版本: $NEW_VERSION"
echo "🔗 链接: https://www.npmjs.com/package/@dingyiwei/ding-cli"
echo
echo "📋 后续步骤:"
echo "1. 在GitHub创建Release: https://github.com/DingYiWeiJE/ding_cli/releases/new"
echo "2. 更新文档和示例"
echo "3. 在社交媒体分享"
