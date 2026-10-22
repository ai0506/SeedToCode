#!/bin/sh
# 截 App 窗口在屏幕上的真实画面（不是程序内部的离屏绘制）。
# 用法：native/macos/scripts/shot.sh <输出.png> [App 参数…]
#   例：shot.sh /tmp/lab.png --native-lab --lab-demo debug
# 原理：App 带 --hold 启动、把窗口号打到 stderr，这里等它画好后 screencapture -l。
set -eu
OUT=$1; shift
HERE=$(cd "$(dirname "$0")/.." && pwd)
LOG=$(mktemp)
"$HERE/build/SeedToCodeProto.app/Contents/MacOS/SeedToCodeProto" "$@" --hold 5 2>"$LOG" &
PID=$!
WID=""
for _ in 1 2 3 4 5 6 7 8 9 10; do
  sleep 0.3
  WID=$(grep -m1 '^WINDOW ' "$LOG" | awk '{print $2}' || true)
  [ -n "$WID" ] && break
done
[ -n "$WID" ] || { echo "没拿到窗口号" >&2; kill $PID 2>/dev/null; exit 1; }
sleep "${SHOT_DELAY:-3}"
screencapture -x -o -l "$WID" "$OUT"
kill $PID 2>/dev/null || true
rm -f "$LOG"
echo "$OUT"
