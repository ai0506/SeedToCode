#!/bin/sh
# 构建阶段 A 原型 .app：swift build + 组装 bundle + 打入 web/ 资源。
# 用法：native/macos/scripts/build-app.sh   产物：native/macos/build/SeedToCodeProto.app
#
# web/ 资源来自仓库根目录 npm run build 之后的同一份产物，不另存副本——
# 计划 §3「不同时加载来源不一致的 HTML 与 bundles」。这里不替你跑 npm run build，
# 只核对 bundle 存在；要最新的核心先在根目录构建。
set -eu
HERE=$(cd "$(dirname "$0")/.." && pwd)
ROOT=$(cd "$HERE/../.." && pwd)
APP="$HERE/build/SeedToCodeProto.app"

for f in language-engine.js runtime-engine.js storage.js teaching-content.js assignment-core.js exercise-engine.js; do
  [ -f "$ROOT/web/js/$f" ] || { echo "缺少 web/js/$f，先在仓库根目录运行 npm run build" >&2; exit 1; }
done

swift build -c release --package-path "$HERE"
BIN=$(swift build -c release --package-path "$HERE" --show-bin-path)/SeedToCodeProto

rm -rf "$APP"
mkdir -p "$APP/Contents/MacOS" "$APP/Contents/Resources"
cp "$BIN" "$APP/Contents/MacOS/SeedToCodeProto"

# 只打学生会用到的页面与资源。排除：开发诊断页（cookie-check）、版式参照页
# （teaching-template，喂的是占位课程）、目录说明。
rsync -a --delete \
  --exclude 'cookie-check.html' --exclude 'teaching-template.html' --exclude 'README.md' --exclude '.DS_Store' \
  "$ROOT/web/" "$APP/Contents/Resources/web/"

# 原生实验室用的网页规范（关键字、模板、出厂样例、配色）：现导，不留副本。
node "$HERE/scripts/export-web-spec.mjs" "$APP/Contents/Resources/web-spec.json"

# 资源清单：版本 + 每个文件的哈希，供以后「完整版本切换」核对，也让人一眼看出打进去的是哪一份。
( cd "$APP/Contents/Resources/web" && find . -type f | LC_ALL=C sort | xargs shasum -a 256 ) > "$APP/Contents/Resources/web-manifest.sha256"
GIT_REV=$(git -C "$ROOT" rev-parse --short HEAD 2>/dev/null || echo unknown)
GIT_DIRTY=$(git -C "$ROOT" status --porcelain -- web packages 2>/dev/null | head -1)
[ -n "$GIT_DIRTY" ] && GIT_REV="$GIT_REV-dirty"

cat > "$APP/Contents/Info.plist" <<PLIST
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>CFBundleIdentifier</key><string>com.ai0506.seedtocode.proto</string>
  <key>CFBundleName</key><string>SeedToCodeProto</string>
  <key>CFBundleDisplayName</key><string>SeedToCode（原型）</string>
  <key>CFBundleExecutable</key><string>SeedToCodeProto</string>
  <key>CFBundlePackageType</key><string>APPL</string>
  <key>CFBundleShortVersionString</key><string>0.0.1</string>
  <key>CFBundleVersion</key><string>1</string>
  <key>SeedToCodeWebRevision</key><string>$GIT_REV</string>
  <key>LSMinimumSystemVersion</key><string>15.0</string>
  <key>NSHighResolutionCapable</key><true/>
  <key>NSPrincipalClass</key><string>NSApplication</string>
</dict>
</plist>
PLIST

# ad-hoc 签名：WebKit 的持久化 store 和沙盒外的本机运行需要一个稳定的代码身份。
# 这不是分发签名，公证与沙盒权限留到计划 §10 第 5 步。
codesign --force --sign - "$APP" >/dev/null
echo "$APP ($GIT_REV)"
