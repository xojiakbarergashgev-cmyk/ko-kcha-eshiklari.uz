#!/bin/bash
# «Ko'kcha Eshiklar» Telegram Bot Launcher
DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" >/dev/null 2>&1 && pwd)"
cd "$DIR"

# Node binary ni aniqlash
NODE_CMD=""
if command -v node >/dev/null 2>&1; then
    NODE_CMD="node"
elif [ -f "/Applications/Antigravity IDE.app/Contents/MacOS/Electron" ]; then
    NODE_CMD='ELECTRON_RUN_AS_NODE=1 "/Applications/Antigravity IDE.app/Contents/MacOS/Electron"'
fi

if [ -n "$NODE_CMD" ]; then
    eval "$NODE_CMD bot.js"
else
    echo "Node.js topilmadi."
    exit 1
fi
